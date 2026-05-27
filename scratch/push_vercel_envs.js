import { spawnSync } from 'child_process';
import fs from 'fs';

// Read env variables from Aurum Education Portal env
const envContent = fs.readFileSync('/Users/kd5000/Documents/Aurum Education Portal/.env.local', 'utf8');

const envs = {};
envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx === -1) return;
  const key = trimmed.substring(0, eqIdx).trim();
  const val = trimmed.substring(eqIdx + 1).trim();
  envs[key] = val;
});

const targets = ['production', 'development'];

console.log('Pushing environment variables to Vercel (Production & Development)...');
for (const [key, val] of Object.entries(envs)) {
  if (!val) continue;
  console.log(`- Adding ${key}...`);
  for (const target of targets) {
    const result = spawnSync('npx', [
      '-y', 'vercel@latest', 'env', 'add', key, target,
      '--value', val, '--yes', '--force'
    ], {
      cwd: '/Users/kd5000/Documents/Aurum Education Portal',
      encoding: 'utf8'
    });

    if (result.status !== 0) {
      console.error(`Failed to add ${key} to ${target}:`, result.stderr || result.stdout);
    } else {
      console.log(`  Added ${key} to ${target}`);
    }
  }
}

console.log('All environment variables added successfully!');
