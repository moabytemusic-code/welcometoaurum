const fs = require('fs');
const path = require('path');

// Parse .env.local manually
const envFile = fs.readFileSync('.env.local', 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const value = parts.slice(1).join('=').trim();
    env[key] = value;
  }
});

const BREVO_API_KEY = env['BREVO_API_KEY'];

if (!BREVO_API_KEY) {
  console.error("BREVO_API_KEY not found in .env.local!");
  process.exit(1);
}

const template = {
  templateName: "AURUM_PARTNER_WELCOME",
  subject: "Welcome to Aurum Rise: Membership Active!",
  htmlContent: fs.readFileSync('src/templates/emails/partner_welcome.html', 'utf8'),
  sender: { name: "Aurum Rise Onboarding Team", email: "onboarding@smarthustlermarketing.com" }
};

async function pushTemplate() {
  console.log('Pushing AURUM_PARTNER_WELCOME template to Brevo...');
  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/templates', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY
      },
      body: JSON.stringify(template)
    });
    
    const data = await res.json();
    if (res.ok) {
      console.log(`✅ Created Template: ${template.templateName} (ID: ${data.id})`);
    } else {
      console.error(`❌ Failed:`, data.message);
    }
  } catch (err) {
    console.error(`Error:`, err.message);
  }
}

pushTemplate();
