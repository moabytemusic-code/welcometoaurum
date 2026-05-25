import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req) {
  try {
    const { firstName, lastName, email, phone, telegram, plan } = await req.json();

    if (!email || !firstName || !lastName || !plan) {
      return NextResponse.json({ success: false, error: 'Please fill out all required fields.' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, error: 'Please enter a valid email address.' }, { status: 400 });
    }

    // 1. Insert into Supabase aurum_orders table
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
      
      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);

        const { error: dbErr } = await supabase.from('aurum_orders').insert([{
          first_name: firstName,
          last_name: lastName,
          email,
          phone: phone || null,
          telegram: telegram || null,
          plan_id: plan,
          status: 'pending_payment'
        }]);

        if (dbErr) {
          console.error("Supabase Order Insert Error:", dbErr.message);
          // If the table doesn't exist yet, we still want to send the email, so we don't block.
        }
      }
    } catch (err) {
      console.warn("Database operation failed:", err.message);
    }

    // 2. Trigger Brevo Payment Instructions Email
    if (process.env.BREVO_API_KEY) {
      // You must set BREVO_TEMPLATE_ID_PAYMENT in your .env.local
      // If not set, we'll try to fallback to a default or just skip gracefully to not break the UI
      const templateId = parseInt(process.env.BREVO_TEMPLATE_ID_PAYMENT || "0", 10);
      
      if (templateId > 0) {
        const planNames = {
          "basic": "Basic Service",
          "vip": "VIP Service",
          "admin_manager": "Admin Manager",
          "paid_rotator": "Paid Traffic Rotator"
        };
        const planPrices = {
          "basic": "$0.00",
          "vip": "$4.99",
          "admin_manager": "$9.99",
          "paid_rotator": "$100.00 Minimum"
        };

        const smtpRes = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'api-key': process.env.BREVO_API_KEY
          },
          body: JSON.stringify({
            to: [{ email, name: `${firstName} ${lastName}` }],
            templateId,
            params: {
              FIRSTNAME: firstName,
              PLAN_NAME: planNames[plan] || plan,
              PLAN_PRICE: planPrices[plan] || "Custom Amount"
            }
          })
        });

        if (!smtpRes.ok) {
          const errData = await smtpRes.json();
          console.error('Direct SMTP payment email send failed:', errData);
        } else {
          console.log(`Payment instructions email triggered successfully for ${email}`);
        }
      } else {
        console.warn("BREVO_TEMPLATE_ID_PAYMENT is not set. Skipped sending email.");
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Order Submission Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
