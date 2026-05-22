import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import './App.css';

export default function App() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Form input states optimized for gaming data assets
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [genre, setGenre] = useState('Action');
  const [platforms, setPlatforms] = useState('PC');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state data pipeline with backend server
  const fetchGames = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      const data = await response.json();
      setGames(data);
      setLoading(false);
    } catch (err) {
      console.error("Error connecting to gaming database:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  // Form Submission Handler for New Digital Releases
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          price: Number(price), 
          stock: Number(stock), 
          image_url: imageUrl,
          genre,
          platforms
        })
      });
      if (response.ok) {
        setName(''); setPrice(''); setStock(''); setImageUrl('');
        await fetchGames();
        navigate('/admin'); // Smoothly return admin to inventory center
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Title Handler
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delist this game title from the storefront?")) return;
    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, { method: 'DELETE' });
      if (response.ok) fetchGames();
    } catch (err) {
      console.error(err);
    }
  };

  // Analytics Metrics
  const totalTitles = games.length;
  const vaultValue = games.reduce((sum, g) => sum + (Number(g.price) * Number(g.stock)), 0);
  const outOfStock = games.filter(g => g.stock === 0).length;

  if (loading) return <div className="loading-screen">Booting Cloud Game Database Core...</div>;

  return (
    <div className="app-container dark-theme">
      {/* 🌌 IMMERSIVE GAMING STYLING NAVBAR */}
      <nav className="global-navbar">
        <div className="nav-brand">🎮 NEXUS STEAM VAULT</div>
        <div className="nav-links">
          <Link to="/" className="nav-link">Discover Store</Link>
          <Link to="/admin" className="nav-link admin-pill">Developer Portal</Link>
        </div>
      </nav>

      {/* DYNAMIC VIEW ROUTER GATE */}
      <main className="page-content">
        <Routes>
          
          {/* VIEW 1: PREMIUM CYBERPUNK DIGITAL STOREFRONT GRID */}
          <Route path="/" element={
            <div className="fade-in">
              <header className="store-hero">
                <h1>Featured & Recommended</h1>
                <p>Explore hot digital releases synced live with Neon Postgres cloud infrastructure.</p>
              </header>
              
              <div className="storefront-grid">
                {games.map(game => (
                  <div key={game.id} className="store-card gaming-card">
                    <div className="card-image-box">
                      <img 
                        src={game.image_url && game.image_url.trim() !== "" ? game.image_url : 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600'} 
                        alt={game.name} 
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600' }}
                      />
                      <span className="genre-tag">{game.genre || 'Action'}</span>
                    </div>
                    <div className="card-body">
                      <h3>{game.name}</h3>
                      <div className="platform-row">👾 {game.platforms || 'PC / Next-Gen'}</div>
                      <div className="card-footer">
                        <span className="price-tag">${Number(game.price).toFixed(2)}</span>
                        <span className={`stock-pill ${game.stock > 0 ? 'instock' : 'outstock'}`}>
                          {game.stock > 0 ? `${game.stock} Keys Left` : 'Out of Keys'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          } />

          {/* VIEW 2: DEVELOPER OPERATIONS COMMAND TABLE CENTRE */}
          <Route path="/admin" element={
            <div className="fade-in">
              <div className="admin-header">
                <h2>Publisher Catalog Matrix</h2>
                <Link to="/admin/add" className="add-product-btn">🚀 Deploy Digital Title</Link>
              </div>

              {/* Glowing Interactive Analytics Bar */}
              <div className="analytics-bar">
                <div className="metric-card">
                  <span className="metric-icon">📀</span>
                  <div className="metric-info"><h4>Vault Catalog</h4><p>{totalTitles} Games</p></div>
                </div>
                <div className="metric-card">
                  <span className="metric-icon">💎</span>
                  <div className="metric-info"><h4>Pipeline Value</h4><p>${vaultValue.toFixed(2)}</p></div>
                </div>
                <div className="metric-card">
                  <span className="metric-icon">🚨</span>
                  <div className="metric-info"><h4>Key Depletions</h4><p className={outOfStock > 0 ? "alert-text" : ""}>{outOfStock} Titles</p></div>
                </div>
              </div>

              {/* Publisher Canvas Grid Workspace Data Table */}
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Cover Art</th>
                      <th>Game Title</th>
                      <th>Genre Type</th>
                      <th>Target Engine</th>
                      <th>Retail Cost</th>
                      <th>Key Pool</th>
                      <th style={{ textAlign: 'right' }}>Management</th>
                    </tr>
                  </thead>
                  <tbody>
                    {games.map(game => (
                      <tr key={game.id}>
                        <td>
                          <img className="table-thumb" src={game.image_url} alt="" onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600'} />
                        </td>
                        <td><strong>{game.name}</strong></td>
                        <td><span className="table-genre">{game.genre || 'Action'}</span></td>
                        <td><code className="table-code">{game.platforms || 'PC'}</code></td>
                        <td><span className="glow-green">${Number(game.price).toFixed(2)}</span></td>
                        <td>
                          <span className={`table-stock-badge ${game.stock > 0 ? 'good' : 'empty'}`}>
                            {game.stock} available
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button onClick={() => handleDelete(game.id)} className="table-delete-btn">🗑️ Delist</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          } />

          {/* VIEW 3: DEDICATED NEW GAME DEPLOYMENT CREATOR CANVAS */}
          <Route path="/admin/add" element={
            <div className="fade-in creator-view">
              <div className="back-nav">
                <Link to="/admin">⬅️ Abort & Return to Publisher Center</Link>
              </div>
              <div className="creator-card">
                <h2>Mint New Digital Game SKU</h2>
                <p>Input metadata details to push a fresh title directly into your live production catalog ecosystem.</p>
                
                <form onSubmit={handleSubmit} className="spacious-form">
                  <div className="form-group">
                    <label>Game Title / Core Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g., Cyberpunk 2077: Phantom Liberty" />
                  </div>
                  
                  <div className="form-row-split">
                    <div className="form-group">
                      <label>Genre Classification</label>
                      <select value={genre} onChange={(e) => setGenre(e.target.value)} className="gaming-select">
                        <option value="Action">Action / Adventure</option>
                        <option value="RPG">RPG / Strategy</option>
                        <option value="FPS">FPS / Shooter</option>
                        <option value="Horror">Survival Horror</option>
                        <option value="Indie">Indie Retro</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Target Platform Systems</label>
                      <input type="text" value={platforms} onChange={(e) => setPlatforms(e.target.value)} required placeholder="e.g., PC, PS5, Xbox Series X" />
                    </div>
                  </div>

                  <div className="form-row-split">
                    <div className="form-group">
                      <label>Digital Retail Price ($)</label>
                      <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required placeholder="59.99" />
                    </div>
                    <div className="form-group">
                      <label>Initial Digital License Keys (Stock)</label>
                      <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} required placeholder="250" />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Cover Banner Image Resource URL</label>
                    <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Paste direct image link file link here" />
                  </div>
                  
                  <button type="submit" disabled={isSubmitting} className="submit-form-btn">
                    {isSubmitting ? 'Injecting binary assets...' : '🔥 Upload & Broadcast Live Title'}
                  </button>
                </form>
              </div>
            </div>
          } />

        </Routes>
      </main>
    </div>
  );
}