-- Add funnel_url to rotators table
-- Run this in your Supabase SQL Editor

ALTER TABLE public.rotators 
ADD COLUMN IF NOT EXISTS funnel_url TEXT;

-- Update the existing AllUNeed rotator as an example
UPDATE public.rotators
SET funnel_url = '/f/all-u-need'
WHERE slug = 'all-u-need';
