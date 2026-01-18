-- Migration: Split content_markdown into language-specific fields

-- Step 1: Add new columns with default values
ALTER TABLE questions ADD COLUMN IF NOT EXISTS content_markdown_en TEXT DEFAULT '';
ALTER TABLE questions ADD COLUMN IF NOT EXISTS content_markdown_ua TEXT DEFAULT '';

-- Step 2: Copy existing content to English field
UPDATE questions SET content_markdown_en = content_markdown WHERE content_markdown_en = '';

-- Step 3: Set Ukrainian content (will be translated later)
UPDATE questions SET content_markdown_ua = content_markdown WHERE content_markdown_ua = '';

-- Step 4: Remove default constraint
ALTER TABLE questions ALTER COLUMN content_markdown_en DROP DEFAULT;
ALTER TABLE questions ALTER COLUMN content_markdown_ua DROP DEFAULT;

-- Step 5: Make columns NOT NULL
ALTER TABLE questions ALTER COLUMN content_markdown_en SET NOT NULL;
ALTER TABLE questions ALTER COLUMN content_markdown_ua SET NOT NULL;

-- Step 6: Drop old column
ALTER TABLE questions DROP COLUMN IF EXISTS content_markdown;
