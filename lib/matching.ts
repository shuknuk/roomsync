import { campusLabels, cleanlinessLabels, guestLabels, housingLabels, noiseLabels, sleepLabels, studyLabels } from "./data";
import type { CompatibilityResult, Lifestyle } from "./types";

type ScoredField = {
  match: boolean;
  points: number;
  reason: string;
};

function rangesOverlap(aMin: number, aMax: number, bMin: number, bMax: number) {
  return Math.max(aMin, bMin) <= Math.min(aMax, bMax);
}

function compatibleFlexible<T extends string>(a: T, b: T, flexible: T) {
  return a === b || a === flexible || b === flexible;
}

export function getCompatibility(user: Lifestyle, profile: Lifestyle): CompatibilityResult {
  const fields: ScoredField[] = [
    {
      match: compatibleFlexible(user.sleep, profile.sleep, "balanced"),
      points: 16,
      reason: `Sleep routines align around ${sleepLabels[profile.sleep].toLowerCase()}.`,
    },
    {
      match: user.cleanliness === profile.cleanliness || profile.cleanliness === "moderate" || user.cleanliness === "moderate",
      points: 15,
      reason: `Cleanliness expectations are close: ${cleanlinessLabels[profile.cleanliness].toLowerCase()}.`,
    },
    {
      match: user.study === profile.study || user.study === "library" || profile.study === "library",
      points: 14,
      reason: `Study habits fit with ${studyLabels[profile.study].toLowerCase()}.`,
    },
    {
      match: user.guests === profile.guests || profile.guests === "sometimes" || user.guests === "sometimes",
      points: 12,
      reason: `Guest preferences are compatible: ${guestLabels[profile.guests].toLowerCase()}.`,
    },
    {
      match: user.noise === profile.noise || user.noise === "medium" || profile.noise === "medium",
      points: 12,
      reason: `Noise tolerance is workable: ${noiseLabels[profile.noise].toLowerCase()}.`,
    },
    {
      match: rangesOverlap(user.budgetMin, user.budgetMax, profile.budgetMin, profile.budgetMax),
      points: 13,
      reason: `Budgets overlap around $${Math.max(user.budgetMin, profile.budgetMin)}-$${Math.min(user.budgetMax, profile.budgetMax)}.`,
    },
    {
      match: compatibleFlexible(user.housing, profile.housing, "either"),
      points: 10,
      reason: `Housing preference works for ${housingLabels[profile.housing].toLowerCase()}.`,
    },
    {
      match: compatibleFlexible(user.campus, profile.campus, "any"),
      points: 8,
      reason: `Campus preference fits ${campusLabels[profile.campus]}.`,
    },
  ];

  const total = fields.reduce((sum, field) => sum + field.points, 0);
  const earned = fields.reduce((sum, field) => sum + (field.match ? field.points : 0), 0);
  const reasons = fields.filter((field) => field.match).slice(0, 3).map((field) => field.reason);

  return {
    score: Math.round((earned / total) * 100),
    reasons: reasons.length > 0 ? reasons : ["A few preferences differ, but this profile may still be worth reviewing."],
  };
}
