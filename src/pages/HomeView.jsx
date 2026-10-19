import React, { useState, useEffect } from 'react';
import { 
  PlusCircle, 
  Search, 
  ArrowRight, 
  Lightbulb, 
  Droplets, 
  Trash2, 
  AlertTriangle, 
  Trees, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  Users, 
  Building2,
  MapPin,
  Calendar
} from 'lucide-react';
import { INITIAL_CATEGORIES } from '../data/seedData';
import { fetchAnalytics, fetchRequests } from '../services/storageService';
import InteractiveMap from '../components/InteractiveMap';
import StatusBadge from '../components/StatusBadge';

const CATEGORY_ICONS = {
  Lightbulb,
  Droplets,
  Trash2,
  AlertTriangle,
  Trees,
  ShieldAlert
};

export default function HomeView({ setView, onSelectTracking }) {
  const [quickTrackId, setQuickTrackId] = useState('');
  const [analytics, setAnalytics] = useState(null);
  const [recentRequests, setRecentRequests] = useState([]);
  const [allRequests, setAllRequests] = useState([]);

  useEffect(() => {
    async function loadData() {
      const stats = await fetchAnalytics();
      setAnalytics(stats);
      const reqs = await fetchRequests();
      setAllRequests(reqs);
      setRecentRequests(reqs.slice(0, 3));
    }
    loadData();
  }, []);

  const handleQuickTrackSubmit = (e) => {
    e.preventDefault();
    if (quickTrackId.trim()) {
      onSelectTracking(quickTrackId.trim().toUpperCase());
      setView('track');
    }
  };

  return (
    <div className="container">
      {/* Hero Section */}
      <section className="hero-section">
        <div style={{ padding: '0 28px' }}>
          <div className="hero-grid">
            <div>
              <div className="hero-badge">
                <Building2 size={13} />
                Official County Public Service Portal
              </div>

              <h1 className="hero-title">
                Report, Track & Resolve <br />
                <span className="text-gradient">Public Service Issues</span>
              </h1>

              <p className="hero-description">
                Empowering citizens to report broken streetlights, water leakages, garbage dumps, and road hazards. Track real-time repair progress from local government field crews.
              </p>

              <div className="hero-actions">
                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                  onClick={() => setView('submit')}
                >
                  <PlusCircle size={18} />
                  Submit Service Request
                </button>

                <button
                  type="button"
                  className="btn btn-secondary btn-lg"
                  onClick={() => setView('track')}
                >
                  <Search size={18} />
                  Track Existing Ticket
                </button>
              </div>
            </div>

            {/* Quick Track Input Card */}
            <div>
              <div className="hero-quick-track">
                <h3>
                  <Search size={20} style={{ color: 'var(--brand-emerald)' }} />
                  Instant Ticket Tracking
                </h3>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: 16 }}>
                  Enter your tracking reference number to inspect real-time inspection status and assigned department.
                </p>

                <form onSubmit={handleQuickTrackSubmit}>
                  <div className="form-group" style={{ marginBottom: 12 }}>
                    <div className="input-with-icon">
                      <Search size={16} className="input-icon" />
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. EC-2026-1042"
                        value={quickTrackId}
                        onChange={e => setQuickTrackId(e.target.value)}
                        required
                        style={{ fontFamily: 'monospace', fontWeight: 600, letterSpacing: '0.05em' }}
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                    Track Request Now <ArrowRight size={16} />
                  </button>
                </form>

                <div style={{ marginTop: 14, fontSize: '0.78rem', color: 'var(--text-subtle)' }}>
                  Sample test tickets:{' '}
                  <span
                    style={{ color: 'var(--brand-emerald)', cursor: 'pointer', textDecoration: 'underline' }}
                    onClick={() => { setQuickTrackId('EC-2026-1042'); }}
                  >
                    EC-2026-1042
                  </span>
                  ,{' '}
                  <span
                    style={{ color: 'var(--brand-emerald)', cursor: 'pointer', textDecoration: 'underline' }}
                    onClick={() => { setQuickTrackId('EC-2026-1043'); }}
                  >
                    EC-2026-1043
                  </span>
                  ,{' '}
                  <span
                    style={{ color: 'var(--brand-emerald)', cursor: 'pointer', textDecoration: 'underline' }}
                    onClick={() => { setQuickTrackId('EC-2026-1044'); }}
                  >
                    EC-2026-1044
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Civic Performance Strip */}
      <div className="stats-grid">
        <div className="stat-card card-total">
          <div className="stat-info">
            <span className="stat-label">Total Registered</span>
            <span className="stat-value">{analytics?.total || 6}</span>
            <span className="stat-hint">Civic incidents logged</span>
          </div>
          <div className="stat-icon icon-navy">
            <Building2 size={24} />
          </div>
        </div>

        <div className="stat-card card-pending">
          <div className="stat-info">
            <span className="stat-label">Pending Review</span>
            <span className="stat-value">{analytics?.pending || 2}</span>
            <span className="stat-hint">Awaiting triage</span>
          </div>
          <div className="stat-icon icon-pending">
            <Clock size={24} />
          </div>
        </div>

        <div className="stat-card card-progress">
          <div className="stat-info">
            <span className="stat-label">In Progress</span>
            <span className="stat-value">{analytics?.in_progress || 2}</span>
            <span className="stat-hint">Active work crews</span>
          </div>
          <div className="stat-icon icon-progress">
            <AlertTriangle size={24} />
          </div>
        </div>

        <div className="stat-card card-resolved">
          <div className="stat-info">
            <span className="stat-label">Resolved & Closed</span>
            <span className="stat-value">{analytics?.resolved || 2}</span>
            <span className="stat-hint">{analytics?.resolution_rate || 50}% resolution rate</span>
          </div>
          <div className="stat-icon icon-resolved">
            <CheckCircle2 size={24} />
          </div>
        </div>
      </div>

      {/* Public Service Categories Catalog */}
      <section style={{ margin: '40px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: '1.6rem' }}>Civic Service Directories</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Select a service category to report municipal infrastructure defects directly to the responsible board.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setView('submit')}
          >
            Submit Custom Report
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 18 }}>
          {INITIAL_CATEGORIES.map(cat => {
            const Icon = CATEGORY_ICONS[cat.icon] || Lightbulb;
            return (
              <div 
                key={cat.id} 
                className="card card-clickable"
                onClick={() => setView('submit')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--brand-emerald-light)',
                      color: 'var(--brand-emerald)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Icon size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{cat.name}</h3>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>SLA: {cat.sla_days} Days Target</span>
                  </div>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 16, minHeight: 40 }}>
                  {cat.description}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: 10 }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--brand-emerald)' }}>
                    {cat.department.split('&')[0]}
                  </span>
                  <span style={{ color: 'var(--brand-emerald)', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.82rem', fontWeight: 600 }}>
                    Report <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive Map View Preview */}
      <section style={{ margin: '40px 0' }}>
        <div style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: '1.6rem' }}>Live Incidents City Map</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Real-time geospatial plotting of active and resolved service requests across Nairobi metropolitan sectors.
          </p>
        </div>

        <InteractiveMap
          requests={allRequests}
          onSelectRequest={(r) => {
            onSelectTracking(r.tracking_number);
            setView('track');
          }}
        />
      </section>

      {/* Recent Activity Showcase */}
      <section style={{ margin: '40px 0 20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: '1.6rem' }}>Recent Incident Submissions</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Transparency log of public issues registered by fellow citizens.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setView('admin')}
          >
            View All in Admin Desk
          </button>
        </div>

        <div className="requests-grid">
          {recentRequests.map(r => (
            <div 
              key={r.id} 
              className="request-card"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                onSelectTracking(r.tracking_number);
                setView('track');
              }}
            >
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
                <h4 className="request-card-title">{r.title}</h4>
                <p className="request-card-description">{r.description}</p>

                <div className="request-card-meta">
                  <div className="meta-row">
                    <MapPin size={13} />
                    <span>{r.location_address}</span>
                  </div>
                  <div className="meta-row">
                    <Calendar size={13} />
                    <span>{new Date(r.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="request-card-footer">
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {r.sub_county}
                </span>
                <span style={{ color: 'var(--brand-emerald)', fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                  Track <ArrowRight size={14} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
