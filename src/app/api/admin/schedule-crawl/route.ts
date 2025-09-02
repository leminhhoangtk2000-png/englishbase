import { NextRequest, NextResponse } from 'next/server';
import { executeNewsCrawl, CRAWL_JOBS, getNextRunTime } from '@/lib/cron/news-crawler';

export async function POST(request: NextRequest) {
  try {
    // Execute the news crawl
    await executeNewsCrawl();

    return NextResponse.json({
      message: 'Scheduled crawl executed successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error executing scheduled crawl:', error);
    return NextResponse.json(
      { error: 'Failed to execute scheduled crawl', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Return cron job status and schedule
    const jobsWithNextRun = CRAWL_JOBS.map(job => ({
      ...job,
      nextRun: job.enabled ? getNextRunTime(job.schedule, job.timezone) : null
    }));

    return NextResponse.json({
      jobs: jobsWithNextRun,
      timezone: 'Europe/Berlin',
      currentTime: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error getting cron job status:', error);
    return NextResponse.json(
      { error: 'Failed to get cron job status' },
      { status: 500 }
    );
  }
}
