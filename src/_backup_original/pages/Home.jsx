import { useState, useRef, useEffect } from 'react';

const modules = [
  { id: 'about', icon: '🏢', title: 'About EatClub', desc: '8+ brands, 7 cities, 450+ outlets overview & company mission', color: '#FF5722' },
  { id: 'platform-overview', icon: '🌐', title: 'Platform Guide', desc: 'Live eatclub.in — deals, brands, navigation & customer experience', color: '#FF5722' },
  { id: 'chat-kpis', icon: '💬', title: 'Chat KPIs', desc: 'FRT, AHT, CSAT, FCR performance standards & bonus metrics', color: '#2196F3' },
  { id: 'chat-flows', icon: '📂', title: 'Chat Flows', desc: 'SOPs & decision trees for all chat scenarios (Order, Refund, Delay)', color: '#9C27B0' },
  { id: 'hash-library', icon: '#️⃣', title: 'Hash Library', desc: '180+ canned responses with search & one-click copy functionality', color: '#FF8F00' },
  { id: 'agent-guide', icon: '🤖', title: 'Agent Guide', desc: 'Bot handoff flows, yellow.ai process & agent decision trees', color: '#00BCD4' },
  { id: 'call-kpis', icon: '📞', title: 'Call KPIs', desc: 'Ring limits, AHT, CSAT, hold time standards & call quality audit', color: '#4CAF50' },
  { id: 'call-scripts', icon: '📋', title: 'Call Scripts', desc: 'Professional scripts for every inbound & outbound call scenario', color: '#E91E63' },
  { id: 'cc-templates', icon: '📋', title: 'CC Templates', desc: 'Copy-ready scripts & tags for 30+ complex operational scenarios', color: '#FF5722', isNew: true },
  { id: 'box8', icon: '🍱', title: 'Box8 Portioning', desc: 'Detailed portioning charts for all Box8 items (Indian Home Style)', color: '#FF5722' },
  { id: 'mojo', icon: '🍕', title: 'Mojo / Lean Crust', desc: 'Pizza portioning, toppings, marination charts & side accuracy', color: '#FF8F00' },
  { id: 'tags', icon: '🏷️', title: 'Complaint Tags', desc: '75+ tags with penalties, refund logic and clear examples', color: '#795548' },
  { id: 'resolution', icon: '⚡', title: 'Resolution Flows', desc: 'Step-by-step issue resolution guides for tech, delivery & food', color: '#FF9800' },
  { id: 'ratings', icon: '⭐', title: 'Rating Logic', desc: 'Rating rules, blank feedback, triggers & NPS standards', color: '#FFC107' },
  { id: 'escalation', icon: '🚨', title: 'Escalation Matrix', desc: 'L1 to L4 escalation levels, triggers & stakeholder contacts', color: '#F44336' },
  { id: 'refunds', icon: '💰', title: 'Refunds & Compensation', desc: 'Refund authority, methods, N-1 logic & compensation rules', color: '#4CAF50' },
  { id: 'refunds-master', icon: '📊', title: 'Refund Master Sheet', desc: '75+ tags with exact refund amounts & approved methods', color: '#3F51B5', isNew: true },
  { id: 'yellow-ai', icon: '🤖', title: 'Yellow.ai Inbox', desc: 'Bot reference, manual takeover & dashboard navigation', color: '#607D8B' },
  { id: 'cheat-sheet', icon: '📌', title: 'Cheat Sheet', desc: 'Quick reference for KPIs, emergency numbers & fast decisions', color: '#9E9E9E' },
  { id: 'quiz', icon: '🧠', title: 'Knowledge Quiz', desc: 'Test your training performance — 30 questions, 80% to pass', color: '#673AB7' },
];

const phonesIn = [
  { label: 'Swiggy CC → EC CC', number: '08068172526', icon: 'delivery_dining' },
  { label: 'DM → CC', number: '02067325678', icon: 'local_shipping' },
  { label: 'Outlet → CC', number: '01161191678', icon: 'storefront' },
  { label: 'Zomato CX → CC', number: '08061970384', icon: 'delivery_dining' },
  { label: 'Dunzo CC → EC CC', number: '01140051349', icon: 'delivery_dining' },
  { label: 'Own CX → CC', number: '1140052747', icon: 'person' },
  { label: 'Zomato CC (Alt 1)', number: '02067325662', icon: 'delivery_dining' },
  { label: 'Zomato CC (Alt 2)', number: '01161191747', icon: 'delivery_dining' },
  { label: 'Swiggy Customer', number: '8046161076', icon: 'delivery_dining' },
];

const phonesOut = [
  { label: 'CC → Outlet', number: '08061930323', icon: 'call_made' },
  { label: 'Zomato CC → EC CC (Wefit)', number: '8046161960', icon: 'call_made' },
];

const videos = [
  { title: 'Training Part-1', duration: '1:04:02', url: 'https://drive.google.com/file/d/1awvlsKQI2RS2lFuSUbLlHlble3DpiG2C/view' },
  { title: 'Training Part-2', duration: '0:22:48', url: 'https://drive.google.com/file/d/1vm8dwKzKPgyzLOA6vTqY9cbLboPS01E8/view' },
  { title: 'Training Part-3 (Day 2)', duration: '0:41:03', url: 'https://drive.google.com/file/d/1XpU3YTNR0IXfjaoCWTyDzQIOnFVBO2NU/view' },
  { title: 'Training Part-4 (Day 2)', duration: '0:25:39', url: 'https://drive.google.com/file/d/1Gbi5tvpJ5r0dH35AnsDGXFsvDo7fLTbn/view' },
];

const tabs = [
  { label: 'Web WhatsApp', url: 'https://web.whatsapp.com/', icon: 'chat' },
  { label: 'Outlet Current Status', url: 'https://tinyurl.com/yfh6ypdp', icon: 'storefront' },
  { label: 'Employee Check-in', url: 'https://tinyurl.com/33af2c4m', icon: 'how_to_reg' },
  { label: 'Critical Assets Sheet', url: 'https://tinyurl.com/yxa5e8wr', icon: 'warning' },
  { label: 'SaaS Dashboard', url: 'https://saas.box8.co.in', icon: 'dashboard' },
  { label: 'Kaleyra (Calls)', url: 'https://voice.kaleyra.com', icon: 'call' },
  { label: 'Inventory Check', url: 'https://tinyurl.com/4j3t724b', icon: 'inventory' },
];

const brands = [
  { icon: '🍛', name: 'BOX8', cuisine: 'Indian Home-Style Meals', color: '#FF5722', url: 'https://eatclub.in/box8' },
  { icon: '🍕', name: 'MOJO Pizza', cuisine: 'Pizza & Italian', color: '#FF8F00', url: 'https://eatclub.in/mojo-pizza' },
  { icon: '🥗', name: 'Lean Crust', cuisine: 'Thin Crust Health Pizza', color: '#43A047', url: 'https://eatclub.in/lean-crust' },
  { icon: '🍚', name: 'Itminaan Biryani', cuisine: 'Dum Biryani Specialists', color: '#9C27B0', url: 'https://eatclub.in/itminaan-biryani' },
  { icon: '🥘', name: 'ZAZA Mughal', cuisine: 'Mughlai & Biryani', color: '#795548', url: 'https://eatclub.in' },
  { icon: '🍖', name: '1881 Biryani', cuisine: 'Heritage Biryani Brand', color: '#E91E63', url: 'https://eatclub.in' },
  { icon: '🥗', name: 'WeFit', cuisine: 'Healthy Protein Bowls', color: '#00BCD4', url: 'https://eatclub.in' },
  { icon: '🧃', name: 'The Local Press', cuisine: 'Juices & Wellness Meals', color: '#8BC34A', url: 'https://eatclub.in' },
];

const auditLinks = [
  { label: 'Tagging & Order Details', url: 'https://auditui.box8.co.in/cc_drill_ui', icon: 'fact_check' },
  { label: 'Checked-in Employees', url: 'https://auditui.box8.co.in/checked_in', icon: 'badge' },
  { label: 'DM Tracker (Delivery)', url: 'https://auditui.box8.co.in/dm_tracker', icon: 'distance' },
];

const usps = [
  { icon: 'local_offer', label: 'Flat 30% OFF', sub: 'Every single order', color: '#FF5722' },
  { icon: 'local_shipping', label: '₹0 Delivery', sub: 'Always. No minimum', color: '#2196F3' },
  { icon: 'inventory_2', label: '₹0 Packaging', sub: 'No hidden charges', color: '#4CAF50' },
  { icon: 'account_balance', label: '₹0 Platform Fee', sub: 'Unlike competitors', color: '#9C27B0' },
  { icon: 'schedule', label: '38 Min Delivery', sub: 'Avg delivery time', color: '#FF8F00' },
  { icon: 'nights_stay', label: 'Open till 3 AM', sub: 'Late night delivery', color: '#00BCD4' },
];

export default function Home({ navigate }) {
  const [copiedNumber, setCopiedNumber] = useState(null);
  const [hoveredBrand, setHoveredBrand] = useState(null);

  const openPopup = (url, title) => {
    const w = Math.min(window.innerWidth * 0.95, 1400);
    const h = Math.min(window.innerHeight * 0.95, 900);
    const left = (window.innerWidth - w) / 2;
    const top = (window.innerHeight - h) / 2;
    window.open(url, title, `width=${w},height=${h},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes`);
  };

  const copyNumber = async (number) => {
    try {
      await navigator.clipboard.writeText(number);
      setCopiedNumber(number);
      setTimeout(() => setCopiedNumber(null), 2000);
    } catch { /* clipboard not available */ }
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[var(--color-primary)] via-pink-600 to-orange-500 rounded-3xl p-12 mb-8 text-white overflow-hidden animate-fade-in"
           style={{ backgroundSize: '300% 300%', animation: 'gradient 8s ease infinite' }}>
        <div className="absolute right-0 top-0 text-[160px] opacity-5 pointer-events-none rotate-12">🍕</div>
        <div className="absolute right-32 bottom-0 text-[100px] opacity-5 pointer-events-none -rotate-10">🍱</div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-xs font-bold uppercase tracking-widest mb-4 border border-white/20">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            EatClub CC Training Portal
          </div>
          
          <h1 className="text-4xl font-extrabold mb-3 leading-tight">EatClub CC Training Hub</h1>
          <p className="text-lg opacity-90 max-w-xl mb-6">
            Complete Customer Care reference for <span className="text-yellow-300 font-bold">8+ brands · 7 cities · 450+ outlets</span>.
            Everything you need to handle every call, chat, and escalation.
          </p>
          
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Refund Master Sheet', icon: 'table_chart', page: 'refunds-master' },
              { label: 'Hash Library', icon: 'tag', page: 'hash-library' },
              { label: 'Take the Quiz', icon: 'quiz', page: 'quiz' },
            ].map(btn => (
              <button key={btn.page} onClick={() => navigate(btn.page)}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 border border-white/30 backdrop-blur-sm text-sm font-bold hover:bg-white/20 hover:-translate-y-0.5 transition shadow-lg">
                <span className="material-symbols-outlined">{btn.icon}</span>
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="material-symbols-outlined text-2xl text-[var(--color-primary)]">monitoring</span>
          <h2 className="text-xl font-bold text-[var(--color-text)]">Platform at a Glance</h2>
          <span className="badge badge-primary">6 metrics</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            ['450+', 'Outlets', 'storefront', '#FF5722'],
            ['7', 'Cities', 'location_city', '#2196F3'],
            ['8+', 'Brands', 'restaurant', '#4CAF50'],
            ['20', 'Modules', 'grid_view', '#9C27B0'],
            ['180+', 'Templates', 'tag', '#FF8F00'],
            ['75+', 'Tags', 'label', '#00BCD4'],
          ].map(([num, label, icon, color]) => (
            <div key={label} className="bg-[var(--color-surface)] rounded-2xl p-5 text-center border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: color + '16' }}>
                <span className="material-symbols-outlined text-xl" style={{ color }}>{icon}</span>
              </div>
              <div className="text-3xl font-extrabold bg-gradient-to-r" style={{ backgroundImage: `linear-gradient(135deg, ${color}, ${color}88)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{num}</div>
              <div className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mt-2">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* USPs Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="material-symbols-outlined text-2xl text-[var(--color-primary)]">verified</span>
          <h2 className="text-xl font-bold text-[var(--color-text)]">Why Customers Choose EatClub</h2>
          <span className="badge badge-primary">6 reasons</span>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {usps.map((u) => (
            <div key={u.label} className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:-translate-y-1 transition-all duration-300" style={{ borderLeftWidth: '4px', borderLeftColor: u.color }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: u.color + '14' }}>
                <span className="material-symbols-outlined text-2xl" style={{ color: u.color }}>{u.icon}</span>
              </div>
              <div>
                <div className="font-bold text-[var(--color-text)]">{u.label}</div>
                <div className="text-sm text-[var(--color-text-muted)]">{u.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Brands Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="material-symbols-outlined text-2xl text-[var(--color-primary)]">restaurant_menu</span>
          <h2 className="text-xl font-bold text-[var(--color-text)]">Brands on EatClub</h2>
          <span className="badge badge-primary">8 brands</span>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
          {brands.map(b => (
            <a key={b.name} href={b.url} target="_blank" rel="noreferrer"
              className="flex-shrink-0 flex flex-col items-center gap-3 p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] min-w-[140px] text-decoration-none hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
              style={{ borderColor: hoveredBrand === b.name ? b.color + '60' : undefined }}
              onMouseEnter={() => setHoveredBrand(b.name)}
              onMouseLeave={() => setHoveredBrand(null)}>
              <div className="text-4xl filter transition">{b.icon}</div>
              <div className="font-bold text-sm text-center" style={{ color: b.color }}>{b.name}</div>
              <div className="text-xs text-[var(--color-text-muted)] text-center">{b.cuisine}</div>
            </a>
          ))}
        </div>
      </div>

      {/* Training Modules Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="material-symbols-outlined text-2xl text-[var(--color-primary)]">grid_view</span>
          <h2 className="text-xl font-bold text-[var(--color-text)]">All Training Modules</h2>
          <span className="badge badge-primary">20 modules</span>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin" style={{ padding: '8px 4px' }}>
          {modules.map((m) => (
            <div key={m.id} onClick={() => navigate(m.id)}
              className="flex-shrink-0 w-72 p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] cursor-pointer hover:-translate-y-2 hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
              style={{ borderColor: 'transparent', boxShadow: `0 0 0 1px ${m.color}20` }}>
              {m.isNew && (
                <div className="absolute top-0 right-4 bg-gradient-to-r from-[var(--color-primary)] to-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-b-xl animate-pulse z-10">NEW</div>
              )}
              <div className="text-4xl mb-3">{m.icon}</div>
              <div className="font-bold text-[var(--color-text)] mb-2">{m.title}</div>
              <div className="text-sm text-[var(--color-text-muted)] line-clamp-2 mb-3">{m.desc}</div>
              <div className="flex items-center gap-1 text-sm font-bold pt-3 border-t border-[var(--color-border)]" style={{ color: m.color }}>
                Open module <span className="material-symbols-outlined text-base">arrow_forward</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Phone Numbers & Videos */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Phone Numbers */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-2xl text-[var(--color-primary)]">phone</span>
            <h2 className="text-xl font-bold text-[var(--color-text)]">Bridge Numbers</h2>
            <span className="badge badge-primary">11 numbers</span>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-sm font-bold text-orange-500 mb-4">
            <span className="material-symbols-outlined">warning</span>
            Save ALL numbers to identify callers instantly!
          </div>

          {[
            { title: 'Incoming Calls', data: phonesIn, color: '#4CAF50', icon: 'call_received' },
            { title: 'Outgoing Calls', data: phonesOut, color: '#2196F3', icon: 'call_made' },
          ].map(group => (
            <div key={group.title} className="rounded-2xl border mb-4 overflow-hidden" style={{ borderColor: group.color + '22', backgroundColor: 'var(--color-surface)' }}>
              <div className="flex items-center gap-3 p-4" style={{ backgroundColor: group.color + '0c', borderBottom: `1px solid ${group.color}18` }}>
                <span className="material-symbols-outlined" style={{ color: group.color }}>{group.icon}</span>
                <span className="font-bold" style={{ color: group.color }}>{group.title}</span>
                <span className="ml-auto text-sm font-bold opacity-70" style={{ color: group.color }}>{group.data.length} numbers</span>
              </div>
              {group.data.map((p, idx) => (
                <div key={p.number} className="flex items-center gap-3 p-4 hover:bg-white/5 transition border-b border-[var(--color-border)] last:border-b-0">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: group.color + '10' }}>
                    <span className="material-symbols-outlined" style={{ color: group.color }}>{p.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-mono font-bold text-[var(--color-text)]">{p.number}</div>
                    <div className="text-sm text-[var(--color-text-muted)]">{p.label}</div>
                  </div>
                  <button onClick={() => copyNumber(p.number)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition" style={{ color: group.color }}>
                    <span className="material-symbols-outlined text-sm">{copiedNumber === p.number ? 'check' : 'content_copy'}</span>
                  </button>
                </div>
              ))}
            </div>
          ))}

          <div className="flex flex-wrap gap-2 mt-4">
            {[
              { href: 'https://cloud.yellow.ai/bot/x1668420084925/inbox/monitor', icon: 'forum', label: 'Yellow.ai Inbox' },
              { href: 'https://dashboard.tawk.to/login#/dashboard', icon: 'mail', label: 'tawk.to Dashboard' },
            ].map(l => (
              <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-surface-light)] border border-[var(--color-border)] text-sm font-bold hover:border-[var(--color-primary)] transition">
                <span className="material-symbols-outlined text-[var(--color-primary)]">{l.icon}</span>
                {l.label}
              </a>
            ))}
          </div>
        </div>

        {/* Training Videos */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-2xl text-[var(--color-primary)]">video_library</span>
            <h2 className="text-xl font-bold text-[var(--color-text)]">Training Videos</h2>
            <span className="badge badge-primary">4 videos</span>
          </div>

          <div className="space-y-3">
            {videos.map((v, idx) => (
              <div key={idx} onClick={() => openPopup(v.url, v.title)}
                className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] cursor-pointer hover:border-[var(--color-primary)] hover:-translate-y-1 transition-all duration-300">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-orange-600 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-white text-2xl">play_arrow</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-[var(--color-text)]">{v.title}</div>
                  <div className="text-sm text-[var(--color-text-muted)]">{v.duration}</div>
                </div>
                <span className="material-symbols-outlined text-[var(--color-primary)]">open_in_new</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Links Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="material-symbols-outlined text-2xl text-[var(--color-primary)]">link</span>
          <h2 className="text-xl font-bold text-[var(--color-text)]">Quick Links</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tabs.map(tab => (
            <a key={tab.label} href={tab.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--color-primary)] transition">
                <span className="material-symbols-outlined text-[var(--color-primary)] group-hover:text-white transition">{tab.icon}</span>
              </div>
              <span className="font-bold text-[var(--color-text)]">{tab.label}</span>
              <span className="ml-auto material-symbols-outlined text-[var(--color-text-muted)]">open_in_new</span>
            </a>
          ))}
        </div>
      </div>

      {/* Audit Tools Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="material-symbols-outlined text-2xl text-[var(--color-primary)]">admin_panel_settings</span>
          <h2 className="text-xl font-bold text-[var(--color-text)]">Audit Tools</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {auditLinks.map(link => (
            <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer"
              className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center gap-3 mb-2">
                <span className="material-symbols-outlined text-[var(--color-primary)]">{link.icon}</span>
                <span className="font-bold text-[var(--color-text)]">{link.label}</span>
              </div>
              <p className="text-sm text-[var(--color-text-muted)]">
                Access live tracking and management tools for outlet operations.
              </p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}