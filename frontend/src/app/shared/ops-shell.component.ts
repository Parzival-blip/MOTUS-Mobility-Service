import { Component, inject } from "@angular/core";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { AuthService } from "../core/auth.service";

@Component({
  selector: "motus-ops-shell",
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatButtonModule],
  template: `
    <div class="min-h-screen bg-[#eef3f8] text-slate-950">
      <aside class="fixed inset-y-0 left-0 hidden w-72 flex-col border-r border-slate-200 bg-[#06111f] p-6 text-white lg:flex">
        <a routerLink="/" class="mb-10 flex items-center gap-3 rounded-2xl text-xl font-black transition hover:text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-300/70 focus:ring-offset-4 focus:ring-offset-[#06111f]" aria-label="Go to Motus homepage">
          <span class="grid h-11 w-11 place-items-center rounded-2xl bg-electric">M</span>
          <span>Motus</span>
        </a>
        <nav class="grid gap-2 text-sm font-semibold text-slate-300">
          <a class="rounded-2xl px-4 py-3 hover:bg-white/10" routerLink="/app/dashboard" routerLinkActive="bg-white/10 text-white">Enterprise Dashboard</a>
          <a class="rounded-2xl px-4 py-3 hover:bg-white/10" routerLink="/app/bulk-booking" routerLinkActive="bg-white/10 text-white">Bulk Booking</a>
          <a class="rounded-2xl px-4 py-3 hover:bg-white/10" routerLink="/app/fleet-tracking" routerLinkActive="bg-white/10 text-white">Fleet Tracking</a>
          <a class="rounded-2xl px-4 py-3 hover:bg-white/10" routerLink="/app/reports" routerLinkActive="bg-white/10 text-white">Reports & Analytics</a>
          <a class="rounded-2xl px-4 py-3 hover:bg-white/10" routerLink="/app/users" routerLinkActive="bg-white/10 text-white">User Management</a>
          <a class="rounded-2xl px-4 py-3 hover:bg-white/10" routerLink="/app/vehicles" routerLinkActive="bg-white/10 text-white">Vehicle Management</a>
        </nav>
        <div class="mt-auto rounded-3xl border border-white/10 bg-white/[0.08] p-4">
          <p class="text-xs uppercase tracking-[0.2em] text-cyanops">Signed in</p>
          <p class="mt-2 font-bold">{{ auth.user()?.name }}</p>
          <p class="text-sm text-slate-300">{{ auth.user()?.role }}</p>
          <button mat-button class="mt-4 !text-white" (click)="auth.logout()">Logout</button>
        </div>
      </aside>
      <main class="lg:pl-72">
        <header class="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200 bg-white/[0.86] px-5 backdrop-blur-xl lg:px-10">
          <div>
            <p class="text-xs font-black uppercase tracking-[0.18em] text-electric">Private operations console</p>
            <h1 class="text-xl font-black">Enterprise transport orchestration</h1>
          </div>
          <a mat-stroked-button routerLink="/">Public Site</a>
        </header>
        <section class="p-5 lg:p-10">
          <router-outlet />
        </section>
      </main>
    </div>
  `
})
export class OpsShellComponent {
  readonly auth = inject(AuthService);
}
