# AI Coding Agent Instructions for Edu-theme

## Project Overview
This is a **German-Vietnamese language learning platform** built with Next.js 15.3.3, TypeScript, Prisma, and PostgreSQL. The platform follows a multi-role architecture (ADMIN/USER_PREMIUM/USER) with vocabulary learning, exercises, and content management capabilities.

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

### Vocabulary Data Flow
- **Source**: JSON files in `src/data/` (vocabulary-*.json) 
- **Processing**: `src/lib/vocabulary-data.ts` aggregates data for frontend
- **AI Integration**: `src/ai/flows/vocabulary-flow.ts` uses Google Genkit for translations
- **Database**: Seeded via `prisma/seed.ts` which processes all JSON files

### Content Management Strategy
- **Structure**: Multiple content types with shared patterns
  - `/blog/` - Blog posts with markdown support
  - `/docs/` - Documentation with MDX support  
  - `/vocabulary/` - Interactive vocabulary learning
  - `/exercises/` - Learning exercises with progress tracking
- **Config Files**: `src/config/*.ts` define navigation and structure for each content type
- **Dynamic Routing**: `[[...slug]]` pattern used consistently across content sections

## Development Workflows

### Essential Commands
```bash
# Database workflow
npm run docker:up && npm run db:push && npm run db:seed

# Development server (port 9002)
npm run dev

# AI development with Genkit
npm run genkit:dev

# Testing
npm run test:users  # Create test accounts
curl http://localhost:9002/api/test-overview  # Verify setup
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

### New Permissions
1. Add to `rolePermissions` object in `src/lib/permissions.ts`
2. Use `hasPermission()` function in components/APIs
3. Update test scenarios

### New Content Types
1. Create config file in `src/config/`
2. Add app directory structure following `[[...slug]]` pattern
3. Create corresponding API routes if database interaction needed

## Common Troubleshooting

### Prisma Client Issues
- **"Module not found: @prisma/client"**: Run `npx prisma generate` after schema changes
- **Build errors with Prisma**: Clean regenerate with `rm -rf .next node_modules/.prisma && npx prisma generate`
- **Database connection issues**: Ensure Docker containers running with `npm run docker:up`

### Development Environment
- **Port conflicts**: Change port with `npx next dev --turbopack -p 9003`
- **Database not seeded**: Run `npm run db:push && npm run db:seed`
- **Test users missing**: Run `npm run test:users`

Always check `DATABASE.md` and `TEST-ACCOUNTS.md` for setup and testing guidance.
