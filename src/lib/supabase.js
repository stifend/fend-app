// ========================================
// 🔌 SUPABASE CLIENT
// ========================================
// File ini membuat koneksi ke database Supabase.
// URL & key diambil dari file .env (VITE_SUPABASE_URL & VITE_SUPABASE_KEY).
//
// Dipakai di seluruh aplikasi dengan:
//   import { supabase } from '../lib/supabase';
// ========================================

import { createClient } from '@supabase/supabase-js';

// Ambil konfigurasi dari environment variable (file .env)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

// Validasi konfigurasi - throw error jika tidak lengkap
if (!supabaseUrl || !supabaseKey) {
    const errorMsg = '⚠️ Konfigurasi Supabase belum lengkap!\n\n' +
        'Pastikan file .env ada dan berisi:\n' +
        'VITE_SUPABASE_URL=your_supabase_url\n' +
        'VITE_SUPABASE_KEY=your_supabase_key\n\n' +
        'Copy dari .env example dan isi dengan credentials Anda.';
    
    console.error(errorMsg);
    
    // Throw error untuk menghentikan app jika config tidak valid
    // Ini lebih baik daripada membiarkan app berjalan dengan Supabase broken
    throw new Error(errorMsg);
}

// Buat dan export client Supabase
export const supabase = createClient(supabaseUrl, supabaseKey);
