-- Add category enum for problems
DO $$ BEGIN
  CREATE TYPE problem_category AS ENUM ('javascript', 'react', 'typescript', 'other');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Add category column to problems table
ALTER TABLE problems ADD COLUMN IF NOT EXISTS category problem_category DEFAULT 'javascript' NOT NULL;

-- Create index on category for better query performance
CREATE INDEX IF NOT EXISTS problems_category_idx ON problems(category);

-- Update existing problems to be javascript category (if any exist)
UPDATE problems SET category = 'javascript' WHERE category IS NULL;
