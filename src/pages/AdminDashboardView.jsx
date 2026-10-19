import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Search, 
  Filter, 
  Download, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowUpDown, 
  Eye, 
  FileEdit, 
  Printer, 
  User, 
  RefreshCw,
  Building2,
  Table,
  Grid
} from 'lucide-react';
import { fetchRequests, exportRequestsToCSV } from '../services/storageService';
import { INITIAL_CATEGORIES } from '../data/seedData';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import StatusUpdateModal from '../components/StatusUpdateModal';
import PrintSlipModal from '../components/PrintSlipModal';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export default function AdminDashboardView({ setView, onSelectTracking }) {
  const { currentUser } = useAuth();
  const { addToast } = useNotification();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Modals
  const [activeUpdateRequest, setActiveUpdateRequest] = useState(null);
  const [activeSlipRequest, setActiveSlipRequest] = useState(null);

  useEffect(() => {
    loadAllRequests();
  }, []);

  const loadAllRequests = async () => {
    setLoading(true);
    const data = await fetchRequests();
    setRequests(data);
    setLoading(false);
  };

  // Filter computation
  const filtered = requests.filter(r => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && r.category_id !== categoryFilter) return false;
    if (priorityFilter !== 'all' && r.priority !== priorityFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const match = 
        r.tracking_number.toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.location_address.toLowerCase().includes(q) ||
        (r.citizen_name && r.citizen_name.toLowerCase().includes(q)) ||
        (r.assigned_officer_name && r.assigned_officer_name.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  const total = requests.length;
  const pending = requests.filter(r => r.status === 'pending').length;
  const inProgress = requests.filter(r => r.status === 'in_progress').length;
  const resolved = requests.filter(r => r.status === 'resolved').length;
  const openCases = pending + inProgress;

  const handleExportCSV = () => {
    exportRequestsToCSV(filtered);
    addToast(`Exported ${filtered.length} service requests to CSV!`, 'success');
  };

  return (
    <div className="container">
      {/* Admin Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: '0.78rem', background: 'var(--brand-navy)', color: 'white', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontWeight: 700, textTransform: 'uppercase' }}>
              Municipal Operations Command
            </span>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Logged as: <strong>{currentUser?.name || 'Administrator'}</strong> ({currentUser?.role})
            </span>
          </div>
          <h1 style={{ fontSize: '2.2rem' }}>
            Service Requests Management Console
          </h1>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={loadAllRequests}
            title="Refresh database records"
          >
            <RefreshCw size={15} />
            Refresh
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleExportCSV}
            title="Download CSV spreadsheet report"
          >
            <Download size={15} />
            Export CSV ({filtered.length})
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card card-total">
          <div className="stat-info">
            <span className="stat-label">Total Docket</span>
            <span className="stat-value">{total}</span>
            <span className="stat-hint">All municipal reports</span>
          </div>
          <div className="stat-icon icon-navy"><Building2 size={24} /></div>
        </div>

        <div className="stat-card card-pending">
          <div className="stat-info">
            <span className="stat-label">Pending Triage</span>
            <span className="stat-value">{pending}</span>
            <span className="stat-hint">Awaiting work order</span>
          </div>
          <div className="stat-icon icon-pending"><Clock size={24} /></div>
        </div>

        <div className="stat-card card-progress">
          <div className="stat-info">
            <span className="stat-label">Active In-Progress</span>
            <span className="stat-value">{inProgress}</span>
            <span className="stat-hint">Field crews deployed</span>
          </div>
          <div className="stat-icon icon-progress"><AlertTriangle size={24} /></div>
        </div>

        <div className="stat-card card-resolved">
          <div className="stat-info">
            <span className="stat-label">Completed & Closed</span>
            <span className="stat-value">{resolved}</span>
            <span className="stat-hint">Works certified</span>
          </div>
          <div className="stat-icon icon-resolved"><CheckCircle2 size={24} /></div>
        </div>
      </div>

      {/* Advanced Filter Bar */}
      <div className="filter-bar">
        <div style={{ display: 'flex', gap: 10, flex: 1, minWidth: 260 }}>
          <div className="input-with-icon" style={{ width: '100%' }}>
            <Search size={16} className="input-icon" />
            <input
              type="text"
              className="form-input"
              placeholder="Search by ticket #, title, citizen, location, officer..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Status filter */}
          <select
            className="form-select"
            style={{ width: 'auto', padding: '8px 12px', fontSize: '0.85rem' }}
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Declined</option>
          </select>

          {/* Category filter */}
          <select
            className="form-select"
            style={{ width: 'auto', padding: '8px 12px', fontSize: '0.85rem' }}
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            {INITIAL_CATEGORIES.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          {/* Priority filter */}
          <select
            className="form-select"
            style={{ width: 'auto', padding: '8px 12px', fontSize: '0.85rem' }}
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* Table / Grid view switcher */}
          <div style={{ display: 'flex', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            <button
              type="button"
              className="btn btn-sm"
              style={{
                borderRadius: 0,
                background: viewMode === 'table' ? 'var(--brand-emerald)' : 'var(--bg-card)',
                color: viewMode === 'table' ? 'white' : 'var(--text-muted)'
              }}
              onClick={() => setViewMode('table')}
              title="Table View"
            >
              <Table size={15} />
            </button>
            <button
              type="button"
              className="btn btn-sm"
              style={{
                borderRadius: 0,
                background: viewMode === 'grid' ? 'var(--brand-emerald)' : 'var(--bg-card)',
                color: viewMode === 'grid' ? 'white' : 'var(--text-muted)'
              }}
              onClick={() => setViewMode('grid')}
              title="Card Grid View"
            >
              <Grid size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Table or Card Grid View */}
      {filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Search size={36} style={{ color: 'var(--text-subtle)', margin: '0 auto 12px' }} />
          <h3>No matching service requests found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: 4 }}>
            Try resetting your search query or status filters.
          </p>
        </div>
      ) : viewMode === 'table' ? (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Tracking #</th>
                <th>Incident & Category</th>
                <th>Reporting Citizen</th>
                <th>Location / Ward</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Assigned Officer</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id}>
                  <td>
                    <span 
                      style={{ 
                        fontFamily: 'monospace', 
                        fontWeight: 700, 
                        color: 'var(--brand-emerald)',
                        cursor: 'pointer',
                        textDecoration: 'underline'
                      }}
                      onClick={() => {
                        onSelectTracking(r.tracking_number);
                        setView('track');
                      }}
                    >
                      {r.tracking_number}
                    </span>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>
                      {new Date(r.created_at).toLocaleDateString()}
                    </div>
                  </td>

                  <td style={{ maxWidth: 260 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 2 }}>
                      {r.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {r.category_name}
                    </div>
                  </td>

                  <td>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{r.citizen_name}</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{r.citizen_phone || 'N/A'}</div>
                  </td>

                  <td style={{ maxWidth: 200 }}>
                    <div style={{ fontSize: '0.84rem' }}>{r.location_address}</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{r.sub_county}</div>
                  </td>

                  <td>
                    <PriorityBadge priority={r.priority} />
                  </td>

                  <td>
                    <StatusBadge status={r.status} size="sm" />
                  </td>

                  <td>
                    <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>
                      {r.assigned_officer_name || <span style={{ color: 'var(--text-subtle)' }}>Unassigned</span>}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {r.assigned_department?.split(' ')[0]}
                    </div>
                  </td>

                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          onSelectTracking(r.tracking_number);
                          setView('track');
                        }}
                        title="View details & timeline"
                      >
                        <Eye size={13} />
                      </button>

                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => setActiveSlipRequest(r)}
                        title="Print slip"
                      >
                        <Printer size={13} />
                      </button>

                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => setActiveUpdateRequest(r)}
                        title="Update Status / Assign Officer"
                      >
                        <FileEdit size={13} />
                        Update
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Grid View */
        <div className="requests-grid">
          {filtered.map(r => (
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
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <PriorityBadge priority={r.priority} />
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-subtle)' }}>
                    {new Date(r.created_at).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="request-card-title">{r.title}</h3>
                <p className="request-card-description">{r.description}</p>

                <div className="request-card-meta">
                  <div style={{ fontSize: '0.8rem' }}>📍 {r.location_address} ({r.sub_county})</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>👤 {r.citizen_name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--brand-emerald)', fontWeight: 600 }}>
                    👮 {r.assigned_officer_name || 'Pending assignment'}
                  </div>
                </div>
              </div>

              <div className="request-card-footer">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setActiveSlipRequest(r)}
                >
                  <Printer size={13} /> Slip
                </button>

                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => setActiveUpdateRequest(r)}
                >
                  <FileEdit size={13} /> Update Status
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {activeUpdateRequest && (
        <StatusUpdateModal
          request={activeUpdateRequest}
          onClose={() => setActiveUpdateRequest(null)}
          onUpdated={loadAllRequests}
        />
      )}

      {activeSlipRequest && (
        <PrintSlipModal
          request={activeSlipRequest}
          onClose={() => setActiveSlipRequest(null)}
        />
      )}
    </div>
  );
}
