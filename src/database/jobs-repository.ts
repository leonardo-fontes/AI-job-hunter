
import { AnalyzedJob, JobStatus } from "../types/job";
import { getDatabase, persistDatabase } from "./client";





type SavedAnalyzedJob = {
  id: number;
  title: string;
  company: string;
  link: string;
  compatibilityScore: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  createdAt: string;
  status: JobStatus;
};

export function deleteOldAnalyzedJobs(days = 30) {
  const db = getDatabase();

  db.run(
    `
      DELETE FROM analyzed_jobs
      WHERE created_at < datetime('now', ?)
    `,
    [`-${days} days`],
  );

  persistDatabase();
}

export function updateJobStatus(id: number, status: JobStatus) {
  const db = getDatabase();

  const statement = db.prepare(`
    UPDATE analyzed_jobs
    SET status = ?
    WHERE id = ?
  `);

  statement.run([status, id]);
  statement.free();

  persistDatabase();
}

export function jobExists(link: string): boolean {
  const db = getDatabase();

  const result = db.exec(
    `
      SELECT id
      FROM analyzed_jobs
      WHERE link = ?
      LIMIT 1
    `,
    [link],
  );

  return result.length > 0;
}

export function saveAnalyzedJob(job: AnalyzedJob) {
  const db = getDatabase();

  const statement = db.prepare(`
    INSERT OR IGNORE INTO analyzed_jobs (
      title,
      company,
      link,
      compatibility_score,
      summary,
      strengths,
      weaknesses,
      created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  statement.run([
    job.title,
    job.company,
    job.link,
    job.analysis.compatibilityScore,
    job.analysis.summary,
    JSON.stringify(job.analysis.strengths),
    JSON.stringify(job.analysis.weaknesses),
    new Date().toISOString(),
  ]);

  statement.free();

  persistDatabase();
}

export function listAnalyzedJobs(): SavedAnalyzedJob[] {
  const db = getDatabase();

  const result = db.exec(`
    SELECT
      id,
      title,
      company,
      link,
      compatibility_score,
      summary,
      strengths,
      weaknesses,
      status,
      created_at
    FROM analyzed_jobs
    ORDER BY compatibility_score DESC;
  `);

  if (result.length === 0) {
    return [];
  }

  const values = result[0].values;

  return values.map((row) => ({
    id: Number(row[0]),
    title: String(row[1]),
    company: String(row[2]),
    link: String(row[3]),
    compatibilityScore: Number(row[4]),
    summary: String(row[5]),
    strengths: JSON.parse(String(row[6])),
    weaknesses: JSON.parse(String(row[7])),
    status: String(row[8]) as JobStatus,
    createdAt: String(row[9]),
  }));
}
