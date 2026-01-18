# Questions Management - Backend

## Overview
All interview questions are now stored in the PostgreSQL database and served via REST API with full markdown support.

---

## Quick Start

### 1. Apply Database Migration
```bash
npx prisma migrate deploy
```

### 2. Generate Prisma Client
```bash
npx prisma generate
```

### 3. Seed Questions from Markdown Files
```bash
npx tsx prisma/seed-questions.ts
```

This will:
- Read all markdown files from `/Users/petro/Desktop/mine-copy/src/content/docs/`
- Parse frontmatter and content
- Insert into database with proper categories
- Preserve navigation links

### 4. Start Backend Server
```bash
npm run dev
```

Server runs on: `http://localhost:3001`

---

## Database Schema

### Category Model
```prisma
model Category {
  id          String  @id @default(cuid())
  slug        String  @unique
  nameEn      String  // "TypeScript"
  nameUa      String  // "TypeScript"
  order       Int
  questions   Question[]
}
```

### Question Model
```prisma
model Question {
  id                String  @id @default(cuid())
  slug              String  @unique
  titleEn           String  // English title
  titleUa           String  // Ukrainian title
  descriptionEn     String? // Optional description
  descriptionUa     String? // Optional description
  contentMarkdown   String  @db.Text // Full markdown content
  difficulty        Difficulty // EASY | MEDIUM | HARD
  order             Int
  prevSlug          String? // Previous question slug
  nextSlug          String? // Next question slug
  categoryId        String
  category          Category @relation(...)
}
```

---

## API Endpoints

### Questions

#### Get All Questions
```bash
GET /questions?page=1&limit=10&category=typescript&difficulty=MEDIUM
```

#### Get Question by Slug
```bash
GET /questions/type-vs-interface
```

Response includes full markdown content:
```json
{
  "id": "clx...",
  "slug": "type-vs-interface",
  "titleEn": "Type vs Interface",
  "titleUa": "Type vs Interface",
  "contentMarkdown": "## Interface\n\n- **interface** is...",
  "prevSlug": "decorators",
  "nextSlug": "generic",
  "category": {
    "slug": "typescript",
    "nameEn": "TypeScript",
    "nameUa": "TypeScript"
  }
}
```

#### Get Questions by Category
```bash
GET /questions/category/typescript
```

### Categories

#### Get All Categories
```bash
GET /categories?page=1&limit=100
```

#### Get Category by Slug
```bash
GET /categories/typescript
```

---

## Seed Script

### Location
`prisma/seed-questions.ts`

### What It Does
1. Reads frontend markdown files from `../../mine-copy/src/content/docs/`
2. Parses YAML frontmatter:
   - title
   - description
   - section
   - slug
   - prev/next navigation
3. Parses markdown content
4. Creates categories
5. Creates questions with all metadata

### Frontmatter Format
```yaml
---
title: Type vs Interface
description: Learn about differences between type and interface
section: typescript
slug: type-vs-interface
prev: decorators
next: generic
---

## Your Markdown Content Here
```

### Running the Seed
```bash
# Clear and re-seed
npx tsx prisma/seed-questions.ts

# Or use npm script (if added to package.json)
npm run seed:questions
```

### Output Example
```
🌱 Starting database seed...

🧹 Clearing existing questions and categories...
✅ Cleared existing data

📚 Seeding categories...
  ✓ HTML & CSS (html-css)
  ✓ JavaScript (javascript)
  ✓ TypeScript (typescript)
  ✓ React (react)
  ...
✅ Created 11 categories

📝 Seeding questions from markdown files...

  📂 Processing typescript:
    ✓ decorators
    ✓ type-vs-interface
    ✓ generic

  📂 Processing react:
    ✓ virtual-dom
    ✓ usestate
    ✓ useref

✅ Successfully seeded 6 questions!

🎉 Database seed completed!
```

---

## Adding New Questions

### Option 1: Add Markdown File + Re-seed (Recommended for bulk)

1. Create markdown file in frontend:
```bash
/Users/petro/Desktop/mine-copy/src/content/docs/typescript/new-question.md
```

2. Add content:
```markdown
---
title: Your New Question
description: Question description
section: typescript
slug: new-question
prev: previous-question
next: next-question
---

## Content

Your markdown content here...
```

3. Re-run seed:
```bash
npx tsx prisma/seed-questions.ts
```

### Option 2: Use API Directly (For single questions)

```bash
POST http://localhost:3001/questions
Content-Type: application/json
Authorization: Bearer <token>

{
  "slug": "new-question",
  "titleEn": "Your Question Title",
  "titleUa": "Назва питання",
  "descriptionEn": "Description",
  "descriptionUa": "Опис",
  "contentMarkdown": "## Content\n\nYour markdown...",
  "categoryId": "<category-id>",
  "difficulty": "MEDIUM",
  "order": 1,
  "prevSlug": "previous",
  "nextSlug": "next"
}
```

### Option 3: Use Prisma Studio

```bash
npx prisma studio
```

Opens GUI at `http://localhost:5555` for manual editing.

---

## Markdown Support

### ✅ Fully Supported

- **Headings:** `#`, `##`, `###`, etc.
- **Lists:** Ordered and unordered
- **Code blocks:** With syntax highlighting
- **Links:** `[text](url)`
- **Images:** `![alt](url)`
- **Tables:** Standard markdown tables
- **Blockquotes:** `>`
- **Bold/Italic:** `**bold**`, `*italic*`
- **Inline code:** `` `code` ``

### Example
```markdown
## What is TypeScript?

TypeScript is a **strongly typed** programming language.

### Key Features

- Static typing
- Type inference
- Modern JavaScript support

Example:
` ``typescript
const greeting: string = "Hello, World!";
console.log(greeting);
` ``
```

---

## Database Commands

### View Current Schema
```bash
npx prisma studio
```

### Create New Migration
```bash
npx prisma migrate dev --name your_migration_name
```

### Apply Migrations (Production)
```bash
npx prisma migrate deploy
```

### Reset Database (⚠️ Deletes all data)
```bash
npx prisma migrate reset
```

### View Migration Status
```bash
npx prisma migrate status
```

---

## Environment Variables

Required in `.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/itlead-test"
```

---

## Troubleshooting

### Seed Script Can't Find Markdown Files

**Error:** `Category directory not found: typescript`

**Solution:** Update path in `prisma/seed-questions.ts`:
```typescript
const FRONTEND_CONTENT_PATH = path.join(__dirname, '../../mine-copy/src/content/docs')
```

### Prisma Client Out of Sync

**Error:** `Argument 'name' is missing`

**Solution:**
```bash
npx prisma generate
```

### Database Connection Failed

**Error:** `Can't reach database server`

**Solutions:**
1. Check PostgreSQL is running
2. Verify DATABASE_URL in `.env`
3. Test connection: `npx prisma db pull`

---

## Testing

### Test Question Endpoints
```bash
# Get all questions
curl http://localhost:3001/questions

# Get specific question
curl http://localhost:3001/questions/type-vs-interface

# Get questions by category
curl http://localhost:3001/questions/category/typescript

# Get all categories
curl http://localhost:3001/categories
```

### Verify Markdown Content
```bash
curl http://localhost:3001/questions/type-vs-interface | jq '.contentMarkdown'
```

---

## File Structure

```
prisma/
├── schema.prisma              # Database schema
├── seed-questions.ts          # Seed script for questions
├── seed.ts                    # Main seed script
└── migrations/
    └── 20260118110920_add_localized_questions/
        └── migration.sql      # Migration SQL

src/modules/questions/
├── controllers/
│   ├── questions.controller.ts
│   └── categories.controller.ts
├── services/
│   ├── questions.service.ts
│   └── categories.service.ts
├── dto/
│   ├── question.dto.ts
│   └── category.dto.ts
└── questions.module.ts
```

---

## Performance Considerations

### Pagination
Always use pagination for list endpoints:
```bash
GET /questions?page=1&limit=20
```

### Caching
Consider adding Redis for:
- Frequently accessed questions
- Category lists
- Question counts

### Indexing
Current indexes:
- `Question.slug` (unique)
- `Question.categoryId`
- `Category.slug` (unique)

---

## Future Enhancements

- [ ] Add full-text search on markdown content
- [ ] Version control for questions
- [ ] Question analytics (views, completion rate)
- [ ] Collaborative editing
- [ ] Automated Ukrainian translations
- [ ] Import/Export in multiple formats
- [ ] Question difficulty auto-detection
- [ ] Related questions algorithm

---

## Related Documentation

- Main migration guide: `/Users/petro/Desktop/mine-copy/QUESTIONS_MIGRATION.md`
- Prisma docs: https://www.prisma.io/docs
- API documentation: Coming soon (Swagger)
