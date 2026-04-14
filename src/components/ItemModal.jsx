import React, { useEffect } from 'react';
import { formatDate } from '../utils';

export default function ItemModal({ item, onClose, onLocate, onDelete }) {
  const open = !!item;

  /* Close on Escape */
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleDelete = () => {
    if (window.confirm(`Delete "${item.name}" from your map?`)) {
      onDelete(item.id);
      onClose();
    }
  };

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(28,20,16,.55)',
        backdropFilter: 'blur(4px)',
        zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
        opacity: open ? 1 : 0,
        pointerEvents: open ? 'all' : 'none',
        transition: 'opacity 250ms',
      }}
    >
      <div style={{
        background: 'var(--white)',
        borderRadius: 'var(--radius-xl)',
        width: '100%', maxWidth: '480px',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-lg)',
        animation: open ? 'fadeSlideIn 300ms cubic-bezier(.34,1.2,.64,1) forwards' : 'none',
      }}>
        {item && (
          <>
            {/* Image */}
            <div style={{
              height: '220px', background: 'var(--warm-100)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden', position: 'relative',
            }}>
              {item.photo ? (
                <>
                  <img
                    src={item.photo}
                    alt={item.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute', bottom: '12px', right: '12px',
                    background: 'rgba(28,20,16,.6)', color: 'white',
                    fontSize: '0.7rem', fontWeight: 700, padding: '4px 10px',
                    borderRadius: 'var(--radius-full)', letterSpacing: '0.04em', textTransform: 'uppercase',
                  }}>
                    📷 Photo
                  </div>
                </>
              ) : (
                <div style={{ fontSize: '4rem', opacity: 0.5 }}>{item.emoji}</div>
              )}
            </div>

            {/* Body */}
            <div style={{ padding: '22px 24px 24px' }}>
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700,
                color: 'var(--warm-900)', marginBottom: '8px',
              }}>
                {item.name}
              </div>

              <div style={{
                fontSize: '0.9rem', color: 'var(--warm-600)', lineHeight: 1.6,
                marginBottom: '16px',
                background: 'var(--warm-50)',
                borderLeft: '3px solid var(--teal-400)',
                padding: '10px 14px',
                borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
              }}>
                {item.desc || <em>No description added.</em>}
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
                {[`📅 ${formatDate(item.saved)}`, `📍 ${item.x}%, ${item.y}%`].map(chip => (
                  <span key={chip} style={{
                    padding: '5px 12px', background: 'var(--warm-100)', color: 'var(--warm-600)',
                    borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700,
                  }}>{chip}</span>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                {/* Locate */}
                <button
                  onClick={() => { onLocate(item.id); onClose(); }}
                  style={{
                    flex: 1, padding: '12px 16px', border: 'none',
                    borderRadius: 'var(--radius-full)', background: 'var(--teal-600)',
                    color: 'var(--white)', fontSize: '0.9rem', fontWeight: 700,
                    cursor: 'pointer', transition: 'background 220ms',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--teal-700)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--teal-600)'}
                >
                  📍 Show on Map
                </button>

                {/* Close */}
                <button
                  onClick={onClose}
                  style={{
                    flex: 1, padding: '12px 16px', border: 'none',
                    borderRadius: 'var(--radius-full)', background: 'var(--warm-100)',
                    color: 'var(--warm-700)', fontSize: '0.9rem', fontWeight: 700,
                    cursor: 'pointer', transition: 'background 220ms',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--warm-200)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--warm-100)'}
                >
                  Close
                </button>

                {/* Delete */}
                <button
                  onClick={handleDelete}
                  style={{
                    padding: '12px 16px', border: 'none',
                    borderRadius: 'var(--radius-full)', background: 'var(--danger-light)',
                    color: 'var(--danger)', fontSize: '0.9rem', fontWeight: 700,
                    cursor: 'pointer', transition: 'background 220ms',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#fbd5d5'}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--danger-light)'}
                >
                  🗑️
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
