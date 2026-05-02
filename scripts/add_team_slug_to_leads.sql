-- Update aurum_leads table to support Rotator Team Tags
-- Run this in your Supabase SQL Editor

ALTER TABLE public.aurum_leads 
ADD COLUMN IF NOT EXISTS team_slug TEXT;

-- (Optional) Create an index to quickly query leads by their team
CREATE INDEX IF NOT EXISTS idx_aurum_leads_team_slug ON public.aurum_leads(team_slug);
