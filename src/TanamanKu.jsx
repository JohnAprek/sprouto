import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import { 
  Home as HomeIcon, BookOpen, Sprout, Heart, Bot,
  Search, User, ArrowLeft, Moon, Sun, Camera, Send, Calendar, Bell, CheckSquare, Square,
  Droplets, Sun as SunIcon, Thermometer, Info, Activity, Star
} from 'lucide-react';
import { addDays, format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

import plantData from './data/plants.json';

// --- Custom Hook LocalStorage ---
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };
  return [storedValue, setValue];
}

const AppContext = React.createContext();

const EMOJI_MAP = {
  'hias-1': '🌿', 'hias-2': '🌺', 'hias-3': '🌵', 'hias-4': '🌸', 'hias-5': '🌳',
  'sayur-1': '🥬', 'sayur-2': '🌱', 'sayur-3': '🍅',
  'obat-1': '🌼', 'obat-2': '🌿',
  'herbal-1': '🪴', 'herbal-2': '🌱',
  'aroma-1': '🌿', 'aroma-2': '💜'
};

const ENG_MAP = {
  'hias-1': 'monstera', 'hias-2': 'aglaonema', 'hias-3': 'sansevieria', 'hias-4': 'orchid', 'hias-5': 'bonsai',
  'sayur-1': 'spinach', 'sayur-2': 'water-spinach', 'sayur-3': 'cherry-tomato',
  'obat-1': 'herb', 'obat-2': 'andrographis',
  'herbal-1': 'ginger', 'herbal-2': 'aloe-vera',
  'aroma-1': 'rosemary', 'aroma-2': 'lavender'
};

// --- Main App Wrapper ---
export default function TanamanKu() {
  const [isDarkMode, setIsDarkMode] = useLocalStorage('tanamanku_theme', false);
  const [favorites, setFavorites] = useLocalStorage('tanamanku_favorites', []);
  const [profile, setProfile] = useLocalStorage('tanamanku_profile', { name: 'Pecinta Tanaman', photo: null });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(f => f !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const contextValue = {
    isDarkMode, setIsDarkMode,
    favorites, toggleFavorite,
    profile, setProfile
  };

  return (
    <AppContext.Provider value={contextValue}>
      <Router basename={import.meta.env.BASE_URL}>
        <div className="app-container">
          <Header />
          <div className="animate-fade">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/ensiklopedia" element={<Encyclopedia />} />
              <Route path="/tanaman/:id" element={<PlantDetail />} />
              <Route path="/pemula" element={<BeginnerGuide />} />
              <Route path="/favorit" element={<Favorites />} />
              <Route path="/chat" element={<AIChat />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </div>
          <BottomNav />
        </div>
      </Router>
    </AppContext.Provider>
  );
}

// --- Header ---
function Header() {
  const { isDarkMode, setIsDarkMode } = React.useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const showBack = !['/', '/ensiklopedia', '/pemula', '/favorit', '/chat'].includes(location.pathname);

  return (
    <header className="app-header">
      <div className="header-title-row">
        {showBack ? (
          <button className="icon-btn pill" onClick={() => navigate(-1)}><ArrowLeft size={20} /></button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ backgroundColor: 'white', color: 'var(--primary)', padding: '6px', borderRadius: '12px' }}>
              <Sprout size={24} />
            </div>
            <div>
              <h1>TanamanKu</h1>
              <span className="header-subtitle">Panduan Tanaman Indonesia</span>
            </div>
          </div>
        )}
      </div>
      <div className="header-title-row">
        <button className="icon-btn pill" onClick={() => setIsDarkMode(!isDarkMode)}>
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        {!showBack && (
          <button className="icon-btn pill" onClick={() => navigate('/profile')}>
            <User size={18} />
          </button>
        )}
      </div>
    </header>
  );
}

// --- Bottom Navigation ---
function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: <HomeIcon size={22} />, label: 'Beranda' },
    { path: '/ensiklopedia', icon: <BookOpen size={22} />, label: 'Katalog' },
    { path: '/pemula', icon: <Sprout size={22} />, label: 'Panduan' },
    { path: '/favorit', icon: <Heart size={22} />, label: 'Favorit' },
    { path: '/chat', icon: <Bot size={22} />, label: 'AI Chat' }
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map(item => (
        <button 
          key={item.path}
          className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          onClick={() => navigate(item.path)}
        >
          {item.icon}
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

// --- 1. Beranda ---
function Home() {
  const navigate = useNavigate();
  const { profile, favorites } = React.useContext(AppContext);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Pagi' : hour < 15 ? 'Siang' : hour < 18 ? 'Sore' : 'Malam';
  
  const [progress] = useLocalStorage('tanamanku_guide_tasks', []);
  const guidePct = Math.round((progress.length / 26) * 100);

  return (
    <main className="main-content animate-fade-up">
      <div className="hero-card">
        <h2 style={{ fontSize: '1.4rem', fontWeight: '700' }}>Selamat {greeting},</h2>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '300', marginBottom: '8px' }}>{profile.name.split(' ')[0]}!</h2>
        <p style={{ opacity: 0.9, fontSize: '0.85rem', maxWidth: '80%' }}>
          Ayo rawat tanamanmu hari ini dan capai level selanjutnya.
        </p>
        <span className="hero-emoji">🌿</span>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-val">{favorites.length}</div>
          <div className="stat-lbl">Favorit</div>
        </div>
        <div className="stat-card" onClick={() => navigate('/pemula')} style={{ cursor: 'pointer' }}>
          <div className="stat-val">{guidePct}%</div>
          <div className="stat-lbl">Progress</div>
        </div>
        <div className="stat-card" onClick={() => navigate('/ensiklopedia')} style={{ cursor: 'pointer' }}>
          <div className="stat-val">{plantData.length}</div>
          <div className="stat-lbl">Katalog</div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 style={{ fontSize: '1.1rem' }}>Tanaman Populer</h3>
        <button style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '600', fontSize: '0.8rem', cursor: 'pointer' }} onClick={() => navigate('/ensiklopedia')}>Lihat Semua</button>
      </div>
      
      <div className="plant-grid" style={{ marginBottom: '24px' }}>
        {plantData.slice(0, 2).map(plant => (
          <PlantCard key={plant.id} plant={plant} onClick={() => navigate(`/tanaman/${plant.id}`)} />
        ))}
      </div>

      <div style={{ backgroundColor: '#fef3c7', borderRadius: '16px', padding: '16px', display: 'flex', gap: '16px', alignItems: 'center', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ backgroundColor: '#f59e0b', color: 'white', padding: '12px', borderRadius: '50%' }}>
          <SunIcon size={24} />
        </div>
        <div>
          <h4 style={{ color: '#92400e', fontSize: '0.95rem', fontWeight: '700', marginBottom: '4px' }}>Tips Hari Ini</h4>
          <p style={{ color: '#b45309', fontSize: '0.8rem', lineHeight: 1.4 }}>Siram tanaman pagi hari agar air tidak menggenang terlalu lama saat suhu mulai panas siang nanti.</p>
        </div>
      </div>
    </main>
  );
}

// --- 2. Ensiklopedia ---
function Encyclopedia() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [activeDiff, setActiveDiff] = useState('Semua');

  const categories = [
    { id: 'Semua', icon: '🌿' },
    { id: 'Tanaman Hias', icon: '🏠' },
    { id: 'Obat', icon: '💊' },
    { id: 'Herbal', icon: '🌾' },
    { id: 'Sayuran', icon: '🥗' },
    { id: 'Aromaterapi', icon: '💜' }
  ];
  
  const difficulties = ['Semua', 'mudah', 'sedang', 'sulit'];

  const filtered = plantData.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.scientificName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = activeCategory === 'Semua' || p.category === activeCategory;
    const matchDiff = activeDiff === 'Semua' || p.difficulty === activeDiff;
    return matchSearch && matchCat && matchDiff;
  });

  return (
    <main className="main-content animate-fade-up">
      <div className="search-wrapper">
        <Search size={20} className="search-icon" />
        <input 
          type="text" 
          placeholder="Cari nama tanaman atau latin..." 
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="filter-scroll">
        {categories.map(c => (
          <button key={c.id} className={`filter-chip ${activeCategory === c.id ? 'active' : ''}`} onClick={() => setActiveCategory(c.id)}>
            <span>{c.icon}</span> {c.id}
          </button>
        ))}
      </div>
      <div className="filter-scroll" style={{ marginBottom: '8px' }}>
        {difficulties.map(d => (
          <button key={d} className={`filter-chip ${activeDiff === d ? 'active' : ''}`} onClick={() => setActiveDiff(d)} style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '8px' }}>
            {d === 'Semua' ? 'Semua Level' : d.charAt(0).toUpperCase() + d.slice(1)}
          </button>
        ))}
      </div>

      <div className="plant-grid">
        {filtered.length > 0 ? (
          filtered.map(plant => <PlantCard key={plant.id} plant={plant} onClick={() => navigate(`/tanaman/${plant.id}`)} />)
        ) : (
          <p style={{ gridColumn: '1 / -1', textAlign: 'center', marginTop: '40px', color: 'var(--text-muted)' }}>Tidak ada tanaman ditemukan.</p>
        )}
      </div>
    </main>
  );
}

const CATEGORY_GRADIENT = {
  'Tanaman Hias': 'linear-gradient(160deg, #1a472a, #2d6a4f)',
  'Sayuran':       'linear-gradient(160deg, #1a3a1a, #2d5a1a)',
  'Obat':          'linear-gradient(160deg, #1a3a2a, #1a5c3a)',
  'Herbal':        'linear-gradient(160deg, #2d4a1a, #3d6b2a)',
  'Aromaterapi':   'linear-gradient(160deg, #3a1a4a, #5c2a6b)',
};

function PlantCard({ plant, onClick }) {
  const { favorites, toggleFavorite } = React.useContext(AppContext);
  const isFav = favorites.includes(plant.id);
  const gradient = CATEGORY_GRADIENT[plant.category] || CATEGORY_GRADIENT['Tanaman Hias'];
  const emoji = EMOJI_MAP[plant.id] || '🌿';

  return (
    <div className="plant-card-v2" onClick={onClick}>
      {/* Unified background: gradient + big emoji */}
      <div className="plant-emoji-bg" style={{ background: gradient }}>
        <span style={{ fontSize: '3.5rem', userSelect: 'none', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>{emoji}</span>
      </div>

      {/* Gradient overlay with text */}
      <div
        className="img-overlay"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 70%, transparent 100%)' }}
      >
        <h3 className="card-title">{plant.name}</h3>
        <p className="card-subtitle">{plant.scientificName}</p>
        <div className="card-watering">
          <Droplets size={12} /> {plant.schedules.watering}x seminggu
        </div>
      </div>

      {/* Badge top-left */}
      <div className="card-badge-top-left">
        <span className={`badge ${plant.difficulty}`}>{plant.difficulty}</span>
      </div>

      {/* Heart top-right */}
      <button
        className="card-heart-top-right"
        onClick={(e) => { e.stopPropagation(); toggleFavorite(plant.id); }}
      >
        <Heart size={16} className={`heart-icon ${isFav ? 'active' : ''}`} color="white" />
      </button>
    </div>
  );
}

// --- 3. Plant Detail ---
function PlantDetail() {
  const { id } = useParams();
  const { favorites, toggleFavorite } = React.useContext(AppContext);
  const navigate = useNavigate();
  const plant = plantData.find(p => p.id === id);

  if (!plant) return <div className="main-content">Tanaman tidak ditemukan</div>;

  const isFav = favorites.includes(id);
  const engName = ENG_MAP[plant.id] || 'plant';

  const handleReminder = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('TanamanKu', {
            body: `Pengingat diaktifkan untuk ${plant.name}.`,
            icon: '/pwa-192x192.png'
          });
        }
      });
    }
  };

  return (
    <div className="animate-fade-up" style={{ paddingBottom: '40px' }}>
      <div className="detail-hero">
        <img 
          src={`https://source.unsplash.com/800x600/?${engName},nature`} 
          alt={plant.name}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <div style={{ display: 'none', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', fontSize: '80px', background: 'var(--primary-dark)' }}>
          {EMOJI_MAP[plant.id] || '🌿'}
        </div>
        
        <button className="icon-btn pill detail-back" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <button className="icon-btn pill detail-fav" onClick={() => toggleFavorite(id)}>
          <Heart size={20} fill={isFav ? '#ef4444' : 'none'} color={isFav ? '#ef4444' : 'white'} />
        </button>
      </div>
      
      <main className="detail-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>{plant.category}</span>
          <span className={`badge ${plant.difficulty}`}>{plant.difficulty}</span>
        </div>
        
        <h2 style={{ fontSize: '2rem', fontWeight: '700', lineHeight: 1.2 }}>{plant.name}</h2>
        <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', marginBottom: '16px' }}>{plant.scientificName}</p>
        <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--text-main)', marginBottom: '24px' }}>{plant.description}</p>

        <div className="info-grid-2x2">
          <div className="info-box">
            <Droplets size={24} color="var(--accent)" />
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Penyiraman</p>
              <p style={{ fontSize: '0.9rem', fontWeight: '700' }}>{plant.schedules.watering} hari sekali</p>
            </div>
          </div>
          <div className="info-box">
            <SunIcon size={24} color="#f59e0b" />
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cahaya</p>
              <p style={{ fontSize: '0.9rem', fontWeight: '700' }}>{plant.careDetails.sunlight.split(' ')[0]}</p>
            </div>
          </div>
          <div className="info-box">
            <Activity size={24} color="var(--primary)" />
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Kesulitan</p>
              <p style={{ fontSize: '0.9rem', fontWeight: '700', textTransform: 'capitalize' }}>{plant.difficulty}</p>
            </div>
          </div>
          <div className="info-box">
            <Calendar size={24} color="#6366f1" />
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pupuk</p>
              <p style={{ fontSize: '0.9rem', fontWeight: '700' }}>{plant.schedules.fertilizer} hari sekali</p>
            </div>
          </div>
        </div>

        <button className="btn-primary" style={{ marginBottom: '32px' }} onClick={handleReminder}>
          <Bell size={20} /> Aktifkan Pengingat Siram
        </button>

        <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Tips Perawatan</h3>
        <ul className="tips-list">
          <li><strong>Penyiraman:</strong> {plant.careDetails.watering}</li>
          <li><strong>Cahaya:</strong> {plant.careDetails.sunlight}</li>
          <li><strong>Pemupukan:</strong> {plant.careDetails.fertilizer}</li>
          <li><strong>Pemangkasan:</strong> {plant.careDetails.pruning}</li>
        </ul>

        <div style={{ marginTop: '32px' }}>
          <button className="btn-primary" onClick={() => navigate('/chat')} style={{ background: 'var(--surface)', color: 'var(--primary)', border: '2px solid var(--primary)' }}>
            <Bot size={20} /> Tanya AI Tentang {plant.name}
          </button>
        </div>
      </main>
    </div>
  );
}

// --- 4. Panduan Pemula ---
const guideData = [
  {
    title: "Hari 0 - Persiapan", icon: "📦", color: "#6366f1",
    tasks: [
      { id: "h0-1", text: "Pilih tanaman yang tepat untuk pemula" },
      { id: "h0-2", text: "Siapkan pot dengan lubang drainase" },
      { id: "h0-3", text: "Pilih media tanam (campuran tanah + sekam + cocopeat)" },
      { id: "h0-4", text: "Tentukan lokasi berdasarkan kebutuhan cahaya" },
      { id: "h0-5", text: "Siapkan alat dasar (semprotan, sekop kecil)" }
    ]
  },
  {
    title: "Hari 1-3 - Fase Adaptasi", icon: "🌱", color: "#f59e0b",
    tasks: [
      { id: "h1-1", text: "Jangan langsung disiram banyak (cukup lembab)" },
      { id: "h1-2", text: "Taruh di tempat teduh dulu (cahaya tidak langsung)" },
      { id: "h1-3", text: "Jangan panik kalau ada daun layu (transplant shock normal)" },
      { id: "h1-4", text: "Cek tanah sebelum siram: tusuk jari 2-3cm" }
    ]
  },
  {
    title: "Hari 4-7 - Membangun Rutinitas", icon: "⏳", color: "#8b5cf6",
    tasks: [
      { id: "h4-1", text: "Mulai jadwal penyiraman tetap (cek pagi hari)" },
      { id: "h4-2", text: "Perhatikan tanda pertumbuhan pertama" },
      { id: "h4-3", text: "Pindahkan ke lokasi permanen" },
      { id: "h4-4", text: "Foto tanaman sebagai baseline hari ke-7" }
    ]
  },
  {
    title: "Minggu 2-4 - Perkembangan Awal", icon: "🌿", color: "#10b981",
    tasks: [
      { id: "m2-1", text: "Pupuk pertama dosis SETENGAH dari takaran kemasan" },
      { id: "m2-2", text: "Cek kondisi akar (keluar dari lubang = butuh repot)" },
      { id: "m2-3", text: "Bersihkan daun dari debu untuk fotosintesis optimal" },
      { id: "m2-4", text: "Amati hama di bagian bawah daun" }
    ]
  },
  {
    title: "Bulan 1-3 - Perawatan Rutin", icon: "✂️", color: "#ec4899",
    tasks: [
      { id: "b1-1", text: "Pupuk rutin sebulan sekali" },
      { id: "b1-2", text: "Repotting jika diperlukan (pot 2-3cm lebih besar)" },
      { id: "b1-3", text: "Pangkas daun mati/kuning dengan gunting bersih" },
      { id: "b1-4", text: "Evaluasi lokasi: daun pucat = kurang cahaya" }
    ]
  },
  {
    title: "Bulan 3+ - Berkembang & Berbagi", icon: "🌟", color: "#f43f5e",
    tasks: [
      { id: "b3-1", text: "Coba propagasi (stek batang/daun)" },
      { id: "b3-2", text: "Berbagi stek dengan teman" },
      { id: "b3-3", text: "Naik level ke tanaman 'sedang'" },
      { id: "b3-4", text: "Dokumentasi: bandingkan foto hari 1 vs sekarang" }
    ]
  }
];

function BeginnerGuide() {
  const [checkedTasks, setCheckedTasks] = useLocalStorage('tanamanku_guide_tasks', []);

  const totalTasks = guideData.reduce((acc, curr) => acc + curr.tasks.length, 0);
  const percentage = Math.round((checkedTasks.length / totalTasks) * 100) || 0;

  const toggleTask = (taskId) => {
    if (checkedTasks.includes(taskId)) setCheckedTasks(checkedTasks.filter(id => id !== taskId));
    else setCheckedTasks([...checkedTasks, taskId]);
  };

  return (
    <main className="main-content animate-fade-up">
      <div style={{ backgroundColor: 'var(--surface)', padding: '24px', borderRadius: '24px', boxShadow: 'var(--shadow-sm)', marginBottom: '32px', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '8px' }}>Perjalanan Master</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Selesaikan panduan untuk naik level.</p>
        
        <div style={{ height: '12px', background: 'var(--bg-color)', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
          <div style={{ height: '100%', background: 'linear-gradient(90deg, var(--accent), var(--primary))', width: `${percentage}%`, transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>
        </div>
        <p style={{ fontSize: '0.9rem', marginTop: '8px', fontWeight: '700', color: 'var(--primary)' }}>{percentage}% Selesai</p>
      </div>

      <div style={{ paddingLeft: '8px' }}>
        {guideData.map((section, idx) => {
          const sectionDone = section.tasks.every(t => checkedTasks.includes(t.id));
          return (
            <div key={idx} className="timeline-item">
              <div className="timeline-icon-wrapper" style={{ borderColor: sectionDone ? 'var(--primary)' : 'var(--border-color)', backgroundColor: sectionDone ? 'var(--primary-light)' : 'var(--surface)' }}>
                {section.icon}
              </div>
              <div style={{ flex: 1, paddingBottom: '20px' }}>
                <h4 style={{ fontSize: '1.15rem', marginBottom: '12px', fontWeight: '700', color: section.color }}>{section.title}</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {section.tasks.map(task => {
                    const isDone = checkedTasks.includes(task.id);
                    return (
                      <div 
                        key={task.id} 
                        onClick={() => toggleTask(task.id)}
                        className={`guide-task ${isDone ? 'done' : ''}`}
                      >
                        <div style={{ color: isDone ? 'var(--primary)' : 'var(--text-muted)' }}>
                          {isDone ? <CheckSquare size={22} /> : <Square size={22} />}
                        </div>
                        <span style={{ fontSize: '0.9rem', fontWeight: '500', textDecoration: isDone ? 'line-through' : 'none', color: isDone ? 'var(--text-muted)' : 'var(--text-main)' }}>
                          {task.text}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}

// --- 5. Favorites ---
function Favorites() {
  const { favorites } = React.useContext(AppContext);
  const navigate = useNavigate();
  const favPlants = plantData.filter(p => favorites.includes(p.id));

  return (
    <main className="main-content animate-fade-up">
      <h2 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '20px' }}>Koleksi Favorit</h2>
      {favPlants.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '60px' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: 'var(--shadow-sm)' }}>
            <Heart size={36} color="var(--border-color)" />
          </div>
          <p style={{ fontSize: '1rem', fontWeight: '500' }}>Belum ada tanaman favorit</p>
          <p style={{ fontSize: '0.85rem', marginTop: '8px' }}>Simpan tanaman yang Anda suka untuk melihatnya di sini.</p>
        </div>
      ) : (
        <div className="plant-grid">
          {favPlants.map(plant => (
            <PlantCard key={plant.id} plant={plant} onClick={() => navigate(`/tanaman/${plant.id}`)} />
          ))}
        </div>
      )}
    </main>
  );
}

// --- 6. AI Chatbot ---
function AIChat() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Halo! Saya ahli tanaman berbahasa Indonesia. Tanyakan soal perawatan atau upload foto tanaman untuk saya identifikasi.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const proxyUrl = import.meta.env.VITE_AI_PROXY_URL;

  const sendMessage = async (textContent, base64Image = null) => {
    if (!textContent && !base64Image) return;
    
    const newUserMsg = { role: 'user', content: textContent || 'Identifikasi tanaman ini.' };
    if (base64Image) newUserMsg.image = base64Image;

    const newMessages = [...messages, newUserMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const contentBlock = [];
      if (base64Image) {
        const base64Data = base64Image.split(',')[1];
        const mediaType = base64Image.split(';')[0].split(':')[1];
        contentBlock.push({ type: 'image', source: { type: 'base64', media_type: mediaType, data: base64Data } });
      }
      if (textContent) contentBlock.push({ type: 'text', text: textContent });
      if (!textContent && base64Image) contentBlock.push({ type: 'text', text: 'Tolong identifikasi tanaman ini beserta detail perawatannya secara singkat dan praktis.' });

      const apiMessages = newMessages.map(m => {
        if (m.role === 'assistant') return { role: 'assistant', content: m.content };
        if (m.image && m === newUserMsg) return { role: 'user', content: contentBlock };
        return { role: 'user', content: m.content };
      }).filter(m => m.content);

      let assistantText = '';

      if (proxyUrl) {
        const response = await fetch(proxyUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1000,
            system: "Kamu ahli tanaman berbahasa Indonesia, spesialisasi perawatan tanaman rumahan, jawab singkat dan praktis.",
            messages: apiMessages
          })
        });
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        assistantText = data.content[0].text;
      } else {
        assistantText = "Maaf, Proxy AI belum dikonfigurasi. Silakan deploy worker di Cloudflare.";
      }

      setMessages([...newMessages, { role: 'assistant', content: assistantText }]);
    } catch (error) {
      setMessages([...newMessages, { role: 'assistant', content: 'Error API: ' + error.message }]);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => sendMessage(input, reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <main className="main-content animate-fade-up" style={{ padding: 0 }}>
      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((m, idx) => (
            <div key={idx} className={`chat-bubble ${m.role}`}>
              {m.image && <img src={m.image} alt="upload" style={{ width: '100%', borderRadius: '12px', marginBottom: '12px' }} />}
              <p style={{ whiteSpace: 'pre-wrap' }}>{m.content}</p>
            </div>
          ))}
          {loading && <div className="chat-bubble assistant"><p>Sedang berpikir...</p></div>}
        </div>
        
        <div className="chat-input-area">
          <input type="file" accept="image/*" style={{ display: 'none' }} ref={fileInputRef} onChange={handleImageUpload} />
          <button className="icon-btn pill" style={{ backgroundColor: 'var(--surface)', color: 'var(--primary)', boxShadow: 'var(--shadow-sm)' }} onClick={() => fileInputRef.current.click()}>
            <Camera size={24} />
          </button>
          <input 
            type="text" 
            style={{ flex: 1, padding: '12px 16px', borderRadius: '50px', border: '1px solid var(--border-color)', outline: 'none', background: 'var(--surface)', color: 'var(--text-main)' }} 
            placeholder="Tanya AI..." 
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && sendMessage(input)}
          />
          <button className="icon-btn pill" style={{ background: 'var(--primary)', color: 'white' }} onClick={() => sendMessage(input)} disabled={loading || (!input.trim() && !fileInputRef.current?.value)}>
            <Send size={20} />
          </button>
        </div>
      </div>
    </main>
  );
}

// --- 7. User Profile ---
function Profile() {
  const { profile, setProfile, favorites } = React.useContext(AppContext);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(profile.name);

  const saveProfile = () => {
    setProfile({ ...profile, name });
    setIsEditing(false);
  };

  return (
    <main className="main-content animate-fade-up">
      <div style={{ backgroundColor: 'var(--surface)', borderRadius: '24px', padding: '40px 20px', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-dark), var(--primary))', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '3rem', fontWeight: '700', boxShadow: 'var(--shadow-md)' }}>
          {profile.name.charAt(0).toUpperCase()}
        </div>
        
        {isEditing ? (
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '16px' }}>
            <input type="text" style={{ padding: '10px 16px', borderRadius: '50px', border: '1px solid var(--border-color)' }} value={name} onChange={e => setName(e.target.value)} />
            <button className="btn-primary" style={{ width: 'auto' }} onClick={saveProfile}>Simpan</button>
          </div>
        ) : (
          <h2 style={{ fontSize: '1.6rem', fontWeight: '700', marginBottom: '4px' }}>
            {profile.name} 
            <button style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '0.9rem', marginLeft: '8px' }} onClick={() => setIsEditing(true)}>Edit</button>
          </h2>
        )}
        
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Pecinta Tanaman Pemula</p>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginTop: '32px' }}>
          <div>
            <h3 style={{ fontSize: '1.8rem', color: 'var(--primary)', fontWeight: '700' }}>{favorites.length}</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>Koleksi</p>
          </div>
          <div>
            <h3 style={{ fontSize: '1.8rem', color: 'var(--primary)', fontWeight: '700' }}>
              <Star size={24} fill="var(--primary)" />
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>Level 1</p>
          </div>
        </div>
      </div>
    </main>
  );
}
