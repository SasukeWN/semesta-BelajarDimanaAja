import { useState, useEffect } from 'react';
import { ChevronDown, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './sidebar';

// AdminLayout menerima "children" sebagai isi konten halaman
const AdminLayout = ({ children }) => {
  // State untuk buka/tutup sidebar di mobile
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // State nama admin yang login (diambil dari backend)
  const [adminName, setAdminName] = useState('Admin');

  const navigate = useNavigate();

  // Ambil data profil admin saat layout pertama kali dimuat
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/admin/profile', {
          withCredentials: true
        });
        if (res.data.success) {
          setAdminName(res.data.data.username);
        }
      } catch (error) {
        // Jika gagal (misal token expired), redirect ke halaman login
        console.error('Gagal ambil profil, redirect ke login:', error);
        navigate('/login');
      }
    };

    fetchProfile();
  }, [navigate]);

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">

      {/* Overlay gelap di belakang sidebar (hanya muncul di mobile saat sidebar terbuka) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Component */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">

        {/* Top Header Navbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 shrink-0">

          {/* Tombol Hamburger (hanya muncul di mobile) */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-500 hover:text-gray-700 p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <Menu size={22} />
          </button>

          {/* Di desktop, sisi kiri header kosong */}
          <div className="hidden lg:block" />

          {/* Right: Profile - nama diambil dari state (bukan hardcode) */}
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-800 capitalize">{adminName}</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
            <img
              src={`https://ui-avatars.com/api/?name=${adminName}&background=e2e8f0&color=334155`}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
            />
            <ChevronDown size={16} className="text-gray-400" />
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
