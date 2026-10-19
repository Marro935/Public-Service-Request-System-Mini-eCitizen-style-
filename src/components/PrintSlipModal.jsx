import React from 'react';
import { X, Printer, CheckCircle, ShieldCheck, QrCode } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function PrintSlipModal({ request, onClose }) {
  if (!request) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ maxWidth: 660 }} 
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header no-print">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Printer size={18} style={{ color: 'var(--brand-emerald)' }} />
            <h3 className="modal-title">Official Civic Service Receipt</h3>
          </div>
          <button type="button" className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body print-slip-area">
          <div className="print-slip">
            <div className="slip-watermark">eCitizen</div>

            <div className="slip-header">
              <img 
                src="/ecitizen-seal.png" 
                alt="Civic Seal" 
                className="slip-seal"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <h2 style={{ fontSize: '1.4rem', color: '#006837', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Republic of Kenya • County Government
              </h2>
              <p style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>
                DIRECTORATE OF CITIZEN SERVICES & PUBLIC INFRASTRUCTURE
              </p>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 4 }}>
                Official Service Request Acknowledgement Slip
              </div>
            </div>

            {/* Barcode Simulation */}
            <div className="slip-barcode">
              ||| |||| | | |||| || ||| | {request.tracking_number} |||| |||
            </div>

            {/* Key Record Details */}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', margin: '16px 0' }}>
              <tbody>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '8px 4px', fontWeight: 700, width: '38%', color: '#475569' }}>Tracking Reference No:</td>
                  <td style={{ padding: '8px 4px', fontWeight: 800, color: '#006837', fontFamily: 'monospace', fontSize: '1.05rem' }}>
                    {request.tracking_number}
                  </td>
                </tr>

                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '8px 4px', fontWeight: 700, color: '#475569' }}>Date & Time Lodged:</td>
                  <td style={{ padding: '8px 4px' }}>
                    {new Date(request.created_at).toLocaleString()}
                  </td>
                </tr>

                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '8px 4px', fontWeight: 700, color: '#475569' }}>Reporting Citizen:</td>
                  <td style={{ padding: '8px 4px', fontWeight: 600 }}>
                    {request.citizen_name || 'Anonymous Citizen'}
                  </td>
                </tr>

                {request.citizen_phone && (
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '8px 4px', fontWeight: 700, color: '#475569' }}>Citizen Contact:</td>
                    <td style={{ padding: '8px 4px' }}>{request.citizen_phone}</td>
                  </tr>
                )}

                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '8px 4px', fontWeight: 700, color: '#475569' }}>Category of Request:</td>
                  <td style={{ padding: '8px 4px', fontWeight: 600 }}>
                    {request.category_name}
                  </td>
                </tr>

                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '8px 4px', fontWeight: 700, color: '#475569' }}>Location & Ward:</td>
                  <td style={{ padding: '8px 4px' }}>
                    {request.location_address} ({request.sub_county})
                  </td>
                </tr>

                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '8px 4px', fontWeight: 700, color: '#475569' }}>Current Processing Status:</td>
                  <td style={{ padding: '8px 4px' }}>
                    <StatusBadge status={request.status} />
                  </td>
                </tr>

                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '8px 4px', fontWeight: 700, color: '#475569' }}>Assigned Department:</td>
                  <td style={{ padding: '8px 4px' }}>
                    {request.assigned_department || 'Municipal Works Triage'}
                  </td>
                </tr>

                {request.assigned_officer_name && (
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '8px 4px', fontWeight: 700, color: '#475569' }}>Designated Field Officer:</td>
                    <td style={{ padding: '8px 4px' }}>{request.assigned_officer_name}</td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Brief Description */}
            <div style={{ background: '#f8fafc', padding: 12, borderRadius: 6, border: '1px solid #e2e8f0', margin: '12px 0' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Issue Summary</div>
              <div style={{ fontSize: '0.85rem', color: '#1e293b', marginTop: 4 }}>
                <strong>{request.title}:</strong> {request.description}
              </div>
            </div>

            {/* Bottom Official Sign-off & Verification */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 24, paddingTop: 16, borderTop: '2px dashed #cbd5e1' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {/* SVG QR Code Simulation */}
                <div style={{ padding: 4, background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: 4 }}>
                  <svg width="60" height="60" viewBox="0 0 100 100">
                    <rect width="100" height="100" fill="white" />
                    <rect x="10" y="10" width="30" height="30" fill="#006837" />
                    <rect x="16" y="16" width="18" height="18" fill="white" />
                    <rect x="20" y="20" width="10" height="10" fill="#006837" />
                    <rect x="60" y="10" width="30" height="30" fill="#006837" />
                    <rect x="66" y="16" width="18" height="18" fill="white" />
                    <rect x="70" y="20" width="10" height="10" fill="#006837" />
                    <rect x="10" y="60" width="30" height="30" fill="#006837" />
                    <rect x="16" y="66" width="18" height="18" fill="white" />
                    <rect x="20" y="70" width="10" height="10" fill="#006837" />
                    <rect x="50" y="45" width="10" height="10" fill="#006837" />
                    <rect x="65" y="65" width="25" height="25" fill="#006837" />
                  </svg>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', lineHeight: 1.3 }}>
                  <div>Scan QR to verify live status</div>
                  <strong style={{ color: '#006837' }}>https://ecitizen.go.ke/track/{request.tracking_number}</strong>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ borderBottom: '1px solid #0f172a', width: 140, marginBottom: 4 }}></div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#334155' }}>Municipal Registrar Seal</div>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Certified Digital Copy</div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer no-print">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <button type="button" className="btn btn-primary" onClick={handlePrint}>
            <Printer size={16} />
            Print Official Slip (PDF)
          </button>
        </div>
      </div>
    </div>
  );
}
