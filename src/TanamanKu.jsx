import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { Leaf, Search, Droplets, Sun, Scissors, Beaker, AlertTriangle, ArrowLeft } from 'lucide-react';
import plantData from './data/plants.json';

// --- Home Component ---
function Home() {
  const navigate = useNavigate();
  const categories = [
    { name: 'Bonsai', icon: <Scissors size={32} /> },
    { name: 'Sayuran', icon: <Leaf size={32} /> },
    { name: 'Tanaman Hias', icon: <Sun size={32} /> },
    { name: 'Buah-buahan', icon: <Droplets size={32} /> }
  ];

  return (
    <div className="app-container">
      <header className="app-header">
        <Leaf size={28} />
        <h1>TanamanKu</h1>
      </header>
      <main className="main-content">
        <h2 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '8px' }}>Pilih Kategori Tanaman</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Temukan panduan merawat berbagai macam koleksi tanamanmu.</p>
        
        <div className="category-grid">
          {categories.map((cat) => (
            <div 
              key={cat.name} 
              className="category-card"
              onClick={() => navigate(`/category/${cat.name}`)}
            >
              <div className="category-icon-wrapper">
                {cat.icon}
              </div>
              <span className="category-name">{cat.name}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

// --- Category View Component ---
function CategoryView() {
  const { name } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const plants = plantData.filter(p => p.category === name);
  const filteredPlants = plants.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.scientificName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app-container">
      <header className="app-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </button>
        <h1>Kategori {name}</h1>
      </header>
      <main className="main-content">
        <div className="search-container">
          <Search size={20} className="search-icon" />
          <input 
            type="text" 
            className="search-input" 
            placeholder="Cari tanaman..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="plant-list">
          {filteredPlants.length > 0 ? (
            filteredPlants.map(plant => (
              <div 
                key={plant.id} 
                className="plant-card"
                onClick={() => navigate(`/plant/${plant.id}`)}
              >
                <div className="plant-image-placeholder">
                  <Leaf size={40} />
                </div>
                <div className="plant-card-content">
                  <h3 className="plant-card-title">{plant.name}</h3>
                  <p className="plant-card-subtitle">{plant.scientificName}</p>
                </div>
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-muted)' }}>
              Tidak ada tanaman yang ditemukan.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

// --- Plant Detail Component ---
function PlantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const plant = plantData.find(p => p.id === id);

  if (!plant) {
    return (
      <div className="app-container">
        <header className="app-header">
          <button className="back-button" onClick={() => navigate(-1)}>
            <ArrowLeft size={24} />
          </button>
          <h1>Tanaman Tidak Ditemukan</h1>
        </header>
      </div>
    );
  }

  return (
    <div className="app-container" style={{ backgroundColor: 'var(--bg-color)' }}>
      <div className="detail-header-image">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </button>
        <Leaf size={80} style={{ opacity: 0.5 }} />
      </div>
      
      <div className="detail-content">
        <h2 className="detail-title">{plant.name}</h2>
        <p className="detail-latin">{plant.scientificName}</p>
        <p className="detail-description">{plant.description}</p>
        
        <h3 style={{ marginBottom: '16px', fontSize: '1.2rem', color: 'var(--text-main)' }}>Panduan Perawatan</h3>
        
        <div className="care-section">
          <div className="care-card">
            <div className="care-icon-box"><Droplets size={20} /></div>
            <div className="care-info">
              <h4>Penyiraman</h4>
              <p>{plant.careDetails.watering}</p>
            </div>
          </div>
          
          <div className="care-card">
            <div className="care-icon-box"><Sun size={20} /></div>
            <div className="care-info">
              <h4>Cahaya Matahari</h4>
              <p>{plant.careDetails.sunlight}</p>
            </div>
          </div>
          
          <div className="care-card">
            <div className="care-icon-box"><Scissors size={20} /></div>
            <div className="care-info">
              <h4>Pemangkasan</h4>
              <p>{plant.careDetails.pruning}</p>
            </div>
          </div>
          
          <div className="care-card">
            <div className="care-icon-box"><Beaker size={20} /></div>
            <div className="care-info">
              <h4>Pemupukan</h4>
              <p>{plant.careDetails.fertilizer}</p>
            </div>
          </div>
          
          <div className="care-card" style={{ borderColor: '#fca5a5', backgroundColor: '#fef2f2' }}>
            <div className="care-icon-box" style={{ backgroundColor: '#fee2e2', color: '#ef4444' }}>
              <AlertTriangle size={20} />
            </div>
            <div className="care-info">
              <h4 style={{ color: '#b91c1c' }}>Masalah Umum</h4>
              <p style={{ color: '#7f1d1d' }}>{plant.careDetails.commonProblems}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Main App Setup ---
export default function TanamanKu() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:name" element={<CategoryView />} />
        <Route path="/plant/:id" element={<PlantDetail />} />
      </Routes>
    </Router>
  );
}
