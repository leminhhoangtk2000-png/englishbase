# Edu-theme - German-Vietnamese Learning Platform

A Next.js 15.3.3 educational platform for German-Vietnamese language learning with AI integration and advanced theme system.

## ✨ Latest Features (September 2025)

### 🎨 Die Neuen News Platform
- **Complete theme system**: Light, Dark, and Nude themes with semantic color design
- **Article management**: Full CRUD operations for German news articles
- **Theme-aware components**: All UI components adapt automatically to selected theme
- **Responsive design**: Mobile-first approach with consistent theming

### 🔍 Smart Vocabulary Search
- **Auto gender detection**: Automatically adds der/die/das to German nouns
- **100+ common nouns database**: Accurate gender assignment for frequent words
- **Linguistic fallback rules**: Smart detection based on word endings
- **Visual gender indicators**: Color-coded badges (blue=der, red=die, green=das)
- **Toast notifications**: User feedback when gender is auto-added

### 🧠 Enhanced AI Integration
- **Multi-provider support**: OpenAI, Gemini, Claude with automatic fallback
- **Smart caching**: Vocabulary results cached for performance
- **Usage tracking**: Complete analytics for AI API calls and costs

## Quick Start

```bash
# Start database and development server
npm run docker:up && npm run db:push && npm run db:seed
npm run dev
```

## Core Features

### 📚 Vocabulary Learning
- **Interactive German-Vietnamese vocabulary** with AI search
- **Smart gender detection** for German nouns
- **Audio pronunciation** with text-to-speech
- **Progress tracking** and saved vocabulary
- **Multi-level support** (A1-B2)

### 📰 Die Neuen News System  
- **Theme-aware news platform** with article management
- **Full CRUD operations** for news content
- **Category filtering** and search functionality
- **Responsive pagination** with theme support

### 🏋️ Exercise System
- **Interactive learning exercises** with progress tracking
- **Multiple exercise types** and components
- **Theme-consistent UI** across all exercise interfaces

### 🤖 AI Management System (STABLE)
- **Complete AI provider management** with real-time testing
- **Usage analytics dashboard** with cost tracking
- **Database persistence** with full history

## Important Systems

### ⚠️ PROTECTED SYSTEMS - DO NOT MODIFY

#### 🤖 AI Management System (STABLE)
**URL**: `/admin/ai-management`
**Status**: ✅ COMPLETE AND STABLE - LOCKED FROM MODIFICATIONS

⚠️ **CRITICAL**: This system is stable and complete. Do not modify without approval.

**Features**:
- AI provider management (OpenAI, Gemini, Claude)
- Real-time API testing with token/cost tracking  
- Usage analytics dashboard
- Database persistence with full history

**Documentation**: See [AI-MANAGEMENT-SYSTEM.md](./AI-MANAGEMENT-SYSTEM.md)

### 🎨 Theme System
**Status**: ✅ COMPLETE - Die Neuen Platform
- **Light Theme**: Blue color scheme with clean backgrounds
- **Dark Theme**: Gray/slate backgrounds with blue accents  
- **Nude Theme**: Amber/stone warm color palette
- **Global scrollbar hiding**: Consistent across all browsers
- **Semantic color tokens**: Consistent theming approach

### 📚 Vocabulary System
- **A1-B2 level vocabulary entries** with gender detection
- **AI-powered search and translation** with smart caching
- **JSON-based vocabulary data structure** with 92+ entries
- **Auto gender detection**: der/die/das assignment for German nouns
- **Common nouns database**: 100+ frequent words with correct genders

### 🏋️ Exercise System  
- Interactive learning exercises with theme support
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
npm run dev           # Development server (port 9003)
npm run build         # Production build (optimized)
npm run genkit:dev    # AI development with Genkit
npm run db:studio     # Visual database management
npm run docker:up     # Start PostgreSQL + pgAdmin containers
```

### Test Accounts
- `admin@edu-theme.com` - Full admin access + AI management
- `premium@edu-theme.com` - Premium user features + advanced vocabulary
- `user@edu-theme.com` - Basic user access + core vocabulary

### 🌐 Key URLs
- **Main Platform**: http://localhost:9003
- **Vocabulary**: http://localhost:9003/vocabulary  
- **Die Neuen News**: http://localhost:9003/die-neuen
- **Admin Panel**: http://localhost:9003/admin
- **AI Management**: http://localhost:9003/admin/ai-management

## Architecture

### 🏗️ Technical Stack
- **Frontend**: Next.js 15.3.3 with TypeScript and App Router
- **Database**: PostgreSQL with Prisma ORM (containerized)
- **AI Integration**: Google Genkit + Multi-provider support
- **Authentication**: Multi-role permission system (ADMIN/USER_PREMIUM/USER)
- **Styling**: Tailwind CSS with shadcn/ui components
- **Theme System**: Semantic color tokens with light/dark/nude themes

### 🎨 Design System
- **Color Schemes**: 
  - Light: Blue-based with clean backgrounds
  - Dark: Slate/gray with blue accents
  - Nude: Warm amber/stone palette
- **Typography**: Consistent font hierarchy across themes
- **Components**: Theme-aware UI components with automatic color adaptation
- **Icons**: Lucide React with semantic color integration

### 🗄️ Data Architecture
- **Vocabulary Entries**: 92+ German-Vietnamese word pairs with metadata
- **Gender Database**: 100+ common German nouns with correct articles
- **User System**: Role-based permissions with vocabulary tracking
- **AI Usage**: Complete analytics and cost tracking per provider

## Protected Systems

### ⚠️ DO NOT MODIFY WITHOUT APPROVAL
- `/admin/ai-management/**` - Complete AI provider management system
- `/src/lib/gender-utils.ts` - Core gender detection logic
- `/src/lib/common-nouns.ts` - Curated German noun gender database
- Database schema for AI tables (AIProvider, AIUsage, AITestResult)
- Core vocabulary data structure and transform functions

### 📋 Recent Major Updates
- **Gender Auto-Detection System** (September 2025)
- **Complete Theme System for Die Neuen** (September 2025)  
- **Vocabulary Search Enhancement** (September 2025)
- **Multi-Provider AI Integration** (August 2025)

### Documentation Files
- `AI-MANAGEMENT-SYSTEM.md` - Complete AI system documentation
- `DATABASE.md` - Database setup and management
- `TEST-ACCOUNTS.md` - Test account information

---

For detailed setup and development guidance, see the individual documentation files.
