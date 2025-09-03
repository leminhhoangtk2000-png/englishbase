# AI Management System Documentation

⚠️ **CRITICAL: DO NOT MODIFY THE AI MANAGEMENT PAGE WITHOUT APPROVAL**

## Overview
The AI Management system at `/admin/ai-management` is a complete, stable implementation for managing AI providers with usage tracking and testing capabilities.

## Features

### ✅ Implemented & Stable
- **AI Provider Management**: Add, delete, and configure AI providers (OpenAI, Gemini, Claude)
- **Real-time Testing**: Test API connections with response time and token tracking  
- **Usage Analytics**: Comprehensive token and cost tracking for both usage and tests
- **Dashboard Overview**: 4-card summary with total requests, tokens, cost, and success rates
- **Responsive Design**: Mobile-friendly layout with proper spacing and hover effects

### 📊 Dashboard Metrics
1. **Total Requests**: Usage requests + Test requests
2. **Total Tokens**: Usage tokens + Test tokens (with breakdown)  
3. **Total Cost**: Usage cost + Test cost (with breakdown)
4. **Test Success Rate**: Color-coded based on performance

### 🔧 Technical Implementation

#### Database Schema
```sql
-- AI Providers
ai_providers (id, name, displayName, apiKey, models, defaultModel, etc.)

-- Usage Tracking  
ai_usage (id, providerId, promptTokens, responseTokens, totalTokens, cost, operation, etc.)

-- Test Results
ai_test_results (id, providerId, model, prompt, response, tokensUsed, cost, success, etc.)
```

#### API Endpoints
- `GET /api/admin/ai-providers` - List all providers
- `POST /api/admin/ai-providers` - Create new provider
- `DELETE /api/admin/ai-providers/[id]` - Delete provider
- `POST /api/admin/ai-providers/[id]/test` - Test API connection
- `GET /api/admin/ai-providers/[id]/stats` - Get usage statistics

#### Key Components
- **Frontend**: `/src/app/admin/ai-management/page.tsx` (594 lines)
- **Test API**: `/src/app/api/admin/ai-providers/[id]/test/route.ts`
- **Stats API**: `/src/app/api/admin/ai-providers/[id]/stats/route.ts`
- **Utils**: `/src/lib/ai-utils.ts` - Formatting functions

## Current Status (2025-09-03)

✅ **COMPLETE & PROTECTED**: System is stable and locked from modifications
✅ **INTEGRATED**: Connected to vocabulary search system via `use-vocabulary-search.ts`

### Integration Points
- **Vocabulary Search**: `/src/hooks/use-vocabulary-search.ts` now connects to AI Management system
  - Automatically uses active AI provider for vocabulary lookups
  - Handles JSON response parsing with markdown code block cleanup
  - Maintains fallback to mock responses if no active provider available
- **Vocabulary Page**: `/src/app/api/vocabulary/ai-search/route.ts` now uses AI Management system
  - Replaces Genkit flows with AI Management providers
  - Automatically saves AI-generated vocabulary to database
  - Tracks AI usage and costs in AI Management statistics
  - Smart caching: first search uses AI, subsequent searches use database
- **Usage**: 
  - Die-neuen article pages with VocabularySidebar automatically use active AI provider
  - Main vocabulary page (`/vocabulary`) uses AI Management for new word definitions
- **Token Tracking**: All vocabulary searches are tracked in AI usage statistics
- **Cost Management**: Real-time cost calculation for vocabulary AI calls

### Working Features ✅
- Provider CRUD operations
- Real API testing (OpenAI, Gemini, Claude)
- Token/cost calculation and tracking
- Database persistence
- Responsive UI design
- Error handling and notifications

### Sample Data
- **Usage**: 17 requests, 15,598 tokens, $0.0312 cost
- **Tests**: 10 tests, 760 tokens, $0.0046 cost  
- **Total**: 27 requests, 16,358 tokens, $0.0358 cost

## Usage Instructions

### Adding AI Providers
1. Click "Add Provider" button
2. Select provider type (OpenAI/Gemini/Claude/Custom)
3. Enter display name and API key
4. Configure default model and temperature
5. Save configuration

### Testing Connections
1. Click the test tube icon (🧪) for any provider
2. System sends test prompt to API
3. Displays response time, tokens used, and cost
4. Updates stats in real-time

### Monitoring Usage
- **Dashboard cards** show aggregated metrics
- **Provider table** shows per-provider breakdown
- **Color-coded success rates** indicate API health

## Development Notes

### Critical Logic Fixed
- **Issue**: Dashboard only showed usage tokens, not test tokens
- **Fix**: Updated calculations to include both usage and test data
- **Files Modified**: Frontend calculations for total tokens and cost

### Responsive Design
- Mobile-first grid layout: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`
- Proper spacing: `mb-8`, `gap-4`, `pt-6`
- Hover effects: `hover:shadow-md transition-shadow`
- Overflow handling: `overflow-x-auto` for tables

## Maintenance Guidelines

### ⚠️ DO NOT MODIFY
This system is stable and working correctly. Any changes should be:
1. **Documented** in this file first
2. **Tested** on development environment
3. **Approved** by project maintainer
4. **Backed up** before implementation

### Safe Operations
- Adding new provider types (update `providerModels` object)
- Modifying cost calculations (update pricing in test API)
- UI styling changes (non-breaking CSS updates)

### Risky Operations
- Database schema changes
- API endpoint modifications  
- Core logic alterations
- State management changes

## File Locations

### Core Files (PROTECTED)
```
src/app/admin/ai-management/page.tsx           # Main interface (594 lines)
src/app/api/admin/ai-providers/[id]/test/route.ts    # Test endpoint
src/app/api/admin/ai-providers/[id]/stats/route.ts   # Stats endpoint
src/lib/ai-utils.ts                            # Utility functions
prisma/schema.prisma                           # Database models (AIProvider, AIUsage, AITestResult)
```

### Backup Files
```
src/app/admin/ai-management/page-backup.tsx    # Backup before last fix
src/app/admin/ai-management/page-fixed.tsx     # Working version
```

## Support Information

### Database Queries
```sql
-- Check test results
SELECT COUNT(*), SUM("tokensUsed"), SUM(cost) FROM ai_test_results WHERE "providerId" = 'xxx';

-- Check usage data  
SELECT COUNT(*), SUM("totalTokens"), SUM(cost) FROM ai_usage WHERE "providerId" = 'xxx';
```

### API Testing
```bash
# Test provider connection
curl -X POST "http://localhost:9002/api/admin/ai-providers/[id]/test" \
  -H "Content-Type: application/json" \
  -d '{"testPrompt": "Test message"}'

# Get provider stats
curl "http://localhost:9002/api/admin/ai-providers/[id]/stats?days=7"
```

---

## Version History
- **2025-09-03**: Initial stable implementation with full features
- **2025-09-03**: Fixed token/cost calculation logic to include test data
- **2025-09-03**: Finalized responsive design and marked as stable

**Status**: ✅ STABLE - DO NOT MODIFY WITHOUT DOCUMENTATION UPDATE
