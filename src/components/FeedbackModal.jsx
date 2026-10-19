import React, { useState } from 'react';
import { X, Star, HeartHandshake, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { submitCitizenFeedback } from '../services/storageService';

export default function FeedbackModal({ request, onClose, onFeedbackSubmitted }) {
  const { currentUser } = useAuth();
  const { addToast } = useNotification();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await submitCitizenFeedback(request.id, {
        rating,
        feedback: feedback.trim() || 'Citizen confirmed satisfactory service resolution.',
        citizen_name: currentUser?.name || request.citizen_name || 'Citizen'
      });

      addToast('Thank you! Your citizen satisfaction feedback has been recorded.', 'success');
      if (onFeedbackSubmitted) onFeedbackSubmitted();
      onClose();
    } catch (err) {
      addToast('Failed to record feedback: ' + err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ maxWidth: 500 }} 
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <HeartHandshake size={20} style={{ color: 'var(--brand-emerald)' }} />
            <h3 className="modal-title">Citizen Service Feedback</h3>
          </div>
          <button type="button" className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Ticket Resolved:</div>
              <strong style={{ fontFamily: 'Outfit', color: 'var(--brand-emerald)', fontSize: '1.15rem' }}>
                {request.tracking_number}
              </strong>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginTop: 4 }}>
                {request.title}
              </div>
            </div>

            <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', marginBottom: 20 }}>
              How satisfied are you with the municipal response and quality of resolution?
            </p>

            {/* Interactive Stars */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 20 }}>
              {[1, 2, 3, 4, 5].map(star => {
                const active = (hoverRating || rating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 4,
                      transition: 'transform 0.15s ease'
                    }}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                  >
                    <Star
                      size={32}
                      fill={active ? '#f59e0b' : 'transparent'}
                      color={active ? '#f59e0b' : '#cbd5e1'}
                    />
                  </button>
                );
              })}
            </div>

            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f59e0b', marginBottom: 20 }}>
              {rating === 5 && 'Outstanding & Swift Service!'}
              {rating === 4 && 'Good Job & Satisfactory!'}
              {rating === 3 && 'Average Municipal Response'}
              {rating === 2 && 'Below Expectations / Delayed'}
              {rating === 1 && 'Unsatisfactory Resolution'}
            </div>

            <div className="form-group" style={{ textAlign: 'left' }}>
              <label className="form-label">Comments / Commendation (Optional)</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Share any comments for the field crew or department management..."
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Satisfaction Rating'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
