import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envFile = fs.readFileSync('./.env.local', 'utf8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) envVars[match[1]] = match[2].trim();
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAffiliates() {
  try {
    const { data: affiliates, error } = await supabase
      .from('aurum_affiliates')
      .select('id, affiliate_code, full_name, is_rotator, unlocked_funnels');

    if (error) {
      console.error('Error fetching affiliates:', error);
      return;
    }

    console.log('--- Supabase Affiliates ---');
    affiliates.forEach(a => {
      console.log(`Code: ${a.affiliate_code} | Name: ${a.full_name} | Rotator: ${a.is_rotator} | Unlocked Funnels: ${a.unlocked_funnels}`);
    });
    console.log('---------------------------');
  } catch (e) {
    console.error('Failed:', e.message);
  }
}

checkAffiliates();
