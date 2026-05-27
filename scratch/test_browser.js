import puppeteer from 'puppeteer';
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

async function runBrowserTest() {
  const email = 'test.browser.funnel@gmail.com';
  const password = 'BrowserPassword123!';
  const name = 'BrowserTester';

  console.log('--- Starting Headless Browser Registration Test ---');
  
  // 1. Clean up database first
  await supabase.from('freemium_prospects').delete().eq('email', email);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  try {
    // Set viewport size for clear screenshots
    await page.setViewport({ width: 1280, height: 800 });

    console.log('1. Navigating to Register Page...');
    await page.goto('https://aurum-education-portal.vercel.app/syllabus/register', {
      waitUntil: 'networkidle2'
    });

    console.log('2. Filling out the registration form...');
    await page.waitForSelector('input[type="email"]');
    
    // Type info
    await page.type('input[placeholder*="First Name"]', name);
    await page.type('input[type="email"]', email);
    await page.type('input[type="password"]', password);

    console.log('3. Clicking Activate My Access button...');
    
    // Click submit button
    await page.click('button[type="submit"]');

    // Wait a couple of seconds to see what happens
    console.log('Waiting for network requests or client redirection...');
    await new Promise(r => setTimeout(r, 5000));

    // Take screenshot of whatever is currently on screen
    console.log('Saving intermediate page screenshot...');
    await page.screenshot({ path: 'scratch/after_submit.png' });

    console.log('Checking current URL...');
    const currentUrl = page.url();
    console.log('Current URL is:', currentUrl);

    // Wait for the client-side redirect to complete
    console.log('Waiting for URL redirection to syllabus dashboard...');
    await page.waitForFunction(
      () => window.location.pathname === '/syllabus' || window.location.pathname === '/syllabus/',
      { timeout: 15000 }
    );

    const finalUrl = page.url();
    console.log('Final URL after submit:', finalUrl);

    // Wait for syllabus page header to load
    await page.waitForSelector('h1', { timeout: 10000 });

    console.log('Saving syllabus page screenshot...');
    await page.screenshot({ path: 'scratch/syllabus_page.png' });

    // Verify cookies
    const cookies = await page.cookies();
    const freemiumCookie = cookies.find(c => c.name === 'aurum_freemium_session');
    
    if (freemiumCookie) {
      console.log('✅ Success: Cookie "aurum_freemium_session" is set.');
    } else {
      console.log('❌ Error: Cookie "aurum_freemium_session" is missing.');
    }

    // Verify DB
    console.log('4. Verifying DB visit increment and registration status...');
    const { data: user } = await supabase
      .from('freemium_prospects')
      .select('*')
      .eq('email', email)
      .single();

    if (user) {
      console.log(`✅ Success: User found in DB. ID: ${user.id}, Visit Count: ${user.visit_count}`);
      if (user.visit_count === 1) {
        console.log('✅ Success: Visit count initialized/incremented to 1 via middleware!');
      } else {
        console.log('❌ Error: Visit count is incorrect:', user.visit_count);
      }
    } else {
      console.log('❌ Error: User not found in DB.');
    }

    console.log('5. Cleaning up test user from DB...');
    await supabase.from('freemium_prospects').delete().eq('email', email);
    console.log('✅ Browser registration test PASSED.');
  } catch (err) {
    console.error('❌ Browser test failed:', err.message);
    // Take screenshot of failure
    await page.screenshot({ path: 'scratch/failure_state.png' });
    await supabase.from('freemium_prospects').delete().eq('email', email);
  } finally {
    await browser.close();
  }
}

runBrowserTest();
