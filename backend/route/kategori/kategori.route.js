const express = require('express');
const router = express.Router();
const db = require('../../db');
const { verifyToken } = require('../../middleware');

// Import middleware multer dan sharp yang baru aja dibikin
const { uploadKategoriIkon, processImageToWebp } = require('../../middleware_foto');

// ==============================================
// 1. GET SEMUA KATEGORI (Bisa diakses publik/siswa)
// ==============================================
router.get('/', async (req, res) => {
  try {
    const [kategori] = await db.query('SELECT * FROM kategori ORDER BY created_at DESC');
    
    res.json({
      success: true,
      message: 'Berhasil mengambil semua data kategori',
      data: kategori
    });
  } catch (error) {
    console.error('Error get kategori:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
  }
});

// ==============================================
// 2. GET KATEGORI BERDASARKAN ID (Bisa diakses publik/siswa)
// ==============================================
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [kategori] = await db.query('SELECT * FROM kategori WHERE id = ?', [id]);
    
    if (kategori.length === 0) {
      return res.status(404).json({ success: false, message: 'Kategori tidak ditemukan' });
    }

    res.json({
      success: true,
      message: 'Berhasil mengambil data kategori',
      data: kategori[0]
    });
  } catch (error) {
    console.error('Error get kategori by id:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
  }
});

// ==============================================
// 3. TAMBAH KATEGORI BARU (Hanya Admin/Guru)
// ==============================================
// Tambahkan middleware uploadKategoriIkon dan processImageToWebp di sini
router.post('/', verifyToken, uploadKategoriIkon, processImageToWebp, async (req, res) => {
  // ikon_kategori sekarang udah otomatis di-replace sama path file WebP dari middleware_foto (kalau admin upload foto)
  const { nama_kategori, ikon_kategori } = req.body;

  try {
    if (!nama_kategori) {
      return res.status(400).json({ success: false, message: 'Nama kategori wajib diisi!' });
    }

    const [result] = await db.query(
      'INSERT INTO kategori (nama_kategori, ikon_kategori) VALUES (?, ?)',
      [nama_kategori, ikon_kategori || null]
    );

    res.status(201).json({
      success: true,
      message: 'Kategori berhasil ditambahkan!',
      data: {
        id: result.insertId,
        nama_kategori,
        ikon_kategori
      }
    });
  } catch (error) {
    console.error('Error insert kategori:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
  }
});

// ==============================================
// 4. UPDATE KATEGORI (Hanya Admin/Guru)
// ==============================================
router.put('/:id', verifyToken, uploadKategoriIkon, processImageToWebp, async (req, res) => {
  const { id } = req.params;
  // ikon_kategori bisa berisi path file baru (kalau admin upload), atau undefined (kalau nggak diubah)
  const { nama_kategori, ikon_kategori } = req.body;

  try {
    if (!nama_kategori) {
      return res.status(400).json({ success: false, message: 'Nama kategori wajib diisi!' });
    }

    // Pakai COALESCE supaya kalau ikon_kategori nggak dikirim (null), dia nggak akan ngehapus ikon lama di database
    const [result] = await db.query(
      'UPDATE kategori SET nama_kategori = ?, ikon_kategori = COALESCE(?, ikon_kategori) WHERE id = ?',
      [nama_kategori, ikon_kategori || null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Kategori tidak ditemukan' });
    }

    res.json({
      success: true,
      message: 'Kategori berhasil diupdate!'
    });
  } catch (error) {
    console.error('Error update kategori:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
  }
});

// ==============================================
// 5. HAPUS KATEGORI (Hanya Admin/Guru)
// ==============================================
router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query('DELETE FROM kategori WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Kategori tidak ditemukan' });
    }

    res.json({
      success: true,
      message: 'Kategori berhasil dihapus!'
    });
  } catch (error) {
    console.error('Error delete kategori:', error);
    
    // Cek apakah errornya karena foreign key (ada materi yang masih nyangkut ke kategori ini)
    if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.errno === 1451) {
      return res.status(400).json({ 
        success: false, 
        message: 'Kategori tidak bisa dihapus karena masih ada materi yang menggunakan kategori ini. Silakan hapus atau pindahkan materinya terlebih dahulu.' 
      });
    }

    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
  }
});

module.exports = router;
