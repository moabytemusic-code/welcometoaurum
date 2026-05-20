import fs from 'fs';

const envFile = fs.readFileSync('./.env.local', 'utf8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) envVars[match[1]] = match[2].trim();
});

const apiKey = envVars.BREVO_API_KEY;

async function check(id) {
  const res = await fetch(`https://api.brevo.com/v3/smtp/templates/${id}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'api-key': apiKey
    }
  });
  console.log(`GET ${id}: Status ${res.status}`);
  if (res.ok) {
    const data = await res.json();
    console.log(`Template name: ${data.name}`);
  } else {
    const err = await res.json();
    console.log(err);
  }
}

check(745);
