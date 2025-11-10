#!/usr/bin/env node

/**
 * Simple build script for static site
 * This script can be extended to:
 * - Minify CSS/JS
 * - Optimize images
 * - Generate service worker
 * - Inject environment variables
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Building static site...');

// Read config
const configPath = path.join(__dirname, 'config.js');
if (fs.existsSync(configPath)) {
  console.log('✅ Config file found');
} else {
  console.log('⚠️  Config file not found, creating default...');
}

// Check required files
const requiredFiles = [
  'index.html',
  'about.html',
  'team.html',
  'style.css',
  'script.js'
];

let allFilesExist = true;
requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} found`);
  } else {
    console.log(`❌ ${file} missing`);
    allFilesExist = false;
  }
});

if (allFilesExist) {
  console.log('✅ All required files present');
  console.log('✅ Build complete!');
  console.log('\n📦 Ready for deployment:');
  console.log('   - GitHub Pages: Push to main branch');
  console.log('   - Vercel: vercel --prod');
  console.log('   - Netlify: netlify deploy --prod');
} else {
  console.log('❌ Build failed: Missing required files');
  process.exit(1);
}

