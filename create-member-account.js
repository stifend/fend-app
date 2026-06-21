// ====================================
// SCRIPT CREATE MEMBER ACCOUNT
// ====================================
// Script untuk membuat 1 akun member di database Supabase
// Jalankan dengan: node create-member-account.js
// ====================================

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Baca file .env secara manual
const envContent = fs.readFileSync('.env', 'utf-8');
const envLines = envContent.split('\n');
const envVars = {};

envLines.forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim();
  }
});

// Konfigurasi Supabase
const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseKey = envVars.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: VITE_SUPABASE_URL dan VITE_SUPABASE_KEY harus diisi di file .env');
  process.exit(1);
}

console.log('🔗 Connecting to Supabase:', supabaseUrl);

// Buat client Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// Data member yang akan dibuat
const memberData = {
  name: 'John Member',
  email: 'member@novotel.com',
  password: '123456',
  role: 'user',
  phone: '+62 812-3456-7890',
  address: 'Jl. Sudirman No. 456, Jakarta'
};

// Fungsi untuk membuat member account
async function createMemberAccount() {
  console.log('🔄 Memulai proses pembuatan akun member...\n');
  
  try {
    // 1. Cek apakah email sudah terdaftar
    console.log('🔍 Mengecek apakah email sudah terdaftar...');
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('email', memberData.email)
      .single();

    if (existingUser) {
      console.log('⚠️  Email sudah terdaftar!');
      console.log('📋 Data member yang sudah ada:');
      console.log('   ID:', existingUser.id);
      console.log('   Nama:', existingUser.name);
      console.log('   Email:', existingUser.email);
      console.log('   Role:', existingUser.role);
      console.log('   Phone:', existingUser.phone);
      console.log('   Address:', existingUser.address);
      console.log('   Created:', existingUser.created_at);
      console.log('\n✅ Akun member sudah siap digunakan!');
      return;
    }

    // 2. Insert akun member baru
    console.log('➕ Membuat akun member baru...');
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([{
        name: memberData.name,
        email: memberData.email,
        password: memberData.password,
        role: memberData.role,
        phone: memberData.phone,
        address: memberData.address
      }])
      .select()
      .single();

    if (insertError) {
      console.error('❌ Error saat membuat akun:', insertError.message);
      return;
    }

    // 3. Tampilkan hasil
    console.log('\n✅ AKUN MEMBER BERHASIL DIBUAT!\n');
    console.log('📋 Detail Akun:');
    console.log('   ID:', newUser.id);
    console.log('   Nama:', newUser.name);
    console.log('   Email:', newUser.email);
    console.log('   Password:', memberData.password);
    console.log('   Role:', newUser.role);
    console.log('   Phone:', newUser.phone);
    console.log('   Address:', newUser.address);
    console.log('   Created:', newUser.created_at);
    
    console.log('\n🎉 Akun member siap digunakan!');
    console.log('\n📝 Cara Login:');
    console.log('   1. Buka: http://localhost:5174/login-member');
    console.log('   2. Email:', memberData.email);
    console.log('   3. Password:', memberData.password);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Jalankan fungsi
createMemberAccount();
