import React from 'react';

const styles = {
  container: {
    position: 'fixed', bottom: 24, right: 24,
    zIndex: 200, display: 'flex', flexDirection: 'column', gap: 8,
    pointerEvents: 'none',
  },
  toast: {
    padding: '12px 18px',
    borderRadius: 'var(--radius-full)',
    fontSize: '.88rem', fontWeight: 600,
    display: 'flex', alignItems: 'center', gap: 8,
    boxShadow: 'var(--shadow-md)',
    maxWidth: 320,
    animation: 'toastIn .3s cubic-bezier(.34,1.4,.64,1) forwards',
  },
};

const typeStyles = {
  success: { background: 'var(--teal-700)', color: 'var(--white)' },
  error:   { background: 'var(--danger)',   color: 'var(--white)' },
  info:    { background: 'var(--warm-800)', color: 'var(--white)' },
};

export default function ToastContainer({ toasts }) {
  return (
    <>
      <style>{`
        @keyframes toastIn {
          from { opacity:0; transform:translateY(16px) scale(.9); }
          to   { opacity:1; transform:translateY(0)    scale(1); }
        }
      `}</style>
      <div style={styles.container}>
        {toasts.map(t => (
          <div key={t.id} style={{ ...styles.toast, ...(typeStyles[t.type] || typeStyles.info) }}>
            <span>{t.type === 'success' ? '✅' : t.type === 'error' ? '❌' : 'ℹ️'}</span>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </>
  );
}
