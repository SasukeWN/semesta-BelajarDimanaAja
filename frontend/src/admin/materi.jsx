import { useState, useEffect } from 'react';
import axios from 'axios';
import { Edit2, Trash2, Plus, X, BookOpen } from 'lucide-react';

const API_MATERI = 'http://localhost:3000/api/materi';
const API_KATEGORI = 'http://localhost:3000/api/kategori';

const Materi = () => {
  const [materis, setMateris] = useState([]);
  const [kategoris, setKategoris] = useState([]); // Untuk dropdown pilihan kategori
  const [loading, setLoading] = useState(true);
  
  // State Modal
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  
  // State form
  const [idKategori, setIdKategori] = useState('');
  const [judulMateri, setJudulMateri] = useState('');
  const [isiMateri, setIsiMateri] = useState('');
  const [statusMateri, setStatusMateri] = useState('draft'); 

 
  const fetchData = async () => {
    setLoading(true);
    try {
      const [resMateri, resKategori] = await Promise.all([
        axios.get(`${API_MATERI}/admin/all`, { withCredentials: true }),
        axios.get(API_KATEGORI)
      ]);
      
      setMateris(resMateri.data.data);
      setKategoris(resKategori.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Gagal mengambil data dari server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle buka modal tambah
  const handleAdd = () => {
    setIsEditing(false);
    setEditId(null);
    setIdKategori('');
    setJudulMateri('');
    setIsiMateri('');
    setStatusMateri('draft');
    setShowModal(true);
  };

  // Handle buka modal edit
  const handleEdit = (materi) => {
    setIsEditing(true);
    setEditId(materi.id);
    setIdKategori(materi.id_kategori);
    setJudulMateri(materi.judul_materi);
    setIsiMateri(materi.isi_materi);
    setStatusMateri(materi.status);
    setShowModal(true);
  };

  // Handle Submit (Tambah / Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!idKategori || !judulMateri || !isiMateri) {
      return alert('Semua field wajib diisi!');
    }

    const payload = {
      id_kategori: idKategori,
      judul_materi: judulMateri,
      isi_materi: isiMateri,
      status: statusMateri
    };

    try {
      if (isEditing) {
        await axios.put(`${API_MATERI}/${editId}`, payload, {
          withCredentials: true
        });
        alert('Materi berhasil diupdate!');
      } else {
        await axios.post(API_MATERI, payload, {
          withCredentials: true
        });
        alert('Materi berhasil ditambahkan!');
      }
      
      setShowModal(false);
      fetchData(); // Refresh tabel biar update
    } catch (error) {
      console.error('Error submit materi:', error);
      alert(error.response?.data?.message || 'Terjadi kesalahan saat menyimpan data');
    }
  };

  // Handle Hapus
  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus materi ini?')) {
      try {
        await axios.delete(`${API_MATERI}/${id}`, {
          withCredentials: true
        });
        alert('Materi berhasil dihapus!');
        fetchData();
      } catch (error) {
        console.error('Error delete materi:', error);
        alert(error.response?.data?.message || 'Terjadi kesalahan saat menghapus data');
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-8 rounded-2xl border border-gray-100 shadow-sm gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <BookOpen size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Materi Pelajaran</h2>
            <p className="text-sm text-gray-500 mt-1">Kelola dan update isi materi pembelajaran untuk siswa.</p>
          </div>
        </div>
        <button 
          onClick={handleAdd}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-sm shadow-emerald-500/20 hover:shadow-md hover:-translate-y-0.5"
        >
          <Plus size={18} />
          <span className="font-medium">Tambah Materi</span>
        </button>
      </div>

      {/* Tabel Data */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-widest">
                <th className="px-8 py-5 w-2/5">Judul Materi</th>
                <th className="px-8 py-5">Kategori</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-8 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <span>Memuat data...</span>
                    </div>
                  </td>
                </tr>
              ) : materis.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-8 py-12 text-center text-gray-500">
                    Belum ada data materi. Silakan tambah baru.
                  </td>
                </tr>
              ) : (
                materis.map((item) => (
                  <tr key={item.id} className="hover:bg-emerald-50/30 transition-colors group">
                    <td className="px-8 py-4">
                      <span className="font-semibold text-gray-700 group-hover:text-emerald-700 transition-colors">
                        {item.judul_materi}
                      </span>
                    </td>
                    <td className="px-8 py-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-sm font-medium border border-blue-100">
                        {item.nama_kategori}
                      </span>
                    </td>
                    <td className="px-8 py-4">
                      <span className={`inline-flex px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full border ${
                        item.status === 'publish' 
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                          : 'bg-amber-50 text-amber-600 border-amber-200'
                      }`}>
                        {item.status}
                      </span>
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
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-white shrink-0">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <BookOpen size={20} />
                </div>
                {isEditing ? 'Edit Materi' : 'Tambah Materi Baru'}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 p-2 rounded-full transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body (Form) */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto bg-slate-50/30 custom-scrollbar">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Input Judul */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Judul Materi
                  </label>
                  <input 
                    type="text" 
                    value={judulMateri}
                    onChange={(e) => setJudulMateri(e.target.value)}
                    placeholder="Contoh: Pengenalan Aljabar Dasar"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all shadow-sm"
                    required
                  />
                </div>

                {/* Pilih Kategori */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Pilih Kategori
                  </label>
                  <select
                    value={idKategori}
                    onChange={(e) => setIdKategori(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all shadow-sm cursor-pointer"
                    required
                  >
                    <option value="" disabled>-- Pilih Kategori --</option>
                    {kategoris.map(kat => (
                      <option key={kat.id} value={kat.id}>{kat.nama_kategori}</option>
                    ))}
                  </select>
                </div>

                {/* Status Materi */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status Publikasi
                  </label>
                  <select
                    value={statusMateri}
                    onChange={(e) => setStatusMateri(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all shadow-sm cursor-pointer"
                  >
                    <option value="draft">Draft (Disembunyikan dari Siswa)</option>
                    <option value="publish">Publish (Tampil untuk Siswa)</option>
                  </select>
                </div>
              </div>

              {/* Input Isi Materi (Textarea) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Isi Materi
                </label>
                <textarea 
                  value={isiMateri}
                  onChange={(e) => setIsiMateri(e.target.value)}
                  placeholder="Tuliskan penjelasan materi pembelajaran secara lengkap di sini..."
                  rows="12"
                  className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all resize-y shadow-sm leading-relaxed text-gray-700"
                  required
                />
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
                  className="px-5 py-2.5 text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl font-medium transition-all shadow-sm shadow-emerald-500/30"
                >
                  {isEditing ? 'Simpan Perubahan' : 'Publish Materi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Materi;
