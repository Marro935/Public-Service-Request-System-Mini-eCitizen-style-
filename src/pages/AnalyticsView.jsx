import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Building2, 
  MapPin, 
  RefreshCw,
  Award
} from 'lucide-react';
import { fetchAnalytics, fetchRequests } from '../services/storageService';
import { DonutChart, CategoryBarChart } from '../components/Charts';

export default function AnalyticsView({ setView }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    const data = await fetchAnalytics();
    setAnalytics(data);
    setLoading(false);
  };

  if (loading || !analytics) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <RefreshCw size={28} className="spin" style={{ color: 'var(--brand-emerald)', margin: '0 auto 12px' }} />
        <p style={{ color: 'var(--text-muted)' }}>Aggregating civic intelligence...</p>
      </div>
    );
  }

  const {
    total,
    open_cases,
    pending,
    in_progress,
    resolved,
    resolution_rate,
    categoryBreakdown,
    priorityBreakdown,
    locationBreakdown
  } = analytics;

  return (
    <div className="container">
      {/* Analytics Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: '0.78rem', background: 'var(--brand-emerald-light)', color: 'var(--brand-emerald)', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontWeight: 700 }}>
              Municipal Public Intelligence
            </span>
          </div>
          <h1 style={{ fontSize: '2.2rem' }}>
            Public Service Analytics & Insights
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Real-time telemetry measuring incident resolution rates, category frequency, and regional municipal response times.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={loadStats}
        >
          <RefreshCw size={14} />
          Refresh Analytics
        </button>
      </div>

      {/* KPI Cards */}
      <div className="stats-grid" style={{ marginBottom: 30 }}>
        <div className="stat-card card-total">
          <div className="stat-info">
            <span className="stat-label">Total Registered</span>
            <span className="stat-value">{total}</span>
            <span className="stat-hint">Across all sectors</span>
          </div>
          <div className="stat-icon icon-navy"><Building2 size={24} /></div>
        </div>

        <div className="stat-card card-pending">
          <div className="stat-info">
            <span className="stat-label">Open Cases</span>
            <span className="stat-value">{open_cases}</span>
            <span className="stat-hint">{pending} pending, {in_progress} in progress</span>
          </div>
          <div className="stat-icon icon-pending"><Clock size={24} /></div>
        </div>

        <div className="stat-card card-resolved">
          <div className="stat-info">
            <span className="stat-label">Resolved Cases</span>
            <span className="stat-value">{resolved}</span>
            <span className="stat-hint">{resolution_rate}% resolution rate</span>
          </div>
          <div className="stat-icon icon-resolved"><CheckCircle2 size={24} /></div>
        </div>

        <div className="stat-card card-progress">
          <div className="stat-info">
            <span className="stat-label">Target SLA</span>
            <span className="stat-value">2.4d</span>
            <span className="stat-hint">Avg. resolution cycle</span>
          </div>
          <div className="stat-icon icon-progress"><Award size={24} /></div>
        </div>
      </div>

      {/* Charts Grid: Donut (Open vs Resolved) + Category Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24, marginBottom: 30 }}>
        {/* Core Requirement: Open vs Resolved Cases */}
        <div className="card">
          <h3 style={{ fontSize: '1.2rem', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
            <PieChart size={18} style={{ color: 'var(--brand-emerald)' }} />
            Open vs. Resolved Cases
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 20 }}>
            Proportion of active municipal work orders against successfully closed and citizen-verified cases.
          </p>

          <DonutChart
            openCount={open_cases}
            resolvedCount={resolved}
            totalCount={total}
          />

          <div style={{ marginTop: 24, padding: 12, background: 'var(--bg-card-subtle)', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            💡 <strong>Executive Insight:</strong> {resolution_rate >= 50 ? 'Municipal work crews are meeting satisfactory resolution benchmarks.' : 'High backlog in streetlighting and water repair requires additional crew allocation.'}
          </div>
        </div>

        {/* Breakdown by Category */}
        <div className="card">
          <h3 style={{ fontSize: '1.2rem', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
            <BarChart3 size={18} style={{ color: 'var(--brand-emerald)' }} />
            Incidents by Service Category
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 20 }}>
            Frequency of citizen reports logged across public works departments.
          </p>

          <CategoryBarChart categories={categoryBreakdown} />
        </div>
      </div>

      {/* Secondary Metrics: Priority Breakdown & Location Hotspots */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
        {/* Priority Breakdown */}
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertTriangle size={18} style={{ color: '#ea580c' }} />
            Severity & Urgency Distribution
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {priorityBreakdown.map(p => {
              const pct = total > 0 ? Math.round((p.count / total) * 100) : 0;
              const color = p.priority === 'urgent' ? '#dc2626' : p.priority === 'high' ? '#ea580c' : p.priority === 'medium' ? '#2563eb' : '#64748b';
              return (
                <div key={p.priority}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{p.priority} Priority</span>
                    <span style={{ color: 'var(--text-muted)' }}>{p.count} cases ({pct}%)</span>
                  </div>
                  <div style={{ height: 8, background: 'var(--bg-card-subtle)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 4 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Geographic Hotspots */}
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <MapPin size={18} style={{ color: 'var(--brand-emerald)' }} />
            Sub-County & Ward Activity Hotspots
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {locationBreakdown.map((loc, idx) => (
              <div
                key={loc.sub_county}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  background: 'var(--bg-card-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--brand-emerald)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700 }}>
                    {idx + 1}
                  </span>
                  <span style={{ fontWeight: 600 }}>{loc.sub_county}</span>
                </div>
                <strong style={{ color: 'var(--brand-emerald)' }}>
                  {loc.count} reports
                </strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
