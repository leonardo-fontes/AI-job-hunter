import { loadProfileConfig } from "../config/profile";
import type { Job, JobAnalysis } from "../types/job";
import { openai } from "./openai";

export async function analyzeJob(job: Job): Promise<JobAnalysis> {
  const profile = loadProfileConfig();

  const prompt = `
You are an AI recruiter assistant.

Analyze if this job is a good match for this developer profile.

Developer profile:
- Role: ${profile.role}
- Summary: ${profile.summary}
- Skills: ${profile.skills.join(", ")}
- Years of experience: ${profile.yearsOfExperience}+
- Preferred work model: ${profile.preferredWorkModel}
- Minimum salary expectation: ${profile.minimumSalary}
- Accepted roles: ${profile.acceptedRoles.join(", ")}
- Positive signals: ${profile.positiveSignals.join(", ")}
- Negative signals: ${profile.negativeSignals.join(", ")}
- Rejected keywords: ${profile.rejectedKeywords.join(", ")}

Evaluation rules:
- Prefer jobs that match accepted roles and skills.
- Prefer remote jobs.
- Prefer international opportunities.
- Full Stack jobs are acceptable if they are frontend-heavy or TypeScript/Node.js based.
- Senior-level jobs are acceptable.
- Salary information is a strong positive only when it meets or exceeds the expectation.
- If salary is not mentioned, do not penalize the job.
- Penalize jobs that are clearly not remote.
- Penalize jobs focused on rejected keywords.
- Penalize jobs unrelated to the TypeScript/frontend/fullstack ecosystem.

Job:
Title: ${job.title}
Company: ${job.company}
Location: ${job.location ?? "Unknown"}

Description:
${job.description ?? "No description available"}

Return ONLY a valid JSON object.

JSON format:
{
  "compatibilityScore": number,
  "summary": string,
  "strengths": string[],
  "weaknesses": string[]
}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const content = response.choices[0].message.content;

  if (!content) {
    throw new Error("Empty AI response");
  }

  const cleanedContent = content
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(cleanedContent) as JobAnalysis;
}
