import { Routes, Route, Navigate } from 'react-router-dom';

// Halaman Admin
import AdminLayout from './admin/admin';
import Dashboard from './admin/Dashboard';
import Kategori from './admin/Kategori';
import Materi from './admin/Materi';
import Login from './admin/login';

// Halaman User/Siswa
import Home from './user/home';
import KategoriDetail from './user/KategoriDetail';
import BacaMateri from './user/BacaMateri';

import './index.css';

function App() {
  return (
    <Routes>
      {/* ===== HALAMAN PUBLIK (Siswa) ===== */}

      {/* Halaman Utama */}
      <Route path="/" element={<Home />} />

      {/* Daftar Materi berdasarkan Kategori */}
      <Route path="/kategori/:id" element={<KategoriDetail />} />

      {/* Halaman Baca Materi */}
      <Route path="/materi/:id" element={<BacaMateri />} />


      {/* ===== HALAMAN ADMIN (Perlu Login) ===== */}

      {/* Halaman Login */}
      <Route path="/login" element={<Login />} />

      {/* Dashboard Admin */}
      <Route path="/admin" element={
        <AdminLayout><Dashboard /></AdminLayout>
      } />

      {/* Kelola Kategori */}
      <Route path="/admin/kategori" element={
        <AdminLayout><Kategori /></AdminLayout>
      } />

      {/* Kelola Materi */}
      <Route path="/admin/materi" element={
        <AdminLayout><Materi /></AdminLayout>
      } />

      {/* Fallback: route tidak dikenal → ke beranda */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
