import { Component, inject } from "@angular/core";
import { MatTableModule } from "@angular/material/table";
import { PlatformDataService } from "../../core/platform-data.service";

@Component({
  selector: "motus-dashboard-page",
  standalone: true,
  imports: [MatTableModule],
  template: `
    <div class="grid gap-6">
      <section class="grid gap-4 md:grid-cols-4">
        @for (kpi of data.kpis; track kpi.label) {
          <article class="metric-card">
            <p class="text-sm font-semibold text-slate-500">{{ kpi.label }}</p>
            <p class="mt-3 text-3xl font-black">{{ kpi.value }}</p>
            <p class="mt-1 text-xs font-black text-electric">{{ kpi.delta }}</p>
          </article>
        }
      </section>

      <section class="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <article class="enterprise-card p-6">
          <div class="mb-5 flex items-center justify-between">
            <div>
              <p class="eyebrow">Transport heatmap</p>
              <h2 class="text-2xl font-black">Demand, occupancy, and route pressure</h2>
            </div>
            <span class="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">Operational</span>
          </div>
          <div class="grid h-80 grid-cols-12 gap-2 rounded-3xl bg-slate-950 p-5">
            @for (level of heatmap; track $index) {
              <span class="rounded-xl" [class.bg-cyanops]="level > 75" [class.bg-electric]="level <= 75 && level > 45" [class.bg-slate-700]="level <= 45" [style.opacity.%]="level"></span>
            }
          </div>
        </article>

        <article class="enterprise-card p-6">
          <p class="eyebrow">Approval queue</p>
          <h2 class="mt-2 text-2xl font-black">Policy approvals requiring action</h2>
          <div class="mt-5 grid gap-3">
            @for (item of approvals; track item.title) {
              <div class="rounded-3xl border border-slate-200 p-4">
                <p class="font-black">{{ item.title }}</p>
                <p class="mt-1 text-sm text-slate-500">{{ item.meta }}</p>
              </div>
            }
          </div>
        </article>
      </section>

      <section class="enterprise-card overflow-hidden p-6">
        <p class="eyebrow">Live booking operations</p>
        <h2 class="mb-5 mt-2 text-2xl font-black">Enterprise transport work orders</h2>
        <table mat-table [dataSource]="data.bookings" class="w-full">
          <ng-container matColumnDef="id"><th mat-header-cell *matHeaderCellDef>Booking</th><td mat-cell *matCellDef="let row">{{ row.id }}</td></ng-container>
          <ng-container matColumnDef="department"><th mat-header-cell *matHeaderCellDef>Department</th><td mat-cell *matCellDef="let row">{{ row.department }}</td></ng-container>
          <ng-container matColumnDef="route"><th mat-header-cell *matHeaderCellDef>Route</th><td mat-cell *matCellDef="let row"><span class="addressSingleLine">{{ row.route }}</span></td></ng-container>
          <ng-container matColumnDef="passengers"><th mat-header-cell *matHeaderCellDef>Passengers</th><td mat-cell *matCellDef="let row">{{ row.passengers }}</td></ng-container>
          <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>Status</th><td mat-cell *matCellDef="let row">{{ row.status }}</td></ng-container>
          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns"></tr>
        </table>
      </section>
    </div>
  `
})
export class DashboardPageComponent {
  readonly data = inject(PlatformDataService);
  readonly columns = ["id", "department", "route", "passengers", "status"];
  readonly heatmap = [92, 61, 30, 74, 85, 51, 45, 91, 68, 36, 78, 64, 42, 88, 56, 73, 96, 40, 66, 83, 57, 70, 35, 62];
  readonly approvals = [
    { title: "Night shift recurring schedule", meta: "760 employees, Plant B, 42 vehicles" },
    { title: "Airport corridor executive allocation", meta: "36 riders, premium fleet, vendor split" },
    { title: "Route exception: ORR congestion", meta: "Dispatcher escalation, ETA variance 18 min" }
  ];
}
