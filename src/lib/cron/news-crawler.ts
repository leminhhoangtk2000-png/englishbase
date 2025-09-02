// Cron job utilities for scheduling news crawling
import { prisma } from '@/lib/prisma';

export interface CronJobConfig {
  name: string;
  schedule: string; // Cron expression
  timezone: string;
  enabled: boolean;
  lastRun?: Date;
  nextRun?: Date;
}

// Default German news sources to crawl
export const DEFAULT_NEWS_SOURCES = [
  'https://www.spiegel.de',
  'https://www.zeit.de', 
  'https://www.sueddeutsche.de',
  'https://www.faz.net',
  'https://www.tagesschau.de',
  'https://www.welt.de',
  'https://www.focus.de'
];

// Cron job configurations
export const CRAWL_JOBS: CronJobConfig[] = [
  {
    name: 'morning_crawl',
    schedule: '0 7 * * *', // Every day at 7:00 AM
    timezone: 'Europe/Berlin',
    enabled: true
  },
  {
    name: 'evening_crawl', 
    schedule: '0 18 * * *', // Every day at 6:00 PM
    timezone: 'Europe/Berlin',
    enabled: true
  }
];

export async function executeNewsCrawl() {
  console.log('Starting scheduled news crawl...');
  
  for (const source of DEFAULT_NEWS_SOURCES) {
    try {
      // Create crawl job
      const crawlJob = await prisma.crawlJob.create({
        data: {
          source,
          status: 'RUNNING',
          articlesFound: 0,
          articlesAdded: 0,
        }
      });

      // Call our internal API to perform the crawl
      const response = await fetch(`${process.env.NEXTAUTH_URL}/api/admin/crawl-news`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: source,
          minWordCount: 2000
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log(`Crawl result for ${source}:`, result);

    } catch (error) {
      console.error(`Error crawling ${source}:`, error);
      
      // Update job as failed if it exists
      const failedJob = await prisma.crawlJob.findFirst({
        where: {
          source,
          status: 'RUNNING'
        },
        orderBy: {
          startedAt: 'desc'
        }
      });

      if (failedJob) {
        await prisma.crawlJob.update({
          where: { id: failedJob.id },
          data: {
            status: 'FAILED',
            errorMessage: error instanceof Error ? error.message : 'Unknown error',
            completedAt: new Date()
          }
        });
      }
    }

    // Add delay between sources to be respectful
    await new Promise(resolve => setTimeout(resolve, 5000));
  }

  console.log('Scheduled news crawl completed');
}

// Helper function to parse cron expression and get next run time
export function getNextRunTime(cronExpression: string, timezone: string = 'UTC'): Date {
  // This is a simplified implementation
  // In production, you might want to use a library like 'node-cron' or 'cron-parser'
  
  const now = new Date();
  const [minute, hour, dayOfMonth, month, dayOfWeek] = cronExpression.split(' ');
  
  // For our specific cases (7 AM and 6 PM daily)
  let nextRun = new Date(now);
  
  if (hour === '7') {
    nextRun.setHours(7, 0, 0, 0);
  } else if (hour === '18') {
    nextRun.setHours(18, 0, 0, 0);
  }
  
  // If the time has passed today, schedule for tomorrow
  if (nextRun <= now) {
    nextRun.setDate(nextRun.getDate() + 1);
  }
  
  return nextRun;
}

// In a real implementation, you would set up actual cron jobs
// This could be done with:
// 1. Node.js cron library
// 2. External cron service (like cron-job.org)
// 3. Cloud functions with scheduled triggers
// 4. GitHub Actions with cron triggers

export function setupCronJobs() {
  console.log('Cron jobs configured:', CRAWL_JOBS);
  console.log('Next runs:');
  
  CRAWL_JOBS.forEach(job => {
    if (job.enabled) {
      const nextRun = getNextRunTime(job.schedule, job.timezone);
      console.log(`${job.name}: ${nextRun.toLocaleString('de-DE', { timeZone: job.timezone })}`);
    }
  });
  
  // Note: In production, you would actually schedule these jobs here
  // For now, this just logs the configuration
}
