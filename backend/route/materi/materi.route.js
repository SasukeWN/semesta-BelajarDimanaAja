const express = require('express');
const router = express.Router();
const db = require('../../db');
const { verifyToken } = require('../../middleware');

// ==============================================
// 1. GET SEMUA MATERI (Public/Siswa)
// Hanya menampilkan materi yang statusnya 'publish'
// ==============================================
router.get('/', async (req, res) => {
  try {
   
    const query = `
      SELECT m.*, k.nama_kategori 
      FROM materi m 
      LEFT JOIN kategori k ON m.id_kategori = k.id 
      WHERE m.status = 'publish' 
      ORDER BY m.created_at DESC
    `;
    const [materi] = await db.query(query);
    
    res.json({
      success: true,
      message: 'Berhasil mengambil semua materi',
      data: materi
    });
  } catch (error) {
    console.error('Error get materi:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
  }
});

// ==============================================
// 1.5 GET SEMUA MATERI (Hanya Admin)
// Menampilkan semua materi tanpa filter status
// ==============================================
router.get('/admin/all', verifyToken, async (req, res) => {
  try {
    const query = `
      SELECT m.*, k.nama_kategori 
      FROM materi m 
      LEFT JOIN kategori k ON m.id_kategori = k.id 
      ORDER BY m.created_at DESC
    `;
    const [materi] = await db.query(query);
    
    res.json({
      success: true,
      message: 'Berhasil mengambil semua materi (Admin)',
      data: materi
    });
  } catch (error) {
    console.error('Error get all materi admin:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
  }
});


// ==============================================
// 2. GET MATERI BERDASARKAN KATEGORI (Public/Siswa)
// Cocok dipake pas user klik menu kategori A, lalu muncul list materinya
// ==============================================
router.get('/kategori/:id_kategori', async (req, res) => {
  const { id_kategori } = req.params;
  try {
    const query = `
      SELECT m.*, k.nama_kategori 
      FROM materi m 
      LEFT JOIN kategori k ON m.id_kategori = k.id 
      WHERE m.id_kategori = ? AND m.status = 'publish'
      ORDER BY m.created_at DESC
    `;
    const [materi] = await db.query(query, [id_kategori]);
    
    res.json({
      success: true,
      message: `Berhasil mengambil materi untuk kategori ini`,
      data: materi
    });
  } catch (error) {
    console.error('Error get materi by kategori:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
  }
});

// ==============================================
// 3. GET DETAIL MATERI BERDASARKAN ID (Public/Siswa)
// Untuk nampilin isi materi secara full pas lagi belajar
// ==============================================
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const query = `
      SELECT m.*, k.nama_kategori 
      FROM materi m 
      LEFT JOIN kategori k ON m.id_kategori = k.id 
      WHERE m.id = ?
    `;
    const [materi] = await db.query(query, [id]);
    
    if (materi.length === 0) {
      return res.status(404).json({ success: false, message: 'Materi tidak ditemukan' });
    }

    res.json({
      success: true,
      message: 'Berhasil mengambil detail materi',
      data: materi[0]
    });
  } catch (error) {
    console.error('Error get materi by id:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
  }
});

// ==============================================
// 4. TAMBAH MATERI BARU (Hanya Admin/Guru)
// ==============================================
router.post('/', verifyToken, async (req, res) => {
  const { id_kategori, judul_materi, isi_materi, status } = req.body;

  try {
    if (!id_kategori || !judul_materi || !isi_materi) {
      return res.status(400).json({ success: false, message: 'Kategori, Judul, dan Isi materi wajib diisi!' });
    }

    // Default status kalau nggak dikirim adalah 'draft'
    const statusMateri = status || 'draft';

    const [result] = await db.query(
      'INSERT INTO materi (id_kategori, judul_materi, isi_materi, status) VALUES (?, ?, ?, ?)',
      [id_kategori, judul_materi, isi_materi, statusMateri]
    );

    res.status(201).json({
      success: true,
      message: 'Materi berhasil ditambahkan!',
      data: { id: result.insertId, id_kategori, judul_materi, status: statusMateri }
    });
  } catch (error) {
    console.error('Error insert materi:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
  }
});

// ==============================================
// 5. UPDATE MATERI (Hanya Admin/Guru)
// ==============================================
router.put('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { id_kategori, judul_materi, isi_materi, status } = req.body;

  try {
    if (!id_kategori || !judul_materi || !isi_materi) {
      return res.status(400).json({ success: false, message: 'Kategori, Judul, dan Isi materi wajib diisi!' });
    }

    const [result] = await db.query(
      'UPDATE materi SET id_kategori = ?, judul_materi = ?, isi_materi = ?, status = ? WHERE id = ?',
      [id_kategori, judul_materi, isi_materi, status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Materi tidak ditemukan' });
    }

    res.json({
      success: true,
      message: 'Materi berhasil diupdate!'
    });
  } catch (error) {
    console.error('Error update materi:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
  }
});

// ==============================================
// 6. HAPUS MATERI (Hanya Admin/Guru)
// ==============================================
router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query('DELETE FROM materi WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Materi tidak ditemukan' });
    }

    res.json({
      success: true,
      message: 'Materi berhasil dihapus!'
    });
  } catch (error) {
    console.error('Error delete materi:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
  }
});

module.exports = router;
