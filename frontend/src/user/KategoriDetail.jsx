import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, BookOpen } from 'lucide-react';

import NavbarUser from './navbar_user';

const KategoriDetail = () => {
  const { id } = useParams(); // Ambil ID kategori dari URL
  const navigate = useNavigate();

  const [kategori, setKategori] = useState(null);
  const [materis, setMateris] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Ambil daftar materi berdasarkan ID kategori (hanya yang publish)
        const [resMateri, resKategori] = await Promise.all([
          axios.get(`http://localhost:3000/api/materi/kategori/${id}`),
          axios.get(`http://localhost:3000/api/kategori/${id}`)
        ]);

        setMateris(resMateri.data.data);
        setKategori(resKategori.data.data);
      } catch (error) {
        console.error('Gagal mengambil data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Potong teks panjang jadi preview singkat
  const buatPreview = (teks, maxChar = 120) => {
    if (!teks) return '';
    return teks.length > maxChar ? teks.slice(0, maxChar).trimEnd() + '...' : teks;
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      {/* ==================== NAVBAR ==================== */}
      <NavbarUser />

      <div className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Tombol Kembali (Di luar navbar agar lebih konsisten) */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Kembali ke Beranda</span>
        </button>

        {/* Header Kategori */}
        {!loading && kategori && (
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              {kategori.nama_kategori}
            </h1>
            <p className="text-gray-500 mt-1">
              {materis.length} materi tersedia dalam kategori ini
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-1/2 mb-3" />
                <div className="h-3 bg-gray-200 rounded w-full mb-2" />
                <div className="h-3 bg-gray-200 rounded w-3/4" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && materis.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <BookOpen size={48} className="mx-auto mb-3 opacity-40" />
            <p className="text-lg font-medium">Belum ada materi</p>
            <p className="text-sm mt-1">Materi untuk kategori ini belum tersedia.</p>
          </div>
        )}

        {/* Daftar Materi */}
        {!loading && materis.length > 0 && (
          <div className="space-y-4">
            {materis.map((materi, index) => (
              <button
                key={materi.id}
                onClick={() => navigate(`/materi/${materi.id}`)}
                className="w-full bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200 p-6 text-left group"
              >
                <div className="flex items-start gap-4">
                  {/* Nomor urut */}
                  <div className="w-9 h-9 rounded-full bg-blue-50 text-primary font-bold text-sm flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                    {index + 1}
                  </div>

                  {/* Konten */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 group-hover:text-primary transition-colors">
                      {materi.judul_materi}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                      {buatPreview(materi.isi_materi)}
                    </p>
                  </div>

                  {/* Ikon panah */}
                  <ArrowLeft
                    size={18}
                    className="text-gray-300 shrink-0 rotate-180 group-hover:text-primary group-hover:translate-x-1 transition-all mt-1"
                  />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default KategoriDetail;

