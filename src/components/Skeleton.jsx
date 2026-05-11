import React from 'react';

function SkeletonBox({ w = '100%', h = '16px', r = '8px', style = {} }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: r,
      background: 'linear-gradient(90deg, var(--border-color) 25%, var(--bg-color) 50%, var(--border-color) 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.4s infinite',
      ...style
    }} />
  );
}

export function SkeletonCard() {
  return (
    <div style={{ borderRadius: '16px', overflow: 'hidden', background: 'var(--surface)', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', height: '180px', position: 'relative' }}>
      <SkeletonBox h="180px" r="0" />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <SkeletonBox w="70%" h="14px" />
        <SkeletonBox w="50%" h="10px" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px' }}>
      {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  );
}
