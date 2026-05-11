// ========== DATA CUSTOMER ==========
// Array berisi 5 data customer untuk testing
// Setiap customer punya: id, name, email, phone, address, joinDate
export const customers = [
  {
    id: 'P001',                              // ID unik customer
    name: 'Rina Amelia',                     // Nama lengkap
    email: 'rina.amelia@email.com',          // Email
    phone: '+62 812-3456-7890',              // Nomor telepon
    address: 'Jl. Merdeka No. 123, Jakarta', // Alamat lengkap
    joinDate: '2024-01-15'                   // Tanggal bergabung (format: YYYY-MM-DD)
  },
  {
    id: 'P002',
    name: 'Andi Putra',
    email: 'andi.putra@email.com',
    phone: '+62 812-3456-7891',
    address: 'Jl. Sudirman No. 456, Surabaya',
    joinDate: '2024-02-20'
  },
  {
    id: 'P003',
    name: 'Siti Rahma',
    email: 'siti.rahma@email.com',
    phone: '+62 812-3456-7892',
    address: 'Jl. Ahmad Yani No. 789, Bandung',
    joinDate: '2024-03-10'
  },
  {
    id: 'P004',
    name: 'Budi Santoso',
    email: 'budi.santoso@email.com',
    phone: '+62 812-3456-7893',
    address: 'Jl. Gatot Subroto No. 321, Medan',
    joinDate: '2024-03-25'
  },
  {
    id: 'P005',
    name: 'Dewi Lestari',
    email: 'dewi.lestari@email.com',
    phone: '+62 812-7777-8888',
    address: 'Jl. Diponegoro No. 56, Yogyakarta',
    joinDate: '2024-04-05'
  },
];

// ========== DATA RESERVASI ==========
// Array berisi 5 data reservasi untuk testing
// Data reservasi SINKRON dengan data customer (ID dan info kontak sama)
// Setiap reservasi punya: id, name, reservation, payment, email, phone, address
export const reservations = [
  { 
    id: 'P001',                              // ID customer (sama dengan customers[0].id)
    name: 'Rina Amelia',                     // Nama (sama dengan customers[0].name)
    reservation: 'RSV-7684',                 // Nomor reservasi unik
    payment: 'Lunas',                        // Status pembayaran: Lunas / Pending / Belum Bayar
    email: 'rina.amelia@email.com',          // Email (sama dengan customers[0].email)
    phone: '+62 812-3456-7890',              // Telepon (sama dengan customers[0].phone)
    address: 'Jl. Merdeka No. 123, Jakarta'  // Alamat (sama dengan customers[0].address)
  },
  { 
    id: 'P002',
    name: 'Andi Putra',
    reservation: 'RSV-7685',
    payment: 'Pending',                      // Status: Pending (belum lunas)
    email: 'andi.putra@email.com',
    phone: '+62 812-3456-7891',
    address: 'Jl. Sudirman No. 456, Surabaya'
  },
  { 
    id: 'P003',
    name: 'Siti Rahma',
    reservation: 'RSV-7686',
    payment: 'Lunas',
    email: 'siti.rahma@email.com',
    phone: '+62 812-3456-7892',
    address: 'Jl. Ahmad Yani No. 789, Bandung'
  },
  { 
    id: 'P004',
    name: 'Budi Santoso',
    reservation: 'RSV-7687',
    payment: 'Belum Bayar',                  // Status: Belum Bayar (belum ada pembayaran)
    email: 'budi.santoso@email.com',
    phone: '+62 812-3456-7893',
    address: 'Jl. Gatot Subroto No. 321, Medan'
  },
  { 
    id: 'P005',
    name: 'Dewi Lestari',
    reservation: 'RSV-7688',
    payment: 'Lunas',
    email: 'dewi.lestari@email.com',
    phone: '+62 812-7777-8888',
    address: 'Jl. Diponegoro No. 56, Yogyakarta'
  },
];

// CATATAN:
// - Data ini digunakan sebagai initial state di DataContext.jsx
// - Data bisa diubah melalui fungsi update di Context (updateCustomer, updateReservation, dll)
// - Perubahan data hanya tersimpan di memory (hilang saat refresh browser)
// - Untuk data persistent, perlu integrasi dengan backend/database
