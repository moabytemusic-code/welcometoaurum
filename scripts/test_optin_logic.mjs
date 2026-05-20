import fs from 'fs';

const envFile = fs.readFileSync('/Users/kd5000/Documents/Mr. Copywriter/.env.local', 'utf8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) envVars[match[1]] = match[2].trim();
});

const apiKey = envVars.BREVO_API_KEY;

async function run() {
  const email = 'kentjigga@gmail.com';
  const first_name = 'Ken';
  const phone = '';
  const sponsor_code = '1W145K';
  const sponsor_name = 'Aurum Corporate';
  const landing_variant = 'neyro_gateway';

  // 1. Send Contact Create/Update Request to Brevo
  const payload = {
    email,
    attributes: {
      FIRSTNAME: first_name,
      SMS: phone || '', 
      SPONSOR_CODE: sponsor_code || '1W145K',
      SPONSOR_NAME: sponsor_name || 'Aurum Corporate',
      LANDING_VARIANT: landing_variant || 'unknown'
    },
    listIds: [68],
    updateEnabled: true
  };

  try {
    let response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': apiKey
      },
      body: JSON.stringify(payload)
    });

    console.log("Brevo Contact API status:", response.status);

    let data = {};
    if (response.status !== 204) {
      try {
        data = await response.json();
      } catch (jsonErr) {
        console.warn('Failed to parse response JSON:', jsonErr.message);
      }
    }

    if (!response.ok) {
      throw new Error(data.message || 'Error from Brevo');
    }

    console.log("Brevo Contact API succeeded. Now triggering welcome SMTP email...");

    const templateId = (landing_variant === 'pay-it-forward' || landing_variant === 'pay-it-forward-v2')
      ? 744  // Voucher Welcome Email
      : 743; // Core Welcome Email

    const smtpRes = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': apiKey
      },
      body: JSON.stringify({
        to: [{ email, name: first_name || '' }],
        templateId,
        params: {
          FIRSTNAME: first_name || '',
          SPONSOR_NAME: sponsor_name || 'Aurum Corporate'
        }
      })
    });

    console.log("Brevo SMTP API status:", smtpRes.status);
    if (!smtpRes.ok) {
      const errData = await smtpRes.json();
      console.error('Direct SMTP welcome email send failed response:', errData);
    } else {
      console.log(`Direct SMTP welcome email triggered successfully for ${email} (Template ID: ${templateId})`);
    }
  } catch (err) {
    console.error("Opt-in execution failed:", err.message);
  }
}

run();
