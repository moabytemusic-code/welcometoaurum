import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envFile = fs.readFileSync('/Users/kd5000/Documents/Mr. Copywriter/.env.local', 'utf8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) envVars[match[1]] = match[2].trim();
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY || envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("=== STARTING LIVE ROTATOR INTEGRATION TEST ===");

  // 1. Fetch active partners to see who we are rotating
  const { data: partners } = await supabase
    .from('aurum_affiliates')
    .select('affiliate_code, unlocked_funnels')
    .eq('is_rotator', true)
    .order('created_at', { ascending: true });

  console.log("Active Rotator Partners:", partners.map(p => p.affiliate_code));

  if (!partners || partners.length === 0) {
    console.error("No active rotator partners found. Please mark some partners as is_rotator = true first.");
    return;
  }

  const createdLeadIds = [];
  const assignments = [];

  try {
    // We will simulate 10 sequential hits
    for (let i = 1; i <= 10; i++) {
      // Hit the local rotator endpoint
      const res = await fetch('http://localhost:3000/api/rotator?funnel=gateway');
      if (!res.ok) {
        throw new Error(`Rotator API returned status ${res.status}`);
      }

      const data = await res.json();
      console.log(`Hit ${i} resolved to sponsor: ${data.code} (${data.name})`);
      assignments.push(data.code);

      // Simulate the opt-in by inserting a test lead
      const email = `rotatortest_${Date.now()}_${i}@example.com`;
      const { data: newLeads, error: insertErr } = await supabase
        .from('aurum_leads')
        .insert([{
          email,
          first_name: 'RotatorTester',
          sponsor_code: data.code,
          landing_variant: 'neyro_gateway'
        }])
        .select();

      if (insertErr) {
        console.error("Lead insertion failed:", insertErr);
        throw insertErr;
      }

      if (newLeads && newLeads[0]) {
        createdLeadIds.push(newLeads[0].id);
      }

      // Add a tiny delay to ensure timestamps are sequential and distinct
      await new Promise(r => setTimeout(r, 100));
    }

    console.log("\nAssignment Sequence obtained:", assignments);

  } catch (err) {
    console.error("Test failed during execution:", err.message);
  } finally {
    // Clean up created test leads from the database
    if (createdLeadIds.length > 0) {
      console.log(`Cleaning up ${createdLeadIds.length} test leads from aurum_leads...`);
      const { error: deleteErr } = await supabase
        .from('aurum_leads')
        .delete()
        .in('id', createdLeadIds);

      if (deleteErr) {
        console.error("Failed to clean up test leads:", deleteErr);
      } else {
        console.log("Cleanup complete!");
      }
    }
  }
}

run();
