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
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50/50 font-sans overflow-hidden">

      {/* Overlay gelap di belakang sidebar (hanya muncul di mobile saat sidebar terbuka) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Component */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">

        {/* Top Header Navbar - Glassmorphism style */}
        <header className="h-20 bg-white/70 backdrop-blur-md border-b border-gray-200/50 flex items-center justify-between px-4 md:px-8 shrink-0 shadow-sm z-10 sticky top-0">

          {/* Tombol Hamburger (hanya muncul di mobile) */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-600 hover:text-primary p-2.5 rounded-xl hover:bg-white shadow-sm transition-all"
          >
            <Menu size={22} />
          </button>

          {/* Sisi kiri header */}
          <div className="hidden lg:flex items-center gap-2">
             <p className="text-gray-500 text-sm font-medium">Hello, <span className="text-gray-800 font-bold capitalize">{adminName}</span> 👋</p>
          </div>

          {/* Right: Profile - nama diambil dari state */}
          <div className="flex items-center gap-4 cursor-pointer hover:bg-white/60 p-2 rounded-2xl transition-all">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-800 capitalize">{adminName}</p>
              <p className="text-xs text-primary font-medium">Administrator</p>
            </div>
            <div className="relative">
              <img
                src={`https://ui-avatars.com/api/?name=${adminName}&background=eff6ff&color=1d4ed8&bold=true`}
                alt="Profile"
                className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
