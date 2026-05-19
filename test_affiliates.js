const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '/Users/kd5000/Documents/Mr. Copywriter/.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase
    .from('aurum_projects')
    .select('*');
  console.log("Current aurum_projects:");
  console.log(data);
}
test();
