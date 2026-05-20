import fs from 'fs';

const envFile = fs.readFileSync('./.env.local', 'utf8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) envVars[match[1]] = match[2].trim();
});

const apiKey = envVars.BREVO_API_KEY;

async function getTemplate(id) {
  const res = await fetch(`https://api.brevo.com/v3/smtp/templates/${id}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'api-key': apiKey
    }
  });
  if (!res.ok) throw new Error(`Failed to fetch ${id}`);
  const data = await res.json();
  
  // Format clean text
  const cleanText = data.htmlContent
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '')
    .replace(/<[^>]+>/g, '\n')
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .join('\n');

  return {
    id,
    subject: data.subject,
    name: data.name,
    sender: data.sender,
    text: cleanText
  };
}

async function run() {
  try {
    const t745 = await getTemplate(745);
    const t748 = await getTemplate(748);
    const t751 = await getTemplate(751);

    let output = '';
    [t745, t748, t751].forEach(t => {
      output += `==================================================\n`;
      output += `TEMPLATE ID: ${t.id}\n`;
      output += `NAME: ${t.name}\n`;
      output += `SUBJECT: ${t.subject}\n`;
      output += `SENDER: ${JSON.stringify(t.sender)}\n`;
      output += `--------------------------------------------------\n`;
      output += `${t.text}\n`;
      output += `==================================================\n\n`;
    });

    fs.writeFileSync('/Users/kd5000/.gemini/antigravity/brain/9f415234-6b00-4343-b0a2-7094a40513c2/scratch/followups_analysis.txt', output);
    console.log("Analysis saved successfully.");
  } catch (e) {
    console.error(e);
  }
}

run();
