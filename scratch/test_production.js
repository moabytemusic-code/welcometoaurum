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

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'] || '';
const supabaseKey = env['SUPABASE_SERVICE_ROLE_KEY'] || env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testProductionEndpoints() {
  const email = 'test.prod.funnel@gmail.com';
  const password = 'ProdPassword123!';
  const name = 'ProdTester';

  console.log('--- Testing Live Production Endpoints ---');
  
  // Clean up any stale records first
  await supabase.from('freemium_prospects').delete().eq('email', email);

  console.log(`1. Sending POST request to register user: ${email}...`);
  try {
    const regRes = await fetch('https://aurum-education-portal.vercel.app/syllabus/api/freemium-register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, first_name: name })
    });

    const regData = await regRes.json();
    console.log('Registration response status:', regRes.status);
    console.log('Registration response data:', regData);

    if (!regRes.ok || !regData.success) {
      throw new Error('Registration failed!');
    }

    // Check DB for the new user
    console.log('2. Verifying user creation in Supabase database...');
    const { data: user, error: userError } = await supabase
      .from('freemium_prospects')
      .select('*')
      .eq('email', email)
      .single();

    if (userError || !user) {
      throw new Error(`Failed to find user in DB: ${userError?.message}`);
    }
    console.log(`User found in DB. ID: ${user.id}, Visit Count: ${user.visit_count}`);

    // Call track-visit in production
    console.log(`3. Sending POST request to track-visit for userId: ${user.id}...`);
    const trackRes = await fetch('https://aurum-education-portal.vercel.app/syllabus/api/track-visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id })
    });

    const trackData = await trackRes.json();
    console.log('Track visit response status:', trackRes.status);
    console.log('Track visit response data:', trackData);

    if (!trackRes.ok || !trackData.success) {
      throw new Error('Tracking failed!');
    }

    // Check updated DB visit count
    console.log('4. Verifying visit count increment in DB...');
    const { data: updatedUser } = await supabase
      .from('freemium_prospects')
      .select('*')
      .eq('email', email)
      .single();

    console.log(`Updated User in DB. Visit Count: ${updatedUser.visit_count}, Last Visit Date: ${updatedUser.last_visit_date}`);
    if (updatedUser.visit_count === 1) {
      console.log('✅ Success! Visit count successfully incremented on tracking visit.');
    } else {
      console.log('❌ Error: Visit count did not increment to 1.');
    }

    // Clean up
    console.log('5. Cleaning up test user from DB...');
    await supabase.from('freemium_prospects').delete().eq('email', email);
    console.log('✅ Cleanup complete. Production test PASSED.');
  } catch (err) {
    console.error('❌ Test failed:', err.message);
    // Cleanup on error
    await supabase.from('freemium_prospects').delete().eq('email', email);
  }
}

testProductionEndpoints();
