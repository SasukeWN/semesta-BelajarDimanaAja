const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// ==============================================
// 1. SETUP MULTER (Penyimpanan Sementara di RAM)
// ==============================================

const storage = multer.memoryStorage();

// Filter: Cuma bolehin upload file gambar
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Hanya file gambar yang diperbolehkan!'), false);
  }
};


const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, 
  fileFilter: fileFilter
});

// ==============================================
// 2. MIDDLEWARE CONVERT KE WEBP (Pakai Sharp)
// ==============================================
const processImageToWebp = async (req, res, next) => {
  
  if (!req.file) return next();

  
  const uploadDir = path.join(__dirname, 'public', 'uploads');
  
 
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  
  const namaFileBaru = `kategori-${Date.now()}.webp`;
  const filePath = path.join(uploadDir, namaFileBaru);

  try {
   
    await sharp(req.file.buffer)
      .resize({ width: 500 }) 
      .webp({ quality: 80 })  
      .toFile(filePath);      

   
    req.body.ikon_kategori = `/uploads/${namaFileBaru}`;
    
    next(); 
  } catch (error) {
    console.error('Error saat kompresi gambar:', error);
    return res.status(500).json({ success: false, message: 'Gagal memproses/menyimpan gambar' });
  }
};

module.exports = {
  
  uploadKategoriIkon: upload.single('ikon_kategori'), 
  processImageToWebp
};
