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

async function activateProjects() {
  try {
    const { data: d1, error: e1 } = await supabase
      .from('aurum_projects')
      .update({ is_active: true })
      .eq('slug', 'neyro');

    const { data: d2, error: e2 } = await supabase
      .from('aurum_projects')
      .update({ is_active: true })
      .eq('slug', 'neyro-gateway');

    console.log("Neyro Protocol Activation:", { d1, e1 });
    console.log("Neyro Gateway Activation:", { d2, e2 });
  } catch (e) {
    console.error('Failed:', e.message);
  }
}

activateProjects();
