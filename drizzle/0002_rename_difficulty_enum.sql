-- Migration: Rename difficulty enum values from EASY/MEDIUM/HARD to JUNIOR/MIDDLE/SENIOR
-- PostgreSQL 10+ supports ALTER TYPE ... RENAME VALUE

-- Rename enum values
ALTER TYPE difficulty RENAME VALUE 'EASY' TO 'JUNIOR';
ALTER TYPE difficulty RENAME VALUE 'MEDIUM' TO 'MIDDLE';
ALTER TYPE difficulty RENAME VALUE 'HARD' TO 'SENIOR';
