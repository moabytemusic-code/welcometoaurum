import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Parse .env.local manually
const envFile = fs.readFileSync('.env.local', 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const value = parts.slice(1).join('=').trim();
    env[key] = value;
  }
});

async function tryInsert() {
  const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'] || '';
  const supabaseKey = env['SUPABASE_SERVICE_ROLE_KEY'] || env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] || '';
  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log('Testing if sponsor_code column exists...');
  const { data, error } = await supabase
    .from('aurum_orders')
    .insert([{
      first_name: 'Test',
      last_name: 'Tester',
      email: 'test.exists@gmail.com',
      plan_id: 'vip',
      sponsor_code: '1W145K' // We try to insert with this column name
    }])
    .select();

  if (error) {
    console.error('❌ Insert returned error:', error.message, error.code);
  } else {
    console.log('✅ Column exists! Insert succeeded:', data);
    // Cleanup
    await supabase.from('aurum_orders').delete().eq('email', 'test.exists@gmail.com');
  }
}

tryInsert();
