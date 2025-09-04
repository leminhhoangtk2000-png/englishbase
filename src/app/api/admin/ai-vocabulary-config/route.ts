import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Configuration for AI vocabulary search
interface AIVocabularyConfig {
  preferredProviderId: string | null;
  fallbackProviderIds: string[];
  enableAutoFallback: boolean;
  maxRetries: number;
}

// GET - Get current AI vocabulary configuration
export async function GET() {
  try {
    // Check if config exists in database
    let config = await prisma.aIVocabularyConfig.findFirst();
    
    if (!config) {
      // Create default configuration
      const activeProviders = await prisma.aIProvider.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'asc' }
      });

      config = await prisma.aIVocabularyConfig.create({
        data: {
          preferredProviderId: activeProviders[0]?.id || null,
          fallbackProviderIds: activeProviders.slice(1).map(p => p.id),
          enableAutoFallback: true,
          maxRetries: 3
        }
      });
    }

    // Get provider details
    const allProviders = await prisma.aIProvider.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        displayName: true,
        isActive: true
      }
    });

    const preferredProvider = allProviders.find(p => p.id === config.preferredProviderId);
    const fallbackProviders = allProviders.filter(p => 
      config.fallbackProviderIds.includes(p.id)
    );

    return NextResponse.json({
      success: true,
      data: {
        config: {
          preferredProviderId: config.preferredProviderId,
          fallbackProviderIds: config.fallbackProviderIds,
          enableAutoFallback: config.enableAutoFallback,
          maxRetries: config.maxRetries
        },
        providers: {
          preferred: preferredProvider || null,
          fallback: fallbackProviders,
          available: allProviders
        }
      }
    });
  } catch (error) {
    console.error('Error getting AI vocabulary config:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get configuration' },
      { status: 500 }
    );
  }
}

// POST - Update AI vocabulary configuration
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { preferredProviderId, fallbackProviderIds, enableAutoFallback, maxRetries } = body;

    // Validate inputs
    if (preferredProviderId) {
      const provider = await prisma.aIProvider.findFirst({
        where: { id: preferredProviderId, isActive: true }
      });
      if (!provider) {
        return NextResponse.json(
          { success: false, error: 'Invalid preferred provider ID' },
          { status: 400 }
        );
      }
    }

    if (fallbackProviderIds && Array.isArray(fallbackProviderIds)) {
      const validProviders = await prisma.aIProvider.findMany({
        where: { 
          id: { in: fallbackProviderIds },
          isActive: true 
        }
      });
      if (validProviders.length !== fallbackProviderIds.length) {
        return NextResponse.json(
          { success: false, error: 'Some fallback provider IDs are invalid' },
          { status: 400 }
        );
      }
    }

    // Update or create configuration
    const config = await prisma.aIVocabularyConfig.upsert({
      where: { id: 1 }, // Assuming single config record
      create: {
        preferredProviderId: preferredProviderId || null,
        fallbackProviderIds: fallbackProviderIds || [],
        enableAutoFallback: enableAutoFallback !== undefined ? enableAutoFallback : true,
        maxRetries: maxRetries || 3
      },
      update: {
        preferredProviderId: preferredProviderId || null,
        fallbackProviderIds: fallbackProviderIds || [],
        enableAutoFallback: enableAutoFallback !== undefined ? enableAutoFallback : true,
        maxRetries: maxRetries || 3
      }
    });

    return NextResponse.json({
      success: true,
      data: config
    });
  } catch (error) {
    console.error('Error updating AI vocabulary config:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update configuration' },
      { status: 500 }
    );
  }
}
