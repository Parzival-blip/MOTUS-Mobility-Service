import { Component, inject } from "@angular/core";
import { MatTableModule } from "@angular/material/table";
import { PlatformDataService } from "../../core/platform-data.service";

@Component({
  selector: "motus-vehicle-management-page",
  standalone: true,
  imports: [MatTableModule],
  template: `
    <section class="enterprise-card overflow-hidden p-6">
      <p class="eyebrow">Vehicle Management</p>
      <h2 class="mb-5 mt-2 text-3xl font-black">Fleet registry, allocation, and lifecycle status</h2>
      <table mat-table [dataSource]="data.vehicles" class="w-full">
        <ng-container matColumnDef="unit"><th mat-header-cell *matHeaderCellDef>Unit</th><td mat-cell *matCellDef="let row">{{ row.unit }}</td></ng-container>
        <ng-container matColumnDef="category"><th mat-header-cell *matHeaderCellDef>Category</th><td mat-cell *matCellDef="let row">{{ row.category }}</td></ng-container>
        <ng-container matColumnDef="driver"><th mat-header-cell *matHeaderCellDef>Driver</th><td mat-cell *matCellDef="let row">{{ row.driver }}</td></ng-container>
        <ng-container matColumnDef="health"><th mat-header-cell *matHeaderCellDef>Maintenance Health</th><td mat-cell *matCellDef="let row">{{ row.health }}</td></ng-container>
        <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>Status</th><td mat-cell *matCellDef="let row">{{ row.status }}</td></ng-container>
        <tr mat-header-row *matHeaderRowDef="columns"></tr>
        <tr mat-row *matRowDef="let row; columns: columns"></tr>
      </table>
    </section>
  `
})
export class VehicleManagementPageComponent {
  readonly data = inject(PlatformDataService);
  readonly columns = ["unit", "category", "driver", "health", "status"];
}
