import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envFile = fs.readFileSync('/Users/kd5000/Documents/Mr. Copywriter/.env.local', 'utf8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) envVars[match[1]] = match[2].trim();
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  // Let's check if the database client allows updates on unlocked_funnels via anon key (since client might use it)
  // But wait, the API route uses SUPABASE_SERVICE_ROLE_KEY!
  // Let's test using the Service Role Key since the API route uses it!
  const serviceKey = envVars.SUPABASE_SERVICE_ROLE_KEY;
  const serviceSupabase = createClient(supabaseUrl, serviceKey);

  // Let's try to update unlocked_funnels for test partner '1W145K'
  const { data, error } = await serviceSupabase
    .from('aurum_affiliates')
    .update({ unlocked_funnels: 'neyro' })
    .eq('affiliate_code', '1W145K')
    .select();

  if (error) {
    console.error("Database update error:", error);
  } else {
    console.log("Database update succeeded!", data);
  }
}

run();
