import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Edit2, Trash2, Plus, X, Image as ImageIcon, LayoutGrid } from 'lucide-react';

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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-8 rounded-2xl border border-gray-100 shadow-sm gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-primary">
            <LayoutGrid size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Kategori Pelajaran</h2>
            <p className="text-sm text-gray-500 mt-1">Kelola dan atur kategori materi pembelajaran.</p>
          </div>
        </div>
        <button 
          onClick={handleAdd}
          className="bg-primary hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-sm shadow-blue-500/20 hover:shadow-md hover:-translate-y-0.5"
        >
          <Plus size={18} />
          <span className="font-medium">Tambah Kategori</span>
        </button>
      </div>

      {/* Tabel Data */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-widest">
                <th className="px-8 py-5">Ikon Kategori</th>
                <th className="px-8 py-5">Nama Kategori</th>
                <th className="px-8 py-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="3" className="px-8 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <span>Memuat data...</span>
                    </div>
                  </td>
                </tr>
              ) : kategoris.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-8 py-16 text-center">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                      <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4 border border-blue-100 shadow-sm">
                        <LayoutGrid size={32} className="text-primary/60" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-700 mb-1">Belum Ada Kategori</h3>
                      <p className="text-gray-500 text-sm mb-6">Kamu belum menambahkan kategori apa pun. Tambahkan kategori baru untuk mulai menyusun materi.</p>
                      <button 
                        onClick={handleAdd}
                        className="text-primary bg-blue-50 hover:bg-blue-100 px-5 py-2.5 rounded-xl font-medium transition-colors border border-blue-100"
                      >
                        + Tambah Kategori Pertama
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                kategoris.map((item) => (
                  <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-8 py-4">
                      {item.ikon_kategori ? (
                        <img 
                          src={`http://localhost:3000${item.ikon_kategori}`} 
                          alt={item.nama_kategori} 
                          className="w-14 h-14 rounded-xl object-cover border border-gray-100 shadow-sm group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-slate-50 flex items-center justify-center text-gray-400 border border-gray-100 group-hover:scale-105 transition-transform">
                          <ImageIcon size={20} />
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-4 font-semibold text-gray-700 group-hover:text-primary transition-colors">
                      {item.nama_kategori}
                    </td>
                    <td className="px-8 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(item)}
                          className="text-blue-500 hover:text-white bg-blue-50 hover:bg-blue-500 p-2.5 rounded-xl transition-all"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="text-red-500 hover:text-white bg-red-50 hover:bg-red-500 p-2.5 rounded-xl transition-all"
                          title="Hapus"
                        >
                          <Trash2 size={18} />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-white">
              <h3 className="text-xl font-bold text-gray-800">
                {isEditing ? 'Edit Kategori' : 'Tambah Kategori'}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 p-2 rounded-full transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body (Form) */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6 bg-slate-50/30">
              
              {/* Input Nama */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nama Kategori
                </label>
                <input 
                  type="text" 
                  value={namaKategori}
                  onChange={(e) => setNamaKategori(e.target.value)}
                  placeholder="Contoh: Matematika"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all shadow-sm"
                  required
                />
              </div>

              {/* Input Ikon/Foto */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ikon Kategori <span className="text-gray-400 font-normal">(Opsional)</span>
                </label>
                
                {/* Image Preview Box */}
                <div className="mt-2 mb-4 flex justify-center">
                  {previewIkon ? (
                    <div className="relative group">
                      <img 
                        src={previewIkon} 
                        alt="Preview" 
                        className="w-28 h-28 object-cover rounded-2xl border-2 border-primary/20 shadow-md"
                      />
                      <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <ImageIcon size={24} className="text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-28 h-28 bg-white rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 shadow-sm">
                      <ImageIcon size={28} className="mb-2 text-gray-300" />
                      <span className="text-[11px] font-medium uppercase tracking-wider">No Image</span>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <input 
                    type="file" 
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-primary hover:file:bg-blue-100 transition-colors cursor-pointer"
                  />
                </div>
                <p className="text-[13px] text-gray-400 mt-3 leading-relaxed">
                  Format: JPG, PNG, GIF. Maks 2MB. Gambar akan otomatis dikonversi ke WebP untuk performa.
                </p>
              </div>

              {/* Modal Footer (Buttons) */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl font-medium transition-all shadow-sm"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 text-white bg-primary hover:bg-blue-700 rounded-xl font-medium transition-all shadow-sm shadow-blue-500/30"
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
