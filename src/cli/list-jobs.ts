import { initDatabase } from "../database/client";
import { listRecentAnalyzedJobs } from "../database/jobs-repository";
import { runMigrations } from "../database/migrations";

async function main() {
  await initDatabase();
  runMigrations();

  const jobs = listRecentAnalyzedJobs();

  if (jobs.length === 0) {
    console.log("No saved jobs found.");
    return;
  }

  console.log("\nSaved jobs:\n");

  for (const job of jobs) {
    console.log(`#${job.id} - ${job.compatibilityScore}% - ${job.title}`);
    console.log(`Company: ${job.company}`);
    console.log(`Status: ${job.status}`);
    console.log(`Link: ${job.link}`);
    console.log(`Saved at: ${job.createdAt}`);
    console.log("-----------------------------------");
  }
}

main();