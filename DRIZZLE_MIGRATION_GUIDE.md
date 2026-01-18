---
title: Prisma to Drizzle Migration Guide
description: Complete guide for migrating from Prisma ORM to Drizzle ORM
author: Senior Tech Lead
date: January 18, 2026
---

# 🚀 Prisma → Drizzle Migration Guide

## Overview

This guide documents the complete migration from Prisma ORM to Drizzle ORM with enterprise-grade architecture.

---

## ✅ What's Been Completed

### 1. Schema Architecture ✅

**Created modular schema structure:**
```
src/core/database/schema/
├── index.ts               # Centralized exports
├── auth.schema.ts         # Authentication & user management
├── questions.schema.ts    # Interview questions & categories
├── problems.schema.ts     # Coding problems & companies
├── progress.schema.ts     # User progress & bookmarks
└── shared.schema.ts       # Shared types & enums
```

**Benefits:**
- ✅ Clean separation of concerns
- ✅ Easy to navigate and maintain
- ✅ Type-safe with full TypeScript support
- ✅ Self-documenting code

### 2. Database Service ✅

**Created:** `src/core/database/database.service.ts`

**Features:**
- Singleton service pattern
- Connection pooling
- Lifecycle management (OnModuleInit, OnModuleDestroy)
- Transaction support
- Type-safe query builder

**Usage Example:**
```typescript
constructor(private readonly database: DatabaseService) {}

async getUsers() {
  return this.database.db.select().from(schema.accounts)
}
```

### 3. Configuration ✅

**Created:** `drizzle.config.ts`

**Features:**
- Environment variable support
- Migration directory configuration
- Verbose logging
- Strict mode enabled

### 4. Migration Scripts ✅

**Created:**
- `drizzle/0000_loving_exiles.sql` - Initial schema migration
- `drizzle/seed.ts` - Main seed script (admin, categories, companies)
- `drizzle/seed-questions.ts` - Questions seed from markdown files

### 5. Package Scripts ✅

**Updated `package.json`:**
```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",     // Generate migrations
    "db:migrate": "drizzle-kit migrate",       // Run migrations
    "db:push": "drizzle-kit push",             // Push schema
    "db:studio": "drizzle-kit studio",         // Visual database browser
    "db:seed": "tsx drizzle/seed.ts"           // Seed database
  }
}
```

### 6. Example Services ✅

**Created:**
- `questions.service.drizzle.ts` - Full Drizzle implementation
- `categories.service.drizzle.ts` - Full Drizzle implementation

---

## 🏗️ Architecture Decisions

### Why Drizzle?

**Advantages over Prisma:**

| Feature | Prisma | Drizzle | Winner |
|---------|--------|---------|--------|
| **Type Safety** | Good | Excellent | 🏆 Drizzle |
| **Performance** | Good | Better (No codegen) | 🏆 Drizzle |
| **Bundle Size** | Heavy | Lightweight | 🏆 Drizzle |
| **SQL Control** | Limited | Full control | 🏆 Drizzle |
| **Learning Curve** | Easy | Moderate | Prisma |
| **Migrations** | Auto | Manual (better control) | 🏆 Drizzle |

**Key Benefits:**
- ✅ **No code generation** - Instant schema changes
- ✅ **SQL-like API** - More control, less magic
- ✅ **Better performance** - Direct PostgreSQL queries
- ✅ **Smaller bundle** - Faster builds
- ✅ **Type-safe joins** - Compile-time safety

### Schema Design Patterns

#### 1. Modular Schema Organization

```typescript
// ❌ Prisma: Single schema.prisma file
// All models in one 300+ line file

// ✅ Drizzle: Separated by domain
auth.schema.ts       // ~120 lines
questions.schema.ts  // ~100 lines
problems.schema.ts   // ~90 lines
progress.schema.ts   // ~80 lines
```

**Benefits:**
- Easier to navigate
- Better git diffs
- Parallel development
- Clear boundaries

#### 2. Type Inference

```typescript
// ✅ Drizzle provides automatic type inference
export type Account = typeof accounts.$inferSelect
export type NewAccount = typeof accounts.$inferInsert

// Usage in services
async create(dto: NewAccount): Promise<Account> {
  const [account] = await db.insert(accounts).values(dto).returning()
  return account
}
```

#### 3. Enum Definitions

```typescript
// ✅ Drizzle: Native PostgreSQL enums
export const roleEnum = pgEnum('role', ['USER', 'ADMIN'])

// Used in schema
role: roleEnum('role').default('USER').notNull()
```

---

## 📋 Migration Checklist

### Phase 1: Setup ✅

- [x] Install Drizzle dependencies
  ```bash
  yarn add drizzle-orm postgres @paralleldrive/cuid2
  yarn add -D drizzle-kit
  ```

- [x] Create schema files
  - [x] `auth.schema.ts`
  - [x] `questions.schema.ts`
  - [x] `problems.schema.ts`
  - [x] `progress.schema.ts`
  - [x] `shared.schema.ts`
  - [x] `index.ts`

- [x] Create `drizzle.config.ts`

- [x] Create `DatabaseService`

- [x] Update `DatabaseModule`

- [x] Generate migrations
  ```bash
  yarn db:generate
  ```

### Phase 2: Service Migration (In Progress)

**Pattern to Follow:**

```typescript
// ❌ OLD (Prisma)
constructor(private readonly db: DatabaseService) {}

async findAll() {
  return this.db.question.findMany({
    include: { category: true }
  })
}

// ✅ NEW (Drizzle)
constructor(private readonly database: DatabaseService) {}

async findAll() {
  return this.database.db
    .select()
    .from(schema.questions)
    .leftJoin(schema.categories, 
      eq(schema.questions.categoryId, schema.categories.id))
}
```

**Services to Migrate:**

Identity Module:
- [ ] `auth.service.ts` - Authentication logic
- [ ] `account.service.ts` - Account management
- [ ] `token.service.ts` - JWT token handling

Questions Module:
- [x] `questions.service.ts` - EXAMPLE CREATED ✅
- [x] `categories.service.ts` - EXAMPLE CREATED ✅

Problems Module:
- [ ] `problems.service.ts` - Problem management
- [ ] `companies.service.ts` - Company management

Progress Module:
- [ ] `progress.service.ts` - User progress tracking
- [ ] `bookmarks.service.ts` - Bookmark management

Onboarding Module:
- [ ] `onboarding.service.ts` - User onboarding

### Phase 3: Testing

- [ ] Run migrations on development database
- [ ] Seed data
- [ ] Test all API endpoints
- [ ] Verify data integrity
- [ ] Performance testing

### Phase 4: Cleanup

- [ ] Remove Prisma dependencies
- [ ] Delete `prisma/` directory
- [ ] Update documentation
- [ ] Remove Prisma imports

---

## 🔧 Migration Patterns

### 1. Simple SELECT

```typescript
// Prisma
const users = await prisma.account.findMany()

// Drizzle
const users = await db.select().from(schema.accounts)
```

### 2. SELECT with WHERE

```typescript
// Prisma
const user = await prisma.account.findUnique({
  where: { email: 'test@example.com' }
})

// Drizzle
const [user] = await db
  .select()
  .from(schema.accounts)
  .where(eq(schema.accounts.email, 'test@example.com'))
  .limit(1)
```

### 3. SELECT with Relations (JOIN)

```typescript
// Prisma
const questions = await prisma.question.findMany({
  include: { category: true }
})

// Drizzle
const questions = await db
  .select()
  .from(schema.questions)
  .leftJoin(schema.categories, 
    eq(schema.questions.categoryId, schema.categories.id))
```

### 4. INSERT

```typescript
// Prisma
const user = await prisma.account.create({
  data: { email, password, name }
})

// Drizzle
const [user] = await db
  .insert(schema.accounts)
  .values({ email, password, name })
  .returning()
```

### 5. UPDATE

```typescript
// Prisma
const updated = await prisma.account.update({
  where: { id },
  data: { name }
})

// Drizzle
const [updated] = await db
  .update(schema.accounts)
  .set({ name, updatedAt: new Date() })
  .where(eq(schema.accounts.id, id))
  .returning()
```

### 6. DELETE

```typescript
// Prisma
await prisma.account.delete({
  where: { id }
})

// Drizzle
await db
  .delete(schema.accounts)
  .where(eq(schema.accounts.id, id))
```

### 7. Complex WHERE with OR/AND

```typescript
// Prisma
const questions = await prisma.question.findMany({
  where: {
    OR: [
      { titleEn: { contains: search } },
      { titleUa: { contains: search } }
    ],
    difficulty: 'MEDIUM'
  }
})

// Drizzle
const questions = await db
  .select()
  .from(schema.questions)
  .where(
    and(
      or(
        like(schema.questions.titleEn, `%${search}%`),
        like(schema.questions.titleUa, `%${search}%`)
      ),
      eq(schema.questions.difficulty, 'MEDIUM')
    )
  )
```

### 8. COUNT

```typescript
// Prisma
const count = await prisma.question.count({
  where: { categoryId }
})

// Drizzle
const [{ count }] = await db
  .select({ count: sql<number>`count(*)` })
  .from(schema.questions)
  .where(eq(schema.questions.categoryId, categoryId))
```

### 9. Pagination

```typescript
// Prisma
const questions = await prisma.question.findMany({
  skip: (page - 1) * limit,
  take: limit
})

// Drizzle
const questions = await db
  .select()
  .from(schema.questions)
  .limit(limit)
  .offset((page - 1) * limit)
```

### 10. Transactions

```typescript
// Prisma
await prisma.$transaction([
  prisma.account.create({ data: accountData }),
  prisma.userProfile.create({ data: profileData })
])

// Drizzle
await db.transaction(async (tx) => {
  await tx.insert(schema.accounts).values(accountData)
  await tx.insert(schema.userProfiles).values(profileData)
})
```

---

## 🎯 Service Migration Template

### Step-by-Step for Each Service

1. **Import Drizzle Dependencies**

```typescript
import { DatabaseService } from '@core/database/database.service'
import { eq, and, or, like, desc, asc, sql } from 'drizzle-orm'
import * as schema from '@core/database/schema'
```

2. **Update Constructor**

```typescript
// OLD
constructor(private readonly db: DatabaseService) {}

// NEW
constructor(private readonly database: DatabaseService) {}
```

3. **Update Queries**

Follow the patterns above for each method.

4. **Update Return Types**

```typescript
// Drizzle returns arrays, handle empty results
const [user] = await db.select()...

if (!user) {
  throw new NotFoundException('User not found')
}
```

5. **Test Thoroughly**

```bash
# Test the service
yarn test

# Test API endpoints
curl http://localhost:4000/api/questions
```

---

## 📊 Migration Progress

### Completed ✅

| Component | Status | Lines | Notes |
|-----------|--------|-------|-------|
| Schema Files | ✅ Done | ~600 | Modular, clean |
| Database Service | ✅ Done | ~90 | Injectable, lifecycle |
| Database Module | ✅ Done | ~20 | Global module |
| Drizzle Config | ✅ Done | ~20 | Environment-based |
| Seed Scripts | ✅ Done | ~300 | Questions + base data |
| Questions Service | ✅ Example | ~200 | Full implementation |
| Categories Service | ✅ Example | ~150 | Full implementation |

### Pending ⏳

| Service | Complexity | Est. Lines | Priority |
|---------|------------|------------|----------|
| auth.service.ts | High | ~150 | 🔴 Critical |
| account.service.ts | Medium | ~100 | 🔴 Critical |
| token.service.ts | Low | ~50 | 🟡 Medium |
| problems.service.ts | Medium | ~120 | 🟢 Low |
| companies.service.ts | Low | ~80 | 🟢 Low |
| progress.service.ts | Medium | ~100 | 🟡 Medium |
| bookmarks.service.ts | Medium | ~100 | 🟡 Medium |
| onboarding.service.ts | Low | ~60 | 🟢 Low |

---

## 🛠️ Commands Reference

### Development

```bash
# Generate new migration after schema changes
yarn db:generate

# Push schema to database (development)
yarn db:push

# Open Drizzle Studio (database GUI)
yarn db:studio

# Run seed scripts
yarn db:seed                        # Base data
yarn ts-node drizzle/seed-questions.ts  # Questions

# Build project
yarn build

# Start development server
yarn dev
```

### Migration Workflow

```bash
# 1. Update schema files
vim src/core/database/schema/questions.schema.ts

# 2. Generate migration
yarn db:generate

# 3. Review migration
cat drizzle/0001_*.sql

# 4. Apply migration
yarn db:push

# 5. Seed data
yarn db:seed
```

---

## 📝 Code Quality Standards

### 1. Always Use Type Inference

```typescript
// ✅ GOOD
const [user] = await db
  .select()
  .from(schema.accounts)
  .where(eq(schema.accounts.id, id))
  .limit(1)

// user is fully typed automatically!
```

### 2. Use Descriptive Variable Names

```typescript
// ❌ BAD
const r = await db.select().from(schema.questions)

// ✅ GOOD
const questions = await db.select().from(schema.questions)
```

### 3. Separate Complex Queries

```typescript
// ✅ GOOD: Extract complex logic
async findQuestionsWithFilters(filters: FilterDto) {
  const conditions: SQL[] = []
  
  if (filters.search) {
    conditions.push(this.buildSearchCondition(filters.search))
  }
  
  if (filters.difficulty) {
    conditions.push(eq(schema.questions.difficulty, filters.difficulty))
  }
  
  return db
    .select()
    .from(schema.questions)
    .where(and(...conditions))
}

private buildSearchCondition(search: string): SQL {
  return or(
    like(schema.questions.titleEn, `%${search}%`),
    like(schema.questions.titleUa, `%${search}%`)
  )
}
```

### 4. Handle Nullable Results

```typescript
// ✅ GOOD: Always check for null
const [question] = await db
  .select()
  .from(schema.questions)
  .where(eq(schema.questions.slug, slug))
  .limit(1)

if (!question) {
  throw new NotFoundException('Question not found')
}

return question
```

### 5. Use Transactions for Multiple Operations

```typescript
// ✅ GOOD: Atomic operations
async createQuestionWithTags(dto: CreateQuestionDto) {
  return this.database.db.transaction(async (tx) => {
    // Insert question
    const [question] = await tx
      .insert(schema.questions)
      .values(dto)
      .returning()
    
    // Insert tags
    if (dto.tags && dto.tags.length > 0) {
      await tx.insert(schema.questionsToTags).values(
        dto.tags.map(tagId => ({
          questionId: question.id,
          tagId
        }))
      )
    }
    
    return question
  })
}
```

---

## 🚦 Migration Steps (For Each Service)

### Example: Migrating auth.service.ts

**Step 1: Rename old file**
```bash
mv src/modules/identity/services/auth.service.ts auth.service.prisma.ts
```

**Step 2: Create new file**
```bash
touch src/modules/identity/services/auth.service.ts
```

**Step 3: Implement with Drizzle**

```typescript
import { Injectable } from '@nestjs/common'
import { DatabaseService } from '@core/database/database.service'
import { eq } from 'drizzle-orm'
import * as schema from '@core/database/schema'
import * as argon2 from 'argon2'

@Injectable()
export class AuthService {
  constructor(private readonly database: DatabaseService) {}

  async register(dto: RegisterDto) {
    // Перевірка існуючого користувача
    const [existing] = await this.database.db
      .select()
      .from(schema.accounts)
      .where(eq(schema.accounts.email, dto.email))
      .limit(1)

    if (existing) {
      throw new ConflictException('Email вже використовується')
    }

    // Хешування паролю
    const hashedPassword = await argon2.hash(dto.password)

    // Створення аккаунту
    const [account] = await this.database.db
      .insert(schema.accounts)
      .values({
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
      })
      .returning()

    return account
  }

  async login(dto: LoginDto) {
    // Знаходження користувача
    const [account] = await this.database.db
      .select()
      .from(schema.accounts)
      .where(eq(schema.accounts.email, dto.email))
      .limit(1)

    if (!account) {
      throw new UnauthorizedException('Невірний email або пароль')
    }

    // Перевірка паролю
    const isValid = await argon2.verify(account.password, dto.password)

    if (!isValid) {
      throw new UnauthorizedException('Невірний email або пароль')
    }

    return account
  }
}
```

**Step 4: Test**

```bash
# Test endpoints
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123!","name":"Test"}'
```

**Step 5: Remove old file**

```bash
rm auth.service.prisma.ts
```

---

## 🎨 Best Practices

### 1. Use Query Builder Methods

```typescript
// ✅ GOOD: Readable, type-safe
const questions = await db
  .select({
    id: schema.questions.id,
    title: schema.questions.titleEn,
    category: schema.categories.nameEn,
  })
  .from(schema.questions)
  .leftJoin(schema.categories, 
    eq(schema.questions.categoryId, schema.categories.id))
  .where(eq(schema.questions.difficulty, 'MEDIUM'))
  .orderBy(asc(schema.questions.order))
```

### 2. Reuse Common Queries

```typescript
// ✅ Create helper methods
class QuestionsService {
  private selectQuestionWithCategory() {
    return this.database.db
      .select()
      .from(schema.questions)
      .leftJoin(schema.categories, 
        eq(schema.questions.categoryId, schema.categories.id))
  }

  async findAll() {
    return this.selectQuestionWithCategory()
  }

  async findOne(slug: string) {
    const [question] = await this.selectQuestionWithCategory()
      .where(eq(schema.questions.slug, slug))
      .limit(1)
    
    if (!question) {
      throw new NotFoundException()
    }
    
    return question
  }
}
```

### 3. Use Prepared Statements for Performance

```typescript
// ✅ Prepared statement (reusable)
const preparedQuery = db
  .select()
  .from(schema.questions)
  .where(eq(schema.questions.id, sql.placeholder('id')))
  .prepare('get_question_by_id')

// Usage
const question = await preparedQuery.execute({ id: '123' })
```

### 4. Batch Operations

```typescript
// ✅ Batch insert
await db.insert(schema.questions).values([
  { slug: 'q1', titleEn: 'Question 1', ... },
  { slug: 'q2', titleEn: 'Question 2', ... },
  { slug: 'q3', titleEn: 'Question 3', ... },
])
```

---

## 🧪 Testing Strategy

### Unit Tests

```typescript
describe('QuestionsService', () => {
  let service: QuestionsService
  let database: DatabaseService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        QuestionsService,
        {
          provide: DatabaseService,
          useValue: {
            db: mockDrizzleDb,
          },
        },
      ],
    }).compile()

    service = module.get<QuestionsService>(QuestionsService)
    database = module.get<DatabaseService>(DatabaseService)
  })

  it('should find all questions', async () => {
    const result = await service.findAll({ page: 1, limit: 10 })
    expect(result.data).toBeDefined()
  })
})
```

### Integration Tests

```bash
# Test on real database
yarn db:push
yarn db:seed
yarn test:e2e
```

---

## 📚 Resources

**Drizzle Documentation:**
- https://orm.drizzle.team/docs/overview
- https://orm.drizzle.team/docs/goodies

**Migration Guides:**
- https://orm.drizzle.team/docs/migrations
- https://orm.drizzle.team/docs/prisma

**Performance:**
- https://orm.drizzle.team/docs/perf-queries

---

## 🎯 Next Steps

1. **Review Example Services** (`questions.service.drizzle.ts`)
2. **Migrate Auth Service** (highest priority)
3. **Test Each Service** as you migrate
4. **Update Module Imports** 
5. **Remove Prisma** when all services migrated

---

## 💡 Tips

- **Start with read-only services** (easier to test)
- **Migrate one module at a time** (questions → problems → auth)
- **Keep old code** until fully tested (`.prisma.ts` files)
- **Use transactions** for data consistency
- **Check for N+1 queries** (use joins instead)

---

## 🆘 Troubleshooting

### Issue: "Cannot find module @core/database/schema"

**Solution:**
```bash
# Rebuild TypeScript paths
yarn build
```

### Issue: Migration fails

**Solution:**
```bash
# Check generated SQL
cat drizzle/0000_*.sql

# Apply manually if needed
psql $DATABASE_URL < drizzle/0000_*.sql
```

### Issue: Type errors

**Solution:**
```typescript
// Ensure proper imports
import { eq, and, or, like } from 'drizzle-orm'
import * as schema from '@core/database/schema'
```

---

## ✅ Success Criteria

- [ ] All services migrated
- [ ] All tests passing
- [ ] No Prisma imports remaining
- [ ] Performance equal or better
- [ ] Documentation updated
- [ ] Team trained on Drizzle

---

**Status:** Phase 1 Complete ✅ | Phase 2 In Progress ⏳

**Next:** Migrate identity services (auth, account, token)

---

*Last Updated: January 18, 2026*
*Migration Lead: Senior Tech Lead*
