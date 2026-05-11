import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import { 
  Leaf, Search, Heart, MessageSquare, BookOpen, User, 
  ArrowLeft, Moon, Sun, Camera, Send, Calendar, Bell, CheckCircle
} from 'lucide-react';
import { addDays, format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import Anthropic from '@anthropic-ai/sdk';

import plantData from './data/plants.json';

// Initialize Anthropic Client
const anthropic = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY || 'dummy-key',
  dangerouslyAllowBrowser: true,
});

// --- Custom Hooks for LocalStorage ---
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

// --- Contexts ---
const AppContext = React.createContext();

// --- Main App Wrapper ---
export default function TanamanKu() {
  const [isDarkMode, setIsDarkMode] = useLocalStorage('tanamanku-theme', false);
  const [favorites, setFavorites] = useLocalStorage('tanamanku-favs', []);
  const [profile, setProfile] = useLocalStorage('tanamanku-profile', { name: 'Pecinta Tanaman', photo: null });

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
      <Router>
        <div className="app-container">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/encyclopedia" element={<Encyclopedia />} />
            <Route path="/plant/:id" element={<PlantDetail />} />
            <Route path="/guide" element={<BeginnerGuide />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/chat" element={<AIChat />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
          <BottomNav />
        </div>
      </Router>
    </AppContext.Provider>
  );
}

// --- Header Component ---
function Header() {
  const { isDarkMode, setIsDarkMode } = React.useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const showBack = location.pathname !== '/' && location.pathname !== '/encyclopedia' && location.pathname !== '/guide' && location.pathname !== '/favorites' && location.pathname !== '/chat';

  return (
    <header className="app-header">
      <div className="header-title-row">
        {showBack ? (
          <button className="icon-btn" onClick={() => navigate(-1)}><ArrowLeft size={24} /></button>
        ) : (
          <Leaf size={28} />
        )}
        <h1>TanamanKu</h1>
      </div>
      <div className="header-title-row">
        <button className="icon-btn" onClick={() => setIsDarkMode(!isDarkMode)}>
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        {!showBack && (
          <button className="icon-btn" onClick={() => navigate('/profile')}>
            <User size={20} />
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
    { path: '/', icon: <Leaf size={24} />, label: 'Beranda' },
    { path: '/encyclopedia', icon: <Search size={24} />, label: 'Ensiklopedia' },
    { path: '/guide', icon: <BookOpen size={24} />, label: 'Panduan' },
    { path: '/favorites', icon: <Heart size={24} />, label: 'Favorit' },
    { path: '/chat', icon: <MessageSquare size={24} />, label: 'AI Chat' }
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

// --- 1. Beranda (Home) ---
function Home() {
  const navigate = useNavigate();
  return (
    <main className="main-content">
      <div className="card" style={{ marginBottom: '20px', backgroundColor: 'var(--primary)', color: 'white' }}>
        <h2>Selamat Datang!</h2>
        <p style={{ opacity: 0.9, marginTop: '8px', fontSize: '0.9rem' }}>
          Jelajahi ensiklopedia tanaman, gunakan AI Chatbot untuk bertanya, atau mulai panduan pemula hari ini.
        </p>
      </div>

      <h3 style={{ marginBottom: '12px' }}>Pilihan Populer</h3>
      <div className="plant-list">
        {plantData.slice(0, 3).map(plant => (
          <PlantCard key={plant.id} plant={plant} onClick={() => navigate(`/plant/${plant.id}`)} />
        ))}
      </div>
    </main>
  );
}

// --- 2. Ensiklopedia (Search & Filter) ---
function Encyclopedia() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [activeDiff, setActiveDiff] = useState('Semua');

  const categories = ['Semua', 'Tanaman Hias', 'Obat', 'Herbal', 'Sayuran', 'Aromaterapi'];
  const difficulties = ['Semua', 'mudah', 'sedang', 'sulit'];

  const filtered = plantData.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.scientificName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = activeCategory === 'Semua' || p.category === activeCategory;
    const matchDiff = activeDiff === 'Semua' || p.difficulty === activeDiff;
    return matchSearch && matchCat && matchDiff;
  });

  return (
    <main className="main-content">
      <div style={{ position: 'relative', marginBottom: '16px' }}>
        <Search size={20} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
        <input 
          type="text" 
          className="input-styled" 
          style={{ paddingLeft: '40px' }}
          placeholder="Cari nama atau latin..." 
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="filter-scroll">
        {categories.map(c => (
          <button key={c} className={`filter-chip ${activeCategory === c ? 'active' : ''}`} onClick={() => setActiveCategory(c)}>{c}</button>
        ))}
      </div>
      <div className="filter-scroll">
        {difficulties.map(d => (
          <button key={d} className={`filter-chip ${activeDiff === d ? 'active' : ''}`} onClick={() => setActiveDiff(d)}>
            {d === 'Semua' ? 'Semua Level' : d.charAt(0).toUpperCase() + d.slice(1)}
          </button>
        ))}
      </div>

      <div className="plant-list">
        {filtered.length > 0 ? (
          filtered.map(plant => <PlantCard key={plant.id} plant={plant} onClick={() => navigate(`/plant/${plant.id}`)} />)
        ) : (
          <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-muted)' }}>Tidak ada tanaman ditemukan.</p>
        )}
      </div>
    </main>
  );
}

// --- Reusable Plant Card ---
function PlantCard({ plant, onClick }) {
  return (
    <div className="card" style={{ display: 'flex', gap: '12px', cursor: 'pointer', padding: '12px' }} onClick={onClick}>
      <div style={{ width: '80px', height: '80px', borderRadius: '8px', backgroundColor: 'var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
        <Leaf size={32} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '600' }}>{plant.name}</h3>
          <span className={`badge ${plant.difficulty}`}>{plant.difficulty}</span>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '6px' }}>{plant.scientificName}</p>
        <span style={{ fontSize: '0.75rem', color: 'var(--primary-dark)', backgroundColor: 'var(--bg-color)', padding: '2px 6px', borderRadius: '4px' }}>
          {plant.category}
        </span>
      </div>
    </div>
  );
}

// --- 3. Plant Detail (Calendar & Reminders) ---
function PlantDetail() {
  const { id } = useParams();
  const { favorites, toggleFavorite } = React.useContext(AppContext);
  const plant = plantData.find(p => p.id === id);

  if (!plant) return <div className="main-content">Tanaman tidak ditemukan</div>;

  const isFav = favorites.includes(id);
  const today = new Date();

  const handleReminder = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('TanamanKu', {
            body: `Pengingat diaktifkan untuk ${plant.name}. Kami akan mengingatkan Anda untuk menyiramnya!`,
            icon: '/pwa-192x192.png'
          });
        } else {
          alert('Izin notifikasi tidak diberikan.');
        }
      });
    } else {
      alert('Browser Anda tidak mendukung notifikasi.');
    }
  };

  return (
    <div style={{ paddingBottom: '80px' }}>
      <div style={{ height: '200px', backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', position: 'relative' }}>
        <Leaf size={80} style={{ opacity: 0.3 }} />
        <button 
          className="icon-btn" 
          style={{ position: 'absolute', bottom: '16px', right: '16px', backgroundColor: 'rgba(0,0,0,0.3)' }}
          onClick={() => toggleFavorite(id)}
        >
          <Heart size={24} fill={isFav ? '#ef4444' : 'none'} color={isFav ? '#ef4444' : 'white'} />
        </button>
      </div>
      
      <main className="main-content" style={{ marginTop: '-20px', borderRadius: '20px 20px 0 0', backgroundColor: 'var(--bg-color)', position: 'relative', zIndex: 2, padding: '24px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span className={`badge ${plant.difficulty}`}>{plant.difficulty}</span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{plant.category}</span>
        </div>
        
        <h2 style={{ fontSize: '1.8rem', fontWeight: '700' }}>{plant.name}</h2>
        <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', marginBottom: '16px' }}>{plant.scientificName}</p>
        <p style={{ fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px' }}>{plant.description}</p>

        <div className="card" style={{ marginBottom: '24px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontSize: '1.1rem' }}>
            <Calendar size={20} color="var(--primary)" /> Kalender Perawatan
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>💧 Siram Berikutnya:</span>
              <span style={{ fontWeight: '600' }}>{format(addDays(today, plant.schedules.watering), 'dd MMM yyyy', { locale: localeId })}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>🌱 Pupuk Berikutnya:</span>
              <span style={{ fontWeight: '600' }}>{format(addDays(today, plant.schedules.fertilizer), 'dd MMM yyyy', { locale: localeId })}</span>
            </div>
            {plant.schedules.repotting > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>🪴 Ganti Pot:</span>
                <span style={{ fontWeight: '600' }}>{format(addDays(today, plant.schedules.repotting), 'dd MMM yyyy', { locale: localeId })}</span>
              </div>
            )}
          </div>
          <button className="btn-primary" style={{ width: '100%', marginTop: '16px' }} onClick={handleReminder}>
            <Bell size={18} /> Aktifkan Pengingat
          </button>
        </div>

        <h3 style={{ marginBottom: '16px' }}>Panduan Lengkap</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {Object.entries(plant.careDetails).map(([key, val]) => (
            <div key={key} className="card" style={{ padding: '12px' }}>
              <h4 style={{ textTransform: 'capitalize', fontSize: '0.95rem', marginBottom: '4px', color: 'var(--primary-dark)' }}>{key}</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>{val}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

// --- 4. Panduan Pemula ---
function BeginnerGuide() {
  const [progress, setProgress] = useLocalStorage('tanamanku-guide', []);

  const guideSteps = [
    { id: 'day0', title: 'Hari 0: Persiapan', desc: 'Pilih tanaman, pot, media tanam, lokasi, dan alat.' },
    { id: 'day1-3', title: 'Hari 1-3: Fase Adaptasi', desc: 'Jangan over-watering, taruh di tempat teduh. Transplant shock adalah hal normal.' },
    { id: 'day4-7', title: 'Hari 4-7: Membangun Rutinitas', desc: 'Tetapkan jadwal siram, amati pertumbuhan awal, pindah ke lokasi permanen.' },
    { id: 'week2-4', title: 'Minggu 2-4: Perkembangan Awal', desc: 'Mulai pupuk ringan, cek perkembangan akar, bersihkan daun, amati hama.' },
    { id: 'month1-3', title: 'Bulan 1-3: Perawatan Rutin', desc: 'Pupuk bulanan, repotting jika akar penuh, pangkas daun mati, evaluasi lokasi.' },
    { id: 'month3+', title: 'Bulan 3+: Berkembang & Berbagi', desc: 'Propagasi/stek tanaman, berbagi dengan teman, eksplorasi tanaman baru.' }
  ];

  const toggleStep = (id) => {
    if (progress.includes(id)) setProgress(progress.filter(s => s !== id));
    else setProgress([...progress, id]);
  };

  const percentage = Math.round((progress.length / guideSteps.length) * 100);

  return (
    <main className="main-content">
      <div className="card" style={{ marginBottom: '24px' }}>
        <h3>Perjalanan Pemula</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Ikuti panduan langkah demi langkah ini untuk menjadi ahli tanaman.</p>
        <div className="progress-bg">
          <div className="progress-fill" style={{ width: `${percentage}%` }}></div>
        </div>
        <p style={{ fontSize: '0.8rem', textAlign: 'right', marginTop: '4px', fontWeight: 'bold' }}>{percentage}% Selesai</p>
      </div>

      <div>
        {guideSteps.map(step => {
          const isDone = progress.includes(step.id);
          return (
            <div key={step.id} className="timeline-item" onClick={() => toggleStep(step.id)} style={{ cursor: 'pointer' }}>
              <div className={`timeline-icon ${isDone ? 'completed' : ''}`}>
                {isDone ? <CheckCircle size={20} /> : <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'currentColor' }} />}
              </div>
              <div className="timeline-content">
                <h4 style={{ fontSize: '1rem', marginBottom: '4px', color: isDone ? 'var(--text-muted)' : 'var(--text-main)', textDecoration: isDone ? 'line-through' : 'none' }}>
                  {step.title}
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{step.desc}</p>
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
    <main className="main-content">
      <h2 style={{ marginBottom: '16px' }}>Koleksi Favorit</h2>
      {favPlants.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '40px' }}>
          <Heart size={48} style={{ opacity: 0.2, margin: '0 auto 16px' }} />
          <p>Belum ada tanaman favorit yang disimpan.</p>
        </div>
      ) : (
        <div className="plant-list">
          {favPlants.map(plant => (
            <PlantCard key={plant.id} plant={plant} onClick={() => navigate(`/plant/${plant.id}`)} />
          ))}
        </div>
      )}
    </main>
  );
}

// --- 6. AI Chatbot & Plant ID ---
function AIChat() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Halo! Saya asisten ahli tanaman Anda. Ada yang bisa saya bantu atau Anda ingin saya mengidentifikasi tanaman dari foto?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const sendMessage = async (textContent, base64Image = null) => {
    if (!textContent && !base64Image) return;
    
    const newUserMsg = { role: 'user', content: textContent || 'Tolong identifikasi tanaman ini.' };
    // If image is attached, we store a local representation for UI, but send actual base64 to Claude.
    if (base64Image) newUserMsg.image = base64Image;

    const newMessages = [...messages, newUserMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      // Prepare content block for Claude API
      const contentBlock = [];
      if (base64Image) {
        // Claude expects base64 without data URI prefix
        const base64Data = base64Image.split(',')[1];
        const mediaType = base64Image.split(';')[0].split(':')[1];
        contentBlock.push({ type: 'image', source: { type: 'base64', media_type: mediaType, data: base64Data } });
      }
      if (textContent) contentBlock.push({ type: 'text', text: textContent });
      if (!textContent && base64Image) contentBlock.push({ type: 'text', text: 'Tolong identifikasi tanaman ini beserta detail perawatannya dalam bahasa Indonesia.' });

      // Build history for API
      const apiMessages = newMessages.map(m => {
        if (m.role === 'assistant') return { role: 'assistant', content: m.content };
        // For user, if it was an image message we reconstruct it
        if (m.image && m === newUserMsg) return { role: 'user', content: contentBlock };
        return { role: 'user', content: m.content };
      }).filter(m => m.content);

      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: "Anda adalah seorang ahli botani dan perawatan tanaman profesional yang fasih berbahasa Indonesia. Berikan jawaban yang ramah, informatif, dan mudah dipahami oleh pemula.",
        messages: apiMessages
      });

      setMessages([...newMessages, { role: 'assistant', content: response.content[0].text }]);
    } catch (error) {
      console.error(error);
      setMessages([...newMessages, { role: 'assistant', content: 'Maaf, terjadi kesalahan saat menghubungi server AI. Pastikan API Key Anda valid.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        sendMessage(input, reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <main className="main-content" style={{ padding: 0 }}>
      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((m, idx) => (
            <div key={idx} className={`chat-bubble ${m.role}`}>
              {m.image && <img src={m.image} alt="upload" style={{ width: '100%', borderRadius: '8px', marginBottom: '8px' }} />}
              <p style={{ whiteSpace: 'pre-wrap' }}>{m.content}</p>
            </div>
          ))}
          {loading && <div className="chat-bubble assistant"><p>Berpikir...</p></div>}
        </div>
        
        <div className="chat-input-area" style={{ padding: '12px', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--surface)' }}>
          <input 
            type="file" 
            accept="image/*" 
            style={{ display: 'none' }} 
            ref={fileInputRef}
            onChange={handleImageUpload}
          />
          <button className="icon-btn" style={{ color: 'var(--primary)', backgroundColor: 'var(--bg-color)' }} onClick={() => fileInputRef.current.click()}>
            <Camera size={24} />
          </button>
          <input 
            type="text" 
            className="input-styled" 
            style={{ flex: 1 }} 
            placeholder="Tanya soal tanaman..." 
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && sendMessage(input)}
          />
          <button className="btn-primary" style={{ padding: '10px' }} onClick={() => sendMessage(input)} disabled={loading || !input.trim()}>
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
    <main className="main-content">
      <div className="card" style={{ textAlign: 'center', padding: '32px 16px' }}>
        <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '3rem' }}>
          {profile.name.charAt(0).toUpperCase()}
        </div>
        
        {isEditing ? (
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '16px' }}>
            <input type="text" className="input-styled" value={name} onChange={e => setName(e.target.value)} />
            <button className="btn-primary" onClick={saveProfile}>Simpan</button>
          </div>
        ) : (
          <h2 style={{ marginBottom: '4px' }}>{profile.name} <button style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.8rem' }} onClick={() => setIsEditing(true)}>(Edit)</button></h2>
        )}
        
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Anggota TanamanKu</p>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', marginTop: '24px' }}>
          <div>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>{favorites.length}</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tanaman Favorit</p>
          </div>
          <div>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>Level 1</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pemula</p>
          </div>
        </div>
      </div>
    </main>
  );
}
