import fs from 'fs';

const envFile = fs.readFileSync('./.env.local', 'utf8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) envVars[match[1]] = match[2].trim();
});

const apiKey = envVars.BREVO_API_KEY;

async function listSenders() {
  try {
    const res = await fetch('https://api.brevo.com/v3/senders', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'api-key': apiKey
      }
    });

    if (res.ok) {
      const data = await res.json();
      console.log('--- Brevo Senders ---');
      data.senders.forEach(s => {
        console.log(`ID: ${s.id} | Name: ${s.name} | Email: ${s.email} | Active: ${s.active}`);
      });
      console.log('---------------------');
    } else {
      const err = await res.json();
      console.error('Error fetching senders:', err);
    }
  } catch (e) {
    console.error('Failed:', e.message);
  }
}

listSenders();
