import React, { useState } from 'react';
import { MapPin, Navigation, Eye, CheckCircle2, Clock, Loader } from 'lucide-react';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';

// Nairobi / Metropolitan District Boundaries & Landmark Centers
const MUNICIPAL_DISTRICTS = [
  { id: 'cbd', name: 'Central Ward / CBD', cx: 380, cy: 260, r: 65, color: '#0284c7' },
  { id: 'westlands', name: 'Westlands Sub-County', cx: 280, cy: 190, r: 75, color: '#059669' },
  { id: 'parklands', name: 'Parklands & Highridge', cx: 340, cy: 140, r: 60, color: '#f59e0b' },
  { id: 'kilimani', name: 'Kilimani & Kileleshwa', cx: 270, cy: 290, r: 70, color: '#8b5cf6' },
  { id: 'langata', name: 'Langata Ward', cx: 240, cy: 400, r: 85, color: '#ec4899' },
  { id: 'kasarani', name: 'Kasarani Sub-County', cx: 510, cy: 130, r: 90, color: '#10b981' },
  { id: 'embakasi', name: 'Embakasi North', cx: 530, cy: 270, r: 85, color: '#06b6d4' },
  { id: 'dagoretti', name: 'Dagoretti South', cx: 160, cy: 340, r: 70, color: '#64748b' }
];

export default function InteractiveMap({ 
  requests = [], 
  onSelectRequest, 
  mode = 'browse', // 'browse' or 'picker'
  selectedLocation, 
  onLocationPick 
}) {
  const [selectedPin, setSelectedPin] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  // Convert real lat/lng to SVG coordinate map space
  // Nairobi bounding box roughly: lat [-1.35, -1.20], lng [36.70, 36.95]
  const projectCoords = (lat, lng) => {
    const minLat = -1.36;
    const maxLat = -1.21;
    const minLng = 36.72;
    const maxLng = 36.94;

    const x = ((lng - minLng) / (maxLng - minLng)) * 540 + 70;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 360 + 70;
    return { x: Math.max(40, Math.min(660, x)), y: Math.max(40, Math.min(460, y)) };
  };

  const handleSvgClick = (e) => {
    if (mode !== 'picker') return;

    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const viewBoxWidth = 700;
    const viewBoxHeight = 500;
    const scaleX = viewBoxWidth / rect.width;
    const scaleY = viewBoxHeight / rect.height;

    const svgX = clickX * scaleX;
    const svgY = clickY * scaleY;

    // Approximate closest district
    let closestDist = null;
    let minD = Infinity;
    MUNICIPAL_DISTRICTS.forEach(d => {
      const dist = Math.hypot(d.cx - svgX, d.cy - svgY);
      if (dist < minD) {
        minD = dist;
        closestDist = d;
      }
    });

    // Approximate lat/lng
    const minLat = -1.36;
    const maxLat = -1.21;
    const minLng = 36.72;
    const maxLng = 36.94;

    const lat = maxLat - ((svgY - 70) / 360) * (maxLat - minLat);
    const lng = minLng + ((svgX - 70) / 540) * (maxLng - minLng);

    if (onLocationPick) {
      onLocationPick({
        latitude: parseFloat(lat.toFixed(6)),
        longitude: parseFloat(lng.toFixed(6)),
        sub_county: closestDist?.name || 'Central Ward / CBD',
        address: `${closestDist?.name || 'Metropolitan Area'}, Civic Sector ${Math.floor(svgX % 20 + 1)}`
      });
    }
  };

  const filteredRequests = requests.filter(r => {
    if (activeFilter === 'all') return true;
    return r.status === activeFilter;
  });

  return (
    <div className="card" style={{ padding: 18, position: 'relative', overflow: 'hidden' }}>
      {/* Map Control Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '1.05rem' }}>
            <Navigation size={18} style={{ color: 'var(--brand-emerald)' }} />
            {mode === 'picker' ? 'Click on Map to Drop Incident Pin' : 'Live Civic Incidents Geo-Map'}
          </h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {mode === 'picker' 
              ? 'Click anywhere on the municipal sectors to capture precise GPS coordinates.' 
              : 'Interactive overview of active service requests across city sectors.'}
          </p>
        </div>

        {mode === 'browse' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {['all', 'pending', 'in_progress', 'resolved'].map(statusKey => (
              <button
                key={statusKey}
                type="button"
                onClick={() => setActiveFilter(statusKey)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border-color)',
                  background: activeFilter === statusKey ? 'var(--brand-navy)' : 'var(--bg-card)',
                  color: activeFilter === statusKey ? 'white' : 'var(--text-muted)',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {statusKey.replace('_', ' ')}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Interactive Map Visual Area */}
      <div 
        style={{ 
          position: 'relative', 
          width: '100%', 
          borderRadius: 'var(--radius-md)', 
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #0b1e36 0%, #081426 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          cursor: mode === 'picker' ? 'crosshair' : 'default'
        }}
      >
        <svg
          viewBox="0 0 700 500"
          style={{ width: '100%', height: 'auto', display: 'block' }}
          onClick={handleSvgClick}
        >
          {/* Grid pattern background */}
          <defs>
            <pattern id="mapGrid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
            </pattern>
            <radialGradient id="sectorPulse" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#006837" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#006837" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect width="700" height="500" fill="url(#mapGrid)" />

          {/* Municipal Sectors / Sub-Counties SVG shapes */}
          {MUNICIPAL_DISTRICTS.map((d) => (
            <g key={d.id}>
              {/* Sector Halo */}
              <circle 
                cx={d.cx} 
                cy={d.cy} 
                r={d.r} 
                fill={d.color} 
                fillOpacity="0.12" 
                stroke={d.color} 
                strokeOpacity="0.35" 
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />
              <circle cx={d.cx} cy={d.cy} r="4" fill={d.color} fillOpacity="0.6" />
              <text 
                x={d.cx} 
                y={d.cy + d.r - 12} 
                fill="rgba(255, 255, 255, 0.55)" 
                fontSize="10" 
                fontWeight="600" 
                textAnchor="middle"
                fontFamily="Plus Jakarta Sans"
              >
                {d.name.split(' ')[0]}
              </text>
            </g>
          ))}

          {/* Major thoroughfares / Arterial routes */}
          <path 
            d="M 120 450 Q 280 320 380 260 T 560 110" 
            fill="none" 
            stroke="rgba(255, 255, 255, 0.2)" 
            strokeWidth="3" 
            strokeDasharray="6 4"
          />
          <path 
            d="M 280 120 Q 380 260 560 360" 
            fill="none" 
            stroke="rgba(255, 255, 255, 0.2)" 
            strokeWidth="3" 
            strokeDasharray="6 4"
          />

          {/* Request Pins */}
          {mode === 'browse' && filteredRequests.map(r => {
            const coords = projectCoords(r.latitude || -1.286389, r.longitude || 36.817223);
            const isPending = r.status === 'pending';
            const isInProgress = r.status === 'in_progress';
            const isResolved = r.status === 'resolved';

            const pinColor = isPending ? '#d97706' : isInProgress ? '#2563eb' : '#059669';

            return (
              <g 
                key={r.id} 
                transform={`translate(${coords.x}, ${coords.y})`}
                style={{ cursor: 'pointer' }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPin(r);
                  if (onSelectRequest) onSelectRequest(r);
                }}
              >
                {/* Ping animation ripple for pending/in-progress */}
                {!isResolved && (
                  <circle cx="0" cy="-12" r="14" fill={pinColor} opacity="0.3">
                    <animate attributeName="r" values="8;20;8" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
                  </circle>
                )}
                {/* Pin head */}
                <path 
                  d="M 0 -24 C -8 -24 -12 -18 -12 -10 C -12 -2 0 0 0 0 C 0 0 12 -2 12 -10 C 12 -18 8 -24 0 -24 Z" 
                  fill={pinColor}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
                <circle cx="0" cy="-12" r="4" fill="#ffffff" />
              </g>
            );
          })}

          {/* User selected picker pin */}
          {mode === 'picker' && selectedLocation && (
            (() => {
              const coords = projectCoords(selectedLocation.latitude, selectedLocation.longitude);
              return (
                <g transform={`translate(${coords.x}, ${coords.y})`}>
                  <circle cx="0" cy="-12" r="16" fill="#006837" opacity="0.4">
                    <animate attributeName="r" values="10;22;10" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                  <path 
                    d="M 0 -26 C -9 -26 -14 -19 -14 -11 C -14 -3 0 0 0 0 C 0 0 14 -3 14 -11 C 14 -19 9 -26 0 -26 Z" 
                    fill="#006837"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  <circle cx="0" cy="-13" r="5" fill="#f59e0b" />
                </g>
              );
            })()
          )}
        </svg>

        {/* Selected Pin Mini-Popup in Browse Mode */}
        {selectedPin && mode === 'browse' && (
          <div
            style={{
              position: 'absolute',
              bottom: 16,
              left: 16,
              right: 16,
              maxWidth: 360,
              background: 'var(--bg-card)',
              color: 'var(--text-main)',
              borderRadius: 'var(--radius-md)',
              padding: 14,
              boxShadow: 'var(--shadow-xl)',
              border: '1px solid var(--border-color)',
              animation: 'slideUp 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontFamily: 'Outfit', fontWeight: 800, color: 'var(--brand-emerald)', fontSize: '0.85rem' }}>
                {selectedPin.tracking_number}
              </span>
              <StatusBadge status={selectedPin.status} size="sm" />
            </div>

            <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 4 }}>
              {selectedPin.title}
            </div>

            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 8 }}>
              {selectedPin.location_address} • {selectedPin.sub_county}
            </div>

            <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setSelectedPin(null)}
              >
                Close
              </button>
              {onSelectRequest && (
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => onSelectRequest(selectedPin)}
                >
                  <Eye size={13} />
                  View Details
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 10, fontSize: '0.75rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#d97706', display: 'inline-block' }}></span>
          Pending ({requests.filter(r => r.status === 'pending').length})
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#2563eb', display: 'inline-block' }}></span>
          In Progress ({requests.filter(r => r.status === 'in_progress').length})
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#059669', display: 'inline-block' }}></span>
          Resolved ({requests.filter(r => r.status === 'resolved').length})
        </span>
        {mode === 'picker' && (
          <span style={{ marginLeft: 'auto', color: 'var(--brand-emerald)', fontWeight: 600 }}>
            📍 Selected: {selectedLocation?.sub_county || 'Click map'}
          </span>
        )}
      </div>
    </div>
  );
}
