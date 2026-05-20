import fs from 'fs';

const envFile = fs.readFileSync('./.env.local', 'utf8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) envVars[match[1]] = match[2].trim();
});

const apiKey = envVars.BREVO_API_KEY;

async function check() {
  const res = await fetch(`https://api.brevo.com/v3/smtp/templates/745`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'api-key': apiKey
    },
    body: JSON.stringify({
      subject: "Test Subject Update"
    })
  });
  console.log(`PUT 745: Status ${res.status}`);
  const data = await res.json();
  console.log(data);
}

check();
