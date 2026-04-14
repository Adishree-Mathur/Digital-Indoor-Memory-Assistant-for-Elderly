export const DB_KEY = 'hf_items_v3';
export const MAP_KEY = 'hf_map_v3';

export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function itemEmoji(name = '') {
  const n = name.toLowerCase();
  if (/key|keys/.test(n)) return '🔑';
  if (/glass|spec|reading/.test(n)) return '👓';
  if (/phone|mobile|cell/.test(n)) return '📱';
  if (/wallet|purse|money/.test(n)) return '👛';
  if (/medic|pill|tablet|drug|medicine/.test(n)) return '💊';
  if (/book|diary|journal/.test(n)) return '📖';
  if (/remote|tv|television/.test(n)) return '📺';
  if (/watch|clock/.test(n)) return '⌚';
  if (/bag|handbag|backpack/.test(n)) return '👜';
  if (/pen|pencil/.test(n)) return '✏️';
  if (/card|passport/.test(n)) return '🪪';
  if (/charger|cable|wire/.test(n)) return '🔌';
  if (/umbrella/.test(n)) return '☂️';
  if (/shoe|slipper|sandal/.test(n)) return '👟';
  return '📦';
}
export function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}
