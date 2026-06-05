import { NgClass } from "@angular/common";
import { Component, inject } from "@angular/core";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { AuthService } from "../core/auth.service";

@Component({
  selector: "motus-ops-shell",
  standalone: true,
  imports: [NgClass, RouterOutlet, RouterLink, RouterLinkActive, MatButtonModule],
  template: `
    <div class="min-h-screen bg-[#eef3f8] text-slate-950">
      @if (mobileMenuOpen) {
        <button
          type="button"
          class="fixed inset-0 z-[60] bg-slate-950/50 backdrop-blur-sm lg:hidden"
          aria-label="Close navigation menu"
          (click)="closeMobileMenu()"
        ></button>
      }

      <aside class="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-slate-200 bg-[#06111f] p-6 text-white lg:flex">
        <a routerLink="/" class="mb-10 flex items-center gap-3 rounded-2xl text-xl font-black transition hover:text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-300/70 focus:ring-offset-4 focus:ring-offset-[#06111f]" aria-label="Go to Motus homepage">
          <span class="grid h-11 w-11 place-items-center rounded-2xl bg-electric">M</span>
          <span>Motus</span>
        </a>
        <nav class="grid gap-2 text-sm font-semibold text-slate-300">
          @for (item of navItems; track item.path) {
            <a class="rounded-2xl px-4 py-3 hover:bg-white/10" [routerLink]="item.path" routerLinkActive="bg-white/10 text-white">{{ item.label }}</a>
          }
        </nav>
        <div class="mt-auto rounded-3xl border border-white/10 bg-white/[0.08] p-4">
          <p class="text-xs uppercase tracking-[0.2em] text-cyanops">Signed in</p>
          <p class="mt-2 font-bold">{{ auth.user()?.name }}</p>
          <p class="text-sm text-slate-300">{{ auth.user()?.role }}</p>
          <button mat-button class="mt-4 !text-white" (click)="auth.logout()">Logout</button>
        </div>
      </aside>

      <aside
        class="fixed inset-y-0 left-0 z-[70] flex w-[min(20rem,calc(100vw-2rem))] flex-col border-r border-white/10 bg-[#06111f] p-5 text-white shadow-2xl transition-transform duration-300 lg:hidden"
        [ngClass]="mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'"
        [attr.aria-hidden]="mobileMenuOpen ? null : true"
      >
        <div class="mb-8 flex items-center justify-between gap-4">
          <a routerLink="/" class="flex items-center gap-3 rounded-2xl text-xl font-black transition hover:text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-300/70 focus:ring-offset-4 focus:ring-offset-[#06111f]" aria-label="Go to Motus homepage" (click)="closeMobileMenu()">
            <span class="grid h-11 w-11 place-items-center rounded-2xl bg-electric">M</span>
            <span>Motus</span>
          </a>
          <button
            type="button"
            class="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-2xl leading-none text-white"
            aria-label="Close navigation menu"
            (click)="closeMobileMenu()"
          >
            &times;
          </button>
        </div>

        <nav class="grid gap-2 text-sm font-semibold text-slate-300" aria-label="Mobile dashboard navigation">
          @for (item of navItems; track item.path) {
            <a class="rounded-2xl px-4 py-3 hover:bg-white/10" [routerLink]="item.path" routerLinkActive="bg-white/10 text-white" (click)="closeMobileMenu()">{{ item.label }}</a>
          }
        </nav>

        <div class="mt-auto rounded-3xl border border-white/10 bg-white/[0.08] p-4">
          <p class="text-xs uppercase tracking-[0.2em] text-cyanops">Signed in</p>
          <p class="mt-2 font-bold">{{ auth.user()?.name }}</p>
          <p class="text-sm text-slate-300">{{ auth.user()?.role }}</p>
          <button mat-button class="mt-4 !text-white" (click)="logout()">Logout</button>
        </div>
      </aside>

      <main class="lg:pl-72">
        <header class="sticky top-0 z-50 flex min-h-20 items-center justify-between gap-3 border-b border-slate-200 bg-white/[0.92] px-4 py-3 backdrop-blur-xl sm:px-5 lg:px-10">
          <div class="flex min-w-0 items-center gap-3">
            <button
              type="button"
              class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-slate-200 bg-white text-xl font-black text-slate-900 shadow-sm lg:hidden"
              aria-label="Open dashboard navigation menu"
              [attr.aria-expanded]="mobileMenuOpen"
              (click)="openMobileMenu()"
            >
              <span aria-hidden="true">☰</span>
            </button>
            <div class="min-w-0">
            <p class="text-xs font-black uppercase tracking-[0.18em] text-electric">Private operations console</p>
            <h1 class="truncate text-lg font-black sm:text-xl">Enterprise transport orchestration</h1>
            </div>
          </div>
          <a mat-stroked-button routerLink="/" class="shrink-0 !min-w-0 !px-3 sm:!px-4">Public Site</a>
        </header>
        <section class="p-4 sm:p-5 lg:p-10">
          <router-outlet />
        </section>
      </main>
    </div>
  `
})
export class OpsShellComponent {
  readonly auth = inject(AuthService);
  mobileMenuOpen = false;

  readonly navItems = [
    { path: "/app/dashboard", label: "Enterprise Dashboard" },
    { path: "/app/bulk-booking", label: "Bulk Booking" },
    { path: "/app/fleet-tracking", label: "Fleet Tracking" },
    { path: "/app/reports", label: "Reports & Analytics" },
    { path: "/app/users", label: "User Management" },
    { path: "/app/vehicles", label: "Vehicle Management" }
  ];

  openMobileMenu(): void {
    this.mobileMenuOpen = true;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  logout(): void {
    this.closeMobileMenu();
    this.auth.logout();
  }
}
