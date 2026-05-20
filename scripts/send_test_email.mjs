import fs from 'fs';

const envFile = fs.readFileSync('./.env.local', 'utf8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) envVars[match[1]] = match[2].trim();
});

const apiKey = envVars.BREVO_API_KEY;

async function sendTest() {
  try {
    const payload = {
      to: [{ email: 'kentjigga@gmail.com', name: 'Ken Davis' }],
      templateId: 743,
      params: {
        FIRSTNAME: 'Ken',
        SPONSOR_NAME: 'Aurum Corporate'
      }
    };

    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': apiKey
      },
      body: JSON.stringify(payload)
    });

    console.log("Status:", res.status);
    const data = await res.json();
    console.log("Response:", data);
  } catch (e) {
    console.error('Failed:', e.message);
  }
}

sendTest();
