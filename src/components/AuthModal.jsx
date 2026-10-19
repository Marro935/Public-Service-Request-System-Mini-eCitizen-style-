import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, CreditCard, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export default function AuthModal({ isOpen, onClose }) {
  const { login, register } = useAuth();
  const { addToast } = useNotification();

  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        addToast(`Welcome back, ${res.user.name}!`, 'success');
        onClose();
      } else {
        addToast(res.message || 'Login failed', 'error');
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await register({
        name,
        email,
        password,
        phone,
        national_id: nationalId
      });
      if (res.success) {
        addToast(`Registration successful! Welcome to eCitizen, ${name}.`, 'success');
        onClose();
      } else {
        addToast(res.message || 'Registration failed', 'error');
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Quick fill credentials helper
  const fillCredentials = (type) => {
    if (type === 'citizen') {
      setEmail('citizen@ecitizen.go.ke');
      setPassword('password123');
    } else if (type === 'admin') {
      setEmail('admin@ecitizen.go.ke');
      setPassword('password123');
    } else if (type === 'officer') {
      setEmail('officer@ecitizen.go.ke');
      setPassword('password123');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ maxWidth: 480 }} 
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {mode === 'login' ? <LogIn size={20} style={{ color: 'var(--brand-emerald)' }} /> : <UserPlus size={20} style={{ color: 'var(--brand-emerald)' }} />}
            <h3 className="modal-title">
              {mode === 'login' ? 'eCitizen Portal Sign In' : 'Citizen Registration'}
            </h3>
          </div>
          <button type="button" className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Tab switcher */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)' }}>
          <button
            type="button"
            style={{
              flex: 1,
              padding: '12px 0',
              background: 'none',
              border: 'none',
              borderBottom: mode === 'login' ? '3px solid var(--brand-emerald)' : '3px solid transparent',
              fontWeight: 700,
              color: mode === 'login' ? 'var(--brand-emerald)' : 'var(--text-muted)',
              cursor: 'pointer'
            }}
            onClick={() => setMode('login')}
          >
            Sign In
          </button>
          <button
            type="button"
            style={{
              flex: 1,
              padding: '12px 0',
              background: 'none',
              border: 'none',
              borderBottom: mode === 'register' ? '3px solid var(--brand-emerald)' : '3px solid transparent',
              fontWeight: 700,
              color: mode === 'register' ? 'var(--brand-emerald)' : 'var(--text-muted)',
              cursor: 'pointer'
            }}
            onClick={() => setMode('register')}
          >
            Register Account
          </button>
        </div>

        <div className="modal-body">
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label className="form-label">eCitizen Email Address</label>
                <div className="input-with-icon">
                  <Mail size={16} className="input-icon" />
                  <input
                    type="email"
                    className="form-input"
                    placeholder="e.g., citizen@ecitizen.go.ke"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-with-icon">
                  <Lock size={16} className="input-icon" />
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Enter account password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Demo 1-click credential fillers */}
              <div style={{ background: 'var(--bg-card-subtle)', padding: 12, borderRadius: 'var(--radius-md)', marginBottom: 20 }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase' }}>
                  Quick Fill Test Credentials:
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => fillCredentials('citizen')}
                  >
                    Citizen Demo
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => fillCredentials('admin')}
                  >
                    Admin Demo
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => fillCredentials('officer')}
                  >
                    Officer Demo
                  </button>
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                {loading ? 'Authenticating...' : 'Sign In to Portal'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit}>
              <div className="form-group">
                <label className="form-label">Full Legal Name <span className="required">*</span></label>
                <div className="input-with-icon">
                  <User size={16} className="input-icon" />
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Grace Nyambura"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">National Identity Card Number</label>
                <div className="input-with-icon">
                  <CreditCard size={16} className="input-icon" />
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. ID-38491029"
                    value={nationalId}
                    onChange={e => setNationalId(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address <span className="required">*</span></label>
                <div className="input-with-icon">
                  <Mail size={16} className="input-icon" />
                  <input
                    type="email"
                    className="form-input"
                    placeholder="e.g. grace@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Mobile Phone Number</label>
                <div className="input-with-icon">
                  <Phone size={16} className="input-icon" />
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="+254 7XX XXX XXX"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Create Password <span className="required">*</span></label>
                <div className="input-with-icon">
                  <Lock size={16} className="input-icon" />
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                {loading ? 'Registering...' : 'Complete Citizen Registration'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
