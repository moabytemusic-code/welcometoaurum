import fs from 'fs';
import path from 'path';

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

const BREVO_API_KEY = env.BREVO_API_KEY;

async function pushWebinarTemplate() {
  console.log('Pushing AURUM_FREEMIUM_WEBINAR automation template to Brevo...');
  
  try {
    const htmlContent = fs.readFileSync('src/templates/emails/freemium_webinar_invite.html', 'utf8');

    const templateData = {
      templateName: "AURUM_FREEMIUM_WEBINAR",
      subject: "Private Invitation: AI Finance Orientation, {{ contact.FIRSTNAME }}",
      htmlContent,
      isActive: true,
      sender: { 
        name: "Aurum Rise Onboarding Team", 
        email: "onboarding@smarthustlermarketing.com" 
      }
    };

    const res = await fetch('https://api.brevo.com/v3/smtp/templates', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY
      },
      body: JSON.stringify(templateData)
    });
    
    const data = await res.json();
    if (res.ok) {
      console.log(`✅ Success! Created Automation Template: ${templateData.templateName} (ID: ${data.id})`);
    } else {
      console.error(`❌ Failed:`, data.message);
    }
  } catch (err) {
    console.error(`Error:`, err.message);
  }
}

pushWebinarTemplate();
