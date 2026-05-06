const fs = require('fs');
const path = require('path');

// Mocking process.env for local script if needed, but we'll just read from .env.local
const envFile = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
const BREVO_API_KEY = envFile.match(/BREVO_API_KEY=(.*)/)[1].trim();

const templates = [
  {
    templateName: "AURUM_WELCOME_CORE",
    subject: "Wait, {{ contact.FIRSTNAME }}—don't let the AI wave pass you by",
    htmlContent: fs.readFileSync(path.join(__dirname, '../src/templates/emails/welcome.html'), 'utf8'),
    sender: { name: "Aurum Rise Onboarding Team", email: "onboarding@smarthustlermarketing.com" }
  },
  {
    templateName: "AURUM_WELCOME_VOUCHER",
    subject: "I've reserved $100 for you to start with AI (No tech skills needed), {{ contact.FIRSTNAME }}",
    htmlContent: fs.readFileSync(path.join(__dirname, '../src/templates/emails/welcome.html'), 'utf8'), // Reusing the high-quality template
    sender: { name: "Aurum Rise Onboarding Team", email: "onboarding@smarthustlermarketing.com" }
  }
];

async function pushTemplates() {
  console.log('Pushing updated templates to Brevo...');
  
  for (const template of templates) {
    try {
      // First, we check if the template exists by name to avoid duplicates (simplified: we just push new ones)
      // Note: In a production script, we'd find the ID and PUT to update, 
      // but for this setup, we'll just create them.
      
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
        console.error(`❌ Failed ${template.templateName}:`, data.message);
      }
    } catch (err) {
      console.error(`Error pushing ${template.templateName}:`, err.message);
    }
  }
}

pushTemplates();
