import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Read .env.local manually since dotenv might not be installed
const envFile = fs.readFileSync('/Users/kd5000/Documents/Mr. Copywriter/.env.local', 'utf8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) envVars[match[1]] = match[2];
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY || envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function clean() {
  const { data, error } = await supabase
    .from('aurum_projects')
    .update({ is_active: true })
    .eq('slug', 'neyro-gateway');
  console.log("Update result:", { data, error });
}
clean();
