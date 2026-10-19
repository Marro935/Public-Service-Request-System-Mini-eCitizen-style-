import React from 'react';

// Responsive SVG Donut Chart (Open vs Resolved cases)
export function DonutChart({ openCount, resolvedCount, totalCount }) {
  const total = totalCount || (openCount + resolvedCount) || 1;
  const resolvedPct = Math.round((resolvedCount / total) * 100);
  const openPct = 100 - resolvedPct;

  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const resolvedStroke = (resolvedCount / total) * circumference;
  const openStroke = circumference - resolvedStroke;

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
      <div style={{ position: 'relative', width: 160, height: 160 }}>
        <svg width="160" height="160" viewBox="0 0 160 160" style={{ transform: 'rotate(-90deg)' }}>
          {/* Background circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="transparent"
            stroke="var(--bg-card-subtle)"
            strokeWidth="20"
          />
          {/* Open Cases Arc */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="transparent"
            stroke="#d97706"
            strokeWidth="20"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset="0"
          />
          {/* Resolved Cases Arc */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="transparent"
            stroke="#059669"
            strokeWidth="20"
            strokeDasharray={`${resolvedStroke} ${circumference}`}
            strokeDashoffset="0"
            style={{ transition: 'stroke-dasharray 0.6s ease' }}
          />
        </svg>

        {/* Center percentage label */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <span style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'Outfit', color: 'var(--text-main)', lineHeight: 1 }}>
            {resolvedPct}%
          </span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Resolved
          </span>
        </div>
      </div>

      {/* Legend list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 14, height: 14, borderRadius: 4, background: '#059669', display: 'inline-block' }}></span>
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>Resolved Cases</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{resolvedCount} requests ({resolvedPct}%)</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 14, height: 14, borderRadius: 4, background: '#d97706', display: 'inline-block' }}></span>
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>Active / Open Cases</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{openCount} requests ({openPct}%)</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 14, height: 14, borderRadius: 4, background: 'var(--brand-navy)', display: 'inline-block' }}></span>
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>Total Registered</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{totalCount} total cases</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Category Breakdown Bar Chart
export function CategoryBarChart({ categories = [] }) {
  const maxCount = Math.max(...categories.map(c => c.count), 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {categories.map((cat, idx) => {
        const pct = Math.round((cat.count / maxCount) * 100);
        return (
          <div key={cat.category_id || idx}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: '0.84rem' }}>
              <span style={{ fontWeight: 600 }}>{cat.category_name}</span>
              <span style={{ color: 'var(--text-muted)' }}>
                <strong>{cat.count}</strong> reports ({cat.resolved_count || 0} resolved)
              </span>
            </div>
            <div style={{ width: '100%', height: 10, background: 'var(--bg-card-subtle)', borderRadius: 5, overflow: 'hidden' }}>
              <div
                style={{
                  width: `${pct}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, var(--brand-emerald), #059669)',
                  borderRadius: 5,
                  transition: 'width 0.5s ease'
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
