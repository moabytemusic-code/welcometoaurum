import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cwdawyeiijbcoihobvpb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3ZGF3eWVpaWpiY29paG9idnBiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDYwNzE3MiwiZXhwIjoyMDkwMTgzMTcyfQ.144wT6QKMfk_sL0ldh53zOG4HQCpB0aeshiODLBkRgs';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log('Inserting Home Page funnel into aurum_projects...');
  const { data, error } = await supabase.from('aurum_projects').insert([{
    slug: 'home',
    name: 'Main Home Page',
    angle: 'home',
    content: JSON.stringify({ description: 'The primary landing page featuring the free Syllabus Masterclass and Neo AI chatbot.' }),
    config: JSON.stringify({}),
    is_active: true
  }]);

  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Success!', data);
  }
}

run();
