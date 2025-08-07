-- Fix current_tools column type from TEXT[] to TEXT
-- Run this in your Supabase SQL editor

ALTER TABLE waitlist_submissions 
ALTER COLUMN current_tools TYPE TEXT;

-- Also make it nullable since it's optional in the form
ALTER TABLE waitlist_submissions 
ALTER COLUMN current_tools DROP NOT NULL;