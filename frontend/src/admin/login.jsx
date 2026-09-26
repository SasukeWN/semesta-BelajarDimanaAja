import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Panggil API Login Backend
      const response = await axios.post(
        'http://localhost:3000/api/admin/login', 
        { username, password }, 
        { withCredentials: true } // Wajib agar HttpOnly Cookie tersimpan di browser
      );

      if (response.data.success) {
        // Login berhasil, cookie udah nempel, langsung redirect ke Dashboard Admin
        navigate('/admin');
      }
    } catch (err) {
      console.error('Login error:', err);
      // Tampilkan pesan error dari backend, atau pesan default
      setError(err.response?.data?.message || 'Terjadi kesalahan saat login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
        
        {/* Header Login */}
        <div className="bg-primary px-6 py-8 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="text-white" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">Admin Panel</h2>
          <p className="text-primary-100 text-sm text-blue-100">Silakan login untuk mengelola konten</p>
        </div>

        {/* Form Login */}
        <div className="p-8">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-5 border border-red-100 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Input Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <User size={18} />
                </div>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  required 
                />
              </div>
            </div>

            {/* Input Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  required 
                />
              </div>
            </div>

            {/* Tombol Login */}
            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-2.5 rounded-md text-white font-medium transition-all mt-4
                ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-primary hover:bg-blue-700 shadow-md hover:shadow-lg'}`}
            >
              {loading ? 'Memeriksa...' : 'Masuk'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Login;
