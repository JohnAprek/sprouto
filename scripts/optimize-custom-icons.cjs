// Optimize user-supplied 3D icons from ./menntah into public/icons-3d/<key>.png.
// Trims transparent margins, resizes to fit 160px, compresses. The <key> names
// match what Sprouto.jsx references, so no code change is needed.
//   node scripts/optimize-custom-icons.cjs
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SRC = 'menntah';
const OUT = 'public/icons-3d';

// target icon key -> source filename in ./menntah
const MAP = {
  robot: 'airoboticon.png',     // AI banner mascot (transparent green)
  camera: 'iconplanntsearch.png', // Identify Plant (magnifier + leaf)
  book: 'catalogue.png',        // Plant Guides stat
  fire: 'hoticon.png',          // Day Streak stat
  calendar: 'calenndar.png',    // Care Calendar
  droplet: 'droplet.png',       // Water Reminder
  garden: 'garden.png',         // My Garden stat
  heart: 'heart.png',           // Favorites stat
};

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  let ok = 0; const missing = [];
  for (const [key, file] of Object.entries(MAP)) {
    const src = path.join(SRC, file);
    if (!fs.existsSync(src)) { missing.push(file); continue; }
    const out = `${OUT}/${key}.png`;
    await sharp(src)
      .trim()
      .resize(160, 160, { fit: 'inside', withoutEnlargement: false })
      .png({ quality: 90, compressionLevel: 9 })
      .toFile(out);
    const kb = (fs.statSync(out).size / 1024).toFixed(1);
    console.log(`ok  ${key.padEnd(10)} <- ${file.padEnd(22)} (${kb} KB)`);
    ok++;
  }
  console.log(`\n${ok}/${Object.keys(MAP).length} optimized.` + (missing.length ? ' Missing: ' + missing.join(', ') : ''));
})();
