// Regenerate the Sprouto app icon set from the finished mascot icon
// (menntah/robot.png — a green rounded square on a white canvas).
// We trim the white margin, then overscan-crop to a clean full-bleed green icon.
//   node scripts/gen-app-icon.cjs
const sharp = require('sharp');

const SRC = 'menntah/robot.png';
const GREEN = '#15622f';

// trimmed green square -> clean full-bleed square at `size` (corners cropped off)
async function fullBleed(size, overscan = 1.16) {
  const trimmed = await sharp(SRC).trim({ threshold: 8 }).toBuffer();
  const big = Math.round(size * overscan);
  const off = Math.round((big - size) / 2);
  return sharp(trimmed)
    .resize(big, big, { fit: 'cover', position: 'centre' })
    .extract({ left: off, top: off, width: size, height: size })
    .flatten({ background: GREEN })
    .png()
    .toBuffer();
}

async function write(size, out, overscan) {
  await sharp(await fullBleed(size, overscan)).toFile(out);
}

(async () => {
  await write(512, 'public/pwa-512x512.png');
  await write(192, 'public/pwa-192x192.png');
  await write(180, 'public/apple-touch-icon.png');
  await write(32, 'public/favicon-32x32.png');
  await write(16, 'public/favicon-16x16.png');

  // Maskable: shrink the icon into the 80% safe zone on a full green square.
  const inner = await fullBleed(Math.round(512 * 0.80));
  await sharp({ create: { width: 512, height: 512, channels: 4, background: GREEN } })
    .composite([{ input: inner, gravity: 'center' }]).png()
    .toFile('public/pwa-512x512-maskable.png');

  // Social card 1200x630: green bg + mascot + wordmark.
  const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#166534"/><stop offset="1" stop-color="#0e3d24"/></linearGradient></defs>
    <rect width="1200" height="630" fill="url(#g)"/>
    <text x="640" y="430" text-anchor="middle" font-family="Verdana, Arial, sans-serif" font-size="104" font-weight="bold" fill="#ffffff">Sprouto</text>
    <text x="640" y="488" text-anchor="middle" font-family="Verdana, Arial, sans-serif" font-size="32" fill="#bbf7d0">Grow, Care &amp; Manage Your Plants</text>
  </svg>`;
  const ogIcon = await sharp(await fullBleed(280)).resize(280, 280).png()
    .extend({ top: 0, bottom: 0, left: 0, right: 0 }).toBuffer();
  await sharp(Buffer.from(og)).png().composite([{ input: ogIcon, top: 175, left: 360 }]).png()
    .toFile('public/og-image.png');

  // Play Store feature graphic 1024x500.
  const fg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="500">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#166534"/><stop offset="1" stop-color="#0f3d24"/></linearGradient></defs>
    <rect width="1024" height="500" fill="url(#g)"/>
    <text x="430" y="205" font-family="Verdana, Arial, sans-serif" font-size="96" font-weight="bold" fill="#ffffff">Sprouto</text>
    <text x="434" y="262" font-family="Verdana, Arial, sans-serif" font-size="30" fill="#bbf7d0">Grow, Care &amp; Manage Your Plants</text>
    <text x="434" y="330" font-family="Verdana, Arial, sans-serif" font-size="24" font-weight="bold" fill="#86efac">200+ plants · reminders · pet-safe · guides</text>
    <text x="434" y="368" font-family="Verdana, Arial, sans-serif" font-size="24" font-weight="bold" fill="#86efac">hydroponics · journal · EN &amp; ID</text>
  </svg>`;
  const fgIcon = await sharp(await fullBleed(330)).toBuffer();
  await sharp(Buffer.from(fg)).png().composite([{ input: fgIcon, top: 85, left: 60 }]).png()
    .toFile('public/feature-graphic.png');

  console.log('App icon set + social/feature graphics regenerated from robot.png.');
})().catch((e) => { console.error(e); process.exit(1); });
