const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser'); // Tambah cookie-parser
require('dotenv').config();
const db = require('./db');

const app = express();
const port = process.env.PORT || 3000;

// Setup CORS agar bisa kirim cookie beda port (frontend dan backend)
app.use(cors({
  origin: 'http://localhost:5173', // Ganti dengan port frontend lu (misal Vite 5173, Nextjs 3000)
  credentials: true // WAJIB true kalau mau pakai Cookie
}));

app.use(express.json());
app.use(cookieParser()); // Gunakan middleware cookie

const adminRoute = require('./route/admin/admin.route');
const kategoriRoute = require('./route/kategori/kategori.route');

app.use('/api/admin', adminRoute);
app.use('/api/kategori', kategoriRoute);

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
