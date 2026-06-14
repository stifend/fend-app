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

// Peringatan kalau konfigurasi belum diisi
if (!supabaseUrl || !supabaseKey) {
    console.error(
        'Konfigurasi Supabase belum lengkap. Pastikan VITE_SUPABASE_URL dan VITE_SUPABASE_KEY ada di file .env'
    );
}

// Buat dan export client Supabase
export const supabase = createClient(supabaseUrl, supabaseKey);
