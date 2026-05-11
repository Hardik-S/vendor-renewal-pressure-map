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

  it("creates action briefs with source evidence and next timing", () => {
    const scored = scoreRenewal(renewalRecords[0]);

    expect(scored.brief).toContain("Northstar Analytics scores");
    expect(scored.brief).toContain("renewal email cites");
    expect(scored.brief).toContain("Next action:");
  });
});
