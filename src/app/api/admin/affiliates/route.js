import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { isValidAdminSession } from '@/lib/auth';

export async function GET(request) {
  if (!(await isValidAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const quick = searchParams.get('quick');

  try {
    if (quick) {
      const { count, error } = await supabase
        .from('aurum_affiliates')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      return NextResponse.json({ count });
    }

    const { data, error } = await supabase
      .from('aurum_affiliates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  if (!(await isValidAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, ...updates } = body;

    const { data, error } = await supabase
      .from('aurum_affiliates')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) throw error;
    return NextResponse.json(data[0]);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  if (!(await isValidAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { data, error } = await supabase
      .from('aurum_affiliates')
      .insert([body])
      .select();

    if (error) throw error;
    return NextResponse.json(data[0]);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  if (!(await isValidAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const { error } = await supabase
      .from('aurum_affiliates')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
