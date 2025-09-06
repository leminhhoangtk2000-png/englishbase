import { NextRequest } from 'next/server'
import { getNiveauContent } from '@/lib/markdown'

export async function GET(
  request: NextRequest,
  { params }: { params: { niveau: string; section: string } }
) {
  try {
    const { niveau, section } = params
    const content = getNiveauContent(niveau)
    
    // Find the specific section
    const targetSection = content.sections.find(s => s.name === section)
    
    if (!targetSection) {
      return Response.json({
        success: false,
        error: `Section '${section}' not found in niveau '${niveau}'`,
        availableSections: content.sections.map(s => s.name)
      }, { status: 404 })
    }
    
    return Response.json({
      success: true,
      niveau,
      section,
      totalItems: targetSection.items.length,
      items: targetSection.items.map(item => ({
        title: item.title,
        description: item.description,
        slug: item.slug,
        order: item.order,
        tags: item.tags
      }))
    })
  } catch (error) {
    console.error('Debug API error:', error)
    return Response.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      niveau: params.niveau,
      section: params.section
    }, { status: 500 })
  }
}
