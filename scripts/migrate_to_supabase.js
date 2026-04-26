const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables from .env.local
const envFile = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
const SUPABASE_URL = envFile.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1].trim();
const SUPABASE_KEY = envFile.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/)[1].trim();

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function migrateData() {
  const dataDir = path.join(__dirname, '../src/data/projects');
  if (!fs.existsSync(dataDir)) {
    console.log('No local projects to migrate.');
    return;
  }

  const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
  console.log(`Found ${files.length} funnels to migrate...`);

  for (const file of files) {
    try {
      const content = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
      
      const { data, error } = await supabase
        .from('aurum_projects')
        .upsert({
          slug: content.slug,
          name: content.name,
          angle: content.angle,
          content: content.content,
          config: content.config,
          is_active: content.isActive !== undefined ? content.isActive : true,
          updated_at: new Date().toISOString()
        }, { onConflict: 'slug' });

      if (error) {
        console.error(`❌ Error migrating ${file}:`, error.message);
      } else {
        console.log(`✅ Migrated: ${content.name} (/${content.slug})`);
      }
    } catch (err) {
      console.error(`❌ Failed to parse ${file}:`, err.message);
    }
  }
}

migrateData();
