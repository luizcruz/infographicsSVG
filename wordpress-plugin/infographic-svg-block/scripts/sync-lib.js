/**
 * Copies ../../lib/infographicSVG.js → assets/infographicSVG.js
 * Run with: npm run sync-lib
 */
const fs   = require('fs');
const path = require('path');

const src  = path.resolve(__dirname, '../../lib/infographicSVG.js');
const dest = path.resolve(__dirname, '../assets/infographicSVG.js');

fs.copyFileSync(src, dest);
console.log(`Synced: ${src} → ${dest}`);
