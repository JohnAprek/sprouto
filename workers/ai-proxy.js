export default {
  async fetch(request, env) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Health check
    if (request.method === 'GET') {
      return new Response(JSON.stringify({ status: 'ok', engine: 'gemini-1.5-flash' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { type, plantName, plantLatin, messages } = await request.json();
    const GEMINI_KEY = env.GEMINI_API_KEY;
    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`;

    let prompt = '';

    if (type === 'guide') {
      prompt = `Kamu ahli hortikultura Indonesia. Buat panduan menanam ${plantName} (${plantLatin}) dari nol untuk pemula Indonesia.
Jawab HANYA dengan JSON valid, tanpa teks lain, tanpa markdown.
Format:
{"phases":[{"phase":"Hari 0","title":"judul","icon":"emoji","color":"#hex","tasks":[{"task":"judul","detail":"2-3 kalimat"}]}]}
Buat 6 fase: Hari 0, Hari 1-3, Hari 4-7, Minggu 2-4, Bulan 1-3, Bulan 3+. Minimal 3 tasks per fase.
Sesuaikan dengan karakteristik unik ${plantName}.`;

    } else if (type === 'methods') {
      prompt = `Kamu ahli hortikultura Indonesia. Jelaskan cara menanam ${plantName} (${plantLatin}) dalam 3 metode.
Jawab HANYA dengan JSON valid tanpa teks lain.
Format:
{"methods":[{"id":"pot","label":"Pot/Polybag","icon":"🪴","suitable":true,"suitableNote":"alasan","steps":["langkah..."],"tips":"tips khusus","potSize":"ukuran pot","soilMix":"campuran tanah"},{"id":"ground","label":"Tanah Langsung","icon":"🌍","suitable":true,"suitableNote":"alasan","steps":["langkah..."],"tips":"tips","spacing":"jarak tanam","soilPrep":"persiapan tanah"},{"id":"hydro","label":"Hidroponik","icon":"💧","suitable":true,"suitableNote":"alasan","steps":["langkah..."],"tips":"tips","system":"NFT/DFT/Wick","nutrient":"kebutuhan nutrisi"}]}`;

    } else if (type === 'equipment') {
      prompt = `Kamu ahli hortikultura Indonesia. Buat daftar perlengkapan untuk menanam ${plantName} di rumah/greenhouse.
Jawab HANYA dengan JSON valid tanpa teks lain.
Format:
{"essential":[{"name":"nama","icon":"emoji","purpose":"fungsi","estimatePrice":"Rp XX.XXX","priority":"wajib"}],"recommended":[{"name":"...","icon":"...","purpose":"...","estimatePrice":"...","priority":"disarankan"}],"optional":[{"name":"...","icon":"...","purpose":"...","estimatePrice":"...","priority":"opsional"}],"totalEstimate":{"essential":"Rp total","recommended":"Rp total","full":"Rp total"}}
Harga dalam rupiah, sesuaikan harga pasar Indonesia 2024.`;

    } else if (type === 'chat') {
      const chatHistory = (messages || []).map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      const body = {
        system_instruction: {
          parts: [{ text: `Kamu adalah asisten tanaman bernama TanamanBot yang ramah dan ahli di bidang hortikultura Indonesia. Jawab dalam Bahasa Indonesia, singkat dan praktis. Spesialisasi: perawatan tanaman, identifikasi masalah, tips berkebun untuk iklim tropis Indonesia.` }]
        },
        contents: chatHistory
      };

      const res = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Maaf, tidak bisa memproses sekarang.';
      return new Response(JSON.stringify({ reply }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({ error: 'Unknown type' }), { status: 400, headers: corsHeaders });
    }

    // For guide / methods / equipment
    const body = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 2048 }
    };
    const res = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    let text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    text = text.replace(/```json|```/g, '').trim();
    // Extract JSON object if wrapped in extra text
    const match = text.match(/\{[\s\S]*\}/);
    if (match) text = match[0];
    try {
      const parsed = JSON.parse(text);
      return new Response(JSON.stringify(parsed), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch {
      return new Response(JSON.stringify({ error: 'Parse error', raw: text.slice(0, 200) }), {
        status: 500, headers: corsHeaders
      });
    }
  }
};
