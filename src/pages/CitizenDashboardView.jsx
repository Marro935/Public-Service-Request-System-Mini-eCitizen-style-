import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  PlusCircle, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Printer, 
  Star, 
  ArrowRight,
  MapPin,
  Calendar
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchRequests } from '../services/storageService';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import PrintSlipModal from '../components/PrintSlipModal';
import FeedbackModal from '../components/FeedbackModal';

export default function CitizenDashboardView({ setView, onSelectTracking }) {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedSlip, setSelectedSlip] = useState(null);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  useEffect(() => {
    loadCitizenRequests();
  }, [currentUser]);

  const loadCitizenRequests = async () => {
    const all = await fetchRequests({ citizen_id: currentUser?.id || 1 });
    setRequests(all);
  };

  const filteredRequests = requests.filter(r => {
    if (statusFilter === 'all') return true;
    return r.status === statusFilter;
  });

  const total = requests.length;
  const pending = requests.filter(r => r.status === 'pending').length;
  const inProgress = requests.filter(r => r.status === 'in_progress').length;
  const resolved = requests.filter(r => r.status === 'resolved').length;

  return (
    <div className="container">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: '0.8rem', background: 'var(--brand-emerald-light)', color: 'var(--brand-emerald)', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontWeight: 700 }}>
              Citizen Self-Service Desk
            </span>
          </div>
          <h1 style={{ fontSize: '2rem' }}>
            My Civic Service Requests
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Welcome back, <strong>{currentUser?.name || 'Jane Wanjiku Doe'}</strong>. Track and review your lodged municipal incidents.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary btn-lg"
          onClick={() => setView('submit')}
        >
          <PlusCircle size={18} />
          Report New Incident
        </button>
      </div>

      {/* Mini Stats Grid */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card card-total">
          <div className="stat-info">
            <span className="stat-label">Total Submissions</span>
            <span className="stat-value">{total}</span>
          </div>
          <div className="stat-icon icon-navy"><FileText size={22} /></div>
        </div>

        <div className="stat-card card-pending">
          <div className="stat-info">
            <span className="stat-label">Under Review</span>
            <span className="stat-value">{pending}</span>
          </div>
          <div className="stat-icon icon-pending"><Clock size={22} /></div>
        </div>

        <div className="stat-card card-progress">
          <div className="stat-info">
            <span className="stat-label">In Progress</span>
            <span className="stat-value">{inProgress}</span>
          </div>
          <div className="stat-icon icon-progress"><AlertTriangle size={22} /></div>
        </div>

        <div className="stat-card card-resolved">
          <div className="stat-info">
            <span className="stat-label">Resolved</span>
            <span className="stat-value">{resolved}</span>
          </div>
          <div className="stat-icon icon-resolved"><CheckCircle2 size={22} /></div>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="filter-bar">
        <div className="filter-group">
          {[
            { id: 'all', label: 'All Requests' },
            { id: 'pending', label: 'Pending' },
            { id: 'in_progress', label: 'In Progress' },
            { id: 'resolved', label: 'Resolved' }
          ].map(f => (
            <button
              key={f.id}
              type="button"
              className={`btn btn-sm ${statusFilter === f.id ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setStatusFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          Showing <strong>{filteredRequests.length}</strong> of {total} records
        </div>
      </div>

      {/* Request Cards Grid */}
      {filteredRequests.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <FileText size={40} style={{ color: 'var(--text-subtle)', margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '1.2rem', marginBottom: 6 }}>No Requests Found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: 20 }}>
            You do not have any requests in this status category.
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setView('submit')}
          >
            Submit an Incident Report
          </button>
        </div>
      ) : (
        <div className="requests-grid">
          {filteredRequests.map(r => (
            <div key={r.id} className="request-card">
              <div className="request-card-header">
                <span className="request-tracking-id">{r.tracking_number}</span>
                <StatusBadge status={r.status} size="sm" />
              </div>

              {r.image_url && (
                <div className="request-card-image">
                  <img src={r.image_url} alt={r.title} />
                  <span className="request-card-image-tag">{r.category_name}</span>
                </div>
              )}

              <div className="request-card-body">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <PriorityBadge priority={r.priority} />
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-subtle)' }}>
                    {new Date(r.created_at).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="request-card-title">{r.title}</h3>
                <p className="request-card-description">{r.description}</p>

                <div className="request-card-meta">
                  <div className="meta-row">
                    <MapPin size={13} />
                    <span>{r.location_address}</span>
                  </div>
                  <div className="meta-row">
                    <span style={{ fontSize: '0.74rem', color: 'var(--brand-emerald)', fontWeight: 600 }}>
                      Dept: {r.assigned_department}
                    </span>
                  </div>
                </div>

                {/* Citizen Rating Badge if rated */}
                {r.citizen_rating && (
                  <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.76rem', color: '#b45309' }}>
                    <Star size={13} fill="#f59e0b" color="#f59e0b" />
                    <span>Rated {r.citizen_rating}/5 Stars</span>
                  </div>
                )}
              </div>

              <div className="request-card-footer">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setSelectedSlip(r)}
                  title="Print Official Receipt Slip"
                >
                  <Printer size={13} />
                  Receipt
                </button>

                <div style={{ display: 'flex', gap: 6 }}>
                  {r.status === 'resolved' && (
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setSelectedFeedback(r)}
                      title="Rate Service Resolution"
                    >
                      <Star size={13} style={{ color: '#f59e0b' }} />
                      {r.citizen_rating ? 'Rated' : 'Rate'}
                    </button>
                  )}

                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      onSelectTracking(r.tracking_number);
                      setView('track');
                    }}
                  >
                    Track Progress <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {selectedSlip && (
        <PrintSlipModal
          request={selectedSlip}
          onClose={() => setSelectedSlip(null)}
        />
      )}

      {selectedFeedback && (
        <FeedbackModal
          request={selectedFeedback}
          onClose={() => setSelectedFeedback(null)}
          onFeedbackSubmitted={loadCitizenRequests}
        />
      )}
    </div>
  );
}
