import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BookOpen, ChevronRight, Image as ImageIcon } from 'lucide-react';

const Home = () => {
  const [kategoris, setKategoris] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Ambil semua kategori dari backend
  useEffect(() => {
    const fetchKategori = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/kategori');
        setKategoris(res.data.data);
      } catch (error) {
        console.error('Gagal mengambil kategori:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchKategori();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      {/* ==================== NAVBAR ==================== */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <BookOpen size={18} className="text-white" />
            </div>
            <span className="font-bold text-gray-800 text-lg">BelajarDimanaAja</span>
          </div>
          <span className="text-sm text-gray-500 hidden sm:block">Platform Belajar Gratis untuk Semua</span>
        </div>
      </nav>

      {/* ==================== HERO SECTION ==================== */}
      <section className="bg-gradient-to-br from-primary to-blue-700 text-white">
        <div className="max-w-5xl mx-auto px-4 py-16 md:py-24 text-center">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            Belajar Dimana Aja, <br />
            <span className="text-blue-200">Kapan Aja</span>
          </h1>
          <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto mb-8">
            Akses ratusan materi pelajaran berkualitas secara gratis. 
            Dirancang khusus untuk pelajar di seluruh Indonesia.
          </p>
          <a
            href="#kategori"
            className="inline-block bg-white text-primary font-semibold px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
          >
            Mulai Belajar Sekarang
          </a>
        </div>

        {/* Gelombang dekoratif di bawah hero */}
        <div className="w-full overflow-hidden leading-none">
          <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" className="fill-slate-50">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      {/* ==================== KATEGORI SECTION ==================== */}
      <section id="kategori" className="max-w-5xl mx-auto px-4 py-12">
        <div className="mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Pilih Kategori Pelajaran</h2>
          <p className="text-gray-500 mt-2">Klik kategori di bawah untuk melihat daftar materinya</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
                <div className="w-16 h-16 bg-gray-200 rounded-xl mb-4" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && kategoris.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <BookOpen size={48} className="mx-auto mb-3 opacity-40" />
            <p className="text-lg">Belum ada kategori tersedia saat ini.</p>
          </div>
        )}

        {/* Kategori Grid */}
        {!loading && kategoris.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {kategoris.map((kategori) => (
              <button
                key={kategori.id}
                onClick={() => navigate(`/kategori/${kategori.id}`)}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200 p-6 text-left group"
              >
                {/* Ikon Kategori */}
                <div className="mb-4">
                  {kategori.ikon_kategori ? (
                    <img
                      src={`http://localhost:3000${kategori.ikon_kategori}`}
                      alt={kategori.nama_kategori}
                      className="w-16 h-16 rounded-xl object-cover border border-gray-100"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-blue-50 flex items-center justify-center">
                      <ImageIcon size={28} className="text-primary/60" />
                    </div>
                  )}
                </div>

                {/* Nama & Tombol */}
                <div className="flex items-end justify-between gap-3">
                  <h3 className="font-semibold text-gray-800 text-base leading-snug group-hover:text-primary transition-colors">
                    {kategori.nama_kategori}
                  </h3>
                  <ChevronRight
                    size={18}
                    className="text-gray-400 shrink-0 group-hover:text-primary group-hover:translate-x-1 transition-all"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">Lihat semua materi →</p>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="border-t border-gray-200 bg-white mt-8">
        <div className="max-w-5xl mx-auto px-4 py-6 text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} BelajarDimanaAja · Dibuat dengan ❤️ untuk pendidikan Indonesia
        </div>
      </footer>
    </div>
  );
};

export default Home;
