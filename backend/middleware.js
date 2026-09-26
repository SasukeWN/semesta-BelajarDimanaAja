const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
  // 1. Ambil token dari cookie
  const token = req.cookies.token;

  // 2. Kalau gak ada token, tolak
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Akses ditolak. Silakan login terlebih dahulu!'
    });
  }

  try {
    // 3. Verifikasi token menggunakan JWT_SECRET
    const secret = process.env.JWT_SECRET || 'rahasia_negara';
    const decoded = jwt.verify(token, secret);
    
    // 4. Simpan data hasil decode (payload token) ke dalam req.admin
    req.admin = decoded;
    
    // 5. Lanjut ke proses/fungsi controller berikutnya
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Sesi telah habis atau token tidak valid!'
    });
  }
};

module.exports = { verifyToken };
