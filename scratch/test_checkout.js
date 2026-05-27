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

async function testCheckout() {
  const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'] || '';
  const supabaseKey = env['SUPABASE_SERVICE_ROLE_KEY'] || env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] || '';
  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log('--- Testing Checkout (aurum_orders) DB Integration ---');
  const email = 'test.order.user@gmail.com';

  // 1. Clean up any existing test records first
  await supabase.from('aurum_orders').delete().eq('email', email);

  // 2. Insert new order
  console.log(`Inserting test order for: ${email}`);
  const { data: insertData, error: insertError } = await supabase
    .from('aurum_orders')
    .insert([{
      first_name: 'John',
      last_name: 'Doe',
      email,
      phone: '+15555555555',
      telegram: '@testorder',
      plan_id: 'vip',
      status: 'pending_payment'
    }])
    .select();

  if (insertError) {
    console.error('❌ Insert failed:', insertError);
    return;
  }
  console.log('✅ Insert successful:', insertData);

  // 3. Query the inserted order
  console.log(`Querying order for: ${email}`);
  const { data: queryData, error: queryError } = await supabase
    .from('aurum_orders')
    .select('*')
    .eq('email', email);

  if (queryError) {
    console.error('❌ Query failed:', queryError);
    return;
  }
  console.log('✅ Query successful. Order Details:', queryData);

  // 4. Clean up the test order
  console.log('Cleaning up test data...');
  const { error: deleteError } = await supabase
    .from('aurum_orders')
    .delete()
    .eq('email', email);

  if (deleteError) {
    console.error('❌ Cleanup failed:', deleteError);
  } else {
    console.log('✅ Cleanup successful. Checkout test PASSED.');
  }
}

testCheckout();
