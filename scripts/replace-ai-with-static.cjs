// replace-ai-with-static.cjs
const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '..', 'src', 'TanamanKu.jsx');
let txt = fs.readFileSync(targetFile, 'utf8');
const lines = txt.split('\n');

// Lines are 1-indexed; section to cut: line 652 to 1176 (0-indexed: 651 to 1175)
// Line 652 starts with "// ──────────────────────────────────────────"
// Line 653 is "// SECTION: Cara Penanaman (3 Metode)"
// Line 1176 ends the AIChat function "}"
// Line 1177 starts "function Favorites() {"

// Find exact indices
let startIdx = -1, endIdx = -1;
for (let i = 0; i < lines.length; i++) {
  if (startIdx === -1 && lines[i].includes('SECTION: Cara Penanaman')) {
    startIdx = i - 1; // include the separator line before it
  }
  if (startIdx !== -1 && endIdx === -1 && lines[i].includes('function Favorites()')) {
    endIdx = i;
    break;
  }
}

console.log('Cutting from line', startIdx + 1, 'to', endIdx, '(exclusive)');

const beforeLines = lines.slice(0, startIdx);
const afterLines = lines.slice(endIdx);

const staticContent = `
// ─────────────────────────────────────────
// SECTION: Panduan Menanam (Static, per tanaman)
// ─────────────────────────────────────────

function buildStaticGuide(plant) {
  const w = plant.schedules.watering;
  const f = plant.schedules.fertilizer;
  const sun = plant.careDetails.sunlight;
  const watering = plant.careDetails.watering;
  const fertilizer = plant.careDetails.fertilizer;
  const pruning = plant.careDetails.pruning;
  const problems = plant.careDetails.commonProblems;
  const isSayuran = plant.category === 'Sayuran';
  const isHerbal = plant.category === 'Herbal' || plant.category === 'Obat';
  const isBuah = plant.category === 'Buah-buahan';
  const isHias = plant.category === 'Tanaman Hias';

  return {
    phases: [
      {
        phase: 'Hari 0', title: 'Persiapan Menanam', icon: '\u{1F4E6}', color: '#6366f1',
        tasks: [
          {
            task: 'Pilih pot & media tanam',
            detail: isSayuran
              ? 'Gunakan polybag 35x35 cm atau pot dengan lubang drainase. Bayam & kangkung bisa di polybag kecil, tomat & cabai perlu polybag besar (min. 10 liter).'
              : isBuah
                ? 'Pilih pot minimal 40x40 cm atau drum bekas untuk pohon buah. Pastikan ada lubang drainase besar.'
                : 'Gunakan pot dengan lubang drainase. Pilih ukuran 2-3 cm lebih besar dari diameter akar tanaman.'
          },
          {
            task: 'Siapkan media tanam',
            detail: (isHerbal)
              ? 'Campurkan tanah subur : cocopeat : perlite = 2:1:1 untuk drainase optimal agar rimpang tidak busuk.'
              : isBuah
                ? 'Campurkan tanah subur : kompos : sekam = 2:2:1. Tambahkan dolomit jika pH terlalu asam.'
                : isSayuran
                  ? 'Campurkan tanah kebun : kompos : sekam bakar = 2:1:1. Untuk hidroponik, gunakan rockwool atau cocopeat.'
                  : 'Gunakan campuran tanah subur + cocopeat + perlite (2:1:1) agar drainase baik dan akar dapat bernafas.'
          },
          {
            task: 'Tentukan lokasi cahaya',
            detail: 'Butuh: ' + sun + '. Pilih lokasi yang tepat sebelum menanam agar tidak perlu memindahkan tanaman saat sudah berakar.'
          },
          {
            task: 'Siapkan alat dasar',
            detail: 'Semprotan air, sekop kecil, sarung tangan berkebun. Pastikan alat bersih untuk mencegah infeksi jamur atau bakteri pada tanaman baru.'
          },
        ]
      },
      {
        phase: 'Hari 1\u20133', title: 'Fase Adaptasi Awal', icon: '\u{1F331}', color: '#f59e0b',
        tasks: [
          {
            task: 'Penyiraman pertama',
            detail: watering + ' Di hari pertama, jangan berlebihan \u2014 cukup basahi media hingga lembap merata. Jangan sampai menggenang.'
          },
          {
            task: 'Taruh di tempat teduh sementara',
            detail: isSayuran
              ? 'Sayuran muda tahan matahari tapi hindari terik siang. Letakkan di tempat yang mendapat sinar pagi saja selama 1-3 hari pertama.'
              : 'Selama 1-3 hari pertama, hindari sinar langsung. Beri cahaya tidak langsung agar tanaman beradaptasi (meminimalkan transplant shock).'
          },
          {
            task: 'Amati kondisi daun',
            detail: 'Daun layu sedikit di hari pertama adalah normal. Jika layu parah lebih dari 3 hari, periksa akar dan drainase pot segera.'
          },
          {
            task: 'Belum perlu pupuk',
            detail: 'Akar yang baru ditanam rentan terbakar pupuk. Tunggu minimal 7-10 hari sebelum pemupukan pertama.'
          },
        ]
      },
      {
        phase: 'Hari 4\u20137', title: 'Membangun Rutinitas', icon: '\u23F3', color: '#8b5cf6',
        tasks: [
          {
            task: 'Jadwal siram: setiap ' + w + ' hari',
            detail: watering + ' Cek kelembapan tanah dengan menusukkan jari 2-3 cm. Jika masih lembap, tunda penyiraman.'
          },
          {
            task: 'Pindah ke lokasi permanen',
            detail: 'Pastikan mendapat ' + sun + ' secara konsisten. ' + (isHias ? 'Tanaman hias indoor cukup di dekat jendela terang.' : isSayuran ? 'Sayuran butuh matahari minimal 4-6 jam langsung.' : 'Sesuaikan dengan kebutuhan cahaya tanaman ini.')
          },
          {
            task: 'Foto tanaman hari ke-7',
            detail: 'Dokumentasikan kondisi sebagai baseline. Foto dari sudut yang sama setiap minggu untuk memantau pertumbuhan.'
          },
          {
            task: 'Perhatikan tanda pertumbuhan',
            detail: 'Munculnya tunas baru, daun muda, atau warna lebih segar adalah tanda tanaman sudah beradaptasi dengan baik.'
          },
        ]
      },
      {
        phase: 'Minggu 2\u20134', title: 'Perkembangan Awal', icon: '\u{1F33F}', color: '#10b981',
        tasks: [
          {
            task: 'Pemupukan pertama (dosis 1/2)',
            detail: fertilizer + ' Berikan setengah dosis dari anjuran kemasan untuk menghindari over-fertilizing pada tanaman muda.'
          },
          {
            task: 'Cek kondisi akar & pot',
            detail: plant.schedules.repotting > 0
              ? 'Jika akar sudah keluar dari lubang drainase, siapkan pot lebih besar (2-3 cm lebih lebar). Repot saat tanaman belum terlalu besar.'
              : 'Perhatikan pertumbuhan di media. Tambah media jika menyusut dan akar mulai terlihat di permukaan.'
          },
          {
            task: 'Bersihkan daun dari debu',
            detail: isHias
              ? 'Lap daun lebar dengan kain lembap agar fotosintesis optimal. Hindari produk pengkilap daun berlebihan.'
              : 'Pastikan tidak ada debu menumpuk di daun. Semprotkan air secukupnya untuk menjaga stomata tetap bersih.'
          },
          {
            task: 'Waspadai hama',
            detail: 'Masalah umum: ' + problems + '. Periksa bagian bawah daun dan pangkal batang setiap minggu. Deteksi dini jauh lebih mudah diatasi.'
          },
        ]
      },
      {
        phase: 'Bulan 1\u20133', title: 'Perawatan Rutin', icon: '\u2702\uFE0F', color: '#ec4899',
        tasks: [
          {
            task: 'Pupuk rutin setiap ' + f + ' hari',
            detail: fertilizer + ' Konsistensi pemupukan sangat memengaruhi kualitas pertumbuhan jangka panjang.'
          },
          { task: 'Pemangkasan rutin', detail: pruning },
          {
            task: 'Evaluasi lokasi & cahaya',
            detail: 'Daun pucat atau kecil = kurang cahaya. Daun terbakar coklat = terlalu banyak cahaya langsung. Sesuaikan posisi secara bertahap (jangan pindah mendadak).'
          },
          {
            task: 'Catat & bandingkan perkembangan',
            detail: 'Bandingkan foto minggu ke-1 dan bulan ke-3. ' + (isSayuran ? 'Catat waktu panen untuk referensi musim berikutnya.' : 'Ukur tinggi atau hitung jumlah daun sebagai indikator kesehatan.')
          },
        ]
      },
      {
        phase: 'Bulan 3+',
        title: (isSayuran || isHerbal) ? 'Panen & Regenerasi' : isBuah ? 'Panen & Jaga Produktivitas' : 'Berkembang & Berbagi',
        icon: '\u{1F31F}', color: '#f43f5e',
        tasks: [
          {
            task: isSayuran ? 'Panen rutin & tanam ulang' : isHerbal ? 'Panen daun/rimpang secara berkala' : isBuah ? 'Panen buah & jaga nutrisi' : 'Coba propagasi (stek/biji)',
            detail: isSayuran
              ? 'Panen saat ukuran optimal, jangan terlalu tua. ' + pruning
              : isHerbal
                ? 'Panen daun/rimpang secara berkala untuk merangsang pertumbuhan baru. ' + pruning
                : isBuah
                  ? 'Panen buah tepat waktu untuk kualitas terbaik. Jaga nutrisi dengan pupuk kalium setelah panen.'
                  : 'Coba perbanyak dengan stek batang atau daun. Bagikan kepada teman atau tanam di pot baru.'
          },
          {
            task: 'Tingkatkan level perawatan',
            detail: isHias
              ? 'Pelajari teknik repotting, topping, atau propagasi untuk tanaman hias. Coba media tanam berbeda untuk hasil lebih optimal.'
              : isSayuran
                ? 'Coba teknik tumpang sari (menanam beberapa jenis sayuran berdampingan) untuk memaksimalkan ruang dan hasil panen.'
                : 'Pelajari teknik lanjutan perawatan ' + plant.category.toLowerCase() + ' untuk hasil yang lebih baik.'
          },
          {
            task: 'Tambah koleksi tanaman',
            detail: 'Dengan pengalaman merawat ' + plant.name + ', coba tanaman serupa atau dengan tingkat kesulitan satu level di atasnya.'
          },
          {
            task: 'Bagikan pengalaman',
            detail: 'Dokumentasikan perjalanan merawat tanamanmu dan bagikan ke komunitas. Pengalamanmu bisa membantu banyak pemula!'
          },
        ]
      },
    ]
  };
}

// --- Static PlantGuideSection ---
function PlantGuideSection({ plant }) {
  const [tasks, setTasks] = useLocalStorage('guide_' + plant.id + '_tasks', []);
  const guide = buildStaticGuide(plant);

  const toggleTask = (taskId) => {
    setTasks(prev => prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]);
  };

  const totalTasks = guide.phases.reduce((s, p) => s + p.tasks.length, 0);
  const pct = totalTasks > 0 ? Math.round((tasks.length / totalTasks) * 100) : 0;

  return (
    <div style={{ marginTop: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 style={{ fontSize: '1.2rem' }}>\u{1F4C5} Panduan Menanam dari Nol</h3>
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)' }}>{pct}% selesai</span>
      </div>
      <div style={{ height: '6px', background: 'var(--border-color)', borderRadius: '99px', marginBottom: '20px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: pct + '%', background: 'linear-gradient(90deg, var(--primary-dark), var(--primary))', borderRadius: '99px', transition: 'width 0.4s ease' }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {guide.phases.map((phase, pIdx) => {
          const phaseTasks = phase.tasks || [];
          const completedInPhase = phaseTasks.filter((_, tIdx) => tasks.includes(pIdx + '-' + tIdx)).length;
          const isDone = completedInPhase === phaseTasks.length && phaseTasks.length > 0;
          return (
            <details key={pIdx} style={{ background: 'var(--surface)', borderRadius: '16px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', borderLeft: '4px solid ' + phase.color }} open={pIdx === 0}>
              <summary style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', listStyle: 'none' }}>
                <div style={{ fontSize: '1.5rem', flexShrink: 0 }}>{phase.icon}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.7rem', fontWeight: 700, color: phase.color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{phase.phase}</p>
                  <p style={{ fontSize: '0.95rem', fontWeight: 700, color: isDone ? 'var(--text-muted)' : 'var(--text-main)', textDecoration: isDone ? 'line-through' : 'none' }}>{phase.title}</p>
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: isDone ? 'var(--primary)' : 'var(--text-muted)', background: isDone ? '#dcfce7' : '#f3f4f6', padding: '4px 10px', borderRadius: '50px' }}>
                  {completedInPhase}/{phaseTasks.length}
                </div>
              </summary>
              <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {phaseTasks.map((task, tIdx) => {
                  const taskId = pIdx + '-' + tIdx;
                  const done = tasks.includes(taskId);
                  return (
                    <div key={tIdx} onClick={() => toggleTask(taskId)} style={{ display: 'flex', gap: '12px', cursor: 'pointer', opacity: done ? 0.55 : 1, transition: 'opacity 0.2s' }}>
                      <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: '2px solid ' + (done ? phase.color : 'var(--border-color)'), background: done ? phase.color : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px', transition: 'all 0.2s' }}>
                        {done && <span style={{ color: 'white', fontSize: '12px', fontWeight: 700 }}>\u2713</span>}
                      </div>
                      <div>
                        <p style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '3px', textDecoration: done ? 'line-through' : 'none' }}>{task.task}</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5, textDecoration: done ? 'line-through' : 'none' }}>{task.detail}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}

`;

const newContent = beforeLines.join('\n') + staticContent + afterLines.join('\n');
fs.writeFileSync(targetFile, newContent, 'utf8');
console.log('Done! Total lines:', newContent.split('\n').length);
