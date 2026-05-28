import { Component, HostListener, OnInit, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { AuthService } from "../core/auth.service";

@Component({
  selector: "motus-public-header",
  standalone: true,
  imports: [RouterLink, MatButtonModule],
  template: `
    <header
      class="public-header fixed inset-x-0 top-0 z-50 border-b border-transparent transition-all duration-300"
      [class.public-header--scrolled]="isScrolled"
    >
      <nav class="mx-auto flex h-[68px] max-w-[1180px] items-center justify-between px-4 text-slate-950 sm:h-[72px] sm:px-6">
        <a routerLink="/" class="flex items-center gap-2.5 font-semibold tracking-[-0.03em] transition hover:text-cyan-700 sm:gap-3" aria-label="MOTUS home">
          <span class="grid h-9 w-9 place-items-center rounded-2xl bg-slate-950 text-sm text-white shadow-[0_10px_30px_rgba(15,23,42,0.16)] sm:h-10 sm:w-10">M</span>
          <span class="text-base sm:text-lg">MOTUS</span>
        </a>

        <div class="hidden items-center gap-7 text-sm font-medium text-slate-500 lg:flex">
          <a routerLink="/" fragment="why-motus" class="transition hover:text-slate-950">Why MOTUS</a>
          <a routerLink="/" fragment="services" class="transition hover:text-slate-950">Rides</a>
          <a routerLink="/login" class="transition hover:text-slate-950">Bulk booking</a>
        </div>

        <div class="flex items-center gap-2 sm:gap-3">
          @if (auth.isAuthenticated()) {
            <a mat-button routerLink="/app/dashboard" class="!hidden sm:!inline-flex">Dashboard</a>
          } @else {
            <a mat-stroked-button routerLink="/login" class="!h-10 !border-slate-200 !px-4 !text-slate-950">Login</a>
          }
          <span class="flex w-[92px] justify-end sm:w-[124px]" aria-hidden="false">
            <a
              mat-raised-button
              color="primary"
              routerLink="/"
              fragment="home"
              class="!h-10 !min-w-[82px] !whitespace-nowrap !px-4 transition-all duration-300 sm:!min-w-[112px] sm:!px-5"
              [class.opacity-0]="hideBookNow"
              [class.pointer-events-none]="hideBookNow"
              [class.invisible]="hideBookNow"
              [class.translate-y-2]="hideBookNow"
              [attr.aria-hidden]="hideBookNow"
              [attr.tabindex]="hideBookNow ? -1 : null"
            >
              <span class="sm:hidden">Book</span>
              <span class="hidden sm:inline">Book Now</span>
            </a>
          </span>
        </div>
      </nav>
    </header>
  `
})
export class PublicHeaderComponent implements OnInit {
  readonly auth = inject(AuthService);
  hideBookNow = true;
  isScrolled = false;

  ngOnInit(): void {
    this.updateHeaderState();
  }

  @HostListener("window:scroll")
  onScroll(): void {
    this.updateHeaderState();
  }

  @HostListener("window:resize")
  onResize(): void {
    this.updateHeaderState();
  }

  private updateHeaderState(): void {
    const isHome = window.location.pathname === "/" || window.location.pathname === "";
    const isFirstHeroScreen = isHome && window.scrollY < window.innerHeight * 0.72;

    this.hideBookNow = isFirstHeroScreen;
    this.isScrolled = window.scrollY > 12 || !isHome;
  }
}
