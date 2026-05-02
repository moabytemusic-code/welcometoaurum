import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isValidAdminSession } from '@/lib/auth';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  if (!(await isValidAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    // Fetch all rotators
    const { data: rotators, error } = await supabase
      .from('rotators')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Optional: fetch entry counts for each rotator
    const { data: entries, error: entriesError } = await supabase
      .from('rotator_entries')
      .select('rotator_id');

    if (!entriesError && rotators && entries) {
      // Map entry counts to the rotators
      const counts = entries.reduce((acc, entry) => {
        acc[entry.rotator_id] = (acc[entry.rotator_id] || 0) + 1;
        return acc;
      }, {});

      rotators.forEach(r => {
        r.total_members = counts[r.id] || 0;
      });
    }

    return NextResponse.json(rotators || []);
  } catch (error) {
    console.error('Failed to fetch rotators:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
