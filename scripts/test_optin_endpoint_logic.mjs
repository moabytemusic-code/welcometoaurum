import fs from 'fs';

const envFile = fs.readFileSync('./.env.local', 'utf8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) envVars[match[1]] = match[2].trim();
});

const apiKey = envVars.BREVO_API_KEY;

async function testRouteLogic(email, variant) {
  try {
    const templateId = (variant === 'pay-it-forward' || variant === 'pay-it-forward-v2')
      ? 744  // Voucher Welcome Email
      : 743; // Core Welcome Email

    console.log(`Simulating direct welcome email send for ${email} with variant ${variant} (Template ID: ${templateId})`);

    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': apiKey
      },
      body: JSON.stringify({
        to: [{ email, name: 'Tester' }],
        templateId,
        params: {
          FIRSTNAME: 'Tester',
          SPONSOR_NAME: 'Aurum Corporate'
        }
      })
    });

    console.log("Status:", res.status);
    const data = await res.json();
    console.log("Response:", data);
  } catch (e) {
    console.error('Failed:', e.message);
  }
}

async function run() {
  await testRouteLogic('kentjigga@gmail.com', 'neyro_protocol');
}

run();
