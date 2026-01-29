-- Add short answer fields for knowledge check
ALTER TABLE "questions" ADD COLUMN "short_answer_en" text;
ALTER TABLE "questions" ADD COLUMN "short_answer_ua" text;
