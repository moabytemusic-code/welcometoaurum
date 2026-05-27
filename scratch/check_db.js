import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Parse .env.local manually
const envFile = fs.readFileSync('.env.local', 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const value = parts.slice(1).join('=').trim();
    env[key] = value;
  }
});

async function checkLeads() {
  const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'] || '';
  const supabaseKey = env['SUPABASE_SERVICE_ROLE_KEY'] || env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] || '';
  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log('Checking supabase leads for test.aurum.optin@gmail.com...');
  const { data, error } = await supabase
    .from('aurum_leads')
    .select('*')
    .eq('email', 'test.aurum.optin@gmail.com');

  if (error) {
    console.error('Error fetching leads:', error);
  } else {
    console.log('Leads found:', data);
  }
}

checkLeads();
