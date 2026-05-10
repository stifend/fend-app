import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';

const CustomerPage = () => {
  const navigate = useNavigate();
  const { customers } = useData();

  const handleDetail = (customer) => {
    navigate(`/customer-detail/${customer.id}`, {
      state: customer
    });
  };

  return (
    <div className="customer-page">
      <div className="customer-page-header">
        <h2>Daftar Pelanggan</h2>
      </div>

      <div className="customer-page-content">
        <div className="customer-list-card">
          <table className="customer-table">
            <thead className="table-header-customer">
              <tr>
                <th>No</th>
                <th>Nama</th>
                <th>Email</th>
                <th>Telepon</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer, index) => (
                <tr key={customer.id} className="table-row-customer">
                  <td className="table-cell-customer">{index + 1}</td>
                  <td className="table-cell-customer">{customer.name}</td>
                  <td className="table-cell-customer">{customer.email}</td>
                  <td className="table-cell-customer">{customer.phone}</td>
                  <td className="table-cell-customer">
                    <button 
                      className="btn-view-detail"
                      onClick={() => handleDetail(customer)}
                    >
                      Lihat Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomerPage;