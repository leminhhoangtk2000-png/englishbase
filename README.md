# Edu-theme - German-Vietnamese Learning Platform

A Next.js 15.3.3 educational platform for German-Vietnamese language learning with AI integration.

## Quick Start

```bash
# Start database and development server
npm run docker:up && npm run db:push && npm run db:seed
npm run dev
```

## Core Features

- **Vocabulary Learning**: Interactive German-Vietnamese vocabulary with AI search
- **Exercise System**: Learning exercises with progress tracking
- **AI Management**: Complete AI provider management system with usage tracking
- **Content Management**: Multi-role architecture (ADMIN/USER_PREMIUM/USER)
- **Database**: PostgreSQL with Prisma ORM

## Important Systems

### 🤖 AI Management System (STABLE)
**URL**: `/admin/ai-management`

⚠️ **CRITICAL**: This system is stable and complete. Do not modify without approval.

**Features**:
- AI provider management (OpenAI, Gemini, Claude)
- Real-time API testing with token/cost tracking
- Usage analytics dashboard
- Database persistence with full history

**Documentation**: See [AI-MANAGEMENT-SYSTEM.md](./AI-MANAGEMENT-SYSTEM.md)

### 📚 Vocabulary System
- A1-B2 level vocabulary entries
- AI-powered search and translation
- JSON-based vocabulary data structure

### 🏋️ Exercise System  
- Interactive learning exercises
- Progress tracking per user
- Multiple exercise types and components

## Development

### Database Setup
```bash
npm run docker:up     # Start PostgreSQL + pgAdmin
npm run db:push       # Sync schema
npm run db:seed       # Import vocabulary data
npm run test:users    # Create test accounts
```

### Key Commands
```bash
npm run dev           # Development server (port 9002)
npm run genkit:dev    # AI development with Genkit
npm run db:studio     # Visual database management
```

### Test Accounts
- `admin@edu-theme.com` - Full admin access
- `premium@edu-theme.com` - Premium user features  
- `user@edu-theme.com` - Basic user access

## Architecture

- **Frontend**: Next.js 15.3.3 with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **AI**: Google Genkit integration
- **Auth**: Multi-role permission system
- **Styling**: Tailwind CSS with shadcn/ui

## Protected Systems

### ⚠️ DO NOT MODIFY
- `/admin/ai-management` - Complete AI provider management
- Database schema for AI tables (AIProvider, AIUsage, AITestResult)
- Core vocabulary data structure

### Documentation Files
- `AI-MANAGEMENT-SYSTEM.md` - Complete AI system documentation
- `DATABASE.md` - Database setup and management
- `TEST-ACCOUNTS.md` - Test account information

---

For detailed setup and development guidance, see the individual documentation files.
