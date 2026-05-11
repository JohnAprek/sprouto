import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import { 
  Home as HomeIcon, BookOpen, Sprout, Heart, Bot,
  Search, User, ArrowLeft, Moon, Sun, Camera, Send, Calendar, Bell, CheckSquare, Square
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
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ensiklopedia" element={<Encyclopedia />} />
            <Route path="/tanaman/:id" element={<PlantDetail />} />
            <Route path="/pemula" element={<BeginnerGuide />} />
            <Route path="/favorit" element={<Favorites />} />
            <Route path="/chat" element={<AIChat />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
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
          <button className="icon-btn" onClick={() => navigate(-1)}><ArrowLeft size={24} /></button>
        ) : (
          <Sprout size={28} />
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
    { path: '/', icon: <HomeIcon size={24} />, label: 'Beranda' },
    { path: '/ensiklopedia', icon: <BookOpen size={24} />, label: 'Ensiklopedia' },
    { path: '/pemula', icon: <Sprout size={24} />, label: 'Panduan' },
    { path: '/favorit', icon: <Heart size={24} />, label: 'Favorit' },
    { path: '/chat', icon: <Bot size={24} />, label: 'AI Chat' }
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
  return (
    <main className="main-content">
      <div className="card" style={{ marginBottom: '20px', backgroundColor: 'var(--primary)', color: 'white' }}>
        <h2>Selamat Datang!</h2>
        <p style={{ opacity: 0.9, marginTop: '8px', fontSize: '0.9rem' }}>
          Jelajahi ensiklopedia tanaman, gunakan AI Chatbot, atau ikuti panduan pemula hari ini.
        </p>
      </div>
      <h3 style={{ marginBottom: '12px' }}>Pilihan Populer</h3>
      <div className="plant-list">
        {plantData.slice(0, 3).map(plant => (
          <PlantCard key={plant.id} plant={plant} onClick={() => navigate(`/tanaman/${plant.id}`)} />
        ))}
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
          filtered.map(plant => <PlantCard key={plant.id} plant={plant} onClick={() => navigate(`/tanaman/${plant.id}`)} />)
        ) : (
          <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-muted)' }}>Tidak ada tanaman ditemukan.</p>
        )}
      </div>
    </main>
  );
}

function PlantCard({ plant, onClick }) {
  const { favorites, toggleFavorite } = React.useContext(AppContext);
  const isFav = favorites.includes(plant.id);

  return (
    <div className="card" style={{ display: 'flex', gap: '12px', cursor: 'pointer', padding: '12px', position: 'relative' }} onClick={onClick}>
      <button 
        className="icon-btn" 
        style={{ position: 'absolute', top: '8px', right: '8px', color: isFav ? '#ef4444' : 'var(--border-color)', padding: 0 }}
        onClick={(e) => { e.stopPropagation(); toggleFavorite(plant.id); }}
      >
        <Heart size={20} fill={isFav ? '#ef4444' : 'none'} />
      </button>

      <div style={{ width: '80px', height: '80px', borderRadius: '8px', backgroundColor: 'var(--bg-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
        <Sprout size={32} />
      </div>
      <div style={{ flex: 1, paddingRight: '20px' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '600' }}>{plant.name}</h3>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', margin: '2px 0 6px 0' }}>{plant.scientificName}</p>
        
        <div style={{ display: 'flex', gap: '6px' }}>
          <span className={`badge ${plant.difficulty}`}>{plant.difficulty}</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--primary-dark)', backgroundColor: 'var(--bg-color)', padding: '2px 6px', borderRadius: '4px' }}>
            {plant.category}
          </span>
        </div>
      </div>
    </div>
  );
}

// --- 3. Plant Detail ---
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
        <Sprout size={80} style={{ opacity: 0.3 }} />
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
const guideData = [
  {
    title: "Hari 0 - Persiapan",
    tasks: [
      { id: "h0-1", text: "Pilih tanaman yang tepat untuk pemula" },
      { id: "h0-2", text: "Siapkan pot dengan lubang drainase" },
      { id: "h0-3", text: "Pilih media tanam (campuran tanah + sekam + cocopeat)" },
      { id: "h0-4", text: "Tentukan lokasi berdasarkan kebutuhan cahaya" },
      { id: "h0-5", text: "Siapkan alat dasar (semprotan, sekop kecil)" }
    ]
  },
  {
    title: "Hari 1-3 - Fase Adaptasi",
    tasks: [
      { id: "h1-1", text: "Jangan langsung disiram banyak (cukup lembab)" },
      { id: "h1-2", text: "Taruh di tempat teduh dulu (cahaya tidak langsung)" },
      { id: "h1-3", text: "Jangan panik kalau ada daun layu (transplant shock normal)" },
      { id: "h1-4", text: "Cek tanah sebelum siram: tusuk jari 2-3cm" }
    ]
  },
  {
    title: "Hari 4-7 - Membangun Rutinitas",
    tasks: [
      { id: "h4-1", text: "Mulai jadwal penyiraman tetap (cek pagi hari)" },
      { id: "h4-2", text: "Perhatikan tanda pertumbuhan pertama" },
      { id: "h4-3", text: "Pindahkan ke lokasi permanen" },
      { id: "h4-4", text: "Foto tanaman sebagai baseline hari ke-7" }
    ]
  },
  {
    title: "Minggu 2-4 - Perkembangan Awal",
    tasks: [
      { id: "m2-1", text: "Pupuk pertama dosis SETENGAH dari takaran kemasan" },
      { id: "m2-2", text: "Cek kondisi akar (keluar dari lubang = butuh repot)" },
      { id: "m2-3", text: "Bersihkan daun dari debu untuk fotosintesis optimal" },
      { id: "m2-4", text: "Amati hama di bagian bawah daun" }
    ]
  },
  {
    title: "Bulan 1-3 - Perawatan Rutin",
    tasks: [
      { id: "b1-1", text: "Pupuk rutin sebulan sekali" },
      { id: "b1-2", text: "Repotting jika diperlukan (pot 2-3cm lebih besar)" },
      { id: "b1-3", text: "Pangkas daun mati/kuning dengan gunting bersih" },
      { id: "b1-4", text: "Evaluasi lokasi: daun pucat = kurang cahaya" }
    ]
  },
  {
    title: "Bulan 3+ - Berkembang & Berbagi",
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
    if (checkedTasks.includes(taskId)) {
      setCheckedTasks(checkedTasks.filter(id => id !== taskId));
    } else {
      setCheckedTasks([...checkedTasks, taskId]);
    }
  };

  return (
    <main className="main-content">
      <div className="card" style={{ marginBottom: '24px' }}>
        <h3>Panduan Pemula</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Perjalanan hari ke-0 hingga mahir merawat tanaman.</p>
        <div className="progress-bg">
          <div className="progress-fill" style={{ width: `${percentage}%` }}></div>
        </div>
        <p style={{ fontSize: '0.8rem', textAlign: 'right', marginTop: '4px', fontWeight: 'bold' }}>{percentage}% Selesai</p>
      </div>

      <div style={{ paddingLeft: '8px' }}>
        {guideData.map((section, idx) => (
          <div key={idx} style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '12px', color: 'var(--primary)' }}>{section.title}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {section.tasks.map(task => {
                const isDone = checkedTasks.includes(task.id);
                return (
                  <div 
                    key={task.id} 
                    onClick={() => toggleTask(task.id)}
                    style={{ 
                      display: 'flex', alignItems: 'flex-start', gap: '10px', 
                      cursor: 'pointer', padding: '8px', 
                      backgroundColor: 'var(--surface)', borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      opacity: isDone ? 0.7 : 1
                    }}
                  >
                    <div style={{ color: isDone ? 'var(--primary)' : 'var(--text-muted)', marginTop: '2px' }}>
                      {isDone ? <CheckSquare size={20} /> : <Square size={20} />}
                    </div>
                    <span style={{ fontSize: '0.9rem', textDecoration: isDone ? 'line-through' : 'none' }}>
                      {task.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
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
    
    const newUserMsg = { role: 'user', content: textContent || 'Tolong identifikasi tanaman ini dan cara perawatannya.' };
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
        // Fetch via Cloudflare Worker Proxy
        const response = await fetch(proxyUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514', // Expected by prompt
            max_tokens: 1000,
            system: "Kamu ahli tanaman berbahasa Indonesia, spesialisasi perawatan tanaman rumahan, jawab singkat dan praktis.",
            messages: apiMessages
          })
        });
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        assistantText = data.content[0].text;
      } else {
        // Fallback message if worker isn't setup
        assistantText = "Maaf, Proxy AI belum dikonfigurasi (VITE_AI_PROXY_URL kosong). Karena keamanan, request ke Anthropic tidak boleh dari browser langsung. Silakan deploy worker/ai-proxy.js di Cloudflare dan masukkan URL-nya ke .env";
      }

      setMessages([...newMessages, { role: 'assistant', content: assistantText }]);
    } catch (error) {
      console.error(error);
      setMessages([...newMessages, { role: 'assistant', content: 'Terjadi kesalahan saat menghubungi API: ' + error.message }]);
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
          <button className="btn-primary" style={{ padding: '10px' }} onClick={() => sendMessage(input)} disabled={loading || (!input.trim() && !fileInputRef.current?.value)}>
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
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Koleksi Tanaman</p>
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
