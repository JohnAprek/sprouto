import re
import sys

with open("c:\\Project\\projectapps\\tanamanku\\src\\TanamanKu.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Routing & Nav
content = re.sub(r'<Route path="/pemula" element={<PlantGuide />} />\s*', '', content)
content = re.sub(r'<Route path="/panduan/:id" element={<PlantGrowingGuide />} />\s*', '', content)

content = content.replace(
    "const showBack = !['/', '/ensiklopedia', '/pemula', '/favorit', '/chat'].includes(location.pathname);",
    "const showBack = !['/', '/ensiklopedia', '/favorit', '/chat'].includes(location.pathname);"
)

content = re.sub(r'\{ path: \'/pemula\', icon: <Sprout size=\{22\} />, label: \'Panduan\' \},\s*', '', content)

# 2. Insert AIGuideSection into PlantDetail
plant_detail_insert = """        </ul>

        {/* --- NEW SECTION: PANDUAN AI --- */}
        <AIGuideSection plant={plant} />

        <div style={{ marginTop: '32px' }}>"""

content = content.replace("        </ul>\n\n        <div style={{ marginTop: '32px' }}>", plant_detail_insert)

# 3. Append AIGuideSection component
ai_guide_component = """
// --- AI Guide Section ---
function AIGuideSection({ plant }) {
  const [guide, setGuide] = useLocalStorage(`guide_${plant.id}_content`, null);
  const [tasks, setTasks] = useLocalStorage(`guide_${plant.id}_tasks`, []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateGuide = async () => {
    setLoading(true);
    setError(null);
    try {
      const prompt = `Buat panduan menanam ${plant.name} (${plant.scientificName}) dari nol untuk pemula Indonesia. Format response sebagai JSON dengan struktur: { "phases": [ { "phase": "Hari 0", "title": "judul fase", "icon": "emoji", "color": "hex color", "tasks": [ { "task": "judul tugas", "detail": "penjelasan detail praktis 2-3 kalimat" } ] } ] }. Buat 6 fase: 1. Hari 0 - Persiapan khusus, 2. Hari 1-3 - Adaptasi spesifik, 3. Hari 4-7 - Rutinitas awal, 4. Minggu 2-4 - Perkembangan awal, 5. Bulan 1-3 - Perawatan rutin spesifik, 6. Bulan 3+ - Berkembang & tips lanjutan. Sesuaikan dengan karakteristik unik: tingkat kesulitan ${plant.difficulty}, kebutuhan air ${plant.schedules.watering} hari sekali, cahaya ${plant.careDetails.sunlight.split(' ')[0]}. Setiap fase minimal 3-4 tugas spesifik. Hanya keluarkan format JSON valid tanpa teks lain.`;
      
      const res = await fetch('https://api-proxy.johnaprek.workers.dev/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: prompt }],
          system: "Kamu ahli hortikultura Indonesia. Buat panduan menanam step-by-step dalam Bahasa Indonesia yang detail, praktis, dan mudah dipahami pemula. Pastikan response adalah JSON valid.",
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 2000,
          temperature: 0.7
        })
      });

      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      
      // Parse JSON from text response
      let jsonStr = data.content[0].text;
      const match = jsonStr.match(/\{[\s\S]*\}/);
      if (match) jsonStr = match[0];
      
      const parsed = JSON.parse(jsonStr);
      setGuide({ ...parsed, createdAt: new Date().toISOString() });
      setTasks([]);
    } catch (err) {
      console.error(err);
      setError("Gagal membuat panduan 😔 Cek koneksi dan coba lagi");
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = (taskId) => {
    setTasks(prev => prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]);
  };

  return (
    <div style={{ marginTop: '32px' }}>
      <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>📅 Panduan Menanam dari Nol</h3>
      
      {!guide && !loading && (
        <div style={{ background: 'var(--surface)', padding: '24px', borderRadius: '16px', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
          <p style={{ marginBottom: '16px', color: 'var(--text-muted)' }}>Panduan interaktif step-by-step khusus untuk merawat {plant.name}. Dibuat otomatis menggunakan AI.</p>
          <button className="btn-primary" onClick={generateGuide} style={{ margin: '0 auto' }}>
            🌱 Generate Panduan untuk Tanaman Ini
          </button>
          {error && <p style={{ color: '#ef4444', marginTop: '12px', fontSize: '0.85rem' }}>{error}</p>}
        </div>
      )}

      {loading && (
        <div style={{ background: 'var(--surface)', padding: '24px', borderRadius: '16px', textAlign: 'center' }}>
          <div className="spinner" style={{ width: '40px', height: '40px', margin: '0 auto 16px', border: '3px solid #dcfce7', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Menyusun panduan spesifik...</p>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {guide && !loading && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Dibuat pada: {new Date(guide.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
            <button onClick={generateGuide} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              🔄 Generate Ulang
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {guide.phases.map((phase, pIdx) => {
              const phaseTasks = phase.tasks || [];
              const completedInPhase = phaseTasks.filter((_, tIdx) => tasks.includes(`${pIdx}-${tIdx}`)).length;
              const isDone = completedInPhase === phaseTasks.length && phaseTasks.length > 0;
              
              return (
                <details key={pIdx} style={{ background: 'var(--surface)', borderRadius: '16px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', borderLeft: `4px solid ${phase.color || 'var(--primary)'}` }} open={pIdx === 0}>
                  <summary style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', listStyle: 'none' }}>
                    <div style={{ fontSize: '1.5rem', flexShrink: 0 }}>{phase.icon || '🌱'}</div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '0.75rem', fontWeight: 700, color: phase.color || 'var(--primary)', textTransform: 'uppercase' }}>{phase.phase}</p>
                      <p style={{ fontSize: '1rem', fontWeight: 700, color: isDone ? 'var(--text-muted)' : 'var(--text-main)', textDecoration: isDone ? 'line-through' : 'none' }}>{phase.title}</p>
                    </div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', background: '#f3f4f6', padding: '4px 8px', borderRadius: '50px' }}>
                      {completedInPhase}/{phaseTasks.length}
                    </div>
                  </summary>
                  <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {phaseTasks.map((task, tIdx) => {
                      const taskId = `${pIdx}-${tIdx}`;
                      const done = tasks.includes(taskId);
                      return (
                        <div key={tIdx} onClick={() => toggleTask(taskId)} style={{ display: 'flex', gap: '12px', cursor: 'pointer', opacity: done ? 0.6 : 1, transition: 'opacity 0.2s' }}>
                          <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: `2px solid ${done ? 'var(--primary)' : 'var(--border-color)'}`, background: done ? 'var(--primary)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                            {done && <span style={{ color: 'white', fontSize: '12px', fontWeight: 700 }}>✓</span>}
                          </div>
                          <div>
                            <p style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '2px', textDecoration: done ? 'line-through' : 'none' }}>{task.task}</p>
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
      )}
    </div>
  );
}
"""

content = content + "\n" + ai_guide_component

with open("c:\\Project\\projectapps\\tanamanku\\src\\TanamanKu.jsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated TanamanKu.jsx")
