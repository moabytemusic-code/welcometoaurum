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

async function testInsert() {
  const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'] || '';
  const supabaseKey = env['SUPABASE_SERVICE_ROLE_KEY'] || env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] || '';
  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log('Using Supabase URL:', supabaseUrl);
  console.log('Using Supabase Key (anon):', supabaseKey ? 'present' : 'missing');

  const payload = {
    email: 'test.aurum.optin@gmail.com',
    first_name: 'Testy',
    sponsor_code: '1W145K',
    landing_variant: 'syllabus-freemium',
    team_slug: null
  };

  console.log('Inserting payload:', payload);
  const response = await supabase.from('aurum_leads').insert([payload]).select();

  console.log('Insert Response:', response);
}

testInsert();
