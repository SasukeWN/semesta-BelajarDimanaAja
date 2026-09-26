const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../../db'); 

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'rahasia_negara';
const { verifyToken } = require('../../middleware');


router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username dan password wajib diisi!' });
    }

   
    const [existingAdmin] = await db.query('SELECT * FROM admin WHERE username = ?', [username]);
    if (existingAdmin.length > 0) {
      return res.status(400).json({ success: false, message: 'Username sudah terdaftar!' });
    }

   
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    
    await db.query(
      'INSERT INTO admin (username, password) VALUES (?, ?)',
      [username, hashedPassword]
    );

    res.status(201).json({
      success: true,
      message: 'Admin berhasil didaftarkan!'
    });

  } catch (error) {
    console.error('Error register admin:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
  }
});


router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username dan password wajib diisi!' });
    }

    
    const [admins] = await db.query('SELECT * FROM admin WHERE username = ?', [username]);
    const admin = admins[0];

   
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Username atau password salah!' });
    }

    
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Username atau password salah!' });
    }

    
    const tokenPayload = {
      id: admin.id,
      username: admin.username
    };
    
    // Generate token yang berlaku selama 24 jam
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '24h' });

    // Set token ke dalam Cookie
    res.cookie('token', token, {
      httpOnly: true, // Biar nggak bisa diakses lewat JavaScript (XSS protection)
      secure: process.env.NODE_ENV === 'production', // Kalo di production (HTTPS), jadiin true
      maxAge: 24 * 60 * 60 * 1000 // 24 jam dalam miliseconds
    });

    res.json({
      success: true,
      message: 'Login berhasil!',
      data: {
        id: admin.id,
        username: admin.username
      }
    });

  } catch (error) {
    console.error('Error login admin:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
  }
});

// ==============================================
// 2.5 LOGOUT ADMIN
// ==============================================
router.post('/logout', (req, res) => {
  // Hapus cookie token
  res.clearCookie('token');
  res.json({
    success: true,
    message: 'Logout berhasil!'
  });
});



router.get('/profile', verifyToken, async (req, res) => {
  try {
   
    const adminId = req.admin.id;
    
    
    const [admins] = await db.query('SELECT id, username, create_at FROM admin WHERE id = ?', [adminId]);
    
    res.json({
      success: true,
      message: 'Data profile berhasil diambil',
      data: admins[0]
    });
  } catch (error) {
    console.error('Error get profile:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
  }
});

module.exports = router;
