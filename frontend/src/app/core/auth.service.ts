import { Injectable, signal } from "@angular/core";
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
  readonly user = signal<SessionUser | null>(this.restoreSession());

  constructor(private readonly router: Router) {}

  login(email: string, password: string): void {
    const session: SessionUser = {
      id: crypto.randomUUID(),
      name: email.split("@")[0] || "Operations Lead",
      enterprise: "Apex Global Services",
      role: "Transport Manager",
      token: btoa(`${email}:${password}:${Date.now()}`)
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    this.user.set(session);
    void this.router.navigateByUrl("/app/dashboard");
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.user.set(null);
    void this.router.navigateByUrl("/");
  }

  isAuthenticated(): boolean {
    return Boolean(this.user()?.token);
  }

  private restoreSession(): SessionUser | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as SessionUser;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  }
}
