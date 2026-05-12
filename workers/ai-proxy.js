export default {
  async fetch(request, env) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method === 'GET') {
      return new Response(JSON.stringify({ status: 'ok', engine: 'gemini-1.5-flash' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { type, plantName, plantLatin, messages } = body;
    const GEMINI_KEY = env.GEMINI_API_KEY;

    if (!GEMINI_KEY) {
      return new Response(JSON.stringify({ error: 'GEMINI_API_KEY not configured' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`;

    // ─── CHAT ───────────────────────────────────────────────────────────────
    if (type === 'chat') {
      const chatHistory = (messages || []).map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      // Ensure first message is from user (Gemini requirement)
      const filtered = chatHistory.filter(m => m.role === 'user' || m.role === 'model');
      if (filtered.length === 0 || filtered[0].role !== 'user') {
        return new Response(JSON.stringify({ reply: 'Silakan kirim pesan pertama.' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const reqBody = {
        system_instruction: {
          parts: [{ text: 'Kamu adalah TanamanBot, asisten tanaman ahli hortikultura Indonesia yang ramah. Jawab dalam Bahasa Indonesia, singkat dan praktis. Spesialisasi: perawatan tanaman, identifikasi hama, tips berkebun tropis Indonesia.' }]
        },
        contents: filtered,
        generationConfig: { temperature: 0.8, maxOutputTokens: 1024 }
      };

      const res = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reqBody)
      });

      const data = await res.json();

      if (!res.ok) {
        return new Response(JSON.stringify({ reply: `Error ${res.status}: ${data.error?.message || 'Gemini error'}` }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Maaf, tidak bisa memproses sekarang.';
      return new Response(JSON.stringify({ reply }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // ─── GUIDE / METHODS / EQUIPMENT ────────────────────────────────────────
    let prompt = '';

    if (type === 'guide') {
      prompt = `Kamu ahli hortikultura Indonesia. Buat panduan menanam ${plantName} (${plantLatin}) dari nol untuk pemula Indonesia. Jawab HANYA dengan JSON valid, tanpa markdown, tanpa teks tambahan apapun.

Format JSON yang dibutuhkan:
{"phases":[{"phase":"Hari 0","title":"Persiapan","icon":"📦","color":"#6366f1","tasks":[{"task":"nama task","detail":"penjelasan 2-3 kalimat"}]}]}

Buat tepat 6 fase dengan label: "Hari 0", "Hari 1-3", "Hari 4-7", "Minggu 2-4", "Bulan 1-3", "Bulan 3+". Minimal 3 tasks per fase. Sesuaikan dengan karakteristik ${plantName}.`;

    } else if (type === 'methods') {
      prompt = `Kamu ahli hortikultura Indonesia. Jelaskan cara menanam ${plantName} (${plantLatin}) dalam 3 metode. Jawab HANYA dengan JSON valid, tanpa markdown, tanpa teks tambahan apapun.

Format JSON yang dibutuhkan:
{"methods":[{"id":"pot","label":"Pot/Polybag","icon":"🪴","suitable":true,"suitableNote":"alasan singkat","steps":["langkah 1","langkah 2","langkah 3"],"tips":"tips khusus","potSize":"ukuran pot","soilMix":"campuran media"},{"id":"ground","label":"Tanah Langsung","icon":"🌍","suitable":true,"suitableNote":"alasan","steps":["langkah 1","langkah 2"],"tips":"tips","spacing":"jarak tanam","soilPrep":"persiapan tanah"},{"id":"hydro","label":"Hidroponik","icon":"💧","suitable":false,"suitableNote":"alasan","steps":["langkah 1","langkah 2"],"tips":"tips","system":"NFT/DFT/Wick","nutrient":"AB mix ppm"}]}`;

    } else if (type === 'equipment') {
      prompt = `Kamu ahli hortikultura Indonesia. Buat daftar perlengkapan untuk menanam ${plantName} di rumah. Jawab HANYA dengan JSON valid, tanpa markdown, tanpa teks tambahan apapun.

Format JSON yang dibutuhkan:
{"essential":[{"name":"nama alat","icon":"🌱","purpose":"fungsi singkat","estimatePrice":"Rp 15.000","priority":"wajib"}],"recommended":[{"name":"nama","icon":"🪴","purpose":"fungsi","estimatePrice":"Rp 25.000","priority":"disarankan"}],"optional":[{"name":"nama","icon":"💧","purpose":"fungsi","estimatePrice":"Rp 50.000","priority":"opsional"}],"totalEstimate":{"essential":"Rp 100.000","recommended":"Rp 200.000","full":"Rp 300.000"}}

Berikan 4-5 item per kategori, harga pasar Indonesia 2024.`;

    } else {
      return new Response(JSON.stringify({ error: 'Unknown type: ' + type }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const reqBody = {
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.5,
        maxOutputTokens: 2048,
        responseMimeType: 'application/json'
      }
    };

    const res = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reqBody)
    });

    const data = await res.json();

    if (!res.ok) {
      return new Response(JSON.stringify({ error: `Gemini error ${res.status}`, detail: data.error?.message || JSON.stringify(data) }), {
        status: res.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    let text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    // Clean any accidental markdown
    text = text.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim();
    const match = text.match(/\{[\s\S]*\}/);
    if (match) text = match[0];

    try {
      const parsed = JSON.parse(text);
      return new Response(JSON.stringify(parsed), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch {
      return new Response(JSON.stringify({ error: 'JSON parse error', raw: text.slice(0, 300) }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};
