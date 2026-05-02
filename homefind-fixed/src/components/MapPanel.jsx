import React, { useRef, useState, useEffect, useCallback } from 'react';
import { readFileAsDataURL } from '../utils';

/* ── Pin SVG ── */
function PinSVG({ color = 'var(--teal-600)', emoji, size = 28 }) {
  return (
    <svg width={size} height={size * 1.43} viewBox="0 0 28 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 0C6.27 0 0 6.27 0 14c0 9.1 14 26 14 26S28 23.1 28 14C28 6.27 21.73 0 14 0z" fill={color} />
      <circle cx="14" cy="13" r="7" fill="white" fillOpacity="0.9" />
      <text x="14" y="17" textAnchor="middle" fontSize="9">{emoji}</text>
    </svg>
  );
}

/* ── Mode Pill ── */
function ModePill({ mode, text }) {
  const colors = {
    idle:      { bg: 'var(--warm-100)',  color: 'var(--warm-600)' },
    placing:   { bg: 'var(--amber-100)', color: 'var(--amber-700)' },
    searching: { bg: 'var(--teal-100)',  color: 'var(--teal-700)' },
    found:     { bg: '#E4F8E4',          color: '#1A6B2A' },
  };
  const c = colors[mode] || colors.idle;
  return (
    <div style={{
      ...c, display: 'flex', alignItems: 'center', gap: '7px',
      padding: '7px 16px', borderRadius: 'var(--radius-full)',
      fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.03em',
      animation: mode === 'placing' ? 'pill-pulse 1.8s ease-in-out infinite' : 'none',
    }}>
      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'currentColor' }} />
      {text}
    </div>
  );
}

export default function MapPanel({
  mapSrc, setMapSrc,
  items, highlightedId,
  activeTab, formState, setFormState,
  searchQuery,
}) {
  const fileInputRef  = useRef(null);
  const mapInnerRef   = useRef(null);
  const mapImageRef   = useRef(null);
  const [tooltip, setTooltip]   = useState({ visible: false, x: 0, y: 0, text: '' });
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0, visible: false });
  const [highlightAnim, setHighlightAnim] = useState(null);

  /* Trigger pin-bounce animation when highlightedId changes */
  useEffect(() => {
    if (highlightedId) {
      setHighlightAnim(highlightedId);
      const t = setTimeout(() => setHighlightAnim(null), 2000);
      return () => clearTimeout(t);
    }
  }, [highlightedId]);

  /* Load map file */
  const handleMapFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    try {
      const src = await readFileAsDataURL(file);
      setMapSrc(src);
    } catch (err) { console.error(err); }
  };

  const handleFileChange = (e) => handleMapFile(e.target.files[0]);

  const handleDragOver = (e) => { e.preventDefault(); e.currentTarget.classList?.add('dragover'); };
  const handleDragLeave = (e) => e.currentTarget.classList?.remove('dragover');
  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList?.remove('dragover');
    handleMapFile(e.dataTransfer.files[0]);
  };

  /* Map click → place pin */
  const handleMapClick = useCallback((e) => {
    if (activeTab !== 'add' || !mapSrc) return;
    const img = mapImageRef.current;
    if (!img) return;
    const imgRect  = img.getBoundingClientRect();
    const wrapRect = mapInnerRef.current.getBoundingClientRect();
    const relX = e.clientX - imgRect.left;
    const relY = e.clientY - imgRect.top;
    if (relX < 0 || relY < 0 || relX > imgRect.width || relY > imgRect.height) return;
    const x = parseFloat((relX / imgRect.width  * 100).toFixed(2));
    const y = parseFloat((relY / imgRect.height * 100).toFixed(2));
    setFormState(prev => ({ ...prev, pendingPin: { x, y } }));
  }, [activeTab, mapSrc, setFormState]);

  /* Mouse move for cursor ghost pin */
  const handleMouseMove = useCallback((e) => {
    if (activeTab !== 'add' || !mapSrc) return;
    const rect = mapInnerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setCursorPos({ x: e.clientX - rect.left, y: e.clientY - rect.top, visible: true });
  }, [activeTab, mapSrc]);

  const handleMouseLeave = () => setCursorPos(p => ({ ...p, visible: false }));

  /* Toolbar mode */
  const getMode = () => {
    if (!mapSrc) return { mode: 'idle', hint: 'Upload your home map to get started' };
    if (activeTab === 'add') {
      if (formState.pendingPin) return { mode: 'idle', hint: 'Pin placed! Fill in the details and save.' };
      return { mode: 'placing', hint: '📌 Click anywhere on the map to place the item pin' };
    }
    const q = searchQuery.trim();
    if (q) {
      const matches = items.filter(i => i.name.toLowerCase().includes(q.toLowerCase()));
      if (matches.length) return { mode: 'found', hint: `Found ${matches.length} match${matches.length > 1 ? 'es' : ''} — highlighted on map` };
      return { mode: 'searching', hint: `No results for "${q}"` };
    }
    return { mode: 'idle', hint: 'Click any pin on the map to view item details' };
  };
  const { mode, hint } = getMode();

  const mapCursor = (activeTab === 'add' && mapSrc) ? 'crosshair' : 'default';

  return (
    <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>

      {/* Toolbar */}
      <div style={{
        background: 'var(--white)', borderBottom: '1.5px solid var(--warm-200)',
        padding: '10px 18px', display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0,
      }}>
        <ModePill mode={mode} text={{ idle: 'Ready', placing: 'Placing Pin', searching: 'Searching…', found: 'Item Found!' }[mode]} />
        <div style={{ flex: 1, fontSize: '0.82rem', color: 'var(--warm-500)', fontWeight: 500 }}>{hint}</div>
        {mapSrc && (
          <button
            onClick={() => { if (window.confirm('Change the map? Your saved items are preserved.')) setMapSrc(null); }}
            style={{
              padding: '7px 14px', borderRadius: 'var(--radius-full)',
              border: '1.5px solid var(--warm-200)', background: 'var(--white)',
              fontSize: '0.8rem', fontWeight: 700, color: 'var(--warm-600)',
              cursor: 'pointer', transition: 'all 220ms',
              display: 'flex', alignItems: 'center', gap: '5px',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--teal-400)'; e.currentTarget.style.color = 'var(--teal-600)'; e.currentTarget.style.background = 'var(--teal-50)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--warm-200)'; e.currentTarget.style.color = 'var(--warm-600)'; e.currentTarget.style.background = 'var(--white)'; }}
          >
            🗺️ Change Map
          </button>
        )}
      </div>

      {/* Canvas */}
      <div style={{
        flex: 1, overflow: 'hidden', position: 'relative',
        background: `
          radial-gradient(circle at 20% 80%, rgba(42,158,132,.06) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(235,160,48,.05) 0%, transparent 50%),
          repeating-linear-gradient(0deg, transparent, transparent 31px, rgba(196,168,152,.07) 31px, rgba(196,168,152,.07) 32px),
          repeating-linear-gradient(90deg, transparent, transparent 31px, rgba(196,168,152,.07) 31px, rgba(196,168,152,.07) 32px),
          var(--warm-50)`,
      }}>

        {/* Upload Zone */}
        {!mapSrc && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px',
          }}>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: '3px dashed var(--warm-300)', borderRadius: 'var(--radius-xl)',
                background: 'rgba(255,255,255,.7)', padding: '48px 40px',
                maxWidth: '480px', width: '100%', textAlign: 'center', cursor: 'pointer',
                transition: 'all 220ms',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--teal-400)'; e.currentTarget.style.background = 'rgba(238,249,247,.9)'; e.currentTarget.style.transform = 'scale(1.01)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--warm-300)'; e.currentTarget.style.background = 'rgba(255,255,255,.7)'; e.currentTarget.style.transform = 'scale(1)'; }}
            >
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
              <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🏡</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--teal-800)', marginBottom: '8px' }}>
                Upload Your Home Layout Map
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--warm-500)', lineHeight: 1.6 }}>
                Drag &amp; drop your floor plan or home sketch here,<br />or click to browse your device.
              </div>
              <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
                {['JPG', 'PNG', 'WEBP', 'GIF'].map(f => (
                  <span key={f} style={{
                    padding: '4px 12px', background: 'var(--teal-100)', color: 'var(--teal-700)',
                    borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.04em',
                  }}>{f}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Map with Pins */}
        {mapSrc && (
          <div style={{ width: '100%', height: '100%', overflow: 'auto', position: 'relative' }}>
            <div
              ref={mapInnerRef}
              onClick={handleMapClick}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{ position: 'relative', display: 'inline-block', minWidth: '100%', minHeight: '100%', cursor: mapCursor }}
            >
              <img
                ref={mapImageRef}
                src={mapSrc}
                alt="Home layout map"
                draggable={false}
                style={{ display: 'block', maxWidth: '100%', userSelect: 'none', pointerEvents: 'none' }}
              />

              {/* SVG Pins Layer */}
              <svg
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', pointerEvents: 'none' }}
              >
                {items.map(item => {
                  const isHighlighted = highlightedId === item.id;
                  const isAnim = highlightAnim === item.id;
                  return (
                    <g
                      key={item.id}
                      style={{
                        transform: `translate(${item.x}%, ${item.y}%)`,
                        pointerEvents: 'all',
                        cursor: 'pointer',
                      }}
                    >
                      {/* Ripple ring */}
                      {isHighlighted && (
                        <circle
                          cx="0" cy="0" r="8"
                          fill="rgba(42,158,132,.2)"
                          stroke="var(--teal-400)" strokeWidth="1.5"
                          className="pin-ripple-anim"
                        />
                      )}
                      {/* Pin body */}
                      <g
                        transform="translate(-14, -40)"
                        className={isAnim ? 'pin-bounce' : ''}
                        style={{ transition: 'transform 200ms cubic-bezier(.34,1.56,.64,1)', transformOrigin: '14px 40px' }}
                        onMouseEnter={e => {
                          e.currentTarget.style.transform = 'translate(-14px,-40px) scale(1.25)';
                          const pin = e.currentTarget.closest('g[data-id]') || e.currentTarget.parentElement;
                          setTooltip({ visible: true, x: item.x, y: item.y, text: item.name });
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.transform = 'translate(-14px,-40px) scale(1)';
                          setTooltip(t => ({ ...t, visible: false }));
                        }}
                        onClick={e => { e.stopPropagation(); }}
                      >
                        <path
                          d="M14 0C6.27 0 0 6.27 0 14c0 9.1 14 26 14 26S28 23.1 28 14C28 6.27 21.73 0 14 0z"
                          fill={isHighlighted ? 'var(--amber-500)' : 'var(--teal-600)'}
                        />
                        <circle cx="14" cy="13" r="7" fill="white" fillOpacity="0.85" />
                        <text x="14" y="17" textAnchor="middle" fontSize="9">{item.emoji}</text>
                      </g>
                    </g>
                  );
                })}

                {/* Pending pin (while placing) */}
                {formState.pendingPin && activeTab === 'add' && (
                  <g style={{ transform: `translate(${formState.pendingPin.x}%, ${formState.pendingPin.y}%)`, pointerEvents: 'none' }}>
                    <circle r="16" fill="rgba(235,160,48,.2)" stroke="var(--amber-400)" strokeWidth="2" strokeDasharray="4 2" cx="0" cy="0" />
                    <text x="0" y="5" textAnchor="middle" fontSize="14" fill="var(--amber-600)">📍</text>
                  </g>
                )}
              </svg>

              {/* Cursor ghost pin */}
              {cursorPos.visible && activeTab === 'add' && !formState.pendingPin && (
                <div style={{
                  position: 'absolute',
                  left: `${cursorPos.x}px`,
                  top: `${cursorPos.y}px`,
                  transform: 'translate(-50%, -100%)',
                  pointerEvents: 'none',
                  opacity: 0.7,
                  animation: 'cursor-float 1.2s ease-in-out infinite',
                  zIndex: 20,
                }}>
                  <PinSVG color="var(--amber-400)" emoji="📍" size={30} />
                </div>
              )}

              {/* Tooltip */}
              {tooltip.visible && (
                <div style={{
                  position: 'absolute',
                  left: `${tooltip.x}%`,
                  top: `${tooltip.y}%`,
                  transform: 'translate(-50%, -140%)',
                  background: 'var(--warm-900)', color: 'var(--white)',
                  fontSize: '0.8rem', fontWeight: 600,
                  padding: '6px 12px', borderRadius: 'var(--radius-full)',
                  whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 30,
                }}>
                  {tooltip.text}
                  <div style={{
                    position: 'absolute', top: '100%', left: '50%',
                    transform: 'translateX(-50%)',
                    border: '5px solid transparent', borderTopColor: 'var(--warm-900)',
                  }} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
