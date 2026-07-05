// Halaman Membership Customer - Statistik dan daftar member berdasarkan level
import { useData } from '../context/DataContext';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { membershipBenefits } from '../utils/membership';
import '../modern-pages.css';

const MembershipPage = () => {
  const { customers } = useData();
  const navigate = useNavigate();
  const [selectedLevel, setSelectedLevel] = useState('All');

  // Hitung statistik membership
  const membershipStats = useMemo(() => {
    const stats = {
      Silver: { count: 0, percentage: 0, color: '#94a3b8' },
      Gold: { count: 0, percentage: 0, color: '#f59e0b' },
      Platinum: { count: 0, percentage: 0, color: '#8b5cf6' }
    };

    customers.forEach(customer => {
      if (stats[customer.membership]) {
        stats[customer.membership].count++;
      }
    });

    // Hitung persentase
    Object.keys(stats).forEach(level => {
      stats[level].percentage = ((stats[level].count / customers.length) * 100).toFixed(1);
    });

    return stats;
  }, [customers]);

  // Filter customers berdasarkan level yang dipilih
  const filteredCustomers = useMemo(() => {
    if (selectedLevel === 'All') return customers;
    return customers.filter(c => c.membership === selectedLevel);
  }, [customers, selectedLevel]);

  return (
    <div className="membership-page">
      {/* Header */}
      <div className="page-header">
        <h2>⭐ Membership Customer</h2>
        <p className="page-subtitle">Statistik dan manajemen member hotel</p>
      </div>

      {/* Membership Stats */}
      <div className="membership-stats-grid">
        <div className="membership-stat-card" style={{ borderColor: '#94a3b8' }}>
          <div className="membership-icon" style={{ background: '#f1f5f9', color: '#94a3b8' }}>
            🥈
          </div>
          <div className="membership-info">
            <h3>Silver</h3>
            <div className="membership-count">{membershipStats.Silver.count} Members</div>
            <div className="membership-percentage">{membershipStats.Silver.percentage}% dari total</div>
          </div>
        </div>

        <div className="membership-stat-card" style={{ borderColor: '#f59e0b' }}>
          <div className="membership-icon" style={{ background: '#fef3c7', color: '#f59e0b' }}>
            🥇
          </div>
          <div className="membership-info">
            <h3>Gold</h3>
            <div className="membership-count">{membershipStats.Gold.count} Members</div>
            <div className="membership-percentage">{membershipStats.Gold.percentage}% dari total</div>
          </div>
        </div>

        <div className="membership-stat-card" style={{ borderColor: '#8b5cf6' }}>
          <div className="membership-icon" style={{ background: '#f3e8ff', color: '#8b5cf6' }}>
            💎
          </div>
          <div className="membership-info">
            <h3>Platinum</h3>
            <div className="membership-count">{membershipStats.Platinum.count} Members</div>
            <div className="membership-percentage">{membershipStats.Platinum.percentage}% dari total</div>
          </div>
        </div>
      </div>

      {/* Membership Benefits */}
      <div className="section-card">
        <h3 className="section-title">🎁 Benefit Membership</h3>
        <div className="benefits-grid">
          {Object.entries(membershipBenefits).map(([level, benefits]) => (
            <div key={level} className="benefit-card">
              <div className="benefit-header">
                <span className="benefit-icon">
                  {level === 'Silver' ? '🥈' : level === 'Gold' ? '🥇' : '💎'}
                </span>
                <h4>{level}</h4>
              </div>
              <ul className="benefit-list">
                {benefits.map((benefit, idx) => (
                  <li key={idx}>✓ {benefit}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Member List */}
      <div className="section-card">
        <div className="section-header">
          <h3 className="section-title">👥 Daftar Member</h3>
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${selectedLevel === 'All' ? 'active' : ''}`}
              onClick={() => setSelectedLevel('All')}
            >
              Semua ({customers.length})
            </button>
            <button 
              className={`filter-btn ${selectedLevel === 'Silver' ? 'active' : ''}`}
              onClick={() => setSelectedLevel('Silver')}
            >
              Silver ({membershipStats.Silver.count})
            </button>
            <button 
              className={`filter-btn ${selectedLevel === 'Gold' ? 'active' : ''}`}
              onClick={() => setSelectedLevel('Gold')}
            >
              Gold ({membershipStats.Gold.count})
            </button>
            <button 
              className={`filter-btn ${selectedLevel === 'Platinum' ? 'active' : ''}`}
              onClick={() => setSelectedLevel('Platinum')}
            >
              Platinum ({membershipStats.Platinum.count})
            </button>
          </div>
        </div>

        <div className="members-table-container">
          <table className="members-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nama</th>
                <th>Email</th>
                <th>No HP</th>
                <th>Alamat</th>
                <th>Membership</th>
                <th>Bergabung</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.slice(0, 50).map(customer => {
                const tier = customer.membership || 'None';
                return (
                <tr key={customer.id}>
                  <td>{customer.id}</td>
                  <td className="member-name">{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phone || '-'}</td>
                  <td>{customer.address || '-'}</td>
                  <td>
                    <span className={`membership-badge ${tier.toLowerCase()}`}>
                      {tier === 'Silver' ? '🥈' : tier === 'Gold' ? '🥇' : tier === 'Platinum' ? '💎' : '🆕'}
                      {tier}
                    </span>
                  </td>
                  <td>{new Date(customer.joinDate).toLocaleDateString('id-ID')}</td>
                  <td>
                    <button
                      className="btn-view-small"
                      onClick={() => navigate(`/customer-detail/${customer.id}`)}
                    >
                      Detail
                    </button>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
          {filteredCustomers.length > 50 && (
            <div className="table-footer">
              <p>Menampilkan 50 dari {filteredCustomers.length} member</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MembershipPage;
