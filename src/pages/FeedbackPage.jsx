// Halaman Feedback & Complaint - Feedback dari customer
import { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';

const FeedbackPage = () => {
  const { customers } = useData();
  const [selectedRating, setSelectedRating] = useState('All');

  // Generate feedback data dari customers (mock data)
  const feedbackData = useMemo(() => {
    return customers.slice(0, 100).map((customer, index) => {
      const ratings = [5, 5, 4, 4, 4, 3, 3, 2, 1];
      const rating = ratings[index % ratings.length];
      const types = ['Compliment', 'Suggestion', 'Complaint'];
      const type = rating >= 4 ? 'Compliment' : rating === 3 ? 'Suggestion' : 'Complaint';
      
      const messages = {
        5: ['Pelayanan sangat memuaskan!', 'Hotel terbaik yang pernah saya kunjungi', 'Staff sangat ramah dan profesional'],
        4: ['Secara keseluruhan bagus', 'Kamar bersih dan nyaman', 'Lokasi strategis'],
        3: ['Cukup baik tapi bisa lebih baik', 'Perlu peningkatan di beberapa area', 'Standar hotel bintang 4'],
        2: ['Kurang memuaskan', 'Perlu banyak perbaikan', 'Tidak sesuai ekspektasi'],
        1: ['Sangat mengecewakan', 'Pelayanan buruk', 'Tidak akan kembali lagi']
      };
      
      return {
        id: `FB${String(index + 1).padStart(3, '0')}`,
        customerId: customer.id,
        customerName: customer.name,
        email: customer.email,
        rating,
        type,
        message: messages[rating][index % messages[rating].length],
        date: new Date(2025, Math.floor(Math.random() * 5), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
        status: index % 3 === 0 ? 'Resolved' : 'Pending'
      };
    });
  }, [customers]);

  // Statistik feedback
  const feedbackStats = useMemo(() => {
    const stats = {
      total: feedbackData.length,
      compliment: feedbackData.filter(f => f.type === 'Compliment').length,
      suggestion: feedbackData.filter(f => f.type === 'Suggestion').length,
      complaint: feedbackData.filter(f => f.type === 'Complaint').length,
      avgRating: (feedbackData.reduce((sum, f) => sum + f.rating, 0) / feedbackData.length).toFixed(1),
      resolved: feedbackData.filter(f => f.status === 'Resolved').length,
      pending: feedbackData.filter(f => f.status === 'Pending').length
    };
    return stats;
  }, [feedbackData]);

  // Filter feedback
  const filteredFeedback = useMemo(() => {
    if (selectedRating === 'All') return feedbackData;
    return feedbackData.filter(f => f.rating === parseInt(selectedRating));
  }, [feedbackData, selectedRating]);

  const getRatingStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <div className="feedback-page">
      {/* Header */}
      <div className="page-header">
        <h2>💬 Feedback & Complaint</h2>
        <p className="page-subtitle">Kelola feedback dan keluhan dari customer</p>
      </div>

      {/* Feedback Stats */}
      <div className="feedback-stats-grid">
        <div className="feedback-stat-card">
          <div className="stat-icon" style={{ background: '#dbeafe' }}>📊</div>
          <div className="stat-content">
            <div className="stat-value">{feedbackStats.total}</div>
            <div className="stat-label">Total Feedback</div>
          </div>
        </div>

        <div className="feedback-stat-card">
          <div className="stat-icon" style={{ background: '#fef3c7' }}>⭐</div>
          <div className="stat-content">
            <div className="stat-value">{feedbackStats.avgRating}</div>
            <div className="stat-label">Rating Rata-rata</div>
          </div>
        </div>

        <div className="feedback-stat-card">
          <div className="stat-icon" style={{ background: '#dcfce7' }}>✅</div>
          <div className="stat-content">
            <div className="stat-value">{feedbackStats.resolved}</div>
            <div className="stat-label">Resolved</div>
          </div>
        </div>

        <div className="feedback-stat-card">
          <div className="stat-icon" style={{ background: '#fee2e2' }}>⏳</div>
          <div className="stat-content">
            <div className="stat-value">{feedbackStats.pending}</div>
            <div className="stat-label">Pending</div>
          </div>
        </div>
      </div>

      {/* Feedback Type Stats */}
      <div className="section-card">
        <h3 className="section-title">📈 Kategori Feedback</h3>
        <div className="feedback-type-grid">
          <div className="type-card compliment">
            <div className="type-icon">👍</div>
            <div className="type-info">
              <h4>Compliment</h4>
              <div className="type-count">{feedbackStats.compliment}</div>
              <div className="type-percentage">{((feedbackStats.compliment / feedbackStats.total) * 100).toFixed(1)}%</div>
            </div>
          </div>

          <div className="type-card suggestion">
            <div className="type-icon">💡</div>
            <div className="type-info">
              <h4>Suggestion</h4>
              <div className="type-count">{feedbackStats.suggestion}</div>
              <div className="type-percentage">{((feedbackStats.suggestion / feedbackStats.total) * 100).toFixed(1)}%</div>
            </div>
          </div>

          <div className="type-card complaint">
            <div className="type-icon">⚠️</div>
            <div className="type-info">
              <h4>Complaint</h4>
              <div className="type-count">{feedbackStats.complaint}</div>
              <div className="type-percentage">{((feedbackStats.complaint / feedbackStats.total) * 100).toFixed(1)}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback List */}
      <div className="section-card">
        <div className="section-header">
          <h3 className="section-title">📝 Daftar Feedback</h3>
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${selectedRating === 'All' ? 'active' : ''}`}
              onClick={() => setSelectedRating('All')}
            >
              Semua
            </button>
            <button 
              className={`filter-btn ${selectedRating === '5' ? 'active' : ''}`}
              onClick={() => setSelectedRating('5')}
            >
              ⭐⭐⭐⭐⭐
            </button>
            <button 
              className={`filter-btn ${selectedRating === '4' ? 'active' : ''}`}
              onClick={() => setSelectedRating('4')}
            >
              ⭐⭐⭐⭐
            </button>
            <button 
              className={`filter-btn ${selectedRating === '3' ? 'active' : ''}`}
              onClick={() => setSelectedRating('3')}
            >
              ⭐⭐⭐
            </button>
            <button 
              className={`filter-btn ${selectedRating === '2' ? 'active' : ''}`}
              onClick={() => setSelectedRating('2')}
            >
              ⭐⭐
            </button>
            <button 
              className={`filter-btn ${selectedRating === '1' ? 'active' : ''}`}
              onClick={() => setSelectedRating('1')}
            >
              ⭐
            </button>
          </div>
        </div>

        <div className="feedback-list">
          {filteredFeedback.map(feedback => (
            <div key={feedback.id} className="feedback-item-card">
              <div className="feedback-header">
                <div className="feedback-customer">
                  <div className="customer-avatar">{feedback.customerName.charAt(0)}</div>
                  <div>
                    <div className="customer-name">{feedback.customerName}</div>
                    <div className="customer-id">{feedback.customerId}</div>
                  </div>
                </div>
                <div className="feedback-meta">
                  <div className="feedback-rating">{getRatingStars(feedback.rating)}</div>
                  <div className="feedback-date">{new Date(feedback.date).toLocaleDateString('id-ID')}</div>
                </div>
              </div>

              <div className="feedback-body">
                <div className="feedback-badges">
                  <span className={`feedback-type-badge ${feedback.type.toLowerCase()}`}>
                    {feedback.type}
                  </span>
                  <span className={`feedback-status-badge ${feedback.status.toLowerCase()}`}>
                    {feedback.status}
                  </span>
                </div>
                <p className="feedback-message">{feedback.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;
