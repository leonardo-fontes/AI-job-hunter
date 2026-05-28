import { chromium } from "playwright";
import type { Job } from "../types/job";

export async function runLinkedinScraper(): Promise<Job[]> {
  const browser = await chromium.launch({
    headless: true,
  });

  const context = await browser.newContext({
    storageState: "storage/linkedin.json",
  });

  const page = await context.newPage();

  const search = "Frontend Angular React";

  const searchUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(
    search,
  )}&f_TPR=r86400`;

  await page.goto(searchUrl);
  await page.waitForTimeout(5000);

  const jobsElements = await page.locator(".job-card-container").all();

  const jobs: Job[] = [];

  for (const jobElement of jobsElements.slice(0, 10)) {
    try {
      const title = await jobElement
        .locator(".artdeco-entity-lockup__title a")
        .innerText();

      const company = await jobElement
        .locator(".artdeco-entity-lockup__subtitle")
        .innerText();

      const location = await jobElement
        .locator(".artdeco-entity-lockup__caption")
        .innerText()
        .catch(() => undefined);

      const rawLink = await jobElement
        .locator(".artdeco-entity-lockup__title a")
        .getAttribute("href");

      if (!rawLink) {
        continue;
      }

      const cleanLink = `https://linkedin.com${rawLink}`.split("?")[0];

      const jobDetailsPage = await context.newPage();

      await jobDetailsPage.goto(cleanLink);
      await jobDetailsPage.waitForTimeout(4000);

      const description = await jobDetailsPage
        .locator(".jobs-description")
        .innerText()
        .catch(() => undefined);

      await jobDetailsPage.close();

      jobs.push({
        title,
        company,
        link: cleanLink,
        location,
        description,
      });
    } catch (error) {
      console.log("Error parsing job");
    }
  }

  await browser.close();

  return jobs;
}