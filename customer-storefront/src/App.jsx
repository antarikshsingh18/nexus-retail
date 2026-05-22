import React, { useState, useEffect } from 'react';
import './App.css';

export default function App() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch only active inventory from the central cloud database
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        const data = await response.json();
        setGames(data);
        setLoading(false);
      } catch (err) {
        console.error("Error connecting to live catalog stream:", err);
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  // Instant marketplace filter as the player types
  const filteredGames = games.filter(game =>
    game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (game.genre && game.genre.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return <div className="loading-screen">Synchronizing Live Vault Catalog...</div>;

  return (
    <div className="app-container customer-view">
      {/* 🌌 PUBLIC CONSUMER NAVBAR (No Developer Portal Links Allowed) */}
      <nav className="global-navbar">
        <div className="nav-brand">🎮 NEXUS STEAM VAULT</div>
        <div className="search-bar-container">
          <input 
            type="text" 
            placeholder="Search titles, genres, or platforms..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="nav-links">
          <span className="nav-status-indicator">● Store Live</span>
        </div>
      </nav>

      {/* PUBLIC CATALOG VIEW */}
      <main className="page-content">
        <header className="store-hero">
          <h1>Featured & Recommended</h1>
          <p>Instantly acquire verified digital license keys with real-time stock allocation.</p>
        </header>
        
        <div className="storefront-grid">
          {filteredGames.map(game => (
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

        {filteredGames.length === 0 && (
          <div className="no-results">No titles matching "{searchTerm}" found in the vault registries.</div>
        )}
      </main>
    </div>
  );
}