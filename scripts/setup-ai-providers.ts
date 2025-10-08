import { prisma } from '../src/lib/prisma.js';

async function setupAIProviders() {
  console.log('🚀 Setting up AI Providers...');
  
  // 1. OpenAI GPT
  const openai = await prisma.aIProvider.upsert({
    where: { name: 'openai' },
    update: {},
    create: {
      name: 'openai',
      displayName: 'OpenAI GPT',
      apiKey: process.env.OPENAI_API_KEY || '',
      baseUrl: 'https://api.openai.com/v1',
      defaultModel: 'gpt-4o-mini',
      temperature: 0.7,
      maxTokens: 1000,
      isActive: true,
      models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo']
    }
  });

  // 2. Google Gemini
  const gemini = await prisma.aIProvider.upsert({
    where: { name: 'gemini' },
    update: {},
    create: {
      name: 'gemini',
      displayName: 'Google Gemini',
      apiKey: process.env.GOOGLE_GENAI_API_KEY || '',
      baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
      defaultModel: 'gemini-1.5-flash',
      temperature: 0.7,
      maxTokens: 1000,
      isActive: true,
      models: ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-pro']
    }
  });

  // 3. DeepSeek
  const deepseek = await prisma.aIProvider.upsert({
    where: { name: 'deepseek' },
    update: {},
    create: {
      name: 'deepseek',
      displayName: 'DeepSeek',
      apiKey: process.env.DEEPSEEK_API_KEY || '',
      baseUrl: 'https://api.deepseek.com/v1',
      defaultModel: 'deepseek-chat',
      temperature: 0.7,
      maxTokens: 1000,
      isActive: true,
      models: ['deepseek-chat', 'deepseek-coder']
    }
  });

  console.log('✅ Created AI Providers:');
  console.log(`   - OpenAI GPT: ${openai.id}`);
  console.log(`   - Google Gemini: ${gemini.id}`);
  console.log(`   - DeepSeek: ${deepseek.id}`);

  // Create default AI vocabulary config
  const config = await prisma.aIVocabularyConfig.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      preferredProviderId: gemini.id, // Default to Gemini
      fallbackProviderIds: [openai.id, deepseek.id],
      enableAutoFallback: true,
      maxRetries: 3
    }
  });

  console.log('✅ Created AI Vocabulary Config with Gemini as preferred provider');
  
  return { openai, gemini, deepseek, config };
}

async function main() {
  try {
    await setupAIProviders();
    console.log('🎉 AI Providers setup completed!');
  } catch (error) {
    console.error('❌ Error setting up AI providers:', error);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}

export { setupAIProviders };
