function KpiCard({ value, label, desc, delay }) {
  return (
    <div className={`bg-surface-variant rounded-2xl p-5 border border-outline text-center animate-[gravityDrop_0.5s_ease_both] transition-all hover:shadow-lg hover:border-primary/30 relative overflow-hidden`} style={{ animationDelay: `${delay * 0.08}s` }}>
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary to-secondary" />
      <div className="text-3xl font-bold text-primary tracking-tight">{value}</div>
      <div className="text-xs text-on-surface-var mt-1.5 font-semibold">{label}</div>
      {desc && <div className="text-xs text-on-surface-dim mt-2 leading-relaxed">{desc}</div>}
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
  const outgoingFromCc = [
    { label: 'CC → Outlet',           number: '08061930323',  dir: 'out' },
    { label: 'Zomato CC → EC CC (Wefit)', number: '8046161960', dir: 'out' },
  ];
  return (
    <div className="flex-1 p-6 md:p-8 animate-[fadeIn_0.18s_ease]">
      <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">Call KPIs & Standards</h1>
      <p className="text-base text-on-surface-var mb-8 leading-relaxed">Call performance metrics and Kaleyra portal guide</p>

      <h2 className="text-xl font-bold text-on-surface mb-5 flex items-center gap-2.5">
        <span className="material-symbols-outlined text-primary">speed</span>
        Call KPIs
        <span className="flex-1 h-px bg-outline" />
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <KpiCard value="≤ 3" label="Rings Before Answer" desc="Max rings allowed before answering" delay={1} />
        <KpiCard value="≤ 4min" label="AHT" desc="Average Handle Time per call" delay={2} />
        <KpiCard value="≥ 80%" label="CSAT" desc="Customer Satisfaction Score" delay={3} />
        <KpiCard value="≤ 3min" label="ACW" desc="After Call Work time" delay={4} />
        <KpiCard value="≤ 2min" label="1st Hold" desc="Maximum first hold duration" delay={5} />
      </div>

      <h2 className="text-xl font-bold text-on-surface mb-5 flex items-center gap-2.5">
        <span className="material-symbols-outlined text-primary">checklist</span>
        Mandatory Call Steps
        <span className="flex-1 h-px bg-outline" />
      </h2>
      <div className="bg-surface-variant rounded-2xl p-5 border border-outline mb-8 animate-[gravityDrop_0.3s_ease_both]">
        <div className="flex gap-2.5 items-start p-3.5 bg-warning/10 text-warning rounded-xl border border-warning/30 mb-4 text-sm">
          <span className="material-symbols-outlined flex-shrink-0">warning</span>
          <span>These MANDATORY steps apply to ALL call types: Own Customer, Zomato, Swiggy, Outlet, DM calls</span>
        </div>
        {[
          { icon: 'badge', step: 'Opening with YOUR own agent name — not generic greeting' },
          { icon: 'favorite', step: 'Sympathy & empathy MUST be present in every interaction' },
          { icon: 'pause', step: 'Proper hold ONLY after customer confirmation — always ask permission first' },
          { icon: 'timer', step: 'First hold: 2 minutes or LESS maximum' },
          { icon: 'record_voice_over', step: 'When returning: ALWAYS say "THANKS FOR BEING ON HOLD"' },
          { icon: 'help', step: 'Further assistance offer + proper professional closing required' },
        ].map((s) => (
          <div key={s.step} className="flex gap-4 py-4 border-b border-outline-var last:border-b-0">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>{s.icon}</span>
            </div>
            <div className="flex-1 text-sm text-on-surface-var leading-relaxed">{s.step}</div>
          </div>
        ))}
      </div>

      {/* ── INCOMING TO CC ── */}
      <h2 className="text-xl font-bold text-on-surface mb-5 flex items-center gap-2.5">
        <span className="material-symbols-outlined text-primary">call_received</span>
        Incoming Calls — Numbers to Identify
        <span className="flex-1 h-px bg-outline" />
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
        {incomingToCc.map(item => (
          <div key={item.label} className="flex items-center gap-3.5 p-4 bg-surface-variant rounded-2xl border border-outline">
            <div className="w-10 h-10 rounded-xl bg-success/12 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-success text-xl">call_received</span>
            </div>
            <div>
              <div className="font-mono font-bold text-base text-on-surface tracking-wide">{item.number}</div>
              <div className="text-xs text-on-surface-var mt-0.5 font-medium">{item.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── OUTGOING FROM CC ── */}
      <h2 className="text-xl font-bold text-on-surface mb-5 flex items-center gap-2.5">
        <span className="material-symbols-outlined text-primary">call_made</span>
        Outgoing Calls — Numbers CC Dials
        <span className="flex-1 h-px bg-outline" />
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        {outgoingFromCc.map(item => (
          <div key={item.label} className="flex items-center gap-3.5 p-4 bg-surface-variant rounded-2xl border border-outline">
            <div className="w-10 h-10 rounded-xl bg-blue-500/12 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[#2196F3] text-xl">call_made</span>
            </div>
            <div>
              <div className="font-mono font-bold text-base text-on-surface tracking-wide">{item.number}</div>
              <div className="text-xs text-on-surface-var mt-0.5 font-medium">{item.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── KALEYRA OUTBOUND BRIDGE ── */}
      <h2 className="text-xl font-bold text-on-surface mb-5 flex items-center gap-2.5">
        <span className="material-symbols-outlined text-primary">phone_forwarded</span>
        Kaleyra Outbound Bridge
        <span className="flex-1 h-px bg-outline" />
      </h2>
      <div className="flex flex-col gap-2 mb-8">
        {outbound.map(o => (
          <div key={o.city} className="flex items-center gap-3 p-3.5 bg-surface-variant rounded-xl border border-outline">
            <span className="material-symbols-outlined text-primary">phone_forwarded</span>
            <div>
              <div className="font-mono font-bold text-primary text-sm">{o.number}</div>
              <div className="text-xs text-on-surface-var">{o.city}</div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-on-surface mb-5 flex items-center gap-2.5">
        <span className="material-symbols-outlined text-primary">dialpad</span>
        Kaleyra Portal
        <span className="flex-1 h-px bg-outline" />
      </h2>
      <div className="bg-surface-variant rounded-2xl p-5 border border-outline mb-4 animate-[gravityDrop_0.3s_ease_both]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-sm font-bold mb-2">Access</div>
            <a href="https://voice.kaleyra.com" target="_blank" rel="noopener noreferrer" className="text-primary font-mono text-sm hover:underline">voice.kaleyra.com</a>
            <div className="text-xs text-on-surface-var mt-2">Agent must be logged in AT ALL TIMES during shift. Toggle Incoming/Outgoing calls ON/OFF from dashboard.</div>
          </div>
          <div>
            <div className="text-sm font-bold mb-2">To Call Swiggy Customer</div>
            {[
              'Step 1: Dial 8047225038 from Kaleyra',
              'Step 2: Dial 9548682405 from your mobile',
              'Note: Customer can only be called in DISPATCHED state',
            ].map((s, i) => <div key={i} className="text-xs text-on-surface-var mb-1.5">{s}</div>)}
          </div>
        </div>
      </div>
    </div>
  );
}
