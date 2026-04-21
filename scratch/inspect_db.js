
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function inspect() {
  console.log('--- Inspecting Supabase Tables ---');
  
  // Try to list tables (requires specific permissions, might fail)
  // Instead, let's try common table names
  const commonTables = ['profiles', 'users', 'affiliates', 'partners', 'aurum_affiliates'];
  
  for (const table of commonTables) {
    const { data, error, count } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.log(`[${table}]: Not Accessible or Doesn't Exist (${error.message})`);
    } else {
      console.log(`[${table}]: EXISTS (Row count: ${count})`);
    }
  }
}

inspect();
