import { LayoutDashboard, BookOpen, Table, X, LogOut } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';

// isOpen  = apakah sidebar terbuka (di mobile)
// onClose = fungsi untuk nutup sidebar saat link diklik atau overlay diklik
const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (window.confirm('Yakin ingin keluar?')) {
      try {
        await axios.post('http://localhost:3000/api/admin/logout', {}, { withCredentials: true });
        navigate('/login');
      } catch (error) {
        console.error('Gagal logout:', error);
        alert('Gagal logout. Silakan coba lagi.');
      }
    }
  };
  return (
    <aside className={`
      fixed inset-y-0 left-0 z-30 w-64 bg-dark text-gray-300 flex flex-col shrink-0
      transform transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      lg:relative lg:translate-x-0 lg:z-auto
    `}>
      {/* Logo Area */}
      <div className="flex items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-white font-bold text-xl">
            A
          </div>
          <span className="text-white text-base font-bold">Admin Dashboard</span>
        </div>

        {/* Tombol close (X) hanya muncul di mobile) */}
        <button
          onClick={onClose}
          className="lg:hidden text-gray-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Menu Area */}
      <div className="flex-1 overflow-y-auto py-4 px-4 space-y-6">
        <div>
          <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Menu
          </h3>
          <ul className="space-y-1">
            <li>
              <NavLink
                to="/admin"
                end
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${
                    isActive ? 'bg-dark-light text-white' : 'hover:bg-dark-light hover:text-white'
                  }`
                }
              >
                <LayoutDashboard size={20} />
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/kategori"
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${
                    isActive ? 'bg-dark-light text-white' : 'hover:bg-dark-light hover:text-white'
                  }`
                }
              >
                <Table size={20} />
                <span>Kategori</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/materi"
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${
                    isActive ? 'bg-dark-light text-white' : 'hover:bg-dark-light hover:text-white'
                  }`
                }
              >
                <BookOpen size={20} />
                <span>Materi</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>

      {/* Logout Area */}
      <div className="p-4 border-t border-gray-700/50 mt-auto shrink-0">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-md transition-colors text-red-400 hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
