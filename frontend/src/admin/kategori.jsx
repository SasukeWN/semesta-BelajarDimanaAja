import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Edit2, Trash2, Plus, X, Image as ImageIcon } from 'lucide-react';

const API_URL = 'http://localhost:3000/api/kategori';

const Kategori = () => {
  const [kategoris, setKategoris] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  
  // State form
  const [namaKategori, setNamaKategori] = useState('');
  const [ikonKategori, setIkonKategori] = useState(null);
  const [previewIkon, setPreviewIkon] = useState(null);
  
  const fileInputRef = useRef(null);

  // Fetch data kategori
  const fetchKategori = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      setKategoris(response.data.data);
    } catch (error) {
      console.error('Error fetching kategori:', error);
      alert('Gagal mengambil data kategori.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKategori();
  }, []);

  // Handle buka modal tambah
  const handleAdd = () => {
    setIsEditing(false);
    setEditId(null);
    setNamaKategori('');
    setIkonKategori(null);
    setPreviewIkon(null);
    setShowModal(true);
  };

  // Handle buka modal edit
  const handleEdit = (kategori) => {
    setIsEditing(true);
    setEditId(kategori.id);
    setNamaKategori(kategori.nama_kategori);
    setIkonKategori(null); // Kosongkan file input awal
    
    // Set preview pakai gambar yang udah ada di server
    if (kategori.ikon_kategori) {
      setPreviewIkon(`http://localhost:3000${kategori.ikon_kategori}`);
    } else {
      setPreviewIkon(null);
    }
    
    setShowModal(true);
  };

  // Handle pilih file foto
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIkonKategori(file);
      setPreviewIkon(URL.createObjectURL(file)); // Buat preview lokal langsung
    }
  };

  // Handle Submit (Tambah / Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!namaKategori) {
      return alert('Nama kategori wajib diisi!');
    }

    // Pakai FormData karena kita mau kirim file gambar (Multipart/form-data)
    const formData = new FormData();
    formData.append('nama_kategori', namaKategori);
    if (ikonKategori) {
      formData.append('ikon_kategori', ikonKategori);
    }

    try {
      if (isEditing) {
        await axios.put(`${API_URL}/${editId}`, formData, {
          withCredentials: true, // Wajib supaya JWT Cookie kekirim
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('Kategori berhasil diupdate!');
      } else {
        await axios.post(API_URL, formData, {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('Kategori berhasil ditambahkan!');
      }
      
      setShowModal(false);
      fetchKategori(); // Refresh tabel
    } catch (error) {
      console.error('Error submit kategori:', error);
      alert(error.response?.data?.message || 'Terjadi kesalahan saat menyimpan data');
    }
  };

  // Handle Hapus
  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus kategori ini?')) {
      try {
        await axios.delete(`${API_URL}/${id}`, {
          withCredentials: true
        });
        alert('Kategori berhasil dihapus!');
        fetchKategori();
      } catch (error) {
        console.error('Error delete kategori:', error);
        alert(error.response?.data?.message || 'Terjadi kesalahan saat menghapus data');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Halaman */}
      <div className="flex justify-between items-center bg-white p-6 rounded-sm border border-gray-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Kategori Pelajaran</h2>
          <p className="text-sm text-gray-500 mt-1">Kelola data kategori materi pelajaran di sini.</p>
        </div>
        <button 
          onClick={handleAdd}
          className="bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors"
        >
          <Plus size={18} />
          <span>Tambah Kategori</span>
        </button>
      </div>

      {/* Tabel Data */}
      <div className="bg-white rounded-sm border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-600 uppercase tracking-wider">
                <th className="px-6 py-4">Ikon</th>
                <th className="px-6 py-4">Nama Kategori</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                    Memuat data...
                  </td>
                </tr>
              ) : kategoris.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                    Belum ada data kategori. Silakan tambah baru.
                  </td>
                </tr>
              ) : (
                kategoris.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      {item.ikon_kategori ? (
                        <img 
                          src={`http://localhost:3000${item.ikon_kategori}`} 
                          alt={item.nama_kategori} 
                          className="w-12 h-12 rounded object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200">
                          <ImageIcon size={20} />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {item.nama_kategori}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3">
                        <button 
                          onClick={() => handleEdit(item)}
                          className="text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 p-2 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded transition-colors"
                          title="Hapus"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah/Edit */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-md shadow-xl w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800">
                {isEditing ? 'Edit Kategori' : 'Tambah Kategori Baru'}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body (Form) */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              
              {/* Input Nama */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Kategori
                </label>
                <input 
                  type="text" 
                  value={namaKategori}
                  onChange={(e) => setNamaKategori(e.target.value)}
                  placeholder="Contoh: Matematika"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  required
                />
              </div>

              {/* Input Ikon/Foto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ikon Kategori (Opsional)
                </label>
                
                {/* Image Preview Box */}
                <div className="mt-2 mb-3 flex justify-center">
                  {previewIkon ? (
                    <img 
                      src={previewIkon} 
                      alt="Preview" 
                      className="w-24 h-24 object-cover rounded-md border-2 border-dashed border-primary/50"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-50 rounded-md border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400">
                      <ImageIcon size={24} className="mb-1" />
                      <span className="text-xs">No image</span>
                    </div>
                  )}
                </div>

                <input 
                  type="file" 
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-primary hover:file:bg-blue-100 transition-colors"
                />
                <p className="text-xs text-gray-400 mt-2">
                  Format didukung: JPG, PNG, GIF. Maks 2MB. Gambar akan otomatis dikonversi ke WebP agar ringan.
                </p>
              </div>

              {/* Modal Footer (Buttons) */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded font-medium transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 text-white bg-primary hover:bg-blue-700 rounded font-medium transition-colors"
                >
                  {isEditing ? 'Simpan Perubahan' : 'Tambah Kategori'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Kategori;
