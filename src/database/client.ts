import fs from 'node:fs';
import path from 'node:path';
import initSqlJs, { type Database } from 'sql.js';

const dbPath = path.resolve('data/jobs.db');

let db: Database;

export async function initDatabase() {
  const SQL = await initSqlJs();

  if (fs.existsSync(dbPath)) {
    const fileBuffer = fs.readFileSync(dbPath);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  return db;
}

export function getDatabase() {
  if (!db) {
    throw new Error('Database not initialized');
  }

  return db;
}

export function persistDatabase() {
  const data = db.export();
  fs.writeFileSync(dbPath, Buffer.from(data));
}