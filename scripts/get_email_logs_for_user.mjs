import fs from 'fs';

const envFile = fs.readFileSync('/Users/kd5000/Documents/Mr. Copywriter/.env.local', 'utf8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) envVars[match[1]] = match[2].trim();
});

const apiKey = envVars.BREVO_API_KEY;

async function checkUserLogs(email) {
  try {
    console.log(`=== CHECKING CONTACT FOR: ${email} ===`);
    const contactRes = await fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'api-key': apiKey
      }
    });

    console.log("Contact status:", contactRes.status);
    if (contactRes.ok) {
      const data = await contactRes.json();
      console.log("Attributes:", JSON.stringify(data.attributes, null, 2));
      console.log("Lists:", data.listIds);
    } else {
      console.log("Contact not found or error:", await contactRes.text());
    }

    console.log(`\n=== CHECKING TRANSACTONAL EMAIL LOGS FOR: ${email} ===`);
    const smtpRes = await fetch(`https://api.brevo.com/v3/smtp/emails?email=${encodeURIComponent(email)}&limit=10`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'api-key': apiKey
      }
    });

    console.log("SMTP logs status:", smtpRes.status);
    if (smtpRes.ok) {
      const data = await smtpRes.json();
      console.log("Recent transactional sends:");
      if (data.transactionalEmails) {
        data.transactionalEmails.forEach(e => {
          console.log(`- Template ${e.templateId || 'none'} | Subject: "${e.subject}" | Status: ${e.uuid ? 'Sent' : 'Unknown'} | Date: ${e.date}`);
        });
      } else {
        console.log("No transactional emails found.");
      }
    } else {
      console.log("Error fetching SMTP logs:", await smtpRes.text());
    }
  } catch (err) {
    console.error("Failed:", err.message);
  }
}

checkUserLogs('kentjigga@gmail.com');
