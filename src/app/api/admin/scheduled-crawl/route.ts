import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('🕰️ Scheduled crawling started at:', new Date().toISOString());

    // Get the base URL from the request
    const protocol = request.headers.get('x-forwarded-proto') || 'http';
    const host = request.headers.get('host') || 'localhost:9002';
    const baseUrl = `${protocol}://${host}`;

    // Crawl from multiple German news sources
    const sources = [
      'https://www.tagesschau.de',
      'https://www.spiegel.de',
      'https://www.zeit.de'
    ];

    const results = [];

    for (const source of sources) {
      try {
        console.log(`📰 Crawling from: ${source}`);
        
        const crawlResponse = await fetch(`${baseUrl}/api/admin/crawl-news`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: source,
            maxArticles: 5,
            minWordCount: 2000,
            maxWordCount: 4000
          })
        });

        const crawlResult = await crawlResponse.json();
        results.push({
          source,
          success: crawlResult.success,
          articlesFound: crawlResult.articlesFound,
          articlesAdded: crawlResult.articlesAdded
        });

        console.log(`✅ ${source}: Found ${crawlResult.articlesFound}, Added ${crawlResult.articlesAdded}`);
        
        // Wait between requests to be respectful
        await new Promise(resolve => setTimeout(resolve, 2000));

      } catch (error) {
        console.error(`❌ Error crawling ${source}:`, error);
        results.push({
          source,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    // After crawling, run Vietnamese analysis
    console.log('🧠 Starting Vietnamese analysis...');
    try {
      const analysisResponse = await fetch(`${baseUrl}/api/admin/batch-analyze-vietnamese`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const analysisResult = await analysisResponse.json();
      console.log(`🎯 Analysis completed: ${analysisResult.analyzed} analyzed, ${analysisResult.interesting} interesting`);
      
      results.push({
        analysis: {
          success: analysisResult.success,
          analyzed: analysisResult.analyzed,
          interesting: analysisResult.interesting
        }
      });

    } catch (error) {
      console.error('❌ Error in analysis:', error);
      results.push({
        analysis: {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      });
    }

    const totalFound = results.reduce((sum, r) => sum + (r.articlesFound || 0), 0);
    const totalAdded = results.reduce((sum, r) => sum + (r.articlesAdded || 0), 0);

    console.log(`🏁 Scheduled crawling completed. Total found: ${totalFound}, Total added: ${totalAdded}`);

    return NextResponse.json({
      success: true,
      message: `Scheduled crawling completed`,
      timestamp: new Date().toISOString(),
      summary: {
        totalFound,
        totalAdded,
        sourcesProcessed: sources.length
      },
      results
    });

  } catch (error) {
    console.error('❌ Error in scheduled crawling:', error);
    return NextResponse.json(
      { 
        error: 'Failed to perform scheduled crawling', 
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
