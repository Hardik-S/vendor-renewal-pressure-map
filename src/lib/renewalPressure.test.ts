import { describe, expect, it } from "vitest";
import { renewalRecords } from "../data/renewals";
import { rankRenewals, scoreRenewal } from "./renewalPressure";

describe("renewal pressure scoring", () => {
  it("prioritizes urgent cancellation windows with owner ambiguity", () => {
    const ranked = rankRenewals(renewalRecords);

    expect(ranked[0].vendor).toBe("Northstar Analytics");
    expect(ranked[0].pressureLevel).toBe("critical");
    expect(ranked[0].scoreFactors).toContain("Ownership is ambiguous");
  });

  it("calculates price increase percentages from current and proposed spend", () => {
    const deskPilot = renewalRecords.find((record) => record.vendor === "DeskPilot");

    expect(scoreRenewal(deskPilot!).priceIncreasePercent).toBeCloseTo(50, 1);
  });

  it("breaks equal pressure scores by the earliest cancellation deadline", () => {
    const ranked = rankRenewals([
      {
        vendor: "Later Same-Score Vendor",
        category: "Workflow",
        renewalDate: "2026-06-30",
        cancellationDeadline: "2026-05-28",
        owner: "Procurement",
        currentAnnualSpend: 20000,
        proposedAnnualSpend: 23000,
        usageSignal: "Usage supports renewal",
        evidence: ["Renewal notice includes proposed pricing."],
        alternatives: ["Manual workaround"],
        businessImpact: "Same pressure as the earlier deadline except for timing.",
      },
      {
        vendor: "Earlier Same-Score Vendor",
        category: "Workflow",
        renewalDate: "2026-06-30",
        cancellationDeadline: "2026-05-20",
        owner: "Procurement",
        currentAnnualSpend: 20000,
        proposedAnnualSpend: 23000,
        usageSignal: "Usage supports renewal",
        evidence: ["Renewal notice includes proposed pricing."],
        alternatives: ["Manual workaround"],
        businessImpact: "Same pressure as the later deadline except for timing.",
      },
    ]);

    expect(ranked.map((record) => record.vendor)).toEqual([
      "Earlier Same-Score Vendor",
      "Later Same-Score Vendor",
    ]);
    expect(ranked[0].pressureScore).toBe(ranked[1].pressureScore);
  });

  it("keeps proposed new spend from rendering infinite uplift", () => {
    const scored = scoreRenewal({
      vendor: "PilotDesk",
      category: "Support pilot",
      renewalDate: "2026-06-20",
      cancellationDeadline: "2026-05-18",
      owner: "Unassigned during procurement handoff",
      currentAnnualSpend: 0,
      proposedAnnualSpend: 18000,
      usageSignal: "Only pilot usage captured in two departments",
      evidence: ["Quote converts a free pilot into a paid annual contract."],
      alternatives: ["Continue manual intake"],
      businessImpact: "Useful pilot, but spend has no prior contract baseline.",
    });

    expect(Number.isFinite(scored.priceIncreasePercent)).toBe(true);
    expect(scored.priceIncreasePercent).toBe(100);
    expect(scored.scoreFactors).toContain("New spend request has no current contract baseline");
  });

  it("creates action briefs with source evidence and next timing", () => {
    const scored = scoreRenewal(renewalRecords[0]);

    expect(scored.brief).toContain("Northstar Analytics scores");
    expect(scored.brief).toContain("renewal email cites");
    expect(scored.brief).toContain("Next action:");
  });

  it("keeps the action brief readable when renewal evidence is missing", () => {
    const scored = scoreRenewal({
      vendor: "EvidenceGap CRM",
      category: "CRM",
      renewalDate: "2026-07-01",
      cancellationDeadline: "2026-05-20",
      owner: "Revenue Operations",
      currentAnnualSpend: 24000,
      proposedAnnualSpend: 26000,
      usageSignal: "Usage supports renewal but no source artifacts were attached",
      evidence: [],
      alternatives: ["Delay approval until source artifacts are attached"],
      businessImpact: "Sales operations needs a decision packet before renewal approval.",
    });

    expect(scored.brief).toContain("Evidence gap: attach at least one renewal source before approval.");
    expect(scored.brief).toContain("Next action:");
  });
});
