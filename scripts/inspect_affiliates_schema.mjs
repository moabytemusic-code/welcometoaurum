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
  const { data: records, error } = await supabase
    .from('aurum_affiliates')
    .select('*')
    .limit(1);

  if (error) {
    console.error("Supabase SELECT error:", error);
  } else if (records && records[0]) {
    console.log("Affiliates Columns:", Object.keys(records[0]));
    console.log("Affiliates Sample Row:", records[0]);
  } else {
    console.log("No records found");
  }
}

run();
