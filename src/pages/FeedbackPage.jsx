// Halaman Feedback & Complaint - Feedback dari customer (sumber: Supabase)
import { useState, useMemo, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import '../modern-pages.css';

const FeedbackPage = () => {
  const [selectedRating, setSelectedRating] = useState('All');
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Ambil data feedback dari Supabase (RPC get_all_feedback)
  const fetchFeedback = useCallback(async () => {
    setLoading(true);
    setError('');
    const { data, error: rpcError } = await supabase.rpc('get_all_feedback');
    if (rpcError) {
      console.error('Gagal memuat feedback:', rpcError);
      setError('Gagal memuat data feedback.');
    } else {                  
      setFeedbackData(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchFeedback();
  }, [fetchFeedback]);

    // Statistik feedback (aman saat data kosong -> avgRating 0.0)
  const feedbackStats = useMemo(() => {
    const total = feedbackData.length;
    return {
      total,
      compliment: feedbackData.filter(f => f.type === 'Compliment').length,
      suggestion: feedbackData.filter(f => f.type === 'Suggestion').length,
      complaint: feedbackData.filter(f => f.type === 'Complaint').length,
      avgRating: total ? (feedbackData.reduce((sum, f) => sum + f.rating, 0) / total).toFixed(1) : '0.0',
      resolved: feedbackData.filter(f => f.status === 'Resolved').length,
      pending: feedbackData.filter(f => f.status === 'Pending').length
    };
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

      {/* Status loading / error */}
      {loading && <p style={{ color: '#64748b' }}>Memuat data feedback...</p>}
      {error && <p style={{ color: '#dc2626' }}>{error}</p>}

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

      {/* Feedback Type Stats Removed */}

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
                  {/* Type badge removed */}
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
