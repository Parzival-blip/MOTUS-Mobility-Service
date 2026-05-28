import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
  selector: "motus-public-footer",
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="bg-slate-950 px-4 py-10 text-white sm:px-6">
      <div class="container flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <a routerLink="/" class="flex items-center gap-3 font-semibold tracking-[-0.03em]">
            <span class="grid h-10 w-10 place-items-center rounded-full bg-cyan-500 text-sm text-white">M</span>
            <span class="text-lg">MOTUS</span>
          </a>
          <p class="mt-4 max-w-sm text-sm leading-6 text-slate-400">
            Premium cab booking for Hyderabad city rides, airport transfers, rentals, and bulk movement.
          </p>
        </div>

        <nav class="flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-300" aria-label="Footer navigation">
          <a routerLink="/" fragment="home" class="hover:text-white">Book</a>
          <a routerLink="/" fragment="services" class="hover:text-white">Rides</a>
          <a routerLink="/login" class="hover:text-white">Login</a>
          <a routerLink="/contact-sales" class="hover:text-white">Contact</a>
        </nav>
      </div>

      <div class="container mt-10 border-t border-white/10 pt-6 text-xs text-slate-500">
        &copy; {{ year }} MOTUS Mobility. All rights reserved.
      </div>
    </footer>
  `
})
export class PublicFooterComponent {
  readonly year = new Date().getFullYear();
}
