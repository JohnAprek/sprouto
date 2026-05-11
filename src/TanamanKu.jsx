import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import { 
  Home as HomeIcon, BookOpen, Sprout, Heart, Bot,
  Search, User, ArrowLeft, Moon, Sun, Camera, Send, Calendar, Bell, CheckSquare, Square,
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
  'sayur-1': '🥬', 'sayur-2': '🌱', 'sayur-3': '🍅', 'sayur-4': '🌶️', 'sayur-5': '🥗', 'sayur-6': '🥦',
  'sayur-7': '🍆', 'sayur-8': '🥒', 'sayur-9': '🥕', 'sayur-10': '🌿',
  'obat-1': '🌼', 'obat-2': '🌿', 'obat-3': '🍃', 'obat-4': '🌱', 'obat-5': '🫐',
  'herbal-1': '🪴', 'herbal-2': '🌱', 'herbal-3': '💛', 'herbal-4': '🌿', 'herbal-5': '🌰',
  'aroma-1': '🌿', 'aroma-2': '💜', 'aroma-3': '🍃', 'aroma-4': '💚',
  'buah-1': '🍓', 'buah-2': '🍌', 'buah-3': '🍊', 'buah-4': '🍌',
  'buah-5': '🍋', 'buah-6': '🍉', 'buah-7': '🍇'
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

  const contextValue = {
    isDarkMode, setIsDarkMode,
    favorites, toggleFavorite,
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
          <Route path="/chat" element={<AIChat />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/kalender" element={<CareCalendar />} />
        </Routes>
      </div>
      <BottomNav />
      <FAB />
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}


// --- FAB ---
function FAB() {
  const navigate = useNavigate();
  const location = useLocation();
  const hiddenPaths = ['/chat', '/tanaman'];
  const hide = hiddenPaths.some(p => location.pathname.startsWith(p));
  if (hide) return null;
  return (
    <button
      onClick={() => navigate('/chat')}
      style={{
        position: 'fixed', bottom: '88px', right: 'max(16px, calc(50% - 224px))',
        width: '52px', height: '52px', borderRadius: '50%',
        background: 'linear-gradient(135deg, #166534, #22c55e)',
        color: 'white', border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 16px rgba(22,101,52,0.4)',
        zIndex: 55, fontSize: '1.4rem',
        transition: 'transform 0.2s, box-shadow 0.2s'
      }}
      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      title="Tanya AI"
    >
      🤖
    </button>
  );
}

// --- Header ---
function Header() {
  const { isDarkMode, setIsDarkMode } = React.useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const showBack = !['/', '/ensiklopedia', '/favorit', '/chat'].includes(location.pathname);

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
          <div className="stat-val">📅</div>
          <div className="stat-lbl">Jadwal</div>
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
    return matchSearch && matchCat && matchDiff;
  });

  if (sortBy === 'az') filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
  else if (sortBy === 'mudah') filtered = [...filtered].sort((a, b) => diffOrder[a.difficulty] - diffOrder[b.difficulty]);
  else if (sortBy === 'sulit') filtered = [...filtered].sort((a, b) => diffOrder[b.difficulty] - diffOrder[a.difficulty]);

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
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', alignItems: 'center' }}>
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
        </select>
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
          <Droplets size={12} /> setiap {plant.schedules.watering} hari
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
  const { favorites, toggleFavorite, showToast } = React.useContext(AppContext);
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

        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
          <button className="btn-primary" onClick={handleReminder} style={{ flex: 1 }}>
            <Bell size={20} /> Pengingat
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

        {/* --- NEW SECTION: PANDUAN AI --- */}
        <AIGuideSection plant={plant} />

        <div style={{ marginTop: '32px' }}>
          <button className="btn-primary" onClick={() => navigate('/chat')} style={{ background: 'var(--surface)', color: 'var(--primary)', border: '2px solid var(--primary)' }}>
            <Bot size={20} /> Tanya AI Tentang {plant.name}
          </button>
        </div>

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



// --- AI Guide Section ---
function AIGuideSection({ plant }) {
  const [guide, setGuide] = useLocalStorage('guide_' + plant.id + '_content', null);
  const [tasks, setTasks] = useLocalStorage('guide_' + plant.id + '_tasks', []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateGuide = async () => {
    setLoading(true);
    setError(null);
    try {
      const prompt = `Buat panduan menanam ${plant.name} (${plant.scientificName}) dari nol untuk pemula Indonesia. Format response sebagai JSON dengan struktur: { "phases": [ { "phase": "Hari 0", "title": "judul fase", "icon": "emoji", "color": "hex color", "tasks": [ { "task": "judul tugas", "detail": "penjelasan detail praktis 2-3 kalimat" } ] } ] }. Buat 6 fase: 1. Hari 0 - Persiapan khusus, 2. Hari 1-3 - Adaptasi spesifik, 3. Hari 4-7 - Rutinitas awal, 4. Minggu 2-4 - Perkembangan awal, 5. Bulan 1-3 - Perawatan rutin spesifik, 6. Bulan 3+ - Berkembang & tips lanjutan. Sesuaikan dengan karakteristik unik: tingkat kesulitan ${plant.difficulty}, kebutuhan air ${plant.schedules.watering} hari sekali, cahaya ${plant.careDetails.sunlight.split(' ')[0]}. Setiap fase minimal 3-4 tugas spesifik. Hanya keluarkan format JSON valid tanpa teks lain.`;
      
      const res = await fetch('https://api-proxy.johnaprek.workers.dev', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: prompt }],
          system: "Kamu ahli hortikultura Indonesia. Buat panduan menanam step-by-step dalam Bahasa Indonesia yang detail, praktis, dan mudah dipahami pemula. Pastikan response adalah JSON valid.",
          model: 'claude-haiku-4-5',
          max_tokens: 2000,
          temperature: 0.7
        })
      });

      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      
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
            {guide.phases && guide.phases.map((phase, pIdx) => {
              const phaseTasks = phase.tasks || [];
              const completedInPhase = phaseTasks.filter((_, tIdx) => tasks.includes(pIdx + '-' + tIdx)).length;
              const isDone = completedInPhase === phaseTasks.length && phaseTasks.length > 0;
              
              return (
                <details key={pIdx} style={{ background: 'var(--surface)', borderRadius: '16px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', borderLeft: '4px solid ' + (phase.color || 'var(--primary)') }} open={pIdx === 0}>
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
                      const taskId = pIdx + '-' + tIdx;
                      const done = tasks.includes(taskId);
                      return (
                        <div key={tIdx} onClick={() => toggleTask(taskId)} style={{ display: 'flex', gap: '12px', cursor: 'pointer', opacity: done ? 0.6 : 1, transition: 'opacity 0.2s' }}>
                          <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: '2px solid ' + (done ? 'var(--primary)' : 'var(--border-color)'), background: done ? 'var(--primary)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
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

  const proxyUrl = import.meta.env.VITE_AI_PROXY_URL || 'https://api-proxy.johnaprek.workers.dev';

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
            model: 'claude-sonnet-4-5',
            max_tokens: 1000,
            system: "Kamu ahli tanaman berbahasa Indonesia, spesialisasi perawatan tanaman rumahan, jawab singkat dan praktis.",
            messages: apiMessages
          })
        });
        const data = await response.json();
        // Handle both Anthropic error formats
        if (data.type === 'error' || data.error) {
          const errObj = data.error || data;
          const errMsg = typeof errObj === 'object' ? (errObj.message || errObj.type || JSON.stringify(errObj)) : String(errObj);
          throw new Error(errMsg);
        }
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

// --- Care Calendar ---
function CareCalendar() {
  const { favorites } = React.useContext(AppContext);
  const navigate = useNavigate();
  const today = new Date();

  const plants = favorites.length > 0
    ? plantData.filter(p => favorites.includes(p.id))
    : plantData.slice(0, 6);

  const schedule = [];
  plants.forEach(plant => {
    for (let i = 0; i <= 14; i++) {
      const date = addDays(today, i);
      if (i % plant.schedules.watering === 0)
        schedule.push({ date, plant, type: 'siram', icon: '💧', color: '#3b82f6' });
      if (i % plant.schedules.fertilizer === 0 && i > 0)
        schedule.push({ date, plant, type: 'pupuk', icon: '🌿', color: '#22c55e' });
    }
  });
  schedule.sort((a, b) => a.date - b.date);

  const grouped = {};
  schedule.forEach(item => {
    const key = format(item.date, 'EEEE, d MMMM', { locale: localeId });
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(item);
  });

  return (
    <main className="main-content animate-fade-up">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>📅 Kalender Perawatan</h2>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>14 hari ke depan</span>
      </div>

      {favorites.length === 0 && (
        <div style={{ background: 'var(--surface)', borderRadius: '16px', padding: '16px', marginBottom: '20px', border: '1px solid var(--border-color)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          💡 Tambahkan tanaman ke favorit untuk melihat jadwal personalmu. Saat ini menampilkan contoh jadwal.
        </div>
      )}

      {Object.entries(grouped).map(([day, items]) => (
        <div key={day} style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px', paddingBottom: '6px', borderBottom: '1px solid var(--border-color)' }}>{day}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {items.map((item, i) => (
              <div key={i} onClick={() => navigate(`/tanaman/${item.plant.id}`)} style={{ background: 'var(--surface)', borderRadius: '12px', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: 'var(--shadow-sm)', cursor: 'pointer', borderLeft: `4px solid ${item.color}` }}>
                <span style={{ fontSize: '1.4rem' }}>{item.icon}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>{item.plant.name}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{item.type} rutin</p>
                </div>
                <span style={{ fontSize: '0.7rem', background: item.color + '20', color: item.color, padding: '3px 8px', borderRadius: '50px', fontWeight: 700 }}>{item.type}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {Object.keys(grouped).length === 0 && (
        <div style={{ textAlign: 'center', marginTop: '60px', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '3rem', marginBottom: '12px' }}>📭</p>
          <p style={{ fontWeight: 600 }}>Tidak ada jadwal ditemukan.</p>
        </div>
      )}
    </main>
  );
}

