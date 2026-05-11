import React, { useState, useEffect } from 'react';

export function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 2500);
    return () => clearTimeout(t);
  }, [onClose]);

  const bg = type === 'success' ? '#166534' : type === 'error' ? '#dc2626' : '#f59e0b';
  return (
    <div style={{
      position: 'fixed', bottom: '90px', left: '50%', transform: 'translateX(-50%)',
      background: bg, color: 'white', padding: '10px 20px', borderRadius: '50px',
      fontSize: '0.875rem', fontWeight: 600, zIndex: 9999, whiteSpace: 'nowrap',
      boxShadow: '0 4px 16px rgba(0,0,0,0.25)', animation: 'fadeInUp 0.3s ease'
    }}>
      {message}
    </div>
  );
}

export function ToastContainer() {
  const { toast } = React.useContext(require('./AppContext').AppContext);
  if (!toast) return null;
  return null; // Rendered inside AppProvider
}
