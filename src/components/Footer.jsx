import React from 'react';
import { Phone, Mail, MapPin, ExternalLink, ShieldCheck, Database } from 'lucide-react';

export default function Footer({ setView }) {
  return (
    <footer className="app-footer no-print">
      <div className="container">
        <div className="footer-grid">
          {/* Brand & Mandate */}
          <div className="footer-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img 
                src="/ecitizen-seal.png" 
                alt="eCitizen Civic Emblem" 
                style={{ width: 42, height: 42, borderRadius: '50%' }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div>
                <div style={{ fontWeight: 800, fontFamily: 'Outfit', color: 'var(--brand-emerald)', fontSize: '1.25rem' }}>
                  eCitizen Public Services
                </div>
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                  Digital Municipal Incident Management System
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              A unified civic platform enabling citizens to report community infrastructure challenges, track field crew progress, and ensure responsive local government service delivery.
            </p>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.76rem', background: 'var(--brand-emerald-light)', color: 'var(--brand-emerald)', padding: '4px 10px', borderRadius: 'var(--radius-full)', fontWeight: 600 }}>
              <Database size={13} />
              <span>Fullstack Ready: Express REST API + MySQL Database Engine</span>
            </div>
          </div>

          {/* Quick Access */}
          <div>
            <h5 style={{ fontSize: '0.92rem', marginBottom: 14, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Citizen Portals
            </h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.86rem' }}>
              <li>
                <a href="#submit" onClick={(e) => { e.preventDefault(); setView('submit'); }}>
                  Submit Incident Report
                </a>
              </li>
              <li>
                <a href="#track" onClick={(e) => { e.preventDefault(); setView('track'); }}>
                  Track Request Status
                </a>
              </li>
              <li>
                <a href="#citizen" onClick={(e) => { e.preventDefault(); setView('citizen_dashboard'); }}>
                  My Civic Requests
                </a>
              </li>
              <li>
                <a href="#catalog" onClick={(e) => { e.preventDefault(); setView('home'); }}>
                  Service Categories
                </a>
              </li>
            </ul>
          </div>

          {/* Administration */}
          <div>
            <h5 style={{ fontSize: '0.92rem', marginBottom: 14, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Municipal Operations
            </h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.86rem' }}>
              <li>
                <a href="#admin" onClick={(e) => { e.preventDefault(); setView('admin'); }}>
                  Department Admin Desk
                </a>
              </li>
              <li>
                <a href="#analytics" onClick={(e) => { e.preventDefault(); setView('analytics'); }}>
                  Service Analytics & SLA
                </a>
              </li>
              <li>
                <a href="#audit" onClick={(e) => { e.preventDefault(); setView('admin'); }}>
                  Audit Trail & Work Orders
                </a>
              </li>
            </ul>
          </div>

          {/* Emergency Contacts */}
          <div>
            <h5 style={{ fontSize: '0.92rem', marginBottom: 14, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Citizen Help Desk
            </h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.84rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Phone size={14} style={{ color: 'var(--brand-emerald)' }} />
                <span>Toll-Free: <strong>0800 221 000</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Mail size={14} style={{ color: 'var(--brand-emerald)' }} />
                <span>services@ecitizen.go.ke</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <MapPin size={14} style={{ color: 'var(--brand-emerald)' }} />
                <span>City Hall Plaza, 4th Floor, Nairobi</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & seal info */}
        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} Republic of Kenya • County Public Service System. All Rights Reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span>Privacy Policy</span>
            <span>Terms of Civic Engagement</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <ShieldCheck size={14} style={{ color: 'var(--brand-emerald)' }} /> Certified GovTech
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
