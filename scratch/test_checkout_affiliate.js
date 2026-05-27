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

async function testCheckoutAffiliate() {
  const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'] || '';
  const supabaseKey = env['SUPABASE_SERVICE_ROLE_KEY'] || env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] || '';
  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log('--- Testing Checkout with affiliate_code ---');
  const email = 'test.affiliate.order@gmail.com';

  // 1. Clean up any existing test records first
  await supabase.from('aurum_orders').delete().eq('email', email);

  // 2. Insert new order with affiliate_code
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
      status: 'pending_payment',
      affiliate_code: '1W145K' // Testing the new column
    }])
    .select();

  if (insertError) {
    console.error('❌ Insert failed:', insertError.message, insertError.code);
    return;
  }
  console.log('✅ Insert successful:', insertData);

  // 3. Clean up the test order
  console.log('Cleaning up test data...');
  const { error: deleteError } = await supabase
    .from('aurum_orders')
    .delete()
    .eq('email', email);

  if (deleteError) {
    console.error('❌ Cleanup failed:', deleteError);
  } else {
    console.log('✅ Cleanup successful. testCheckoutAffiliate PASSED.');
  }
}

testCheckoutAffiliate();
