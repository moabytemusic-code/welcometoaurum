import fs from 'fs';

const envFile = fs.readFileSync('./.env.local', 'utf8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) envVars[match[1]] = match[2].trim();
});

const apiKey = envVars.BREVO_API_KEY;

// Base HTML template builder to keep styling consistent across all emails
function buildHtml(tag, headline, p1, p2, p3, ctaText, ctaUrl, calloutText) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Aurum Rise</title>
  <style>
    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      background-color: #050505;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #050505;
      padding: 40px 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
    }
    .header {
      background-color: #000000;
      padding: 50px 40px;
      text-align: center;
      border-bottom: 1px solid #1a1a1a;
    }
    .logo {
      color: #d4af37;
      font-size: 26px;
      font-weight: 900;
      letter-spacing: 10px;
      text-transform: uppercase;
    }
    .content {
      padding: 56px;
      color: #1a1a1a;
      line-height: 1.8;
    }
    h1 {
      font-size: 32px;
      font-weight: 900;
      color: #000000;
      margin-bottom: 28px;
      letter-spacing: -1px;
      line-height: 1.2;
    }
    p {
      font-size: 16px;
      margin-bottom: 24px;
      color: #333333;
    }
    .cta-container {
      text-align: center;
      margin: 40px 0;
    }
    .cta-button {
      display: inline-block;
      background-color: #d4af37;
      color: #000000;
      padding: 22px 44px;
      border-radius: 14px;
      text-decoration: none;
      font-weight: 900;
      font-size: 15px;
      text-transform: uppercase;
      letter-spacing: 2px;
      box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
      transition: all 0.3s ease;
    }
    .friction-reducer {
      font-size: 13px;
      color: #888888;
      margin-top: 15px;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 600;
    }
    .footer {
      background-color: #fafafa;
      padding: 40px;
      border-top: 1px solid #eeeeee;
      text-align: center;
      font-size: 13px;
      color: #999999;
    }
    .tag {
      text-transform: uppercase;
      letter-spacing: 2px;
      font-size: 12px;
      color: #d4af37;
      font-weight: 700;
      margin-bottom: 10px;
    }
    .identity-callout {
      padding: 24px 48px;
      background: #000000;
      color: #d4af37;
      font-size: 12px;
      text-align: center;
      letter-spacing: 1px;
      font-weight: 700;
      margin-top: 40px;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <div class="logo">AURUM RISE</div>
      </div>
      <div class="content">
        <p class="tag">${tag}</p>
        <h1>${headline}</h1>
        <p>${p1}</p>
        <p>${p2}</p>
        <p>${p3}</p>
        
        <div class="cta-container">
          <a href="${ctaUrl}" target="_blank" class="cta-button">${ctaText}</a>
          <div class="friction-reducer">${calloutText}</div>
        </div>
        
        <div class="identity-callout">
          AURUM RISE ONBOARDING TEAM
        </div>
        
        <div class="footer">
          <p>© 2026 Aurum Rise. All rights reserved.</p>
          <p>Past performance does not guarantee future results. Automated activities involve risk.</p>
          <p><a href="#" style="color: #d4af37; text-decoration: none;">Unsubscribe</a> | <a href="#" style="color: #d4af37; text-decoration: none;">Security Center</a></p>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
}

const templatesData = {
  745: {
    subject: "Checking in... did you see the orientation link?",
    tag: "Day 1 Reminder",
    headline: "Your access link is waiting.",
    p1: "Hey {{ contact.FIRSTNAME }}, I wanted to make sure you saw the access link to our next live orientation. Most people register and then forget to add it to their calendar, missing out on the live walkthrough.",
    p2: "On the orientation call, we walk through how our members are leveraging AI to set up automated income channels in under 5 minutes. No coding or tech experience is required.",
    p3: "The webinar starts this Tuesday at 8pm EST. Make sure to claim your seat below.",
    ctaText: "Claim My Zoom Seat",
    ctaUrl: "https://us06web.zoom.us/j/88391763460?pwd=aR0z0mIKRIhR3KEvMEbJHslNNgA52c.1",
    calloutText: "Every Tuesday at 8pm EST • Under 5-minute setup • Live Q&A"
  },
  748: {
    subject: "Is the tech holding you back? (It's easier than you think)",
    tag: "Objection Buster",
    headline: "Zero tech skills required. Seriously.",
    p1: "Hey {{ contact.FIRSTNAME }}, when people hear terms like \"AI agents\" or \"automated trading,\" they assume they need a computer science degree to get started. That couldn't be further from the truth.",
    p2: "Our system is designed to be completely point-and-click. On our next live orientation, I will set up a live agent right in front of you. You can literally watch over my shoulder and replicate the steps in real-time.",
    p3: "Don't let the technical jargon hold you back from the future of finance. Join us this Tuesday at 8pm EST.",
    ctaText: "Watch the Live Walkthrough",
    ctaUrl: "https://us06web.zoom.us/j/88391763460?pwd=aR0z0mIKRIhR3KEvMEbJHslNNgA52c.1",
    calloutText: "No coding needed • Beginner friendly • Tuesday 8pm EST"
  },
  751: {
    subject: "One last invitation (Starting fund pool is limited)",
    tag: "Last Call",
    headline: "The door is closing on this week's cohort.",
    p1: "Hey {{ contact.FIRSTNAME }}, this is my final follow-up before our live Tuesday session. We have strict server capacity limits for new automated AI accounts, and we are reaching maximum capacity for this week.",
    p2: "If you want to secure your orientation seat and claim the starting bonuses and setup guides reserved for new members, this is your final opportunity to register.",
    p3: "We go live this Tuesday at 8pm EST. Once we hit our limit, we will close registration until the next cohort.",
    ctaText: "Secure My Last-Minute Seat",
    ctaUrl: "https://us06web.zoom.us/j/88391763460?pwd=aR0z0mIKRIhR3KEvMEbJHslNNgA52c.1",
    calloutText: "Limited seats remaining • Registration closes soon • Tuesday 8pm EST"
  }
};

async function updateTemplate(id, t) {
  const htmlContent = buildHtml(t.tag, t.headline, t.p1, t.p2, t.p3, t.ctaText, t.ctaUrl, t.calloutText);
  
  try {
    const res = await fetch(`https://api.brevo.com/v3/smtp/templates/${id}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': apiKey
      },
      body: JSON.stringify({
        subject: t.subject,
        htmlContent,
        sender: {
          name: "Aurum Rise Onboarding Team",
          email: "onboarding@smarthustlermarketing.com"
        }
      })
    });

    console.log(`Updating template ${id}: Status ${res.status}`);
    if (!res.ok) {
      const err = await res.json();
      console.error(`Error details:`, err);
    }
  } catch (e) {
    console.error(`Failed to update ${id}:`, e.message);
  }
}

async function run() {
  for (const id of [745, 748, 751]) {
    await updateTemplate(id, templatesData[id]);
  }
  console.log("All follow-up templates updated successfully.");
}

run();
