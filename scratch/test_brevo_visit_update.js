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

const BREVO_API_KEY = env.BREVO_API_KEY;

async function testBrevoVisitUpdate() {
  const email = 'test.aurum.optin@gmail.com';
  const visitCount = 8;

  console.log(`--- Testing Brevo CRM Attribute Sync ---`);
  console.log(`Updating contact '${email}' with VISIT_COUNT = ${visitCount}...`);

  try {
    const res = await fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY
      },
      body: JSON.stringify({
        attributes: {
          VISIT_COUNT: visitCount
        }
      })
    });

    if (res.ok) {
      console.log(`✅ Success! Contact attributes updated in Brevo.`);
    } else {
      const errData = await res.json();
      console.error(`❌ Failed:`, errData.message || errData);
    }
  } catch (err) {
    console.error('Error during fetch:', err.message);
  }
}

testBrevoVisitUpdate();
