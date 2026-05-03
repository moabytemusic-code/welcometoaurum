const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Parse .env.local manually
const envContent = fs.readFileSync('.env.local', 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '');
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkRotator() {
  const slug = 'all-u-need';
  console.log(`Checking rotator: ${slug}`);
  
  const { data: rotator, error: rError } = await supabase
    .from('rotators')
    .select('*')
    .eq('slug', slug)
    .single();

  if (rError) {
    console.error("Rotator Error:", rError.message);
    return;
  }
  
  console.log("Rotator found:", rotator);

  const { data: entries, error: eError } = await supabase
    .from('rotator_entries')
    .select('*')
    .eq('rotator_id', rotator.id);

  if (eError) {
    console.error("Entries Error:", eError.message);
    return;
  }

  console.log("Entries found:", entries);
  
  // Check the RPC logic manually
  const { data: nextMember, error: rpcError } = await supabase
    .rpc('process_rotator_conversion', { p_rotator_slug: slug });
    
  console.log("RPC Next Member:", nextMember);
  if (rpcError) console.error("RPC Error:", rpcError);
}

checkRotator();
