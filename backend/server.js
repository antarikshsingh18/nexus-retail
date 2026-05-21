const express = require('express');
const cors = require('cors');
const db = require('./db'); // 1. Import our database connection pool
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// 2. The Updated Route: Query the live PostgreSQL database instead of a fake array
app.get('/api/products', async (req, res) => {
  try {
    // Request all rows inside our 'products' table, sorted by ID
    const result = await db.query('SELECT * FROM products ORDER BY id ASC');
    
    // Send the database rows array straight back to the frontend
    res.json(result.rows);
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ error: 'Internal Server Error fetching catalog data.' });
  }
});
// 3. New Route: Accept form data from the client and save it to PostgreSQL
app.post('/api/products', async (req, res) => {
  try {
    // 1. Grab image_url alongside other fields from the parsed request body
    const { name, price, stock, image_url } = req.body;

    if (!name || !price || stock === undefined) {
      return res.status(400).json({ error: 'Required fields missing.' });
    }

    // 2. Update the SQL query statement to include the 4th parameter column
    const queryText = 'INSERT INTO products (name, price, stock, image_url) VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [name, price, stock, image_url];
    
    const result = await db.query(queryText, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Database insert error:', error);
    res.status(500).json({ error: 'Internal Server Error saving product data.' });
  }
});
// 4. Delete Route: Remove a specific product by its unique ID
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params; // Extract the dynamic ID from the URL link path

    const queryText = 'DELETE FROM products WHERE id = $1 RETURNING *';
    const result = await db.query(queryText, [id]);

    // If result.rowCount is 0, it means that product ID doesn't exist in the database
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    // Return a success status along with the item that was just deleted
    res.json({ message: 'Product successfully scrubbed from database', deletedProduct: result.rows[0] });
  } catch (error) {
    console.error('Database delete error:', error);
    res.status(500).json({ error: 'Internal Server Error deleting product.' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running securely on port ${PORT}`);
});