// fix-emoji.cjs — run with: node scripts/fix-emoji.cjs
const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '..', 'src', 'TanamanKu.jsx');
let txt = fs.readFileSync(targetFile, 'utf8');

// Each entry: [brokenString, correctEmoji]
const fixes = [
  // 4-byte emoji misencoded: F0 9F xx yy -> chars U+00F0 U+009F U+00xx U+00yy
  ['\u00F0\u009F\u008C\u00BF', '\uD83C\uDF3F'],  // 🌿
  ['\u00F0\u009F\u008C\u00BA', '\uD83C\uDF3A'],  // 🌺
  ['\u00F0\u009F\u008C\u00B5', '\uD83C\uDF35'],  // 🌵
  ['\u00F0\u009F\u008C\u00B8', '\uD83C\uDF38'],  // 🌸
  ['\u00F0\u009F\u008C\u00B3', '\uD83C\uDF33'],  // 🌳
  ['\u00F0\u009F\u008C\u00B1', '\uD83C\uDF31'],  // 🌱
  ['\u00F0\u009F\u008C\u00B4', '\uD83C\uDF34'],  // 🌴
  ['\u00F0\u009F\u008C\u00BC', '\uD83C\uDF3C'],  // 🌼
  ['\u00F0\u009F\u008C\u00BB', '\uD83C\uDF3B'],  // 🌻
  ['\u00F0\u009F\u008D\u0083', '\uD83C\uDF43'],  // 🍃
  ['\u00F0\u009F\u008D\u0085', '\uD83C\uDF45'],  // 🍅
  ['\u00F0\u009F\u008D\u0086', '\uD83C\uDF46'],  // 🍆
  ['\u00F0\u009F\u008D\u008B', '\uD83C\uDF4B'],  // 🍋
  ['\u00F0\u009F\u008D\u008C', '\uD83C\uDF4C'],  // 🍌
  ['\u00F0\u009F\u008D\u008A', '\uD83C\uDF4A'],  // 🍊
  ['\u00F0\u009F\u008D\u0089', '\uD83C\uDF49'],  // 🍉
  ['\u00F0\u009F\u008D\u0093', '\uD83C\uDF53'],  // 🍓
  ['\u00F0\u009F\u008C\u00B6\uFE0F', '\uD83C\uDF36\uFE0F'],  // 🌶️
  ['\u00F0\u009F\u008C\u00B6', '\uD83C\uDF36'],  // 🌶
  ['\u00F0\u009F\u00A5\u00AC', '\uD83E\uDD6C'],  // 🥬
  ['\u00F0\u009F\u00A5\u0097', '\uD83E\uDD57'],  // 🥗
  ['\u00F0\u009F\u00A5\u00A6', '\uD83E\uDD66'],  // 🥦
  ['\u00F0\u009F\u00A5\u0092', '\uD83E\uDD52'],  // 🥒
  ['\u00F0\u009F\u00A5\u0095', '\uD83E\uDD55'],  // 🥕
  ['\u00F0\u009F\u00AA\u00B4', '\uD83E\uDEB4'],  // 🪴
  ['\u00F0\u009F\u00AA\u00B0', '\uD83E\uDEB0'],  // 🪰
  ['\u00F0\u009F\u0092\u009A', '\uD83D\uDC9A'],  // 💚
  ['\u00F0\u009F\u0092\u009B', '\uD83D\uDC9B'],  // 💛
  ['\u00F0\u009F\u0092\u009C', '\uD83D\uDC9C'],  // 💜
  ['\u00F0\u009F\u0092\u00A7', '\uD83D\uDCA7'],  // 💧
  ['\u00F0\u009F\u0092\u00B0', '\uD83D\uDCB0'],  // 💰
  ['\u00F0\u009F\u008C\u00B0', '\uD83C\uDF30'],  // 🌰
  ['\u00F0\u009F\u008F\u00A1', '\uD83C\uDFE1'],  // 🏡
  ['\u00F0\u009F\u008F\u00B7', '\uD83C\uDFF7'],  // 🏷
  ['\u00F0\u009F\u0093\u0085', '\uD83D\uDCC5'],  // 📅
  ['\u00F0\u009F\u0093\u00A6', '\uD83D\uDCE6'],  // 📦
  ['\u00F0\u009F\u0093\u008B', '\uD83D\uDCCB'],  // 📋
  ['\u00F0\u009F\u0093\u008A', '\uD83D\uDCCA'],  // 📊
  ['\u00F0\u009F\u0094\u0084', '\uD83D\uDD04'],  // 🔄
  ['\u00F0\u009F\u0094\u00A5', '\uD83D\uDD25'],  // 🔥
  ['\u00F0\u009F\u0094\u00B4', '\uD83D\uDD34'],  // 🔴
  ['\u00F0\u009F\u0094\u00B5', '\uD83D\uDD35'],  // 🔵
  ['\u00F0\u009F\u0094\u00AE', '\uD83D\uDD2E'],  // 🔮
  ['\u00F0\u009F\u0094\u008E', '\uD83D\uDD0E'],  // 🔎
  ['\u00F0\u009F\u009B\u008D', '\uD83D\uDECD'],  // 🛍
  ['\u00F0\u009F\u009B\u0092', '\uD83D\uDED2'],  // 🛒
  ['\u00F0\u009F\u009A\u00AB', '\uD83D\uDEAB'],  // 🚫
  ['\u00F0\u009F\u008E\u00AF', '\uD83C\uDF6F'],  // 🎯
  ['\u00F0\u009F\u008E\u00B4', '\uD83C\uDF74'],  // 🎴
  ['\u00F0\u009F\u008E\u00A8', '\uD83C\uDF68'],  // 🎨
  ['\u00F0\u009F\u0091\u008B', '\uD83D\uDC4B'],  // 👋
  ['\u00F0\u009F\u0091\u0089', '\uD83D\uDC49'],  // 👉
  ['\u00F0\u009F\u0091\u008D', '\uD83D\uDC4D'],  // 👍
  ['\u00F0\u009F\u0091\u00A4', '\uD83D\uDC64'],  // 👤
  ['\u00F0\u009F\u008C\u009F', '\uD83C\uDF1F'],  // 🌟
  ['\u00F0\u009F\u00A4\u0094', '\uD83E\uDD14'],  // 🤔
  ['\u00F0\u009F\u00A4\u0096', '\uD83E\uDD16'],  // 🤖
  ['\u00F0\u009F\u00A4\u00A9', '\uD83E\uDD29'],  // 🤩
  // 3-byte emoji misencoded: E2 xx yy -> chars U+00E2 U+00xx U+00yy
  ['\u00E2\u009C\u0082', '\u2702'],  // ✂
  ['\u00E2\u009C\u0085', '\u2705'],  // ✅
  ['\u00E2\u009C\u0094', '\u2714'],  // ✔
  ['\u00E2\u009C\u0096', '\u2716'],  // ✖
  ['\u00E2\u009C\u00A8', '\u2728'],  // ✨
  ['\u00E2\u008F\u00B3', '\u23F3'],  // ⏳
  ['\u00E2\u0098\u0085', '\u2605'],  // ★
  ['\u00E2\u009D\u00A4', '\u2764'],  // ❤
  ['\u00E2\u0099\u00BB', '\u267B'],  // ♻
];

let count = 0;
for (const [broken, fixed] of fixes) {
  if (txt.includes(broken)) {
    txt = txt.split(broken).join(fixed);
    console.log('Fixed:', fixed);
    count++;
  }
}

fs.writeFileSync(targetFile, txt, 'utf8');
console.log('\nTotal fixed:', count, 'emoji patterns');

// Verify
const verify = fs.readFileSync(targetFile, 'utf8');
const idx = verify.indexOf('hias-1');
if (idx >= 0) console.log('Verify:', verify.substring(idx, idx + 35));
