import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Calendar, 
  User, 
  Building2, 
  Printer, 
  Star, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  HeartHandshake
} from 'lucide-react';
import { fetchRequestByTracking } from '../services/storageService';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import TimelineView from '../components/TimelineView';
import PrintSlipModal from '../components/PrintSlipModal';
import FeedbackModal from '../components/FeedbackModal';
import { useAuth } from '../context/AuthContext';

export default function TrackRequestView({ trackingNumber, setView }) {
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState(trackingNumber || 'EC-2026-1042');
  const [currentRequest, setCurrentRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [showSlip, setShowSlip] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    if (trackingNumber) {
      setSearchTerm(trackingNumber);
      handleSearch(trackingNumber);
    } else {
      handleSearch('EC-2026-1042');
    }
  }, [trackingNumber]);

  const handleSearch = async (termToSearch) => {
    const term = (termToSearch || searchTerm).trim();
    if (!term) return;

    setLoading(true);
    setNotFound(false);

    try {
      const data = await fetchRequestByTracking(term);
      if (data) {
        setCurrentRequest(data);
        setNotFound(false);
      } else {
        setCurrentRequest(null);
        setNotFound(true);
      }
    } catch (e) {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const onSearchSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div className="container-narrow">
      <div style={{ marginBottom: 24, textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.2rem', marginBottom: 8 }}>
          Public Service Ticket Tracking
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Real-time visibility into local government response, field crew assignments, and resolution timeline.
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="card" style={{ marginBottom: 28, padding: 18 }}>
        <form onSubmit={onSearchSubmit} style={{ display: 'flex', gap: 10 }}>
          <div className="input-with-icon" style={{ flex: 1 }}>
            <Search size={18} className="input-icon" />
            <input
              type="text"
              className="form-input"
              placeholder="Enter Tracking Reference Number (e.g., EC-2026-1042)"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '1rem' }}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Searching...' : 'Track Ticket'}
          </button>
        </form>

        {/* Quick Sample Chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, fontSize: '0.78rem', color: 'var(--text-subtle)' }}>
          <span>Try quick sample:</span>
          {['EC-2026-1042', 'EC-2026-1043', 'EC-2026-1044', 'EC-2026-1045'].map(t => (
            <button
              key={t}
              type="button"
              style={{
                background: 'var(--bg-card-subtle)',
                border: '1px solid var(--border-color)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                fontFamily: 'monospace',
                fontSize: '0.74rem',
                color: 'var(--brand-emerald)'
              }}
              onClick={() => {
                setSearchTerm(t);
                handleSearch(t);
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Not Found State */}
      {notFound && (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px', marginBottom: 30 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--status-rejected-bg)', color: 'var(--status-rejected)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Search size={28} />
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: 8 }}>Service Ticket Not Found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: 440, margin: '0 auto 20px' }}>
            No public request was found matching reference <strong>"{searchTerm}"</strong>. Please verify the code on your acknowledgement slip.
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setView('submit')}
          >
            Submit New Service Request
          </button>
        </div>
      )}

      {/* Ticket Details View */}
      {currentRequest && (
        <div className="card" style={{ padding: 28, marginBottom: 30 }}>
          {/* Card Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: 16, marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: '1.35rem', fontFamily: 'Outfit', fontWeight: 800, color: 'var(--brand-emerald)', letterSpacing: '0.02em' }}>
                  {currentRequest.tracking_number}
                </span>
                <StatusBadge status={currentRequest.status} />
                <PriorityBadge priority={currentRequest.priority} />
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                {currentRequest.title}
              </h2>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setShowSlip(true)}
              >
                <Printer size={14} />
                Print Slip
              </button>

              {currentRequest.status === 'resolved' && (
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => setShowFeedback(true)}
                >
                  <Star size={14} />
                  {currentRequest.citizen_rating ? 'Update Rating' : 'Rate Resolution'}
                </button>
              )}
            </div>
          </div>

          {/* Stepper Progression */}
          <TimelineView request={currentRequest} />

          {/* Incident Details Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border-color)' }}>
            <div>
              <h4 style={{ fontSize: '0.92rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 12, letterSpacing: '0.04em' }}>
                Incident Details
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.88rem' }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Building2 size={16} style={{ color: 'var(--brand-emerald)', flexShrink: 0 }} />
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>Category & Department</span>
                    <strong>{currentRequest.category_name}</strong>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{currentRequest.assigned_department}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <MapPin size={16} style={{ color: 'var(--brand-emerald)', flexShrink: 0 }} />
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>Site Location</span>
                    <strong>{currentRequest.location_address}</strong>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{currentRequest.sub_county}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <Calendar size={16} style={{ color: 'var(--brand-emerald)', flexShrink: 0 }} />
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>Date Reported</span>
                    <span>{new Date(currentRequest.created_at).toLocaleString()}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <User size={16} style={{ color: 'var(--brand-emerald)', flexShrink: 0 }} />
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>Designated Field Lead</span>
                    <span>{currentRequest.assigned_officer_name || 'Pending Crew Triage'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Photo Attachment if available */}
            <div>
              <h4 style={{ fontSize: '0.92rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 12, letterSpacing: '0.04em' }}>
                Attached Incident Evidence
              </h4>

              {currentRequest.image_url ? (
                <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-color)', height: 200, background: '#0f172a' }}>
                  <img
                    src={currentRequest.image_url}
                    alt={currentRequest.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              ) : (
                <div style={{ background: 'var(--bg-card-subtle)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-color)', height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-subtle)', fontSize: '0.85rem' }}>
                  No photo evidence attached
                </div>
              )}
            </div>
          </div>

          {/* Citizen Rating Display if resolved & rated */}
          {currentRequest.citizen_rating && (
            <div style={{ marginTop: 20, background: 'var(--brand-gold-light)', border: '1px solid #fde68a', borderRadius: 'var(--radius-md)', padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <div style={{ display: 'flex', gap: 2 }}>
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star
                      key={s}
                      size={16}
                      fill={s <= currentRequest.citizen_rating ? '#f59e0b' : 'none'}
                      color={s <= currentRequest.citizen_rating ? '#f59e0b' : '#cbd5e1'}
                    />
                  ))}
                </div>
                <strong style={{ fontSize: '0.88rem', color: '#92400e' }}>
                  Citizen Satisfaction Score: {currentRequest.citizen_rating}/5 Stars
                </strong>
              </div>
              {currentRequest.citizen_feedback && (
                <p style={{ fontSize: '0.85rem', color: '#78350f', fontStyle: 'italic', marginTop: 4 }}>
                  "{currentRequest.citizen_feedback}"
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {showSlip && currentRequest && (
        <PrintSlipModal
          request={currentRequest}
          onClose={() => setShowSlip(false)}
        />
      )}

      {showFeedback && currentRequest && (
        <FeedbackModal
          request={currentRequest}
          onClose={() => setShowFeedback(false)}
          onFeedbackSubmitted={() => handleSearch(currentRequest.tracking_number)}
        />
      )}
    </div>
  );
}
