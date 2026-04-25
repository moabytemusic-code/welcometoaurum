import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const data = await request.json();
    const { slug } = data;

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    const projectsDir = path.join(process.cwd(), 'src/data/projects');
    
    // Ensure directory exists
    if (!fs.existsSync(projectsDir)) {
      fs.mkdirSync(projectsDir, { recursive: true });
    }

    const filePath = path.join(projectsDir, `${slug}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    return NextResponse.json({ success: true, path: `/f/${slug}/${data.angle}` });
  } catch (err) {
    console.error('Save error:', err);
    return NextResponse.json({ error: 'Failed to save project' }, { status: 500 });
  }
}
