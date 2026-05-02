import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isValidAdminSession } from '@/lib/auth';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(req) {
  if (!(await isValidAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const rotator_id = searchParams.get('rotator_id');

  if (!rotator_id) {
    return NextResponse.json({ error: 'Missing rotator_id' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from('rotator_entries')
      .select('*')
      .eq('rotator_id', rotator_id)
      .order('queue_position', { ascending: true });

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Failed to fetch rotator entries:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  if (!(await isValidAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { rotator_id, member_id, queue_position, target_conversions } = await req.json();

    if (!rotator_id || !member_id || queue_position === undefined || target_conversions === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('rotator_entries')
      .insert([{ 
        rotator_id, 
        member_id, 
        queue_position: parseInt(queue_position), 
        target_conversions: parseInt(target_conversions),
        current_conversions: 0,
        status: 'ACTIVE'
      }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, entry: data });
  } catch (error) {
    console.error('Failed to add rotator entry:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req) {
  if (!(await isValidAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Missing entry id' }, { status: 400 });
    }

    const { error } = await supabase
      .from('rotator_entries')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete rotator entry:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
