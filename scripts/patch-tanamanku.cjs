// patch-tanamanku.cjs — menghapus AI dan restore static guide
const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '..', 'src', 'TanamanKu.jsx');
let txt = fs.readFileSync(targetFile, 'utf8');

// 1. Fix routing: ganti /chat ke /panduan, hapus AIChat route
txt = txt.replace(
  `          <Route path="/chat" element={<AIChat />} />\r\n          <Route path="/panduan" element={<SoilGuide />} />`,
  `          <Route path="/panduan" element={<SoilGuide />} />`
);

// 2. Fix Header: hapus /chat dari showBack exclusion
txt = txt.replace(
  `const showBack = !['/', '/ensiklopedia', '/favorit', '/chat', '/panduan'].includes(location.pathname);`,
  `const showBack = !['/', '/ensiklopedia', '/favorit', '/panduan'].includes(location.pathname);`
);

// 3. Fix BottomNav: ganti AI Chat tab ke Panduan
txt = txt.replace(
  `    { path: '/chat', icon: <span style={{fontSize:'1.2rem'}}>\uD83E\uDD16</span>, label: 'AI Chat' }`,
  `    { path: '/panduan', icon: <span style={{fontSize:'1.2rem'}}>\uD83D\uDCDA</span>, label: 'Panduan' }`
);

// 4. Hapus FAB robot (ganti dengan null function)
txt = txt.replace(
  /\/\/ --- FAB ---\nfunction FAB\(\) \{[\s\S]*?^}\s*\n/m,
  `// --- FAB ---\nfunction FAB() { return null; }\n`
);

// 5. Hapus PlantingMethodsSection dari PlantDetail
txt = txt.replace(
  `        <PlantingMethodsSection plant={plant} />\n`,
  ``
);
// juga tanpa newline
txt = txt.replace(
  `        <PlantingMethodsSection plant={plant} />`,
  ``
);

// 6. Hapus GreenhouseEquipmentSection dari PlantDetail
txt = txt.replace(
  `        <GreenhouseEquipmentSection plant={plant} />\n\n`,
  ``
);
txt = txt.replace(
  `        <GreenhouseEquipmentSection plant={plant} />`,
  ``
);

fs.writeFileSync(targetFile, txt, 'utf8');
console.log('Step 1 done - routing, nav, FAB, sections from PlantDetail removed');
