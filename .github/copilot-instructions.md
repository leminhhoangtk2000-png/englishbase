# AI Coding Agent Instructions for Edu-theme

## ⚠️ PROTECTED SYSTEMS - DO NOT MODIFY

### AI Management System (STABLE)
**Location**: `/admin/ai-management` and related API endpoints
**Status**: ✅ COMPLETE AND STABLE - LOCKED FROM MODIFICATIONS

**Protected Files**:
- `src/app/admin/ai-management/page.tsx` (594 lines)
- `src/app/api/admin/ai-providers/[id]/test/route.ts`
- `src/app/api/admin/ai-providers/[id]/stats/route.ts`  
- `src/lib/ai-utils.ts`
- Database models: AIProvider, AIUsage, AITestResult

**Features**: AI provider management, real-time testing, usage analytics, responsive dashboard
**Documentation**: `AI-MANAGEMENT-SYSTEM.md`

### Gender Detection System (STABLE)
**Location**: `/src/lib/gender-utils.ts` and `/src/lib/common-nouns.ts`
**Status**: ✅ COMPLETE AND STABLE - CORE FEATURE

**Protected Files**:
- `src/lib/gender-utils.ts` - Core gender detection logic with linguistic rules
- `src/lib/common-nouns.ts` - Curated database of 100+ German nouns with genders
- `src/components/gender-badge.tsx` - UI component for gender display
- VocabularyEntry interfaces with gender field integration

**Features**: Auto der/die/das detection, common noun lookup, linguistic fallback rules
**Usage**: Automatically adds gender to German nouns in vocabulary search

### Theme System (STABLE)  
**Location**: `/src/app/die-neuen/**` and theme-related components
**Status**: ✅ COMPLETE AND STABLE - FULL THEME INTEGRATION

**Protected Files**:
- `src/hooks/use-theme.ts` - Core theme management
- `src/components/theme-switcher.tsx` - Theme switching component
- `src/config/themes.ts` - Theme configuration and semantic colors
- All die-neuen components with theme support

**Features**: Light/Dark/Nude themes, semantic color tokens, theme-aware components
**Design**: Blue (light), Slate (dark), Amber (nude) color schemes

**CRITICAL RULE**: Before making ANY changes to protected systems:
1. Read relevant documentation first
2. Get explicit approval from project maintainer  
3. Create backup of current working version
4. Test thoroughly on development environment

## Project Overview
This is a **German-Vietnamese language learning platform** built with Next.js 15.3.3, TypeScript, Prisma, and PostgreSQL. The platform features advanced theme system, AI-powered vocabulary search with gender detection, and comprehensive content management.

## Architecture & Key Patterns

### Database-First Design
- **Primary Stack**: PostgreSQL + Prisma ORM with Docker containerization
- **Schema Location**: `prisma/schema.prisma` - contains User, VocabularyEntry, Exercise, Post models
- **Critical Commands**: 
  - `npm run docker:up` - starts PostgreSQL + pgAdmin containers
  - `npm run db:push` - syncs schema changes (development)
  - `npm run db:seed` - imports vocabulary from JSON files
  - `npm run test:users` - creates test accounts

### Role-Based Permission System
- **Implementation**: `src/lib/permissions.ts` defines granular permissions per role
- **Roles**: ADMIN (full access), USER_PREMIUM (premium features), USER (basic access)
- **Usage Pattern**: Always use `hasPermission(user, 'canManageUsers')` instead of role checks
- **Test Accounts**: admin@edu-theme.com, premium@edu-theme.com, user@edu-theme.com

### Vocabulary Data Flow (ENHANCED)
- **Source**: JSON files in `src/data/` (vocabulary-*.json) + AI generation
- **Processing**: `src/lib/vocabulary-data.ts` aggregates data for frontend
- **AI Integration**: `src/ai/flows/vocabulary-flow.ts` uses Google Genkit for translations
- **Gender Detection**: `src/lib/gender-utils.ts` auto-adds der/die/das to German nouns
- **Database**: Seeded via `prisma/seed.ts` with 92+ vocabulary entries
- **Search Enhancement**: Smart gender assignment with common noun lookup + linguistic rules

### Content Management Strategy (UPDATED)
- **Structure**: Multiple content types with shared theme patterns
  - `/blog/` - Blog posts with markdown support + theme system
  - `/docs/` - Documentation with MDX support
  - `/vocabulary/` - Interactive vocabulary learning + gender detection
  - `/die-neuen/` - News platform with complete theme system (Light/Dark/Nude)
  - `/exercises/` - Learning exercises with progress tracking + theme support
- **Config Files**: `src/config/*.ts` define navigation, themes, and structure for each content type
- **Dynamic Routing**: `[[...slug]]` pattern used consistently across content sections
- **Theme Integration**: All components auto-adapt to selected theme (light/dark/nude)

## Development Workflows

### Essential Commands
```bash
# Database workflow
npm run docker:up && npm run db:push && npm run db:seed

# Development server (port 9003)
npm run dev

# Production build with optimization
npm run build

# AI development with Genkit
npm run genkit:dev

# Testing
npm run test:users  # Create test accounts
curl http://localhost:9003/api/test-overview  # Verify setup
```

### Database Development Pattern
1. Modify `prisma/schema.prisma`
2. Run `npm run db:push` (dev) or `npm run db:migrate` (prod)
3. Update seed data in `prisma/seed.ts` if needed
4. Use `npm run db:studio` for visual database management

### Content Addition Pattern
1. Add JSON vocabulary files to `src/data/`
2. Update `src/lib/vocabulary-data.ts` imports
3. Run `npm run db:seed` to sync with database
4. Configure routing in relevant `src/config/*.ts`

### Theme Development Pattern (NEW)
1. All new components must support theme switching
2. Use semantic color tokens from `src/config/themes.ts`
3. Implement theme-specific styling functions with switch-case logic
4. Test across all three themes: light, dark, nude
5. Follow established pattern from die-neuen components

## Critical Integration Points

### AI/Genkit Integration
- **Configuration**: `src/ai/genkit.ts` - Google AI setup
- **Flows**: `src/ai/flows/` - contains vocabulary translation logic
- **Environment**: Requires `GOOGLE_GENAI_API_KEY` in `.env`
- **Usage**: Server actions with `'use server'` directive

### API Route Patterns
- **Location**: `src/app/api/` 
- **Authentication**: No auth system yet - uses test accounts
- **Common Pattern**: GET with query params, proper error handling, pagination
- **Database Access**: Always use `import { prisma } from '@/lib/prisma'`

### UI Component System
- **Base**: shadcn/ui components in `src/components/ui/`
- **Custom**: Role badges, vocabulary cards, permission-aware components
- **Styling**: Tailwind CSS with custom theme (purple/teal color scheme)
- **Icons**: Lucide React icons throughout

## Project-Specific Conventions

### File Naming & Structure
- **API Routes**: `route.ts` files with named exports (GET, POST, etc.)
- **Page Components**: `page.tsx` in app directory structure
- **Data Files**: `vocabulary-*.json` for vocabulary data
- **Config Files**: `*.ts` in `src/config/` for navigation/routing

### Vietnamese Language Support
- **UI**: Vietnamese display names for roles and permissions
- **Content**: Bilingual German-Vietnamese vocabulary entries
- **Examples**: All vocabulary includes both German and Vietnamese example sentences

### Testing & Development
- **Test Data**: Predefined test accounts with different permission levels
- **Debug Routes**: `/test-dashboard` and `/admin/users` for development
- **Database UI**: pgAdmin at localhost:5050, Prisma Studio via `npm run db:studio`

## When Adding Features

### New Vocabulary Content
1. Create JSON file in `src/data/` following existing VocabularyEntry schema
2. Add to imports in `vocabulary-data.ts`
3. Re-run `npm run db:seed`
4. Gender will be auto-detected for German nouns

### New Permissions
1. Add to `rolePermissions` object in `src/lib/permissions.ts`
2. Use `hasPermission()` function in components/APIs
3. Update test scenarios

### New Content Types
1. Create config file in `src/config/`
2. Add app directory structure following `[[...slug]]` pattern
3. Create corresponding API routes if database interaction needed
4. Implement theme support following die-neuen pattern

### Gender Detection Enhancement (NEW)
1. Add new words to `src/lib/common-nouns.ts` database
2. Update linguistic rules in `src/lib/gender-utils.ts` if needed
3. Test with vocabulary search to ensure proper detection
4. Gender badges will automatically appear for nouns

## Common Troubleshooting

### Prisma Client Issues
- **"Module not found: @prisma/client"**: Run `npx prisma generate` after schema changes
- **Build errors with Prisma**: Clean regenerate with `rm -rf .next node_modules/.prisma && npx prisma generate`
- **Database connection issues**: Ensure Docker containers running with `npm run docker:up`

### Development Environment
- **Port conflicts**: Change port with `npx next dev --turbopack -p 9003`
- **Database not seeded**: Run `npm run db:push && npm run db:seed`
- **Test users missing**: Run `npm run test:users`

### Theme System Issues (NEW)
- **Components not switching themes**: Ensure `useTheme` hook is imported and used
- **Colors not updating**: Check if using semantic color tokens from `src/config/themes.ts`
- **Theme persistence**: Theme is stored in localStorage automatically

### Gender Detection Issues (NEW)
- **Gender not showing**: Ensure word is identified as NOMEN type
- **Wrong gender assigned**: Check `src/lib/common-nouns.ts` for overrides
- **No gender badge**: Verify VocabularyEntry has gender field populated

Always check `DATABASE.md` and `TEST-ACCOUNTS.md` for setup and testing guidance.
