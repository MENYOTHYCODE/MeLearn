#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

try {
  console.log('🔧 Setting up build environment...');
  
  // Ensure node_modules/.bin/vite has execute permissions
  const vitePath = path.join(process.cwd(), 'node_modules', '.bin', 'vite');
  if (fs.existsSync(vitePath)) {
    try {
      fs.chmodSync(vitePath, '755');
      console.log('✅ Fixed Vite permissions');
    } catch (err) {
      console.log('⚠️  Could not fix permissions, trying alternative...');
    }
  }
  
  console.log('🏗️  Building application...');
  
  // Try different build methods
  const buildCommands = [
    'npx vite build',
    'node node_modules/vite/bin/vite.js build',
    './node_modules/.bin/vite build'
  ];
  
  let buildSuccess = false;
  
  for (const cmd of buildCommands) {
    try {
      console.log(`Trying: ${cmd}`);
      execSync(cmd, { stdio: 'inherit' });
      buildSuccess = true;
      break;
    } catch (err) {
      console.log(`Failed: ${cmd}`);
      continue;
    }
  }
  
  if (!buildSuccess) {
    throw new Error('All build methods failed');
  }
  
  console.log('✅ Build completed successfully!');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}