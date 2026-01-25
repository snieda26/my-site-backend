-- Add Ukrainian fields to problems table
ALTER TABLE problems 
ADD COLUMN title_ua VARCHAR(500),
ADD COLUMN description_ua TEXT;

-- Update existing problems with Ukrainian translations will be done via seed script
