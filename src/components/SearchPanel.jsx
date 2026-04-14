import React from 'react';
import ItemCard from './ItemCard';

const s = {
  searchHeader: {
    padding: '16px 18px 12px',
    background: 'var(--teal-50)',
    borderBottom: '1.5px solid var(--teal-100)',
    flexShrink: 0,
  },
  label: {
    fontFamily: 'var(--font-display)', fontSize: '1rem',
    fontWeight: 600, color: 'var(--teal-800)', marginBottom: 10,
  },
  searchBox: { position: 'relative' },
  icon: {
    position: 'absolute', left: 14, top: '50%',
    transform: 'translateY(-50%)', color: 'var(--teal-400)',
    pointerEvents: 'none', fontSize: '1.1rem',
  },
  input: {
    width: '100%', padding: '13px 16px 13px 44px',
    border: '2px solid var(--warm-200)',
    borderRadius: 'var(--radius-full)',
    fontSize: '1rem', fontWeight: 500,
    color: 'var(--warm-900)', background: 'var(--white)',
    outline: 'none', transition: 'var(--transition)',
  },
  listWrap: { flex: 1, overflowY: 'auto', padding: 12 },
  list: { display: 'flex', flexDirection: 'column', gap: 8 },
  empty: { textAlign: 'center', padding: '40px 20px' },
  emptyIcon: { fontSize: '3.5rem', marginBottom: 12, opacity: .6 },
  emptyTitle: {
    fontFamily: 'var(--font-display)', fontSize: '1.05rem',
    fontWeight: 600, color: 'var(--warm-600)', marginBottom: 6,
  },
  emptySub: { fontSize: '.85rem', color: 'var(--warm-500)', lineHeight: 1.5 },
};

export default function SearchPanel({ items, query, onQueryChange, highlightedId, onOpen, onLocate, onDelete }) {
  const q = (query || "").toLowerCase().trim();
  const filtered = q
    ? items.filter(i =>
        (i.name || "").toLowerCase().includes(q) ||
        (i.desc || '').toLowerCase().includes(q)
      )
    : items;

  return (
    <>
      <div style={s.searchHeader}>
        <div style={s.label}>Where did I put it?</div>
        <div style={s.searchBox}>
          <span style={s.icon}>🔍</span>
          <input
            style={s.input}
            value={query}
            onChange={e => onQueryChange(e.target.value)}
            placeholder="Type item name to find it…"
            autoComplete="off"
            onFocus={e => {
              e.target.style.borderColor = 'var(--teal-400)';
              e.target.style.boxShadow = '0 0 0 3px rgba(42,158,132,.15)';
            }}
            onBlur={e => {
              e.target.style.borderColor = 'var(--warm-200)';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>
      </div>

      <div style={s.listWrap}>
        {filtered.length === 0 ? (
          <div style={s.empty}>
            <div style={s.emptyIcon}>{q ? '🔍' : '🗝️'}</div>
            <div style={s.emptyTitle}>{q ? 'No items found' : 'No items saved yet'}</div>
            <div style={s.emptySub}>
              {q
                ? 'Try a different search term.'
                : 'Upload your home map and add items using the "Add Item" tab.'}
            </div>
          </div>
        ) : (
          <div style={s.list}>
            {filtered.map(item => (
              <ItemCard
                key={item.id}
                item={item}
                highlighted={highlightedId === item.id}
                onOpen={onOpen}
                onLocate={onLocate}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
