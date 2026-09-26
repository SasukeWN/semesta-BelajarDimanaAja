const express = require('express');
const router = express.Router();
const db = require('../../db');
const { verifyToken } = require('../../middleware');

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
router.post('/', verifyToken, async (req, res) => {
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
router.put('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { nama_kategori, ikon_kategori } = req.body;

  try {
    if (!nama_kategori) {
      return res.status(400).json({ success: false, message: 'Nama kategori wajib diisi!' });
    }

    const [result] = await db.query(
      'UPDATE kategori SET nama_kategori = ?, ikon_kategori = ? WHERE id = ?',
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
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
  }
});

module.exports = router;
