-- Schema script for Partner Backoffice Payments and Runs
-- Run this in your Supabase SQL Editor to create the necessary tables and fields.

-- 1. Extend aurum_affiliates table to support paid rotator runs (safe operation)
ALTER TABLE public.aurum_affiliates 
ADD COLUMN IF NOT EXISTS rotator_runs INTEGER DEFAULT 0;

-- 2. Create the aurum_crypto_payments table
CREATE TABLE IF NOT EXISTS public.aurum_crypto_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    affiliate_id UUID REFERENCES public.aurum_affiliates(id) ON DELETE CASCADE,
    coin_type TEXT NOT NULL CHECK (coin_type IN ('BTC', 'BNB', 'USDT', 'XLM')),
    runs_requested INTEGER DEFAULT 1,
    txid TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'declined')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    approved_at TIMESTAMP WITH TIME ZONE
);

-- 3. Enable Row Level Security (RLS) to prevent unauthorized access
-- Since API routes use the Service Role Key, they bypass RLS automatically.
-- No public policies are needed, keeping the table completely secure.
ALTER TABLE public.aurum_crypto_payments ENABLE ROW LEVEL SECURITY;