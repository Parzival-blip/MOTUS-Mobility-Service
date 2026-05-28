import { Injectable } from "@angular/core";

export interface Kpi {
  label: string;
  value: string;
  delta: string;
  tone: "blue" | "green" | "cyan" | "slate";
}

export interface BookingRow {
  id: string;
  department: string;
  route: string;
  passengers: number;
  status: "Approved" | "Pending" | "Allocating" | "In Progress";
  eta: string;
}

export interface Vehicle {
  unit: string;
  category: string;
  driver: string;
  occupancy: string;
  health: string;
  status: "Live" | "Standby" | "Maintenance";
}

@Injectable({ providedIn: "root" })
export class PlatformDataService {
  readonly capabilities = [
    "Bulk Booking",
    "Fleet Orchestration",
    "Live Tracking",
    "Reporting & Analytics",
    "Approval Workflows",
    "Vendor Management",
    "Driver Management",
    "Invoice Management",
    "Notifications",
    "Route Optimization",
    "Employee Scheduling"
  ];

  readonly industries = [
    "IT & Tech Parks",
    "BPO/KPO",
    "Manufacturing",
    "Hospitality",
    "Airlines",
    "Healthcare",
    "Logistics",
    "Corporate Campuses"
  ];

  readonly kpis: Kpi[] = [
    { label: "Active workforce trips", value: "4,862", delta: "+18.4% vs last week", tone: "blue" },
    { label: "Fleet utilization", value: "87.6%", delta: "+6.2% optimized", tone: "green" },
    { label: "On-time arrivals", value: "96.8%", delta: "SLA protected", tone: "cyan" },
    { label: "Open approvals", value: "143", delta: "12 urgent chains", tone: "slate" }
  ];

  readonly bookings: BookingRow[] = [
    { id: "BK-80291", department: "Night Shift Operations", route: "Electronic City Loop", passengers: 420, status: "Allocating", eta: "22:15" },
    { id: "BK-80292", department: "Finance Shared Services", route: "Whitefield East", passengers: 118, status: "Approved", eta: "18:40" },
    { id: "BK-80293", department: "Plant B Workforce", route: "Hosur Industrial", passengers: 760, status: "In Progress", eta: "05:30" },
    { id: "BK-80294", department: "Leadership Event", route: "Airport Corridor", passengers: 36, status: "Pending", eta: "07:10" }
  ];

  readonly vehicles: Vehicle[] = [
    { unit: "EV-214", category: "Executive Sedan", driver: "A. Kumar", occupancy: "3/4", health: "98%", status: "Live" },
    { unit: "SH-611", category: "Staff Shuttle", driver: "R. Khan", occupancy: "34/40", health: "94%", status: "Live" },
    { unit: "VN-088", category: "Van", driver: "M. Devi", occupancy: "10/12", health: "91%", status: "Standby" },
    { unit: "LX-019", category: "Luxury Fleet", driver: "S. Rao", occupancy: "0/4", health: "82%", status: "Maintenance" }
  ];
}
