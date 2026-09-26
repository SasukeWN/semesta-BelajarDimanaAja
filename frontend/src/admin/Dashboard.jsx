import { useState, useEffect } from 'react';
import axios from 'axios';
import { BookOpen, Table, Image as ImageIcon } from 'lucide-react';

const Dashboard = () => {
  const [totalKategori, setTotalKategori] = useState(0);
  const [totalMateri, setTotalMateri] = useState(0);
  const [kategoris, setKategoris] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Ambil data kategori dan materi sekaligus
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
    <div className="space-y-6">

      {/* Judul Halaman */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        <p className="text-sm text-gray-500 mt-1">Selamat datang kembali, Admin!</p>
      </div>

      {/* Kartu Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

        {/* Card Total Kategori */}
        <div className="bg-white rounded-sm border border-gray-200 shadow-sm p-6 flex items-center gap-5">
          <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
            <Table size={26} className="text-primary" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Kategori</p>
            <p className="text-3xl font-bold text-gray-800 mt-0.5">
              {loading ? '...' : totalKategori}
            </p>
          </div>
        </div>

        {/* Card Total Materi */}
        <div className="bg-white rounded-sm border border-gray-200 shadow-sm p-6 flex items-center gap-5">
          <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
            <BookOpen size={26} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Materi</p>
            <p className="text-3xl font-bold text-gray-800 mt-0.5">
              {loading ? '...' : totalMateri}
            </p>
          </div>
        </div>
      </div>

      {/* List Kategori */}
      <div className="bg-white rounded-sm border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-base font-bold text-gray-800">Daftar Kategori</h3>
        </div>

        {loading ? (
          <p className="px-6 py-8 text-center text-gray-500 text-sm">Memuat data...</p>
        ) : kategoris.length === 0 ? (
          <p className="px-6 py-8 text-center text-gray-500 text-sm">Belum ada kategori.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {kategoris.map((item) => (
              <li key={item.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                {/* Ikon Kategori */}
                {item.ikon_kategori ? (
                  <img
                    src={`http://localhost:3000${item.ikon_kategori}`}
                    alt={item.nama_kategori}
                    className="w-10 h-10 rounded object-cover border border-gray-200 shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200 shrink-0">
                    <ImageIcon size={18} />
                  </div>
                )}
                <span className="text-gray-800 font-medium">{item.nama_kategori}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  );
};

export default Dashboard;
