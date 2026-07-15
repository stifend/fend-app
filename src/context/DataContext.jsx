// ========================================
// 🗄️ DATA CONTEXT (Supabase)
// ========================================
// Menyediakan data reservasi & customer ke seluruh aplikasi.
// Sumber data: Supabase (via RPC), bukan lagi localStorage/mock.
//
// API context tetap sama seperti versi sebelumnya supaya komponen
// yang sudah ada tidak perlu diubah:
//   reservations, customers,
//   updateReservationPayment, updateReservation, updateCustomer,
//   addReservation, addCustomer,
//   getMemberSpending, upsertCustomerMembership,
//   submitFeedback,
//   loading, error, refresh
// ========================================

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { getTierBySpending } from '../utils/membership';

const DataContext = createContext();

// Custom hook untuk mengakses data dari Context
// eslint-disable-next-line react-refresh/only-export-components
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [reservations, setReservations] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ========== LOAD DATA DARI SUPABASE ==========
  // Ambil semua reservasi, customer, & payments lewat RPC.
  const refresh = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [resRes, custRes, payRes] = await Promise.all([
        supabase.rpc('get_all_reservations'),
        supabase.rpc('get_all_customers'),
        supabase.rpc('get_all_payments'),
      ]);

      if (resRes.error) throw resRes.error;
      if (custRes.error) throw custRes.error;
      // if (payRes.error) throw payRes.error; // Jangan throw error jika payments tidak ada

      setReservations(resRes.data || []);
      setCustomers(custRes.data || []);
      setPayments(payRes.data || []);
    } catch (err) {
      console.error('Gagal memuat data dari Supabase:', err);
      setError('Gagal memuat data dari server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();

    // Berlangganan (subscribe) ke perubahan data di semua tabel secara real-time
    const subscription = supabase
      .channel('custom-all-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public' },
        (payload) => {
          console.log('Realtime update received:', payload);
          refresh(); // Muat ulang data setiap ada perubahan
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [refresh]);

  // ========== UPDATE STATUS PEMBAYARAN ==========
  // Memperbarui status di server lalu sinkronkan state lokal.
  const updateReservationPayment = async (id, newStatus) => {
    // Optimistic update supaya UI langsung berubah
    setReservations(prev =>
      prev.map(res => (res.id === id ? { ...res, payment: newStatus } : res))
    );
    const { error: rpcError } = await supabase.rpc('update_payment_status', {
      p_id: id,
      p_status: newStatus,
    });
    if (rpcError) {
      console.error('Gagal update pembayaran:', rpcError);
      setError('Gagal memperbarui status pembayaran.');
      // Muat ulang agar state kembali sesuai server
      refresh();
    }
  };

  // ========== UPDATE DATA RESERVASI ==========
  const updateReservation = async (id, updatedData) => {
    setReservations(prev =>
      prev.map(res => (res.id === id ? { ...res, ...updatedData } : res))
    );
    const { error: rpcError } = await supabase.rpc('update_reservation', {
      p_id: id,
      p_name: updatedData.name ?? null,
      p_email: updatedData.email ?? null,
      p_phone: updatedData.phone ?? null,
      p_address: updatedData.address ?? null,
      p_reservation: updatedData.reservation ?? null,
    });
    if (rpcError) {
      console.error('Gagal update reservasi:', rpcError);
      setError('Gagal memperbarui reservasi.');
      refresh();
    }
  };

  // ========== UPDATE DATA CUSTOMER ==========
  const updateCustomer = async (id, updatedData) => {
    setCustomers(prev =>
      prev.map(cust => (cust.id === id ? { ...cust, ...updatedData } : cust))
    );
    const { error: rpcError } = await supabase.rpc('update_customer', {
      p_id: id,
      p_name: updatedData.name ?? null,
      p_email: updatedData.email ?? null,
      p_phone: updatedData.phone ?? null,
      p_address: updatedData.address ?? null,
      p_city: updatedData.city ?? null,
    });
    if (rpcError) {
      console.error('Gagal update customer:', rpcError);
      setError('Gagal memperbarui customer.');
      refresh();
    }
  };

  // ========== TAMBAH RESERVASI (BOOKING) ==========
  // Memakai RPC create_reservation: server menghitung subtotal, diskon,
  // tier, lalu upsert customer otomatis. Mengembalikan baris reservasi
  // yang baru dibuat (camelCase) untuk dipakai pemanggil.
  const addReservation = async (booking) => {
    // Log parameter untuk debugging
    console.log('📋 Booking Data:', booking);
    
    const params = {
      p_email: booking.email,
      p_name: booking.name,
      p_phone: booking.phone ?? null,
      p_address: booking.address ?? null,
      p_room_type: booking.roomType,
      p_check_in: booking.checkIn,
      p_check_out: booking.checkOut,
      p_guests: Number(booking.guests) || 1,
      p_special_request: booking.specialRequest ?? null,
      p_member_voucher_id: booking.memberVoucherId ?? null,
    };
    
    console.log('📤 RPC Parameters:', params);
    console.log('📤 RPC Call URL:', `${supabase.rest.url}/rest/v1/rpc/create_reservation`);
    
    const { data, error: rpcError } = await supabase.rpc('create_reservation', params);

    if (rpcError) {
      console.error('❌ RPC Error Detail:', rpcError);
      console.error('Error code:', rpcError.code);
      console.error('Error message:', rpcError.message);
      console.error('Error hint:', rpcError.hint);
      console.error('Error details:', rpcError.details);
      console.error('Full error object:', JSON.stringify(rpcError, null, 2));
      
      // User-friendly error message
      let errorMessage = 'Gagal membuat reservasi.';
      if (rpcError.message && rpcError.message.includes('ambiguous')) {
        errorMessage = '⚠️ Database error: Silakan jalankan SQL fix di Supabase (FIX-RESERVATION-AMBIGUOUS-EMAIL.sql)';
      } else if (rpcError.message) {
        errorMessage = `Error: ${rpcError.message}`;
      }
      
      setError(errorMessage);
      throw rpcError;
    }

    console.log('✅ RPC Success! Response:', data);

    const created = Array.isArray(data) ? data[0] : data;

    // Sinkronkan state lokal (reservasi + customer/tier) tanpa fetch ulang penuh
    if (created) {
      setReservations(prev => [created, ...prev]);
      // Muat ulang customer agar tier terbaru ikut ter-update
      supabase.rpc('get_all_customers').then(({ data: custData, error: custErr }) => {
        if (!custErr && custData) setCustomers(custData);
      });
    }

    return created;
  };

  // ========== TAMBAH CUSTOMER MANUAL (opsional, dipakai admin) ==========
  const addCustomer = async (newCustomer) => {
    // Optimistic: tampilkan dulu, lalu sinkronkan via refresh
    setCustomers(prev => [newCustomer, ...prev]);
    await refresh();
  };

  // ========== MEMBERSHIP ==========
  // Total pengeluaran member berdasarkan email (dari state reservasi).
  const getMemberSpending = (email) => {
    if (!email) return 0;
    return reservations
      .filter(r => r.email === email)
      .reduce((sum, r) => sum + (Number(r.totalPayment) || 0), 0);
  };

  // Hitung tier terbaru member. Karena create_reservation sudah mengurus
  // upsert customer + tier di server, fungsi ini cukup mengembalikan tier
  // berdasarkan total pengeluaran saat ini (dipakai untuk sinkronisasi UI).
  const upsertCustomerMembership = (email) => {
    if (!email) return 'None';
    const totalSpent = getMemberSpending(email);
    return getTierBySpending(totalSpent);
  };

  // ========== TAMBAH PAYMENT BARU ==========
  // Memakai RPC create_payment: server mencatat payment + update status reservasi.
  const addPayment = async (paymentData) => {
    const { data, error: rpcError } = await supabase.rpc('create_payment', {
      p_reservation_id: paymentData.reservationId,
      p_customer_name: paymentData.customerName,
      p_customer_email: paymentData.customerEmail,
      p_amount: Number(paymentData.amount),
      p_payment_method: paymentData.paymentMethod,
    });

    if (rpcError) {
      console.error('Gagal membuat payment:', rpcError);
      setError('Gagal membuat payment.');
      throw rpcError;
    }

    const created = Array.isArray(data) ? data[0] : data;

    // Sinkronkan state lokal
    if (created) {
      setPayments(prev => [created, ...prev]);
      // Refresh reservations untuk update status
      refresh();
    }

    return created;
  };

  // ========== GET MEMBER PAYMENTS ==========
  // Ambil semua payment milik 1 member berdasarkan email.
  const getMemberPayments = async (email) => {
    const { data, error: rpcError } = await supabase.rpc('get_member_payments', {
      p_email: email,
    });

    if (rpcError) {
      console.error('Gagal mengambil payment member:', rpcError);
      return [];
    }

    return data || [];
  };

  // ========== SUBMIT FEEDBACK ==========
  const submitFeedback = async (reservationId, customerName, email, rating, message) => {
    const { data, error: rpcError } = await supabase.rpc('submit_feedback', {
      p_reservation_id: reservationId,
      p_customer_name: customerName,
      p_email: email,
      p_rating: rating,
      p_message: message
    });

    if (rpcError) {
      console.error('Gagal mengirim ulasan:', rpcError);
      throw rpcError;
    }
    
    // Refresh reservations to update has_feedback state
    refresh();
    return data;
  };
  // ========== VOUCHERS ==========
  const getAvailableVouchers = async (email) => {
    if (!email) return [];
    const { data: allVouchers, error: vErr } = await supabase.from('vouchers').select('*');
    const { data: memberVouchers, error: mvErr } = await supabase.from('member_vouchers').select('voucher_id').eq('email', email);
    
    if (vErr || mvErr) return [];
    
    const claimedIds = memberVouchers.map(mv => mv.voucher_id);
    return allVouchers.filter(v => !claimedIds.includes(v.id));
  };

  const getMemberVouchers = async (email) => {
    if (!email) return [];
    const { data, error } = await supabase
      .from('member_vouchers')
      .select('*, vouchers(*)')
      .eq('email', email);
    if (error) return [];
    return data;
  };

  const claimVoucher = async (email, voucherId) => {
    const { error } = await supabase.from('member_vouchers').insert({
      email: email,
      voucher_id: voucherId,
      status: 'Available'
    });
    if (error) throw error;
  };

  const getAllVouchers = async () => {
    const { data, error } = await supabase.from('vouchers').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching all vouchers:', error);
      return [];
    }
    return data;
  };

  const addVoucher = async (voucherData) => {
    const { data, error } = await supabase.from('vouchers').insert([voucherData]).select();
    if (error) throw error;
    return data;
  };

  const deleteVoucher = async (voucherId) => {
    const { error } = await supabase.from('vouchers').delete().eq('id', voucherId);
    if (error) throw error;
  };

  return (
    <DataContext.Provider
      value={{
        reservations,
        customers,
        payments,
        loading,
        error,
        refresh,
        updateReservationPayment,
        updateReservation,
        updateCustomer,
        addReservation,
        addCustomer,
        addPayment,
        getMemberPayments,
        getMemberSpending,
        upsertCustomerMembership,
        submitFeedback,
        getAvailableVouchers,
        getMemberVouchers,
        claimVoucher,
        getAllVouchers,
        addVoucher,
        deleteVoucher,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
