import React from 'react';

const styles = {
  header: {
    background: 'var(--teal-800)',
    color: 'var(--white)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    height: '68px',
    flexShrink: 0,
    boxShadow: '0 2px 12px rgba(13,61,56,.3)',
    zIndex: 50,
    position: 'relative',
  },
  brand: { display: 'flex', alignItems: 'center', gap: '12px' },
  logo: {
    width: 42, height: 42,
    background: 'var(--teal-600)',
    borderRadius: 'var(--radius-md)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '22px', flexShrink: 0,
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.5rem', fontWeight: 700,
    letterSpacing: '-.02em', lineHeight: 1,
  },
  subtitle: {
    fontSize: '.72rem', color: 'var(--teal-300)',
    fontWeight: 500, letterSpacing: '.05em',
    textTransform: 'uppercase', marginTop: 2,
  },
  stat: {
    background: 'rgba(255,255,255,.1)',
    border: '1px solid rgba(255,255,255,.15)',
    borderRadius: 'var(--radius-full)',
    padding: '6px 14px',
    fontSize: '.8rem', fontWeight: 600,
    color: 'var(--teal-100)',
    display: 'flex', alignItems: 'center', gap: 6,
  },
};

export default function Header({ itemCount }) {
  return (
    <header style={styles.header}>
      <div style={styles.brand}>
        <div style={styles.logo}>🏠</div>
        <div>
          <div style={styles.title}>HomeFind</div>
          <div style={styles.subtitle}>Spatial Memory Assistant</div>
        </div>
      </div>
      <div style={styles.stat}>
        <span>📦</span>
        <span>{itemCount === 0 ? '0 items saved' : itemCount === 1 ? '1 item saved' : `${itemCount} items saved`}</span>
      </div>
    </header>
  );
}
