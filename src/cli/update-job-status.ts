import { initDatabase } from "../database/client";
import {
  updateJobStatus,
} from "../database/jobs-repository";
import { JobStatus } from "../types/job";

const VALID_STATUSES: JobStatus[] = [
  "saved",
  "ready_to_apply",
  "applied",
  "ignored",
];

async function main() {
  const [, , idArg, statusArg] = process.argv;

  const id = Number(idArg);
  const status = statusArg as JobStatus;

  if (!id || !VALID_STATUSES.includes(status)) {
    console.log("Usage: pnpm jobs:status <jobId> <status>");
    console.log(`Valid statuses: ${VALID_STATUSES.join(", ")}`);
    process.exit(1);
  }

  await initDatabase();

  updateJobStatus(id, status);

  console.log(`Job ${id} updated to status: ${status}`);
}

main();