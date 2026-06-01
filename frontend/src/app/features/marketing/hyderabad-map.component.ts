import { DecimalPipe } from "@angular/common";
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { getDisplayRouteLabel } from "../../shared/address-display.util";

export interface RouteMetrics {
  distanceKm: number;
  durationMin: number;
  from: string;
  to: string;
  airportInvolved: boolean;
  source: "ors" | "osrm" | "fallback";
}

interface Coordinate {
  lat: number;
  lng: number;
}

interface BBox {
  minLng: number;
  minLat: number;
  maxLng: number;
  maxLat: number;
}

@Component({
  selector: "motus-hyderabad-map",
  standalone: true,
  imports: [DecimalPipe],
  template: `
    <figure class="map-shell" aria-label="Hyderabad booking map">
      <iframe
        title="OpenStreetMap Hyderabad route"
        class="absolute inset-0 h-full w-full border-0"
        [src]="mapUrl"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
      ></iframe>

      <div class="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-slate-950/10"></div>
      <div class="pointer-events-none absolute inset-0 transition duration-700" [class.scale-[1.02]]="active || loading">
        @if (routePath) {
          <svg class="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <polyline class="map-route-line" [attr.points]="routePath" [class.map-route-line-active]="active"></polyline>
          </svg>
        } @else {
          <span class="map-route" [class.map-route-active]="active"></span>
        }

        <span class="map-marker" [style.left.%]="pickupPosition.x" [style.top.%]="pickupPosition.y">
          <span></span>
        </span>
        <span class="map-marker drop-marker" [style.left.%]="dropPosition.x" [style.top.%]="dropPosition.y">
          <span></span>
        </span>
      </div>

      <figcaption class="map-caption mapRouteCard">
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-600">Hyderabad route</p>
        <h2 class="mapRouteAddress mt-2 text-lg font-semibold tracking-[-0.03em] text-slate-950 sm:text-xl">{{ routeLabel }}</h2>
        <p class="mt-1 text-sm text-slate-500">
          @if (metrics) {
            {{ metrics.distanceKm | number:'1.0-1' }} km &bull; about {{ metrics.durationMin }} min
          } @else if (loading) {
            Updating route...
          } @else {
            Gachibowli, Banjara Hills, HITEC City, and Airport routes.
          }
        </p>
      </figcaption>
    </figure>
  `
})
export class HyderabadMapComponent implements OnChanges {
  private readonly sanitizer = inject(DomSanitizer);

  @Input() from = "";
  @Input() to = "";
  @Input() active = false;
  @Output() readonly routeMetrics = new EventEmitter<RouteMetrics>();

  loading = false;
  metrics: RouteMetrics | null = null;
  routePath = "";
  pickupPosition = { x: 29, y: 42 };
  dropPosition = { x: 67, y: 64 };

  private routeTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly hyderabadBBox: BBox = { minLng: 78.287, minLat: 17.2, maxLng: 78.62, maxLat: 17.555 };
  mapUrl: SafeResourceUrl = this.createMapUrl(this.hyderabadBBox);
  private readonly defaultPickup = { lat: 17.4401, lng: 78.3489 };
  private readonly defaultDrop = { lat: 17.2403, lng: 78.4294 };
  private readonly knownLocations: Record<string, Coordinate> = {
    gachibowli: { lat: 17.4401, lng: 78.3489 },
    "hitec city": { lat: 17.4486, lng: 78.3908 },
    hitex: { lat: 17.4716, lng: 78.3763 },
    madhapur: { lat: 17.4483, lng: 78.3915 },
    "banjara hills": { lat: 17.4126, lng: 78.4482 },
    jubilee: { lat: 17.4326, lng: 78.4071 },
    secunderabad: { lat: 17.4399, lng: 78.4983 },
    begumpet: { lat: 17.4447, lng: 78.4664 },
    airport: { lat: 17.2403, lng: 78.4294 },
    rgia: { lat: 17.2403, lng: 78.4294 },
    shamshabad: { lat: 17.2512, lng: 78.4377 }
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["from"] || changes["to"]) {
      this.scheduleRouteUpdate();
    }
  }

  get routeLabel(): string {
    return getDisplayRouteLabel(this.from, this.to);
  }

  private scheduleRouteUpdate(): void {
    if (this.routeTimer) {
      clearTimeout(this.routeTimer);
    }

    this.routeTimer = setTimeout(() => void this.updateRoute(), 550);
  }

  private async updateRoute(): Promise<void> {
    if (!this.from.trim() || !this.to.trim()) {
      this.metrics = null;
      this.routePath = "";
      this.mapUrl = this.createMapUrl(this.hyderabadBBox);
      return;
    }

    this.loading = true;

    try {
      const [start, end] = await Promise.all([this.resolveLocation(this.from), this.resolveLocation(this.to)]);
      const route = await this.fetchRoute(start, end);
      const bbox = this.createBBox([start, end, ...route.points]);

      this.mapUrl = this.createMapUrl(bbox, start, end);
      this.pickupPosition = this.project(start, bbox);
      this.dropPosition = this.project(end, bbox);
      this.routePath = route.points.map((point) => {
        const projected = this.project(point, bbox);
        return `${projected.x.toFixed(2)},${projected.y.toFixed(2)}`;
      }).join(" ");
      this.metrics = {
        distanceKm: route.distanceKm,
        durationMin: route.durationMin,
        from: this.from,
        to: this.to,
        airportInvolved: this.isAirportRoute(this.from, this.to),
        source: route.source
      };
      this.routeMetrics.emit(this.metrics);
    } catch {
      const fallback = this.createFallbackMetrics();
      this.metrics = fallback;
      this.routeMetrics.emit(fallback);
    } finally {
      this.loading = false;
    }
  }

  private async resolveLocation(query: string): Promise<Coordinate> {
    const normalized = query.toLowerCase();
    const known = Object.entries(this.knownLocations).find(([key]) => normalized.includes(key));

    if (known) {
      return known[1];
    }

    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=in&q=${encodeURIComponent(`${query}, Hyderabad`)}`);
    const results = await response.json() as Array<{ lat: string; lon: string }>;

    if (!results.length) {
      return normalized.includes("airport") ? this.defaultDrop : this.defaultPickup;
    }

    return { lat: Number(results[0].lat), lng: Number(results[0].lon) };
  }

  private async fetchRoute(start: Coordinate, end: Coordinate): Promise<{ distanceKm: number; durationMin: number; points: Coordinate[]; source: RouteMetrics["source"] }> {
    const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`);
    const json = await response.json() as {
      routes?: Array<{ distance: number; duration: number; geometry: { coordinates: Array<[number, number]> } }>;
    };
    const route = json.routes?.[0];

    if (!route) {
      throw new Error("Route unavailable");
    }

    return {
      distanceKm: route.distance / 1000,
      durationMin: Math.max(1, Math.round(route.duration / 60)),
      points: route.geometry.coordinates.map(([lng, lat]) => ({ lat, lng })),
      source: "osrm"
    };
  }

  private createFallbackMetrics(): RouteMetrics {
    const airport = this.isAirportRoute(this.from, this.to);
    const distanceKm = airport ? 32 : 14;

    return {
      distanceKm,
      durationMin: airport ? 45 : 28,
      from: this.from,
      to: this.to,
      airportInvolved: airport,
      source: "fallback"
    };
  }

  private isAirportRoute(from: string, to: string): boolean {
    return /airport|rgia|shamshabad|rajiv gandhi/i.test(`${from} ${to}`);
  }

  private createBBox(points: Coordinate[]): BBox {
    const lngs = points.map((point) => point.lng);
    const lats = points.map((point) => point.lat);
    const padLng = Math.max(0.025, (Math.max(...lngs) - Math.min(...lngs)) * 0.28);
    const padLat = Math.max(0.025, (Math.max(...lats) - Math.min(...lats)) * 0.28);

    return {
      minLng: Math.min(...lngs) - padLng,
      minLat: Math.min(...lats) - padLat,
      maxLng: Math.max(...lngs) + padLng,
      maxLat: Math.max(...lats) + padLat
    };
  }

  private project(point: Coordinate, bbox: BBox): { x: number; y: number } {
    const x = ((point.lng - bbox.minLng) / (bbox.maxLng - bbox.minLng)) * 100;
    const y = (1 - ((point.lat - bbox.minLat) / (bbox.maxLat - bbox.minLat))) * 100;

    return { x: Math.min(95, Math.max(5, x)), y: Math.min(95, Math.max(5, y)) };
  }

  private createMapUrl(bbox: BBox, start?: Coordinate, end?: Coordinate): SafeResourceUrl {
    const marker = end ?? start ?? { lat: 17.385, lng: 78.4867 };
    const url = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox.minLng}%2C${bbox.minLat}%2C${bbox.maxLng}%2C${bbox.maxLat}&layer=mapnik&marker=${marker.lat}%2C${marker.lng}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
