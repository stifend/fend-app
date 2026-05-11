// Import fungsi React untuk membuat Context dan State
import { createContext, useContext, useState } from 'react';
// Import data awal dari file mockData
import { reservations as initialReservations, customers as initialCustomers } from '../data/mockData';

// Buat Context untuk menyimpan data global
const DataContext = createContext();

// Custom hook untuk mengakses data dari Context
// Hook ini akan digunakan di component lain dengan: const { reservations, customers } = useData();
export const useData = () => {
  const context = useContext(DataContext);
  // Jika hook dipanggil di luar DataProvider, tampilkan error
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};

// Provider component yang membungkus seluruh aplikasi
// Semua component di dalam Provider bisa akses data ini
export const DataProvider = ({ children }) => {
  // State untuk menyimpan data reservasi (bisa berubah saat edit/update)
  const [reservations, setReservations] = useState(initialReservations);
  
  // State untuk menyimpan data customer (bisa berubah saat edit/update)
  const [customers, setCustomers] = useState(initialCustomers);

  // Fungsi untuk update status pembayaran reservasi
  // Parameter: id = ID reservasi, newStatus = status baru (Lunas/Pending/Belum Bayar)
  const updateReservationPayment = (id, newStatus) => {
    setReservations(prev =>
      prev.map(res => 
        res.id === id ? { ...res, payment: newStatus } : res // Jika ID cocok, update payment
      )
    );
  };

  // Fungsi untuk update data reservasi lengkap (nama, email, phone, dll)
  // Parameter: id = ID reservasi, updatedData = object berisi data baru
  const updateReservation = (id, updatedData) => {
    setReservations(prev =>
      prev.map(res => 
        res.id === id ? { ...res, ...updatedData } : res // Merge data lama dengan data baru
      )
    );
  };

  // Fungsi untuk update data customer lengkap (nama, email, phone, dll)
  // Parameter: id = ID customer, updatedData = object berisi data baru
  const updateCustomer = (id, updatedData) => {
    setCustomers(prev =>
      prev.map(cust => 
        cust.id === id ? { ...cust, ...updatedData } : cust // Merge data lama dengan data baru
      )
    );
  };

  // Return Provider dengan value berisi data dan fungsi-fungsi
  // Semua component di dalam {children} bisa akses value ini
  return (
    <DataContext.Provider
      value={{
        reservations,              // Data reservasi
        customers,                 // Data customer
        updateReservationPayment,  // Fungsi update payment
        updateReservation,         // Fungsi update reservasi
        updateCustomer,            // Fungsi update customer
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
