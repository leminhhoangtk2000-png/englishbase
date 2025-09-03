import { prisma } from '@/lib/prisma';

async function createSampleUsageData() {
  try {
    // Get the existing provider
    const provider = await prisma.aIProvider.findFirst({
      where: { name: 'openai' }
    });

    if (!provider) {
      console.log('No provider found');
      return;
    }

    console.log('Found provider:', provider.displayName);

    // Create sample usage data for the past 7 days
    const usageData = [];
    const now = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);

      // Create multiple usage entries per day
      for (let j = 0; j < Math.floor(Math.random() * 5) + 1; j++) {
        const promptTokens = Math.floor(Math.random() * 1000) + 100;
        const responseTokens = Math.floor(Math.random() * 500) + 50;
        const totalTokens = promptTokens + responseTokens;
        
        // Rough cost calculation (OpenAI pricing)
        const costPerToken = 0.000002; // ~$0.002 per 1K tokens for GPT-4o-mini
        const cost = totalTokens * costPerToken;

        usageData.push({
          providerId: provider.id,
          model: provider.defaultModel || 'gpt-4o-mini',
          operation: ['vocabulary_search', 'translation', 'chat', 'exercise_check'][Math.floor(Math.random() * 4)],
          promptTokens,
          responseTokens,
          totalTokens,
          cost,
          success: Math.random() > 0.1, // 90% success rate
          metadata: {
            user_id: `user_${Math.floor(Math.random() * 100)}`,
            request_type: 'api_call'
          },
          createdAt: date
        });
      }
    }

    // Insert all usage data
    console.log(`Creating ${usageData.length} usage records...`);
    await prisma.aIUsage.createMany({
      data: usageData
    });

    // Create some test results
    const testResults = [];
    for (let i = 0; i < 5; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - Math.floor(Math.random() * 7));

      const success = Math.random() > 0.2; // 80% success rate
      const responseTime = Math.floor(Math.random() * 2000) + 500; // 500-2500ms
      const tokensUsed = success ? Math.floor(Math.random() * 200) + 50 : 0;
      const cost = success ? tokensUsed * 0.000002 : 0;

      testResults.push({
        providerId: provider.id,
        model: provider.defaultModel || 'gpt-4o-mini',
        prompt: 'Hello! This is a connection test. Please respond with "Test successful" to confirm the API is working.',
        response: success ? 'Test successful! The API is working correctly.' : null,
        success,
        error: success ? null : 'API key invalid or rate limit exceeded',
        responseTime,
        tokensUsed,
        cost,
        createdAt: date
      });
    }

    console.log(`Creating ${testResults.length} test results...`);
    await prisma.aITestResult.createMany({
      data: testResults
    });

    console.log('Sample data created successfully!');

    // Display summary
    const summary = await prisma.aIUsage.aggregate({
      where: { providerId: provider.id },
      _sum: {
        totalTokens: true,
        cost: true
      },
      _count: {
        id: true
      }
    });

    console.log('\nUsage Summary:');
    console.log(`Total requests: ${summary._count.id}`);
    console.log(`Total tokens: ${summary._sum.totalTokens?.toLocaleString()}`);
    console.log(`Total cost: $${summary._sum.cost?.toFixed(4)}`);

  } catch (error) {
    console.error('Error creating sample data:', error);
  }
}

createSampleUsageData()
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
