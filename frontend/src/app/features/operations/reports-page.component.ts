import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: "motus-reports-page",
  standalone: true,
  imports: [MatButtonModule],
  template: `
    <div class="grid gap-6">
      <section class="enterprise-card p-7">
        <p class="eyebrow">Reports & Analytics</p>
        <div class="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 class="mt-2 text-3xl font-black tracking-[-0.03em]">Transport intelligence and billing visibility.</h2>
            <p class="mt-3 max-w-2xl text-slate-600">Generate utilization reports, invoice exports, SLA scorecards, route performance, and department chargeback summaries.</p>
          </div>
          <button mat-raised-button color="primary">Download Export</button>
        </div>
      </section>
      <section class="grid gap-5 md:grid-cols-3">
        @for (report of reports; track report.title) {
          <article class="enterprise-card p-6">
            <p class="text-xs font-black uppercase tracking-[0.16em] text-electric">{{ report.type }}</p>
            <h3 class="mt-3 text-2xl font-black">{{ report.title }}</h3>
            <p class="mt-3 text-sm leading-6 text-slate-600">{{ report.description }}</p>
            <div class="mt-6 h-28 rounded-3xl bg-gradient-to-br from-slate-100 to-blue-50"></div>
          </article>
        }
      </section>
    </div>
  `
})
export class ReportsPageComponent {
  readonly reports = [
    { type: "Utilization", title: "Fleet utilization", description: "Capacity consumption, vehicle idle time, vendor split, and EV/ICE/hybrid performance." },
    { type: "Finance", title: "Invoice generation", description: "Department chargebacks, vendor invoices, exception billing, and downloadable exports." },
    { type: "Reliability", title: "SLA analytics", description: "On-time performance, route variance, missed pickup risk, and escalation patterns." }
  ];
}
