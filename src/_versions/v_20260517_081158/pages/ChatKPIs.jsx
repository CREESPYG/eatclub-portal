function KpiCard({ value, label, desc, delay }) {
  return (
    <div className={`kpi-card anim-delay-${delay}`}>
      <div className="kpi-value">{value}</div>
      <div className="kpi-label">{label}</div>
      {desc && <div className="kpi-desc">{desc}</div>}
    </div>
  );
}

export default function ChatKPIs() {
  return (
    <div className="page-content">
      <h1 className="page-title">Chat KPIs & Basics</h1>
      <p className="page-subtitle">Performance standards every chat agent must meet</p>

      <h2 className="section-title"><span className="material-symbols-outlined" style={{color:'var(--md-primary)'}}>speed</span> Key Performance Indicators</h2>
      <div className="grid-3 mb-32">
        <KpiCard value="≤ 10s" label="FRT" desc="First Response Time" delay={1} />
        <KpiCard value="≤ 30s" label="ART" desc="Average Response Time" delay={2} />
        <KpiCard value="≤ 20min" label="AHT" desc="Average Handle Time" delay={3} />
        <KpiCard value="≥ 85%" label="CSAT" desc="Customer Satisfaction Score" delay={4} />
        <KpiCard value="≥ 80%" label="FCR" desc="First Contact Resolution" delay={5} />
        <KpiCard value="4 Max" label="Concurrent Chats" desc="Maximum active chats at once" delay={6} />
      </div>

      <div className="grid-2 mb-32">
        <div>
          <h2 className="section-title"><span className="material-symbols-outlined" style={{color:'var(--md-primary)'}}>rule</span> Key Rules</h2>
          {[
            { icon: 'waving_hand', label: 'Greet with name', desc: '"Hello! I am [Name], How can I help you?"' },
            { icon: 'chat', label: 'Max 4 concurrent chats', desc: 'Never handle more than 4 chats simultaneously' },
            { icon: 'timer', label: 'First response ≤ 10s', desc: 'Always acknowledge chat within 10 seconds' },
            { icon: 'forum', label: 'Average response ≤ 30s', desc: 'Maintain fast back-and-forth replies' },
            { icon: 'find_in_page', label: 'Drill before resolution', desc: 'Use drill templates before jumping to resolution' },
            { icon: 'star', label: 'Always close with rating', desc: 'Send #3 Closing Rating at conversation end' },
          ].map((r) => (
            <div key={r.label} className="flow-step">
              <div className="flow-num"><span className="material-symbols-outlined" style={{fontSize:14}}>{r.icon}</span></div>
              <div className="flow-content">
                <div className="flow-title">{r.label}</div>
                <div className="flow-desc">{r.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <h2 className="section-title"><span className="material-symbols-outlined" style={{color:'var(--md-primary)'}}>login</span> Chat Channel Access</h2>
          <div className="card mb-16">
            <div style={{fontSize: 13, fontWeight: 700, color: 'var(--md-primary)', marginBottom: 12}}>Yellow.ai Inbox (Live Chat)</div>
            <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
              <div className="card-sm">
                <div style={{fontSize: 11, color: 'var(--md-on-surface-var)', marginBottom: 4}}>URL</div>
                <a href="https://cloud.yellow.ai/bot/x1668420084925/inbox/monitor" target="_blank" rel="noopener noreferrer" style={{color: 'var(--md-primary)', fontSize: 12, fontFamily: 'var(--font-mono)'}}>cloud.yellow.ai/inbox</a>
              </div>
            </div>
          </div>

          <div className="card mb-16">
            <div style={{fontSize: 13, fontWeight: 700, color: 'var(--md-on-surface-var)', marginBottom: 12}}>tawk.to (Email Support Only)</div>
            <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
              <div className="card-sm">
                <div style={{fontSize: 11, color: 'var(--md-on-surface-var)', marginBottom: 4}}>Email</div>
                <div className="mono" style={{fontSize: 13}}>pooja.box8@gmail.com</div>
              </div>
              <div className="card-sm">
                <div style={{fontSize: 11, color: 'var(--md-on-surface-var)', marginBottom: 4}}>Password</div>
                <div className="mono" style={{fontSize: 13}}>Pooja@123</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div style={{fontSize: 13, fontWeight: 700, color: 'var(--md-primary)', marginBottom: 12}}>Bot → Human Handoff</div>
            <div style={{fontSize: 12, color: 'var(--md-on-surface-var)', lineHeight: 1.6}}>
              <strong>Platform:</strong> Yellow.ai chatbot → Yellow.ai Inbox<br/>
              <strong>Chatbot CX number:</strong> 020-67325679<br/><br/>
              When bot hands off:
              <ol style={{marginTop: 8, paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 4}}>
                <li>Agent receives chat in Yellow.ai Inbox with full context</li>
                <li>Send <span className="mono" style={{color: 'var(--md-primary)'}}>#1 Hello Custom - L2</span></li>
                <li>Review bot conversation history</li>
                <li>Follow standard resolution flow</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <h2 className="section-title"><span className="material-symbols-outlined" style={{color:'var(--md-primary)'}}>format_list_numbered</span> Standard Chat Closing Sequence</h2>
      <div className="card">
        <div style={{display: 'flex', flexDirection: 'column', gap: 0}}>
          {[
            { hash: '#2 Closing Initiation', text: '"Can I help you with anything else?"' },
            { hash: '#3 Closing Rating', text: '"I hope I\'ve been able to help... please rate this conversation..."' },
            { hash: '#4 Closing Final', text: '"Welcome. Happy to help!"' },
          ].map((step, i) => (
            <div key={step.hash} className="flow-step">
              <div className="flow-num">{i + 1}</div>
              <div className="flow-content">
                <div className="flow-title mono" style={{color: 'var(--md-primary)'}}>{step.hash}</div>
                <div className="flow-desc">{step.text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
