import { useState, useEffect } from 'react';
import axios from 'axios';
import { Edit2, Trash2, Plus, X } from 'lucide-react';

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

    // Nggak perlu FormData, karena nggak ada foto. Langsung kirim JSON biasa.
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
    <div className="space-y-6">
      {/* Header Halaman */}
      <div className="flex justify-between items-center bg-white p-6 rounded-sm border border-gray-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Materi Pelajaran</h2>
          <p className="text-sm text-gray-500 mt-1">Kelola isi materi pelajaran untuk siswa.</p>
        </div>
        <button 
          onClick={handleAdd}
          className="bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors"
        >
          <Plus size={18} />
          <span>Tambah Materi</span>
        </button>
      </div>

      {/* Tabel Data */}
      <div className="bg-white rounded-sm border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-600 uppercase tracking-wider">
                <th className="px-6 py-4">Judul Materi</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    Memuat data...
                  </td>
                </tr>
              ) : materis.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    Belum ada data materi. Silakan tambah baru.
                  </td>
                </tr>
              ) : (
                materis.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {item.judul_materi}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {item.nama_kategori}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        item.status === 'publish' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {item.status.toUpperCase()}
                      </span>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-md shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b border-gray-200 bg-gray-50 shrink-0">
              <h3 className="text-lg font-bold text-gray-800">
                {isEditing ? 'Edit Materi' : 'Tambah Materi Baru'}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body (Form) - Bisa di-scroll kalau kepanjangan */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Input Judul */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Judul Materi
                  </label>
                  <input 
                    type="text" 
                    value={judulMateri}
                    onChange={(e) => setJudulMateri(e.target.value)}
                    placeholder="Contoh: Pengenalan Aljabar"
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                    required
                  />
                </div>

                {/* Pilih Kategori */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pilih Kategori
                  </label>
                  <select
                    value={idKategori}
                    onChange={(e) => setIdKategori(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={statusMateri}
                    onChange={(e) => setStatusMateri(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white"
                  >
                    <option value="draft">Draft (Belum Tampil di Siswa)</option>
                    <option value="publish">Publish (Tampil di Siswa)</option>
                  </select>
                </div>
              </div>

              {/* Input Isi Materi (Textarea) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Isi Materi
                </label>
                <textarea 
                  value={isiMateri}
                  onChange={(e) => setIsiMateri(e.target.value)}
                  placeholder="Tuliskan isi materi selengkap-lengkapnya di sini..."
                  rows="8"
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-y"
                  required
                />
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
                  {isEditing ? 'Simpan Perubahan' : 'Tambah Materi'}
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
