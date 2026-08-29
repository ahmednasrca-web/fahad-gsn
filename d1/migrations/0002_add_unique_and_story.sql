-- Migration: Add is_unique_piece and story fields to works table
ALTER TABLE works ADD COLUMN is_unique_piece INTEGER NOT NULL DEFAULT 0;
ALTER TABLE works ADD COLUMN story_ar TEXT;
ALTER TABLE works ADD COLUMN story_en TEXT;
