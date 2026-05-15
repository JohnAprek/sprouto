import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import { 
  Home as HomeIcon, BookOpen, Sprout, Heart,
  Search, User, ArrowLeft, Moon, Sun, Calendar, Bell, CheckSquare, Square,
  Droplets, Sun as SunIcon, Thermometer, Info, Activity, Star
} from 'lucide-react';
import { addDays, format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import Onboarding from './components/Onboarding';
import { SkeletonGrid } from './components/Skeleton';

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
  'hias-6': '🍃', 'hias-7': '💚', 'hias-8': '🪴', 'hias-9': '🌵', 'hias-10': '🌺',
  'hias-11': '🌸', 'hias-12': '🌺', 'hias-13': '🍃', 'hias-14': '🌿', 'hias-15': '🦜',
  'sayur-1': '🥬', 'sayur-2': '🌱', 'sayur-3': '🍅', 'sayur-4': '🌶️', 'sayur-5': '🥗', 'sayur-6': '🥦',
  'sayur-7': '🍆', 'sayur-8': '🥒', 'sayur-9': '🥕', 'sayur-10': '🌿',
  'sayur-11': '🥬', 'sayur-12': '🫑',
  'obat-1': '🌼', 'obat-2': '🌿', 'obat-3': '🍃', 'obat-4': '🌱', 'obat-5': '🫐',
  'obat-6': '🌰', 'obat-7': '🌿', 'obat-8': '🌵', 'obat-9': '🌿', 'obat-10': '🖤',
  'herbal-1': '🪴', 'herbal-2': '🌱', 'herbal-3': '💛', 'herbal-4': '🌿', 'herbal-5': '🌰',
  'herbal-6': '🌿', 'herbal-7': '🌿', 'herbal-8': '🧅', 'herbal-9': '🪵', 'herbal-10': '🌾',
  'aroma-1': '🌿', 'aroma-2': '💜', 'aroma-3': '🍃', 'aroma-4': '💚',
  'aroma-5': '🌿', 'aroma-6': '🌸', 'aroma-7': '🍋',
  'buah-1': '🍓', 'buah-2': '🍌', 'buah-3': '🍊', 'buah-4': '🍌',
  'buah-5': '🍋', 'buah-6': '🍉', 'buah-7': '🍇',
  'buah-8': '🍅', 'buah-9': '🍈', 'buah-10': '🫐', 'buah-11': '⭐', 'buah-12': '🍎',
  'buah-13': '🌸', 'buah-14': '🌴', 'buah-15': '🥑', 'buah-16': '🌴',
};

const ENG_MAP = {
  'hias-1': 'monstera', 'hias-2': 'aglaonema', 'hias-3': 'sansevieria', 'hias-4': 'orchid', 'hias-5': 'bonsai',
  'hias-6': 'philodendron', 'hias-7': 'pothos', 'hias-8': 'zz-plant', 'hias-9': 'cactus', 'hias-10': 'calathea',
  'sayur-1': 'spinach', 'sayur-2': 'kangkung', 'sayur-3': 'cherry-tomato', 'sayur-4': 'chili', 'sayur-5': 'lettuce', 'sayur-6': 'mustard-green',
  'sayur-7': 'eggplant', 'sayur-8': 'cucumber', 'sayur-9': 'carrot', 'sayur-10': 'green-bean',
  'obat-1': 'herb-flower', 'obat-2': 'andrographis', 'obat-3': 'betel-leaf', 'obat-4': 'centella', 'obat-5': 'noni-fruit',
  'herbal-1': 'ginger', 'herbal-2': 'aloe-vera', 'herbal-3': 'turmeric', 'herbal-4': 'lemongrass', 'herbal-5': 'galangal',
  'aroma-1': 'rosemary', 'aroma-2': 'lavender', 'aroma-3': 'mint', 'aroma-4': 'pandan',
  'buah-1': 'strawberry', 'buah-2': 'papaya', 'buah-3': 'guava', 'buah-4': 'banana',
  'buah-5': 'lime', 'buah-6': 'watermelon', 'buah-7': 'grape'
};

// --- Toast Component ---
function Toast({ message, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 2500); return () => clearTimeout(t); }, [onClose]);
  return (
    <div style={{
      position: 'fixed', bottom: '90px', left: '50%', transform: 'translateX(-50%)',
      background: '#166534', color: 'white', padding: '10px 20px', borderRadius: '50px',
      fontSize: '0.875rem', fontWeight: 600, zIndex: 9999, whiteSpace: 'nowrap',
      boxShadow: '0 4px 16px rgba(0,0,0,0.25)', animation: 'fadeInUp 0.3s ease'
    }}>{message}</div>
  );
}

// --- Main App Wrapper ---
export default function TanamanKu() {
  const [isDarkMode, setIsDarkMode] = useLocalStorage('tanamanku_theme', false);
  const [favorites, setFavorites] = useLocalStorage('tanamanku_favorites', []);
  const [profile, setProfile] = useLocalStorage('tanamanku_profile', { name: 'Pecinta Tanaman', photo: null });
  const [myGarden, setMyGarden] = useLocalStorage('tanamanku_garden', []); // [{id, startDate}]
  const [notifEnabled, setNotifEnabled] = useLocalStorage('tanamanku_notif', false);
  const [toast, setToast] = useState(null);
  const [onboarded, setOnboarded] = useLocalStorage('tanamanku_onboarded', false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const showToast = (msg) => setToast(msg);

  const toggleFavorite = (id) => {
    if (navigator.vibrate) navigator.vibrate(40);
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(f => f !== id));
      showToast('💔 Dihapus dari favorit');
    } else {
      setFavorites([...favorites, id]);
      showToast('❤️ Ditambahkan ke favorit!');
    }
  };

  const addToGarden = (plantId) => {
    if (myGarden.find(g => g.id === plantId)) {
      setMyGarden(myGarden.filter(g => g.id !== plantId));
      showToast('🌿 Dihapus dari Kebunku');
    } else {
      setMyGarden([...myGarden, { id: plantId, startDate: new Date().toISOString().split('T')[0] }]);
      showToast('🪴 Ditambahkan ke Kebunku!');
    }
  };

  // Cek notifikasi saat app dibuka
  useEffect(() => {
    if (!notifEnabled || !('Notification' in window) || Notification.permission !== 'granted') return;
    const today = new Date().toISOString().split('T')[0];
    const lastCheck = localStorage.getItem('tanamanku_notif_lastcheck');
    if (lastCheck === today) return; // sudah cek hari ini
    localStorage.setItem('tanamanku_notif_lastcheck', today);
    const todayTasks = [];
    myGarden.forEach(({ id, startDate }) => {
      const plant = plantData.find(p => p.id === id);
      if (!plant) return;
      const start = new Date(startDate);
      const now = new Date();
      const diffDays = Math.floor((now - start) / 86400000);
      if (plant.schedules.watering > 0 && diffDays % plant.schedules.watering === 0)
        todayTasks.push(`💧 Siram ${plant.name}`);
      if (plant.schedules.fertilizing > 0 && diffDays % plant.schedules.fertilizing === 0)
        todayTasks.push(`🌿 Pupuk ${plant.name}`);
    });
    if (todayTasks.length > 0) {
      new Notification('🌱 TanamanKu — Jadwal Hari Ini', {
        body: todayTasks.slice(0, 3).join('\n') + (todayTasks.length > 3 ? `\n+${todayTasks.length - 3} lagi` : ''),
        icon: '/pwa-192x192.png', badge: '/pwa-64x64.png'
      });
    }
  }, []);

  const contextValue = {
    isDarkMode, setIsDarkMode,
    favorites, toggleFavorite,
    myGarden, addToGarden,
    notifEnabled, setNotifEnabled,
    profile, setProfile, showToast
  };

  if (!onboarded) {
    return (
      <Onboarding
        onFinish={() => setOnboarded(true)}
        onSetName={(name) => setProfile({ ...profile, name })}
      />
    );
  }

  return (
    <AppContext.Provider value={contextValue}>
      <Router basename={import.meta.env.BASE_URL}>
        <AppShell toast={toast} setToast={setToast} />
      </Router>
    </AppContext.Provider>
  );
}

function AppShell({ toast, setToast }) {
  const location = useLocation();
  return (
    <div className="app-container">
      <Header />
      <div key={location.pathname} className="page-enter">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ensiklopedia" element={<Encyclopedia />} />
          <Route path="/tanaman/:id" element={<PlantDetail />} />
          <Route path="/favorit" element={<Favorites />} />
          <Route path="/panduan" element={<SoilGuide />} />
          <Route path="/kalkulator" element={<HydroCalc />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/kalender" element={<CareCalendar />} />
        </Routes>
      </div>
      <BottomNav />
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}

// --- Header ---
function Header() {
  const { isDarkMode, setIsDarkMode } = React.useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const showBack = !['/', '/ensiklopedia', '/favorit', '/panduan', '/kalkulator', '/kalender'].includes(location.pathname);

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
    { path: '/favorit', icon: <Heart size={22} />, label: 'Favorit' },
    { path: '/panduan', icon: <span style={{fontSize:'1.2rem'}}>📚</span>, label: 'Panduan' },
    { path: '/kalender', icon: <span style={{fontSize:'1.2rem'}}>🪴</span>, label: 'Kebunku' }
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
  const { profile, favorites, myGarden } = React.useContext(AppContext);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Pagi' : hour < 15 ? 'Siang' : hour < 18 ? 'Sore' : 'Malam';
  
  // Streak tracking
  const [streakData, setStreakData] = useLocalStorage('tanamanku_streak', { count: 0, lastDate: null });
  useEffect(() => {
    const today = new Date().toDateString();
    if (streakData.lastDate === today) return;
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const newCount = streakData.lastDate === yesterday ? streakData.count + 1 : 1;
    setStreakData({ count: newCount, lastDate: today });
  }, []);

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
        <div className="stat-card" onClick={() => navigate('/kalender')} style={{ cursor: 'pointer' }}>
          <div className="stat-val">{myGarden.length}</div>
          <div className="stat-lbl">Kebunku</div>
        </div>
        <div className="stat-card" onClick={() => navigate('/ensiklopedia')} style={{ cursor: 'pointer' }}>
          <div className="stat-val">{plantData.length}</div>
          <div className="stat-lbl">Katalog</div>
        </div>
        <div className="stat-card">
          <div className="stat-val">🔥 {streakData.count}</div>
          <div className="stat-lbl">Streak</div>
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
  const [sortBy, setSortBy] = useState('default');
  const [hidroOnly, setHidroOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPulling, setIsPulling] = useState(false);
  const touchStartY = useRef(0);
  const filterScrollRef = useRef(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const scrollStartX = useRef(0);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  // Mouse drag-to-scroll for desktop
  const onMouseDown = (e) => {
    isDragging.current = true;
    dragStartX.current = e.clientX;
    scrollStartX.current = filterScrollRef.current.scrollLeft;
    filterScrollRef.current.style.cursor = 'grabbing';
    filterScrollRef.current.style.userSelect = 'none';
  };
  const onMouseMove = (e) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStartX.current;
    filterScrollRef.current.scrollLeft = scrollStartX.current - dx;
  };
  const onMouseUp = () => {
    isDragging.current = false;
    if (filterScrollRef.current) {
      filterScrollRef.current.style.cursor = 'grab';
      filterScrollRef.current.style.userSelect = '';
    }
  };

  const handleTouchStart = (e) => { touchStartY.current = e.touches[0].clientY; };
  const handleTouchEnd = (e) => {
    const delta = e.changedTouches[0].clientY - touchStartY.current;
    if (delta > 80 && window.scrollY === 0) {
      setIsPulling(true);
      setIsLoading(true);
      setTimeout(() => { setIsLoading(false); setIsPulling(false); }, 800);
    }
  };

  const categories = [
    { id: 'Semua', icon: '🌿' },
    { id: 'Tanaman Hias', icon: '🏠', label: 'Hias' },
    { id: 'Sayuran', icon: '🥗', label: 'Sayuran' },
    { id: 'Buah-buahan', icon: '🍊', label: 'Buah' },
    { id: 'Obat', icon: '💊', label: 'Obat' },
    { id: 'Herbal', icon: '🌾', label: 'Herbal' },
    { id: 'Aromaterapi', icon: '💜', label: 'Aroma' }
  ];
  
  const difficulties = ['Semua', 'mudah', 'sedang', 'sulit'];
  const diffOrder = { mudah: 1, sedang: 2, sulit: 3 };

  let filtered = plantData.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.scientificName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = activeCategory === 'Semua' || p.category === activeCategory;
    const matchDiff = activeDiff === 'Semua' || p.difficulty === activeDiff;
    const matchHidro = !hidroOnly || (p.hidroponik && p.hidroponik.bisa_hidroponik === true);
    return matchSearch && matchCat && matchDiff && matchHidro;
  });

  if (sortBy === 'az') filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
  else if (sortBy === 'mudah') filtered = [...filtered].sort((a, b) => diffOrder[a.difficulty] - diffOrder[b.difficulty]);
  else if (sortBy === 'sulit') filtered = [...filtered].sort((a, b) => diffOrder[b.difficulty] - diffOrder[a.difficulty]);
  else if (sortBy === 'hidro') filtered = [...filtered].sort((a, b) => {
    const aH = a.hidroponik && a.hidroponik.bisa_hidroponik ? 1 : 0;
    const bH = b.hidroponik && b.hidroponik.bisa_hidroponik ? 1 : 0;
    return bH - aH;
  });

  return (
    <main className="main-content animate-fade-up" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      {isPulling && (
        <div style={{ textAlign: 'center', padding: '8px 0 0', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 600 }}>
          🔄 Memuat ulang...
        </div>
      )}
      <div className="search-wrapper">
        <Search size={20} className="search-icon" />
        <input 
          type="text" 
          placeholder="Cari nama tanaman atau latin..." 
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="filter-scroll-wrapper">
        <div
          className="filter-scroll"
          ref={filterScrollRef}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          style={{ cursor: 'grab' }}
        >
          {categories.map(c => (
            <button key={c.id} className={`filter-chip ${activeCategory === c.id ? 'active' : ''}`} onClick={() => setActiveCategory(c.id)}>
              <span>{c.icon}</span> {c.label || c.id}
            </button>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
        <div className="filter-scroll" style={{ flex: 1, marginBottom: 0 }}>
          {difficulties.map(d => (
            <button key={d} className={`filter-chip ${activeDiff === d ? 'active' : ''}`} onClick={() => setActiveDiff(d)} style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '8px' }}>
              {d === 'Semua' ? 'Semua Level' : d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}
        </div>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--surface)', color: 'var(--text-main)', fontSize: '0.75rem', fontFamily: 'inherit', flexShrink: 0, cursor: 'pointer' }}>
          <option value="default">Default</option>
          <option value="az">A → Z</option>
          <option value="mudah">Termudah</option>
          <option value="sulit">Tersulit</option>
          <option value="hidro">Hidroponik ↑</option>
        </select>
      </div>
      <div style={{ marginBottom: '12px' }}>
        <button
          onClick={() => setHidroOnly(h => !h)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '6px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600,
            border: '1.5px solid', cursor: 'pointer', transition: 'all 0.2s',
            borderColor: hidroOnly ? '#0891b2' : 'var(--border-color)',
            background: hidroOnly ? '#e0f2fe' : 'var(--surface)',
            color: hidroOnly ? '#0891b2' : 'var(--text-muted)',
          }}
        >
          💧 {hidroOnly ? 'Hidroponik: ON' : 'Bisa Hidroponik'}
          {hidroOnly && <span style={{ fontSize: '0.7rem', background: '#0891b2', color: 'white', borderRadius: '50%', width: '16px', height: '16px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>✓</span>}
        </button>
        {hidroOnly && (
          <span style={{ marginLeft: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {filtered.length} tanaman cocok
          </span>
        )}
      </div>

      {isLoading ? (
        <SkeletonGrid count={6} />
      ) : (
        <div className="plant-grid">
          {filtered.length > 0 ? (
            filtered.map(plant => <PlantCard key={plant.id} plant={plant} onClick={() => navigate(`/tanaman/${plant.id}`)} />)
          ) : (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center', marginTop: '40px', color: 'var(--text-muted)' }}>Tidak ada tanaman ditemukan.</p>
          )}
        </div>
      )}
    </main>
  );
}

const CATEGORY_GRADIENT = {
  'Tanaman Hias': 'linear-gradient(160deg, #1a472a, #2d6a4f)',
  'Sayuran':      'linear-gradient(160deg, #1a3a1a, #2d5a1a)',
  'Obat':         'linear-gradient(160deg, #1a3a2a, #1a5c3a)',
  'Herbal':       'linear-gradient(160deg, #2d4a1a, #3d6b2a)',
  'Aromaterapi':  'linear-gradient(160deg, #3a1a4a, #5c2a6b)',
  'Buah-buahan':  'linear-gradient(160deg, #7c2d12, #c2410c)',
};

function PlantCard({ plant, onClick }) {
  const { favorites, toggleFavorite } = React.useContext(AppContext);
  const isFav = favorites.includes(plant.id);
  const gradient = CATEGORY_GRADIENT[plant.category] || CATEGORY_GRADIENT['Tanaman Hias'];
  const emoji = EMOJI_MAP[plant.id] || '🌿';
  const [imgErr, setImgErr] = useState(false);

  return (
    <div className="plant-card-v2" onClick={onClick}>
      {/* Background: foto asli atau fallback emoji */}
      <div className="plant-emoji-bg" style={{ background: gradient, overflow: 'hidden', position: 'relative' }}>
        {plant.imageUrl && !imgErr ? (
          <img
            src={plant.imageUrl}
            alt={plant.name}
            onError={() => setImgErr(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
          />
        ) : (
          <span style={{ fontSize: '3.5rem', userSelect: 'none', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>{emoji}</span>
        )}
      </div>

      {/* Gradient overlay with text */}
      <div
        className="img-overlay"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 70%, transparent 100%)' }}
      >
        <h3 className="card-title">{plant.name}</h3>
        <p className="card-subtitle">{plant.scientificName}</p>
        <div className="card-watering">
          <Droplets size={12} /> setiap {plant.schedules.watering} hari
        </div>
      </div>

      {/* Badge top-left */}
      <div className="card-badge-top-left" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span className={`badge ${plant.difficulty}`}>{plant.difficulty}</span>
        {plant.hidroponik && plant.hidroponik.bisa_hidroponik && (
          <span style={{ background: 'rgba(8,145,178,0.85)', color: 'white', fontSize: '0.6rem', fontWeight: 700, padding: '2px 6px', borderRadius: '6px', backdropFilter: 'blur(4px)' }}>💧 Hidro</span>
        )}
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
  const { favorites, toggleFavorite, myGarden, addToGarden, showToast } = React.useContext(AppContext);
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

  const handleShare = async () => {
    const shareData = {
      title: plant.name,
      text: `🌿 ${plant.name} (${plant.scientificName})\n${plant.description}\n\nLihat di TanamanKu!`,
      url: window.location.href
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch (e) { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
      showToast('🔗 Link disalin ke clipboard!');
    }
  };

  return (
    <div className="animate-fade-up" style={{ paddingBottom: '40px' }}>
      <div className="detail-hero">
        {plant.imageUrl ? (
          <img
            src={plant.imageUrl}
            alt={plant.name}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div style={{ display: plant.imageUrl ? 'none' : 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', fontSize: '80px', background: CATEGORY_GRADIENT[plant.category] || 'var(--primary-dark)' }}>
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

        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
          <button className="btn-primary" onClick={() => addToGarden(id)}
            style={{ flex: 1, background: myGarden.find(g=>g.id===id) ? '#16a34a' : 'var(--primary)' }}>
            <span>{myGarden.find(g=>g.id===id) ? '✅' : '🪴'}</span>
            {myGarden.find(g=>g.id===id) ? 'Di Kebunku' : 'Tambah ke Kebunku'}
          </button>
          <button className="btn-primary" onClick={handleShare} style={{ flex: 1, background: 'var(--surface)', color: 'var(--primary)', border: '2px solid var(--primary)', boxShadow: 'none' }}>
            <Star size={20} /> Bagikan
          </button>
        </div>

        <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Tips Perawatan</h3>
        <ul className="tips-list">
          <li><strong>Penyiraman:</strong> {plant.careDetails.watering}</li>
          <li><strong>Cahaya:</strong> {plant.careDetails.sunlight}</li>
          <li><strong>Pemupukan:</strong> {plant.careDetails.fertilizer}</li>
          <li><strong>Pemangkasan:</strong> {plant.careDetails.pruning}</li>
        </ul>

        {/* --- PANDUAN MENANAM STATIS --- */}
        <PlantGuideSection plant={plant} />

        {/* --- CARA PENANAMAN (3 METODE) --- */}
        {plant.hidroponik && (
          <div style={{ marginTop: '32px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.3rem' }}>💧</span> Cara Menanam Hidroponik
            </h3>

            {!plant.hidroponik.bisa_hidroponik ? (
              <div style={{ background: 'var(--surface)', borderRadius: '16px', padding: '16px', border: '1px solid var(--border-color)', borderLeft: '4px solid #f59e0b' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>⚠️</span>
                  <div>
                    <p style={{ fontWeight: '700', fontSize: '0.95rem', color: '#92400e', marginBottom: '6px' }}>Tidak Direkomendasikan untuk Hidroponik</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.65 }}>{plant.hidroponik.tips}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Header card: metode + kesulitan */}
                <div style={{ background: 'var(--surface)', borderRadius: '16px', padding: '16px', boxShadow: 'var(--shadow-sm)', borderLeft: '4px solid var(--accent)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div>
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Metode Direkomendasikan</p>
                      <span style={{ background: 'var(--accent)', color: 'white', padding: '4px 12px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: '700', display: 'inline-block' }}>
                        {plant.hidroponik.metode}
                      </span>
                    </div>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '50px',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      background: plant.hidroponik.kesulitan === 'Mudah' ? '#dcfce7' : plant.hidroponik.kesulitan === 'Sedang' ? '#fef9c3' : '#fee2e2',
                      color: plant.hidroponik.kesulitan === 'Mudah' ? '#166534' : plant.hidroponik.kesulitan === 'Sedang' ? '#854d0e' : '#991b1b',
                    }}>
                      {plant.hidroponik.kesulitan}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>Media:</span> {plant.hidroponik.media}
                  </p>
                </div>

                {/* Info grid: pH, nutrisi, waktu panen */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div style={{ background: 'var(--surface)', borderRadius: '12px', padding: '12px', boxShadow: 'var(--shadow-sm)', textAlign: 'center' }}>
                    <p style={{ fontSize: '1.3rem', marginBottom: '2px' }}>🧪</p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>pH Ideal</p>
                    <p style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--primary)' }}>{plant.hidroponik.ph_ideal}</p>
                  </div>
                  <div style={{ background: 'var(--surface)', borderRadius: '12px', padding: '12px', boxShadow: 'var(--shadow-sm)', textAlign: 'center' }}>
                    <p style={{ fontSize: '1.3rem', marginBottom: '2px' }}>⏱️</p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Waktu Panen</p>
                    <p style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--primary)', lineHeight: 1.3 }}>{plant.hidroponik.waktu_panen.split('—')[0].trim()}</p>
                  </div>
                </div>

                {/* Nutrisi */}
                <div style={{ background: 'var(--surface)', borderRadius: '12px', padding: '14px', boxShadow: 'var(--shadow-sm)', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>🌿</span>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', marginBottom: '3px' }}>Larutan Nutrisi</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.5 }}>{plant.hidroponik.nutrisi}</p>
                  </div>
                </div>

                {/* Tips */}
                <div style={{ background: 'linear-gradient(135deg, var(--primary-dark), var(--primary))', borderRadius: '14px', padding: '16px', color: 'white' }}>
                  <p style={{ fontWeight: '700', fontSize: '0.85rem', marginBottom: '8px', opacity: 0.85, textTransform: 'uppercase', letterSpacing: '0.5px' }}>💡 Tips Hidroponik</p>
                  <p style={{ fontSize: '0.88rem', lineHeight: 1.7, opacity: 0.95 }}>{plant.hidroponik.tips}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- PERLENGKAPAN GREENHOUSE --- */}



        {/* Related Plants */}
        {(() => {
          const related = plantData.filter(p => p.category === plant.category && p.id !== plant.id).slice(0, 4);
          if (related.length === 0) return null;
          return (
            <div style={{ marginTop: '32px' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '12px' }}>Tanaman Serupa</h3>
              <div className="plant-grid" style={{ padding: 0 }}>
                {related.map(p => (
                  <PlantCard key={p.id} plant={p} onClick={() => navigate(`/tanaman/${p.id}`)} />
                ))}
              </div>
            </div>
          );
        })()}
      </main>
    </div>
  );
}

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
        phase: 'Hari 0', title: 'Persiapan Menanam', icon: '📦', color: '#6366f1',
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
        phase: 'Hari 1–3', title: 'Fase Adaptasi Awal', icon: '🌱', color: '#f59e0b',
        tasks: [
          {
            task: 'Penyiraman pertama',
            detail: watering + ' Di hari pertama, jangan berlebihan — cukup basahi media hingga lembap merata. Jangan sampai menggenang.'
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
        phase: 'Hari 4–7', title: 'Membangun Rutinitas', icon: '⏳', color: '#8b5cf6',
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
        phase: 'Minggu 2–4', title: 'Perkembangan Awal', icon: '🌿', color: '#10b981',
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
        phase: 'Bulan 1–3', title: 'Perawatan Rutin', icon: '✂️', color: '#ec4899',
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
        icon: '🌟', color: '#f43f5e',
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
        <h3 style={{ fontSize: '1.2rem' }}>📅 Panduan Menanam dari Nol</h3>
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
                        {done && <span style={{ color: 'white', fontSize: '12px', fontWeight: 700 }}>✓</span>}
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

// --- 6. CareCalendar & Kebunku ---
function CareCalendar() {
  const { myGarden, addToGarden, notifEnabled, setNotifEnabled, showToast } = React.useContext(AppContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('jadwal');

  const today = new Date();
  today.setHours(0,0,0,0);

  const schedule = [];
  for (let d = 0; d < 7; d++) {
    const date = new Date(today);
    date.setDate(today.getDate() + d);
    const tasks = [];
    myGarden.forEach(({ id, startDate }) => {
      const plant = plantData.find(p => p.id === id);
      if (!plant) return;
      const start = new Date(startDate);
      start.setHours(0,0,0,0);
      const diff = Math.floor((date - start) / 86400000);
      if (diff < 0) return;
      if (plant.schedules.watering > 0 && diff % plant.schedules.watering === 0)
        tasks.push({ plant, type: 'siram', icon: '💧', color: '#2563eb' });
      if (plant.schedules.fertilizing > 0 && diff % plant.schedules.fertilizing === 0)
        tasks.push({ plant, type: 'pupuk', icon: '🌿', color: '#16a34a' });
      if (plant.schedules.pruning > 0 && diff % plant.schedules.pruning === 0)
        tasks.push({ plant, type: 'pangkas', icon: '✂️', color: '#7c3aed' });
    });
    schedule.push({ date, tasks });
  }

  const totalToday = schedule[0]?.tasks.length || 0;
  const dayLabel = (date, i) => {
    if (i === 0) return 'Hari Ini';
    if (i === 1) return 'Besok';
    return date.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  const enableNotif = async () => {
    if (!('Notification' in window)) { showToast('❌ Browser tidak mendukung notifikasi'); return; }
    const perm = await Notification.requestPermission();
    if (perm === 'granted') {
      setNotifEnabled(true);
      showToast('🔔 Notifikasi diaktifkan!');
      new Notification('🌱 TanamanKu', { body: 'Kamu akan mendapat pengingat perawatan tanaman setiap hari.', icon: '/pwa-192x192.png' });
    } else { showToast('❌ Izin notifikasi ditolak'); }
  };

  return (
    <main className="main-content animate-fade-up">
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '4px' }}>🌿 Kebunku</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{myGarden.length} tanaman · {totalToday} tugas hari ini</p>
      </div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {[['jadwal','📅 Jadwal'],['kebunku','🪴 Koleksiku']].map(([key,label]) => (
          <button key={key} onClick={() => setActiveTab(key)} style={{
            flex: 1, padding: '10px', borderRadius: '12px', border: '1.5px solid', fontWeight: 700,
            fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s',
            borderColor: activeTab === key ? 'var(--primary)' : 'var(--border-color)',
            background: activeTab === key ? 'var(--primary)' : 'var(--surface)',
            color: activeTab === key ? 'white' : 'var(--text-main)',
          }}>{label}</button>
        ))}
      </div>
      {activeTab === 'jadwal' && (
        <>
          {!notifEnabled && (
            <div style={{ background: 'linear-gradient(135deg,#fef9c3,#fef08a)', borderRadius: '14px', padding: '12px 14px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.4rem' }}>🔔</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, fontSize: '0.85rem', color: '#713f12' }}>Aktifkan Notifikasi</p>
                <p style={{ fontSize: '0.75rem', color: '#92400e' }}>Dapat pengingat otomatis setiap pagi</p>
              </div>
              <button onClick={enableNotif} style={{ background: '#ca8a04', color: 'white', border: 'none', borderRadius: '8px', padding: '6px 12px', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}>Aktifkan</button>
            </div>
          )}
          {myGarden.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: '60px', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '3rem', marginBottom: '12px' }}>🪴</p>
              <p style={{ fontWeight: 600, marginBottom: '8px' }}>Kebunmu masih kosong</p>
              <p style={{ fontSize: '0.85rem', marginBottom: '20px' }}>Tambahkan tanaman dari halaman detail</p>
              <button className="btn-primary" style={{ width: 'auto', padding: '10px 24px' }} onClick={() => navigate('/ensiklopedia')}>Jelajahi Tanaman</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {schedule.map(({ date, tasks }, i) => (
                <div key={i} style={{ background: 'var(--surface)', borderRadius: '14px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', opacity: tasks.length === 0 ? 0.5 : 1 }}>
                  <div style={{ padding: '10px 14px', background: i === 0 ? 'var(--primary)' : 'transparent', borderBottom: tasks.length > 0 ? '1px solid var(--border-color)' : 'none' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem', color: i === 0 ? 'white' : 'var(--text-muted)' }}>
                      {dayLabel(date, i)}
                      {tasks.length > 0 && <span style={{ marginLeft: '8px', background: i===0?'rgba(255,255,255,0.25)':'var(--primary)', color: 'white', borderRadius: '50px', padding: '1px 8px', fontSize: '0.7rem' }}>{tasks.length} tugas</span>}
                      {tasks.length === 0 && <span style={{ marginLeft: '8px', fontSize: '0.75rem', opacity: 0.6 }}>— tidak ada tugas</span>}
                    </span>
                  </div>
                  {tasks.length > 0 && (
                    <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {tasks.map((t, ti) => (
                        <div key={ti} onClick={() => navigate(`/tanaman/${t.plant.id}`)} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '8px 10px', borderRadius: '10px', background: 'var(--bg)', borderLeft: `3px solid ${t.color}` }}>
                          <span style={{ fontSize: '1.2rem' }}>{t.icon}</span>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontWeight: 700, fontSize: '0.85rem' }}>{t.plant.name}</p>
                            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{t.type}</p>
                          </div>
                          <span style={{ fontSize: '0.65rem', background: t.color+'20', color: t.color, padding: '3px 8px', borderRadius: '50px', fontWeight: 700 }}>{t.type}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {activeTab === 'kebunku' && (
        <div>
          {myGarden.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: '60px', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '3rem', marginBottom: '12px' }}>🌱</p>
              <p style={{ fontWeight: 600 }}>Belum ada tanaman di kebunmu</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {myGarden.map(({ id, startDate }) => {
                const plant = plantData.find(p => p.id === id);
                if (!plant) return null;
                const days = Math.floor((new Date() - new Date(startDate)) / 86400000);
                return (
                  <div key={id} style={{ background: 'var(--surface)', borderRadius: '14px', padding: '14px', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', overflow: 'hidden', background: CATEGORY_GRADIENT[plant.category], flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem' }}>
                      {plant.imageUrl ? <img src={plant.imageUrl} alt={plant.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display='none'; }} /> : EMOJI_MAP[plant.id] || '🌿'}
                    </div>
                    <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => navigate(`/tanaman/${id}`)}>
                      <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>{plant.name}</p>
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        Mulai: {new Date(startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })} · {days} hari
                      </p>
                    </div>
                    <button onClick={() => addToGarden(id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', fontSize: '1.1rem' }}>🗑️</button>
                  </div>
                );
              })}
            </div>
          )}
          {myGarden.length > 0 && (
            <button className="btn-primary" style={{ marginTop: '16px', background: 'var(--surface)', color: 'var(--primary)', border: '2px solid var(--primary)', boxShadow: 'none' }} onClick={() => navigate('/ensiklopedia')}>+ Tambah Tanaman</button>
          )}
        </div>
      )}
    </main>
  );
}

function HydroCalc() {
  const [volume, setVolume] = useState(10);
  const [ecTarget, setEcTarget] = useState(2.0);
  const [phCurrent, setPhCurrent] = useState(7.0);
  const [plantType, setPlantType] = useState('sayuran-daun');

  const plantPresets = [
    { id: 'sayuran-daun', label: '🥬 Sayuran Daun', ecMin: 1.5, ecMax: 2.5, phMin: 6.0, phMax: 7.0 },
    { id: 'tomat-cabai',  label: '🍅 Tomat / Cabai', ecMin: 2.0, ecMax: 3.5, phMin: 5.8, phMax: 6.3 },
    { id: 'buah',        label: '🍓 Buah (Stroberi/Melon)', ecMin: 1.8, ecMax: 3.0, phMin: 5.5, phMax: 6.5 },
    { id: 'herbal',      label: '🌿 Herbal & Rempah', ecMin: 1.0, ecMax: 2.0, phMin: 5.5, phMax: 6.5 },
  ];

  const preset = plantPresets.find(p => p.id === plantType);

  // Hitungan AB Mix (per liter: 5ml stok A + 5ml stok B ≈ EC 2.0)
  const abMixA = (volume * 5 * (ecTarget / 2.0)).toFixed(0);
  const abMixB = (volume * 5 * (ecTarget / 2.0)).toFixed(0);

  // pH adjuster: tiap 0.1 unit pH turun butuh ~1ml pH Down per 10L
  const phDiff = phCurrent - 6.0;
  const phDownNeeded = phDiff > 0 ? ((phDiff / 0.1) * (volume / 10)).toFixed(1) : 0;
  const phUpNeeded = phDiff < 0 ? ((Math.abs(phDiff) / 0.1) * (volume / 10)).toFixed(1) : 0;

  const ecStatus = ecTarget >= preset.ecMin && ecTarget <= preset.ecMax ? 'optimal' : ecTarget < preset.ecMin ? 'rendah' : 'tinggi';
  const ecColor = ecStatus === 'optimal' ? '#16a34a' : ecStatus === 'rendah' ? '#ca8a04' : '#dc2626';

  return (
    <main className="main-content animate-fade-up">
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '6px' }}>🧪 Kalkulator Nutrisi</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
          Hitung kebutuhan AB Mix, EC, dan pH untuk larutan hidroponikmu.
        </p>
      </div>

      {/* Pilih Jenis Tanaman */}
      <div style={{ background: 'var(--surface)', borderRadius: '16px', padding: '16px', marginBottom: '14px', boxShadow: 'var(--shadow-sm)' }}>
        <p style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Jenis Tanaman</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {plantPresets.map(p => (
            <button key={p.id} onClick={() => { setPlantType(p.id); setEcTarget(((p.ecMin + p.ecMax) / 2).toFixed(1) * 1); }}
              style={{ padding: '8px 12px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 600, border: '1.5px solid', cursor: 'pointer', transition: 'all 0.2s',
                borderColor: plantType === p.id ? 'var(--primary)' : 'var(--border-color)',
                background: plantType === p.id ? 'var(--primary)' : 'var(--surface)',
                color: plantType === p.id ? 'white' : 'var(--text-main)' }}>
              {p.label}
            </button>
          ))}
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
          Target EC: <b>{preset.ecMin}–{preset.ecMax} mS/cm</b> · pH: <b>{preset.phMin}–{preset.phMax}</b>
        </p>
      </div>

      {/* Input */}
      <div style={{ background: 'var(--surface)', borderRadius: '16px', padding: '16px', marginBottom: '14px', boxShadow: 'var(--shadow-sm)' }}>
        <p style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Parameter Larutan</p>
        <div style={{ display: 'grid', gap: '16px' }}>
          {/* Volume */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>💧 Volume Air</label>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)' }}>{volume} Liter</span>
            </div>
            <input type="range" min="1" max="200" value={volume} onChange={e => setVolume(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--primary)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              <span>1L (Kratky kecil)</span><span>50L (DWC)</span><span>200L (NFT besar)</span>
            </div>
          </div>
          {/* EC Target */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>⚡ Target EC</label>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: ecColor }}>{ecTarget.toFixed(1)} mS/cm — {ecStatus}</span>
            </div>
            <input type="range" min="0.5" max="5.0" step="0.1" value={ecTarget} onChange={e => setEcTarget(Number(e.target.value))}
              style={{ width: '100%', accentColor: ecColor }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              <span>0.5 (semai)</span><span>2.0 (normal)</span><span>5.0 (intensif)</span>
            </div>
          </div>
          {/* pH */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>🧫 pH Air Saat Ini</label>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)' }}>{phCurrent.toFixed(1)}</span>
            </div>
            <input type="range" min="4.0" max="9.0" step="0.1" value={phCurrent} onChange={e => setPhCurrent(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--primary)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              <span>4.0 (asam)</span><span>7.0 (netral)</span><span>9.0 (basa)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hasil */}
      <div style={{ background: 'linear-gradient(135deg, #0c4a6e, #0891b2)', borderRadius: '16px', padding: '16px', marginBottom: '14px', color: 'white', boxShadow: 'var(--shadow-md)' }}>
        <p style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '12px', opacity: 0.85, textTransform: 'uppercase', letterSpacing: '0.5px' }}>📊 Hasil Kalkulasi</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
            <p style={{ fontSize: '1.8rem', fontWeight: 800 }}>{abMixA} ml</p>
            <p style={{ fontSize: '0.75rem', opacity: 0.85 }}>AB Mix Stok A</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
            <p style={{ fontSize: '1.8rem', fontWeight: 800 }}>{abMixB} ml</p>
            <p style={{ fontSize: '0.75rem', opacity: 0.85 }}>AB Mix Stok B</p>
          </div>
          {phDownNeeded > 0 && (
            <div style={{ background: 'rgba(220,38,38,0.3)', borderRadius: '12px', padding: '12px', textAlign: 'center', gridColumn: '1/-1' }}>
              <p style={{ fontSize: '1.5rem', fontWeight: 800 }}>{phDownNeeded} ml</p>
              <p style={{ fontSize: '0.75rem', opacity: 0.85 }}>pH Down diperlukan (turunkan ke pH 6.0)</p>
            </div>
          )}
          {phUpNeeded > 0 && (
            <div style={{ background: 'rgba(22,163,74,0.3)', borderRadius: '12px', padding: '12px', textAlign: 'center', gridColumn: '1/-1' }}>
              <p style={{ fontSize: '1.5rem', fontWeight: 800 }}>{phUpNeeded} ml</p>
              <p style={{ fontSize: '0.75rem', opacity: 0.85 }}>pH Up diperlukan (naikkan ke pH 6.0)</p>
            </div>
          )}
          {phDownNeeded == 0 && phUpNeeded == 0 && (
            <div style={{ background: 'rgba(22,163,74,0.3)', borderRadius: '12px', padding: '12px', textAlign: 'center', gridColumn: '1/-1' }}>
              <p style={{ fontSize: '1.2rem', fontWeight: 800 }}>✅ pH Sudah Ideal</p>
              <p style={{ fontSize: '0.75rem', opacity: 0.85 }}>Tidak perlu adjuster pH</p>
            </div>
          )}
        </div>
        <p style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: '10px', textAlign: 'center' }}>
          * Estimasi berdasarkan AB Mix standar 500ml stok. Selalu verifikasi dengan EC meter & pH meter.
        </p>
      </div>

      {/* Tips */}
      <div style={{ background: 'var(--surface)', borderRadius: '16px', padding: '16px', boxShadow: 'var(--shadow-sm)' }}>
        <p style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>💡 Panduan Urutan Pencampuran</p>
        {[
          ['1', 'Isi wadah dengan air bersih sesuai volume target'],
          ['2', 'Masukkan AB Mix Stok A, aduk rata'],
          ['3', 'Masukkan AB Mix Stok B, aduk rata'],
          ['4', 'Ukur EC — sesuaikan dengan menambah AB Mix atau encerkan dengan air'],
          ['5', 'Ukur pH — tambahkan pH Down/Up sesuai kalkulasi di atas'],
          ['6', 'Cek ulang EC dan pH setelah penyesuaian. Siap digunakan!'],
        ].map(([n, text]) => (
          <div key={n} style={{ display: 'flex', gap: '10px', marginBottom: '8px', alignItems: 'flex-start' }}>
            <span style={{ background: 'var(--primary)', color: 'white', borderRadius: '50%', width: '20px', height: '20px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, flexShrink: 0, marginTop: '1px' }}>{n}</span>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.5 }}>{text}</p>
          </div>
        ))}
      </div>
    </main>
  );
}

// --- 7. Panduan Tanah & Media Tanam ---
const soilGuideData = [
  {
    title: 'Mengenal Jenis Tanah', icon: '🌍', color: '#92400e',
    sections: [
      { heading: 'Tanah Liat (Clay)', body: 'Tanah berat dengan partikel halus. Menyimpan air dan nutrisi dengan baik, tapi drainase buruk sehingga mudah membuat akar busuk. Cocok untuk tanaman yang suka lembap seperti kangkung dan bayam, TIDAK untuk kaktus atau sukulen.' },
      { heading: 'Tanah Pasir (Sandy)', body: 'Drainase sangat cepat, tidak menyimpan air. Baik untuk kaktus, sukulen, lavender, dan rosemary. Perlu sering disiram dan ditambah kompos agar lebih subur.' },
      { heading: 'Tanah Lempung (Loam)', body: 'Kombinasi ideal tanah liat, pasir, dan bahan organik. Drainase baik, menyimpan nutrisi, gembur dan mudah diolah. Cocok untuk hampir semua jenis tanaman. Ini adalah tanah terbaik untuk kebun.' },
      { heading: 'Tanah Gambut (Peat)', body: 'Kaya bahan organik, asam, menyimpan air sangat baik. Ideal dicampur untuk anggrek, blueberry, dan tanaman asam. Tidak dianjurkan digunakan murni karena terlalu asam untuk kebanyakan tanaman.' },
    ]
  },
  {
    title: 'Media Tanam untuk Pot', icon: '🪴', color: '#166534',
    sections: [
      { heading: 'Cocopeat (Serbuk Kelapa)', body: 'Ringan, menyerap air baik, ramah lingkungan. Harus dicampur dengan bahan drainase seperti perlite karena bisa terlalu lembap jika dipakai sendiri. Campuran ideal: 50% cocopeat + 30% perlite + 20% kompos.' },
      { heading: 'Sekam Bakar (Arang Sekam)', body: 'Membantu drainase dan aerasi akar. pH netral, steril, bebas hama. Tambahkan 20-30% ke media tanam apa pun untuk hasil lebih baik. Sangat dianjurkan untuk tanaman hias indoor.' },
      { heading: 'Perlite', body: 'Mineral vulkanik yang membuat media lebih ringan dan meningkatkan drainase secara signifikan. Wajib digunakan untuk kaktus, sukulen, dan tanaman yang sangat rentan busuk akar (rosemary, lavender).' },
      { heading: 'Kompos & Pupuk Kandang', body: 'Sumber nutrisi organik alami. Pupuk kandang harus matang (tidak berbau menyengat) sebelum dipakai. Tambahkan 20-30% ke media tanam untuk memperkaya nutrisi jangka panjang.' },
    ]
  },
  {
    title: 'Memahami pH Tanah', icon: '🧪', color: '#6366f1',
    sections: [
      { heading: 'Apa itu pH Tanah?', body: 'pH adalah tingkat keasaman tanah (skala 1–14). pH 7 = netral. Di bawah 7 = asam. Di atas 7 = basa/alkalis. Kebanyakan tanaman tumbuh optimal di pH 6.0–7.0 (sedikit asam hingga netral).' },
      { heading: 'Tanaman Asam (pH 4.5–6.0)', body: 'Anggrek, blueberry, hydrangea biru, azalea. Gunakan media cocopeat atau tambahkan sulfur untuk menurunkan pH tanah yang terlalu basa.' },
      { heading: 'Tanaman Netral–Basa (pH 6.5–7.5)', body: 'Lavender, rosemary, asparagus. Jika tanah terlalu asam, tambahkan kapur dolomit secara perlahan dan merata.' },
      { heading: 'Cara Mengukur pH', body: 'Gunakan kertas lakmus atau pH meter tanah (tersedia di toko pertanian mulai Rp 30.000). Ukur sebelum menanam dan setiap 3 bulan sekali untuk memastikan kondisi optimal.' },
    ]
  },
  {
    title: 'Pupuk: Jenis & Cara Pakai', icon: '🌿', color: '#0d9488',
    sections: [
      { heading: 'NPK — Makronutrien Utama', body: 'N (Nitrogen) = pertumbuhan daun hijau. P (Fosfor) = perkembangan akar dan pembungaan. K (Kalium) = ketahanan tanaman dan kualitas buah. Pilih rasio NPK sesuai fase: daun = N tinggi, bunga/buah = P&K tinggi.' },
      { heading: 'Pupuk Cair vs Granul', body: 'Pupuk cair bekerja cepat (1-3 hari) namun habis cepat, cocok untuk dorongan pertumbuhan. Pupuk granul/lambat urai bekerja 1-3 bulan, lebih praktis dan hemat, cocok untuk perawatan rutin.' },
      { heading: 'Pupuk Organik', body: 'Kompos, pupuk kandang, atau pupuk ikan. Lebih aman, memperbaiki struktur tanah, dan tidak berisiko over-fertilizing. Kelemahannya: nutrisi tidak secepat pupuk kimia.' },
      { heading: 'Aturan Emas Pemupukan', body: 'Selalu siram tanaman sebelum memupuk — jangan pupuk tanah kering karena dapat membakar akar. Mulai dengan setengah dosis dari yang tertera di kemasan. Lebih baik kurang dari berlebihan.' },
    ]
  },
  {
    title: 'Drainase & Penyiraman', icon: '💧', color: '#2563eb',
    sections: [
      { heading: 'Pentingnya Drainase', body: 'Pot WAJIB memiliki lubang di bawah. Tanpa drainase, air akan menggenang dan menyebabkan busuk akar — penyebab kematian tanaman no. 1 di Indonesia. Jangan simpan pot di tatakan berisi air genangan.' },
      { heading: 'Kapan Harus Menyiram?', body: 'Tes jari: tusukkan jari 2-3 cm ke media tanam. Jika masih lembap, tunda penyiraman. Jika kering, segera siram hingga air keluar dari lubang bawah pot. Lebih baik jarang tapi tepat waktu.' },
      { heading: 'Waktu Terbaik Menyiram', body: 'Pagi hari (06:00–09:00) adalah waktu ideal. Air yang menguap siang hari tidak akan menggenang, dan tanaman punya cukup air untuk proses fotosintesis. Hindari menyiram saat terik siang.' },
      { heading: 'Kualitas Air Penyiraman', body: 'Air PDAM mengandung klorin yang bisa merusak tanaman sensitif (calathea, anggrek). Endapkan air semalam sebelum digunakan, atau tampung air hujan yang jauh lebih ideal.' },
    ]
  },
  {
    title: 'Mengatasi Masalah Umum', icon: '🔍', color: '#dc2626',
    sections: [
      { heading: 'Daun Menguning', body: 'Penyebab paling umum: overwatering (75% kasus). Kurangi frekuensi siram dan pastikan drainase baik. Penyebab lain: kekurangan nitrogen (pupuk), atau terlalu kurang cahaya. Amati pola daun yang menguning.' },
      { heading: 'Daun Layu Meski Sudah Disiram', body: 'Kemungkinan busuk akar akibat overwatering. Keluarkan tanaman dari pot, periksa akar — akar busuk berwarna coklat/hitam dan berbau. Potong bagian busuk, biarkan kering 30 menit, tanam ulang di media segar.' },
      { heading: 'Ujung Daun Coklat/Kering', body: 'Penyebab: udara terlalu kering (terutama dekat AC), kekurangan air, atau kelebihan pupuk. Semprot daun dengan air setiap 2-3 hari untuk meningkatkan kelembapan udara di sekitar tanaman.' },
      { heading: 'Hama Umum & Cara Atasi', body: 'Kutu daun (aphid): semprot larutan sabun cair 1 sdt + air 500ml. Tungau merah: tingkatkan kelembapan, semprot air ke bawah daun. Kutu putih: usap dengan kapas+alkohol 70%. Selalu periksa bawah daun setiap minggu.' },
    ]
  },
  // ─── TOPIK BARU 1: Hidroponik untuk Pemula ───
  {
    title: 'Hidroponik untuk Pemula', icon: '💧', color: '#0891b2',
    sections: [
      { heading: 'Apa itu Hidroponik?', body: 'Hidroponik adalah metode bercocok tanam tanpa tanah — tanaman tumbuh dengan akarnya langsung menyerap larutan air yang sudah dicampur nutrisi lengkap. Tanaman mendapatkan semua yang dibutuhkan dari air, bukan dari tanah. Hasilnya: pertumbuhan lebih cepat (2–3x), lebih bersih, dan bisa dilakukan di dalam ruangan atau di balkon sempit sekalipun.' },
      { heading: 'Keunggulan vs Tanam Konvensional', body: 'Kelebihan utama hidroponik: (1) Hemat air hingga 90% dibanding tanam tanah karena air bersirkulasi ulang. (2) Pertumbuhan 2–3x lebih cepat karena nutrisi tersedia langsung di akar. (3) Tidak ada hama tanah seperti nematoda atau ulat akar. (4) Bisa dilakukan di lahan sangat terbatas — balkon, atap, atau dalam ruangan. Kekurangannya: butuh investasi awal, listrik untuk pompa, dan pemantauan nutrisi rutin.' },
      { heading: 'Sistem NFT (Nutrient Film Technique)', body: 'Air nutrisi mengalir tipis melewati talang miring sepanjang akar tanaman. Cocok untuk: selada, bayam, kangkung, pakcoy, mint. Keunggulan: hemat air, aerasi akar baik. Kelemahan: jika pompa mati, tanaman bisa stres dalam hitungan jam. Investasi awal: Rp 300rb–1,5jt tergantung skala.' },
      { heading: 'Sistem DWC (Deep Water Culture)', body: 'Akar tanaman terendam langsung dalam larutan nutrisi yang diaerasi dengan air pump (seperti akuarium). Cocok untuk: tomat, cabai, selada, stroberi. Keunggulan: buffer besar, lebih toleran jika pompa mati sebentar. Kelemahan: butuh wadah besar, aerasi wajib 24 jam. Investasi awal: Rp 200rb–500rb.' },
      { heading: 'Sistem Kratky (Tanpa Pompa)', body: 'Metode paling simpel — tidak perlu listrik sama sekali! Tanaman di net pot, akar menggantung di larutan nutrisi dalam wadah tertutup. Celah udara antara permukaan nutrisi dan tutup wadah menjadi "ruang napas" akar. Cocok untuk: selada, bayam, mint, kangkung. Sangat ideal untuk pemula karena murah, mudah, dan tanpa risiko mati listrik.' },
      { heading: 'Sistem Wick (Sumbu)', body: 'Menggunakan tali kain/sumbu untuk menarik larutan nutrisi dari bak bawah ke media tanam. Pasif, tidak butuh listrik. Cocok untuk: herbal kecil seperti mint, kemangi, oregano. Kelemahan: tidak efisien untuk tanaman besar yang butuh banyak air. Cocok dipakai sebagai media belajar pertama.' },
      { heading: 'Ebb & Flow (Pasang Surut)', body: 'Bak nutrisi dipompa masuk ke tray tanam secara berkala (30 menit on/beberapa jam off), lalu dikuras kembali. Cocok untuk: tomat, cabai, semangka, melon. Sangat fleksibel tapi butuh instalasi yang lebih kompleks. Investasi: Rp 500rb–3jt.' },
      { heading: 'Nutrisi & AB Mix: Cara Membuat Larutan', body: 'AB Mix adalah pupuk hidroponik dua komponen (A dan B) yang dicampur terpisah karena saling bereaksi jika disatukan pekat. Cara membuat larutan: campurkan Stok A 5ml + Stok B 5ml ke dalam 1 liter air bersih. Ukur EC menggunakan EC meter (target 1.5–2.5 mS/cm tergantung tanaman). Ukur pH dengan pH meter (target 5.5–6.5). Harga AB Mix: Rp 15rb–25rb per 100 gram (cukup untuk 100 liter larutan).' },
      { heading: 'Tips Memulai untuk Pemula', body: 'Mulailah dengan metode Kratky dan tanaman selada atau bayam — keduanya sangat toleran dan cepat panen (25–35 hari). Gunakan botol bekas 1,5 liter atau ember cat bekas sebagai wadah. Beli rockwool kecil (Rp 5rb) sebagai media semai. Investasi awal bisa di bawah Rp 50.000. Setelah berhasil panen pertama, barulah tingkatkan ke sistem yang lebih kompleks.' },
    ]
  },
  // ─── TOPIK BARU 2: Greenhouse Rumahan ───
  {
    title: 'Greenhouse Rumahan', icon: '🏡', color: '#16a34a',
    sections: [
      { heading: 'Apa itu Greenhouse dan Manfaatnya?', body: 'Greenhouse (rumah kaca/plastik) adalah struktur penutup yang menciptakan iklim mikro terkontrol untuk tanaman. Manfaat utama: (1) Melindungi tanaman dari hujan deras, angin kencang, dan hama luar. (2) Memperpanjang musim tanam — bisa panen sepanjang tahun. (3) Meningkatkan suhu di malam hari untuk tanaman subtropis (lavender, stroberi). (4) Mengurangi penggunaan pestisida karena lingkungan lebih terkontrol.' },
      { heading: 'Jenis Greenhouse: Tunnel (Terowongan)', body: 'Berbentuk setengah lingkaran seperti terowongan, dibuat dari rangka besi/pipa PVC melengkung yang dilapisi plastik UV. Paling populer untuk skala rumah tangga dan pertanian kecil Indonesia. Kelebihannya: mudah dibuat, murah, dan tahan angin. Ukuran umum: lebar 4–8 meter, panjang sesuai kebutuhan. Biaya per meter persegi: Rp 150rb–400rb.' },
      { heading: 'Jenis Greenhouse: A-Frame & Lean-To', body: 'A-Frame berbentuk segitiga seperti huruf A — sangat kuat menahan beban dan ideal di daerah dengan hujan lebat. Lean-to adalah greenhouse yang menempel di dinding rumah/pagar — hemat material karena memakai satu sisi dinding yang sudah ada. Cocok untuk balkon, teras, atau samping rumah. Biaya lean-to lebih hemat 30–40% dari struktur berdiri sendiri.' },
      { heading: 'Jenis Greenhouse: Mini Indoor', body: 'Kabinet atau rak tanaman bertingkat yang dilengkapi lampu grow light, kipas sirkulasi udara, dan terkadang sistem irigasi drip. Ideal untuk apartment atau ruangan tanpa taman. Harga mulai dari Rp 300rb untuk rak mini hingga Rp 5jt+ untuk kabinet lengkap dengan grow light full spectrum.' },
      { heading: 'Material Penutup: Perbandingan', body: 'Plastik UV (polyethylene): paling murah (Rp 8rb–20rb/m²), ringan, mudah dipasang, umur pakai 3–5 tahun. Polycarbonate: lebih kuat, isolasi termal sangat baik, tahan benturan, umur 10–15 tahun, harga Rp 80rb–250rb/m². Kaca: tampilan premium, tahan lama 20+ tahun, tapi berat, mahal (Rp 150rb–400rb/m²), dan berisiko pecah. Untuk Indonesia, plastik UV atau polycarbonate adalah pilihan terbaik dari segi biaya vs performa.' },
      { heading: 'Komponen Penting: Ventilasi', body: 'Ventilasi adalah komponen paling kritis greenhouse di iklim tropis — suhu di dalam bisa mencapai 50°C+ tanpa ventilasi yang baik! Standar minimum: luas ventilasi = 15–25% dari luas lantai. Pasang ventilasi di atap (panas naik ke atas) dan di samping bawah (udara masuk dari bawah). Di daerah panas, tambahkan exhaust fan atau shade net (paranet 50–70%) untuk mengurangi panas.' },
      { heading: 'Komponen Penting: Pencahayaan & Irigasi', body: 'Di dalam greenhouse, sinar matahari sudah cukup untuk sebagian besar tanaman jika tidak ada naungan berlebih. Jika perlu tambahan cahaya (untuk indoor atau musim mendung), gunakan LED grow light full spectrum (300–600W untuk area 3–6 m²). Untuk irigasi, sistem drip (tetes) paling efisien — hemat air dan mudah diotomasi dengan timer. Investasi irigasi drip untuk 20 m²: Rp 200rb–500rb.' },
      { heading: 'Tips Memilih Lokasi & Orientasi', body: 'Orientasi greenhouse terbaik: panjang greenhouse menghadap Timur–Barat (sumbu memanjang dari Utara ke Selatan) agar sinar matahari masuk optimal sepanjang hari. Pilih lokasi yang mendapat sinar minimal 6 jam/hari, jauh dari pohon besar yang menaungi. Hindari daerah cekungan yang menampung air hujan berlebih. Pastikan ada akses air dan listrik yang mudah.' },
    ]
  },
  // ─── TOPIK BARU 3: Estimasi Biaya Greenhouse ───
  {
    title: 'Estimasi Biaya Greenhouse', icon: '💰', color: '#7c3aed',
    sections: [
      { heading: 'Skala Mini (1–5 m²) — Budget Rp 500rb–2jt', body: 'Cocok untuk: balkon, teras sempit, indoor. Contoh ukuran: 1×2 m atau 2×2 m. Rincian biaya: Rangka PVC/besi tipis: Rp 100rb–300rb. Plastik UV/polycarbonate: Rp 50rb–200rb. Rak tanaman: Rp 100rb–300rb. Ventilasi/kipas mini: Rp 50rb–200rb. Total estimasi: Rp 500rb–1,5jt. Tips: Gunakan pipa PVC 1 inch (Rp 30rb/batang) sebagai rangka — murah, ringan, dan mudah dibentuk.' },
      { heading: 'Skala Sedang (10–20 m²) — Budget Rp 3jt–15jt', body: 'Cocok untuk: halaman rumah, kebun belakang. Contoh ukuran: 4×5 m atau 4×4 m. Rincian biaya: Rangka besi hollow/pipa galvanis: Rp 1,5jt–4jt. Plastik UV ketebalan 200 mikron: Rp 500rb–1,5jt. Pintu + ventilasi atap: Rp 300rb–800rb. Irigasi drip dasar: Rp 300rb–700rb. Instalasi listrik untuk kipas: Rp 200rb–500rb. Total estimasi: Rp 3jt–8jt untuk konstruksi mandiri, Rp 8jt–15jt jika menggunakan jasa tukang.' },
      { heading: 'Skala Besar (>50 m²) — Budget Rp 20jt–100jt+', body: 'Cocok untuk: semi-komersial, usaha pertanian rumahan. Contoh ukuran: 8×8 m atau 6×10 m+. Rincian biaya: Rangka besi galvanis 4 cm: Rp 8jt–25jt. Polycarbonate 6mm: Rp 15jt–40jt (atau plastik UV: Rp 3jt–8jt). Sistem ventilasi otomatis: Rp 2jt–8jt. Irigasi drip + timer: Rp 1jt–5jt. Pondasi/cor: Rp 2jt–10jt. Total estimasi: Rp 20jt–50jt mandiri, Rp 50jt–100jt+ dengan kontraktor dan polycarbonate premium.' },
      { heading: 'Rincian Komponen Biaya: Rangka & Penutup', body: 'Pipa PVC 1 inch: Rp 30rb–35rb/batang (4 m). Pipa besi hollow 4×4 cm: Rp 90rb–120rb/batang. Besi hollow 2×4 cm: Rp 50rb–70rb/batang. Plastik UV 200 mikron (lebar 6 m): Rp 15rb–20rb/meter. Polycarbonate 4mm: Rp 65rb–90rb/m². Polycarbonate 6mm: Rp 90rb–130rb/m². Paranet 50% (shading net): Rp 8rb–15rb/m².' },
      { heading: 'Rincian Komponen Biaya: Ventilasi & Irigasi', body: 'Exhaust fan 30 cm: Rp 150rb–250rb/unit. Kipas angin dinding: Rp 100rb–200rb/unit. Thermostat otomatis: Rp 50rb–150rb. Selang irigasi drip 16mm: Rp 3rb–5rb/meter. Emitter (penetes): Rp 500–1.500/buah. Timer digital: Rp 30rb–80rb. Pompa air 50W: Rp 150rb–300rb. Tangki air 200L: Rp 250rb–400rb.' },
      { heading: 'Tips Menghemat Biaya Greenhouse', body: '(1) Mulai dari mini dulu — buat 2×3 m untuk belajar sebelum investasi besar. (2) Gunakan bambu sebagai rangka untuk konstruksi murah di area tidak terlalu luas. (3) Beli plastik UV saat awal tahun — harga lebih stabil dan stok lengkap. (4) Buat sendiri (DIY) — rangka PVC bisa dikerjakan dalam 1–2 hari tanpa tukang. (5) Manfaatkan dinding rumah dengan tipe lean-to untuk menghemat 1 sisi rangka dan penutup. (6) Beli material di toko pertanian/bangunan besar, bukan toko retail kecil — beda harga bisa 30–50%.' },
    ]
  },
];

function SoilGuide() {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <main className="main-content animate-fade-up">
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '6px' }}>📚 Panduan Berkebun</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
          Pelajari dasar-dasar tanah, media tanam, pupuk, dan cara merawat tanaman dengan benar.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {soilGuideData.map((section, idx) => (
          <div
            key={idx}
            style={{ background: 'var(--surface)', borderRadius: '16px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', borderLeft: '4px solid ' + section.color }}
          >
            <button
              onClick={() => setOpenIdx(openIdx === idx ? -1 : idx)}
              style={{ width: '100%', padding: '16px', display: 'flex', alignItems: 'center', gap: '14px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
            >
              <span style={{ fontSize: '1.6rem', flexShrink: 0 }}>{section.icon}</span>
              <span style={{ flex: 1, fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>{section.title}</span>
              <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)', transform: openIdx === idx ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>›</span>
            </button>

            {openIdx === idx && (
              <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {section.sections.map((item, sIdx) => (
                  <div key={sIdx} style={{ borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
                    <p style={{ fontWeight: 700, fontSize: '0.9rem', color: section.color, marginBottom: '6px' }}>{item.heading}</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.65 }}>{item.body}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
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

// --- Care Calendar ---
