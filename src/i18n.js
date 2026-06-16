// Centralized i18n for Sprouto — English (default) + Indonesian.
import plantsId from './data/plants.json';
import plantsEn from './data/plants.en.json';

export const PLANTS = { id: plantsId, en: plantsEn };
export const LANGS = ['en', 'id'];

// Category keys are stored in the data (Indonesian) and used as logic keys.
// These maps translate them for display only.
export const CATEGORY_LABEL = {
  en: { 'Tanaman Hias': 'Ornamental', 'Sayuran': 'Vegetables', 'Buah-buahan': 'Fruits', 'Obat': 'Medicinal', 'Herbal': 'Herbal', 'Aromaterapi': 'Aromatherapy' },
  id: { 'Tanaman Hias': 'Tanaman Hias', 'Sayuran': 'Sayuran', 'Buah-buahan': 'Buah-buahan', 'Obat': 'Obat', 'Herbal': 'Herbal', 'Aromaterapi': 'Aromaterapi' },
};

// Short labels used in the category filter chips.
export const CATEGORY_CHIP = {
  en: { 'Semua': 'All', 'Tanaman Hias': 'Ornamental', 'Sayuran': 'Vegetables', 'Buah-buahan': 'Fruits', 'Obat': 'Medicinal', 'Herbal': 'Herbal', 'Aromaterapi': 'Aroma' },
  id: { 'Semua': 'Semua', 'Tanaman Hias': 'Hias', 'Sayuran': 'Sayuran', 'Buah-buahan': 'Buah', 'Obat': 'Obat', 'Herbal': 'Herbal', 'Aromaterapi': 'Aroma' },
};

export const DIFFICULTY_LABEL = {
  en: { mudah: 'easy', sedang: 'medium', sulit: 'hard' },
  id: { mudah: 'mudah', sedang: 'sedang', sulit: 'sulit' },
};

// hidroponik.kesulitan is stored as 'Mudah'/'Sedang'/'Sulit' (also a color key).
export const KESULITAN_LABEL = {
  en: { 'Mudah': 'Easy', 'Sedang': 'Medium', 'Sulit': 'Hard' },
  id: { 'Mudah': 'Mudah', 'Sedang': 'Sedang', 'Sulit': 'Sulit' },
};

export const LOCALE = { en: 'en-US', id: 'id-ID' };

const STR = {
  en: {
    headerSubtitle: 'Plant Care Companion',
    nav_home: 'Home', nav_catalog: 'Catalog', nav_favorites: 'Favorites', nav_guide: 'Guide', nav_garden: 'My Garden',

    greeting_morning: 'Good morning', greeting_noon: 'Good afternoon', greeting_evening: 'Good evening', greeting_night: 'Good evening',
    hero_subtitle: 'Take care of your plants today and reach the next level.',
    stat_favorites: 'Favorites', stat_garden: 'My Garden', stat_catalog: 'Catalog', stat_streak: 'Streak',
    popular_plants: 'Popular Plants', see_all: 'See All',
    tip_today_title: "Today's Tip",
    tip_today_body: 'Water your plants in the morning so the water does not pool for too long once the midday heat sets in.',

    search_placeholder: 'Search plant or scientific name...',
    all_levels: 'All Levels',
    sort_default: 'Default', sort_az: 'A → Z', sort_easiest: 'Easiest', sort_hardest: 'Hardest', sort_hydro: 'Hydroponic ↑',
    hydro_on: 'Hydroponic: ON', hydro_can: 'Hydroponic-friendly',
    pet_safe_on: 'Pet-safe: ON', pet_safe: 'Pet-safe',
    plants_match: 'plants match',
    no_plants: 'No plants found.',
    reloading: '🔄 Reloading...',

    every_n_days: (n) => `every ${n} days`,
    badge_hydro: 'Hydro',

    label_watering: 'Watering', label_light: 'Light', label_difficulty: 'Difficulty', label_fertilizer: 'Fertilizer',
    every_n_days_once: (n) => `every ${n} days`,
    add_to_garden: 'Add to My Garden', in_garden: 'In My Garden', share: 'Share',
    care_tips: 'Care Tips',
    tox_title: 'Pet Safety', tox_toxic: 'Toxic to pets', tox_nontoxic: 'Pet-safe', tox_caution: 'Use caution', tox_disclaimer: 'General guidance — not veterinary advice.',
    tip_watering: 'Watering', tip_light: 'Light', tip_fertilizing: 'Fertilizing', tip_pruning: 'Pruning',
    share_text: (p) => `🌿 ${p.name} (${p.scientificName})\n${p.description}\n\nSee it on Sprouto!`,
    hydro_how: 'How to Grow Hydroponically',
    hydro_not_recommended: 'Not Recommended for Hydroponics',
    hydro_method_recommended: 'Recommended Method', hydro_media: 'Medium', hydro_ph: 'Ideal pH', hydro_harvest: 'Harvest Time',
    hydro_nutrient: 'Nutrient Solution', hydro_tips: 'Hydroponic Tips',
    similar_plants: 'Similar Plants',

    guide_title: '📅 Growing Guide From Scratch', guide_done: 'done',
    journal_title: 'Journal', journal_add_note: 'How is your plant doing today?', journal_add_photo: 'Add photo', journal_save: 'Add entry', journal_empty: 'No entries yet — log your plant’s progress.', journal_delete: 'Delete',
    plant_not_found: 'Plant not found',

    fav_title: 'Favorite Collection',
    fav_empty_title: 'No favorite plants yet',
    fav_empty_sub: 'Save the plants you like to see them here.',
    fav_subtitle: 'Plants you want to grow — your wishlist.',
    supplies_title: '🛒 Recommended supplies',
    supply_soil: 'Potting mix', supply_pot: 'Plant pot', supply_fertilizer: 'Fertilizer', supply_rockwool: 'Rockwool', supply_nutrient: 'AB Mix nutrient',

    garden_title: '🌿 My Garden',
    garden_summary: (plants, tasks) => `${plants} plants · ${tasks} tasks today`,
    tab_schedule: '📅 Schedule', tab_collection: '🪴 My Collection',
    notif_enable_title: 'Enable Notifications', notif_enable_sub: 'Get an automatic reminder every morning', notif_enable_btn: 'Enable',
    garden_empty_title: 'Your garden is empty', garden_empty_sub: 'Add plants from the detail page', explore_plants: 'Explore Plants',
    today: 'Today', tomorrow: 'Tomorrow',
    n_tasks: (n) => `${n} tasks`, no_tasks: '— no tasks',
    task_water: 'water', task_fertilize: 'fertilize', task_prune: 'prune',
    coll_empty_title: 'No plants in your garden yet',
    started: 'Started', days: 'days', add_plant: '+ Add Plant',

    calc_title: '🧪 Nutrient Calculator',
    calc_sub: 'Calculate the AB Mix, EC, and pH needs for your hydroponic solution.',
    plant_type: 'Plant Type',
    preset_leafy: '🥬 Leafy Greens', preset_tomato: '🍅 Tomato / Chili', preset_fruit: '🍓 Fruit (Strawberry/Melon)', preset_herb: '🌿 Herbs & Spices',
    target_ec: 'Target EC', ph: 'pH',
    solution_params: 'Solution Parameters',
    water_volume: '💧 Water Volume', liters: 'Liters',
    vol_small: '1L (small Kratky)', vol_mid: '50L (DWC)', vol_large: '200L (large NFT)',
    ec_low: 'low', ec_optimal: 'optimal', ec_high: 'high',
    ec_seed: '0.5 (seedling)', ec_normal: '2.0 (normal)', ec_intensive: '5.0 (intensive)',
    ph_now: '🧫 Current Water pH',
    ph_acid: '4.0 (acidic)', ph_neutral: '7.0 (neutral)', ph_base: '9.0 (alkaline)',
    calc_result: '📊 Calculation Result',
    abmix_a: 'AB Mix Stock A', abmix_b: 'AB Mix Stock B',
    ph_down_needed: 'pH Down needed (lower to pH 6.0)', ph_up_needed: 'pH Up needed (raise to pH 6.0)',
    ph_ideal_ok: '✅ pH Is Ideal', ph_no_adjust: 'No pH adjuster needed',
    calc_note: '* Estimate based on a standard 500ml AB Mix stock. Always verify with an EC meter & pH meter.',
    mixing_order: '💡 Mixing Order Guide',
    mix1: 'Fill the container with clean water to the target volume',
    mix2: 'Add AB Mix Stock A, stir well',
    mix3: 'Add AB Mix Stock B, stir well',
    mix4: 'Measure EC — adjust by adding AB Mix or diluting with water',
    mix5: 'Measure pH — add pH Down/Up based on the calculation above',
    mix6: 'Re-check EC and pH after adjusting. Ready to use!',

    soil_title: '📚 Gardening Guide',
    soil_sub: 'Learn the basics of soil, growing media, fertilizer, and how to care for plants properly.',

    assistant_cta: '🤖 Ask the Care Assistant',
    assistant_title: '🤖 Care Assistant',
    assistant_sub: 'Ask about any plant — instant answers from our care database.',
    assistant_placeholder: 'e.g. How often do I water Monstera?',
    assistant_ask: 'Ask',
    assistant_no_plant: 'That plant isn’t in our catalog yet — but you can still ask Sprouto AI about it below.',
    assistant_summary: 'Here are the basics',
    assistant_open: 'Open full care guide →',
    assistant_note: 'Instant answers from structured data — not an AI chatbot (yet). Always double-check with a local expert.',
    assistant_ask_ai: '✨ Ask Sprouto AI', assistant_ai_thinking: '✨ Thinking…', assistant_ai_error: 'AI is unavailable right now — try again later.',
    identify_cta: '📷 Identify a plant', identify_title: '📷 Identify a Plant',
    identify_sub: 'Take or upload a photo of a leaf or flower and we’ll suggest the species.',
    identify_take: '📷 Take or choose a photo', identify_analyzing: 'Identifying…',
    identify_results: 'Best matches', identify_match_label: 'match', identify_open: 'View in Sprouto →',
    identify_none: 'No confident match. Try a clearer, closer photo of a single leaf or flower.',
    identify_error: 'Identification is unavailable right now — try again later.',
    identify_note: 'Suggestions are best-effort and can be wrong — always double-check before acting.',

    profile_save: 'Save', profile_edit: 'Edit', profile_role: 'Beginner Plant Lover', profile_collection: 'Collection', profile_level: 'Level 1',
    profile_ask_name: 'What is your name?',

    // toasts
    t_fav_removed: '💔 Removed from favorites', t_fav_added: '❤️ Added to favorites!',
    t_garden_removed: '🌿 Removed from My Garden', t_garden_added: '🪴 Added to My Garden!',
    t_link_copied: '🔗 Link copied to clipboard!',
    t_notif_unsupported: '❌ Your browser does not support notifications',
    t_notif_enabled: '🔔 Notifications enabled!', t_notif_denied: '❌ Notification permission denied',
    notif_welcome_body: 'You will get a plant-care reminder every day.',
    notif_daily_title: '🌱 Sprouto — Today’s Schedule',
    notif_water: (n) => `💧 Water ${n}`, notif_fertilize: (n) => `🌿 Fertilize ${n}`, notif_more: (n) => `+${n} more`,
  },
  id: {
    headerSubtitle: 'Teman Rawat Tanaman',
    nav_home: 'Beranda', nav_catalog: 'Katalog', nav_favorites: 'Favorit', nav_guide: 'Panduan', nav_garden: 'Kebunku',

    greeting_morning: 'Selamat Pagi', greeting_noon: 'Selamat Siang', greeting_evening: 'Selamat Sore', greeting_night: 'Selamat Malam',
    hero_subtitle: 'Ayo rawat tanamanmu hari ini dan capai level selanjutnya.',
    stat_favorites: 'Favorit', stat_garden: 'Kebunku', stat_catalog: 'Katalog', stat_streak: 'Streak',
    popular_plants: 'Tanaman Populer', see_all: 'Lihat Semua',
    tip_today_title: 'Tips Hari Ini',
    tip_today_body: 'Siram tanaman pagi hari agar air tidak menggenang terlalu lama saat suhu mulai panas siang nanti.',

    search_placeholder: 'Cari nama tanaman atau latin...',
    all_levels: 'Semua Level',
    sort_default: 'Default', sort_az: 'A → Z', sort_easiest: 'Termudah', sort_hardest: 'Tersulit', sort_hydro: 'Hidroponik ↑',
    hydro_on: 'Hidroponik: ON', hydro_can: 'Bisa Hidroponik',
    pet_safe_on: 'Aman hewan: ON', pet_safe: 'Aman hewan',
    plants_match: 'tanaman cocok',
    no_plants: 'Tidak ada tanaman ditemukan.',
    reloading: '🔄 Memuat ulang...',

    every_n_days: (n) => `setiap ${n} hari`,
    badge_hydro: 'Hidro',

    label_watering: 'Penyiraman', label_light: 'Cahaya', label_difficulty: 'Kesulitan', label_fertilizer: 'Pupuk',
    every_n_days_once: (n) => `${n} hari sekali`,
    add_to_garden: 'Tambah ke Kebunku', in_garden: 'Di Kebunku', share: 'Bagikan',
    care_tips: 'Tips Perawatan',
    tox_title: 'Keamanan Hewan', tox_toxic: 'Beracun bagi hewan', tox_nontoxic: 'Aman bagi hewan', tox_caution: 'Perlu kehati-hatian', tox_disclaimer: 'Panduan umum — bukan saran dokter hewan.',
    tip_watering: 'Penyiraman', tip_light: 'Cahaya', tip_fertilizing: 'Pemupukan', tip_pruning: 'Pemangkasan',
    share_text: (p) => `🌿 ${p.name} (${p.scientificName})\n${p.description}\n\nLihat di Sprouto!`,
    hydro_how: 'Cara Menanam Hidroponik',
    hydro_not_recommended: 'Tidak Direkomendasikan untuk Hidroponik',
    hydro_method_recommended: 'Metode Direkomendasikan', hydro_media: 'Media', hydro_ph: 'pH Ideal', hydro_harvest: 'Waktu Panen',
    hydro_nutrient: 'Larutan Nutrisi', hydro_tips: 'Tips Hidroponik',
    similar_plants: 'Tanaman Serupa',

    guide_title: '📅 Panduan Menanam dari Nol', guide_done: 'selesai',
    journal_title: 'Jurnal', journal_add_note: 'Bagaimana kabar tanamanmu hari ini?', journal_add_photo: 'Tambah foto', journal_save: 'Tambah catatan', journal_empty: 'Belum ada catatan — catat perkembangan tanamanmu.', journal_delete: 'Hapus',
    plant_not_found: 'Tanaman tidak ditemukan',

    fav_title: 'Koleksi Favorit',
    fav_empty_title: 'Belum ada tanaman favorit',
    fav_empty_sub: 'Simpan tanaman yang Anda suka untuk melihatnya di sini.',
    fav_subtitle: 'Tanaman yang ingin kamu tanam — wishlist-mu.',
    supplies_title: '🛒 Perlengkapan yang disarankan',
    supply_soil: 'Media tanam', supply_pot: 'Pot tanaman', supply_fertilizer: 'Pupuk', supply_rockwool: 'Rockwool', supply_nutrient: 'Nutrisi AB Mix',

    garden_title: '🌿 Kebunku',
    garden_summary: (plants, tasks) => `${plants} tanaman · ${tasks} tugas hari ini`,
    tab_schedule: '📅 Jadwal', tab_collection: '🪴 Koleksiku',
    notif_enable_title: 'Aktifkan Notifikasi', notif_enable_sub: 'Dapat pengingat otomatis setiap pagi', notif_enable_btn: 'Aktifkan',
    garden_empty_title: 'Kebunmu masih kosong', garden_empty_sub: 'Tambahkan tanaman dari halaman detail', explore_plants: 'Jelajahi Tanaman',
    today: 'Hari Ini', tomorrow: 'Besok',
    n_tasks: (n) => `${n} tugas`, no_tasks: '— tidak ada tugas',
    task_water: 'siram', task_fertilize: 'pupuk', task_prune: 'pangkas',
    coll_empty_title: 'Belum ada tanaman di kebunmu',
    started: 'Mulai', days: 'hari', add_plant: '+ Tambah Tanaman',

    calc_title: '🧪 Kalkulator Nutrisi',
    calc_sub: 'Hitung kebutuhan AB Mix, EC, dan pH untuk larutan hidroponikmu.',
    plant_type: 'Jenis Tanaman',
    preset_leafy: '🥬 Sayuran Daun', preset_tomato: '🍅 Tomat / Cabai', preset_fruit: '🍓 Buah (Stroberi/Melon)', preset_herb: '🌿 Herbal & Rempah',
    target_ec: 'Target EC', ph: 'pH',
    solution_params: 'Parameter Larutan',
    water_volume: '💧 Volume Air', liters: 'Liter',
    vol_small: '1L (Kratky kecil)', vol_mid: '50L (DWC)', vol_large: '200L (NFT besar)',
    ec_low: 'rendah', ec_optimal: 'optimal', ec_high: 'tinggi',
    ec_seed: '0.5 (semai)', ec_normal: '2.0 (normal)', ec_intensive: '5.0 (intensif)',
    ph_now: '🧫 pH Air Saat Ini',
    ph_acid: '4.0 (asam)', ph_neutral: '7.0 (netral)', ph_base: '9.0 (basa)',
    calc_result: '📊 Hasil Kalkulasi',
    abmix_a: 'AB Mix Stok A', abmix_b: 'AB Mix Stok B',
    ph_down_needed: 'pH Down diperlukan (turunkan ke pH 6.0)', ph_up_needed: 'pH Up diperlukan (naikkan ke pH 6.0)',
    ph_ideal_ok: '✅ pH Sudah Ideal', ph_no_adjust: 'Tidak perlu adjuster pH',
    calc_note: '* Estimasi berdasarkan AB Mix standar 500ml stok. Selalu verifikasi dengan EC meter & pH meter.',
    mixing_order: '💡 Panduan Urutan Pencampuran',
    mix1: 'Isi wadah dengan air bersih sesuai volume target',
    mix2: 'Masukkan AB Mix Stok A, aduk rata',
    mix3: 'Masukkan AB Mix Stok B, aduk rata',
    mix4: 'Ukur EC — sesuaikan dengan menambah AB Mix atau encerkan dengan air',
    mix5: 'Ukur pH — tambahkan pH Down/Up sesuai kalkulasi di atas',
    mix6: 'Cek ulang EC dan pH setelah penyesuaian. Siap digunakan!',

    soil_title: '📚 Panduan Berkebun',
    soil_sub: 'Pelajari dasar-dasar tanah, media tanam, pupuk, dan cara merawat tanaman dengan benar.',

    assistant_cta: '🤖 Tanya Asisten Perawatan',
    assistant_title: '🤖 Asisten Perawatan',
    assistant_sub: 'Tanya apa saja tentang tanaman — jawaban instan dari basis data perawatan kami.',
    assistant_placeholder: 'mis. Berapa sering menyiram Monstera?',
    assistant_ask: 'Tanya',
    assistant_no_plant: 'Tanaman itu belum ada di katalog kami — tapi kamu tetap bisa menanyakannya ke Sprouto AI di bawah.',
    assistant_summary: 'Berikut dasar-dasarnya',
    assistant_open: 'Buka panduan lengkap →',
    assistant_note: 'Jawaban instan dari data terstruktur — bukan chatbot AI (untuk saat ini). Selalu cek ulang dengan ahli setempat.',
    assistant_ask_ai: '✨ Tanya Sprouto AI', assistant_ai_thinking: '✨ Sedang berpikir…', assistant_ai_error: 'AI sedang tidak tersedia — coba lagi nanti.',
    identify_cta: '📷 Identifikasi tanaman', identify_title: '📷 Identifikasi Tanaman',
    identify_sub: 'Foto atau unggah gambar daun/bunga, kami sarankan spesiesnya.',
    identify_take: '📷 Ambil atau pilih foto', identify_analyzing: 'Mengidentifikasi…',
    identify_results: 'Kecocokan teratas', identify_match_label: 'cocok', identify_open: 'Lihat di Sprouto →',
    identify_none: 'Tidak ada kecocokan meyakinkan. Coba foto satu daun/bunga lebih jelas dan dekat.',
    identify_error: 'Identifikasi sedang tidak tersedia — coba lagi nanti.',
    identify_note: 'Saran ini best-effort dan bisa keliru — selalu cek ulang sebelum bertindak.',

    profile_save: 'Simpan', profile_edit: 'Edit', profile_role: 'Pecinta Tanaman Pemula', profile_collection: 'Koleksi', profile_level: 'Level 1',
    profile_ask_name: 'Siapa nama Anda?',

    t_fav_removed: '💔 Dihapus dari favorit', t_fav_added: '❤️ Ditambahkan ke favorit!',
    t_garden_removed: '🌿 Dihapus dari Kebunku', t_garden_added: '🪴 Ditambahkan ke Kebunku!',
    t_link_copied: '🔗 Link disalin ke clipboard!',
    t_notif_unsupported: '❌ Browser tidak mendukung notifikasi',
    t_notif_enabled: '🔔 Notifikasi diaktifkan!', t_notif_denied: '❌ Izin notifikasi ditolak',
    notif_welcome_body: 'Kamu akan mendapat pengingat perawatan tanaman setiap hari.',
    notif_daily_title: '🌱 Sprouto — Jadwal Hari Ini',
    notif_water: (n) => `💧 Siram ${n}`, notif_fertilize: (n) => `🌿 Pupuk ${n}`, notif_more: (n) => `+${n} lagi`,
  },
};

export function getStrings(lang) { return STR[lang] || STR.en; }

// Static "grow from scratch" guide. Receives the already-localized plant
// (EN dataset when lang==='en'), so plant care fields are in the right language.
export function buildStaticGuide(plant, lang) {
  const L = (en, id) => (lang === 'id' ? id : en);
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
        phase: L('Day 0', 'Hari 0'), title: L('Planting Preparation', 'Persiapan Menanam'), icon: '📦', color: '#6366f1',
        tasks: [
          {
            task: L('Choose pot & growing medium', 'Pilih pot & media tanam'),
            detail: isSayuran
              ? L('Use a 35×35 cm polybag or a pot with drainage holes. Spinach & water spinach work in small polybags; tomato & chili need a large polybag (min. 10 liters).', 'Gunakan polybag 35x35 cm atau pot dengan lubang drainase. Bayam & kangkung bisa di polybag kecil, tomat & cabai perlu polybag besar (min. 10 liter).')
              : isBuah
                ? L('Choose a pot at least 40×40 cm or a used drum for a fruit tree. Make sure it has large drainage holes.', 'Pilih pot minimal 40x40 cm atau drum bekas untuk pohon buah. Pastikan ada lubang drainase besar.')
                : L('Use a pot with drainage holes. Pick a size 2-3 cm larger than the diameter of the plant roots.', 'Gunakan pot dengan lubang drainase. Pilih ukuran 2-3 cm lebih besar dari diameter akar tanaman.'),
          },
          {
            task: L('Prepare the growing medium', 'Siapkan media tanam'),
            detail: isHerbal
              ? L('Mix fertile soil : cocopeat : perlite = 2:1:1 for optimal drainage so the rhizomes don’t rot.', 'Campurkan tanah subur : cocopeat : perlite = 2:1:1 untuk drainase optimal agar rimpang tidak busuk.')
              : isBuah
                ? L('Mix fertile soil : compost : rice husk = 2:2:1. Add dolomite if the pH is too acidic.', 'Campurkan tanah subur : kompos : sekam = 2:2:1. Tambahkan dolomit jika pH terlalu asam.')
                : isSayuran
                  ? L('Mix garden soil : compost : carbonized rice husk = 2:1:1. For hydroponics, use rockwool or cocopeat.', 'Campurkan tanah kebun : kompos : sekam bakar = 2:1:1. Untuk hidroponik, gunakan rockwool atau cocopeat.')
                  : L('Use a mix of fertile soil + cocopeat + perlite (2:1:1) for good drainage so the roots can breathe.', 'Gunakan campuran tanah subur + cocopeat + perlite (2:1:1) agar drainase baik dan akar dapat bernafas.'),
          },
          {
            task: L('Determine the light location', 'Tentukan lokasi cahaya'),
            detail: L('Needs: ' + sun + '. Pick the right spot before planting so you don’t have to move the plant once it has rooted.', 'Butuh: ' + sun + '. Pilih lokasi yang tepat sebelum menanam agar tidak perlu memindahkan tanaman saat sudah berakar.'),
          },
          {
            task: L('Prepare basic tools', 'Siapkan alat dasar'),
            detail: L('A water sprayer, a small trowel, gardening gloves. Make sure tools are clean to prevent fungal or bacterial infection on new plants.', 'Semprotan air, sekop kecil, sarung tangan berkebun. Pastikan alat bersih untuk mencegah infeksi jamur atau bakteri pada tanaman baru.'),
          },
        ],
      },
      {
        phase: L('Day 1–3', 'Hari 1–3'), title: L('Early Adaptation Phase', 'Fase Adaptasi Awal'), icon: '🌱', color: '#f59e0b',
        tasks: [
          {
            task: L('First watering', 'Penyiraman pertama'),
            detail: watering + L(' On the first day, don’t overdo it — just moisten the medium evenly. Don’t let it pool.', ' Di hari pertama, jangan berlebihan — cukup basahi media hingga lembap merata. Jangan sampai menggenang.'),
          },
          {
            task: L('Keep it in the shade for now', 'Taruh di tempat teduh sementara'),
            detail: isSayuran
              ? L('Young vegetables tolerate sun but avoid the harsh midday heat. Place them where they get morning sun only for the first 1-3 days.', 'Sayuran muda tahan matahari tapi hindari terik siang. Letakkan di tempat yang mendapat sinar pagi saja selama 1-3 hari pertama.')
              : L('For the first 1-3 days, avoid direct sun. Provide indirect light so the plant adapts (minimizing transplant shock).', 'Selama 1-3 hari pertama, hindari sinar langsung. Beri cahaya tidak langsung agar tanaman beradaptasi (meminimalkan transplant shock).'),
          },
          {
            task: L('Observe the leaf condition', 'Amati kondisi daun'),
            detail: L('Slightly wilted leaves on the first day are normal. If they wilt badly for more than 3 days, check the roots and pot drainage right away.', 'Daun layu sedikit di hari pertama adalah normal. Jika layu parah lebih dari 3 hari, periksa akar dan drainase pot segera.'),
          },
          {
            task: L('No fertilizer yet', 'Belum perlu pupuk'),
            detail: L('Newly planted roots are prone to fertilizer burn. Wait at least 7-10 days before the first feeding.', 'Akar yang baru ditanam rentan terbakar pupuk. Tunggu minimal 7-10 hari sebelum pemupukan pertama.'),
          },
        ],
      },
      {
        phase: L('Day 4–7', 'Hari 4–7'), title: L('Building a Routine', 'Membangun Rutinitas'), icon: '⏳', color: '#8b5cf6',
        tasks: [
          {
            task: L('Watering schedule: every ' + w + ' days', 'Jadwal siram: setiap ' + w + ' hari'),
            detail: watering + L(' Check soil moisture by poking your finger 2-3 cm in. If it’s still moist, hold off on watering.', ' Cek kelembapan tanah dengan menusukkan jari 2-3 cm. Jika masih lembap, tunda penyiraman.'),
          },
          {
            task: L('Move to a permanent spot', 'Pindah ke lokasi permanen'),
            detail: L('Make sure it gets ' + sun + ' consistently. ', 'Pastikan mendapat ' + sun + ' secara konsisten. ') + (isHias ? L('Indoor ornamentals are fine near a bright window.', 'Tanaman hias indoor cukup di dekat jendela terang.') : isSayuran ? L('Vegetables need at least 4-6 hours of direct sun.', 'Sayuran butuh matahari minimal 4-6 jam langsung.') : L('Adjust to this plant’s light needs.', 'Sesuaikan dengan kebutuhan cahaya tanaman ini.')),
          },
          {
            task: L('Photograph the plant on day 7', 'Foto tanaman hari ke-7'),
            detail: L('Document its condition as a baseline. Photograph from the same angle every week to track growth.', 'Dokumentasikan kondisi sebagai baseline. Foto dari sudut yang sama setiap minggu untuk memantau pertumbuhan.'),
          },
          {
            task: L('Watch for growth signs', 'Perhatikan tanda pertumbuhan'),
            detail: L('New shoots, young leaves, or fresher color are signs the plant has adapted well.', 'Munculnya tunas baru, daun muda, atau warna lebih segar adalah tanda tanaman sudah beradaptasi dengan baik.'),
          },
        ],
      },
      {
        phase: L('Week 2–4', 'Minggu 2–4'), title: L('Early Development', 'Perkembangan Awal'), icon: '🌿', color: '#10b981',
        tasks: [
          {
            task: L('First feeding (½ dose)', 'Pemupukan pertama (dosis 1/2)'),
            detail: fertilizer + L(' Give half the dose recommended on the package to avoid over-fertilizing young plants.', ' Berikan setengah dosis dari anjuran kemasan untuk menghindari over-fertilizing pada tanaman muda.'),
          },
          {
            task: L('Check the roots & pot', 'Cek kondisi akar & pot'),
            detail: plant.schedules.repotting > 0
              ? L('If roots are coming out of the drainage holes, prepare a larger pot (2-3 cm wider). Repot while the plant isn’t too big yet.', 'Jika akar sudah keluar dari lubang drainase, siapkan pot lebih besar (2-3 cm lebih lebar). Repot saat tanaman belum terlalu besar.')
              : L('Watch growth in the medium. Add more medium if it shrinks and roots start showing at the surface.', 'Perhatikan pertumbuhan di media. Tambah media jika menyusut dan akar mulai terlihat di permukaan.'),
          },
          {
            task: L('Wipe dust off the leaves', 'Bersihkan daun dari debu'),
            detail: isHias
              ? L('Wipe broad leaves with a damp cloth so photosynthesis is optimal. Avoid overusing leaf-shine products.', 'Lap daun lebar dengan kain lembap agar fotosintesis optimal. Hindari produk pengkilap daun berlebihan.')
              : L('Make sure no dust builds up on the leaves. Mist with a little water to keep the stomata clean.', 'Pastikan tidak ada debu menumpuk di daun. Semprotkan air secukupnya untuk menjaga stomata tetap bersih.'),
          },
          {
            task: L('Watch for pests', 'Waspadai hama'),
            detail: L('Common problems: ' + problems + '. Check the undersides of leaves and the base of the stem every week. Early detection is far easier to handle.', 'Masalah umum: ' + problems + '. Periksa bagian bawah daun dan pangkal batang setiap minggu. Deteksi dini jauh lebih mudah diatasi.'),
          },
        ],
      },
      {
        phase: L('Month 1–3', 'Bulan 1–3'), title: L('Routine Care', 'Perawatan Rutin'), icon: '✂️', color: '#ec4899',
        tasks: [
          {
            task: L('Fertilize every ' + f + ' days', 'Pupuk rutin setiap ' + f + ' hari'),
            detail: fertilizer + L(' Consistent feeding strongly affects long-term growth quality.', ' Konsistensi pemupukan sangat memengaruhi kualitas pertumbuhan jangka panjang.'),
          },
          { task: L('Routine pruning', 'Pemangkasan rutin'), detail: pruning },
          {
            task: L('Evaluate location & light', 'Evaluasi lokasi & cahaya'),
            detail: L('Pale or small leaves = too little light. Brown, burnt leaves = too much direct light. Adjust the position gradually (don’t move it suddenly).', 'Daun pucat atau kecil = kurang cahaya. Daun terbakar coklat = terlalu banyak cahaya langsung. Sesuaikan posisi secara bertahap (jangan pindah mendadak).'),
          },
          {
            task: L('Record & compare progress', 'Catat & bandingkan perkembangan'),
            detail: L('Compare the week-1 and month-3 photos. ', 'Bandingkan foto minggu ke-1 dan bulan ke-3. ') + (isSayuran ? L('Note the harvest time as a reference for next season.', 'Catat waktu panen untuk referensi musim berikutnya.') : L('Measure the height or count the leaves as a health indicator.', 'Ukur tinggi atau hitung jumlah daun sebagai indikator kesehatan.')),
          },
        ],
      },
      {
        phase: L('Month 3+', 'Bulan 3+'),
        title: (isSayuran || isHerbal) ? L('Harvest & Regrowth', 'Panen & Regenerasi') : isBuah ? L('Harvest & Maintain Productivity', 'Panen & Jaga Produktivitas') : L('Grow & Share', 'Berkembang & Berbagi'),
        icon: '🌟', color: '#f43f5e',
        tasks: [
          {
            task: isSayuran ? L('Harvest regularly & replant', 'Panen rutin & tanam ulang') : isHerbal ? L('Harvest leaves/rhizomes periodically', 'Panen daun/rimpang secara berkala') : isBuah ? L('Harvest fruit & keep nutrients up', 'Panen buah & jaga nutrisi') : L('Try propagation (cuttings/seeds)', 'Coba propagasi (stek/biji)'),
            detail: isSayuran
              ? L('Harvest at the optimal size, not too old. ', 'Panen saat ukuran optimal, jangan terlalu tua. ') + pruning
              : isHerbal
                ? L('Harvest leaves/rhizomes periodically to stimulate new growth. ', 'Panen daun/rimpang secara berkala untuk merangsang pertumbuhan baru. ') + pruning
                : isBuah
                  ? L('Harvest fruit on time for the best quality. Maintain nutrients with potassium fertilizer after harvest.', 'Panen buah tepat waktu untuk kualitas terbaik. Jaga nutrisi dengan pupuk kalium setelah panen.')
                  : L('Try to propagate via stem or leaf cuttings. Share with friends or plant in a new pot.', 'Coba perbanyak dengan stek batang atau daun. Bagikan kepada teman atau tanam di pot baru.'),
          },
          {
            task: L('Level up your care', 'Tingkatkan level perawatan'),
            detail: isHias
              ? L('Learn repotting, topping, or propagation techniques for ornamentals. Try different growing media for better results.', 'Pelajari teknik repotting, topping, atau propagasi untuk tanaman hias. Coba media tanam berbeda untuk hasil lebih optimal.')
              : isSayuran
                ? L('Try intercropping (growing several vegetables side by side) to maximize space and yield.', 'Coba teknik tumpang sari (menanam beberapa jenis sayuran berdampingan) untuk memaksimalkan ruang dan hasil panen.')
                : L('Learn advanced care techniques for this type of plant for better results.', 'Pelajari teknik lanjutan perawatan ' + plant.category.toLowerCase() + ' untuk hasil yang lebih baik.'),
          },
          {
            task: L('Add to your collection', 'Tambah koleksi tanaman'),
            detail: L('With experience caring for ' + plant.name + ', try a similar plant or one a level harder.', 'Dengan pengalaman merawat ' + plant.name + ', coba tanaman serupa atau dengan tingkat kesulitan satu level di atasnya.'),
          },
          {
            task: L('Share your experience', 'Bagikan pengalaman'),
            detail: L('Document your plant-care journey and share it with the community. Your experience can help many beginners!', 'Dokumentasikan perjalanan merawat tanamanmu dan bagikan ke komunitas. Pengalamanmu bisa membantu banyak pemula!'),
          },
        ],
      },
    ],
  };
}

export const ONBOARDING = {
  en: {
    steps: [
      { emoji: '🌿', title: 'Welcome to Sprouto!', desc: 'A complete guide to caring for your beloved plants, right in your hand.' },
      { emoji: '❤️', title: 'Save Favorite Plants', desc: 'Tap the heart icon on a plant card to save it to your favorites collection.' },
      { emoji: '📚', title: 'Complete Encyclopedia', desc: '70+ plants with detailed care guides, watering schedules, and expert tips.' },
      { emoji: '🪴', title: 'My Garden & Reminders', desc: 'Add plants to My Garden and get a daily care schedule with notifications.' },
    ],
    next: 'Next →', start_setup: 'Start Setup →', skip: 'Skip',
    ask_name: 'What is your name?',
    ask_name_sub: 'We will greet you every time you open the app.',
    name_placeholder: 'Enter your name...',
    start: 'Start! 🌿',
    default_name: 'Plant Friend',
  },
  id: {
    steps: [
      { emoji: '🌿', title: 'Selamat datang di Sprouto!', desc: 'Panduan lengkap merawat tanaman kesayangan Anda dalam genggaman.' },
      { emoji: '❤️', title: 'Simpan Tanaman Favorit', desc: 'Tekan ikon hati di kartu tanaman untuk menyimpannya ke koleksi favorit Anda.' },
      { emoji: '📚', title: 'Ensiklopedia Lengkap', desc: '70+ tanaman dengan panduan perawatan detail, jadwal siram, dan tips ahli.' },
      { emoji: '🪴', title: 'Kebunku & Pengingat', desc: 'Tambahkan tanaman ke Kebunku dan dapatkan jadwal perawatan harian beserta notifikasi.' },
    ],
    next: 'Lanjut →', start_setup: 'Mulai Setup →', skip: 'Lewati',
    ask_name: 'Siapa nama Anda?',
    ask_name_sub: 'Kami akan menyapa Anda setiap kali membuka aplikasi.',
    name_placeholder: 'Masukkan nama Anda...',
    start: 'Mulai! 🌿',
    default_name: 'Sahabat Tanaman',
  },
};

const SOIL_GUIDE_ID = [{"title":"Mengenal Jenis Tanah","icon":"🌍","color":"#92400e","sections":[{"heading":"Tanah Liat (Clay)","body":"Tanah berat dengan partikel halus. Menyimpan air dan nutrisi dengan baik, tapi drainase buruk sehingga mudah membuat akar busuk. Cocok untuk tanaman yang suka lembap seperti kangkung dan bayam, TIDAK untuk kaktus atau sukulen."},{"heading":"Tanah Pasir (Sandy)","body":"Drainase sangat cepat, tidak menyimpan air. Baik untuk kaktus, sukulen, lavender, dan rosemary. Perlu sering disiram dan ditambah kompos agar lebih subur."},{"heading":"Tanah Lempung (Loam)","body":"Kombinasi ideal tanah liat, pasir, dan bahan organik. Drainase baik, menyimpan nutrisi, gembur dan mudah diolah. Cocok untuk hampir semua jenis tanaman. Ini adalah tanah terbaik untuk kebun."},{"heading":"Tanah Gambut (Peat)","body":"Kaya bahan organik, asam, menyimpan air sangat baik. Ideal dicampur untuk anggrek, blueberry, dan tanaman asam. Tidak dianjurkan digunakan murni karena terlalu asam untuk kebanyakan tanaman."}]},{"title":"Media Tanam untuk Pot","icon":"🪴","color":"#166534","sections":[{"heading":"Cocopeat (Serbuk Kelapa)","body":"Ringan, menyerap air baik, ramah lingkungan. Harus dicampur dengan bahan drainase seperti perlite karena bisa terlalu lembap jika dipakai sendiri. Campuran ideal: 50% cocopeat + 30% perlite + 20% kompos."},{"heading":"Sekam Bakar (Arang Sekam)","body":"Membantu drainase dan aerasi akar. pH netral, steril, bebas hama. Tambahkan 20-30% ke media tanam apa pun untuk hasil lebih baik. Sangat dianjurkan untuk tanaman hias indoor."},{"heading":"Perlite","body":"Mineral vulkanik yang membuat media lebih ringan dan meningkatkan drainase secara signifikan. Wajib digunakan untuk kaktus, sukulen, dan tanaman yang sangat rentan busuk akar (rosemary, lavender)."},{"heading":"Kompos & Pupuk Kandang","body":"Sumber nutrisi organik alami. Pupuk kandang harus matang (tidak berbau menyengat) sebelum dipakai. Tambahkan 20-30% ke media tanam untuk memperkaya nutrisi jangka panjang."}]},{"title":"Memahami pH Tanah","icon":"🧪","color":"#6366f1","sections":[{"heading":"Apa itu pH Tanah?","body":"pH adalah tingkat keasaman tanah (skala 1–14). pH 7 = netral. Di bawah 7 = asam. Di atas 7 = basa/alkalis. Kebanyakan tanaman tumbuh optimal di pH 6.0–7.0 (sedikit asam hingga netral)."},{"heading":"Tanaman Asam (pH 4.5–6.0)","body":"Anggrek, blueberry, hydrangea biru, azalea. Gunakan media cocopeat atau tambahkan sulfur untuk menurunkan pH tanah yang terlalu basa."},{"heading":"Tanaman Netral–Basa (pH 6.5–7.5)","body":"Lavender, rosemary, asparagus. Jika tanah terlalu asam, tambahkan kapur dolomit secara perlahan dan merata."},{"heading":"Cara Mengukur pH","body":"Gunakan kertas lakmus atau pH meter tanah (tersedia di toko pertanian mulai Rp 30.000). Ukur sebelum menanam dan setiap 3 bulan sekali untuk memastikan kondisi optimal."}]},{"title":"Pupuk: Jenis & Cara Pakai","icon":"🌿","color":"#0d9488","sections":[{"heading":"NPK — Makronutrien Utama","body":"N (Nitrogen) = pertumbuhan daun hijau. P (Fosfor) = perkembangan akar dan pembungaan. K (Kalium) = ketahanan tanaman dan kualitas buah. Pilih rasio NPK sesuai fase: daun = N tinggi, bunga/buah = P&K tinggi."},{"heading":"Pupuk Cair vs Granul","body":"Pupuk cair bekerja cepat (1-3 hari) namun habis cepat, cocok untuk dorongan pertumbuhan. Pupuk granul/lambat urai bekerja 1-3 bulan, lebih praktis dan hemat, cocok untuk perawatan rutin."},{"heading":"Pupuk Organik","body":"Kompos, pupuk kandang, atau pupuk ikan. Lebih aman, memperbaiki struktur tanah, dan tidak berisiko over-fertilizing. Kelemahannya: nutrisi tidak secepat pupuk kimia."},{"heading":"Aturan Emas Pemupukan","body":"Selalu siram tanaman sebelum memupuk — jangan pupuk tanah kering karena dapat membakar akar. Mulai dengan setengah dosis dari yang tertera di kemasan. Lebih baik kurang dari berlebihan."}]},{"title":"Drainase & Penyiraman","icon":"💧","color":"#2563eb","sections":[{"heading":"Pentingnya Drainase","body":"Pot WAJIB memiliki lubang di bawah. Tanpa drainase, air akan menggenang dan menyebabkan busuk akar — penyebab kematian tanaman no. 1 di Indonesia. Jangan simpan pot di tatakan berisi air genangan."},{"heading":"Kapan Harus Menyiram?","body":"Tes jari: tusukkan jari 2-3 cm ke media tanam. Jika masih lembap, tunda penyiraman. Jika kering, segera siram hingga air keluar dari lubang bawah pot. Lebih baik jarang tapi tepat waktu."},{"heading":"Waktu Terbaik Menyiram","body":"Pagi hari (06:00–09:00) adalah waktu ideal. Air yang menguap siang hari tidak akan menggenang, dan tanaman punya cukup air untuk proses fotosintesis. Hindari menyiram saat terik siang."},{"heading":"Kualitas Air Penyiraman","body":"Air PDAM mengandung klorin yang bisa merusak tanaman sensitif (calathea, anggrek). Endapkan air semalam sebelum digunakan, atau tampung air hujan yang jauh lebih ideal."}]},{"title":"Mengatasi Masalah Umum","icon":"🔍","color":"#dc2626","sections":[{"heading":"Daun Menguning","body":"Penyebab paling umum: overwatering (75% kasus). Kurangi frekuensi siram dan pastikan drainase baik. Penyebab lain: kekurangan nitrogen (pupuk), atau terlalu kurang cahaya. Amati pola daun yang menguning."},{"heading":"Daun Layu Meski Sudah Disiram","body":"Kemungkinan busuk akar akibat overwatering. Keluarkan tanaman dari pot, periksa akar — akar busuk berwarna coklat/hitam dan berbau. Potong bagian busuk, biarkan kering 30 menit, tanam ulang di media segar."},{"heading":"Ujung Daun Coklat/Kering","body":"Penyebab: udara terlalu kering (terutama dekat AC), kekurangan air, atau kelebihan pupuk. Semprot daun dengan air setiap 2-3 hari untuk meningkatkan kelembapan udara di sekitar tanaman."},{"heading":"Hama Umum & Cara Atasi","body":"Kutu daun (aphid): semprot larutan sabun cair 1 sdt + air 500ml. Tungau merah: tingkatkan kelembapan, semprot air ke bawah daun. Kutu putih: usap dengan kapas+alkohol 70%. Selalu periksa bawah daun setiap minggu."}]},{"title":"Hidroponik untuk Pemula","icon":"💧","color":"#0891b2","sections":[{"heading":"Apa itu Hidroponik?","body":"Hidroponik adalah metode bercocok tanam tanpa tanah — tanaman tumbuh dengan akarnya langsung menyerap larutan air yang sudah dicampur nutrisi lengkap. Tanaman mendapatkan semua yang dibutuhkan dari air, bukan dari tanah. Hasilnya: pertumbuhan lebih cepat (2–3x), lebih bersih, dan bisa dilakukan di dalam ruangan atau di balkon sempit sekalipun."},{"heading":"Keunggulan vs Tanam Konvensional","body":"Kelebihan utama hidroponik: (1) Hemat air hingga 90% dibanding tanam tanah karena air bersirkulasi ulang. (2) Pertumbuhan 2–3x lebih cepat karena nutrisi tersedia langsung di akar. (3) Tidak ada hama tanah seperti nematoda atau ulat akar. (4) Bisa dilakukan di lahan sangat terbatas — balkon, atap, atau dalam ruangan. Kekurangannya: butuh investasi awal, listrik untuk pompa, dan pemantauan nutrisi rutin."},{"heading":"Sistem NFT (Nutrient Film Technique)","body":"Air nutrisi mengalir tipis melewati talang miring sepanjang akar tanaman. Cocok untuk: selada, bayam, kangkung, pakcoy, mint. Keunggulan: hemat air, aerasi akar baik. Kelemahan: jika pompa mati, tanaman bisa stres dalam hitungan jam. Investasi awal: Rp 300rb–1,5jt tergantung skala."},{"heading":"Sistem DWC (Deep Water Culture)","body":"Akar tanaman terendam langsung dalam larutan nutrisi yang diaerasi dengan air pump (seperti akuarium). Cocok untuk: tomat, cabai, selada, stroberi. Keunggulan: buffer besar, lebih toleran jika pompa mati sebentar. Kelemahan: butuh wadah besar, aerasi wajib 24 jam. Investasi awal: Rp 200rb–500rb."},{"heading":"Sistem Kratky (Tanpa Pompa)","body":"Metode paling simpel — tidak perlu listrik sama sekali! Tanaman di net pot, akar menggantung di larutan nutrisi dalam wadah tertutup. Celah udara antara permukaan nutrisi dan tutup wadah menjadi \"ruang napas\" akar. Cocok untuk: selada, bayam, mint, kangkung. Sangat ideal untuk pemula karena murah, mudah, dan tanpa risiko mati listrik."},{"heading":"Sistem Wick (Sumbu)","body":"Menggunakan tali kain/sumbu untuk menarik larutan nutrisi dari bak bawah ke media tanam. Pasif, tidak butuh listrik. Cocok untuk: herbal kecil seperti mint, kemangi, oregano. Kelemahan: tidak efisien untuk tanaman besar yang butuh banyak air. Cocok dipakai sebagai media belajar pertama."},{"heading":"Ebb & Flow (Pasang Surut)","body":"Bak nutrisi dipompa masuk ke tray tanam secara berkala (30 menit on/beberapa jam off), lalu dikuras kembali. Cocok untuk: tomat, cabai, semangka, melon. Sangat fleksibel tapi butuh instalasi yang lebih kompleks. Investasi: Rp 500rb–3jt."},{"heading":"Nutrisi & AB Mix: Cara Membuat Larutan","body":"AB Mix adalah pupuk hidroponik dua komponen (A dan B) yang dicampur terpisah karena saling bereaksi jika disatukan pekat. Cara membuat larutan: campurkan Stok A 5ml + Stok B 5ml ke dalam 1 liter air bersih. Ukur EC menggunakan EC meter (target 1.5–2.5 mS/cm tergantung tanaman). Ukur pH dengan pH meter (target 5.5–6.5). Harga AB Mix: Rp 15rb–25rb per 100 gram (cukup untuk 100 liter larutan)."},{"heading":"Tips Memulai untuk Pemula","body":"Mulailah dengan metode Kratky dan tanaman selada atau bayam — keduanya sangat toleran dan cepat panen (25–35 hari). Gunakan botol bekas 1,5 liter atau ember cat bekas sebagai wadah. Beli rockwool kecil (Rp 5rb) sebagai media semai. Investasi awal bisa di bawah Rp 50.000. Setelah berhasil panen pertama, barulah tingkatkan ke sistem yang lebih kompleks."}]},{"title":"Greenhouse Rumahan","icon":"🏡","color":"#16a34a","sections":[{"heading":"Apa itu Greenhouse dan Manfaatnya?","body":"Greenhouse (rumah kaca/plastik) adalah struktur penutup yang menciptakan iklim mikro terkontrol untuk tanaman. Manfaat utama: (1) Melindungi tanaman dari hujan deras, angin kencang, dan hama luar. (2) Memperpanjang musim tanam — bisa panen sepanjang tahun. (3) Meningkatkan suhu di malam hari untuk tanaman subtropis (lavender, stroberi). (4) Mengurangi penggunaan pestisida karena lingkungan lebih terkontrol."},{"heading":"Jenis Greenhouse: Tunnel (Terowongan)","body":"Berbentuk setengah lingkaran seperti terowongan, dibuat dari rangka besi/pipa PVC melengkung yang dilapisi plastik UV. Paling populer untuk skala rumah tangga dan pertanian kecil Indonesia. Kelebihannya: mudah dibuat, murah, dan tahan angin. Ukuran umum: lebar 4–8 meter, panjang sesuai kebutuhan. Biaya per meter persegi: Rp 150rb–400rb."},{"heading":"Jenis Greenhouse: A-Frame & Lean-To","body":"A-Frame berbentuk segitiga seperti huruf A — sangat kuat menahan beban dan ideal di daerah dengan hujan lebat. Lean-to adalah greenhouse yang menempel di dinding rumah/pagar — hemat material karena memakai satu sisi dinding yang sudah ada. Cocok untuk balkon, teras, atau samping rumah. Biaya lean-to lebih hemat 30–40% dari struktur berdiri sendiri."},{"heading":"Jenis Greenhouse: Mini Indoor","body":"Kabinet atau rak tanaman bertingkat yang dilengkapi lampu grow light, kipas sirkulasi udara, dan terkadang sistem irigasi drip. Ideal untuk apartment atau ruangan tanpa taman. Harga mulai dari Rp 300rb untuk rak mini hingga Rp 5jt+ untuk kabinet lengkap dengan grow light full spectrum."},{"heading":"Material Penutup: Perbandingan","body":"Plastik UV (polyethylene): paling murah (Rp 8rb–20rb/m²), ringan, mudah dipasang, umur pakai 3–5 tahun. Polycarbonate: lebih kuat, isolasi termal sangat baik, tahan benturan, umur 10–15 tahun, harga Rp 80rb–250rb/m². Kaca: tampilan premium, tahan lama 20+ tahun, tapi berat, mahal (Rp 150rb–400rb/m²), dan berisiko pecah. Untuk Indonesia, plastik UV atau polycarbonate adalah pilihan terbaik dari segi biaya vs performa."},{"heading":"Komponen Penting: Ventilasi","body":"Ventilasi adalah komponen paling kritis greenhouse di iklim tropis — suhu di dalam bisa mencapai 50°C+ tanpa ventilasi yang baik! Standar minimum: luas ventilasi = 15–25% dari luas lantai. Pasang ventilasi di atap (panas naik ke atas) dan di samping bawah (udara masuk dari bawah). Di daerah panas, tambahkan exhaust fan atau shade net (paranet 50–70%) untuk mengurangi panas."},{"heading":"Komponen Penting: Pencahayaan & Irigasi","body":"Di dalam greenhouse, sinar matahari sudah cukup untuk sebagian besar tanaman jika tidak ada naungan berlebih. Jika perlu tambahan cahaya (untuk indoor atau musim mendung), gunakan LED grow light full spectrum (300–600W untuk area 3–6 m²). Untuk irigasi, sistem drip (tetes) paling efisien — hemat air dan mudah diotomasi dengan timer. Investasi irigasi drip untuk 20 m²: Rp 200rb–500rb."},{"heading":"Tips Memilih Lokasi & Orientasi","body":"Orientasi greenhouse terbaik: panjang greenhouse menghadap Timur–Barat (sumbu memanjang dari Utara ke Selatan) agar sinar matahari masuk optimal sepanjang hari. Pilih lokasi yang mendapat sinar minimal 6 jam/hari, jauh dari pohon besar yang menaungi. Hindari daerah cekungan yang menampung air hujan berlebih. Pastikan ada akses air dan listrik yang mudah."}]},{"title":"Estimasi Biaya Greenhouse","icon":"💰","color":"#7c3aed","sections":[{"heading":"Skala Mini (1–5 m²) — Budget Rp 500rb–2jt","body":"Cocok untuk: balkon, teras sempit, indoor. Contoh ukuran: 1×2 m atau 2×2 m. Rincian biaya: Rangka PVC/besi tipis: Rp 100rb–300rb. Plastik UV/polycarbonate: Rp 50rb–200rb. Rak tanaman: Rp 100rb–300rb. Ventilasi/kipas mini: Rp 50rb–200rb. Total estimasi: Rp 500rb–1,5jt. Tips: Gunakan pipa PVC 1 inch (Rp 30rb/batang) sebagai rangka — murah, ringan, dan mudah dibentuk."},{"heading":"Skala Sedang (10–20 m²) — Budget Rp 3jt–15jt","body":"Cocok untuk: halaman rumah, kebun belakang. Contoh ukuran: 4×5 m atau 4×4 m. Rincian biaya: Rangka besi hollow/pipa galvanis: Rp 1,5jt–4jt. Plastik UV ketebalan 200 mikron: Rp 500rb–1,5jt. Pintu + ventilasi atap: Rp 300rb–800rb. Irigasi drip dasar: Rp 300rb–700rb. Instalasi listrik untuk kipas: Rp 200rb–500rb. Total estimasi: Rp 3jt–8jt untuk konstruksi mandiri, Rp 8jt–15jt jika menggunakan jasa tukang."},{"heading":"Skala Besar (>50 m²) — Budget Rp 20jt–100jt+","body":"Cocok untuk: semi-komersial, usaha pertanian rumahan. Contoh ukuran: 8×8 m atau 6×10 m+. Rincian biaya: Rangka besi galvanis 4 cm: Rp 8jt–25jt. Polycarbonate 6mm: Rp 15jt–40jt (atau plastik UV: Rp 3jt–8jt). Sistem ventilasi otomatis: Rp 2jt–8jt. Irigasi drip + timer: Rp 1jt–5jt. Pondasi/cor: Rp 2jt–10jt. Total estimasi: Rp 20jt–50jt mandiri, Rp 50jt–100jt+ dengan kontraktor dan polycarbonate premium."},{"heading":"Rincian Komponen Biaya: Rangka & Penutup","body":"Pipa PVC 1 inch: Rp 30rb–35rb/batang (4 m). Pipa besi hollow 4×4 cm: Rp 90rb–120rb/batang. Besi hollow 2×4 cm: Rp 50rb–70rb/batang. Plastik UV 200 mikron (lebar 6 m): Rp 15rb–20rb/meter. Polycarbonate 4mm: Rp 65rb–90rb/m². Polycarbonate 6mm: Rp 90rb–130rb/m². Paranet 50% (shading net): Rp 8rb–15rb/m²."},{"heading":"Rincian Komponen Biaya: Ventilasi & Irigasi","body":"Exhaust fan 30 cm: Rp 150rb–250rb/unit. Kipas angin dinding: Rp 100rb–200rb/unit. Thermostat otomatis: Rp 50rb–150rb. Selang irigasi drip 16mm: Rp 3rb–5rb/meter. Emitter (penetes): Rp 500–1.500/buah. Timer digital: Rp 30rb–80rb. Pompa air 50W: Rp 150rb–300rb. Tangki air 200L: Rp 250rb–400rb."},{"heading":"Tips Menghemat Biaya Greenhouse","body":"(1) Mulai dari mini dulu — buat 2×3 m untuk belajar sebelum investasi besar. (2) Gunakan bambu sebagai rangka untuk konstruksi murah di area tidak terlalu luas. (3) Beli plastik UV saat awal tahun — harga lebih stabil dan stok lengkap. (4) Buat sendiri (DIY) — rangka PVC bisa dikerjakan dalam 1–2 hari tanpa tukang. (5) Manfaatkan dinding rumah dengan tipe lean-to untuk menghemat 1 sisi rangka dan penutup. (6) Beli material di toko pertanian/bangunan besar, bukan toko retail kecil — beda harga bisa 30–50%."}]}];

export const SOIL_GUIDE = {
  en: [{"title":"Getting to Know Soil Types","icon":"🌍","color":"#92400e","sections":[{"heading":"Clay Soil","body":"A heavy soil made of fine particles. It holds water and nutrients well, but drains poorly, which can easily lead to root rot. It suits moisture-loving plants like water spinach and amaranth, but is NOT good for cacti or succulents."},{"heading":"Sandy Soil","body":"Drains very quickly and doesn't hold water. Good for cacti, succulents, lavender, and rosemary. It needs frequent watering and added compost to become more fertile."},{"heading":"Loam Soil","body":"The ideal blend of clay, sand, and organic matter. It drains well, retains nutrients, and is loose and easy to work. Suitable for almost every kind of plant. This is the best soil for a garden."},{"heading":"Peat Soil","body":"Rich in organic matter, acidic, and excellent at holding water. Ideal as a mix-in for orchids, blueberries, and acid-loving plants. Not recommended to use on its own because it's too acidic for most plants."}]},{"title":"Potting Media for Containers","icon":"🪴","color":"#166534","sections":[{"heading":"Cocopeat (Coconut Coir)","body":"Lightweight, absorbs water well, and eco-friendly. It must be mixed with a draining material like perlite because it can stay too wet if used on its own. Ideal mix: 50% cocopeat + 30% perlite + 20% compost."},{"heading":"Carbonized Rice Husk (Rice Husk Charcoal)","body":"Helps with drainage and root aeration. Neutral pH, sterile, and pest-free. Add 20-30% to any potting mix for better results. Highly recommended for indoor ornamental plants."},{"heading":"Perlite","body":"A volcanic mineral that makes the mix lighter and significantly improves drainage. A must for cacti, succulents, and plants highly prone to root rot (rosemary, lavender)."},{"heading":"Compost & Manure","body":"A natural source of organic nutrients. Manure must be well-aged (no pungent smell) before use. Add 20-30% to the potting mix to enrich nutrients over the long term."}]},{"title":"Understanding Soil pH","icon":"🧪","color":"#6366f1","sections":[{"heading":"What Is Soil pH?","body":"pH is the acidity level of soil (scale of 1–14). pH 7 = neutral. Below 7 = acidic. Above 7 = alkaline/basic. Most plants grow best at pH 6.0–7.0 (slightly acidic to neutral)."},{"heading":"Acid-Loving Plants (pH 4.5–6.0)","body":"Orchids, blueberries, blue hydrangeas, azaleas. Use a cocopeat-based mix or add sulfur to lower the pH of soil that's too alkaline."},{"heading":"Neutral–Alkaline Plants (pH 6.5–7.5)","body":"Lavender, rosemary, asparagus. If the soil is too acidic, add dolomite lime slowly and evenly."},{"heading":"How to Measure pH","body":"Use litmus paper or a soil pH meter (available at garden supply stores starting from Rp 30,000). Measure before planting and once every 3 months to ensure optimal conditions."}]},{"title":"Fertilizers: Types & How to Use","icon":"🌿","color":"#0d9488","sections":[{"heading":"NPK — The Main Macronutrients","body":"N (Nitrogen) = green leaf growth. P (Phosphorus) = root development and flowering. K (Potassium) = plant resilience and fruit quality. Choose the NPK ratio to match the phase: leaves = high N, flowers/fruit = high P&K."},{"heading":"Liquid vs. Granular Fertilizer","body":"Liquid fertilizer works fast (1-3 days) but is used up quickly, making it good for a growth boost. Granular/slow-release fertilizer works over 1-3 months, is more convenient and economical, and is good for routine care."},{"heading":"Organic Fertilizer","body":"Compost, manure, or fish fertilizer. Safer, improves soil structure, and carries no risk of over-fertilizing. The downside: nutrients aren't released as fast as with chemical fertilizers."},{"heading":"The Golden Rule of Fertilizing","body":"Always water the plant before fertilizing — never fertilize dry soil, as it can burn the roots. Start with half the dose listed on the package. Less is better than too much."}]},{"title":"Drainage & Watering","icon":"💧","color":"#2563eb","sections":[{"heading":"Why Drainage Matters","body":"Pots MUST have a hole at the bottom. Without drainage, water pools and causes root rot — the No. 1 cause of plant death in Indonesia. Don't leave pots sitting in a saucer full of standing water."},{"heading":"When Should You Water?","body":"The finger test: poke your finger 2-3 cm into the potting mix. If it's still moist, hold off on watering. If it's dry, water right away until water flows out the bottom of the pot. Better to water less often but at the right time."},{"heading":"The Best Time to Water","body":"Morning (06:00–09:00) is the ideal time. Water that evaporates during the day won't pool, and the plant has enough water for photosynthesis. Avoid watering in the harsh midday heat."},{"heading":"Watering Water Quality","body":"Tap water contains chlorine that can harm sensitive plants (calathea, orchids). Let the water sit overnight before using it, or collect rainwater, which is far more ideal."}]},{"title":"Solving Common Problems","icon":"🔍","color":"#dc2626","sections":[{"heading":"Yellowing Leaves","body":"The most common cause: overwatering (75% of cases). Cut back on watering frequency and make sure drainage is good. Other causes: nitrogen deficiency (fertilizer), or too little light. Observe the pattern of the yellowing leaves."},{"heading":"Wilting Leaves Despite Watering","body":"Likely root rot caused by overwatering. Remove the plant from the pot and inspect the roots — rotten roots are brown/black and smelly. Cut away the rotten parts, let it dry for 30 minutes, and replant in fresh medium."},{"heading":"Brown/Dry Leaf Tips","body":"Causes: air that's too dry (especially near AC), lack of water, or excess fertilizer. Mist the leaves with water every 2-3 days to raise the humidity around the plant."},{"heading":"Common Pests & How to Deal With Them","body":"Aphids: spray a solution of 1 teaspoon liquid soap + 500ml water. Spider mites: raise humidity and spray water on the undersides of leaves. Mealybugs: wipe with a cotton swab + 70% alcohol. Always check the undersides of leaves every week."}]},{"title":"Hydroponics for Beginners","icon":"💧","color":"#0891b2","sections":[{"heading":"What Is Hydroponics?","body":"Hydroponics is a method of growing plants without soil — plants grow with their roots absorbing a water solution mixed with complete nutrients directly. Plants get everything they need from the water rather than from soil. The result: faster growth (2–3x), cleaner conditions, and the ability to grow indoors or even on a narrow balcony."},{"heading":"Advantages vs. Conventional Growing","body":"Key advantages of hydroponics: (1) Saves up to 90% water compared to soil growing because the water is recirculated. (2) Growth is 2–3x faster because nutrients are available right at the roots. (3) No soil-borne pests like nematodes or root grubs. (4) Can be done in very limited space — a balcony, a rooftop, or indoors. The downsides: it requires an upfront investment, electricity for the pump, and regular nutrient monitoring."},{"heading":"NFT System (Nutrient Film Technique)","body":"Nutrient water flows in a thin film along sloped channels past the plant roots. Suitable for: lettuce, spinach, water spinach, bok choy, mint. Advantages: water-efficient, good root aeration. Downside: if the pump fails, plants can become stressed within hours. Upfront investment: Rp 300k–1.5M depending on scale."},{"heading":"DWC System (Deep Water Culture)","body":"Plant roots are submerged directly in a nutrient solution aerated with an air pump (like an aquarium). Suitable for: tomatoes, chili peppers, lettuce, strawberries. Advantages: a large buffer, more tolerant of a brief pump failure. Downside: it needs a large container and aeration is required 24 hours a day. Upfront investment: Rp 200k–500k."},{"heading":"Kratky System (No Pump)","body":"The simplest method — no electricity needed at all! Plants sit in net pots with their roots hanging in a nutrient solution inside a closed container. The air gap between the nutrient surface and the container lid becomes the roots' \"breathing space.\" Suitable for: lettuce, spinach, mint, water spinach. Ideal for beginners because it's cheap, easy, and carries no risk of power outages."},{"heading":"Wick System","body":"Uses a cloth rope/wick to draw the nutrient solution from the reservoir below up into the growing medium. Passive, needs no electricity. Suitable for: small herbs like mint, lemon basil, oregano. Downside: not efficient for large plants that need a lot of water. A good fit as a first learning setup."},{"heading":"Ebb & Flow (Flood and Drain)","body":"The nutrient reservoir is pumped into the grow tray periodically (30 minutes on / a few hours off), then drained back out. Suitable for: tomatoes, chili peppers, watermelon, melon. Very flexible but requires a more complex setup. Investment: Rp 500k–3M."},{"heading":"Nutrients & AB Mix: How to Make the Solution","body":"AB Mix is a two-part hydroponic fertilizer (A and B) that's mixed separately because they react with each other when combined in concentrated form. To make the solution: mix 5ml of Stock A + 5ml of Stock B into 1 liter of clean water. Measure EC with an EC meter (target 1.5–2.5 mS/cm depending on the plant). Measure pH with a pH meter (target 5.5–6.5). AB Mix price: Rp 15k–25k per 100 grams (enough for 100 liters of solution)."},{"heading":"Tips for Getting Started as a Beginner","body":"Start with the Kratky method and lettuce or spinach — both are very tolerant and quick to harvest (25–35 days). Use a used 1.5-liter bottle or an old paint bucket as a container. Buy small rockwool (Rp 5k) as the seed-starting medium. The upfront investment can be under Rp 50,000. After your first successful harvest, then move up to a more complex system."}]},{"title":"Home Greenhouses","icon":"🏡","color":"#16a34a","sections":[{"heading":"What Is a Greenhouse and What Are Its Benefits?","body":"A greenhouse (glass/plastic house) is an enclosing structure that creates a controlled microclimate for plants. Key benefits: (1) Protects plants from heavy rain, strong winds, and outside pests. (2) Extends the growing season — you can harvest year-round. (3) Raises nighttime temperatures for subtropical plants (lavender, strawberries). (4) Reduces pesticide use because the environment is more controlled."},{"heading":"Greenhouse Types: Tunnel","body":"Shaped like a half-circle tunnel, built from a curved steel/PVC pipe frame covered with UV plastic. The most popular type for households and small farms in Indonesia. Advantages: easy to build, cheap, and wind-resistant. Common size: 4–8 meters wide, length as needed. Cost per square meter: Rp 150k–400k."},{"heading":"Greenhouse Types: A-Frame & Lean-To","body":"An A-Frame is shaped like a triangle, like the letter A — very strong at bearing loads and ideal in areas with heavy rain. A lean-to is a greenhouse that attaches to a house wall/fence — it saves on materials by using one existing wall. Suitable for a balcony, patio, or the side of a house. A lean-to costs 30–40% less than a freestanding structure."},{"heading":"Greenhouse Types: Mini Indoor","body":"A tiered plant cabinet or shelf equipped with grow lights, a circulation fan, and sometimes a drip irrigation system. Ideal for an apartment or a room without a garden. Prices start from Rp 300k for a mini shelf up to Rp 5M+ for a full cabinet with full-spectrum grow lights."},{"heading":"Covering Materials: A Comparison","body":"UV plastic (polyethylene): cheapest (Rp 8k–20k/m²), lightweight, easy to install, 3–5 year lifespan. Polycarbonate: stronger, excellent thermal insulation, impact-resistant, 10–15 year lifespan, priced at Rp 80k–250k/m². Glass: premium look, lasts 20+ years, but heavy, expensive (Rp 150k–400k/m²), and prone to shattering. For Indonesia, UV plastic or polycarbonate is the best choice in terms of cost vs. performance."},{"heading":"Key Component: Ventilation","body":"Ventilation is the most critical greenhouse component in a tropical climate — the inside temperature can reach 50°C+ without good ventilation! Minimum standard: ventilation area = 15–25% of the floor area. Install vents in the roof (heat rises) and along the lower sides (air enters from below). In hot areas, add an exhaust fan or shade net (50–70% shade cloth) to reduce heat."},{"heading":"Key Component: Lighting & Irrigation","body":"Inside a greenhouse, sunlight is enough for most plants if there isn't excessive shade. If extra light is needed (for indoor setups or cloudy seasons), use a full-spectrum LED grow light (300–600W for an area of 3–6 m²). For irrigation, a drip system is the most efficient — it saves water and is easy to automate with a timer. Drip irrigation investment for 20 m²: Rp 200k–500k."},{"heading":"Tips for Choosing Location & Orientation","body":"The best greenhouse orientation: the greenhouse's length faces East–West (the long axis running North to South) so sunlight enters optimally throughout the day. Choose a spot that gets at least 6 hours of sun per day, away from large shading trees. Avoid low-lying areas that collect excess rainwater. Make sure there's easy access to water and electricity."}]},{"title":"Greenhouse Cost Estimates","icon":"💰","color":"#7c3aed","sections":[{"heading":"Mini Scale (1–5 m²) — Budget Rp 500k–2M","body":"Suitable for: a balcony, a narrow patio, indoors. Example size: 1×2 m or 2×2 m. Cost breakdown: PVC/thin steel frame: Rp 100k–300k. UV plastic/polycarbonate: Rp 50k–200k. Plant shelf: Rp 100k–300k. Mini vent/fan: Rp 50k–200k. Estimated total: Rp 500k–1.5M. Tip: Use 1-inch PVC pipe (Rp 30k/length) as the frame — cheap, lightweight, and easy to shape."},{"heading":"Medium Scale (10–20 m²) — Budget Rp 3M–15M","body":"Suitable for: a home yard, a backyard garden. Example size: 4×5 m or 4×4 m. Cost breakdown: Hollow steel/galvanized pipe frame: Rp 1.5M–4M. 200-micron UV plastic: Rp 500k–1.5M. Door + roof vent: Rp 300k–800k. Basic drip irrigation: Rp 300k–700k. Electrical installation for fans: Rp 200k–500k. Estimated total: Rp 3M–8M for a DIY build, Rp 8M–15M if using a hired builder."},{"heading":"Large Scale (>50 m²) — Budget Rp 20M–100M+","body":"Suitable for: semi-commercial use, a home farming business. Example size: 8×8 m or 6×10 m+. Cost breakdown: 4 cm galvanized steel frame: Rp 8M–25M. 6mm polycarbonate: Rp 15M–40M (or UV plastic: Rp 3M–8M). Automatic ventilation system: Rp 2M–8M. Drip irrigation + timer: Rp 1M–5M. Foundation/concrete: Rp 2M–10M. Estimated total: Rp 20M–50M for DIY, Rp 50M–100M+ with a contractor and premium polycarbonate."},{"heading":"Cost Component Breakdown: Frame & Covering","body":"1-inch PVC pipe: Rp 30k–35k/length (4 m). 4×4 cm hollow steel pipe: Rp 90k–120k/length. 2×4 cm hollow steel: Rp 50k–70k/length. 200-micron UV plastic (6 m wide): Rp 15k–20k/meter. 4mm polycarbonate: Rp 65k–90k/m². 6mm polycarbonate: Rp 90k–130k/m². 50% shade cloth (shading net): Rp 8k–15k/m²."},{"heading":"Cost Component Breakdown: Ventilation & Irrigation","body":"30 cm exhaust fan: Rp 150k–250k/unit. Wall-mounted fan: Rp 100k–200k/unit. Automatic thermostat: Rp 50k–150k. 16mm drip irrigation hose: Rp 3k–5k/meter. Emitters (drippers): Rp 500–1,500 each. Digital timer: Rp 30k–80k. 50W water pump: Rp 150k–300k. 200L water tank: Rp 250k–400k."},{"heading":"Tips for Saving on Greenhouse Costs","body":"(1) Start mini first — build a 2×3 m one to learn before investing big. (2) Use bamboo as the frame for a cheap build in areas that aren't too large. (3) Buy UV plastic at the start of the year — prices are more stable and stock is fuller. (4) Build it yourself (DIY) — a PVC frame can be done in 1–2 days without a builder. (5) Use a house wall with the lean-to type to save one side of the frame and covering. (6) Buy materials at large garden/building supply stores rather than small retail shops — the price difference can be 30–50%."}]}],
  id: SOIL_GUIDE_ID,
};
