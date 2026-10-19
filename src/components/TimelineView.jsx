import React from 'react';
import { Check, Clock, Loader, AlertTriangle, MessageSquare, Star, User, Shield } from 'lucide-react';

export default function TimelineView({ request }) {
  if (!request) return null;

  const currentStatus = (request.status || 'pending').toLowerCase();

  // Determine stage progression: 1=Pending, 2=In Progress, 3=Resolved
  const stage = currentStatus === 'resolved' ? 3 : currentStatus === 'in_progress' ? 2 : 1;

  const timelineEvents = request.timeline || [];

  return (
    <div style={{ marginTop: 12 }}>
      {/* 3-Step Horizontal Milestone Stepper */}
      <div className="progress-stepper">
        <div className="progress-track">
          <div 
            className="progress-fill" 
            style={{ 
              width: stage === 3 ? '100%' : stage === 2 ? '50%' : '5%' 
            }} 
          />
        </div>

        {/* Step 1: Pending / Submitted */}
        <div className={`step-item ${stage >= 1 ? 'completed' : ''} ${stage === 1 ? 'active' : ''}`}>
          <div className="step-circle">
            {stage > 1 ? <Check size={18} /> : <Clock size={16} />}
          </div>
          <span className="step-label">1. Submitted</span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>Pending Review</span>
        </div>

        {/* Step 2: In Progress */}
        <div className={`step-item ${stage >= 2 ? 'completed' : ''} ${stage === 2 ? 'active' : ''}`}>
          <div className="step-circle">
            {stage > 2 ? <Check size={18} /> : <Loader size={16} />}
          </div>
          <span className="step-label">2. In Progress</span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>Field Crew Dispatched</span>
        </div>

        {/* Step 3: Resolved */}
        <div className={`step-item ${stage === 3 ? 'completed' : ''}`}>
          <div className="step-circle">
            <Check size={18} />
          </div>
          <span className="step-label">3. Resolved</span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>Works Certified</span>
        </div>
      </div>

      {/* Audit Log Vertical Timeline */}
      <h4 style={{ fontSize: '1rem', marginTop: 24, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
        <Clock size={16} style={{ color: 'var(--brand-emerald)' }} />
        Official Action & Audit History ({timelineEvents.length} events)
      </h4>

      <div className="timeline">
        {timelineEvents.map((event, idx) => {
          const isResolvedAction = event.action.toLowerCase().includes('resolved');
          const isProgressAction = event.action.toLowerCase().includes('progress');
          const isRatingAction = event.action.toLowerCase().includes('rated') || event.action.toLowerCase().includes('star');

          const dotClass = isResolvedAction ? 'dot-resolved' : isProgressAction ? 'dot-progress' : 'dot-pending';

          return (
            <div key={event.id || idx} className="timeline-item">
              <div className={`timeline-dot ${dotClass}`}>
                {isResolvedAction ? (
                  <Check size={12} color="white" />
                ) : isRatingAction ? (
                  <Star size={10} color="#f59e0b" />
                ) : (
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />
                )}
              </div>

              <div className="timeline-content">
                <div className="timeline-header">
                  <span className="timeline-title">{event.action}</span>
                  <span className="timeline-time">
                    {new Date(event.created_at).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>

                <div className="timeline-author">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    {event.actor_role === 'Admin' ? (
                      <Shield size={12} style={{ color: 'var(--status-rejected)' }} />
                    ) : event.actor_role === 'Officer' ? (
                      <Shield size={12} style={{ color: 'var(--brand-navy)' }} />
                    ) : (
                      <User size={12} style={{ color: 'var(--brand-emerald)' }} />
                    )}
                    <strong>{event.actor_name}</strong> • {event.actor_role}
                  </span>
                </div>

                {event.notes && (
                  <div className="timeline-notes">
                    {event.notes}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
