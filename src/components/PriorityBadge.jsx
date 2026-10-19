import React from 'react';
import { AlertCircle, AlertTriangle, ArrowUpRight, Minus } from 'lucide-react';

export default function PriorityBadge({ priority }) {
  const norm = (priority || 'medium').toLowerCase();

  const configs = {
    urgent: { label: 'Urgent', class: 'priority-urgent', icon: AlertCircle },
    high: { label: 'High', class: 'priority-high', icon: AlertTriangle },
    medium: { label: 'Medium', class: 'priority-medium', icon: ArrowUpRight },
    low: { label: 'Low', class: 'priority-low', icon: Minus }
  };

  const current = configs[norm] || configs.medium;
  const Icon = current.icon;

  return (
    <span className={`priority-badge ${current.class}`}>
      <Icon size={12} />
      {current.label}
    </span>
  );
}
