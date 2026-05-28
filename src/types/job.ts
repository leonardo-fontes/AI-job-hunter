export type Job = {
  title: string;
  company: string;
  link: string;
  description?: string;
  location?: string;
};

export type JobAnalysis = {
  compatibilityScore: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
};

export type AnalyzedJob = Job & {
  analysis: JobAnalysis;
};

export type JobStatus = "saved" | "ready_to_apply" | "applied" | "ignored";

export type SavedAnalyzedJob = {
  id: number;
  title: string;
  company: string;
  link: string;
  compatibilityScore: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  status: JobStatus;
  createdAt: string;
};