import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, Menu, X } from 'lucide-react';

const NavbarUser = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = (path) => {
    setIsOpen(false);
    if (path.startsWith('#')) {
      if (location.pathname !== '/') {
        navigate('/' + path);
      } else {
        const element = document.querySelector(path);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(path);
    }
  };

  return (
    <>
      {/* ==================== NAVBAR ==================== */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => handleNav('/')}
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center group-hover:bg-blue-700 transition-colors">
              <BookOpen size={18} className="text-white" />
            </div>
            <span className="font-bold text-gray-800 text-lg group-hover:text-primary transition-colors">
              BelajarDimanaAja
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => handleNav('/')} className="text-gray-600 hover:text-primary font-medium transition-colors">
              Beranda
            </button>
            <button onClick={() => handleNav('#tentang')} className="text-gray-600 hover:text-primary font-medium transition-colors">
              Tentang Kami
            </button>
            <button onClick={() => handleNav('#kategori')} className="text-gray-600 hover:text-primary font-medium transition-colors">
              Materi
            </button>
            
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            onClick={() => setIsOpen(true)}
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* ==================== OVERLAY (background gelap saat drawer terbuka) ==================== */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ==================== DRAWER SIDEBAR (slide dari kanan) ==================== */}
      <div
        className={`
          fixed top-0 right-0 h-full w-72 bg-white z-50 shadow-2xl
          transform transition-transform duration-300 ease-in-out md:hidden
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Header Drawer */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <BookOpen size={18} className="text-white" />
            </div>
            <span className="font-bold text-gray-800">Menu</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="px-4 py-6 flex flex-col gap-1">
          <button
            onClick={() => handleNav('/')}
            className="text-left px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-primary rounded-xl font-medium transition-colors"
          >
            🏠 Beranda
          </button>
          <button
            onClick={() => handleNav('#tentang')}
            className="text-left px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-primary rounded-xl font-medium transition-colors"
          >
            ℹ️ Tentang Kami
          </button>
          <button
            onClick={() => handleNav('#kategori')}
            className="text-left px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-primary rounded-xl font-medium transition-colors"
          >
            📚 Materi
          </button>
        </nav>

        
      </div>
    </>
  );
};

export default NavbarUser;
