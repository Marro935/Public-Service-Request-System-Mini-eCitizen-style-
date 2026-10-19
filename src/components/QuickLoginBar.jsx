import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { resetStorageToDemo } from '../services/storageService';
import { UserCheck, Shield, Wrench, RefreshCw, KeyRound } from 'lucide-react';

export default function QuickLoginBar({ onDataReset }) {
  const { currentUser, switchRole } = useAuth();
  const { addToast } = useNotification();

  const handleRoleSwitch = (role, name) => {
    switchRole(role);
    addToast(`Switched persona to: ${name} (${role.toUpperCase()})`, 'info', 2500);
  };

  const handleReset = () => {
    if (window.confirm('Reset all service requests, comments, and ratings to default demo state?')) {
      resetStorageToDemo();
      addToast('Demo data restored to initial state!', 'success');
      if (onDataReset) onDataReset();
    }
  };

  return (
    <div className="role-switcher-banner no-print">
      <div className="container role-switcher-container">
        <div className="role-switcher-left">
          <KeyRound size={14} style={{ color: 'var(--brand-gold-dark)' }} />
          <span><strong>Evaluation Persona Switcher:</strong> Active as <span style={{ color: 'var(--brand-emerald)', fontWeight: 700 }}>{currentUser?.name || 'Guest'}</span> ({currentUser?.role || 'Guest'})</span>
        </div>

        <div className="role-pills">
          <button
            type="button"
            className={`role-pill ${currentUser?.role === 'citizen' ? 'active' : ''}`}
            onClick={() => handleRoleSwitch('citizen', 'Jane Doe')}
            title="Switch to Citizen Jane Wanjiku Doe"
          >
            <UserCheck size={13} />
            <span>Citizen (Jane Doe)</span>
          </button>

          <button
            type="button"
            className={`role-pill ${currentUser?.role === 'officer' ? 'active' : ''}`}
            onClick={() => handleRoleSwitch('officer', 'Officer Peter Kamau')}
            title="Switch to Field Officer Peter Kamau"
          >
            <Wrench size={13} />
            <span>Officer (Kamau)</span>
          </button>

          <button
            type="button"
            className={`role-pill ${currentUser?.role === 'admin' ? 'active' : ''}`}
            onClick={() => handleRoleSwitch('admin', 'Eng. Alice Muthoni')}
            title="Switch to Super Admin Eng. Alice Muthoni"
          >
            <Shield size={13} />
            <span>Super Admin (Muthoni)</span>
          </button>

          <button
            type="button"
            className="role-pill"
            onClick={handleReset}
            title="Restore sample requests and clean state"
            style={{ marginLeft: 6, borderColor: 'var(--border-color)' }}
          >
            <RefreshCw size={12} />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>
    </div>
  );
}
