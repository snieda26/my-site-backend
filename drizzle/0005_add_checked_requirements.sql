-- Add checked_requirements column to solved_problems table
ALTER TABLE solved_problems ADD COLUMN IF NOT EXISTS checked_requirements jsonb DEFAULT '[]'::jsonb;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS solved_problems_checked_requirements_idx ON solved_problems USING GIN (checked_requirements);
