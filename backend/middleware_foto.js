const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// ==============================================
// 1. SETUP MULTER (Penyimpanan Sementara di RAM)
// ==============================================
// Kita pakai memoryStorage, jadi file yang diupload disimpen sementara di RAM (Buffer).
// Ini supaya kita bisa oper file-nya ke Sharp untuk di-convert DULU sebelum disimpen beneran.
const storage = multer.memoryStorage();

// Filter: Cuma bolehin upload file gambar
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Hanya file gambar yang diperbolehkan!'), false);
  }
};

// Batasi ukuran gambar maksimal 2MB
const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, 
  fileFilter: fileFilter
});

// ==============================================
// 2. MIDDLEWARE CONVERT KE WEBP (Pakai Sharp)
// ==============================================
const processImageToWebp = async (req, res, next) => {
  // Kalau nggak ada gambar yang di-upload (misal pas Edit cuma ganti nama doang), ya diskip aja.
  if (!req.file) return next();

  // Tentukan lokasi folder untuk nyimpen gambar (public/uploads)
  const uploadDir = path.join(__dirname, 'public', 'uploads');
  
  // Bikin foldernya otomatis kalau belum ada (biar nggak error)
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Bikin nama file baru yang rapi (format webp)
  const namaFileBaru = `kategori-${Date.now()}.webp`;
  const filePath = path.join(uploadDir, namaFileBaru);

  try {
    // Ambil gambar dari RAM (req.file.buffer), terus olah pakai Sharp
    await sharp(req.file.buffer)
      .resize({ width: 500 }) // Otomatis kecilin dimensinya jadi lebar 500px (tinggi proporsional) biar ringan
      .webp({ quality: 80 })  // Convert jadi WebP dengan kualitas 80% (masih jernih banget tapi size-nya super kecil)
      .toFile(filePath);      // Simpan beneran ke hardisk

    // Tempelin URL gambarnya ke req.body biar nanti di file Route tinggal di-insert ke Database
    req.body.ikon_kategori = `/uploads/${namaFileBaru}`;
    
    next(); // Lanjut jalan ke Route / Controller
  } catch (error) {
    console.error('Error saat kompresi gambar:', error);
    return res.status(500).json({ success: false, message: 'Gagal memproses/menyimpan gambar' });
  }
};

module.exports = {
  // 'ikon_kategori' ini adalah nama key/field yang harus dipakai frontend pas ngirim form-data
  uploadKategoriIkon: upload.single('ikon_kategori'), 
  processImageToWebp
};
