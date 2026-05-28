import { Component, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { AuthService } from "../../core/auth.service";

@Component({
  selector: "motus-login-page",
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, MatButtonModule, MatFormFieldModule, MatInputModule],
  template: `
    <main class="grid min-h-screen bg-[#06111f] text-white lg:grid-cols-[0.95fr_1.05fr]">
      <section class="flex flex-col justify-between p-8 lg:p-14">
        <a routerLink="/" class="flex items-center gap-3 text-xl font-black transition hover:text-cyan-100" aria-label="Go to Motus homepage">
          <span class="grid h-11 w-11 place-items-center rounded-2xl bg-electric">M</span>
          Motus
        </a>
        <div class="max-w-xl">
          <p class="eyebrow">Private authenticated platform</p>
          <h1 class="mt-5 text-5xl font-black leading-[0.95] tracking-[-0.05em]">Enterprise mobility operations console.</h1>
          <p class="mt-6 text-lg leading-8 text-slate-300">Access is restricted to enterprises, transport administrators, dispatchers, vendors, drivers, and authorized workforce users.</p>
        </div>
        <p class="text-sm text-slate-400">JWT, refresh tokens, RBAC, audit logs, and route guards are represented in the platform architecture.</p>
      </section>
      <section class="grid place-items-center bg-white p-6 text-slate-950">
        <form class="w-full max-w-md rounded-[34px] border border-slate-200 p-8 shadow-command" [formGroup]="form" (ngSubmit)="submit()">
          <p class="text-xs font-black uppercase tracking-[0.18em] text-electric">Enterprise login</p>
          <h2 class="mt-3 text-3xl font-black">Sign in to Motus</h2>
          <p class="mt-2 text-sm text-slate-500">Use any enterprise email and password for the demo session.</p>
          <mat-form-field class="mt-8 w-full" appearance="outline">
            <mat-label>Enterprise email</mat-label>
            <input matInput type="email" formControlName="email" autocomplete="email">
          </mat-form-field>
          <mat-form-field class="w-full" appearance="outline">
            <mat-label>Password</mat-label>
            <input matInput type="password" formControlName="password" autocomplete="current-password">
          </mat-form-field>
          <button mat-raised-button color="primary" class="mt-3 w-full" type="submit" [disabled]="form.invalid">Enter Operations Console</button>
          <a routerLink="/contact-sales" class="mt-5 block text-center text-sm font-bold text-electric">Need enterprise access?</a>
        </form>
      </section>
    </main>
  `
})
export class LoginPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);

  readonly form = this.fb.nonNullable.group({
    email: ["ops@enterprise.com", [Validators.required, Validators.email]],
    password: ["Motus@2026", [Validators.required, Validators.minLength(8)]]
  });

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    const { email, password } = this.form.getRawValue();
    this.auth.login(email, password);
  }
}
