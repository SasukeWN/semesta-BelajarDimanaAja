import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, BookOpen, Tag } from 'lucide-react';

const BacaMateri = () => {
  const { id } = useParams(); // Ambil ID materi dari URL
  const navigate = useNavigate();

  const [materi, setMateri] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchMateri = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:3000/api/materi/${id}`);
        setMateri(res.data.data);
      } catch (error) {
        if (error.response?.status === 404) {
          setNotFound(true);
        }
        console.error('Gagal mengambil materi:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMateri();
  }, [id]);

  // ==================== LOADING STATE ====================
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <BookOpen size={40} className="mx-auto mb-3 animate-pulse" />
          <p>Memuat materi...</p>
        </div>
      </div>
    );
  }

  // ==================== NOT FOUND STATE ====================
  if (notFound || !materi) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <BookOpen size={48} className="mx-auto mb-3 opacity-40" />
          <p className="text-lg font-medium">Materi tidak ditemukan</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 text-primary hover:underline text-sm"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      {/* ==================== NAVBAR ==================== */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Kembali</span>
          </button>
          <span className="text-gray-300">|</span>
          <span className="font-bold text-gray-700 text-sm truncate">
            BelajarDimanaAja
          </span>
        </div>
      </nav>

      {/* ==================== KONTEN MATERI ==================== */}
      <article className="max-w-3xl mx-auto px-4 py-10">

        {/* Breadcrumb Kategori */}
        <div className="mb-4 flex items-center gap-2">
          <Tag size={14} className="text-primary" />
          <span className="text-primary text-sm font-medium">{materi.nama_kategori}</span>
        </div>

        {/* Judul Materi */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-6">
          {materi.judul_materi}
        </h1>

        {/* Garis Pembatas */}
        <hr className="border-gray-200 mb-8" />

        {/* Isi Materi */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8">
          <p className="text-gray-700 text-base leading-loose whitespace-pre-line">
            {materi.isi_materi}
          </p>
        </div>

        {/* Tombol Kembali di Bawah */}
        <div className="mt-10 text-center">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary border border-gray-200 hover:border-primary px-5 py-2.5 rounded-full transition-all"
          >
            <ArrowLeft size={16} />
            Kembali ke Daftar Materi
          </button>
        </div>
      </article>

      {/* ==================== FOOTER ==================== */}
      <footer className="border-t border-gray-200 bg-white mt-8">
        <div className="max-w-3xl mx-auto px-4 py-6 text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} BelajarDimanaAja · Dibuat dengan ❤️ untuk pendidikan Indonesia
        </div>
      </footer>
    </div>
  );
};

export default BacaMateri;

