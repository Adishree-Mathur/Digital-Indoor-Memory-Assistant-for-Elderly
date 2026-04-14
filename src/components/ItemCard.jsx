import React from 'react';
import { formatDate } from '../utils';

const s = {
  card: {
    display: 'flex', alignItems: 'center', gap: 12,
    background: 'var(--white)',
    border: '1.5px solid var(--warm-100)',
    borderRadius: 'var(--radius-lg)',
    padding: 12, cursor: 'pointer',
    transition: 'var(--transition)',
    position: 'relative', overflow: 'hidden',
  },
  cardBar: {
    position: 'absolute', left: 0, top: 0, bottom: 0,
    width: 4, borderRadius: '4px 0 0 4px',
    background: 'var(--teal-400)',
  },
  thumb: {
    width: 58, height: 58, borderRadius: 'var(--radius-md)',
    background: 'var(--warm-100)', flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '1.6rem', overflow: 'hidden',
    border: '2px solid var(--warm-200)',
  },
  thumbImg: { width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'calc(var(--radius-md) - 2px)' },
  info: { flex: 1, minWidth: 0 },
  name: {
    fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600,
    color: 'var(--warm-900)', whiteSpace: 'nowrap',
    overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 3,
  },
  note: {
    fontSize: '.78rem', color: 'var(--warm-500)', lineHeight: 1.4,
    display: '-webkit-box', WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical', overflow: 'hidden',
  },
  date: { fontSize: '.7rem', color: 'var(--warm-300)', marginTop: 4, fontWeight: 600 },
  actions: { display: 'flex', flexDirection: 'column', gap: 4 },
  btn: {
    width: 30, height: 30, borderRadius: 'var(--radius-sm)',
    border: 'none', display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontSize: '.9rem',
    transition: 'var(--transition)', cursor: 'pointer',
  },
};

export default function ItemCard({ item, highlighted, onOpen, onLocate, onDelete }) {
  const cardStyle = {
    ...s.card,
    ...(highlighted ? {
      borderColor: 'var(--amber-400)',
      background: 'var(--amber-50)',
      boxShadow: '0 0 0 3px var(--amber-100)',
    } : {}),
  };

  return (
    <div
      style={cardStyle}
      onClick={() => onOpen(item)}
      onMouseEnter={e => {
        if (!highlighted) {
          e.currentTarget.style.borderColor = 'var(--teal-300)';
          e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
          e.currentTarget.style.transform = 'translateX(2px)';
        }
      }}
      onMouseLeave={e => {
        if (!highlighted) {
          e.currentTarget.style.borderColor = 'var(--warm-100)';
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.transform = 'none';
        }
      }}
    >
      {/* Accent bar */}
      <div style={{ ...s.cardBar, opacity: highlighted ? 1 : 0 }} />

      {/* Thumbnail */}
      <div style={s.thumb}>
        {item.photo
          ? <img src={item.photo} alt={item.name} style={s.thumbImg} />
          : item.emoji}
      </div>

      {/* Info */}
      <div style={s.info}>
        <div style={s.name}>{item.name}</div>
        <div style={s.note}>{item.desc || <em>No description</em>}</div>
        <div style={s.date}>Saved {formatDate(item.saved)}</div>
      </div>

      {/* Actions */}
      <div style={s.actions} onClick={e => e.stopPropagation()}>
        <button
          style={{ ...s.btn, background: 'var(--teal-50)', color: 'var(--teal-600)' }}
          title="Show on map"
          onClick={() => onLocate(item.id)}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--teal-100)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--teal-50)'}
        >📍</button>
        <button
          style={{ ...s.btn, background: 'var(--danger-light)', color: 'var(--danger)' }}
          title="Delete"
          onClick={() => onDelete(item.id)}
          onMouseEnter={e => e.currentTarget.style.background = '#fbd5d5'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--danger-light)'}
        >🗑️</button>
      </div>
    </div>
  );
}
