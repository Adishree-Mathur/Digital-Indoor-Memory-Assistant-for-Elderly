import React from 'react';
import SearchPanel from './SearchPanel';
import AddItemPanel from './AddItemPanel';

const TAB_STYLES = {
  row: {
    display: 'flex',
    borderBottom: '2px solid var(--warm-100)',
    flexShrink: 0,
  },
  btn: (active) => ({
    flex: 1, padding: '14px 8px',
    fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.03em',
    textTransform: 'uppercase',
    color: active ? 'var(--teal-700)' : 'var(--warm-500)',
    background: active ? 'var(--teal-50)' : 'none',
    border: 'none',
    borderBottom: `3px solid ${active ? 'var(--teal-500)' : 'transparent'}`,
    marginBottom: '-2px',
    transition: 'all 220ms cubic-bezier(.4,0,.2,1)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
    cursor: 'pointer',
  }),
};

export default function Sidebar({
  activeTab, setActiveTab,
  items, searchQuery, setSearchQuery, highlightedId,
  onOpenItem, onLocateItem, onDeleteItem,
  formState, setFormState, mapLoaded,
}) {
  return (
    <aside style={{
      width: '360px', flexShrink: 0,
      background: 'var(--white)',
      borderRight: '1.5px solid var(--warm-200)',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden', zIndex: 10,
    }}>
      {/* Tabs */}
      <div style={TAB_STYLES.row}>
        {[
          { key: 'search', icon: '🔍', label: 'Find Item' },
          { key: 'add',    icon: '➕', label: 'Add Item' },
        ].map(tab => (
          <button
            key={tab.key}
            style={TAB_STYLES.btn(activeTab === tab.key)}
            onClick={() => setActiveTab(tab.key)}
            onMouseEnter={e => { if (activeTab !== tab.key) e.currentTarget.style.background = 'var(--teal-50)'; }}
            onMouseLeave={e => { if (activeTab !== tab.key) e.currentTarget.style.background = 'none'; }}
          >
            <span style={{ fontSize: '1rem' }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Panels */}
      {activeTab === 'search' ? (
        <SearchPanel
          items={items}
          query={searchQuery}
          onQueryChange={setSearchQuery}
          highlightedId={highlightedId}
          onOpen={onOpenItem}
          onLocate={onLocateItem}
          onDelete={onDeleteItem}
        />
      ) : (
        <AddItemPanel
          name={formState.name}
          desc={formState.desc}
          photo={formState.photoDataUrl}
          pendingPin={formState.pendingPin}
          onNameChange={val => setFormState(prev => ({ ...prev, name: val }))}
          onDescChange={val => setFormState(prev => ({ ...prev, desc: val }))}
          onPhotoChange={val => setFormState(prev => ({ ...prev, photoDataUrl: val }))}
          onClear={() => setFormState({ name: '', desc: '', photoDataUrl: null, pendingPin: null })}
          onSave={() => setFormState(prev => ({ ...prev, _submit: Date.now() }))}
          mapLoaded={mapLoaded}
        />
      )}
    </aside>
  );
}
