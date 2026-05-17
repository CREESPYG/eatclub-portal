function KpiCard({ value, label, desc, delay }) {
  return (
    <div className={`kpi-card anim-delay-${delay}`}>
      <div className="kpi-value">{value}</div>
      <div className="kpi-label">{label}</div>
      {desc && <div className="kpi-desc">{desc}</div>}
    </div>
  );
}

export default function CallKPIs() {
  const outbound = [
    { city: 'Bangalore', number: '8068249383' },
    { city: 'Delhi', number: '1140052747' },
    { city: 'Mumbai/Pune', number: '2245073565' },
    { city: 'Hyderabad/Chennai', number: '4068164959' },
  ];
  // Incoming: calls received BY CC agents
  const incomingToCc = [
    { label: 'Swiggy CC → EC CC',     number: '08068172526',  dir: 'in' },
    { label: 'DM → CC',               number: '02067325678',  dir: 'in' },
    { label: 'Outlet → CC',           number: '01161191678',  dir: 'in' },
    { label: 'Zomato CX → CC',        number: '08061970384',  dir: 'in' },
    { label: 'Dunzo CC → EC CC',      number: '01140051349',  dir: 'in' },
    { label: 'Own CX → CC',           number: '1140052747',   dir: 'in' },
    { label: 'Zomato CC (Alt 1)',      number: '02067325662',  dir: 'in' },
    { label: 'Zomato CC (Alt 2)',      number: '01161191747',  dir: 'in' },
    { label: 'Swiggy Customer',       number: '8046161076',   dir: 'in' },
  ];
  // Outgoing: calls made BY CC agents
  const outgoingFromCc = [
    { label: 'CC → Outlet',           number: '08061930323',  dir: 'out' },
    { label: 'Zomato CC → EC CC (Wefit)', number: '8046161960', dir: 'out' },
  ];
  return (
    <div className="page-content">
      <h1 className="page-title">Call KPIs & Standards</h1>
      <p className="page-subtitle">Call performance metrics and Kaleyra portal guide</p>

      <h2 className="section-title"><span className="material-symbols-outlined" style={{color:'var(--md-primary)'}}>speed</span> Call KPIs</h2>
      <div className="grid-4 mb-32">
        <KpiCard value="≤ 3" label="Rings Before Answer" desc="Max rings allowed before answering" delay={1} />
        <KpiCard value="≤ 4min" label="AHT" desc="Average Handle Time per call" delay={2} />
        <KpiCard value="≥ 80%" label="CSAT" desc="Customer Satisfaction Score" delay={3} />
        <KpiCard value="≤ 3min" label="ACW" desc="After Call Work time" delay={4} />
        <KpiCard value="≤ 2min" label="1st Hold" desc="Maximum first hold duration" delay={5} />
      </div>

      <h2 className="section-title"><span className="material-symbols-outlined" style={{color:'var(--md-primary)'}}>checklist</span> Mandatory Call Steps</h2>
      <div className="card mb-32">
        <div className="alert alert-warning mb-16">
          <span className="alert-icon">warning</span>
          These MANDATORY steps apply to ALL call types: Own Customer, Zomato, Swiggy, Outlet, DM calls
        </div>
        {[
          { icon: 'badge', step: 'Opening with YOUR own agent name — not generic greeting' },
          { icon: 'favorite', step: 'Sympathy & empathy MUST be present in every interaction' },
          { icon: 'pause', step: 'Proper hold ONLY after customer confirmation — always ask permission first' },
          { icon: 'timer', step: 'First hold: 2 minutes or LESS maximum' },
          { icon: 'record_voice_over', step: 'When returning: ALWAYS say "THANKS FOR BEING ON HOLD"' },
          { icon: 'help', step: 'Further assistance offer + proper professional closing required' },
        ].map((s) => (
          <div key={s.step} className="flow-step">
            <div className="flow-num"><span className="material-symbols-outlined" style={{fontSize: 14}}>{s.icon}</span></div>
            <div className="flow-content"><div className="flow-desc">{s.step}</div></div>
          </div>
        ))}
      </div>

      {/* ── INCOMING TO CC ── */}
      <h2 className="section-title"><span className="material-symbols-outlined" style={{color:'var(--md-primary)'}}>call_received</span> Incoming Calls — Numbers to Identify</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '10px', marginBottom: '32px' }}>
        {incomingToCc.map(item => (
          <div key={item.label} className="phone-card" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', background: 'var(--md-surface-variant)', borderRadius: 14, border: '1px solid var(--md-outline)' }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(76,175,80,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span className="material-symbols-outlined" style={{ color: '#4CAF50', fontSize: 20 }}>call_received</span>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 15, color: 'var(--md-on-surface)', letterSpacing: '0.5px' }}>{item.number}</div>
              <div style={{ fontSize: 12, color: 'var(--md-on-surface-var)', marginTop: 2, fontWeight: 500 }}>{item.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── OUTGOING FROM CC ── */}
      <h2 className="section-title"><span className="material-symbols-outlined" style={{color:'var(--md-primary)'}}>call_made</span> Outgoing Calls — Numbers CC Dials</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '10px', marginBottom: '32px' }}>
        {outgoingFromCc.map(item => (
          <div key={item.label} className="phone-card" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', background: 'var(--md-surface-variant)', borderRadius: 14, border: '1px solid var(--md-outline)' }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(33,150,243,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span className="material-symbols-outlined" style={{ color: '#2196F3', fontSize: 20 }}>call_made</span>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 15, color: 'var(--md-on-surface)', letterSpacing: '0.5px' }}>{item.number}</div>
              <div style={{ fontSize: 12, color: 'var(--md-on-surface-var)', marginTop: 2, fontWeight: 500 }}>{item.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── KALEYRA OUTBOUND BRIDGE ── */}
      <div className="grid-2 mb-32">
        <div>
          <h2 className="section-title"><span className="material-symbols-outlined" style={{color:'var(--md-primary)'}}>phone_forwarded</span> Kaleyra Outbound Bridge</h2>
          <div className="col-gap-8">
            {outbound.map(o => (
              <div key={o.city} className="phone-card">
                <span className="phone-icon material-symbols-outlined">phone_forwarded</span>
                <div className="phone-info">
                  <h4>{o.number}</h4>
                  <span>{o.city}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <h2 className="section-title"><span className="material-symbols-outlined" style={{color:'var(--md-primary)'}}>dialpad</span> Kaleyra Portal</h2>
      <div className="card mb-16">
        <div className="grid-2">
          <div>
            <div style={{fontSize: 13, fontWeight: 700, marginBottom: 8}}>Access</div>
            <a href="https://voice.kaleyra.com" target="_blank" rel="noopener noreferrer" style={{color: 'var(--md-primary)', fontFamily: 'var(--font-mono)', fontSize: 13}}>voice.kaleyra.com</a>
            <div style={{fontSize: 12, color: 'var(--md-on-surface-var)', marginTop: 8}}>Agent must be logged in AT ALL TIMES during shift. Toggle Incoming/Outgoing calls ON/OFF from dashboard.</div>
          </div>
          <div>
            <div style={{fontSize: 13, fontWeight: 700, marginBottom: 8}}>To Call Swiggy Customer</div>
            {[
              'Step 1: Dial 8047225038 from Kaleyra',
              'Step 2: Dial 9548682405 from your mobile',
              'Note: Customer can only be called in DISPATCHED state',
            ].map((s, i) => <div key={i} style={{fontSize: 12, color: 'var(--md-on-surface-var)', marginBottom: 6}}>{s}</div>)}
          </div>
        </div>
      </div>
    </div>
  );
}
