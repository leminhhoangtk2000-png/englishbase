import { NextRequest, NextResponse } from 'next/server';

// Store scheduled tasks
let scheduledTasks: NodeJS.Timeout[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body; // 'start' or 'stop'

    if (action === 'stop') {
      // Stop all scheduled tasks
      scheduledTasks.forEach(task => clearTimeout(task));
      scheduledTasks = [];
      
      return NextResponse.json({
        success: true,
        message: 'All scheduled tasks stopped',
        timestamp: new Date().toISOString()
      });
    }

    if (action === 'start') {
      // Clear existing tasks first
      scheduledTasks.forEach(task => clearTimeout(task));
      scheduledTasks = [];

      const baseUrl = `${request.nextUrl.protocol}//${request.nextUrl.host}`;
      
      // Schedule daily tasks
      scheduleDaily7AM(baseUrl);
      scheduleDaily12AM(baseUrl);

      return NextResponse.json({
        success: true,
        message: 'Scheduled tasks started',
        schedule: {
          crawling: '7:00 AM daily',
          cleanup: '12:00 AM daily (midnight)'
        },
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json(
      { error: 'Invalid action. Use "start" or "stop"' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error in scheduler:', error);
    return NextResponse.json(
      { error: 'Failed to manage scheduler', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'News Scheduler Status',
    activeTasks: scheduledTasks.length,
    schedule: {
      crawling: '7:00 AM daily - Auto crawl German news sources',
      cleanup: '12:00 AM daily - Delete all crawled content'
    },
    timezone: 'Local system time',
    timestamp: new Date().toISOString()
  });
}

function scheduleDaily7AM(baseUrl: string) {
  const scheduleNext7AM = () => {
    const now = new Date();
    const next7AM = new Date();
    next7AM.setHours(7, 0, 0, 0);
    
    // If it's past 7 AM today, schedule for tomorrow
    if (now.getTime() > next7AM.getTime()) {
      next7AM.setDate(next7AM.getDate() + 1);
    }
    
    const timeUntil7AM = next7AM.getTime() - now.getTime();
    
    console.log(`📅 Next crawling scheduled for: ${next7AM.toLocaleString()}`);
    
    const task = setTimeout(async () => {
      try {
        console.log('⏰ 7 AM - Starting scheduled crawling...');
        
        const response = await fetch(`${baseUrl}/api/admin/scheduled-crawl`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        
        const result = await response.json();
        console.log('📊 Crawling result:', result);
        
      } catch (error) {
        console.error('❌ Error in scheduled crawling:', error);
      }
      
      // Schedule next 7 AM
      scheduleNext7AM();
    }, timeUntil7AM);
    
    scheduledTasks.push(task);
  };
  
  scheduleNext7AM();
}

function scheduleDaily12AM(baseUrl: string) {
  const scheduleNext12AM = () => {
    const now = new Date();
    const next12AM = new Date();
    next12AM.setHours(0, 0, 0, 0);
    next12AM.setDate(next12AM.getDate() + 1); // Always next day at midnight
    
    const timeUntil12AM = next12AM.getTime() - now.getTime();
    
    console.log(`📅 Next cleanup scheduled for: ${next12AM.toLocaleString()}`);
    
    const task = setTimeout(async () => {
      try {
        console.log('⏰ 12 AM - Starting scheduled cleanup...');
        
        const response = await fetch(`${baseUrl}/api/admin/scheduled-cleanup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        
        const result = await response.json();
        console.log('🧹 Cleanup result:', result);
        
      } catch (error) {
        console.error('❌ Error in scheduled cleanup:', error);
      }
      
      // Schedule next 12 AM
      scheduleNext12AM();
    }, timeUntil12AM);
    
    scheduledTasks.push(task);
  };
  
  scheduleNext12AM();
}
