# AI Job Hunter

AI-powered autonomous job hunting pipeline built with:

- Node.js
- TypeScript
- Playwright
- OpenAI
- SQLite

The worker automatically:

- Searches LinkedIn jobs from the last 24 hours
- Filters jobs based on your profile
- Uses AI to score compatibility
- Saves matching jobs into SQLite
- Avoids duplicate jobs
- Automatically removes jobs older than 30 days
- Can run automatically with cron

---

# Setup

## Clone repository

```bash
git clone <repository-url>
cd job-agent
```

## Install dependencies

```bash
pnpm install
npx playwright install
```

## Environment variables

Create `.env`:

```env
OPENAI_API_KEY=your_openai_api_key
```

## Create profile configuration

```bash
cp profile.config.example.json profile.config.json
```

Customize the profile according to your preferences.

---

# First Time Setup

1. Start the application:

```bash
pnpm jobs
```

2. Select:

```txt
Run job hunter now
```

3. A Playwright browser window will open.

4. Login to LinkedIn manually.

5. After login, the session will be persisted automatically in:

```txt
storage/linkedin.json
```

Future executions will reuse the saved session automatically.

---

# Usage

Start the application:

```bash
pnpm jobs
```

The interactive CLI allows you to:

- Run the worker manually
- List saved jobs
- Update job status

When running the worker, the system will:

- Search LinkedIn jobs from the last 24 hours
- Filter matching opportunities
- Analyze jobs with AI
- Save compatible jobs into SQLite
- Automatically clean old jobs after 30 days

Jobs can be managed directly from the terminal using statuses:

- saved
- ready_to_apply
- applied
- ignored

---

# Optional: Cron Automation

If you want the worker to run automatically every day:

```bash
crontab -e
```

Add:

```cron
0 7 * * * cd /job-agent && /usr/bin/pnpm jobs >> /job-agent/logs/cron.log 2>&1
```

This will execute the project every day at 7:00 AM.

---

# Workflow

```txt
LinkedIn Scraper
→ Local Filters
→ OpenAI Analysis
→ SQLite Persistence
→ CLI Management
```

````

---

# Tips

## Run the browser invisibly

After the first successful login, you can make Playwright run without opening the browser.

Inside:

```txt
src/linkedin/scraper.ts
````

Change:

```ts
headless: false;
```

To:

```ts
headless: true;
```

This is recommended for automation environments.

---

## Run automatically every day

You can optionally use cron to execute the worker daily.

Example:

```cron
0 7 * * * cd /job-agent && /usr/bin/pnpm jobs >> /job-agent/logs/cron.log 2>&1
```

---

## Customize your profile

You can fully customize the matching logic using:

```txt
profile.config.json
```

Including:

- preferred roles
- skills
- salary expectations
- remote preferences
- accepted/rejected keywords

```



```
