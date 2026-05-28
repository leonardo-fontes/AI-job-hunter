import { getDatabase, persistDatabase } from "./client";

export function runMigrations() {
  const db = getDatabase();

  db.run(`
    CREATE TABLE IF NOT EXISTS analyzed_jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      company TEXT NOT NULL,
      link TEXT NOT NULL UNIQUE,
      compatibility_score INTEGER NOT NULL,
      summary TEXT NOT NULL,
      strengths TEXT NOT NULL,
      weaknesses TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);

  const tableInfo = db.exec(`PRAGMA table_info(analyzed_jobs);`);

  const hasStatusColumn = tableInfo[0]?.values.some((column) => {
    return column[1] === "status";
  });

  if (!hasStatusColumn) {
    db.run(`
      ALTER TABLE analyzed_jobs
      ADD COLUMN status TEXT NOT NULL DEFAULT 'saved';
    `);
  }

  persistDatabase();
}