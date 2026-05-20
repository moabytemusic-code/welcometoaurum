import fs from 'fs';

const envFile = fs.readFileSync('/Users/kd5000/Documents/Mr. Copywriter/.env.local', 'utf8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) envVars[match[1]] = match[2].trim();
});

const apiKey = envVars.BREVO_API_KEY;

async function run() {
  const payload = {
    email: 'kentjigga@gmail.com',
    attributes: {
      FIRSTNAME: 'Ken',
      SMS: '', 
      SPONSOR_CODE: '1W145K',
      SPONSOR_NAME: 'Aurum Corporate',
      LANDING_VARIANT: 'neyro_gateway'
    },
    listIds: [68],
    updateEnabled: true
  };

  try {
    const res = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': apiKey
      },
      body: JSON.stringify(payload)
    });

    console.log("Status Code:", res.status);
    const data = await res.json();
    console.log("Response:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error:", err.message);
  }
}

run();
