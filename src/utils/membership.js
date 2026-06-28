// ========================================
// ⭐ MEMBERSHIP UTILITIES
// ========================================
// Satu sumber kebenaran untuk logika membership member hotel.
// Dipakai bersama oleh:
//   - BookingPage    -> hitung diskon & upgrade tier saat booking
//   - MemberDashboard -> tampilkan tier, benefit, dan progress
//   - MembershipPage  -> daftar benefit (admin)
//
// Aturan tier berbasis TOTAL PENGELUARAN (akumulasi totalPayment
// dari seluruh reservasi milik member tersebut).
// ========================================

// Daftar benefit per tier (dipakai member dashboard & halaman admin)
export const membershipBenefits = {
  Silver: ['Diskon 5%', 'Welcome Drink', 'Late Checkout 12:00'],
  Gold: ['Diskon 10%', 'Free Breakfast', 'Late Checkout 14:00', 'Room Upgrade'],
  Platinum: ['Diskon 15%', 'Free Breakfast & Dinner', 'Late Checkout 16:00', 'Room Upgrade', 'Airport Transfer', 'Spa Voucher'],
};

// Ambang tier berdasarkan total pengeluaran (Rp) + diskon yang diberikan.
// Diurutkan dari tertinggi ke terendah supaya getTierBySpending mudah memilih.
// - None     : belum pernah booking (Rp 0)
// - Silver   : sudah booking pertama (>= Rp 1)
// - Gold     : total pengeluaran >= Rp 5.000.000
// - Platinum : total pengeluaran >= Rp 15.000.000
export const MEMBERSHIP_TIERS = [
  { tier: 'Platinum', minSpent: 15000000, discount: 0.15 },
  { tier: 'Gold', minSpent: 5000000, discount: 0.10 },
  { tier: 'Silver', minSpent: 1, discount: 0.05 },
  { tier: 'None', minSpent: 0, discount: 0 },
];

// Ikon emoji per tier (konsisten dengan UI yang sudah ada)
export const TIER_ICONS = {
  None: '🆕',
  Silver: '🥈',
  Gold: '🥇',
  Platinum: '💎',
};

// Tentukan nama tier berdasarkan total pengeluaran.
// totalSpent: angka total Rp -> kembalikan 'None' | 'Silver' | 'Gold' | 'Platinum'
export const getTierBySpending = (totalSpent = 0) => {
  const spent = Number(totalSpent) || 0;
  // Cari tier pertama (dari tertinggi) yang ambangnya terpenuhi
  const found = MEMBERSHIP_TIERS.find(t => spent >= t.minSpent);
  return found ? found.tier : 'None';
};

// Kembalikan persentase diskon (0 / 0.05 / 0.10 / 0.15) untuk sebuah tier
export const getDiscount = (tier) => {
  const found = MEMBERSHIP_TIERS.find(t => t.tier === tier);
  return found ? found.discount : 0;
};

// Info tier berikutnya + sisa Rp menuju tier itu (untuk progress di dashboard).
// Kembalikan null jika sudah di tier tertinggi (Platinum).
export const getNextTier = (totalSpent = 0) => {
  const spent = Number(totalSpent) || 0;
  const currentTier = getTierBySpending(spent);

  // Urutan naik tier: None -> Silver -> Gold -> Platinum
  const order = ['None', 'Silver', 'Gold', 'Platinum'];
  const currentIndex = order.indexOf(currentTier);

  // Sudah di tier tertinggi -> tidak ada tier berikutnya
  if (currentIndex === order.length - 1) return null;

  const nextName = order[currentIndex + 1];
  const nextTier = MEMBERSHIP_TIERS.find(t => t.tier === nextName);
  const remaining = Math.max(0, nextTier.minSpent - spent);

  return { tier: nextName, minSpent: nextTier.minSpent, remaining };
};
