import { useState, useCallback, useRef } from 'react';
import { TAGS_DATA } from '../data/tags';

const CATEGORIES = ['All', 'Maker', 'DM', 'Manager', 'Kitchen', 'Critical', 'Other'];

const colorMap = {
  orange: 'chip-primary',
  blue: 'chip-blue',
  purple: 'chip-purple',
  green: 'chip-green',
  red: 'chip-red',
  gray: 'chip-gray',
};

function PenaltyBadge({ penalty, color }) {
  return <span className={`badge badge-${color === 'orange' ? 'orange' : color === 'blue' ? 'blue' : color === 'purple' ? 'purple' : color === 'green' ? 'green' : color === 'red' ? 'red' : 'gray'}`}>{penalty}</span>;
}

export default function Tags() {
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState('All');
  const [expanded, setExpanded] = useState(null);
  const timer = useRef(null);

  const handleSearch = useCallback((val) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setQuery(val), 200);
  }, []);

  const filtered = TAGS_DATA.filter(t => {
    const matchQ = !query || t.name.toLowerCase().includes(query.toLowerCase()) || t.description.toLowerCase().includes(query.toLowerCase()) || t.penalty.toLowerCase().includes(query.toLowerCase());
    const matchC = cat === 'All' || t.category === cat;
    return matchQ && matchC;
  });

  return (
    <div className="page-content">
      <h1 className="page-title">Complaint Tags</h1>
      <p className="page-subtitle">35 tags with penalties, descriptions, and real examples</p>

      {/* Legend */}
      <div className="card mb-24" style={{padding: 16}}>
        <div style={{fontSize: 12, fontWeight: 700, marginBottom: 8, color: 'var(--md-on-surface-var)'}}>PENALTY COLOR GUIDE</div>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: 8}}>
          {[['orange','Maker300 (₹300)'],['gray','Maker (feedback)'],['blue','DM250 (₹250)'],['purple','Manager200/400'],['green','Kitchen'],['red','Critical (₹1000+)']].map(([c,l]) => (
            <span key={c} className={`chip ${colorMap[c]}`}>{l}</span>
          ))}
        </div>
      </div>

      {/* Search & Filter */}
      <div style={{display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap'}}>
        <div className="search-bar" style={{flex: 1, minWidth: 220}}>
          <span className="search-icon material-symbols-outlined">search</span>
          <input className="search-input" placeholder="Search tags..." onChange={e => handleSearch(e.target.value)} />
        </div>
        <select className="form-select" value={cat} onChange={e => setCat(e.target.value)}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div style={{fontSize: 12, color: 'var(--md-on-surface-var)', marginBottom: 20}}>
        Showing <strong style={{color: 'var(--md-primary)'}}>{filtered.length}</strong> of {TAGS_DATA.length} tags
      </div>

      {/* TAGS GRID */}
      <div className="scroll-grid">
        {filtered.map((tag) => (
          <div key={tag.id} className="tag-card">
            <div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8}}>
              <div>
                <div className="tag-name">{tag.name}</div>
                <div style={{display: 'flex', gap: 6, flexWrap: 'wrap'}}>
                  <PenaltyBadge penalty={tag.penalty} color={tag.color} />
                  {tag.imageReq && <span className="badge badge-red">📷 IMAGE REQ</span>}
                </div>
              </div>
              <button className="btn-icon" style={{fontSize: 16}} onClick={() => setExpanded(expanded === tag.id ? null : tag.id)}>
                <span className="material-symbols-outlined">{expanded === tag.id ? 'expand_less' : 'expand_more'}</span>
              </button>
            </div>
            <div className="tag-desc">{tag.description}</div>
            {tag.rules && <div className="tag-rule">{tag.rules}</div>}
            {expanded === tag.id && (
              <div className="tag-examples">
                <div style={{fontSize: 11, fontWeight: 700, color: 'var(--md-on-surface-var)', marginBottom: 6}}>EXAMPLES</div>
                {tag.examples.map((ex, i) => (
                  <div key={i} className="tag-example">{ex}</div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
