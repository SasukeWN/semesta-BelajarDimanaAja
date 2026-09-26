import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { BookOpen, ChevronRight, Image as ImageIcon, GraduationCap, Zap, Map } from 'lucide-react';
import NavbarUser from './navbar_user';
import ChatAI from './ChatAI';

const Home = () => {
  const [kategoris, setKategoris] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Scroll otomatis kalau ada hash di URL (misal #tentang) saat komponen mount
  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const element = document.querySelector(location.hash);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [location]);

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
      <NavbarUser />

      {/* ==================== HERO SECTION ==================== */}
      <section className="bg-gradient-to-br from-primary to-blue-700 text-white relative">
        <div className="max-w-5xl mx-auto px-4 py-16 md:py-24 text-center">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            Belajar Dimana Aja, <br />
            <span className="text-blue-200">Kapan Aja</span>
          </h1>
          <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto mb-8">
            Akses ratusan materi pelajaran berkualitas secara gratis. 
            Dirancang khusus untuk menjangkau pelajar di seluruh pelosok Nusantara.
          </p>
          <button
            onClick={() => document.querySelector('#kategori')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-block bg-white text-primary font-bold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
          >
            Mulai Belajar Sekarang
          </button>
        </div>

        {/* Gelombang dekoratif di bawah hero */}
        <div className="w-full overflow-hidden leading-none absolute bottom-0 left-0">
          <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" className="fill-slate-50">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      {/* ==================== ABOUT SECTION (TENTANG) ==================== */}
      <section id="tentang" className="bg-white border-b border-gray-200 pb-16 pt-24">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Apa itu BelajarDimanaAja?</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              <span className="font-bold text-primary">BelajarDimanaAja</span> adalah buku materi pelajaran digital yang dirancang khusus untuk anak-anak dan pelajar sekolah, terutama bagi mereka yang berada di pedesaan atau daerah pelosok.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed mt-4">
              Kami sadar bahwa proses belajar di daerah seringkali terbebani oleh keharusan membeli buku fisik yang harganya cukup mahal. Kami hadir sebagai solusi yang efisien dan hemat biaya, karena platform ini sepenuhnya gratis. Anak-anak di desa tidak perlu lagi repot atau terbebani biaya beli buku cetak, karena semua materi pelajaran selalu sedia dan bisa dibaca kapan saja langsung dari layar HP atau laptop di web ini.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="text-center p-8 bg-slate-50 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-blue-100 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Map size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Belajar Tanpa Batas Jarak</h3>
              <p className="text-gray-600">
                Tidak peduli kamu tinggal di kota besar atau desa terpencil, materi pembelajaran ini siap diakses. 
                Sesuai namanya, kamu benar-benar bisa belajar dimana aja!
              </p>
            </div>
            
            {/* Card 2 */}
            <div className="text-center p-8 bg-slate-50 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Super Ringan & Hemat Kuota</h3>
              <p className="text-gray-600">
                Website ini didesain seminimalis mungkin tanpa elemen berat. Sangat stabil meski di daerah susah sinyal 
                dan dipastikan menghemat pengeluaran kuota data.
              </p>
            </div>
            
            {/* Card 3 */}
            <div className="text-center p-8 bg-slate-50 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <GraduationCap size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Kualitas Pendidikan Setara</h3>
              <p className="text-gray-600">
                Menyediakan rangkuman dan materi terstruktur yang dikurasi langsung oleh tenaga pendidik. 
                Menyeimbangkan kualitas pendidikan antara pusat kota dan pelosok.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== KATEGORI SECTION ==================== */}
      <section id="kategori" className="max-w-5xl mx-auto px-4 py-16 md:py-24">
        <div className="mb-12 text-center">
          <span className="text-primary font-bold tracking-wider text-sm uppercase bg-blue-50 px-4 py-1.5 rounded-full mb-3 inline-block">
            Materi Pembelajaran
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mt-2">Pilih Kategori Belajarmu</h2>
          <p className="text-gray-500 mt-4 text-lg max-w-2xl mx-auto">
            Berbagai macam pelajaran telah kami ringkas agar mudah dipahami. Pilih materi yang ingin kamu pelajari hari ini!
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-3xl border border-gray-100 p-6 animate-pulse shadow-sm">
                <div className="w-16 h-16 bg-gray-200 rounded-2xl mb-6" />
                <div className="h-5 bg-gray-200 rounded-full w-3/4 mb-3" />
                <div className="h-4 bg-gray-100 rounded-full w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && kategoris.length === 0 && (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-gray-200">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <BookOpen size={40} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-700">Belum Ada Kategori</h3>
            <p className="text-gray-500 mt-2">Kategori pelajaran sedang disiapkan oleh Admin.</p>
          </div>
        )}

        {/* Kategori Grid */}
        {!loading && kategoris.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {kategoris.map((kategori) => (
              <button
                key={kategori.id}
                onClick={() => navigate(`/kategori/${kategori.id}`)}
                className="relative bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 hover:border-primary/30 hover:-translate-y-2 transition-all duration-300 p-8 text-left group flex flex-col h-full overflow-hidden"
              >
                {/* Decorative background circle */}
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500"></div>

                {/* Ikon Kategori */}
                <div className="relative mb-6">
                  {kategori.ikon_kategori ? (
                    <div className="w-20 h-20 rounded-2xl bg-white shadow-sm p-1 border border-gray-50 group-hover:rotate-3 transition-transform duration-300">
                      <img
                        src={`http://localhost:3000${kategori.ikon_kategori}`}
                        alt={kategori.nama_kategori}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-50 to-primary/10 flex items-center justify-center shadow-sm group-hover:rotate-3 transition-transform duration-300 border border-blue-100/50">
                      <ImageIcon size={32} className="text-primary/70" />
                    </div>
                  )}
                </div>

                {/* Nama & Tombol */}
                <div className="relative mt-auto">
                  <h3 className="font-extrabold text-gray-800 text-xl mb-4 group-hover:text-primary transition-colors">
                    {kategori.nama_kategori}
                  </h3>
                  
                  <div className="flex items-center text-sm font-semibold text-gray-500 group-hover:text-primary transition-colors">
                    <span>Lihat Materi</span>
                    <ChevronRight
                      size={18}
                      className="ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                    />
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 py-8 text-center">
          <p className="text-gray-500 font-medium">
            © {new Date().getFullYear()} BelajarDimanaAja
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Dibuat dengan ❤️ untuk pendidikan Indonesia yang lebih merata
          </p>
        </div>
      </footer>
      <ChatAI />
    </div>
  );
};

export default Home;
