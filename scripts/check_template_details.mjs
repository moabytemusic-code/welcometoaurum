import fs from 'fs';

const envFile = fs.readFileSync('./.env.local', 'utf8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) envVars[match[1]] = match[2].trim();
});

const apiKey = envVars.BREVO_API_KEY;

async function checkTemplate(id) {
  try {
    const res = await fetch(`https://api.brevo.com/v3/smtp/templates/${id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'api-key': apiKey
      }
    });

    if (res.ok) {
      const data = await res.json();
      console.log(`========================= TEMPLATE ${id} =========================`);
      console.log(`ID: ${data.id}`);
      console.log(`Name: ${data.name}`);
      console.log(`Subject: ${data.subject}`);
      console.log(`Sender:`, data.sender);
      console.log(`IsActive: ${data.isActive}`);
      console.log(`HTML Content:\n${data.htmlContent}`);
      console.log(`===================================================================\n`);
    } else {
      const err = await res.json();
      console.error(`Error fetching template ${id}:`, err);
    }
  } catch (e) {
    console.error('Failed:', e.message);
  }
}

async function run() {
  await checkTemplate(743);
  await checkTemplate(744);
}

run();

