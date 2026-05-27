-- Create the freemium_prospects table
CREATE TABLE IF NOT EXISTS public.freemium_prospects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    first_name TEXT,
    visit_count INTEGER DEFAULT 0,
    last_visit_date DATE,
    sponsor_code TEXT DEFAULT '1W145K',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the freemium_payments table to track checkout transactions
CREATE TABLE IF NOT EXISTS public.freemium_payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    prospect_id UUID REFERENCES public.freemium_prospects(id) ON DELETE CASCADE,
    tx_hash TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add some basic Row Level Security (RLS) policies
ALTER TABLE public.freemium_prospects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.freemium_payments ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (Next.js server)
CREATE POLICY "Enable full access for service role" ON public.freemium_prospects
    FOR ALL USING (true);
CREATE POLICY "Enable full access for service role on payments" ON public.freemium_payments
    FOR ALL USING (true);
