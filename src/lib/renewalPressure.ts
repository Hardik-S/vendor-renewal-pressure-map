export type RenewalRecord = {
  vendor: string;
  category: string;
  renewalDate: string;
  cancellationDeadline: string;
  owner: string;
  currentAnnualSpend: number;
  proposedAnnualSpend: number;
  usageSignal: string;
  evidence: string[];
  alternatives: string[];
  businessImpact: string;
};

export type RenewalPressure = RenewalRecord & {
  daysUntilCancellation: number;
  priceIncreasePercent: number;
  pressureScore: number;
  pressureLevel: "critical" | "watch" | "stable";
  nextAction: string;
  brief: string;
  scoreFactors: string[];
};

const referenceDate = new Date("2026-05-11T12:00:00-04:00");
const dayMs = 24 * 60 * 60 * 1000;

export function daysUntil(date: string, from = referenceDate): number {
  return Math.ceil((new Date(`${date}T12:00:00-04:00`).getTime() - from.getTime()) / dayMs);
}

function calculatePriceIncreasePercent(currentAnnualSpend: number, proposedAnnualSpend: number): number {
  if (currentAnnualSpend <= 0) {
    return proposedAnnualSpend > 0 ? 100 : 0;
  }

  return ((proposedAnnualSpend - currentAnnualSpend) / currentAnnualSpend) * 100;
}

export function scoreRenewal(record: RenewalRecord): RenewalPressure {
  const daysUntilCancellation = daysUntil(record.cancellationDeadline);
  const priceIncreasePercent = calculatePriceIncreasePercent(
    record.currentAnnualSpend,
    record.proposedAnnualSpend,
  );

  const factors: string[] = [];
  let score = 30;

  if (daysUntilCancellation <= 7) {
    score += 34;
    factors.push("Cancellation window closes inside 7 days");
  } else if (daysUntilCancellation <= 21) {
    score += 22;
    factors.push("Cancellation window closes inside 21 days");
  } else {
    score += 8;
    factors.push("Cancellation window is still outside the immediate scramble zone");
  }

  if (record.currentAnnualSpend <= 0 && record.proposedAnnualSpend > 0) {
    score += 22;
    factors.push("New spend request has no current contract baseline");
  } else if (priceIncreasePercent >= 30) {
    score += 22;
    factors.push("Price increase is above 30%");
  } else if (priceIncreasePercent >= 12) {
    score += 15;
    factors.push("Price increase is above 12%");
  } else {
    score += 6;
    factors.push("Price increase is modest but still worth anchoring");
  }

  if (/unassigned|turnover|who owns/i.test(record.owner)) {
    score += 18;
    factors.push("Ownership is ambiguous");
  } else {
    score += 4;
    factors.push("Named owner can run the renewal path");
  }

  if (/only|flat|optional|downgrade/i.test(record.usageSignal)) {
    score += 12;
    factors.push("Usage signal creates negotiation leverage");
  } else {
    score += 5;
    factors.push("Usage supports renewal but can still shape terms");
  }

  const pressureScore = Math.min(100, Math.round(score));
  const pressureLevel =
    pressureScore >= 78 ? "critical" : pressureScore >= 58 ? "watch" : "stable";

  const nextAction =
    pressureLevel === "critical"
      ? "Open a same-day negotiation thread and preserve cancellation leverage."
      : pressureLevel === "watch"
        ? "Schedule owner review before the vendor's pricing anchor hardens."
        : "Prepare term asks and benchmark alternatives before renewal approval.";

  const brief = [
    `${record.vendor} scores ${pressureScore}/100 because ${factors[0].toLowerCase()} and ${factors[1].toLowerCase()}.`,
    `Use evidence from ${record.evidence[0].toLowerCase()}`,
    `Next action: ${nextAction}`,
  ].join(" ");

  return {
    ...record,
    daysUntilCancellation,
    priceIncreasePercent,
    pressureScore,
    pressureLevel,
    nextAction,
    brief,
    scoreFactors: factors,
  };
}

export function rankRenewals(records: RenewalRecord[]): RenewalPressure[] {
  return records.map(scoreRenewal).sort((a, b) => b.pressureScore - a.pressureScore);
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}
