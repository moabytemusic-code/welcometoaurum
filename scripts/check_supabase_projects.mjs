import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envFile = fs.readFileSync('./.env.local', 'utf8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) envVars[match[1]] = match[2].trim();
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProjects() {
  try {
    const { data: projects, error } = await supabase
      .from('aurum_projects')
      .select('*');

    if (error) {
      console.error('Error fetching projects:', error);
      return;
    }

    console.log('--- Supabase Projects ---');
    projects.forEach(p => {
      console.log(`Name: ${p.name} | Slug: ${p.slug} | Angle: ${p.angle} | IsActive: ${p.is_active}`);
    });
    console.log('-------------------------');
  } catch (e) {
    console.error('Failed:', e.message);
  }
}

checkProjects();
