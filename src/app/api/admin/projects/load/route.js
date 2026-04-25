import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
  }

  try {
    const filePath = path.join(process.cwd(), 'src/data/projects', `${slug}.json`);
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const data = fs.readFileSync(filePath, 'utf8');
    return NextResponse.json(JSON.parse(data));
  } catch (err) {
    console.error('Load error:', err);
    return NextResponse.json({ error: 'Failed to load project' }, { status: 500 });
  }
}
