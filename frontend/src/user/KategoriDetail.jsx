import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, BookOpen } from 'lucide-react';

import NavbarUser from './navbar_user';
import ChatAI from './ChatAI';

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

      {/* Header Kategori Kustom dengan Background */}
      <div className="bg-gradient-to-r from-primary to-blue-700 text-white pb-16 pt-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Tombol Kembali */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-blue-100 hover:text-white transition-colors mb-8 w-fit bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Kembali ke Beranda</span>
          </button>

          {/* Title Area */}
          {!loading && kategori ? (
            <div>
              <span className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                Kategori Pelajaran
              </span>
              <h1 className="text-3xl md:text-5xl font-extrabold mb-3 drop-shadow-sm">
                {kategori.nama_kategori}
              </h1>
              <p className="text-blue-100 text-lg">
                Tersedia <span className="font-bold text-white">{materis.length}</span> materi pembelajaran yang bisa kamu pelajari.
              </p>
            </div>
          ) : (
            <div className="animate-pulse">
              <div className="w-32 h-6 bg-white/20 rounded-full mb-4" />
              <div className="w-64 h-10 bg-white/20 rounded-lg mb-4" />
              <div className="w-48 h-6 bg-white/20 rounded-lg" />
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-8 pb-16">
        
        {/* Loading State */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse shadow-sm">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 bg-gray-200 rounded-full shrink-0" />
                  <div className="flex-1 w-full">
                    <div className="h-5 bg-gray-200 rounded-full w-1/2 mb-3" />
                    <div className="h-3 bg-gray-100 rounded-full w-full mb-2" />
                    <div className="h-3 bg-gray-100 rounded-full w-3/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && materis.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-dashed border-gray-200 mt-8">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
              <BookOpen size={40} className="text-gray-300" />
            </div>
            <p className="text-xl font-bold text-gray-700">Belum Ada Materi</p>
            <p className="text-gray-500 mt-2 max-w-sm mx-auto">
              Materi untuk kategori ini belum tersedia atau masih berstatus draft. Silakan cek kembali nanti.
            </p>
          </div>
        )}

        {/* Daftar Materi */}
        {!loading && materis.length > 0 && (
          <div className="space-y-5">
            {materis.map((materi, index) => (
              <button
                key={materi.id}
                onClick={() => navigate(`/materi/${materi.id}`)}
                className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 p-6 sm:p-8 text-left group flex flex-col sm:flex-row gap-6 items-start sm:items-center relative overflow-hidden"
              >
                {/* Efek Hover Garis Samping */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top"></div>

                {/* Nomor & Icon */}
                <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 text-primary font-bold text-xl shrink-0 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                  {index + 1}
                </div>

                {/* Konten */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-primary transition-colors leading-tight mb-2">
                    {materi.judul_materi}
                  </h3>
                  <p className="text-gray-500 leading-relaxed text-sm line-clamp-2">
                    {buatPreview(materi.isi_materi)}
                  </p>
                </div>

                {/* Badge Aksi */}
                <div className="shrink-0 flex items-center gap-2 bg-slate-50 group-hover:bg-blue-50 px-4 py-2.5 rounded-xl border border-gray-100 group-hover:border-blue-200 transition-colors">
                  <span className="text-sm font-semibold text-gray-500 group-hover:text-primary transition-colors">Baca Materi</span>
                  <ArrowLeft
                    size={18}
                    className="text-gray-400 rotate-180 group-hover:text-primary group-hover:translate-x-1 transition-all"
                  />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      <ChatAI />
    </div>
  );
};

export default KategoriDetail;

