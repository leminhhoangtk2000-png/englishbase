# Database Setup Guide

## Prerequisites

- Docker and Docker Compose installed
- Node.js 18+ installed
- PostgreSQL client (optional, for direct database access)

## Quick Start

1. **Start the database containers:**
   ```bash
   npm run docker:up
   ```

2. **Setup the database schema:**
   ```bash
   npm run db:generate
   npm run db:push
   ```

3. **Seed the database with vocabulary data:**
   ```bash
   npm run db:seed
   ```

4. **Test the setup:**
   ```bash
   npm run dev
   ```
   Then visit: http://localhost:9002/api/test-db

## Database Access

### pgAdmin (Web Interface)
- URL: http://localhost:5050
- Email: admin@edu-theme.com
- Password: admin123

### Direct PostgreSQL Connection
- Host: localhost
- Port: 5432
- Database: edu_theme_db
- Username: edu_user
- Password: edu_password

## Available Scripts

- `npm run docker:up` - Start database containers
- `npm run docker:down` - Stop database containers
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Create and run migrations
- `npm run db:studio` - Open Prisma Studio
- `npm run db:seed` - Seed database with initial data
- `npm run db:reset` - Reset database and re-seed

## Schema Overview

### Core Models
- **User** - User management with 3 roles (ADMIN, USER, USER_PREMIUM)
- **VocabularyEntry** - German vocabulary with Vietnamese translations
- **Exercise** - Learning exercises and quizzes
- **Post** - Blog posts and content management
- **Payment** - Premium subscription management

### User Roles & Permissions
- **ADMIN** - Full system access, content management, user management
- **USER_PREMIUM** - Access to premium features, advanced exercises
- **USER** - Basic features, limited content access

### Key Features
- Vocabulary learning with spaced repetition
- Progress tracking per user
- Exercise system with multiple types
- Content management system
- Payment integration

## API Endpoints

### Test Database
- `GET /api/test-db` - Test database connection and get stats
- `POST /api/test-db` - Create a test user

### Users
- `GET /api/users` - Get users with filtering by role
  - Query params: `role`, `page`, `limit`
- `POST /api/users` - Create new user
- `GET /api/users/[id]` - Get user by ID with stats
- `PATCH /api/users/[id]` - Update user role/premium status

## Environment Variables

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Key variables:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Secret for authentication
- `GOOGLE_GENAI_API_KEY` - Google AI API key

## Troubleshooting

### Database Connection Issues
1. Ensure Docker containers are running: `docker-compose ps`
2. Check container logs: `docker-compose logs postgres`
3. Verify environment variables in `.env`

### Prisma Issues
1. Regenerate client: `npm run db:generate`
2. Reset database: `npm run db:reset`
3. Check schema syntax: `npx prisma validate`

### Seeding Issues
1. Check vocabulary JSON files exist in `src/data/`
2. Verify database schema is up to date: `npm run db:push`
3. Run seed manually: `npx tsx prisma/seed.ts`

## Development Workflow

1. Make schema changes in `prisma/schema.prisma`
2. Push changes: `npm run db:push` (development) or `npm run db:migrate` (production)
3. Generate client: `npm run db:generate`
4. Update seed data if needed: `npm run db:seed`

## Production Deployment

For production, use proper migrations:

1. Create migration: `npx prisma migrate dev --name your-migration-name`
2. Deploy migration: `npx prisma migrate deploy`
3. Generate client: `npx prisma generate`
