#!/usr/bin/env node
/**
 * Generate PWA icons as simple colored squares with "P" letter.
 * Run: node scripts/generate-icons.js
 * Requires: npm install --save-dev canvas (optional, falls back to manual creation)
 */

const fs = require('fs');
const path = require('path');

const ICONS_DIR = path.join(__dirname, '..', 'public', 'icons');

const sizes = [192, 512];

function generateSVG(size) {
  const fontSize = size * 0.5;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${size * 0.15}" fill="#1976d2"/>
  <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle"
    font-family="system-ui, -apple-system, sans-serif" font-size="${fontSize}" font-weight="700" fill="white">P</text>
</svg>`;
}

if (!fs.existsSync(ICONS_DIR)) {
  fs.mkdirSync(ICONS_DIR, { recursive: true });
}

for (const size of sizes) {
  const svg = generateSVG(size);
  const svgPath = path.join(ICONS_DIR, `icon-${size}.svg`);
  fs.writeFileSync(svgPath, svg);
  console.log(`Created ${svgPath}`);
}

console.log('\nSVG icons created. To convert to PNG:');
console.log('  1. Open each SVG in a browser');
console.log('  2. Right-click > Save Image As > PNG');
console.log('  Or use: npx svg2png-cli public/icons/*.svg');
console.log('\nFor production, replace with proper designed icons.');
