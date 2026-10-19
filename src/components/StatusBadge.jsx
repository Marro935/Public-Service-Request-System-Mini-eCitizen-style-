import React from 'react';
import { Clock, Loader, CheckCircle2, XCircle } from 'lucide-react';

export default function StatusBadge({ status, showIcon = true, size = 'md' }) {
  const normStatus = (status || 'pending').toLowerCase();

  const configs = {
    pending: {
      label: 'Pending Review',
      className: 'badge-pending',
      icon: Clock
    },
    in_progress: {
      label: 'In Progress',
      className: 'badge-progress',
      icon: Loader
    },
    resolved: {
      label: 'Resolved',
      className: 'badge-resolved',
      icon: CheckCircle2
    },
    rejected: {
      label: 'Declined',
      className: 'badge-rejected',
      icon: XCircle
    }
  };

  const current = configs[normStatus] || configs.pending;
  const IconComponent = current.icon;

  return (
    <span className={`badge ${current.className}`} style={{ fontSize: size === 'sm' ? '0.72rem' : '0.8rem' }}>
      <span className="badge-pulse"></span>
      {showIcon && <IconComponent size={13} style={{ marginRight: 2 }} />}
      {current.label}
    </span>
  );
}
