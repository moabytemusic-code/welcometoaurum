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

async function checkFunction() {
  console.log("Checking for function: process_rotator_conversion");
  const { data, error } = await supabase
    .rpc('process_rotator_conversion', { p_rotator_slug: 'test' });

  if (error) {
    console.error("Error calling function:", error.message);
    console.error("Full Error:", error);
  } else {
    console.log("Function exists! Data:", data);
  }
}

checkFunction();
