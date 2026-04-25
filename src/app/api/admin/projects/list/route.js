import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const dataDir = path.join(process.cwd(), 'src', 'data', 'projects');
    if (!fs.existsSync(dataDir)) {
      return NextResponse.json([]);
    }

    const files = fs.readdirSync(dataDir).filter(file => file.endsWith('.json'));
    const projects = [];

    for (const file of files) {
      try {
        const fileContent = fs.readFileSync(path.join(dataDir, file), 'utf-8');
        const project = JSON.parse(fileContent);
        // By default, if isActive is undefined, it's active
        if (project.isActive === undefined) {
          project.isActive = true;
        }
        projects.push(project);
      } catch (err) {
        console.error(`Error parsing ${file}:`, err);
      }
    }

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Failed to list projects:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
