import { useState, useCallback, useRef } from 'react';
import { HASH_DATA } from '../data/hashTemplates';
import { useToast } from '../hooks/useToast';

const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'opening', label: 'Opening' },
  { value: 'closing', label: 'Closing' },
  { value: 'apology', label: 'Apology' },
  { value: 'credits', label: 'Credits' },
  { value: 'refund', label: 'Refund' },
  { value: 'cancellation', label: 'Cancellation' },
  { value: 'delivery', label: 'Delivery' },
  { value: 'image', label: 'Image' },
  { value: 'fakecx', label: 'Fake CX' },
  { value: 'escalation', label: 'Escalation' },
  { value: 'product', label: 'Product' },
  { value: 'bill', label: 'Bill' },
  { value: 'code', label: 'Code/Coupon' },
  { value: 'address', label: 'Address' },
  { value: 'tech', label: 'Tech' },
  { value: 'other', label: 'Other' },
];

function highlight(text, query) {
  if (!query) return text;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
  return parts.map((p, i) =>
    p.toLowerCase() === query.toLowerCase() ? <mark key={i}>{p}</mark> : p
  );
}

export default function HashLibrary() {
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState('all');
  const { toasts, show } = useToast();
  const timer = useRef(null);

  const handleSearch = useCallback((val) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setQuery(val), 200);
  }, []);

  const filtered = HASH_DATA.filter(h => {
    const matchQ = !query || h.name.toLowerCase().includes(query.toLowerCase()) || h.text.toLowerCase().includes(query.toLowerCase());
    const matchC = cat === 'all' || h.cat === cat;
    return matchQ && matchC;
  });

  const copyText = (text) => {
    navigator.clipboard.writeText(text).then(() => show('Template copied!', 'success'));
  };

  return (
    <div className="page-content">
      <h1 className="page-title">Hash Templates Library</h1>
      <p className="page-subtitle">Search, browse and copy any of the 180+ chat response templates</p>

      {/* SEARCH & FILTER */}
      <div style={{display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap'}}>
        <div className="search-bar" style={{flex: 1, minWidth: 220}}>
          <span className="search-icon material-symbols-outlined">search</span>
          <input
            className="search-input"
            placeholder="Search templates by name or text..."
            onChange={e => handleSearch(e.target.value)}
          />
        </div>
        <select className="form-select" value={cat} onChange={e => setCat(e.target.value)}>
          {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
      </div>

      <div style={{fontSize: 12, color: 'var(--md-on-surface-var)', marginBottom: 20}}>
        Showing <strong style={{color: 'var(--md-primary)'}}>{filtered.length}</strong> of {HASH_DATA.length} templates
      </div>

      {/* TEMPLATE GRID */}
      <div className="scroll-grid">
        {filtered.map((h, i) => (
          <div key={h.name} className={`hash-card anim-delay-${(i%6)+1}`} onClick={() => copyText(h.text)}>
            <div className="hash-name">{highlight(h.name, query)}</div>
            <div className="hash-text">{highlight(h.text.substring(0, 180) + (h.text.length > 180 ? '…' : ''), query)}</div>
            <div className="hash-footer">
              <span className={`chip chip-${
                h.cat === 'opening' ? 'green' :
                h.cat === 'closing' ? 'blue' :
                h.cat === 'apology' ? 'orange' :
                h.cat === 'credits' || h.cat === 'refund' ? 'primary' :
                h.cat === 'cancellation' ? 'red' :
                h.cat === 'fakecx' ? 'purple' :
                h.cat === 'escalation' ? 'red' :
                'gray'
              }`}>{h.cat}</span>
              <button
                className="btn btn-outline"
                style={{padding: '4px 12px', fontSize: 11}}
                onClick={e => { e.stopPropagation(); copyText(h.text); }}
              >
                <span className="material-symbols-outlined" style={{fontSize: 14}}>content_copy</span>
                Copy
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{gridColumn: '1/-1', textAlign: 'center', padding: '48px 0', color: 'var(--md-on-surface-var)'}}>
            <div style={{fontSize: 48, marginBottom: 12}}>🔍</div>
            <div>No templates found for "<strong>{query}</strong>"</div>
          </div>
        )}
      </div>

      {/* Toast */}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type === 'success' ? 'success' : ''}`}>
            <span className="material-symbols-outlined" style={{fontSize: 16}}>check_circle</span>
            {t.message}
          </div>
        ))}
      </div>
    </div>
  );
}
