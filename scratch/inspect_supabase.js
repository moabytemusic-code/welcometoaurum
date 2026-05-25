const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspect() {
  // Try to query a record from aurum_leads or aurum_affiliates to see columns
  const { data: leads, error: errorLeads } = await supabase.from('aurum_leads').select('*').limit(1);
  console.log("Leads Columns:", leads && leads.length > 0 ? Object.keys(leads[0]) : errorLeads);

  const { data: affiliates, error: errorAffiliates } = await supabase.from('aurum_affiliates').select('*').limit(1);
  console.log("Affiliates Columns:", affiliates && affiliates.length > 0 ? Object.keys(affiliates[0]) : errorAffiliates);
}

inspect();
