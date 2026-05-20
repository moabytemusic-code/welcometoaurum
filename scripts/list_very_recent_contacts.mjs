import fs from 'fs';

const envFile = fs.readFileSync('/Users/kd5000/Documents/Mr. Copywriter/.env.local', 'utf8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) envVars[match[1]] = match[2].trim();
});

const apiKey = envVars.BREVO_API_KEY;

async function run() {
  try {
    const time = new Date();
    time.setMinutes(time.getMinutes() - 30);
    const modifiedSince = time.toISOString();
    console.log(`Checking contacts modified since: ${modifiedSince}`);

    const res = await fetch(`https://api.brevo.com/v3/contacts?limit=50&offset=0&modifiedSince=${encodeURIComponent(modifiedSince)}&sort=desc`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'api-key': apiKey
      }
    });

    if (res.ok) {
      const data = await res.json();
      console.log(`Found ${data.contacts?.length || 0} contacts.`);
      if (data.contacts) {
        data.contacts.forEach(c => {
          console.log(`Email: ${c.email} | Modified: ${c.modifiedAt} | Lists: ${JSON.stringify(c.listIds)} | Variant: ${c.attributes.LANDING_VARIANT || 'none'}`);
        });
      }
    } else {
      const err = await res.json();
      console.error(err);
    }
  } catch (e) {
    console.error(e);
  }
}

run();
