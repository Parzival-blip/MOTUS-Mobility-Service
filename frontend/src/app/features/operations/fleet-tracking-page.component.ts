import { Component, inject } from "@angular/core";
import { MatTableModule } from "@angular/material/table";
import { PlatformDataService } from "../../core/platform-data.service";

@Component({
  selector: "motus-fleet-tracking-page",
  standalone: true,
  imports: [MatTableModule],
  template: `
    <div class="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <section class="enterprise-card p-6">
        <p class="eyebrow">Live tracking</p>
        <h2 class="mt-2 text-3xl font-black">GPS fleet map and route progress</h2>
        <div class="relative mt-6 h-[460px] overflow-hidden rounded-[30px] bg-[#071525]">
          <div class="absolute inset-0 opacity-30" style="background-image: linear-gradient(#2f7df6 1px, transparent 1px), linear-gradient(90deg, #2f7df6 1px, transparent 1px); background-size: 46px 46px;"></div>
          @for (pin of pins; track pin.unit) {
            <div class="absolute rounded-full bg-cyanops p-2 shadow-lg shadow-cyan-500/30" [style.left.%]="pin.x" [style.top.%]="pin.y">
              <span class="block h-3 w-3 rounded-full bg-white"></span>
              <span class="absolute left-7 top-0 whitespace-nowrap rounded-full bg-white px-3 py-1 text-xs font-black text-slate-900">{{ pin.unit }}</span>
            </div>
          }
        </div>
      </section>

      <section class="enterprise-card overflow-hidden p-6">
        <p class="eyebrow">Vehicle status</p>
        <h2 class="mb-5 mt-2 text-3xl font-black">Allocation, occupancy, and maintenance</h2>
        <table mat-table [dataSource]="data.vehicles" class="w-full">
          <ng-container matColumnDef="unit"><th mat-header-cell *matHeaderCellDef>Unit</th><td mat-cell *matCellDef="let row">{{ row.unit }}</td></ng-container>
          <ng-container matColumnDef="category"><th mat-header-cell *matHeaderCellDef>Category</th><td mat-cell *matCellDef="let row">{{ row.category }}</td></ng-container>
          <ng-container matColumnDef="occupancy"><th mat-header-cell *matHeaderCellDef>Occupancy</th><td mat-cell *matCellDef="let row">{{ row.occupancy }}</td></ng-container>
          <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>Status</th><td mat-cell *matCellDef="let row">{{ row.status }}</td></ng-container>
          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns"></tr>
        </table>
      </section>
    </div>
  `
})
export class FleetTrackingPageComponent {
  readonly data = inject(PlatformDataService);
  readonly columns = ["unit", "category", "occupancy", "status"];
  readonly pins = [
    { unit: "EV-214", x: 18, y: 30 },
    { unit: "SH-611", x: 52, y: 46 },
    { unit: "VN-088", x: 70, y: 25 },
    { unit: "LX-019", x: 35, y: 68 }
  ];
}
