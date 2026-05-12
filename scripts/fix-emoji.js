// fix-emoji.js — run with: node fix-emoji.js
const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '..', 'src', 'TanamanKu.jsx');
let txt = fs.readFileSync(targetFile, 'utf8');

// Each entry: [brokenString, correctEmoji]
// The broken strings are UTF-8 emoji bytes mis-read as Latin-1
// We match the literal mojibake text and replace with real emoji
const fixes = [
  // 4-byte emoji (F0 9F ...) broken as 4 latin-1 chars
  ['\u00f0\u009f\u008c\u00bf', '\uD83C\uDF3F'],  // 🌿 U+1F33F
  ['\u00f0\u009f\u008c\u00ba', '\uD83C\uDF3A'],  // 🌺 U+1F33A
  ['\u00f0\u009f\u008c\u00b5', '\uD83C\uDF35'],  // 🌵 U+1F335
  ['\u00f0\u009f\u008c\u00b8', '\uD83C\uDF38'],  // 🌸 U+1F338
  ['\u00f0\u009f\u008c\u00b3', '\uD83C\uDF33'],  // 🌳 U+1F333
  ['\u00f0\u009f\u008c\u00b1', '\uD83C\uDF31'],  // 🌱 U+1F331
  ['\u00f0\u009f\u008c\u00b4', '\uD83C\uDF34'],  // 🌴 U+1F334
  ['\u00f0\u009f\u008c\u00bc', '\uD83C\uDF3C'],  // 🌼 U+1F33C
  ['\u00f0\u009f\u008c\u00bb', '\uD83C\uDF3B'],  // 🌻 U+1F33B
  ['\u00f0\u009f\u008d\u0083', '\uD83C\uDF43'],  // 🍃 U+1F343
  ['\u00f0\u009f\u008d\u0085', '\uD83C\uDF45'],  // 🍅 U+1F345
  ['\u00f0\u009f\u008d\u0086', '\uD83C\uDF46'],  // 🍆 U+1F346
  ['\u00f0\u009f\u008d\u008b', '\uD83C\uDF4B'],  // 🍋 U+1F34B
  ['\u00f0\u009f\u008d\u008c', '\uD83C\uDF4C'],  // 🍌 U+1F34C
  ['\u00f0\u009f\u008d\u008a', '\uD83C\uDF4A'],  // 🍊 U+1F34A
  ['\u00f0\u009f\u008d\u0089', '\uD83C\uDF49'],  // 🍉 U+1F349
  ['\u00f0\u009f\u008d\u0093', '\uD83C\uDF53'],  // 🍓 U+1F353
  ['\u00f0\u009f\u008d\u0097', '\uD83C\uDF57'],  // 🍗 U+1F357
  ['\u00f0\u009f\u008c\u00b6\ufe0f', '\uD83C\uDF36\uFE0F'],  // 🌶️
  ['\u00f0\u009f\u008c\u00b6', '\uD83C\uDF36'],  // 🌶
  ['\u00f0\u009f\u00a5\u00ac', '\uD83E\uDD6C'],  // 🥬 U+1F96C
  ['\u00f0\u009f\u00a5\u0097', '\uD83E\uDD57'],  // 🥗 U+1F957
  ['\u00f0\u009f\u00a5\u00a6', '\uD83E\uDD66'],  // 🥦 U+1F966
  ['\u00f0\u009f\u00a5\u0092', '\uD83E\uDD52'],  // 🥒 U+1F952
  ['\u00f0\u009f\u00a5\u0095', '\uD83E\uDD55'],  // 🥕 U+1F955
  ['\u00f0\u009f\u00a5\u0091', '\uD83E\uDD51'],  // 🥑 U+1F951
  ['\u00f0\u009f\u00a4\u0096', '\uD83E\uDD16'],  // 🤖 U+1F916
  ['\u00f0\u009f\u00aa\u00b4', '\uD83E\uDEB4'],  // 🪴 U+1FAB4
  ['\u00f0\u009f\u00aa\u00b0', '\uD83E\uDEB0'],  // 🪰 U+1FAB0
  ['\u00f0\u009f\u0092\u009a', '\uD83D\uDC9A'],  // 💚 U+1F49A
  ['\u00f0\u009f\u0092\u009b', '\uD83D\uDC9B'],  // 💛 U+1F49B
  ['\u00f0\u009f\u0092\u009c', '\uD83D\uDC9C'],  // 💜 U+1F49C
  ['\u00f0\u009f\u0092\u00a7', '\uD83D\uDCA7'],  // 💧 U+1F4A7
  ['\u00f0\u009f\u0092\u00b0', '\uD83D\uDCB0'],  // 💰 U+1F4B0
  ['\u00f0\u009f\u008c\u00b0', '\uD83C\uDF30'],  // 🌰 U+1F330
  ['\u00f0\u009f\u008f\u00a1', '\uD83C\uDFE1'],  // 🏡 U+1F3E1
  ['\u00f0\u009f\u008f\u00b7', '\uD83C\uDFF7'],  // 🏷 U+1F3F7
  ['\u00f0\u009f\u0093\u0085', '\uD83D\uDCC5'],  // 📅 U+1F4C5
  ['\u00f0\u009f\u0093\u00a6', '\uD83D\uDCE6'],  // 📦 U+1F4E6
  ['\u00f0\u009f\u0093\u008b', '\uD83D\uDCCB'],  // 📋 U+1F4CB
  ['\u00f0\u009f\u0093\u008a', '\uD83D\uDCCA'],  // 📊 U+1F4CA
  ['\u00f0\u009f\u0097\u0082', '\uD83D\uDDC2'],  // 🗂 U+1F5C2
  ['\u00f0\u009f\u009b\u008d', '\uD83D\uDECD'],  // 🛍 U+1F6CD
  ['\u00f0\u009f\u009b\u0092', '\uD83D\uDED2'],  // 🛒 U+1F6D2
  ['\u00f0\u009f\u0094\u00a5', '\uD83D\uDD25'],  // 🔥 U+1F525
  ['\u00f0\u009f\u0094\u00b4', '\uD83D\uDD34'],  // 🔴 U+1F534
  ['\u00f0\u009f\u0094\u00b5', '\uD83D\uDD35'],  // 🔵 U+1F535
  ['\u00f0\u009f\u0094\u00b2', '\uD83D\uDD32'],  // 🔲 U+1F532
  ['\u00f0\u009f\u0094\u00b3', '\uD83D\uDD33'],  // 🔳 U+1F533
  ['\u00f0\u009f\u0094\u00ae', '\uD83D\uDD2E'],  // 🔮 U+1F52E
  ['\u00f0\u009f\u0094\u0084', '\uD83D\uDD04'],  // 🔄 U+1F504
  ['\u00f0\u009f\u0094\u008e', '\uD83D\uDD0E'],  // 🔎 U+1F50E
  ['\u00f0\u009f\u009a\u00ab', '\uD83D\uDEAB'],  // 🚫 U+1F6AB
  ['\u00f0\u009f\u009a\u00b0', '\uD83D\uDEB0'],  // 🚰 U+1F6B0
  ['\u00f0\u009f\u009b\u00ab', '\uD83D\uDEEB'],  // 🛫 U+1F6EB
  ['\u00f0\u009f\u008e\u00af', '\uD83C\uDF6F'],  // 🎯 U+1F3AF
  ['\u00f0\u009f\u008e\u00b4', '\uD83C\uDF74'],  // 🎴 U+1F374
  ['\u00f0\u009f\u008e\u00a8', '\uD83C\uDF68'],  // 🎨 U+1F368
  ['\u00f0\u009f\u0091\u008b', '\uD83D\uDC4B'],  // 👋 U+1F44B
  ['\u00f0\u009f\u0091\u0089', '\uD83D\uDC49'],  // 👉 U+1F449
  ['\u00f0\u009f\u0091\u008d', '\uD83D\uDC4D'],  // 👍 U+1F44D
  ['\u00f0\u009f\u0091\u00a4', '\uD83D\uDC64'],  // 👤 U+1F464
  ['\u00f0\u009f\u008c\u009f', '\uD83C\uDF1F'],  // 🌟 U+1F31F
  ['\u00f0\u009f\u008c\u009e', '\uD83C\uDF1E'],  // 🌞 U+1F31E
  ['\u00f0\u009f\u008c\u009d', '\uD83C\uDF1D'],  // 🌝 U+1F31D
  ['\u00f0\u009f\u008c\u009c', '\uD83C\uDF1C'],  // 🌜 U+1F31C
  ['\u00f0\u009f\u008c\u009b', '\uD83C\uDF1B'],  // 🌛 U+1F31B
  ['\u00f0\u009f\u00a4\u0094', '\uD83E\uDD14'],  // 🤔 U+1F914
  ['\u00f0\u009f\u00a4\u00a9', '\uD83E\uDD29'],  // 🤩 U+1F929
  ['\u00f0\u009f\u00ab\u0080', '\uD83E\uDAC0'],  // new emoji
  // 3-byte emoji misencoded as 3 latin-1
  ['\u00e2\u009c\u0082', '\u2702'],  // ✂️
  ['\u00e2\u009c\u0085', '\u2705'],  // ✅
  ['\u00e2\u009c\u00a8', '\u2728'],  // ✨
  ['\u00e2\u0098\u0084', '\u2604'],  // ☄
  ['\u00e2\u0098\u00b0', '\u2630'],  // ☰
  ['\u00e2\u008f\u00b3', '\u23F3'],  // ⏳
  ['\u00e2\u0098\u0085', '\u2605'],  // ★
  ['\u00e2\u009d\u00a4', '\u2764'],  // ❤
  ['\u00e2\u009c\u0094', '\u2714'],  // ✔
  ['\u00e2\u009c\u0096', '\u2716'],  // ✖
];

let count = 0;
for (const [broken, fixed] of fixes) {
  const before = txt.length;
  txt = txt.split(broken).join(fixed);
  if (txt.length !== before) {
    console.log('Fixed:', JSON.stringify(broken).slice(0,20), '->', fixed);
    count++;
  }
}

fs.writeFileSync(targetFile, txt, 'utf8');
console.log(`\nFixed ${count} emoji patterns. File saved.`);

// Verify
const verify = fs.readFileSync(targetFile, 'utf8');
const testIdx = verify.indexOf('hias-1');
if (testIdx >= 0) {
  console.log('Verify sample:', verify.substring(testIdx, testIdx + 30));
}
