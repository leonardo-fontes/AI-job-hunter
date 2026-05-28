import { analyzeJob } from "./ai/analyze-job";
import { initDatabase } from "./database/client";
import { deleteOldAnalyzedJobs, jobExists, saveAnalyzedJob } from "./database/jobs-repository";
import { runMigrations } from "./database/migrations";
import { isPotentialMatch } from "./jobs/filter-jobs";
import { runLinkedinScraper } from "./linkedin/scraper";
import { AnalyzedJob } from "./types/job";

export async function runWorker() {
  console.log("AI Job Hunter started 🚀");

  await initDatabase();

  runMigrations();

  deleteOldAnalyzedJobs(30);

  const jobs = await runLinkedinScraper();

  if (jobs.length === 0) {
    console.log("No jobs found");
    return;
  }

  const newJobs = jobs.filter((job) => !jobExists(job.link));

  const candidateJobs = newJobs.filter(isPotentialMatch);

  if (newJobs.length === 0) {
    console.log("No new jobs found");
    return;
  }

  const minimumScore = 75;

  let savedJobsCount = 0;
  let ignoredByScoreCount = 0;

  for (const job of candidateJobs) {
    console.log(`\nAnalyzing: ${job.title}\n`);

    const analysis = await analyzeJob(job);

    if (analysis.compatibilityScore < minimumScore) {
      console.log(
        `Job ignored. Score ${analysis.compatibilityScore} is below ${minimumScore}.`,
      );
      ignoredByScoreCount++;
      continue;
    }

    const analyzedJob: AnalyzedJob = {
      ...job,
      analysis,
    };

    saveAnalyzedJob(analyzedJob);

    savedJobsCount++;

    console.log("\nRun summary:");
    console.log(`Jobs found: ${jobs.length}`);
    console.log(`New jobs: ${newJobs.length}`);
    console.log(`Candidate jobs: ${candidateJobs.length}`);
    console.log(`Saved jobs: ${savedJobsCount}`);
    console.log(`Ignored by score: ${ignoredByScoreCount}`);
  }

  console.log(`\n${savedJobsCount} compatible jobs saved today 🚀`);
}