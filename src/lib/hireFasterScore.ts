// src/lib/hireFasterScore.ts
// Computes the Orspex "Hire Faster Score" (0–100) from hiring signals.

export type HireFasterInput = {
  salaryDisclosed?: boolean | null;
  visaSponsorship?: boolean | null;
  verifiedEmployer?: boolean | null;
  interviewProcess?: string | null;
  responseDays?: number | null;
};

export type ScoreLabel =
  | "New"
  | "Responds Same Day"
  | "Fast Hire"
  | "Moderate"
  | "Slow"
  | "Very Slow";

export type ScoreColor = "gray" | "green" | "emerald" | "amber" | "orange" | "red";

export type ScoreBreakdown = {
  score: number;
  label: ScoreLabel;
  color: ScoreColor;
  breakdown: {
    salaryDisclosed: number;
    visaSponsorship: number;
    verifiedEmployer: number;
    interviewProcess: number;
    responseWithin7Days: number;
  };
};

export function computeHireFasterScore(input: HireFasterInput): ScoreBreakdown {
  const breakdown = {
    salaryDisclosed:     input.salaryDisclosed ? 20 : 0,
    visaSponsorship:     input.visaSponsorship ? 20 : 0,
    verifiedEmployer:    input.verifiedEmployer ? 20 : 0,
    interviewProcess:    input.interviewProcess && input.interviewProcess.trim().length > 10 ? 20 : 0,
    responseWithin7Days:
      input.responseDays != null && input.responseDays > 0 && input.responseDays <= 7 ? 20 : 0,
  };

  const score = Object.values(breakdown).reduce((a, b) => a + b, 0);

  // ── Label + color driven by BOTH score and responseDays ──
  let label: ScoreLabel;
  let color: ScoreColor;

  if (input.responseDays == null) {
    // No data yet — don't punish the employer
    label = "New";
    color = "gray";
  } else if (input.responseDays === 0) {
    // Responds immediately — this is the BEST signal
    label = "Responds Same Day";
    color = "green";
  } else if (input.responseDays <= 3) {
    label = "Fast Hire";
    color = "emerald";
  } else if (input.responseDays <= 7) {
    label = "Moderate";
    color = "amber";
  } else if (input.responseDays <= 14) {
    label = "Slow";
    color = "orange";
  } else {
    label = "Very Slow";
    color = "red";
  }

  return { score, label, color, breakdown };
}