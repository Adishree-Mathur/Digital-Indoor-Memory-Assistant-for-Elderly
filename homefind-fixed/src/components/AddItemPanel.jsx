import React, { useRef } from 'react';

const s = {
  pane: { flex: 1, overflowY: 'auto',
  height: '100%',  padding: '16px 18px 24px', display: 'flex', flexDirection: 'column', gap: 16 },
  stepsRow: { display: 'flex', alignItems: 'center', marginBottom: 4 },
  step: { display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: 4 },
  stepCircle: {
    width: 32, height: 32, borderRadius: '50%',
    background: 'var(--warm-200)', color: 'var(--warm-500)',
    fontSize: '.85rem', fontWeight: 700,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'var(--transition)', position: 'relative', zIndex: 1,
  },
  stepLabel: { fontSize: '.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--warm-400)' },
  stepLine: { flex: 1, height: 2, background: 'var(--warm-200)', marginTop: -22 },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: '.78rem', fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase', color: 'var(--warm-600)', display: 'flex', alignItems: 'center', gap: 6 },
  required: { color: 'var(--danger)' },
  input: {
    width: '100%', padding: '13px 16px',
    border: '2px solid var(--warm-200)', borderRadius: 'var(--radius-md)',
    fontSize: '1rem', fontWeight: 500, color: 'var(--warm-900)',
    background: 'var(--white)', outline: 'none', transition: 'var(--transition)',
  },
  textarea: { minHeight: 88, resize: 'vertical', lineHeight: 1.5 },
  photoArea: {
    position: 'relative', border: '2.5px dashed var(--warm-200)',
    borderRadius: 'var(--radius-lg)', background: 'var(--warm-50)',
    textAlign: 'center', cursor: 'pointer', transition: 'var(--transition)',
    overflow: 'hidden', minHeight: 120,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  photoInput: { position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' },
  photoPlaceholder: { pointerEvents: 'none' },
  photoIcon: { fontSize: '2.2rem', marginBottom: 8, opacity: .6 },
  photoText: { fontSize: '.85rem', fontWeight: 600, color: 'var(--warm-500)' },
  photoSub: { fontSize: '.75rem', color: 'var(--warm-400)', marginTop: 2 },
  photoPreview: { width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 'calc(var(--radius-lg) - 2px)' },
  pinCard: {
    borderRadius: 'var(--radius-md)', padding: '12px 14px',
    display: 'flex', alignItems: 'center', gap: 10,
    border: '2px solid var(--warm-200)', background: 'var(--warm-50)',
    transition: 'var(--transition)',
  },
  pinIcon: { fontSize: '1.5rem', flexShrink: 0 },
  pinText: { flex: 1 },
  pinTitle: { fontSize: '.85rem', fontWeight: 700, color: 'var(--warm-700)' },
  pinSub: { fontSize: '.75rem', color: 'var(--warm-500)', marginTop: 2 },
  btnSave: {
    width: '100%', padding: 16, border: 'none',
    borderRadius: 'var(--radius-full)',
    background: 'var(--teal-600)', color: 'var(--white)',
    fontSize: '1rem', fontWeight: 800, letterSpacing: '.03em',
    transition: 'var(--transition)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', gap: 8,
    boxShadow: '0 4px 16px rgba(21,107,96,.3)',
  },
  btnClear: {
    width: '100%', padding: 12,
    border: '2px solid var(--warm-200)', borderRadius: 'var(--radius-full)',
    background: 'transparent', color: 'var(--warm-500)',
    fontSize: '.9rem', fontWeight: 600, transition: 'var(--transition)',
  },
};

function StepCircleStyle(status) {
  if (status === 'done')   return { background: 'var(--teal-500)', color: 'var(--white)' };
  if (status === 'active') return { background: 'var(--amber-400)', color: 'var(--warm-800)', boxShadow: '0 0 0 4px var(--amber-100)' };
  return {};
}

export default function AddItemPanel({ name, desc, photo, pendingPin, onNameChange, onDescChange, onPhotoChange, onClear, onSave }) {
  const fileRef = useRef();
  const hasName  = name && name.trim().length > 0;
  const hasPhoto = !!photo;
  const hasPin   = !!pendingPin;

  const canSave = hasName && hasPin;

  const stepStatus = (n) => {
    if (n === 1) return hasName ? 'done' : 'active';
    if (n === 2) return hasPhoto ? 'done' : hasName ? 'active' : '';
    if (n === 3) return hasPin ? 'done' : (hasName && hasPhoto) ? 'active' : '';
    if (n === 4) return (hasName && hasPin) ? 'active' : '';
    return '';
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => onPhotoChange(ev.target.result);
    reader.readAsDataURL(file);
  };

  const pinCardStyle = {
    ...s.pinCard,
    ...(hasPin
      ? { borderColor: 'var(--teal-300)', background: 'var(--teal-50)' }
      : { borderColor: 'var(--amber-300)', background: 'var(--amber-50)', animation: 'pinPulse 2s ease-in-out infinite' }
    ),
  };

  return (
    <>
      <style>{`
        @keyframes pinPulse {
          0%,100% { box-shadow: none; }
          50% { box-shadow: 0 0 0 4px var(--amber-100); }
        }
        .field-input-focus:focus {
          border-color: var(--teal-400) !important;
          box-shadow: 0 0 0 3px rgba(42,158,132,.12) !important;
        }
        .photo-area-hover:hover {
          border-color: var(--teal-400) !important;
          background: var(--teal-50) !important;
        }
      `}</style>

      <div style={s.pane}>
        {/* Step indicator */}
        <div style={s.stepsRow}>
          {[1,2,3,4].map((n, i) => (
            <React.Fragment key={n}>
              <div style={s.step}>
                <div style={{ ...s.stepCircle, ...StepCircleStyle(stepStatus(n)) }}>{n}</div>
                <div style={{ ...s.stepLabel, color: stepStatus(n) ? 'var(--teal-600)' : 'var(--warm-400)' }}>
                  {['Name','Photo','Pin','Save'][i]}
                </div>
              </div>
              {n < 4 && <div style={{ ...s.stepLine, background: stepStatus(n) === 'done' ? 'var(--teal-400)' : 'var(--warm-200)' }} />}
            </React.Fragment>
          ))}
        </div>

        {/* Name */}
        <div style={s.field}>
          <label style={s.label}>📝 Item Name <span style={s.required}>*</span></label>
          <input
            style={s.input}
            className="field-input-focus"
            value={name}
            onChange={e => onNameChange(e.target.value)}
            placeholder="e.g. Reading Glasses, House Keys…"
            maxLength={60}
          />
        </div>

        {/* Description */}
        <div style={s.field}>
          <label style={s.label}>📋 Description / Note</label>
          <textarea
            style={{ ...s.input, ...s.textarea }}
            className="field-input-focus"
            value={desc}
            onChange={e => onDescChange(e.target.value)}
            placeholder="e.g. Near the flower pot, in the blue box…"
            maxLength={200}
          />
        </div>

        {/* Photo */}
        <div style={s.field}>
          <label style={s.label}>📷 Photo <small style={{ textTransform: 'none', fontWeight: 500, color: 'var(--warm-300)' }}>(optional)</small></label>
          <div style={photo ? { ...s.photoArea, borderStyle: 'solid', borderColor: 'var(--teal-300)', padding: 0 } : s.photoArea} className="photo-area-hover">
            <input type="file" accept="image/*" capture="environment" style={s.photoInput} ref={fileRef} onChange={handlePhoto} />
            {photo ? (
              <img src={photo} alt="preview" style={s.photoPreview} />
            ) : (
              <div style={s.photoPlaceholder}>
                <div style={s.photoIcon}>📷</div>
                <div style={s.photoText}>Tap to take a photo</div>
                <div style={s.photoSub}>or choose from gallery</div>
              </div>
            )}
          </div>
        </div>

        {/* Pin */}
        <div style={s.field}>
          <label style={s.label}>📍 Mark Location on Map <span style={s.required}>*</span></label>
          <div style={pinCardStyle}>
            <div style={s.pinIcon}>{hasPin ? '✅' : '📌'}</div>
            <div style={s.pinText}>
              <div style={s.pinTitle}>{hasPin ? `Pin placed at ${pendingPin.x}%, ${pendingPin.y}%` : 'Click on the map to place the pin'}</div>
              <div style={s.pinSub}>{hasPin ? 'Click map again to reposition' : 'Switch to map → click the exact location'}</div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <button
          style={canSave ? s.btnSave : { ...s.btnSave, background: 'var(--warm-200)', color: 'var(--warm-400)', boxShadow: 'none', cursor: 'not-allowed' }}
          disabled={!canSave}
          onClick={onSave}
        >
          💾 Save Item to Map
        </button>
        <button style={s.btnClear} onClick={onClear}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--danger)'; e.currentTarget.style.color = 'var(--danger)'; e.currentTarget.style.background = 'var(--danger-light)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--warm-200)'; e.currentTarget.style.color = 'var(--warm-500)'; e.currentTarget.style.background = 'transparent'; }}
        >
          🗑️ Clear Form
        </button>
      </div>
    </>
  );
}
