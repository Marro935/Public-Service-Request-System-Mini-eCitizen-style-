import React, { useState } from 'react';
import { X, CheckCircle, ArrowRight, ShieldCheck, UserCheck, FileEdit } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { updateRequestStatus } from '../services/storageService';

const OFFICERS_LIST = [
  { name: 'Officer Peter Kamau', dept: 'Department of Energy & Public Lighting' },
  { name: 'Inspector Grace Achieng', dept: 'Water & Sanitation Directorate' },
  { name: 'Field Lead David Kipkorir', dept: 'Roads, Bridges & Infrastructure' },
  { name: 'Officer Hassan Omar', dept: 'Environment & Cleansing Services' }
];

const DEPARTMENTS = [
  'Department of Energy & Public Lighting',
  'Water & Sanitation Directorate',
  'Environment & Sanitation Board',
  'Roads, Bridges & Infrastructure',
  'Urban Forestry & Green Spaces',
  'Directorate of Public Health'
];

export default function StatusUpdateModal({ request, onClose, onUpdated }) {
  const { currentUser } = useAuth();
  const { addToast } = useNotification();

  const [status, setStatus] = useState(request.status || 'pending');
  const [officerName, setOfficerName] = useState(request.assigned_officer_name || '');
  const [department, setDepartment] = useState(request.assigned_department || '');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await updateRequestStatus(request.id, {
        status,
        notes: notes.trim() || `Status updated to ${status.replace('_', ' ')} by ${currentUser?.name || 'Admin'}`,
        actor_name: currentUser?.name || 'Municipal Officer',
        actor_role: currentUser?.role === 'admin' ? 'Super Admin' : 'Field Officer',
        assigned_officer_name: officerName,
        assigned_department: department
      });

      addToast(`Ticket ${request.tracking_number} updated to ${status.toUpperCase()}!`, 'success');
      if (onUpdated) onUpdated();
      onClose();
    } catch (err) {
      addToast('Failed to update status: ' + err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ maxWidth: 540 }} 
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FileEdit size={18} style={{ color: 'var(--brand-emerald)' }} />
            <h3 className="modal-title">Update Request Status</h3>
          </div>
          <button type="button" className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Header snippet */}
            <div style={{ background: 'var(--bg-card-subtle)', padding: 12, borderRadius: 'var(--radius-md)', marginBottom: 20 }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Updating Ticket:</div>
              <div style={{ fontWeight: 800, fontFamily: 'Outfit', color: 'var(--brand-emerald)', fontSize: '1.1rem' }}>
                {request.tracking_number}
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)', marginTop: 2 }}>
                {request.title}
              </div>
            </div>

            {/* Target Status Select */}
            <div className="form-group">
              <label className="form-label">
                Target Status <span className="required">*</span>
              </label>
              <select
                className="form-select"
                value={status}
                onChange={e => setStatus(e.target.value)}
                required
              >
                <option value="pending">Pending (Queued / Under Review)</option>
                <option value="in_progress">In Progress (Crew Dispatched / Active)</option>
                <option value="resolved">Resolved (Completed & Verified)</option>
                <option value="rejected">Declined / Out of Municipal Scope</option>
              </select>
            </div>

            {/* Assigned Department */}
            <div className="form-group">
              <label className="form-label">Assigned Municipal Directorate</label>
              <select
                className="form-select"
                value={department}
                onChange={e => setDepartment(e.target.value)}
              >
                <option value="">-- Select Directorate --</option>
                {DEPARTMENTS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Assign Field Officer */}
            <div className="form-group">
              <label className="form-label">Designate Field Officer</label>
              <select
                className="form-select"
                value={officerName}
                onChange={e => setOfficerName(e.target.value)}
              >
                <option value="">-- Choose Field Personnel --</option>
                {OFFICERS_LIST.map(o => (
                  <option key={o.name} value={o.name}>
                    {o.name} ({o.dept.split(' ')[0]})
                  </option>
                ))}
              </select>
            </div>

            {/* Audit & Action Notes */}
            <div className="form-group">
              <label className="form-label">
                Action Remarks / Dispatch Note <span className="required">*</span>
              </label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="e.g., Work crew #4 dispatched with replacement LED light fixtures. Expected completion by 5 PM."
                value={notes}
                onChange={e => setNotes(e.target.value)}
                required
              />
              <div className="form-hint">
                These notes will be logged in the public timeline visible to the reporting citizen.
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Apply Status Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
