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

async function inspectOrdersSchema() {
  const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'] || '';
  const supabaseKey = env['SUPABASE_SERVICE_ROLE_KEY'] || env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] || '';
  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log('Fetching a single record or schema information from aurum_orders...');
  const { data, error } = await supabase.from('aurum_orders').select('*').limit(1);

  if (error) {
    console.error('Error fetching orders:', error);
  } else {
    console.log('Orders sample record:', data);
    if (data && data.length > 0) {
      console.log('Available columns in database:', Object.keys(data[0]));
    } else {
      console.log('No records found to extract keys, let\'s try to insert and rollback.');
    }
  }
}

inspectOrdersSchema();
