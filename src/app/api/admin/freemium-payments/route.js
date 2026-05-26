import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const adminSession = cookieStore.get('aurum_admin_session')?.value;

    if (adminSession !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch freemium payments and join prospect details
    const { data: payments, error } = await supabase
      .from('freemium_payments')
      .select(`
        *,
        prospect:freemium_prospects(email, first_name)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch freemium payments for admin:', error);
      return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
    }

    return NextResponse.json({ success: true, payments });
  } catch (err) {
    console.error('Admin Freemium Payments GET Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const cookieStore = await cookies();
    const adminSession = cookieStore.get('aurum_admin_session')?.value;

    if (adminSession !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { paymentId, action } = await request.json(); // action = 'approve' or 'decline'
    if (!paymentId || !['approve', 'decline'].includes(action)) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch the payment details first
    const { data: payment, error: fetchErr } = await supabase
      .from('freemium_payments')
      .select('*')
      .eq('id', paymentId)
      .maybeSingle();

    if (fetchErr || !payment) {
      return NextResponse.json({ error: 'Payment record not found' }, { status: 404 });
    }

    if (payment.status !== 'pending') {
      return NextResponse.json({ error: 'This payment transaction has already been processed' }, { status: 400 });
    }

    if (action === 'approve') {
      // Approve action
      const { error: updatePaymentErr } = await supabase
        .from('freemium_payments')
        .update({ status: 'approved' })
        .eq('id', payment.id);

      if (updatePaymentErr) {
        console.error('Failed to update payment status:', updatePaymentErr);
        return NextResponse.json({ error: 'Failed to update payment record status' }, { status: 500 });
      }

      // Fetch prospect details
      const { data: prospect, error: prospectErr } = await supabase
        .from('freemium_prospects')
        .select('*')
        .eq('id', payment.prospect_id)
        .maybeSingle();

      if (prospect) {
        // Fetch order details if exists
        let fullName = prospect.first_name || '';
        let affiliateCode = '';
        let order = null;

        const { data: orderData } = await supabase
          .from('aurum_orders')
          .select('*')
          .eq('email', prospect.email.trim().toLowerCase())
          .maybeSingle();

        if (orderData) {
          order = orderData;
          fullName = `${order.first_name} ${order.last_name}`.trim() || fullName;
          affiliateCode = order.affiliate_code || '';
        }

        // Generate affiliate code if not present
        if (!affiliateCode) {
          const randomNum = Math.floor(1000 + Math.random() * 9000);
          const namePart = (prospect.first_name || 'USER').replace(/[^a-zA-Z]/g, '').substring(0, 4).toUpperCase();
          affiliateCode = `${namePart}${randomNum}`;
        }

        // Fetch or generate password for affiliate login
        const { data: existingAffiliate } = await supabase
          .from('aurum_affiliates')
          .select('*')
          .eq('email', prospect.email.trim().toLowerCase())
          .maybeSingle();

        let password = existingAffiliate?.password || '';
        if (!password) {
          password = Math.random().toString(36).substring(2, 8).toUpperCase();
        }

        // Insert or update aurum_members status to active
        const { data: existingMember } = await supabase
          .from('aurum_members')
          .select('id')
          .eq('email', prospect.email.trim().toLowerCase())
          .maybeSingle();

        if (existingMember) {
          await supabase
            .from('aurum_members')
            .update({
              status: 'active',
              full_name: fullName,
              plan_tier: 'Basic User Plan'
            })
            .eq('id', existingMember.id);
        } else {
          await supabase
            .from('aurum_members')
            .insert([{
              email: prospect.email.trim().toLowerCase(),
              full_name: fullName,
              status: 'active',
              referred_by: prospect.sponsor_code || 'DIRECT',
              membership_start: new Date().toISOString(),
              plan_tier: 'Basic User Plan'
            }]);
        }

        // Insert or update aurum_affiliates status to active
        if (existingAffiliate) {
          await supabase
            .from('aurum_affiliates')
            .update({
              status: 'active',
              full_name: fullName,
              affiliate_code: affiliateCode,
              password: password,
              plan: 'Basic'
            })
            .eq('id', existingAffiliate.id);
        } else {
          await supabase
            .from('aurum_affiliates')
            .insert([{
              email: prospect.email.trim().toLowerCase(),
              full_name: fullName,
              affiliate_code: affiliateCode,
              password: password,
              status: 'active',
              is_rotator: false,
              plan: 'Basic'
            }]);
        }

        // Complete any pending order in aurum_orders
        if (order) {
          await supabase
            .from('aurum_orders')
            .update({ status: 'completed' })
            .eq('id', order.id);
        }

        // Trigger Brevo Partner Welcome Email (Template ID: 836)
        if (process.env.BREVO_API_KEY) {
          try {
            const smtpRes = await fetch('https://api.brevo.com/v3/smtp/email', {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'api-key': process.env.BREVO_API_KEY
              },
              body: JSON.stringify({
                to: [{ email: prospect.email.trim().toLowerCase(), name: fullName }],
                templateId: 836,
                params: {
                  FIRSTNAME: prospect.first_name || '',
                  AFFILIATE_CODE: affiliateCode,
                  PASSWORD: password
                }
              })
            });

            if (!smtpRes.ok) {
              const errData = await smtpRes.json();
              console.error('Failed to send partner welcome email via Brevo:', errData);
            } else {
              console.log(`Partner welcome email successfully sent to ${prospect.email}`);
            }
          } catch (emailErr) {
            console.error('Brevo partner welcome email send failed:', emailErr.message);
          }
        }
      }
    } else {
      // Decline action
      const { error: updatePaymentErr } = await supabase
        .from('freemium_payments')
        .update({ status: 'declined' })
        .eq('id', payment.id);

      if (updatePaymentErr) {
        console.error('Failed to decline payment:', updatePaymentErr);
        return NextResponse.json({ error: 'Failed to decline payment record' }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Admin Freemium Payments PATCH Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
