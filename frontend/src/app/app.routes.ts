import { Routes } from "@angular/router";
import { authGuard } from "./core/auth.guard";
import { MarketingPageComponent } from "./features/marketing/marketing-page.component";
import { DashboardPageComponent } from "./features/operations/dashboard-page.component";
import { BulkBookingPageComponent } from "./features/operations/bulk-booking-page.component";
import { FleetTrackingPageComponent } from "./features/operations/fleet-tracking-page.component";
import { ReportsPageComponent } from "./features/operations/reports-page.component";
import { UserManagementPageComponent } from "./features/operations/user-management-page.component";
import { VehicleManagementPageComponent } from "./features/operations/vehicle-management-page.component";
import { LoginPageComponent } from "./features/auth/login-page.component";
import { OpsShellComponent } from "./shared/ops-shell.component";

export const routes: Routes = [
  { path: "", component: MarketingPageComponent, data: { page: "home" } },
  { path: "solutions", component: MarketingPageComponent, data: { page: "solutions" } },
  { path: "industries", component: MarketingPageComponent, data: { page: "industries" } },
  { path: "fleet", component: MarketingPageComponent, data: { page: "fleet" } },
  { path: "technology", component: MarketingPageComponent, data: { page: "technology" } },
  { path: "safety-compliance", component: MarketingPageComponent, data: { page: "safety" } },
  { path: "about", component: MarketingPageComponent, data: { page: "about" } },
  { path: "contact-sales", component: MarketingPageComponent, data: { page: "contact" } },
  { path: "login", component: LoginPageComponent },
  {
    path: "app",
    canActivate: [authGuard],
    component: OpsShellComponent,
    children: [
      { path: "", pathMatch: "full", redirectTo: "dashboard" },
      { path: "dashboard", component: DashboardPageComponent },
      { path: "bulk-booking", component: BulkBookingPageComponent },
      { path: "fleet-tracking", component: FleetTrackingPageComponent },
      { path: "reports", component: ReportsPageComponent },
      { path: "users", component: UserManagementPageComponent },
      { path: "vehicles", component: VehicleManagementPageComponent }
    ]
  },
  { path: "**", redirectTo: "" }
];
