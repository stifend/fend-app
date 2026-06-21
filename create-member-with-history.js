// ====================================
// SCRIPT CREATE MEMBER WITH BOOKING HISTORY
// ====================================
// Script untuk membuat 1 akun member yang sudah punya riwayat pemesanan
// Member ini akan ter-match dengan data customer & reservasi yang sudah ada
// ====================================

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Baca file .env
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

// Data customer yang ada di mockData.js (CST001)
// Email ini akan digunakan untuk matching dengan reservasi
const customerData = {
  id: 'CST001',
  name: 'Andi Wijaya',
  email: 'andi.wijaya@gmail.com',
  phone: '+62 812-3456-7890',
  address: 'Jl. Sudirman No. 45, Jakarta'
};

// Data member account yang akan dibuat
// Email HARUS SAMA dengan customer untuk matching riwayat transaksi
const memberData = {
  name: customerData.name,
  email: customerData.email,  // Email sama dengan customer CST001
  password: 'member123',        // Password untuk login
  role: 'user',                // Role: user (member)
  phone: customerData.phone,
  address: customerData.address
};

// Fungsi untuk membuat member account dengan riwayat
async function createMemberWithHistory() {
  console.log('\n🎯 ===== MEMBUAT AKUN MEMBER DENGAN RIWAYAT PEMESANAN =====\n');
  
  try {
    // 1. Cek apakah email sudah terdaftar
    console.log('🔍 Step 1: Mengecek apakah email sudah terdaftar...');
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('email', memberData.email)
      .single();

    if (existingUser) {
      console.log('⚠️  Email sudah terdaftar!');
      console.log('\n📋 Data member yang sudah ada:');
      console.log('   ID:', existingUser.id);
      console.log('   Nama:', existingUser.name);
      console.log('   Email:', existingUser.email);
      console.log('   Role:', existingUser.role);
      console.log('   Phone:', existingUser.phone);
      console.log('   Address:', existingUser.address);
      console.log('   Created:', existingUser.created_at);
      console.log('\n✅ Akun member sudah siap digunakan!');
      
      // Tetap lanjut ke step 2 untuk info riwayat
    } else {
      // 2. Insert akun member baru
      console.log('➕ Step 2: Membuat akun member baru...');
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

      console.log('✅ Akun member berhasil dibuat!');
      console.log('\n📋 Detail Akun:');
      console.log('   ID:', newUser.id);
      console.log('   Nama:', newUser.name);
      console.log('   Email:', newUser.email);
      console.log('   Password:', memberData.password);
      console.log('   Role:', newUser.role);
      console.log('   Phone:', newUser.phone);
      console.log('   Address:', newUser.address);
      console.log('   Created:', newUser.created_at);
    }

    // 3. Informasi tentang riwayat pemesanan
    console.log('\n📊 Step 3: Informasi Riwayat Pemesanan');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n✨ AKUN MEMBER INI SUDAH PUNYA RIWAYAT PEMESANAN!');
    console.log('\n🔗 Matching Logic:');
    console.log('   1. Email member:', memberData.email);
    console.log('   2. Customer dengan email yang sama: CST001 - Andi Wijaya');
    console.log('   3. Reservasi dengan customer ID CST001 akan muncul di riwayat');
    console.log('\n📦 Data yang tersedia di mockData.js:');
    console.log('   • Customer ID: CST001');
    console.log('   • Email: andi.wijaya@gmail.com');
    console.log('   • Total Reservasi: Semua reservasi dengan prefix CST001');
    console.log('\n💡 Contoh Reservasi:');
    console.log('   • CST001-RES001 - Standard Room');
    console.log('   • CST001-RES002 - Deluxe Room');
    console.log('   • CST001-RES003 - Suite Room');
    console.log('   • Dan seterusnya...');
    
    console.log('\n🎉 ===== SELESAI =====\n');
    console.log('✅ Akun member berhasil dibuat!');
    console.log('✅ Riwayat transaksi siap ditampilkan!');
    
    console.log('\n📝 CARA LOGIN:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('1. Buka: http://localhost:5174/login-member');
    console.log('2. Email:', memberData.email);
    console.log('3. Password:', memberData.password);
    console.log('4. Klik Login');
    console.log('5. Setelah login, buka tab "Riwayat Transaksi"');
    console.log('6. Anda akan melihat semua pemesanan dari customer CST001');
    
    console.log('\n📊 YANG AKAN TERLIHAT DI MEMBER DASHBOARD:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📌 Tab Profile:');
    console.log('   • Nama: Andi Wijaya');
    console.log('   • Email: andi.wijaya@gmail.com');
    console.log('   • Role: user');
    console.log('   • Phone: +62 812-3456-7890');
    console.log('   • Address: Jl. Sudirman No. 45, Jakarta');
    console.log('\n📌 Tab Riwayat Transaksi:');
    console.log('   • List semua reservasi dengan ID yang dimulai CST001');
    console.log('   • Detail: Tipe kamar, tanggal, harga, status');
    console.log('   • Filter otomatis berdasarkan email member');
    console.log('\n📌 Tab Statistik:');
    console.log('   • Total Booking');
    console.log('   • Booking Lunas');
    console.log('   • Booking Pending');
    console.log('   • Total Pengeluaran');
    console.log('   • Recent Activity (5 terakhir)');
    
    console.log('\n🔐 CREDENTIALS:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Email   :', memberData.email);
    console.log('Password:', memberData.password);
    console.log('Role    :', memberData.role);
    console.log('\n✨ Silakan login dan cek riwayat transaksi Anda!\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nDetail error:', error);
  }
}

// Jalankan fungsi
createMemberWithHistory();
