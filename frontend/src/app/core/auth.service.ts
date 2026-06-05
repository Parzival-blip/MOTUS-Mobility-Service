import { isPlatformBrowser } from "@angular/common";
import { Injectable, PLATFORM_ID, inject, signal } from "@angular/core";
import { Router } from "@angular/router";

export type MotusRole =
  | "Super Admin"
  | "Enterprise Admin"
  | "Transport Manager"
  | "Dispatcher"
  | "Employee"
  | "Vendor"
  | "Driver";

export interface SessionUser {
  id: string;
  name: string;
  enterprise: string;
  role: MotusRole;
  token: string;
}

const STORAGE_KEY = "motus.session";

@Injectable({ providedIn: "root" })
export class AuthService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly user = signal<SessionUser | null>(this.restoreSession());

  constructor(private readonly router: Router) {}

  login(email: string, password: string): void {
    const session: SessionUser = {
      id: this.createSessionId(),
      name: email.split("@")[0] || "Operations Lead",
      enterprise: "Apex Global Services",
      role: "Transport Manager",
      token: this.encodeToken(`${email}:${password}:${Date.now()}`)
    };

    this.writeSession(session);
    this.user.set(session);
    void this.router.navigateByUrl("/app/dashboard");
  }

  logout(): void {
    this.clearSession();
    this.user.set(null);
    void this.router.navigateByUrl("/");
  }

  isAuthenticated(): boolean {
    return Boolean(this.user()?.token);
  }

  private restoreSession(): SessionUser | null {
    if (!this.isBrowser) {
      return null;
    }

    const raw = this.readSession();
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as SessionUser;
    } catch {
      this.clearSession();
      return null;
    }
  }

  private readSession(): string | null {
    try {
      return window.localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  }

  private writeSession(session: SessionUser): void {
    if (!this.isBrowser) {
      return;
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch {
      // Some mobile browsers disable localStorage in private mode; keep the in-memory session alive.
    }
  }

  private clearSession(): void {
    if (!this.isBrowser) {
      return;
    }

    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Storage may be unavailable on restricted mobile browsers.
    }
  }

  private createSessionId(): string {
    if (this.isBrowser && "randomUUID" in window.crypto) {
      return window.crypto.randomUUID();
    }

    return `session-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }

  private encodeToken(value: string): string {
    if (this.isBrowser) {
      return window.btoa(value);
    }

    return value;
  }
}
