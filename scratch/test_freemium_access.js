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

async function testFreemiumAccess() {
  const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'] || '';
  const supabaseKey = env['SUPABASE_SERVICE_ROLE_KEY'] || env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] || '';
  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log('--- Testing Education Portal (freemium_prospects) DB Integration ---');
  const email = 'test.freemium.user@gmail.com';

  // 1. Clean up any existing test records first
  await supabase.from('freemium_prospects').delete().eq('email', email);

  // 2. Insert new freemium prospect (simulate registration)
  console.log(`Inserting test prospect: ${email}`);
  const { data: insertData, error: insertError } = await supabase
    .from('freemium_prospects')
    .insert([{
      email,
      password_hash: 'dummy_hash_12345',
      first_name: 'EduTester',
      visit_count: 1, // First visit on register
      sponsor_code: '1W145K'
    }])
    .select();

  if (insertError) {
    console.error('❌ Insert failed:', insertError);
    return;
  }
  console.log('✅ Insert successful:', insertData);

  // 3. Query the prospect to simulate a login check
  console.log(`Simulating login query for: ${email}`);
  const { data: queryData, error: queryError } = await supabase
    .from('freemium_prospects')
    .select('*')
    .eq('email', email)
    .single();

  if (queryError) {
    console.error('❌ Login query failed:', queryError);
    return;
  }
  console.log('✅ Login query successful. Visits:', queryData.visit_count);

  // 4. Update the visit count to simulate accessing the syllabus again
  const newVisits = queryData.visit_count + 1;
  console.log(`Incrementing visits to: ${newVisits}`);
  const { data: updateData, error: updateError } = await supabase
    .from('freemium_prospects')
    .update({ 
      visit_count: newVisits,
      last_visit_date: new Date().toISOString().split('T')[0]
    })
    .eq('email', email)
    .select();

  if (updateError) {
    console.error('❌ Visit increment failed:', updateError);
    return;
  }
  console.log('✅ Visit increment successful:', updateData);

  // 5. Clean up the test user
  console.log('Cleaning up test data...');
  const { error: deleteError } = await supabase
    .from('freemium_prospects')
    .delete()
    .eq('email', email);

  if (deleteError) {
    console.error('❌ Cleanup failed:', deleteError);
  } else {
    console.log('✅ Cleanup successful. Integration test PASSED.');
  }
}

testFreemiumAccess();
