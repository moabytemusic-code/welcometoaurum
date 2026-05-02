-- Rotator Engine Supabase Schema & RPC
-- This script creates the necessary tables and the concurrency-safe RPC function.

-- 1. Create the rotators table
CREATE TABLE IF NOT EXISTS public.rotators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL, -- e.g., 'downline-builder'
    type TEXT NOT NULL CHECK (type IN ('QUEUE_TARGET', 'RANDOM', 'WEIGHTED')),
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'PAUSED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create the rotator_entries table
CREATE TABLE IF NOT EXISTS public.rotator_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rotator_id UUID REFERENCES public.rotators(id) ON DELETE CASCADE,
    member_id TEXT NOT NULL, -- The affiliate ID or referral code
    queue_position INTEGER NOT NULL DEFAULT 1,
    target_conversions INTEGER DEFAULT 0,
    current_conversions INTEGER DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'COMPLETED', 'PAUSED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create the rotator_hits table for analytics
CREATE TABLE IF NOT EXISTS public.rotator_hits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rotator_id UUID REFERENCES public.rotators(id) ON DELETE CASCADE,
    assigned_member_id TEXT NOT NULL,
    hit_type TEXT NOT NULL DEFAULT 'CLICK',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.rotators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rotator_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rotator_hits ENABLE ROW LEVEL SECURITY;

-- Basic Policies (Adjust based on your auth setup)
CREATE POLICY "Enable read access for all users" ON public.rotators FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.rotator_entries FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.rotator_hits FOR INSERT WITH CHECK (true);

-- 4. Create the RPC Function for safe, atomic assignment
CREATE OR REPLACE FUNCTION process_rotator_conversion(p_rotator_slug TEXT)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    v_rotator_id UUID;
    v_entry_id UUID;
    v_member_id TEXT;
    v_current_conversions INTEGER;
    v_target_conversions INTEGER;
BEGIN
    -- Get the rotator ID
    SELECT id INTO v_rotator_id 
    FROM public.rotators 
    WHERE slug = p_rotator_slug AND status = 'ACTIVE'
    LIMIT 1;

    IF v_rotator_id IS NULL THEN
        RETURN NULL; -- Rotator not found or not active
    END IF;

    -- Find the active entry with the lowest queue_position and lock it for update
    -- SELECT FOR UPDATE skips locked rows to prevent waiting, ensuring fast response if we tweak it,
    -- but for strict queuing, we want to wait for the lock to ensure we don't skip the first person.
    SELECT id, member_id, current_conversions, target_conversions
    INTO v_entry_id, v_member_id, v_current_conversions, v_target_conversions
    FROM public.rotator_entries
    WHERE rotator_id = v_rotator_id 
      AND status = 'ACTIVE'
      AND current_conversions < target_conversions
    ORDER BY queue_position ASC, created_at ASC
    LIMIT 1
    FOR UPDATE;

    IF v_entry_id IS NULL THEN
        -- Fallback: If no one is active/needs hits, maybe return a default admin link or NULL
        RETURN NULL;
    END IF;

    -- Increment the conversions
    UPDATE public.rotator_entries
    SET current_conversions = current_conversions + 1,
        status = CASE 
                    WHEN (current_conversions + 1) >= target_conversions THEN 'COMPLETED' 
                    ELSE 'ACTIVE' 
                 END
    WHERE id = v_entry_id;

    -- Log the hit
    INSERT INTO public.rotator_hits (rotator_id, assigned_member_id, hit_type)
    VALUES (v_rotator_id, v_member_id, 'CLICK');

    -- Return the assigned member ID so Next.js can redirect
    RETURN v_member_id;
END;
$$;
