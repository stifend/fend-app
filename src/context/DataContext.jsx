import { createContext, useContext, useState } from 'react';
import { reservations as initialReservations, customers as initialCustomers } from '../data/mockData';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [reservations, setReservations] = useState(initialReservations);
  const [customers, setCustomers] = useState(initialCustomers);

  const updateReservationPayment = (id, newStatus) => {
    setReservations(prev =>
      prev.map(res => res.id === id ? { ...res, payment: newStatus } : res)
    );
  };

  const updateReservation = (id, updatedData) => {
    setReservations(prev =>
      prev.map(res => res.id === id ? { ...res, ...updatedData } : res)
    );
  };

  const updateCustomer = (id, updatedData) => {
    setCustomers(prev =>
      prev.map(cust => cust.id === id ? { ...cust, ...updatedData } : cust)
    );
  };

  return (
    <DataContext.Provider
      value={{
        reservations,
        customers,
        updateReservationPayment,
        updateReservation,
        updateCustomer,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
