import { input, select } from "@inquirer/prompts";
import { initDatabase } from "../database/client";
import { listAnalyzedJobs, updateJobStatus } from "../database/jobs-repository";
import { runMigrations } from "../database/migrations";

import { JobStatus } from "../types/job";
import { sleep } from "../utils/sleep";
import { runWorker } from "../worker";

const VALID_STATUSES: JobStatus[] = [
  "saved",
  "ready_to_apply",
  "applied",
  "ignored",
];

async function listJobs() {
  await initDatabase();
  runMigrations();

  const jobs = listAnalyzedJobs();

  if (jobs.length === 0) {
    console.log("\nNo saved jobs found.\n");
    return;
  }

  console.log("\nSaved jobs:\n");

  for (const job of jobs) {
    console.log(`#${job.id} - ${job.compatibilityScore}% - ${job.title}`);
    console.log(`Company: ${job.company}`);
    console.log(`Status: ${job.status}`);
    console.log(`Link: ${job.link}`);
    console.log("-----------------------------------");
  }

  console.log("\nJobs listed successfully ✅");
  await sleep(2000);
}

async function changeJobStatus() {
  await initDatabase();
  runMigrations();

  const id = await input({
    message: "Job ID:",
  });

  const status = await select<JobStatus>({
    message: "New status:",
    choices: VALID_STATUSES.map((status) => ({
      name: status,
      value: status,
    })),
  });

  updateJobStatus(Number(id), status);

  console.log(`\nJob ${id} updated to status: ${status}\n`);

  console.log("\nJob status updated successfully ✅");
  await sleep(2000);
}

async function main() {
  while (true) {
    const action = await select({
      message: "What do you want to do?",
      choices: [
        { name: "List saved jobs", value: "list" },
        { name: "Update job status", value: "status" },
        { name: "Run job hunter now", value: "run" },
        { name: "Exit", value: "exit" },
      ],
    });

    if (action === "list") {
      await listJobs();
    }

    if (action === "status") {
      await changeJobStatus();
    }

    if (action === "run") {
      await runWorker();

      console.log("\nWorker finished successfully ✅");
      await sleep(2000);
    }

    if (action === "exit") {
      console.log("Bye 👋");
      break;
    }
  }
}

main();
