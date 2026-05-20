import fs from 'fs';

const envFile = fs.readFileSync('./.env.local', 'utf8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) envVars[match[1]] = match[2].trim();
});

const apiKey = envVars.BREVO_API_KEY;

async function getTemplateText(id) {
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
      console.log(`=== TEMPLATE ${id} ===`);
      console.log(`Subject: ${data.subject}`);
      
      const cleanText = data.htmlContent
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, '\n')
        .replace(/\n\s*\n/g, '\n')
        .trim();
      
      console.log(cleanText);
      console.log('======================\n');
    }
  } catch (e) {
    console.error(e);
  }
}

async function run() {
  await getTemplateText(745);
  await getTemplateText(748);
  await getTemplateText(751);
}

run();
