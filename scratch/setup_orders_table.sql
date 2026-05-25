-- Run this snippet in your Supabase SQL Editor to create the aurum_orders table

CREATE TABLE aurum_orders (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text,
  telegram text,
  plan_id text NOT NULL,
  status text DEFAULT 'pending_payment'::text NOT NULL,
  amount text
);

-- Set up Row Level Security (RLS) to prevent unauthorized access from the client
ALTER TABLE aurum_orders ENABLE ROW LEVEL SECURITY;

-- Allow inserts from anon (so the website can submit orders)
CREATE POLICY "Enable insert for anon on orders" ON aurum_orders FOR INSERT WITH CHECK (true);

-- Only allow admins to read orders (assuming you manage them in a secure backoffice)
-- For now, we leave reading protected.
