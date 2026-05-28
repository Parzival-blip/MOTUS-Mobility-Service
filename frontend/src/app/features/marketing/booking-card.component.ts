import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { RouteMetrics } from "./hyderabad-map.component";

export interface BookingRouteState {
  from: string;
  to: string;
  expanded: boolean;
  submitted: boolean;
}

interface RideOption {
  value: "city-ride" | "inter-city" | "airport-transfer" | "rentals" | "bulk-booking";
  label: string;
}

interface FareEstimate {
  label: string;
  range: string;
  from: string;
  to: string;
  distance: string;
  duration: string;
  category: string;
}

@Component({
  selector: "motus-booking-card",
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule],
  template: `
    <form
      class="booking-card"
      [formGroup]="form"
      (ngSubmit)="findCabs()"
      aria-label="Book a MOTUS cab"
    >
      <div class="mb-6">
        <p class="text-sm font-semibold text-slate-500">Book your cab</p>
        <h2 class="mt-1 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Where to?</h2>
      </div>

      <div class="grid gap-3">
        <label class="premium-field">
          <span>Pickup</span>
          <input
            formControlName="from"
            placeholder="Gachibowli, Hyderabad"
            autocomplete="street-address"
            (input)="emitState()"
          >
          @if (showFieldError("from")) {
            <small>Pickup is required.</small>
          }
        </label>

        <label class="premium-field">
          <span>Destination</span>
          <input
            formControlName="to"
            placeholder="Rajiv Gandhi International Airport"
            autocomplete="street-address"
            (input)="emitState()"
          >
          @if (showFieldError("to")) {
            <small>Destination is required.</small>
          }
        </label>

        <div
          [attr.class]="expanded ? 'grid overflow-hidden transition-all duration-500 ease-out max-h-[28rem] opacity-100' : 'grid overflow-hidden transition-all duration-500 ease-out max-h-0 opacity-0'"
          [attr.aria-hidden]="expanded ? null : true"
          [attr.inert]="expanded ? null : ''"
        >
          <div class="grid gap-3 pt-1">
            <label class="premium-field">
              <span>Ride type</span>
              <select formControlName="rideType" (change)="emitState()">
                <option value="">Select ride type</option>
                @for (ride of availableRideTypes; track ride.value) {
                  <option [value]="ride.value">{{ ride.label }}</option>
                }
              </select>
              @if (showFieldError("rideType")) {
                <small>Ride type is required.</small>
              }
            </label>

            <label class="premium-field">
              <span>Full name</span>
              <input formControlName="name" placeholder="Your name" autocomplete="name">
              @if (showFieldError("name")) {
                <small>Name is required.</small>
              }
            </label>

            <label class="premium-field">
              <span>Phone number</span>
              <input formControlName="phone" placeholder="10 digit mobile number" inputmode="numeric" autocomplete="tel">
              @if (showFieldError("phone")) {
                <small>Enter a valid 10 digit phone number.</small>
              }
            </label>
          </div>
        </div>

        @if (!expanded) {
          <button mat-raised-button color="primary" type="button" class="premium-primary-button mt-2" (click)="expandBooking()">
            Book Now
          </button>
        } @else {
          <button mat-raised-button color="primary" type="submit" class="premium-primary-button mt-2" [disabled]="form.invalid">
            Book My Cab
          </button>
        }

        @if (showFormError) {
          <p class="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            Complete all required fields to continue.
          </p>
        }

        @if (fareEstimate) {
          <section class="fare-card" aria-live="polite">
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="text-sm font-semibold text-slate-500">Estimated Fare</p>
                <p class="mt-1 text-3xl font-semibold tracking-[-0.05em] text-slate-950">{{ fareEstimate.range }}</p>
              </div>
              <span class="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700">{{ fareEstimate.label }}</span>
            </div>
            <p class="mt-3 flex items-center gap-2 text-sm font-semibold text-slate-500">
              <span class="min-w-0 truncate">{{ fareEstimate.from }}</span>
              <span class="text-slate-300" aria-hidden="true">&rarr;</span>
              <span class="min-w-0 truncate">{{ fareEstimate.to }}</span>
            </p>
            <p class="mt-2 text-sm font-medium text-slate-600">
              {{ fareEstimate.distance }} &bull; {{ fareEstimate.duration }} &bull; {{ fareEstimate.category }}
            </p>
            <p class="mt-3 border-t border-slate-100 pt-3 text-xs leading-5 text-slate-400">
              Final fare may vary slightly based on traffic and timing.
            </p>
          </section>
        }
      </div>
    </form>
  `
})
export class BookingCardComponent implements OnChanges {
  private readonly fb = inject(FormBuilder);

  @Input() routeMetrics: RouteMetrics | null = null;
  @Output() readonly routeChange = new EventEmitter<BookingRouteState>();

  expanded = false;
  submitted = false;
  showFormError = false;
  fareEstimate: FareEstimate | null = null;

  private readonly rideTypes: RideOption[] = [
    { value: "city-ride", label: "City Ride" },
    { value: "inter-city", label: "Inter-city" },
    { value: "airport-transfer", label: "Airport Transfer" },
    { value: "rentals", label: "Rentals" },
    { value: "bulk-booking", label: "Bulk Booking" }
  ];

  readonly form = this.fb.nonNullable.group({
    from: ["", Validators.required],
    to: ["", Validators.required],
    rideType: ["", Validators.required],
    name: ["", Validators.required],
    phone: ["", [Validators.required, Validators.pattern(/^[0-9]{10}$/)]]
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["routeMetrics"]) {
      this.syncRideTypeWithContext();
      if (this.submitted) {
        this.fareEstimate = this.createFareEstimate();
      }
    }
  }

  get availableRideTypes(): RideOption[] {
    const { from, to } = this.form.getRawValue();
    const text = `${from} ${to}`.toLowerCase();
    const airport = this.isAirportText(text) || Boolean(this.routeMetrics?.airportInvolved);
    const distanceKm = this.routeMetrics?.distanceKm ?? this.estimateFallbackDistance(text);
    const options: RideOption[] = [];

    if (airport) {
      options.push(this.rideTypes.find((ride) => ride.value === "airport-transfer")!);
    }

    if (distanceKm > 40) {
      options.push(this.rideTypes.find((ride) => ride.value === "inter-city")!);
    }

    if (!airport && distanceKm <= 40) {
      options.push(this.rideTypes.find((ride) => ride.value === "city-ride")!);
    }

    if (!airport && distanceKm <= 25) {
      options.push(this.rideTypes.find((ride) => ride.value === "rentals")!);
    }

    if (/bulk|corporate|office|event|wedding|team|guest|employee/.test(text)) {
      options.push(this.rideTypes.find((ride) => ride.value === "bulk-booking")!);
    }

    return options.length ? this.uniqueRideOptions(options) : this.rideTypes.filter((ride) => ride.value !== "city-ride");
  }

  expandBooking(): void {
    this.submitted = false;
    this.form.controls.from.markAsTouched();
    this.form.controls.to.markAsTouched();

    if (this.form.controls.from.invalid || this.form.controls.to.invalid) {
      this.showFormError = true;
      this.emitState();
      return;
    }

    this.showFormError = false;
    this.expanded = true;
    this.emitState();
  }

  findCabs(): void {
    this.form.markAllAsTouched();
    this.showFormError = this.form.invalid;
    this.submitted = !this.form.invalid;
    this.fareEstimate = this.submitted ? this.createFareEstimate() : null;
    this.emitState(false);
  }

  showFieldError(controlName: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && (control.touched || this.showFormError);
  }

  emitState(resetSubmission = true): void {
    const { from, to } = this.form.getRawValue();
    if (resetSubmission) {
      this.submitted = false;
      this.fareEstimate = null;
    }
    this.syncRideTypeWithContext();
    this.routeChange.emit({ from, to, expanded: this.expanded, submitted: this.submitted });
  }

  private syncRideTypeWithContext(): void {
    const current = this.form.controls.rideType.value;
    const allowed = this.availableRideTypes.map((ride) => ride.value);

    if (current && !allowed.includes(current as RideOption["value"])) {
      this.form.controls.rideType.setValue("");
    }
  }

  private createFareEstimate(): FareEstimate {
    const { from, to, rideType } = this.form.getRawValue();
    const text = `${from} ${to}`.toLowerCase();
    const distanceKm = this.routeMetrics?.distanceKm ?? this.estimateFallbackDistance(text);
    const durationMin = this.routeMetrics?.durationMin ?? Math.max(18, Math.round(distanceKm * 2.2));
    const roundedKm = Math.max(1, Math.round(distanceKm));
    const route = {
      from: this.compactLocation(from, "Pickup"),
      to: this.compactLocation(to, "Destination")
    };

    if (rideType === "bulk-booking") {
      return {
        label: "Custom",
        range: "Custom pricing",
        ...route,
        distance: `Approx. ${roundedKm} km`,
        duration: `About ${durationMin} min`,
        category: "Bulk Booking"
      };
    }

    if (rideType === "rentals") {
      const range = roundedKm <= 40 ? "Rs. 1,599" : "Rs. 2,999";
      return {
        label: roundedKm <= 40 ? "4hr/40km" : "8hr/80km",
        range,
        ...route,
        distance: roundedKm <= 40 ? "Up to 40 km" : "Up to 80 km",
        duration: roundedKm <= 40 ? "4 hours" : "8 hours",
        category: "Sedan"
      };
    }

    if (rideType === "airport-transfer" || this.isAirportText(text)) {
      const low = Math.min(1200, Math.max(700, Math.round(650 + distanceKm * 12)));
      const high = Math.min(1400, Math.max(low + 120, Math.round(low + 220)));
      return {
        label: "Airport",
        range: `${this.formatRupee(low)} - ${this.formatRupee(high)}`,
        ...route,
        distance: `Approx. ${roundedKm} km`,
        duration: `About ${durationMin} min`,
        category: "Sedan"
      };
    }

    const perKmLow = rideType === "inter-city" ? 14 : 16;
    const perKmHigh = rideType === "inter-city" ? 18 : 20;
    const base = 120;
    const low = Math.round(base + distanceKm * perKmLow);
    const high = Math.round(base + distanceKm * perKmHigh);

    return {
      label: rideType === "inter-city" ? "Inter-city" : "City",
      range: `${this.formatRupee(low)} - ${this.formatRupee(high)}`,
      ...route,
      distance: `Approx. ${roundedKm} km`,
      duration: `About ${durationMin} min`,
      category: "Sedan"
    };
  }

  private isAirportText(text: string): boolean {
    return /airport|rgia|shamshabad|rajiv gandhi/.test(text);
  }

  private estimateFallbackDistance(text: string): number {
    if (this.isAirportText(text)) {
      return 32;
    }

    if (/secunderabad|shamshabad|patancheru|medchal|kompally/.test(text)) {
      return 42;
    }

    return 16;
  }

  private formatRupee(value: number): string {
    return `Rs. ${Math.round(value).toLocaleString("en-IN")}`;
  }

  private compactLocation(value: string, fallback: string): string {
    const normalized = value.trim().replace(/\s+/g, " ");
    return normalized || fallback;
  }

  private uniqueRideOptions(options: RideOption[]): RideOption[] {
    return options.filter((option, index, all) => all.findIndex((item) => item.value === option.value) === index);
  }
}
