import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MapPanel from './components/MapPanel';
import ItemModal from './components/ItemModal';
import Toast from './components/Toast';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useToast } from './hooks/useToast';
import { uid, itemEmoji } from './utils';

const EMPTY_FORM = { name: '', desc: '', photoDataUrl: null, pendingPin: null };

export default function App() {
  /* ── Persisted state ── */
  const [items, setItems]   = useLocalStorage('hf_items_v3', []);
  const [mapSrc, setMapSrcRaw] = useLocalStorage('hf_map_v3', null);

  /* Wrap setMapSrc so null clears localStorage properly */
  const setMapSrc = useCallback((val) => setMapSrcRaw(val), [setMapSrcRaw]);

  /* ── UI state ── */
  const [activeTab, setActiveTab]       = useState('search');
  const [searchQuery, setSearchQuery]   = useState('');
  const [highlightedId, setHighlightedId] = useState(null);
  const [modalItem, setModalItem]       = useState(null);
  const [formState, setFormState]       = useState(EMPTY_FORM);

  const { toasts, showToast } = useToast();

  /* ── Handle save submission triggered from AddItemPanel ── */
  useEffect(() => {
    if (!formState._submit) return;
    const { name, desc, photoDataUrl, pendingPin } = formState;
    if (!name.trim() || !pendingPin) return;

    const newItem = {
      id:    uid(),
      name:  name.trim(),
      desc:  desc.trim(),
      photo: photoDataUrl,
      x:     pendingPin.x,
      y:     pendingPin.y,
      saved: new Date().toISOString(),
      emoji: itemEmoji(name),
    };

    setItems(prev => [newItem, ...prev]);
    setFormState(EMPTY_FORM);
    showToast(`"${newItem.name}" saved to your map!`);
    setActiveTab('search');
    // highlight after tab switch
    setTimeout(() => highlightItem(newItem.id), 400);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState._submit]);

  /* ── Highlight an item on map ── */
  const highlightItem = useCallback((id) => {
    setHighlightedId(id);
    setTimeout(() => setHighlightedId(prev => prev === id ? null : prev), 4000);
  }, []);

  /* ── Delete item ── */
  const handleDelete = useCallback((id) => {
    const item = items.find(i => i.id === id);
    setItems(prev => prev.filter(i => i.id !== id));
    if (item) showToast(`"${item.name}" removed from map`);
  }, [items, setItems, showToast]);

  /* ── Locate item (from list/modal → highlight on map) ── */
  const handleLocate = useCallback((item) => {
    setActiveTab('search');
    setModalItem(null);
    highlightItem(typeof item === 'string' ? item : item.id);
  }, [highlightItem]);

  /* ── Open modal ── */
  const handleOpenItem = useCallback((item) => {
    setModalItem(item);
    highlightItem(item.id);
  }, [highlightItem]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Header itemCount={items.length} />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          items={items}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          highlightedId={highlightedId}
          onOpenItem={handleOpenItem}
          onLocateItem={handleLocate}
          onDeleteItem={handleDelete}
          formState={formState}
          setFormState={setFormState}
          mapLoaded={!!mapSrc}
        />

        <MapPanel
          mapSrc={mapSrc}
          setMapSrc={setMapSrc}
          items={items}
          highlightedId={highlightedId}
          activeTab={activeTab}
          formState={formState}
          setFormState={setFormState}
          searchQuery={searchQuery}
          onPinClick={handleOpenItem}
        />
      </div>

      <ItemModal
        item={modalItem}
        onClose={() => setModalItem(null)}
        onLocate={handleLocate}
        onDelete={handleDelete}
      />

      <Toast toasts={toasts} />
    </div>
  );
}
