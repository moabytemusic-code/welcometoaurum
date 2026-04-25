const fs = require('fs');
const path = require('path');

// Mocking process.env for local script if needed, but we'll just read from .env.local
const envFile = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
const BREVO_API_KEY = envFile.match(/BREVO_API_KEY=(.*)/)[1].trim();

const templates = [
  {
    templateName: "AURUM_WELCOME_CORE",
    subject: "Welcome to the Inner Circle, {{ contact.FIRSTNAME }}",
    htmlContent: fs.readFileSync(path.join(__dirname, '../src/templates/emails/welcome.html'), 'utf8'),
    sender: { name: "Aurum Onboarding Team", email: "onboarding@smarthustlermarketing.com" }
  },
  {
    templateName: "AURUM_WELCOME_VOUCHER",
    subject: "Your $100 Starting Capital Is Ready, {{ contact.FIRSTNAME }}",
    htmlContent: `<!DOCTYPE html><html><head><style>/* Simplified for preview */ body { font-family: sans-serif; padding: 40px; background: #050505; color: #fff; text-align: center; } .box { border: 1px solid #d4af37; padding: 40px; border-radius: 20px; } .btn { background: #d4af37; color: #000; padding: 15px 30px; text-decoration: none; border-radius: 10px; font-weight: bold; }</style></head><body><div class="box"><h1>Your $100 Voucher Is Active</h1><p>Welcome {{ contact.FIRSTNAME }}, we've allocated $100 in starting capital to your account bridge.</p><p>Finalize your NeoBank registration below to claim the credit and start the AI.</p><br><a href="https://yourdomain.com/onboarding" class="btn">CLAIM MY $100 CREDIT →</a><br><br><p style="font-size: 11px; color: #666;">Authorized by {{ contact.SPONSOR_NAME }}</p></div></body></html>`,
    sender: { name: "Aurum Onboarding Team", email: "onboarding@smarthustlermarketing.com" }
  }
];

async function pushTemplates() {
  console.log('Pushing templates to Brevo...');
  
  for (const template of templates) {
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
        console.error(`❌ Failed ${template.templateName}:`, data.message);
      }
    } catch (err) {
      console.error(`Error pushing ${template.templateName}:`, err.message);
    }
  }
}

pushTemplates();
