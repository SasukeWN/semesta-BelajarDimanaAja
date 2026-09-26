const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser'); 
require('dotenv').config();
const db = require('./db');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true 
}));

app.use(express.json());
app.use(cookieParser()); 

// Expose folder public agar foto bisa diakses via URL
app.use(express.static('public'));

const adminRoute = require('./route/admin/admin.route');
const kategoriRoute = require('./route/kategori/kategori.route');
const materiRoute = require('./route/materi/materi.route');
const aiRoute = require('./route/ai/ai.route');

app.use('/api/admin', adminRoute);
app.use('/api/kategori', kategoriRoute);
app.use('/api/materi', materiRoute);
app.use('/api/ai', aiRoute);

app.get('/test-db', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS solution');
    res.json({
      success: true,
      message: 'Database connection successful from app.js!',
      data: rows[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Database connection failed: ' + error.message
    });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server berjalan di http://localhost:${port}`);
});
