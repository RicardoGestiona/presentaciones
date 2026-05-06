#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const sourceDir = path.join(__dirname, '..', '..', 'assets');
const destDir = path.join(__dirname, '..', 'public');

const files = [
  { src: 'css/corporate.css', dest: 'corporate.css' },
  { src: 'js/navigation.js', dest: 'navigation.js' },
];

function hashFile(filePath) {
  const content = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(content).digest('hex');
}

let allOk = true;

console.log('🔄 Syncing assets...\n');

for (const file of files) {
  const srcPath = path.join(sourceDir, file.src);
  const destPath = path.join(destDir, file.dest);

  if (!fs.existsSync(srcPath)) {
    console.error(`❌ Source not found: ${srcPath}`);
    allOk = false;
    continue;
  }

  const srcHash = hashFile(srcPath);
  const destHash = fs.existsSync(destPath) ? hashFile(destPath) : null;

  if (srcHash !== destHash) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`✓ Synced ${file.src} → ${file.dest}`);
  } else {
    console.log(`✓ ${file.dest} in sync`);
  }
}

if (allOk) {
  console.log('\n✅ All assets synced!');
  process.exit(0);
} else {
  console.error('\n❌ Some assets failed to sync');
  process.exit(1);
}
