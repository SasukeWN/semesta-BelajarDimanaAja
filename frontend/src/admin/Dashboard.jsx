import { useState, useEffect } from 'react';
import axios from 'axios';
import { BookOpen, Table, Image as ImageIcon, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [totalKategori, setTotalKategori] = useState(0);
  const [totalMateri, setTotalMateri] = useState(0);
  const [kategoris, setKategoris] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [resKategori, resMateri] = await Promise.all([
          axios.get('http://localhost:3000/api/kategori'),
          axios.get('http://localhost:3000/api/materi/admin/all', { withCredentials: true })
        ]);

        setKategoris(resKategori.data.data);
        setTotalKategori(resKategori.data.data.length);
        setTotalMateri(resMateri.data.data.length);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-8 text-white shadow-lg shadow-blue-500/20">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-blue-100 mb-2">
            <Sparkles size={20} className="animate-pulse" />
            <span className="font-medium text-sm tracking-wide uppercase">Admin Panel BelajarDimanaAja</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-2">Selamat Datang!</h2>
          <p className="text-blue-100 max-w-xl leading-relaxed">
            Kelola semua materi dan kategori pembelajaran dengan mudah. Pantau perkembangan konten edukasi untuk membantu anak-anak belajar di mana saja.
          </p>
        </div>
        
        {/* Dekorasi Background */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 right-10 w-48 h-48 bg-white opacity-10 rounded-full blur-2xl pointer-events-none"></div>
      </div>

      {/* Kartu Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card Kategori */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 p-6 flex items-center justify-between group">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
              <Table size={28} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Total Kategori</p>
              <p className="text-4xl font-bold text-gray-800">
                {loading ? '...' : totalKategori}
              </p>
            </div>
          </div>
          <Link to="/admin/kategori" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-primary transition-colors">
            <ArrowRight size={20} />
          </Link>
        </div>

        {/* Card Materi */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 p-6 flex items-center justify-between group">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
              <BookOpen size={28} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Total Materi</p>
              <p className="text-4xl font-bold text-gray-800">
                {loading ? '...' : totalMateri}
              </p>
            </div>
          </div>
          <Link to="/admin/materi" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
            <ArrowRight size={20} />
          </Link>
        </div>

      </div>

      {/* Grid Kategori (Daftar) */}
      <div>
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="text-lg font-bold text-gray-800">Kategori Tersedia</h3>
          <Link to="/admin/kategori" className="text-sm font-medium text-primary hover:text-blue-700 hover:underline">
            Lihat Semua
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 h-24 animate-pulse"></div>
            ))}
          </div>
        ) : kategoris.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-500 shadow-sm">
            Belum ada kategori yang ditambahkan.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {kategoris.slice(0, 8).map((item) => (
              <div key={item.id} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all p-4 flex items-center gap-4 group cursor-default">
                {item.ikon_kategori ? (
                  <img
                    src={`http://localhost:3000${item.ikon_kategori}`}
                    alt={item.nama_kategori}
                    className="w-12 h-12 rounded-lg object-cover border border-gray-100 shadow-sm group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-primary border border-blue-100 shadow-sm group-hover:scale-105 transition-transform">
                    <ImageIcon size={20} />
                  </div>
                )}
                <span className="text-gray-800 font-semibold truncate group-hover:text-primary transition-colors">
                  {item.nama_kategori}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Dashboard;
