import fs from 'fs';

const envFile = fs.readFileSync('./.env.local', 'utf8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) envVars[match[1]] = match[2].trim();
});

const apiKey = envVars.BREVO_API_KEY;

async function analyze(id) {
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
      console.log(`=== ANALYZING TEMPLATE ${id} ===`);
      console.log(`Subject: ${data.subject}`);
      console.log(`Sender:`, data.sender);
      
      // Strip html but extract paragraphs and button text/links
      const paragraphs = [];
      const buttonLinks = [];
      
      // Extract links
      const hrefRegex = /href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
      let match;
      while ((match = hrefRegex.exec(data.htmlContent)) !== null) {
        buttonLinks.push({ url: match[1], text: match[2].replace(/<[^>]+>/g, '').trim() });
      }

      // Simple tag cleaning to get paragraphs
      const bodyOnly = data.htmlContent
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '')
        .replace(/<[^>]+>/g, '\n');
      
      bodyOnly.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (trimmed && trimmed.length > 10 && !trimmed.startsWith('@import') && !trimmed.includes('{') && !trimmed.includes('}')) {
          paragraphs.push(trimmed);
        }
      });

      console.log('--- Key Paragraphs ---');
      paragraphs.slice(0, 10).forEach(p => console.log(`- ${p}`));
      console.log('--- Links & Buttons ---');
      buttonLinks.forEach(l => console.log(`- Text: "${l.text}" | URL: ${l.url}`));
      console.log('=======================\n');
    }
  } catch (e) {
    console.error(e);
  }
}

async function run() {
  await analyze(745);
  await analyze(748);
  await analyze(751);
}

run();
