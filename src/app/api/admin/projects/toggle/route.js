import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req) {
  try {
    const { slug, isActive } = await req.json();
    if (!slug) {
      return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
    }

    const dataDir = path.join(process.cwd(), 'src', 'data', 'projects');
    const filePath = path.join(dataDir, `${slug}.json`);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const project = JSON.parse(fileContent);

    // Update the active status
    project.isActive = isActive;

    fs.writeFileSync(filePath, JSON.stringify(project, null, 2));

    return NextResponse.json({ success: true, project });
  } catch (error) {
    console.error('Failed to toggle project:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
