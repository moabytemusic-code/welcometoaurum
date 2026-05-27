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

async function deleteOrder() {
  const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'] || '';
  const supabaseKey = env['SUPABASE_SERVICE_ROLE_KEY'] || env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] || '';
  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log('Deleting test order for test.order.user@gmail.com...');
  const { data, error } = await supabase
    .from('aurum_orders')
    .delete()
    .eq('email', 'test.order.user@gmail.com');

  if (error) {
    console.error('Delete error:', error);
  } else {
    console.log('Deleted successfully. Info:', data);
  }
}

deleteOrder();
