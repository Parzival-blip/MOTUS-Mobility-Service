import { Component } from "@angular/core";
import { MatTableModule } from "@angular/material/table";

@Component({
  selector: "motus-user-management-page",
  standalone: true,
  imports: [MatTableModule],
  template: `
    <section class="enterprise-card overflow-hidden p-4 sm:p-6">
      <p class="eyebrow">User Management</p>
      <h2 class="mb-5 mt-2 text-3xl font-black">RBAC users, roles, and permissions</h2>
      <div class="mobile-table-scroll" tabindex="0" aria-label="RBAC users table">
        <table mat-table [dataSource]="users" class="w-full min-w-[40rem]">
          <ng-container matColumnDef="name"><th mat-header-cell *matHeaderCellDef>Name</th><td mat-cell *matCellDef="let row">{{ row.name }}</td></ng-container>
          <ng-container matColumnDef="role"><th mat-header-cell *matHeaderCellDef>Role</th><td mat-cell *matCellDef="let row">{{ row.role }}</td></ng-container>
          <ng-container matColumnDef="scope"><th mat-header-cell *matHeaderCellDef>Scope</th><td mat-cell *matCellDef="let row">{{ row.scope }}</td></ng-container>
          <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>Status</th><td mat-cell *matCellDef="let row">{{ row.status }}</td></ng-container>
          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns"></tr>
        </table>
      </div>
    </section>
  `
})
export class UserManagementPageComponent {
  readonly columns = ["name", "role", "scope", "status"];
  readonly users = [
    { name: "Nisha Menon", role: "Enterprise Admin", scope: "Global policy", status: "Active" },
    { name: "Arjun Rao", role: "Transport Manager", scope: "Bengaluru East", status: "Active" },
    { name: "Rafiq Khan", role: "Dispatcher", scope: "Night shift", status: "Active" },
    { name: "Vendor Ops", role: "Vendor", scope: "Airport corridor", status: "Review" },
    { name: "Driver Pool", role: "Driver", scope: "Fleet units", status: "Active" }
  ];
}
