import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form input states
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newProduct = {
      name,
      price: parseFloat(price),
      stock: parseInt(stock, 10),
      image_url: imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500' // Optional field, can be null if not provided
    };

    try {
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });

      if (response.ok) {
        setName('');
        setPrice('');
        setStock('');
        setImageUrl('');
        fetchProducts();
      } else {
        alert("Failed to save product to database.");
      }
    } catch (error) {
      console.error("Error submitting product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
  // Defensive check: Make sure the admin didn't click it accidentally
  if (!window.confirm("Are you sure you want to remove this product from the live catalog?")) {
    return;
  }

  try {
    const response = await fetch(`http://localhost:5000/api/products/${id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      // Re-fetch the product list to update the screen instantly
      fetchProducts();
    } else {
      alert("Failed to delete the item from the server.");
    }
  } catch (error) {
    console.error("Error deleting product:", error);
  }
};

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Syncing with Neon Cloud Database...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Premium Navigation Header */}
      <header className="merchant-navbar">
        <div className="brand-group">
          <span className="brand-logo">📦</span>
          <div>
            <h1>NexusRetail</h1>
            <p className="status-indicator"><span className="dot-online"></span> Production Database Connected</p>
          </div>
        </div>
        <div className="inventory-counter">
          <span className="count-badge">{products.length}</span> Unique SKUs Active
        </div>
      </header>

      <div className="dashboard-layout">
        {/* Left Side: Merchant Control Form Panel */}
        <aside className="control-panel">
          <div className="panel-header">
            <h2>Inventory Management</h2>
            <p>Publish fresh stock directly to the customer storefront.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="merchant-form">
            <div className="input-group">
              <label>Product Title</label>
              <div className="input-wrapper">
                <span className="input-icon">🏷️</span>
                <input 
                  type="text" 
                  placeholder="e.g., Wireless Mechanical Keyboard" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                />
              </div>
            </div>

            <div className="form-row-split">
              <div className="input-group">
                <label>Retail Price</label>
                <div className="input-wrapper">
                  <span className="input-icon">$</span>
                  <input 
                    type="number" 
                    step="0.01" 
                    placeholder="0.00" 
                    value={price} 
                    onChange={(e) => setPrice(e.target.value)} 
                    required 
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Initial Stock</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔢</span>
                  <input 
                    type="number" 
                    placeholder="Units" 
                    value={stock} 
                    onChange={(e) => setStock(e.target.value)} 
                    required 
                  />
                </div>
              </div>
            </div>

            <div className="input-group">
  <label>Product Display Image URL</label>
  <div className="input-wrapper">
    <span className="input-icon">🖼️</span>
    <input 
      type="url" 
      placeholder="e.g., https://images.unsplash.com/photo-..." 
      value={imageUrl} 
      onChange={(e) => setImageUrl(e.target.value)} 
    />
  </div>
</div>

            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Writing to Postgres...' : '🚀 Push Item Live'}
            </button>
          </form>
        </aside>

        {/* Right Side: Visual Live Storefront Grid */}
        <main className="catalog-display">
          <div className="section-header">
            <h2>Live Digital Storefront</h2>
            <p>Real-time visual state rendering from Neon PostgreSQL 18</p>
          </div>

          <div className="product-grid">
            {products.map((product) => (
              <div key={product.id} className="retail-card">
                <div className="card-image-container">
  <img 
    src={product.image_url} 
    alt={product.name} 
    className="product-display-image"
    onError={(e) => {
      // If a user inputs a broken link, this replaces it gracefully with a fallback box image
      e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500';
    }}
  />
  <span className="sku-tag">SKU #{product.id}</span>
</div>
  
  <div className="card-body">
  <h3>{product.name}</h3>
  <div className="card-footer">
    <span className="price-tag">${Number(product.price).toFixed(2)}</span>
    <span className={`stock-pill ${product.stock > 0 ? 'instock' : 'outstock'}`}>
      {product.stock > 0 ? `${product.stock} Available` : 'Sold Out'}
    </span>
  </div>
  
  {/* ✨ NEW: Sleek Merchant Delete Button Container */}
  <div className="card-actions">
    <button 
      onClick={() => handleDelete(product.id)} 
      className="delete-btn"
      title="Remove Item"
    >
      🗑️ Remove SKU
    </button>
  </div>
</div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;