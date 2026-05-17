import { useState, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { ME_BRANDS, ME_ITEMS, meImgUrl } from '../data/eatclubMenu.js';
import './EatClubMenu.css';

export default function EatClubMenu() {
  const [searchTerm, setSearchTerm] = useState('');                               // transient — not persisted
  const [activeBrand, setActiveBrand] = useLocalStorage('ec_menu_brand', 'box8');
  const [activeCategory, setActiveCategory] = useLocalStorage('ec_menu_cat', 'All');
  const [vegFilter, setVegFilter] = useLocalStorage('ec_menu_veg', 'all');        // 'all' | 'veg' | 'nonveg'


  const handleBrandClick = (brandId) => {
    setActiveBrand(brandId);
    setActiveCategory('All');
    setSearchTerm('');
  };

  const categories = useMemo(() => {
    return ['All', ...new Set(ME_ITEMS.filter(i => i.brand === activeBrand).map(i => i.category))];
  }, [activeBrand]);

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const q = searchTerm.toLowerCase().trim();
    return ME_ITEMS.filter(item => {
      const searchable = [item.name, item.desc, item.brand, item.category, ...item.ingredients, item.portion, item.agent_tip].join(' ').toLowerCase();
      return searchable.includes(q);
    });
  }, [searchTerm]);

  const gridItems = useMemo(() => {
    if (searchTerm.trim()) return [];
    return ME_ITEMS.filter(i =>
      i.brand === activeBrand &&
      (activeCategory === 'All' || i.category === activeCategory) &&
      (vegFilter === 'all' || (vegFilter === 'veg' ? i.veg : !i.veg))
    );
  }, [searchTerm, activeBrand, activeCategory, vegFilter]);

  const vegItems = useMemo(() => gridItems.filter(i => i.veg), [gridItems]);
  const nvItems  = useMemo(() => gridItems.filter(i => !i.veg), [gridItems]);

  const highlightText = (text, query) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? <mark key={i} className="me-hl">{part}</mark> : part
    );
  };

  const ItemCard = ({ item, query = '' }) => {
    const brand = ME_BRANDS.find(b => b.id === item.brand);
    const bc = brand?.color || '#FF5722';
    return (
      <div
        className="me-item-card card"
        style={{ borderLeft: `4px solid ${item.veg ? '#4CAF50' : '#F44336'}` }}
      >
        {/* Image + veg dot */}
        <div className="me-item-img-wrap">
          <img
            className="me-item-img"
            src={meImgUrl(item.image_slug)}
            alt={item.name}
            onError={(e) => { e.currentTarget.style.display='none'; e.currentTarget.nextElementSibling.style.display='flex'; }}
          />
          <div className="me-item-img-fallback" style={{ display: 'none' }}>{brand?.emoji || '🍽️'}</div>
          <span className={`me-item-veg-dot ${item.veg ? 'me-veg' : 'me-nonveg'}`}></span>
        </div>

        <div className="me-item-body">
          {/* Name + category */}
          <div className="me-item-name">{query ? highlightText(item.name, query) : item.name}</div>
          <div className="me-item-cat-tag" style={{ background: `${bc}18`, color: bc }}>{item.category}</div>
          <div className="me-item-desc">{query ? highlightText(item.desc, query) : item.desc}</div>

          {/* Portion — always visible */}
          <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:10, padding:'6px 10px', background:'rgba(var(--md-primary-rgb),0.08)', borderRadius:8 }}>
            <span className="material-symbols-outlined" style={{ fontSize:15, color:'var(--md-primary)', flexShrink:0 }}>scale</span>
            <span style={{ fontSize:13, fontWeight:700, color:'var(--md-primary)' }}>Portion:</span>
            <span style={{ fontSize:13, color:'var(--md-on-surface)' }}>{query ? highlightText(item.portion, query) : item.portion}</span>
          </div>

          {/* Portioning note — always visible if present */}
          {item.portioning_note && (
            <div style={{ display:'flex', alignItems:'flex-start', gap:6, marginTop:6, padding:'6px 10px', background:'rgba(255,152,0,0.08)', borderRadius:8, borderLeft:'3px solid #FF9800' }}>
              <span className="material-symbols-outlined" style={{ fontSize:13, color:'#FF9800', flexShrink:0, marginTop:1 }}>assignment</span>
              <span style={{ fontSize:12, color:'#FF9800' }}>{query ? highlightText(item.portioning_note, query) : item.portioning_note}</span>
            </div>
          )}

          {/* Ingredients */}
          <div style={{ marginTop:10 }}>
            <div style={{ fontSize:11, fontWeight:700, color:'var(--md-on-surface-var)', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:5 }}>🧂 Ingredients</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:4 }}>
              {item.ingredients.map((ing, i) => (
                <span key={i} className="me-ing-tag">{query ? highlightText(ing, query) : ing}</span>
              ))}
            </div>
          </div>

          {/* Agent tip */}
          <div className="me-result-agent-tip" style={{ marginTop:10 }}>
            <span className="material-symbols-outlined" style={{ fontSize:13, color:'var(--md-primary)', flexShrink:0 }}>support_agent</span>
            <span style={{ fontSize:13 }}>{query ? highlightText(item.agent_tip, query) : item.agent_tip}</span>
          </div>

          <a href="https://eatclub.in/menu" target="_blank" rel="noreferrer" className="me-verify-link" style={{ marginTop:10 }}>
            <span className="material-symbols-outlined" style={{ fontSize:13 }}>open_in_new</span>
            View on eatclub.in
          </a>
        </div>
      </div>
    );
  };

  return (
    <div className="page-content" id="page-menu-explorer">

      {/* HERO */}
      <div className="page-header" style={{ animation: 'gravityDrop .45s ease both' }}>
        <div className="ph-chip">Menu Reference · Live Inventory</div>
        <h1 className="ph-title">Menu <em>Explorer</em></h1>
        <p className="ph-sub">
          Brand-wise menu for <strong>Chandivali · Powai</strong>.
          Portioning, ingredients & CC tips — all at a glance. No prices.
        </p>
      </div>

      {/* SEARCH */}
      <div className="me-search-hero" style={{ animation: 'gravityDrop .45s .05s ease both' }}>
        <div className="me-search-wrap">
          <span className="material-symbols-outlined me-search-icon">search</span>
          <input
            type="text" id="meSearchInput"
            placeholder="Search item, ingredient, brand… e.g. 'Dal Makhani', 'Chicken Wings'"
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} autoComplete="off"
          />
          {searchTerm && (
            <button className="me-search-clear" id="meSearchClear" onClick={() => setSearchTerm('')}>
              <span className="material-symbols-outlined">close</span>
            </button>
          )}
        </div>
        <div id="meSearchStats" className="me-search-stats">
          {searchTerm && (searchResults.length ? `${searchResults.length} result${searchResults.length > 1 ? 's' : ''} for "${searchTerm}"` : `No results for "${searchTerm}"`)}
        </div>
      </div>

      {/* SEARCH RESULTS */}
      {searchTerm.trim() && (
        <div id="meSearchResults" className="me-results-panel">
          {searchResults.length === 0 ? (
            <div className="me-empty me-search-empty">
              <span className="material-symbols-outlined" style={{ fontSize: 40, color: 'var(--md-on-surface-var)' }}>search_off</span>
              <div>No items match "<strong>{searchTerm}</strong>"</div>
              <div style={{ fontSize: 12, marginTop: 4 }}>Try brand name, ingredient, or category</div>
            </div>
          ) : (
            <div id="meItemGrid" className="me-item-grid">
              {searchResults.map((item, idx) => (
                <div key={item.id} style={{ animation: `slideUp .3s ${idx * 0.04}s ease both` }}>
                  <ItemCard item={item} query={searchTerm.trim().toLowerCase()} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* BRAND + CATEGORY TABS */}
      {!searchTerm.trim() && (
        <div id="meNavSection">
          {/* Brand tabs */}
          <div className="me-brand-tabs" id="meBrandTabs">
            {ME_BRANDS.map(b => (
              <button key={b.id} className={`me-brand-tab ${activeBrand === b.id ? 'me-brand-tab-active' : ''}`}
                style={{ '--bc': b.color }} onClick={() => handleBrandClick(b.id)}>
                <span className="me-bt-emoji">{b.emoji}</span>
                <span className="me-bt-name">{b.label}</span>
                <span className="me-bt-short">{b.short}</span>
              </button>
            ))}
          </div>

          {/* Category + Veg/NV filter row */}
          <div style={{ display:'flex', gap:8, flexWrap:'wrap', alignItems:'center', marginBottom:16 }}>
            {/* Veg / NV toggle */}
            <div style={{ display:'flex', gap:4, background:'var(--md-surface-2)', borderRadius:8, padding:3 }}>
              {[['all','🍽️ All'], ['veg','🥦 Veg'], ['nonveg','🍗 Non-Veg']].map(([id, label]) => (
                <button key={id}
                  onClick={() => setVegFilter(id)}
                  style={{
                    padding:'5px 12px', borderRadius:6, border:'none', cursor:'pointer',
                    fontFamily:'inherit', fontSize:13, fontWeight:700,
                    background: vegFilter === id ? (id==='veg' ? '#4CAF50' : id==='nonveg' ? '#F44336' : 'var(--md-primary)') : 'transparent',
                    color: vegFilter === id ? '#fff' : 'var(--md-on-surface-var)',
                    transition:'all 0.15s',
                  }}
                >{label}</button>
              ))}
            </div>

            {/* Category chips */}
            <div id="meCategoryNav" className="me-category-nav" style={{ marginBottom:0, flex:1 }}>
              {categories.map(cat => (
                <button key={cat} className={`me-cat-chip ${activeCategory === cat ? 'me-cat-chip-active' : ''}`}
                  onClick={() => setActiveCategory(cat)}>{cat}</button>
              ))}
            </div>
          </div>

          {/* Summary counts */}
          {vegFilter === 'all' && (vegItems.length > 0 || nvItems.length > 0) && (
            <div style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap' }}>
              {vegItems.length > 0 && (
                <div style={{ padding:'6px 14px', borderRadius:20, background:'rgba(76,175,80,0.15)', border:'1.5px solid #4CAF50', color:'#4CAF50', fontWeight:700, fontSize:13 }}>
                  🥦 {vegItems.length} Veg
                </div>
              )}
              {nvItems.length > 0 && (
                <div style={{ padding:'6px 14px', borderRadius:20, background:'rgba(244,67,54,0.15)', border:'1.5px solid #F44336', color:'#F44336', fontWeight:700, fontSize:13 }}>
                  🍗 {nvItems.length} Non-Veg
                </div>
              )}
            </div>
          )}

          {/* ITEM GRID — split veg / nv */}
          {gridItems.length === 0 ? (
            <div className="me-empty">No items in this selection.</div>
          ) : vegFilter !== 'all' ? (
            /* Single filter — normal grid */
            <div id="meItemGrid" className="me-item-grid">
              {gridItems.map((item, idx) => (
                <div key={item.id} style={{ animation: `springPop .35s ${idx * 0.04}s ease both` }}>
                  <ItemCard item={item} />
                </div>
              ))}
            </div>
          ) : (
            /* Both — show veg section then nv section */
            <>
              {vegItems.length > 0 && (
                <div style={{ marginBottom:28 }}>
                  <div style={{
                    display:'flex', alignItems:'center', gap:10, marginBottom:14,
                    padding:'10px 16px', borderRadius:12,
                    background:'rgba(76,175,80,0.12)', border:'2px solid #4CAF50'
                  }}>
                    <span style={{ fontSize:20 }}>🥦</span>
                    <span style={{ fontWeight:800, fontSize:16, color:'#4CAF50', letterSpacing:0.3 }}>VEGETARIAN ITEMS</span>
                    <span style={{ marginLeft:'auto', background:'#4CAF50', color:'#fff', borderRadius:20, padding:'2px 12px', fontSize:13, fontWeight:700 }}>{vegItems.length} items</span>
                  </div>
                  <div id="meItemGrid" className="me-item-grid">
                    {vegItems.map((item, idx) => (
                      <div key={item.id} style={{ animation: `springPop .35s ${idx * 0.04}s ease both` }}>
                        <ItemCard item={item} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {nvItems.length > 0 && (
                <div>
                  <div style={{
                    display:'flex', alignItems:'center', gap:10, marginBottom:14,
                    padding:'10px 16px', borderRadius:12,
                    background:'rgba(244,67,54,0.12)', border:'2px solid #F44336'
                  }}>
                    <span style={{ fontSize:20 }}>🍗</span>
                    <span style={{ fontWeight:800, fontSize:16, color:'#F44336', letterSpacing:0.3 }}>NON-VEG ITEMS</span>
                    <span style={{ marginLeft:'auto', background:'#F44336', color:'#fff', borderRadius:20, padding:'2px 12px', fontSize:13, fontWeight:700 }}>{nvItems.length} items</span>
                  </div>
                  <div className="me-item-grid">
                    {nvItems.map((item, idx) => (
                      <div key={item.id} style={{ animation: `springPop .35s ${idx * 0.04}s ease both` }}>
                        <ItemCard item={item} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

    </div>
  );
}
