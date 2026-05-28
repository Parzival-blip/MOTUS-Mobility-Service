import { Component } from "@angular/core";
import { PublicFooterComponent } from "../../shared/public-footer.component";
import { PublicHeaderComponent } from "../../shared/public-header.component";
import { BookingCardComponent, BookingRouteState } from "./booking-card.component";
import { HyderabadMapComponent, RouteMetrics } from "./hyderabad-map.component";

@Component({
  selector: "motus-marketing-page",
  standalone: true,
  imports: [PublicHeaderComponent, PublicFooterComponent, BookingCardComponent, HyderabadMapComponent],
  template: `
    <main class="min-h-screen bg-[#f7f8fa] text-[#111827]">
      <motus-public-header />

      <section id="home" class="relative px-4 pb-20 pt-28 sm:px-6 lg:pt-32">
        <div class="absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_18%_18%,rgba(6,182,212,0.14),transparent_24rem),radial-gradient(circle_at_82%_8%,rgba(37,99,235,0.10),transparent_26rem)]"></div>
        <div class="container relative grid items-center gap-10 lg:grid-cols-[0.88fr_1.12fr]">
          <div class="max-w-xl">
            <p class="text-sm font-semibold text-cyan-600">Premium cab booking in Hyderabad</p>
            <h1 class="mt-4 text-4xl font-semibold leading-[1.02] tracking-[-0.055em] text-slate-950 sm:text-5xl lg:text-6xl">
              A calmer way to book your ride.
            </h1>
            <p class="mt-5 max-w-lg text-base leading-7 text-slate-500">
              Fast pickup, verified drivers, clean cars, and a modern booking flow for city rides, airport transfers, rentals, and bulk bookings.
            </p>

            <div class="mt-8 max-w-md">
              <motus-booking-card [routeMetrics]="routeMetrics" (routeChange)="onRouteChange($event)" />
            </div>
          </div>

          <motus-hyderabad-map [from]="route.from" [to]="route.to" [active]="routeIsActive" (routeMetrics)="onRouteMetrics($event)" />
        </div>
      </section>

      <section id="why-motus" class="px-4 py-20 sm:px-6">
        <div class="container">
          <div class="mx-auto max-w-2xl text-center">
            <p class="text-sm font-semibold text-cyan-600">Why riders choose MOTUS</p>
            <h2 class="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">Premium without complexity.</h2>
          </div>

          <div class="mt-10 grid gap-4 md:grid-cols-3">
            @for (item of benefits; track item.title) {
              <article class="premium-card p-6">
                <span class="grid h-11 w-11 place-items-center rounded-2xl bg-cyan-50 text-sm font-semibold text-cyan-600">{{ item.icon }}</span>
                <h3 class="mt-5 text-xl font-semibold tracking-[-0.03em] text-slate-950">{{ item.title }}</h3>
                <p class="mt-3 text-sm leading-6 text-slate-500">{{ item.copy }}</p>
              </article>
            }
          </div>
        </div>
      </section>

      <section id="services" class="px-4 py-20 sm:px-6">
        <div class="container">
          <div class="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p class="text-sm font-semibold text-cyan-600">Ride categories</p>
              <h2 class="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">Choose only what you need.</h2>
            </div>
            <p class="max-w-md text-sm leading-6 text-slate-500">A small set of clear ride modes keeps the experience fast and focused.</p>
          </div>

          <div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            @for (service of services; track service.title) {
              <article class="premium-card p-6">
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-600">{{ service.kicker }}</p>
                <h3 class="mt-4 text-xl font-semibold tracking-[-0.03em] text-slate-950">{{ service.title }}</h3>
                <p class="mt-3 text-sm leading-6 text-slate-500">{{ service.copy }}</p>
              </article>
            }
          </div>
        </div>
      </section>

      <section class="px-4 py-20 sm:px-6">
        <div class="container grid gap-6 rounded-[2rem] bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.06)] md:grid-cols-[0.75fr_1.25fr] md:p-10">
          <div>
            <p class="text-sm font-semibold text-cyan-600">Rider feedback</p>
            <h2 class="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950">Built on trust. Driven for 30+ years.</h2>
          </div>
          <div class="grid gap-4 md:grid-cols-2">
            @for (testimonial of testimonials; track testimonial.name) {
              <blockquote class="rounded-[1.5rem] bg-[#f7f8fa] p-5">
                <p class="text-base leading-7 text-slate-600">"{{ testimonial.copy }}"</p>
                <footer class="mt-4 text-sm font-semibold text-slate-950">{{ testimonial.name }}</footer>
              </blockquote>
            }
          </div>
        </div>
      </section>

      <motus-public-footer />
    </main>
  `
})
export class MarketingPageComponent {
  route: BookingRouteState = { from: "", to: "", expanded: false, submitted: false };
  routeMetrics: RouteMetrics | null = null;

  readonly benefits = [
    { icon: "01", title: "Verified drivers", copy: "Service-ready driver partners for safer daily and planned travel." },
    { icon: "02", title: "Fast booking", copy: "Start with pickup and destination, then expand only when needed." },
    { icon: "03", title: "Clean fleet", copy: "Sedans, SUVs, airport cars, rentals, and bulk booking options." }
  ];

  readonly services = [
    { kicker: "City", title: "Inter-city", copy: "Quick point-to-point travel across Hyderabad." },
    { kicker: "Airport", title: "Airport Transfer", copy: "Reliable RGIA pickup and drop support." },
    { kicker: "Hourly", title: "Rentals", copy: "Flexible cars for errands, meetings, and city plans." },
    { kicker: "Teams", title: "Bulk Booking", copy: "Corporate and event movement for authenticated users." }
  ];

  readonly testimonials = [
    { name: "Sreyesh, Hyderabad", copy: "The pickup was smooth, the cab felt spotless, and the whole booking experience was refreshingly simple." },
    { name: "Deepak, Travel Lead", copy: "MOTUS brings the reliability we expect from established Hyderabad travel with the polish of a modern mobility app." }
  ];

  onRouteChange(route: BookingRouteState): void {
    this.route = route;
  }

  onRouteMetrics(metrics: RouteMetrics): void {
    this.routeMetrics = metrics;
  }

  get routeIsActive(): boolean {
    return this.route.expanded || Boolean(this.route.from || this.route.to);
  }
}
