import fs from 'fs';

const envFile = fs.readFileSync('./.env.local', 'utf8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) envVars[match[1]] = match[2].trim();
});

const apiKey = envVars.BREVO_API_KEY;

async function run() {
  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/templates/744', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'api-key': apiKey
      }
    });

    if (res.ok) {
      const data = await res.json();
      console.log('=== TEMPLATE 744 TEXT CONTENT ===');
      console.log('Subject:', data.subject);
      
      // Simple HTML tags stripper to print clean text
      const cleanText = data.htmlContent
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, '\n')
        .replace(/\n\s*\n/g, '\n')
        .trim();
      
      console.log(cleanText);
      console.log('=================================');
    }
  } catch (e) {
    console.error(e);
  }
}

run();
