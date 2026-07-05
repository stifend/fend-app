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
      if (payRes.error) throw payRes.error;

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
    refresh();
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
    const { data, error: rpcError } = await supabase.rpc('create_reservation', {
      p_email: booking.email,
      p_name: booking.name,
      p_phone: booking.phone ?? null,
      p_address: booking.address ?? null,
      p_room_type: booking.roomType,
      p_check_in: booking.checkIn,
      p_check_out: booking.checkOut,
      p_guests: Number(booking.guests) || 1,
      p_special_request: booking.specialRequest ?? null,
    });

    if (rpcError) {
      console.error('Gagal membuat reservasi:', rpcError);
      setError('Gagal membuat reservasi.');
      throw rpcError;
    }

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
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
