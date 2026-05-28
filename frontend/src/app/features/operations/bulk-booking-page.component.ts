import { Component } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";

@Component({
  selector: "motus-bulk-booking-page",
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  template: `
    <div class="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
      <section class="enterprise-card p-7">
        <p class="eyebrow">Authenticated Bulk Booking Engine</p>
        <h2 class="mt-2 text-3xl font-black tracking-[-0.03em]">Create corporate, event, and wedding transport at scale.</h2>
        <p class="mt-3 text-sm leading-6 text-slate-600">
          Plan employee shuttles, guest movement, VIP cars, hotel transfers, and venue loops with one protected workflow.
        </p>
        <form class="mt-7 grid gap-4" [formGroup]="form">
          <mat-form-field appearance="outline">
            <mat-label>Organization / Event / Venue</mat-label>
            <input matInput formControlName="location">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Booking type</mat-label>
            <mat-select formControlName="scheduleType">
              <mat-option value="shift">Recurring shift transport</mat-option>
              <mat-option value="department">Department-wide transport</mat-option>
              <mat-option value="event">Event transport management</mat-option>
              <mat-option value="wedding">Wedding guest movement</mat-option>
              <mat-option value="vip">VIP and executive cars</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Passengers</mat-label>
            <input matInput type="number" formControlName="passengers">
          </mat-form-field>
          <div class="rounded-3xl border border-dashed border-electric/50 bg-blue-50 p-6">
            <p class="font-black text-electric">Roster, guest list, or itinerary upload</p>
            <p class="mt-2 text-sm text-slate-600">
              Employee lists, event guest manifests, pickup zones, hotel blocks, venue routes, and approval chains are validated before allocation.
            </p>
          </div>
          <button mat-raised-button color="primary" [disabled]="form.invalid">Generate Transport Allocation Plan</button>
        </form>
      </section>

      <section class="grid gap-5">
        @for (step of workflow; track step.title) {
          <article class="enterprise-card p-6">
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="text-xs font-black uppercase tracking-[0.16em] text-electric">Step {{ $index + 1 }}</p>
                <h3 class="mt-2 text-2xl font-black">{{ step.title }}</h3>
                <p class="mt-2 text-slate-600">{{ step.description }}</p>
              </div>
              <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-black">{{ step.status }}</span>
            </div>
          </article>
        }
      </section>
    </div>
  `
})
export class BulkBookingPageComponent {
  readonly form = new FormBuilder().nonNullable.group({
    location: ["Hyderabad Corporate Campus / Event Venue", Validators.required],
    scheduleType: ["shift", Validators.required],
    passengers: [420, [Validators.required, Validators.min(1)]]
  });

  readonly workflow = [
    { title: "Demand ingestion", description: "Upload employees, guests, policy groups, shift windows, hotel blocks, venues, and special assistance tags.", status: "Validated" },
    { title: "Route grouping", description: "Cluster corporate pickups, event routes, wedding guest movement, and airport transfers by time and capacity.", status: "Optimized" },
    { title: "Fleet allocation", description: "Assign sedans, SUVs, vans, shuttles, luxury cars, EVs, ICE, hybrid, and vendor-managed vehicles with backup coverage.", status: "Ready" },
    { title: "Centralized approvals", description: "Route approvals through enterprise admins, planners, finance, transport managers, and dispatch.", status: "Pending" }
  ];
}
