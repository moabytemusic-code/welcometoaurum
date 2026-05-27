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

async function testDuplicateLeads() {
  const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'] || '';
  const supabaseKey = env['SUPABASE_SERVICE_ROLE_KEY'] || env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] || '';
  const supabase = createClient(supabaseUrl, supabaseKey);

  const email = 'duplicate.test.lead@gmail.com';
  console.log('--- Testing Duplicate Leads ---');

  // Clean up
  await supabase.from('aurum_leads').delete().eq('email', email);

  // Insert 1st time
  console.log('Inserting first time...');
  const res1 = await supabase.from('aurum_leads').insert([{
    email,
    first_name: 'Lead1',
    sponsor_code: '1W145K',
    landing_variant: 'pitch'
  }]).select();
  console.log('1st Insert Success:', res1.error === null);

  // Insert 2nd time
  console.log('Inserting second time...');
  const res2 = await supabase.from('aurum_leads').insert([{
    email,
    first_name: 'Lead2',
    sponsor_code: '1W145K',
    landing_variant: 'syllabus-freemium'
  }]).select();
  console.log('2nd Insert Success:', res2.error === null);
  if (res2.error) {
    console.log('2nd Insert Error details:', res2.error.message, res2.error.code);
  }

  // Query all entries for this email
  const { data } = await supabase.from('aurum_leads').select('*').eq('email', email);
  console.log('Total entries found for email:', data ? data.length : 0);

  // Clean up
  await supabase.from('aurum_leads').delete().eq('email', email);
}

testDuplicateLeads();
