import type { RenewalRecord } from "../lib/renewalPressure";

export const renewalRecords: RenewalRecord[] = [
  {
    vendor: "Northstar Analytics",
    category: "Revenue intelligence",
    renewalDate: "2026-06-18",
    cancellationDeadline: "2026-05-17",
    owner: "Unassigned after RevOps turnover",
    currentAnnualSpend: 84200,
    proposedAnnualSpend: 106000,
    usageSignal: "Only 58% of paid seats active in the last 45 days",
    evidence: [
      "Renewal email cites a 20.5% uplift tied to enterprise support.",
      "Contract note says cancellation requires 30 days written notice.",
      "Slack export shows sales ops asking who owns this vendor.",
    ],
    alternatives: ["Existing CRM dashboards", "Lightweight BI export"],
    businessImpact:
      "Useful for pipeline calls, but adoption is concentrated in two managers.",
  },
  {
    vendor: "LedgerLoop",
    category: "AP automation",
    renewalDate: "2026-07-05",
    cancellationDeadline: "2026-06-05",
    owner: "Priya Raman, Finance Ops",
    currentAnnualSpend: 39600,
    proposedAnnualSpend: 42300,
    usageSignal: "Invoice matching volume rose 31% quarter over quarter",
    evidence: [
      "Vendor offered a two-year cap if signed before June 12.",
      "AP team flagged three manual exception queues still outside the tool.",
      "Finance owner has a current usage report and negotiation notes.",
    ],
    alternatives: ["Manual exception queue", "ERP-native matching module"],
    businessImpact:
      "Strong operational fit, but pricing should be tied to exception coverage.",
  },
  {
    vendor: "DeskPilot",
    category: "Internal support desk",
    renewalDate: "2026-05-29",
    cancellationDeadline: "2026-05-14",
    owner: "Marco Lee, IT",
    currentAnnualSpend: 22400,
    proposedAnnualSpend: 33600,
    usageSignal: "Ticket volume is flat while agent seats increased from 18 to 27",
    evidence: [
      "Renewal quote bundles AI assistant seats by default.",
      "Contract summary says downgrade requests need 15 days notice.",
      "IT owner asked procurement for benchmark pricing last week.",
    ],
    alternatives: ["Shared inbox workflow", "Existing project tracker intake"],
    businessImpact:
      "Support workflow matters, but bundled AI seats appear optional.",
  },
];
