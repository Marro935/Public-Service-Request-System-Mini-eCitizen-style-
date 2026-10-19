import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNotification } from '../context/NotificationContext';
import { 
  PlusCircle, 
  Search, 
  LayoutDashboard, 
  BarChart3, 
  FileText, 
  Bell, 
  Sun, 
  Moon, 
  LogOut, 
  LogIn, 
  User, 
  ShieldCheck,
  Check,
  Menu,
  X
} from 'lucide-react';

export default function Navbar({ currentView, setView, onOpenLogin }) {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { notifications, unreadCount, markAllNotificationsAsRead } = useNotification();
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdminOrOfficer = currentUser?.role === 'admin' || currentUser?.role === 'officer';

  const navigateTo = (view) => {
    setView(view);
    setMobileMenuOpen(false);
    setShowNotifications(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div className="gov-top-bar"></div>
      
      <header className="navbar">
        <div className="container navbar-inner">
          {/* Brand Seal & Name */}
          <div className="nav-brand" style={{ cursor: 'pointer' }} onClick={() => navigateTo('home')}>
            <img 
              src="/ecitizen-seal.png" 
              alt="eCitizen Civic Seal" 
              className="nav-brand-logo" 
              onError={(e) => {
                // Graceful fallback if image doesn't load
                e.target.style.display = 'none';
              }}
            />
            <div className="nav-brand-text">
              <span className="nav-brand-title">eCitizen</span>
              <span className="nav-brand-subtitle">Public Service Portal</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav>
            <ul className="nav-links">
              <li>
                <button 
                  type="button" 
                  className={`nav-link ${currentView === 'home' ? 'active' : ''}`}
                  onClick={() => navigateTo('home')}
                >
                  Home
                </button>
              </li>

              <li>
                <button 
                  type="button" 
                  className={`nav-link ${currentView === 'submit' ? 'active' : ''}`}
                  onClick={() => navigateTo('submit')}
                >
                  <PlusCircle size={15} />
                  Submit Request
                </button>
              </li>

              <li>
                <button 
                  type="button" 
                  className={`nav-link ${currentView === 'track' ? 'active' : ''}`}
                  onClick={() => navigateTo('track')}
                >
                  <Search size={15} />
                  Track Ticket
                </button>
              </li>

              {isAuthenticated && currentUser?.role === 'citizen' && (
                <li>
                  <button 
                    type="button" 
                    className={`nav-link ${currentView === 'citizen_dashboard' ? 'active' : ''}`}
                    onClick={() => navigateTo('citizen_dashboard')}
                  >
                    <FileText size={15} />
                    My Requests
                  </button>
                </li>
              )}

              {isAdminOrOfficer && (
                <li>
                  <button 
                    type="button" 
                    className={`nav-link ${currentView === 'admin' ? 'active' : ''}`}
                    onClick={() => navigateTo('admin')}
                    style={{ fontWeight: 700 }}
                  >
                    <LayoutDashboard size={15} />
                    Admin Desk
                  </button>
                </li>
              )}

              <li>
                <button 
                  type="button" 
                  className={`nav-link ${currentView === 'analytics' ? 'active' : ''}`}
                  onClick={() => navigateTo('analytics')}
                >
                  <BarChart3 size={15} />
                  Civic Analytics
                </button>
              </li>
            </ul>
          </nav>

          {/* Nav Actions: Notifications, Theme Toggle, Profile */}
          <div className="nav-actions">
            {/* Theme Toggle Button */}
            <button
              type="button"
              className="btn btn-secondary btn-icon"
              onClick={toggleTheme}
              title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun size={18} style={{ color: '#f59e0b' }} /> : <Moon size={18} />}
            </button>

            {/* Notification Bell with Badge */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                className="btn btn-secondary btn-icon"
                onClick={() => setShowNotifications(prev => !prev)}
                title="Municipal Alerts & Notifications"
                aria-label="Notifications"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: -4,
                      right: -4,
                      background: 'var(--status-rejected)',
                      color: 'white',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      borderRadius: '50%',
                      width: 18,
                      height: 18,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 0 2px var(--bg-card)'
                    }}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popover */}
              {showNotifications && (
                <div
                  style={{
                    position: 'absolute',
                    top: '120%',
                    right: 0,
                    width: 320,
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-xl)',
                    zIndex: 200,
                    overflow: 'hidden',
                    animation: 'slideUp 0.15s ease'
                  }}
                >
                  <div
                    style={{
                      padding: '12px 16px',
                      background: 'var(--bg-card-subtle)',
                      borderBottom: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>Civic Notifications</span>
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={markAllNotificationsAsRead}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--brand-emerald)',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 3,
                          fontWeight: 600
                        }}
                      >
                        <Check size={12} /> Mark read
                      </button>
                    )}
                  </div>

                  <div style={{ maxHeight: 280, overflowY: 'auto' }}>
                    {notifications.length === 0 ? (
                      <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        No notifications
                      </div>
                    ) : (
                      notifications.slice(0, 5).map(notif => (
                        <div
                          key={notif.id}
                          style={{
                            padding: '10px 14px',
                            borderBottom: '1px solid var(--border-color)',
                            background: notif.is_read ? 'transparent' : 'var(--brand-emerald-light)',
                            cursor: 'pointer'
                          }}
                          onClick={() => {
                            if (notif.tracking_number) {
                              setShowNotifications(false);
                              setView('track');
                            }
                          }}
                        >
                          <div style={{ fontWeight: 700, fontSize: '0.82rem', marginBottom: 2 }}>
                            {notif.title}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.35 }}>
                            {notif.message}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', marginTop: 4 }}>
                            {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile / Login */}
            {isAuthenticated ? (
              <div style={{ display: 'flex', alignItem: 'center', gap: 6 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--bg-card-subtle)',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.85rem'
                  }}
                >
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: '50%',
                      background: 'var(--brand-emerald)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.75rem'
                    }}
                  >
                    {currentUser?.name?.charAt(0) || 'U'}
                  </div>
                  <span style={{ fontWeight: 600, maxWidth: 110, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {currentUser?.name?.split(' ')[0]}
                  </span>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      background: currentUser.role === 'admin' ? 'var(--status-rejected)' : currentUser.role === 'officer' ? 'var(--brand-navy)' : 'var(--brand-emerald)',
                      color: 'white',
                      padding: '1px 6px',
                      borderRadius: 'var(--radius-full)',
                      fontWeight: 700,
                      textTransform: 'uppercase'
                    }}
                  >
                    {currentUser.role}
                  </span>
                </div>

                <button
                  type="button"
                  className="btn btn-secondary btn-icon"
                  onClick={logout}
                  title="Sign Out"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={onOpenLogin}
              >
                <LogIn size={15} />
                Sign In
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              type="button"
              className="btn btn-secondary btn-icon"
              style={{ display: 'none' }}
              onClick={() => setMobileMenuOpen(prev => !prev)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
