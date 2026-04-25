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
    
    // Preserve isActive status if the file already exists
    let isActive = true;
    if (fs.existsSync(filePath)) {
      try {
        const existing = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        if (existing.isActive !== undefined) {
          isActive = existing.isActive;
        }
      } catch (e) {
        console.error('Error reading existing project during save:', e);
      }
    }

    // If the incoming data explicitly has isActive, use that, otherwise use preserved
    const finalData = {
      ...data,
      isActive: data.isActive !== undefined ? data.isActive : isActive
    };

    fs.writeFileSync(filePath, JSON.stringify(finalData, null, 2));

    return NextResponse.json({ success: true, path: `/f/${slug}/${data.angle}` });
  } catch (err) {
    console.error('Save error:', err);
    return NextResponse.json({ error: 'Failed to save project' }, { status: 500 });
  }
}
