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

import {
  PLANTS, getStrings, CATEGORY_LABEL, CATEGORY_CHIP, DIFFICULTY_LABEL,
  KESULITAN_LABEL, LOCALE, SOIL_GUIDE, buildStaticGuide,
} from './i18n';
import { syncPlantReminders } from './notifications';

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
  'hias-16': '🎻', 'hias-17': '🕷️', 'hias-18': '🪙', 'hias-19': '🌿', 'hias-20': '🪴',
  'hias-21': '📿', 'hias-22': '🌿', 'hias-23': '🌿', 'hias-24': '🌴', 'hias-25': '🌸',
  'hias-26': '🌿', 'hias-27': '🪴',
  'hias-28': '🌿', 'hias-29': '🌿', 'hias-30': '🌴', 'hias-31': '🌿', 'hias-32': '🌿',
  'hias-33': '🌿', 'hias-34': '🌿', 'hias-35': '🌿', 'hias-36': '🌿', 'hias-37': '🌿',
  'hias-38': '🌿', 'hias-39': '🌸', 'hias-40': '🌵', 'hias-41': '🌴', 'hias-42': '🌱',
  'hias-43': '🪴', 'hias-44': '🌲', 'hias-45': '💚',
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
  'herbal-11': '🌿', 'herbal-12': '🌿', 'herbal-13': '🌿', 'herbal-14': '🌿', 'herbal-15': '🌿', 'herbal-16': '🌿',
  'sayur-13': '🥬', 'sayur-14': '🥦', 'sayur-15': '🌶️', 'sayur-16': '🥗', 'sayur-17': '🥒', 'sayur-18': '🥬',
  'buah-17': '🍋', 'buah-18': '🌰', 'buah-19': '🐉', 'buah-20': '🍍', 'buah-21': '🍇', 'buah-22': '🥭',
  'aroma-8': '🌼', 'aroma-9': '🌸', 'aroma-10': '🌹', 'aroma-11': '🌿',
  'obat-11': '🌸', 'obat-12': '🌿',
  'hias-46': '🌿', 'hias-47': '🌸', 'hias-48': '🎋', 'hias-49': '🍃', 'hias-50': '🌿', 'hias-51': '🌿',
  'hias-52': '🌿', 'hias-53': '🌿', 'hias-54': '🌿', 'hias-55': '☕', 'hias-56': '💜', 'hias-57': '🍉',
  'hias-58': '🌵', 'hias-59': '🌵', 'hias-60': '🌿', 'hias-61': '🌿', 'hias-62': '🦌', 'hias-63': '🌿',
  'hias-64': '🌿', 'hias-65': '🌿', 'hias-66': '🌺', 'hias-67': '🌴', 'hias-68': '🌿', 'hias-69': '🌿',
  'hias-70': '🌿', 'hias-71': '🌵', 'hias-72': '🌿', 'hias-73': '🐠', 'hias-74': '🌴', 'hias-75': '💚',
  'buah-23': '🍊', 'buah-24': '🍒', 'buah-25': '🍈', 'buah-26': '🍈', 'buah-27': '🍈', 'buah-28': '🍈',
  'buah-29': '🍈', 'buah-30': '🍈', 'buah-31': '🍇', 'buah-32': '🍈', 'buah-33': '🍈', 'buah-34': '🍊',
  'buah-35': '🥝', 'buah-36': '🍎',
  'sayur-19': '🥦', 'sayur-20': '🥬', 'sayur-21': '🥬', 'sayur-22': '🥬', 'sayur-23': '🌿', 'sayur-24': '🫛',
  'sayur-25': '🍠', 'sayur-26': '🎃', 'sayur-27': '🌽', 'sayur-28': '🧅', 'sayur-29': '🧅', 'sayur-30': '🫘',
  'herbal-17': '🍛', 'herbal-18': '🌿', 'herbal-19': '🍋', 'herbal-20': '🌿', 'herbal-21': '🌿', 'herbal-22': '🌿', 'herbal-23': '🌿', 'herbal-24': '🌿',
  'aroma-12': '🌸', 'aroma-13': '🌿', 'aroma-14': '🌿', 'aroma-15': '🌸', 'aroma-16': '🌼', 'aroma-17': '🌼',
  'obat-13': '🌿', 'obat-14': '🌿', 'obat-15': '🥒', 'obat-16': '🌺', 'obat-17': '🌿', 'obat-18': '🌼',
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
export default function Sprouto() {
  const [isDarkMode, setIsDarkMode] = useLocalStorage('sprouto_theme', false);
  const [favorites, setFavorites] = useLocalStorage('sprouto_favorites', []);
  const [profile, setProfile] = useLocalStorage('sprouto_profile', { name: 'Plant Friend', photo: null });
  const [myGarden, setMyGarden] = useLocalStorage('sprouto_garden', []); // [{id, startDate}]
  const [notifEnabled, setNotifEnabled] = useLocalStorage('sprouto_notif', false);
  const [lang, setLang] = useLocalStorage('sprouto_lang', 'en');
  const [toast, setToast] = useState(null);
  const [onboarded, setOnboarded] = useLocalStorage('sprouto_onboarded', false);

  const L = getStrings(lang);
  const plants = PLANTS[lang];

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    document.documentElement.setAttribute('lang', lang);
  }, [lang]);

  // Native (Capacitor) only: reschedule local care reminders. No-op on web.
  useEffect(() => {
    syncPlantReminders(myGarden, plants, L);
  }, [myGarden, lang]);

  const showToast = (msg) => setToast(msg);

  const toggleFavorite = (id) => {
    if (navigator.vibrate) navigator.vibrate(40);
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(f => f !== id));
      showToast(L.t_fav_removed);
    } else {
      setFavorites([...favorites, id]);
      showToast(L.t_fav_added);
    }
  };

  const addToGarden = (plantId) => {
    if (myGarden.find(g => g.id === plantId)) {
      setMyGarden(myGarden.filter(g => g.id !== plantId));
      showToast(L.t_garden_removed);
    } else {
      setMyGarden([...myGarden, { id: plantId, startDate: new Date().toISOString().split('T')[0] }]);
      showToast(L.t_garden_added);
    }
  };

  // Cek notifikasi saat app dibuka
  useEffect(() => {
    if (!notifEnabled || !('Notification' in window) || Notification.permission !== 'granted') return;
    const today = new Date().toISOString().split('T')[0];
    const lastCheck = localStorage.getItem('sprouto_notif_lastcheck');
    if (lastCheck === today) return; // sudah cek hari ini
    localStorage.setItem('sprouto_notif_lastcheck', today);
    const todayTasks = [];
    myGarden.forEach(({ id, startDate }) => {
      const plant = plants.find(p => p.id === id);
      if (!plant) return;
      const start = new Date(startDate);
      const now = new Date();
      const diffDays = Math.floor((now - start) / 86400000);
      if (plant.schedules.watering > 0 && diffDays % plant.schedules.watering === 0)
        todayTasks.push(L.notif_water(plant.name));
      if (plant.schedules.fertilizer > 0 && diffDays % plant.schedules.fertilizer === 0)
        todayTasks.push(L.notif_fertilize(plant.name));
    });
    if (todayTasks.length > 0) {
      new Notification(L.notif_daily_title, {
        body: todayTasks.slice(0, 3).join('\n') + (todayTasks.length > 3 ? `\n${L.notif_more(todayTasks.length - 3)}` : ''),
        icon: '/pwa-192x192.png', badge: '/pwa-64x64.png'
      });
    }
  }, []);

  const contextValue = {
    isDarkMode, setIsDarkMode,
    favorites, toggleFavorite,
    myGarden, addToGarden,
    notifEnabled, setNotifEnabled,
    profile, setProfile, showToast,
    lang, setLang, L, plants,
  };

  if (!onboarded) {
    return (
      <Onboarding
        lang={lang}
        setLang={setLang}
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
          <Route path="/asisten" element={<CareAssistant />} />
          <Route path="/identifikasi" element={<PlantIdentify />} />
        </Routes>
      </div>
      <BottomNav />
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}

// --- Header ---
function Header() {
  const { isDarkMode, setIsDarkMode, lang, setLang, L } = React.useContext(AppContext);
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
            <img src={`${import.meta.env.BASE_URL}pwa-192x192.png`} alt="Sprouto" width={40} height={40} style={{ borderRadius: '11px', display: 'block', boxShadow: 'var(--shadow-sm)' }} />
            <div>
              <h1>Sprouto</h1>
              <span className="header-subtitle">{L.headerSubtitle}</span>
            </div>
          </div>
        )}
      </div>
      <div className="header-title-row">
        <button className="icon-btn pill" onClick={() => setLang(lang === 'en' ? 'id' : 'en')} style={{ fontWeight: 700, fontSize: '0.75rem', minWidth: '38px' }} aria-label="Switch language">
          {lang === 'en' ? 'EN' : 'ID'}
        </button>
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
  const { L } = React.useContext(AppContext);

  const navItems = [
    { path: '/', icon: <HomeIcon size={22} />, label: L.nav_home },
    { path: '/ensiklopedia', icon: <BookOpen size={22} />, label: L.nav_catalog },
    { path: '/favorit', icon: <Heart size={22} />, label: L.nav_favorites },
    { path: '/panduan', icon: <span style={{fontSize:'1.2rem'}}>📚</span>, label: L.nav_guide },
    { path: '/kalender', icon: <span style={{fontSize:'1.2rem'}}>🪴</span>, label: L.nav_garden }
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
  const { profile, favorites, myGarden, L, plants } = React.useContext(AppContext);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? L.greeting_morning : hour < 15 ? L.greeting_noon : hour < 18 ? L.greeting_evening : L.greeting_night;
  
  // Streak tracking
  const [streakData, setStreakData] = useLocalStorage('sprouto_streak', { count: 0, lastDate: null });
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
        <h2 style={{ fontSize: '1.4rem', fontWeight: '700' }}>{greeting},</h2>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '300', marginBottom: '8px' }}>{profile.name.split(' ')[0]}!</h2>
        <p style={{ opacity: 0.9, fontSize: '0.85rem', maxWidth: '80%' }}>
          {L.hero_subtitle}
        </p>
        <span className="hero-emoji">🌿</span>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-val">{favorites.length}</div>
          <div className="stat-lbl">{L.stat_favorites}</div>
        </div>
        <div className="stat-card" onClick={() => navigate('/kalender')} style={{ cursor: 'pointer' }}>
          <div className="stat-val">{myGarden.length}</div>
          <div className="stat-lbl">{L.stat_garden}</div>
        </div>
        <div className="stat-card" onClick={() => navigate('/ensiklopedia')} style={{ cursor: 'pointer' }}>
          <div className="stat-val">{plants.length}</div>
          <div className="stat-lbl">{L.stat_catalog}</div>
        </div>
        <div className="stat-card">
          <div className="stat-val">🔥 {streakData.count}</div>
          <div className="stat-lbl">{L.stat_streak}</div>
        </div>
      </div>

      <button onClick={() => navigate('/asisten')}
        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left', cursor: 'pointer', marginBottom: IDENTIFY_URL ? '12px' : '24px', background: 'linear-gradient(135deg, var(--primary-dark), var(--primary))', color: 'white', border: 'none', borderRadius: '16px', padding: '14px 16px', boxShadow: 'var(--shadow-sm)' }}>
        <span style={{ fontSize: '1.6rem' }}>🤖</span>
        <span style={{ flex: 1, fontWeight: 700, fontSize: '0.95rem' }}>{L.assistant_cta}</span>
        <span style={{ opacity: 0.8 }}>›</span>
      </button>

      {IDENTIFY_URL && (
        <button onClick={() => navigate('/identifikasi')}
          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left', cursor: 'pointer', marginBottom: '24px', background: 'var(--surface)', color: 'var(--text-main)', border: '1.5px solid var(--border-color)', borderRadius: '16px', padding: '14px 16px', boxShadow: 'var(--shadow-sm)' }}>
          <span style={{ fontSize: '1.6rem' }}>📷</span>
          <span style={{ flex: 1, fontWeight: 700, fontSize: '0.95rem' }}>{L.identify_cta}</span>
          <span style={{ opacity: 0.6 }}>›</span>
        </button>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 style={{ fontSize: '1.1rem' }}>{L.popular_plants}</h3>
        <button style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '600', fontSize: '0.8rem', cursor: 'pointer' }} onClick={() => navigate('/ensiklopedia')}>{L.see_all}</button>
      </div>

      <div className="plant-grid" style={{ marginBottom: '24px' }}>
        {plants.slice(0, 2).map(plant => (
          <PlantCard key={plant.id} plant={plant} onClick={() => navigate(`/tanaman/${plant.id}`)} />
        ))}
      </div>

      <div style={{ backgroundColor: '#fef3c7', borderRadius: '16px', padding: '16px', display: 'flex', gap: '16px', alignItems: 'center', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ backgroundColor: '#f59e0b', color: 'white', padding: '12px', borderRadius: '50%' }}>
          <SunIcon size={24} />
        </div>
        <div>
          <h4 style={{ color: '#92400e', fontSize: '0.95rem', fontWeight: '700', marginBottom: '4px' }}>{L.tip_today_title}</h4>
          <p style={{ color: '#b45309', fontSize: '0.8rem', lineHeight: 1.4 }}>{L.tip_today_body}</p>
        </div>
      </div>
    </main>
  );
}

// --- 2. Ensiklopedia ---
function Encyclopedia() {
  const navigate = useNavigate();
  const { L, lang, plants } = React.useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [activeDiff, setActiveDiff] = useState('Semua');
  const [sortBy, setSortBy] = useState('default');
  const [hidroOnly, setHidroOnly] = useState(false);
  const [petSafeOnly, setPetSafeOnly] = useState(false);
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
    { id: 'Tanaman Hias', icon: '🏠' },
    { id: 'Sayuran', icon: '🥗' },
    { id: 'Buah-buahan', icon: '🍊' },
    { id: 'Obat', icon: '💊' },
    { id: 'Herbal', icon: '🌾' },
    { id: 'Aromaterapi', icon: '💜' }
  ];

  const difficulties = ['Semua', 'mudah', 'sedang', 'sulit'];
  const diffOrder = { mudah: 1, sedang: 2, sulit: 3 };
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  let filtered = plants.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.scientificName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = activeCategory === 'Semua' || p.category === activeCategory;
    const matchDiff = activeDiff === 'Semua' || p.difficulty === activeDiff;
    const matchHidro = !hidroOnly || (p.hidroponik && p.hidroponik.bisa_hidroponik === true);
    const matchPetSafe = !petSafeOnly || (p.toxicity && p.toxicity.pets === 'non-toxic');
    return matchSearch && matchCat && matchDiff && matchHidro && matchPetSafe;
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
          {L.reloading}
        </div>
      )}
      <div className="search-wrapper">
        <Search size={20} className="search-icon" />
        <input
          type="text"
          placeholder={L.search_placeholder}
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
              <span>{c.icon}</span> {CATEGORY_CHIP[lang][c.id]}
            </button>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
        <div className="filter-scroll" style={{ flex: 1, marginBottom: 0 }}>
          {difficulties.map(d => (
            <button key={d} className={`filter-chip ${activeDiff === d ? 'active' : ''}`} onClick={() => setActiveDiff(d)} style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '8px' }}>
              {d === 'Semua' ? L.all_levels : cap(DIFFICULTY_LABEL[lang][d])}
            </button>
          ))}
        </div>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--surface)', color: 'var(--text-main)', fontSize: '0.75rem', fontFamily: 'inherit', flexShrink: 0, cursor: 'pointer' }}>
          <option value="default">{L.sort_default}</option>
          <option value="az">{L.sort_az}</option>
          <option value="mudah">{L.sort_easiest}</option>
          <option value="sulit">{L.sort_hardest}</option>
          <option value="hidro">{L.sort_hydro}</option>
        </select>
      </div>
      <div style={{ marginBottom: '12px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
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
          💧 {hidroOnly ? L.hydro_on : L.hydro_can}
          {hidroOnly && <span style={{ fontSize: '0.7rem', background: '#0891b2', color: 'white', borderRadius: '50%', width: '16px', height: '16px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>✓</span>}
        </button>
        <button
          onClick={() => setPetSafeOnly(v => !v)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '6px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600,
            border: '1.5px solid', cursor: 'pointer', transition: 'all 0.2s',
            borderColor: petSafeOnly ? '#16a34a' : 'var(--border-color)',
            background: petSafeOnly ? '#dcfce7' : 'var(--surface)',
            color: petSafeOnly ? '#166534' : 'var(--text-muted)',
          }}
        >
          🐾 {petSafeOnly ? L.pet_safe_on : L.pet_safe}
          {petSafeOnly && <span style={{ fontSize: '0.7rem', background: '#16a34a', color: 'white', borderRadius: '50%', width: '16px', height: '16px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>✓</span>}
        </button>
        {(hidroOnly || petSafeOnly) && (
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {filtered.length} {L.plants_match}
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
            <p style={{ gridColumn: '1 / -1', textAlign: 'center', marginTop: '40px', color: 'var(--text-muted)' }}>{L.no_plants}</p>
          )}
        </div>
      )}
    </main>
  );
}

// Resolve a plant image: absolute (http) URLs as-is, local paths against BASE_URL.
const plantImg = (p) => p.imageUrl ? (p.imageUrl.startsWith('http') ? p.imageUrl : import.meta.env.BASE_URL + p.imageUrl) : '';

const CATEGORY_GRADIENT = {
  'Tanaman Hias': 'linear-gradient(160deg, #1a472a, #2d6a4f)',
  'Sayuran':      'linear-gradient(160deg, #1a3a1a, #2d5a1a)',
  'Obat':         'linear-gradient(160deg, #1a3a2a, #1a5c3a)',
  'Herbal':       'linear-gradient(160deg, #2d4a1a, #3d6b2a)',
  'Aromaterapi':  'linear-gradient(160deg, #3a1a4a, #5c2a6b)',
  'Buah-buahan':  'linear-gradient(160deg, #7c2d12, #c2410c)',
};

function PlantCard({ plant, onClick }) {
  const { favorites, toggleFavorite, L, lang } = React.useContext(AppContext);
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
            src={plantImg(plant)}
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
          <Droplets size={12} /> {L.every_n_days(plant.schedules.watering)}
        </div>
      </div>

      {/* Badge top-left */}
      <div className="card-badge-top-left" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span className={`badge ${plant.difficulty}`}>{DIFFICULTY_LABEL[lang][plant.difficulty]}</span>
        {plant.hidroponik && plant.hidroponik.bisa_hidroponik && (
          <span style={{ background: 'rgba(8,145,178,0.85)', color: 'white', fontSize: '0.6rem', fontWeight: 700, padding: '2px 6px', borderRadius: '6px', backdropFilter: 'blur(4px)' }}>💧 {L.badge_hydro}</span>
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

// --- AI Care Assistant proxy ---
// This is the deployed Cloudflare WORKER URL (e.g. https://sprouto-ai.<sub>.workers.dev).
// NOT an API key — the API key only ever lives in Cloudflare (see workers/README.md).
// Empty = deterministic instant answers only.
const AI_PROXY_URL = 'https://sprouto-ai.johnaprek.workers.dev';

// --- Plant identification (camera) ---
// Your worker's /identify endpoint (Pl@ntNet). Empty = camera ID hidden.
const IDENTIFY_URL = 'https://sprouto-ai.johnaprek.workers.dev/identify';

// --- Affiliate / marketplace supply links ---
// Set amazonTag to your Amazon Associates tag to monetize EN links.
const AFFILIATE = { amazonTag: '' };
function supplyUrl(query, lang) {
  if (lang === 'id') return 'https://www.tokopedia.com/search?st=product&q=' + encodeURIComponent(query);
  const tag = AFFILIATE.amazonTag ? '&tag=' + encodeURIComponent(AFFILIATE.amazonTag) : '';
  return 'https://www.amazon.com/s?k=' + encodeURIComponent(query) + tag;
}
function supplyItems(plant, L, lang) {
  const items = [
    { label: L.supply_soil, q: lang === 'id' ? 'media tanam' : 'potting mix soil' },
    { label: L.supply_pot, q: lang === 'id' ? 'pot tanaman drainase' : 'plant pot with drainage' },
    { label: L.supply_fertilizer, q: lang === 'id' ? 'pupuk tanaman' : 'indoor plant fertilizer' },
  ];
  if (plant.hidroponik && plant.hidroponik.bisa_hidroponik) {
    items.push({ label: L.supply_rockwool, q: lang === 'id' ? 'rockwool hidroponik' : 'rockwool hydroponic' });
    items.push({ label: L.supply_nutrient, q: lang === 'id' ? 'nutrisi ab mix hidroponik' : 'ab mix hydroponic nutrient' });
  }
  return items;
}

// --- 3. Plant Detail ---
function PlantDetail() {
  const { id } = useParams();
  const { favorites, toggleFavorite, myGarden, addToGarden, showToast, L, lang, plants } = React.useContext(AppContext);
  const navigate = useNavigate();
  const plant = plants.find(p => p.id === id);

  if (!plant) return <div className="main-content">{L.plant_not_found}</div>;

  const isFav = favorites.includes(id);
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  const handleShare = async () => {
    const shareData = {
      title: plant.name,
      text: L.share_text(plant),
      url: window.location.href
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch (e) { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
      showToast(L.t_link_copied);
    }
  };

  return (
    <div className="animate-fade-up" style={{ paddingBottom: '40px' }}>
      <div className="detail-hero">
        {plant.imageUrl ? (
          <img
            src={plantImg(plant)}
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
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>{CATEGORY_LABEL[lang][plant.category]}</span>
          <span className={`badge ${plant.difficulty}`}>{DIFFICULTY_LABEL[lang][plant.difficulty]}</span>
        </div>
        
        <h2 style={{ fontSize: '2rem', fontWeight: '700', lineHeight: 1.2 }}>{plant.name}</h2>
        <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', marginBottom: '16px' }}>{plant.scientificName}</p>
        <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--text-main)', marginBottom: '24px' }}>{plant.description}</p>

        <div className="info-grid-2x2">
          <div className="info-box">
            <Droplets size={24} color="var(--accent)" />
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{L.label_watering}</p>
              <p style={{ fontSize: '0.9rem', fontWeight: '700' }}>{L.every_n_days_once(plant.schedules.watering)}</p>
            </div>
          </div>
          <div className="info-box">
            <SunIcon size={24} color="#f59e0b" />
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{L.label_light}</p>
              <p style={{ fontSize: '0.9rem', fontWeight: '700' }}>{plant.careDetails.sunlight.split(' ')[0]}</p>
            </div>
          </div>
          <div className="info-box">
            <Activity size={24} color="var(--primary)" />
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{L.label_difficulty}</p>
              <p style={{ fontSize: '0.9rem', fontWeight: '700', textTransform: 'capitalize' }}>{DIFFICULTY_LABEL[lang][plant.difficulty]}</p>
            </div>
          </div>
          <div className="info-box">
            <Calendar size={24} color="#6366f1" />
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{L.label_fertilizer}</p>
              <p style={{ fontSize: '0.9rem', fontWeight: '700' }}>{L.every_n_days_once(plant.schedules.fertilizer)}</p>
            </div>
          </div>
        </div>

        {plant.toxicity && (() => {
          const cfg = {
            'toxic':     { bg: '#fee2e2', fg: '#991b1b', border: '#ef4444', icon: '⚠️', label: L.tox_toxic },
            'caution':   { bg: '#fef3c7', fg: '#92400e', border: '#f59e0b', icon: '⚠️', label: L.tox_caution },
            'non-toxic': { bg: '#dcfce7', fg: '#166534', border: '#16a34a', icon: '✅', label: L.tox_nontoxic },
          }[plant.toxicity.pets];
          if (!cfg) return null;
          return (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', background: cfg.bg, borderLeft: `4px solid ${cfg.border}`, borderRadius: '14px', padding: '12px 14px', marginBottom: '24px' }}>
              <span style={{ fontSize: '1.6rem', flexShrink: 0 }}>🐾</span>
              <div>
                <p style={{ fontSize: '0.72rem', fontWeight: 700, color: cfg.fg, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{cfg.icon} {L.tox_title}: {cfg.label}</p>
                <p style={{ fontSize: '0.82rem', color: '#374151', lineHeight: 1.45, marginTop: '2px' }}>{plant.toxicity.note}</p>
                <p style={{ fontSize: '0.68rem', color: '#6b7280', marginTop: '4px', fontStyle: 'italic' }}>{L.tox_disclaimer}</p>
              </div>
            </div>
          );
        })()}

        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
          <button className="btn-primary" onClick={() => addToGarden(id)}
            style={{ flex: 1, background: myGarden.find(g=>g.id===id) ? '#16a34a' : 'var(--primary)' }}>
            <span>{myGarden.find(g=>g.id===id) ? '✅' : '🪴'}</span>
            {myGarden.find(g=>g.id===id) ? L.in_garden : L.add_to_garden}
          </button>
          <button className="btn-primary" onClick={handleShare} style={{ flex: 1, background: 'var(--surface)', color: 'var(--primary)', border: '2px solid var(--primary)', boxShadow: 'none' }}>
            <Star size={20} /> {L.share}
          </button>
        </div>

        <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>{L.care_tips}</h3>
        <ul className="tips-list">
          <li><strong>{L.tip_watering}:</strong> {plant.careDetails.watering}</li>
          <li><strong>{L.tip_light}:</strong> {plant.careDetails.sunlight}</li>
          <li><strong>{L.tip_fertilizing}:</strong> {plant.careDetails.fertilizer}</li>
          <li><strong>{L.tip_pruning}:</strong> {plant.careDetails.pruning}</li>
        </ul>

        {/* --- PERLENGKAPAN (AFFILIATE) --- */}
        <div style={{ marginTop: '28px' }}>
          <h3 style={{ fontSize: '1.05rem', marginBottom: '12px' }}>{L.supplies_title}</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {supplyItems(plant, L, lang).map((s, i) => (
              <a key={i} href={supplyUrl(s.q, lang)} target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none', border: '1.5px solid var(--border-color)', background: 'var(--surface)', color: 'var(--text-main)' }}>
                {s.label} <span style={{ opacity: 0.5, fontSize: '0.75rem' }}>↗</span>
              </a>
            ))}
          </div>
        </div>

        {/* --- PANDUAN MENANAM STATIS --- */}
        <PlantGuideSection plant={plant} />

        {/* --- JURNAL TANAMAN --- */}
        <PlantJournal plantId={id} />

        {/* --- CARA PENANAMAN (3 METODE) --- */}
        {plant.hidroponik && (
          <div style={{ marginTop: '32px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.3rem' }}>💧</span> {L.hydro_how}
            </h3>

            {!plant.hidroponik.bisa_hidroponik ? (
              <div style={{ background: 'var(--surface)', borderRadius: '16px', padding: '16px', border: '1px solid var(--border-color)', borderLeft: '4px solid #f59e0b' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>⚠️</span>
                  <div>
                    <p style={{ fontWeight: '700', fontSize: '0.95rem', color: '#92400e', marginBottom: '6px' }}>{L.hydro_not_recommended}</p>
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
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>{L.hydro_method_recommended}</p>
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
                      {KESULITAN_LABEL[lang][plant.hidroponik.kesulitan] || plant.hidroponik.kesulitan}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{L.hydro_media}:</span> {plant.hidroponik.media}
                  </p>
                </div>

                {/* Info grid: pH, nutrisi, waktu panen */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div style={{ background: 'var(--surface)', borderRadius: '12px', padding: '12px', boxShadow: 'var(--shadow-sm)', textAlign: 'center' }}>
                    <p style={{ fontSize: '1.3rem', marginBottom: '2px' }}>🧪</p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>{L.hydro_ph}</p>
                    <p style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--primary)' }}>{plant.hidroponik.ph_ideal}</p>
                  </div>
                  <div style={{ background: 'var(--surface)', borderRadius: '12px', padding: '12px', boxShadow: 'var(--shadow-sm)', textAlign: 'center' }}>
                    <p style={{ fontSize: '1.3rem', marginBottom: '2px' }}>⏱️</p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>{L.hydro_harvest}</p>
                    <p style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--primary)', lineHeight: 1.3 }}>{plant.hidroponik.waktu_panen.split('—')[0].trim()}</p>
                  </div>
                </div>

                {/* Nutrisi */}
                <div style={{ background: 'var(--surface)', borderRadius: '12px', padding: '14px', boxShadow: 'var(--shadow-sm)', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>🌿</span>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', marginBottom: '3px' }}>{L.hydro_nutrient}</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.5 }}>{plant.hidroponik.nutrisi}</p>
                  </div>
                </div>

                {/* Tips */}
                <div style={{ background: 'linear-gradient(135deg, var(--primary-dark), var(--primary))', borderRadius: '14px', padding: '16px', color: 'white' }}>
                  <p style={{ fontWeight: '700', fontSize: '0.85rem', marginBottom: '8px', opacity: 0.85, textTransform: 'uppercase', letterSpacing: '0.5px' }}>💡 {L.hydro_tips}</p>
                  <p style={{ fontSize: '0.88rem', lineHeight: 1.7, opacity: 0.95 }}>{plant.hidroponik.tips}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Related Plants */}
        {(() => {
          const related = plants.filter(p => p.category === plant.category && p.id !== plant.id).slice(0, 4);
          if (related.length === 0) return null;
          return (
            <div style={{ marginTop: '32px' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '12px' }}>{L.similar_plants}</h3>
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


// --- Static PlantGuideSection ---
// --- Plant Journal (notes + photos + timeline, per plant) ---
function PlantJournal({ plantId }) {
  const { L, lang } = React.useContext(AppContext);
  const [entries, setEntries] = useLocalStorage('sprouto_journal_' + plantId, []);
  const [note, setNote] = useState('');
  const [photo, setPhoto] = useState(null);
  const fileRef = useRef(null);

  const onPhoto = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const MAX = 800;
        let { width, height } = img;
        if (width > MAX || height > MAX) {
          const r = Math.min(MAX / width, MAX / height);
          width = Math.round(width * r); height = Math.round(height * r);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width; canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        setPhoto(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const addEntry = () => {
    if (!note.trim() && !photo) return;
    const entry = { id: Date.now(), date: new Date().toISOString(), note: note.trim(), photo };
    setEntries([entry, ...entries]);
    setNote(''); setPhoto(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const removeEntry = (id) => setEntries(entries.filter(e => e.id !== id));
  const fmt = (iso) => new Date(iso).toLocaleDateString(LOCALE[lang], { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div style={{ marginTop: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 style={{ fontSize: '1.2rem' }}>📔 {L.journal_title}</h3>
        {entries.length > 0 && <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)' }}>{entries.length}</span>}
      </div>

      <div style={{ background: 'var(--surface)', borderRadius: '16px', padding: '14px', boxShadow: 'var(--shadow-sm)', marginBottom: '16px' }}>
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder={L.journal_add_note}
          rows={2}
          style={{ width: '100%', resize: 'vertical', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '10px', fontSize: '0.85rem', fontFamily: 'inherit', background: 'var(--bg)', color: 'var(--text-main)', boxSizing: 'border-box' }}
        />
        {photo && (
          <div style={{ position: 'relative', marginTop: '10px', display: 'inline-block' }}>
            <img src={photo} alt="" style={{ height: '72px', borderRadius: '10px', display: 'block' }} />
            <button onClick={() => { setPhoto(null); if (fileRef.current) fileRef.current.value = ''; }}
              style={{ position: 'absolute', top: '-8px', right: '-8px', width: '22px', height: '22px', borderRadius: '50%', border: 'none', background: '#ef4444', color: 'white', cursor: 'pointer', fontSize: '0.8rem', lineHeight: 1 }}>×</button>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', gap: '8px' }}>
          <button onClick={() => fileRef.current && fileRef.current.click()}
            style={{ background: 'none', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '8px 12px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', cursor: 'pointer' }}>
            📷 {L.journal_add_photo}
          </button>
          <input ref={fileRef} type="file" accept="image/*" onChange={onPhoto} style={{ display: 'none' }} />
          <button onClick={addEntry} disabled={!note.trim() && !photo}
            style={{ background: (!note.trim() && !photo) ? 'var(--border-color)' : 'var(--primary)', color: 'white', border: 'none', borderRadius: '10px', padding: '8px 18px', fontSize: '0.82rem', fontWeight: 700, cursor: (!note.trim() && !photo) ? 'default' : 'pointer' }}>
            {L.journal_save}
          </button>
        </div>
      </div>

      {entries.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', padding: '8px 0 4px' }}>{L.journal_empty}</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {entries.map(en => (
            <div key={en.id} style={{ background: 'var(--surface)', borderRadius: '14px', padding: '12px 14px', boxShadow: 'var(--shadow-sm)', borderLeft: '3px solid var(--primary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: en.note || en.photo ? '6px' : 0 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>{fmt(en.date)}</span>
                <button onClick={() => removeEntry(en.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', opacity: 0.6 }} aria-label={L.journal_delete}>🗑️</button>
              </div>
              {en.note && <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{en.note}</p>}
              {en.photo && <img src={en.photo} alt="" style={{ marginTop: en.note ? '8px' : 0, width: '100%', borderRadius: '10px', display: 'block' }} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PlantGuideSection({ plant }) {
  const { L, lang } = React.useContext(AppContext);
  const [tasks, setTasks] = useLocalStorage('guide_' + plant.id + '_tasks', []);
  const guide = buildStaticGuide(plant, lang);

  const toggleTask = (taskId) => {
    setTasks(prev => prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]);
  };

  const totalTasks = guide.phases.reduce((s, p) => s + p.tasks.length, 0);
  const pct = totalTasks > 0 ? Math.round((tasks.length / totalTasks) * 100) : 0;

  return (
    <div style={{ marginTop: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 style={{ fontSize: '1.2rem' }}>{L.guide_title}</h3>
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)' }}>{pct}% {L.guide_done}</span>
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
  const { favorites, L, plants } = React.useContext(AppContext);
  const navigate = useNavigate();
  const favPlants = plants.filter(p => favorites.includes(p.id));

  return (
    <main className="main-content animate-fade-up">
      <h2 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '4px' }}>{L.fav_title}</h2>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>{L.fav_subtitle}</p>
      {favPlants.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '60px' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: 'var(--shadow-sm)' }}>
            <Heart size={36} color="var(--border-color)" />
          </div>
          <p style={{ fontSize: '1rem', fontWeight: '500' }}>{L.fav_empty_title}</p>
          <p style={{ fontSize: '0.85rem', marginTop: '8px' }}>{L.fav_empty_sub}</p>
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
  const { myGarden, addToGarden, notifEnabled, setNotifEnabled, showToast, L, lang, plants } = React.useContext(AppContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('jadwal');
  const taskLabel = { siram: L.task_water, pupuk: L.task_fertilize, pangkas: L.task_prune };

  const today = new Date();
  today.setHours(0,0,0,0);

  const schedule = [];
  for (let d = 0; d < 7; d++) {
    const date = new Date(today);
    date.setDate(today.getDate() + d);
    const tasks = [];
    myGarden.forEach(({ id, startDate }) => {
      const plant = plants.find(p => p.id === id);
      if (!plant) return;
      const start = new Date(startDate);
      start.setHours(0,0,0,0);
      const diff = Math.floor((date - start) / 86400000);
      if (diff < 0) return;
      if (plant.schedules.watering > 0 && diff % plant.schedules.watering === 0)
        tasks.push({ plant, type: 'siram', icon: '💧', color: '#2563eb' });
      if (plant.schedules.fertilizer > 0 && diff % plant.schedules.fertilizer === 0)
        tasks.push({ plant, type: 'pupuk', icon: '🌿', color: '#16a34a' });
      if (plant.schedules.pruning > 0 && diff % plant.schedules.pruning === 0)
        tasks.push({ plant, type: 'pangkas', icon: '✂️', color: '#7c3aed' });
    });
    schedule.push({ date, tasks });
  }

  const totalToday = schedule[0]?.tasks.length || 0;
  const dayLabel = (date, i) => {
    if (i === 0) return L.today;
    if (i === 1) return L.tomorrow;
    return date.toLocaleDateString(LOCALE[lang], { weekday: 'short', day: 'numeric', month: 'short' });
  };

  const enableNotif = async () => {
    if (!('Notification' in window)) { showToast(L.t_notif_unsupported); return; }
    const perm = await Notification.requestPermission();
    if (perm === 'granted') {
      setNotifEnabled(true);
      showToast(L.t_notif_enabled);
      new Notification('🌱 Sprouto', { body: L.notif_welcome_body, icon: '/pwa-192x192.png' });
    } else { showToast(L.t_notif_denied); }
  };

  return (
    <main className="main-content animate-fade-up">
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '4px' }}>{L.garden_title}</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{L.garden_summary(myGarden.length, totalToday)}</p>
      </div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {[['jadwal', L.tab_schedule],['kebunku', L.tab_collection]].map(([key,label]) => (
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
                <p style={{ fontWeight: 700, fontSize: '0.85rem', color: '#713f12' }}>{L.notif_enable_title}</p>
                <p style={{ fontSize: '0.75rem', color: '#92400e' }}>{L.notif_enable_sub}</p>
              </div>
              <button onClick={enableNotif} style={{ background: '#ca8a04', color: 'white', border: 'none', borderRadius: '8px', padding: '6px 12px', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}>{L.notif_enable_btn}</button>
            </div>
          )}
          {myGarden.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: '60px', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '3rem', marginBottom: '12px' }}>🪴</p>
              <p style={{ fontWeight: 600, marginBottom: '8px' }}>{L.garden_empty_title}</p>
              <p style={{ fontSize: '0.85rem', marginBottom: '20px' }}>{L.garden_empty_sub}</p>
              <button className="btn-primary" style={{ width: 'auto', padding: '10px 24px' }} onClick={() => navigate('/ensiklopedia')}>{L.explore_plants}</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {schedule.map(({ date, tasks }, i) => (
                <div key={i} style={{ background: 'var(--surface)', borderRadius: '14px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', opacity: tasks.length === 0 ? 0.5 : 1 }}>
                  <div style={{ padding: '10px 14px', background: i === 0 ? 'var(--primary)' : 'transparent', borderBottom: tasks.length > 0 ? '1px solid var(--border-color)' : 'none' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem', color: i === 0 ? 'white' : 'var(--text-muted)' }}>
                      {dayLabel(date, i)}
                      {tasks.length > 0 && <span style={{ marginLeft: '8px', background: i===0?'rgba(255,255,255,0.25)':'var(--primary)', color: 'white', borderRadius: '50px', padding: '1px 8px', fontSize: '0.7rem' }}>{L.n_tasks(tasks.length)}</span>}
                      {tasks.length === 0 && <span style={{ marginLeft: '8px', fontSize: '0.75rem', opacity: 0.6 }}>{L.no_tasks}</span>}
                    </span>
                  </div>
                  {tasks.length > 0 && (
                    <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {tasks.map((t, ti) => (
                        <div key={ti} onClick={() => navigate(`/tanaman/${t.plant.id}`)} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '8px 10px', borderRadius: '10px', background: 'var(--bg)', borderLeft: `3px solid ${t.color}` }}>
                          <span style={{ fontSize: '1.2rem' }}>{t.icon}</span>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontWeight: 700, fontSize: '0.85rem' }}>{t.plant.name}</p>
                            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{taskLabel[t.type]}</p>
                          </div>
                          <span style={{ fontSize: '0.65rem', background: t.color+'20', color: t.color, padding: '3px 8px', borderRadius: '50px', fontWeight: 700 }}>{taskLabel[t.type]}</span>
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
              <p style={{ fontWeight: 600 }}>{L.coll_empty_title}</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {myGarden.map(({ id, startDate }) => {
                const plant = plants.find(p => p.id === id);
                if (!plant) return null;
                const days = Math.floor((new Date() - new Date(startDate)) / 86400000);
                return (
                  <div key={id} style={{ background: 'var(--surface)', borderRadius: '14px', padding: '14px', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', overflow: 'hidden', background: CATEGORY_GRADIENT[plant.category], flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem' }}>
                      {plant.imageUrl ? <img src={plantImg(plant)} alt={plant.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display='none'; }} /> : EMOJI_MAP[plant.id] || '🌿'}
                    </div>
                    <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => navigate(`/tanaman/${id}`)}>
                      <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>{plant.name}</p>
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {L.started}: {new Date(startDate).toLocaleDateString(LOCALE[lang], { day: 'numeric', month: 'short', year: 'numeric' })} · {days} {L.days}
                      </p>
                    </div>
                    <button onClick={() => addToGarden(id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', fontSize: '1.1rem' }}>🗑️</button>
                  </div>
                );
              })}
            </div>
          )}
          {myGarden.length > 0 && (
            <button className="btn-primary" style={{ marginTop: '16px', background: 'var(--surface)', color: 'var(--primary)', border: '2px solid var(--primary)', boxShadow: 'none' }} onClick={() => navigate('/ensiklopedia')}>{L.add_plant}</button>
          )}
        </div>
      )}
    </main>
  );
}

// --- Care Assistant (grounded, deterministic; LLM upgrade documented in NOTIFICATIONS/PRD) ---
function CareAssistant() {
  const { L, lang, plants } = React.useContext(AppContext);
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [result, setResult] = useState(null);
  const [aiAnswer, setAiAnswer] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  const plantContext = (p) => [
    `Plant: ${p.name} (${p.scientificName})`,
    `Category: ${p.category}; Difficulty: ${p.difficulty}`,
    `Watering: every ${p.schedules.watering} days — ${p.careDetails.watering}`,
    `Light: ${p.careDetails.sunlight}`,
    `Fertilizer: every ${p.schedules.fertilizer} days — ${p.careDetails.fertilizer}`,
    `Pruning: ${p.careDetails.pruning}`,
    `Common problems: ${p.careDetails.commonProblems}`,
    `Pet safety: ${p.toxicity.pets} — ${p.toxicity.note}`,
    `Hydroponics: ${p.hidroponik.bisa_hidroponik ? `${p.hidroponik.metode}; ${p.hidroponik.tips}` : `not suitable; ${p.hidroponik.tips}`}`,
  ].join('\n');

  const askAI = async () => {
    if (!AI_PROXY_URL || !q.trim()) return;
    setAiLoading(true); setAiAnswer(null);
    try {
      const res = await fetch(AI_PROXY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, context: result?.plant ? plantContext(result.plant) : '', lang }),
      });
      const data = await res.json();
      setAiAnswer(data.answer ? { text: data.answer } : { error: true });
    } catch {
      setAiAnswer({ error: true });
    } finally {
      setAiLoading(false);
    }
  };

  const run = () => {
    setAiAnswer(null);
    const query = ' ' + q.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ') + ' ';
    // Match a plant: longest common-name match wins, then genus, then a significant word.
    let plant = null, best = 0;
    for (const p of plants) {
      const n = p.name.toLowerCase();
      if (query.includes(' ' + n + ' ') || query.includes(n)) { if (n.length > best) { plant = p; best = n.length; } }
    }
    if (!plant) {
      for (const p of plants) {
        const genus = p.scientificName.toLowerCase().split(' ')[0];
        if (genus.length > 3 && query.includes(genus)) { plant = p; break; }
      }
    }
    if (!plant) {
      for (const p of plants) {
        const words = p.name.toLowerCase().split(/[^a-z]+/).filter(w => w.length > 3);
        if (words.some(w => query.includes(' ' + w + ' '))) { plant = p; break; }
      }
    }
    const has = (...ws) => ws.some(w => query.includes(w));
    let intent = null;
    if (has('water', 'siram', 'penyiram', 'thirst')) intent = 'watering';
    else if (has('light', 'cahaya', 'matahari', ' sun', 'shade', 'teduh')) intent = 'sunlight';
    else if (has('fertil', 'pupuk', 'feed', 'nutrien', 'nutrisi')) intent = 'fertilizer';
    else if (has('toxic', 'poison', 'safe', ' pet', ' cat', ' dog', 'kucing', 'anjing', 'racun', 'beracun', 'aman')) intent = 'toxicity';
    else if (has('prune', 'pangkas', 'trim', 'potong')) intent = 'pruning';
    else if (has('problem', 'masalah', 'yellow', 'kuning', 'wilt', 'layu', 'pest', 'hama', 'sick', 'dying', 'wrong')) intent = 'commonProblems';
    setResult({ plant, intent });
  };

  const answerFor = (plant, intent) => {
    const tox = { toxic: L.tox_toxic, 'non-toxic': L.tox_nontoxic, caution: L.tox_caution };
    switch (intent) {
      case 'watering': return [{ label: L.tip_watering, text: `${L.every_n_days_once(plant.schedules.watering)} — ${plant.careDetails.watering}` }];
      case 'sunlight': return [{ label: L.tip_light, text: plant.careDetails.sunlight }];
      case 'fertilizer': return [{ label: L.tip_fertilizing, text: `${L.every_n_days_once(plant.schedules.fertilizer)} — ${plant.careDetails.fertilizer}` }];
      case 'pruning': return [{ label: L.tip_pruning, text: plant.careDetails.pruning }];
      case 'commonProblems': return [{ label: L.care_tips, text: plant.careDetails.commonProblems }];
      case 'toxicity': return [{ label: L.tox_title, text: `${tox[plant.toxicity.pets]} — ${plant.toxicity.note}` }];
      default: return [
        { label: L.tip_watering, text: L.every_n_days_once(plant.schedules.watering) },
        { label: L.tip_light, text: plant.careDetails.sunlight },
        { label: L.tox_title, text: `${tox[plant.toxicity.pets]} — ${plant.toxicity.note}` },
      ];
    }
  };

  const aiButton = AI_PROXY_URL ? (
    <button onClick={askAI} disabled={aiLoading} style={{ background: 'linear-gradient(135deg, var(--primary-dark), var(--primary))', color: 'white', border: 'none', borderRadius: '10px', padding: '8px 14px', fontWeight: 700, fontSize: '0.8rem', cursor: aiLoading ? 'default' : 'pointer', opacity: aiLoading ? 0.7 : 1 }}>
      {aiLoading ? L.assistant_ai_thinking : L.assistant_ask_ai}
    </button>
  ) : null;

  const aiBlock = aiAnswer ? (
    <div style={{ marginTop: '14px', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
      <p style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--primary)', marginBottom: '4px' }}>✨ Sprouto AI</p>
      {aiAnswer.error
        ? <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{L.assistant_ai_error}</p>
        : <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: 1.55, whiteSpace: 'pre-wrap' }}>{aiAnswer.text}</p>}
    </div>
  ) : null;

  return (
    <main className="main-content animate-fade-up">
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '6px' }}>{L.assistant_title}</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{L.assistant_sub}</p>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') run(); }}
          placeholder={L.assistant_placeholder}
          style={{ flex: 1, border: '1px solid var(--border-color)', borderRadius: '12px', padding: '12px 14px', fontSize: '0.9rem', background: 'var(--surface)', color: 'var(--text-main)', fontFamily: 'inherit' }}
        />
        <button onClick={run} style={{ background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '12px', padding: '0 20px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}>{L.assistant_ask}</button>
      </div>

      {result && (
        result.plant ? (
          <div style={{ background: 'var(--surface)', borderRadius: '16px', padding: '16px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <span style={{ fontSize: '1.6rem' }}>{EMOJI_MAP[result.plant.id] || '🌿'}</span>
              <div>
                <p style={{ fontWeight: 700, fontSize: '1rem' }}>{result.plant.name}</p>
                <p style={{ fontSize: '0.75rem', fontStyle: 'italic', color: 'var(--text-muted)' }}>{result.plant.scientificName}</p>
              </div>
            </div>
            {!result.intent && <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '8px' }}>{L.assistant_summary}:</p>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {answerFor(result.plant, result.intent).map((a, i) => (
                <div key={i} style={{ borderLeft: '3px solid var(--primary)', paddingLeft: '12px' }}>
                  <p style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--primary)' }}>{a.label}</p>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: 1.5 }}>{a.text}</p>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '14px', flexWrap: 'wrap' }}>
              <button onClick={() => navigate(`/tanaman/${result.plant.id}`)} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', padding: 0 }}>{L.assistant_open}</button>
              {aiButton}
            </div>
            {aiBlock}
          </div>
        ) : (
          <div style={{ background: 'var(--surface)', borderRadius: '16px', padding: '16px', boxShadow: 'var(--shadow-sm)' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: aiButton ? '12px' : 0 }}>{L.assistant_no_plant}</p>
            {aiButton}
            {aiBlock}
          </div>
        )
      )}

      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '20px', lineHeight: 1.5 }}>{L.assistant_note}</p>
    </main>
  );
}

// --- Plant identification from a photo (Pl@ntNet via worker) ---
function PlantIdentify() {
  const { L, plants } = React.useContext(AppContext);
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null); // array | 'error' | null

  const matchPlant = (sci) => {
    const s = (sci || '').toLowerCase().trim();
    if (!s) return null;
    return plants.find(p => p.scientificName.toLowerCase() === s)
      || plants.find(p => p.scientificName.toLowerCase().split(' ')[0] === s.split(' ')[0]);
  };

  const identify = async (dataUrl) => {
    if (!IDENTIFY_URL) return;
    setLoading(true); setResults(null);
    try {
      const res = await fetch(IDENTIFY_URL, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: dataUrl, organ: 'auto' }),
      });
      const data = await res.json();
      setResults(Array.isArray(data.results) ? data.results : 'error');
    } catch { setResults('error'); }
    finally { setLoading(false); }
  };

  const onPhoto = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const MAX = 1024;
        let { width, height } = img;
        if (width > MAX || height > MAX) { const r = Math.min(MAX / width, MAX / height); width = Math.round(width * r); height = Math.round(height * r); }
        const canvas = document.createElement('canvas');
        canvas.width = width; canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setPreview(dataUrl);
        identify(dataUrl);
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <main className="main-content animate-fade-up">
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '6px' }}>{L.identify_title}</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{L.identify_sub}</p>
      </div>

      <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={onPhoto} style={{ display: 'none' }} />
      <button onClick={() => fileRef.current && fileRef.current.click()} className="btn-primary" style={{ width: '100%', marginBottom: '16px' }}>
        {L.identify_take}
      </button>

      {preview && (
        <div style={{ marginBottom: '16px', textAlign: 'center' }}>
          <img src={preview} alt="" style={{ maxWidth: '100%', maxHeight: '240px', borderRadius: '14px' }} />
        </div>
      )}

      {loading && <p style={{ textAlign: 'center', color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem' }}>{L.identify_analyzing}</p>}

      {results === 'error' && <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', padding: '4px' }}>{L.identify_error}</p>}

      {Array.isArray(results) && (results.length === 0
        ? <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6, padding: '4px' }}>{L.identify_none}</p>
        : (
          <div>
            <p style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: '10px' }}>{L.identify_results}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {results.map((r, i) => {
                const m = matchPlant(r.scientificName);
                return (
                  <div key={i} style={{ background: 'var(--surface)', borderRadius: '14px', padding: '12px 14px', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ flexShrink: 0, width: '46px', height: '46px', borderRadius: '12px', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem' }}>{r.score}%</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 700, fontSize: '0.9rem', fontStyle: 'italic' }}>{r.scientificName}</p>
                      {r.commonNames?.length > 0 && <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{r.commonNames.join(', ')}</p>}
                      {m && <button onClick={() => navigate(`/tanaman/${m.id}`)} style={{ marginTop: '4px', background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', padding: 0 }}>{L.identify_open}</button>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '20px', lineHeight: 1.5 }}>{L.identify_note}</p>
    </main>
  );
}

function HydroCalc() {
  const { L } = React.useContext(AppContext);
  const [volume, setVolume] = useState(10);
  const [ecTarget, setEcTarget] = useState(2.0);
  const [phCurrent, setPhCurrent] = useState(7.0);
  const [plantType, setPlantType] = useState('sayuran-daun');

  const plantPresets = [
    { id: 'sayuran-daun', label: L.preset_leafy, ecMin: 1.5, ecMax: 2.5, phMin: 6.0, phMax: 7.0 },
    { id: 'tomat-cabai',  label: L.preset_tomato, ecMin: 2.0, ecMax: 3.5, phMin: 5.8, phMax: 6.3 },
    { id: 'buah',        label: L.preset_fruit, ecMin: 1.8, ecMax: 3.0, phMin: 5.5, phMax: 6.5 },
    { id: 'herbal',      label: L.preset_herb, ecMin: 1.0, ecMax: 2.0, phMin: 5.5, phMax: 6.5 },
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
  const ecStatusLabel = { optimal: L.ec_optimal, rendah: L.ec_low, tinggi: L.ec_high }[ecStatus];

  return (
    <main className="main-content animate-fade-up">
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '6px' }}>{L.calc_title}</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
          {L.calc_sub}
        </p>
      </div>

      {/* Pilih Jenis Tanaman */}
      <div style={{ background: 'var(--surface)', borderRadius: '16px', padding: '16px', marginBottom: '14px', boxShadow: 'var(--shadow-sm)' }}>
        <p style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{L.plant_type}</p>
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
          {L.target_ec}: <b>{preset.ecMin}–{preset.ecMax} mS/cm</b> · {L.ph}: <b>{preset.phMin}–{preset.phMax}</b>
        </p>
      </div>

      {/* Input */}
      <div style={{ background: 'var(--surface)', borderRadius: '16px', padding: '16px', marginBottom: '14px', boxShadow: 'var(--shadow-sm)' }}>
        <p style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{L.solution_params}</p>
        <div style={{ display: 'grid', gap: '16px' }}>
          {/* Volume */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>{L.water_volume}</label>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)' }}>{volume} {L.liters}</span>
            </div>
            <input type="range" min="1" max="200" value={volume} onChange={e => setVolume(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--primary)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              <span>{L.vol_small}</span><span>{L.vol_mid}</span><span>{L.vol_large}</span>
            </div>
          </div>
          {/* EC Target */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>⚡ {L.target_ec}</label>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: ecColor }}>{ecTarget.toFixed(1)} mS/cm — {ecStatusLabel}</span>
            </div>
            <input type="range" min="0.5" max="5.0" step="0.1" value={ecTarget} onChange={e => setEcTarget(Number(e.target.value))}
              style={{ width: '100%', accentColor: ecColor }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              <span>{L.ec_seed}</span><span>{L.ec_normal}</span><span>{L.ec_intensive}</span>
            </div>
          </div>
          {/* pH */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>{L.ph_now}</label>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)' }}>{phCurrent.toFixed(1)}</span>
            </div>
            <input type="range" min="4.0" max="9.0" step="0.1" value={phCurrent} onChange={e => setPhCurrent(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--primary)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              <span>{L.ph_acid}</span><span>{L.ph_neutral}</span><span>{L.ph_base}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hasil */}
      <div style={{ background: 'linear-gradient(135deg, #0c4a6e, #0891b2)', borderRadius: '16px', padding: '16px', marginBottom: '14px', color: 'white', boxShadow: 'var(--shadow-md)' }}>
        <p style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '12px', opacity: 0.85, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{L.calc_result}</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
            <p style={{ fontSize: '1.8rem', fontWeight: 800 }}>{abMixA} ml</p>
            <p style={{ fontSize: '0.75rem', opacity: 0.85 }}>{L.abmix_a}</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
            <p style={{ fontSize: '1.8rem', fontWeight: 800 }}>{abMixB} ml</p>
            <p style={{ fontSize: '0.75rem', opacity: 0.85 }}>{L.abmix_b}</p>
          </div>
          {phDownNeeded > 0 && (
            <div style={{ background: 'rgba(220,38,38,0.3)', borderRadius: '12px', padding: '12px', textAlign: 'center', gridColumn: '1/-1' }}>
              <p style={{ fontSize: '1.5rem', fontWeight: 800 }}>{phDownNeeded} ml</p>
              <p style={{ fontSize: '0.75rem', opacity: 0.85 }}>{L.ph_down_needed}</p>
            </div>
          )}
          {phUpNeeded > 0 && (
            <div style={{ background: 'rgba(22,163,74,0.3)', borderRadius: '12px', padding: '12px', textAlign: 'center', gridColumn: '1/-1' }}>
              <p style={{ fontSize: '1.5rem', fontWeight: 800 }}>{phUpNeeded} ml</p>
              <p style={{ fontSize: '0.75rem', opacity: 0.85 }}>{L.ph_up_needed}</p>
            </div>
          )}
          {phDownNeeded == 0 && phUpNeeded == 0 && (
            <div style={{ background: 'rgba(22,163,74,0.3)', borderRadius: '12px', padding: '12px', textAlign: 'center', gridColumn: '1/-1' }}>
              <p style={{ fontSize: '1.2rem', fontWeight: 800 }}>{L.ph_ideal_ok}</p>
              <p style={{ fontSize: '0.75rem', opacity: 0.85 }}>{L.ph_no_adjust}</p>
            </div>
          )}
        </div>
        <p style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: '10px', textAlign: 'center' }}>
          {L.calc_note}
        </p>
      </div>

      {/* Tips */}
      <div style={{ background: 'var(--surface)', borderRadius: '16px', padding: '16px', boxShadow: 'var(--shadow-sm)' }}>
        <p style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{L.mixing_order}</p>
        {[
          ['1', L.mix1],
          ['2', L.mix2],
          ['3', L.mix3],
          ['4', L.mix4],
          ['5', L.mix5],
          ['6', L.mix6],
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

function SoilGuide() {
  const { L, lang } = React.useContext(AppContext);
  const [openIdx, setOpenIdx] = useState(0);
  const soilGuideData = SOIL_GUIDE[lang];

  return (
    <main className="main-content animate-fade-up">
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '6px' }}>{L.soil_title}</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
          {L.soil_sub}
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
  const { profile, setProfile, favorites, L } = React.useContext(AppContext);
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
            <button className="btn-primary" style={{ width: 'auto' }} onClick={saveProfile}>{L.profile_save}</button>
          </div>
        ) : (
          <h2 style={{ fontSize: '1.6rem', fontWeight: '700', marginBottom: '4px' }}>
            {profile.name} 
            <button style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '0.9rem', marginLeft: '8px' }} onClick={() => setIsEditing(true)}>{L.profile_edit}</button>
          </h2>
        )}

        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{L.profile_role}</p>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginTop: '32px' }}>
          <div>
            <h3 style={{ fontSize: '1.8rem', color: 'var(--primary)', fontWeight: '700' }}>{favorites.length}</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>{L.profile_collection}</p>
          </div>
          <div>
            <h3 style={{ fontSize: '1.8rem', color: 'var(--primary)', fontWeight: '700' }}>
              <Star size={24} fill="var(--primary)" />
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>{L.profile_level}</p>
          </div>
        </div>
      </div>
    </main>
  );
}

// --- Care Calendar ---
