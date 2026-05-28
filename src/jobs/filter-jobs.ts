import { loadProfileConfig } from "../config/profile";
import type { Job } from "../types/job";

export function isPotentialMatch(job: Job): boolean {
  const profile = loadProfileConfig();

  const text = [
    job.title,
    job.company,
    job.location,
    job.description,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const acceptedKeywords = [
    ...profile.acceptedRoles,
    ...profile.skills,
    ...profile.positiveSignals,
  ].map((keyword) => keyword.toLowerCase());

  const rejectedKeywords = [
    ...profile.rejectedKeywords,
    ...profile.negativeSignals,
  ].map((keyword) => keyword.toLowerCase());

  const hasAcceptedKeyword = acceptedKeywords.some((keyword) =>
    text.includes(keyword),
  );

  const hasRejectedKeyword = rejectedKeywords.some((keyword) =>
    text.includes(keyword),
  );

  return hasAcceptedKeyword && !hasRejectedKeyword;
}