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
  const { data: affiliates, error } = await supabase
    .from('aurum_affiliates')
    .select('id, unlocked_funnels, full_name, affiliate_code');

  for (const aff of affiliates) {
    if (!aff.unlocked_funnels) continue;
    
    let funnels = aff.unlocked_funnels.split(',').map(s => s.trim()).filter(Boolean);
    
    let changed = false;
    // Remove old ghost wrapper
    if (funnels.includes('neyro-wrapper')) {
      funnels = funnels.filter(f => f !== 'neyro-wrapper');
      changed = true;
    }
    
    // Remove neyro from everyone EXCEPT Justin Bordessa (U1Y410)
    // Wait, let's let the admin do this via the UI, I'll just fix the ghost wrapper.
    
    if (changed) {
      await supabase.from('aurum_affiliates').update({ unlocked_funnels: funnels.join(',') }).eq('id', aff.id);
      console.log(`Cleaned ${aff.full_name}`);
    }
  }
  console.log('Cleanup complete.');
}
clean();
