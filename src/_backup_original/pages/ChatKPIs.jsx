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

export default function ChatKPIs() {
  return (
    <div className="flex-1 p-6 md:p-8 animate-[fadeIn_0.18s_ease]">
      <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">Chat KPIs & Basics</h1>
      <p className="text-base text-on-surface-var mb-8 leading-relaxed">Performance standards every chat agent must meet</p>

      <h2 className="text-xl font-bold text-on-surface mb-5 flex items-center gap-2.5">
        <span className="material-symbols-outlined text-primary">speed</span>
        Key Performance Indicators
        <span className="flex-1 h-px bg-outline" />
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <KpiCard value="≤ 10s" label="FRT" desc="First Response Time" delay={1} />
        <KpiCard value="≤ 30s" label="ART" desc="Average Response Time" delay={2} />
        <KpiCard value="≤ 20min" label="AHT" desc="Average Handle Time" delay={3} />
        <KpiCard value="≥ 85%" label="CSAT" desc="Customer Satisfaction Score" delay={4} />
        <KpiCard value="≥ 80%" label="FCR" desc="First Contact Resolution" delay={5} />
        <KpiCard value="4 Max" label="Concurrent Chats" desc="Maximum active chats at once" delay={6} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div>
          <h2 className="text-xl font-bold text-on-surface mb-5 flex items-center gap-2.5">
            <span className="material-symbols-outlined text-primary">rule</span>
            Key Rules
            <span className="flex-1 h-px bg-outline" />
          </h2>
          {[
            { icon: 'waving_hand', label: 'Greet with name', desc: '"Hello! I am [Name], How can I help you?"' },
            { icon: 'chat', label: 'Max 4 concurrent chats', desc: 'Never handle more than 4 chats simultaneously' },
            { icon: 'timer', label: 'First response ≤ 10s', desc: 'Always acknowledge chat within 10 seconds' },
            { icon: 'forum', label: 'Average response ≤ 30s', desc: 'Maintain fast back-and-forth replies' },
            { icon: 'find_in_page', label: 'Drill before resolution', desc: 'Use drill templates before jumping to resolution' },
            { icon: 'star', label: 'Always close with rating', desc: 'Send #3 Closing Rating at conversation end' },
          ].map((r) => (
            <div key={r.label} className="flex gap-4 py-4 border-b border-outline-var last:border-b-0">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>{r.icon}</span>
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-on-surface mb-1">{r.label}</div>
                <div className="text-sm text-on-surface-var leading-relaxed">{r.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <h2 className="text-xl font-bold text-on-surface mb-5 flex items-center gap-2.5">
            <span className="material-symbols-outlined text-primary">login</span>
            Chat Channel Access
            <span className="flex-1 h-px bg-outline" />
          </h2>
          <div className="bg-surface-variant rounded-2xl p-5 border border-outline mb-4 animate-[gravityDrop_0.3s_ease_both]">
            <div className="text-sm font-bold text-primary mb-3">Yellow.ai Inbox (Live Chat)</div>
            <div className="bg-surface-2 rounded-xl p-3">
              <div className="text-xs text-on-surface-var mb-1">URL</div>
              <a href="https://cloud.yellow.ai/bot/x1668420084925/inbox/monitor" target="_blank" rel="noopener noreferrer" className="text-primary text-xs font-mono hover:underline">cloud.yellow.ai/inbox</a>
            </div>
          </div>

          <div className="bg-surface-variant rounded-2xl p-5 border border-outline mb-4 animate-[gravityDrop_0.3s_ease_both]">
            <div className="text-sm font-bold text-on-surface-var mb-3">tawk.to (Email Support Only)</div>
            <div className="flex flex-col gap-2">
              <div className="bg-surface-2 rounded-xl p-3">
                <div className="text-xs text-on-surface-var mb-1">Email</div>
                <div className="text-sm font-mono">pooja.box8@gmail.com</div>
              </div>
              <div className="bg-surface-2 rounded-xl p-3">
                <div className="text-xs text-on-surface-var mb-1">Password</div>
                <div className="text-sm font-mono">Pooja@123</div>
              </div>
            </div>
          </div>

          <div className="bg-surface-variant rounded-2xl p-5 border border-outline animate-[gravityDrop_0.3s_ease_both]">
            <div className="text-sm font-bold text-primary mb-3">Bot → Human Handoff</div>
            <div className="text-sm text-on-surface-var leading-relaxed">
              <strong>Platform:</strong> Yellow.ai chatbot → Yellow.ai Inbox<br/>
              <strong>Chatbot CX number:</strong> 020-67325679<br/><br/>
              When bot hands off:
              <ol className="mt-2 pl-4 flex flex-col gap-1 list-decimal">
                <li>Agent receives chat in Yellow.ai Inbox with full context</li>
                <li>Send <span className="font-mono text-primary">#1 Hello Custom - L2</span></li>
                <li>Review bot conversation history</li>
                <li>Follow standard resolution flow</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-on-surface mb-5 flex items-center gap-2.5">
        <span className="material-symbols-outlined text-primary">format_list_numbered</span>
        Standard Chat Closing Sequence
        <span className="flex-1 h-px bg-outline" />
      </h2>
      <div className="bg-surface-variant rounded-2xl p-5 border border-outline animate-[gravityDrop_0.3s_ease_both]">
        <div className="flex flex-col gap-0">
          {[
            { hash: '#2 Closing Initiation', text: '"Can I help you with anything else?"' },
            { hash: '#3 Closing Rating', text: '"I hope I\'ve been able to help... please rate this conversation..."' },
            { hash: '#4 Closing Final', text: '"Welcome. Happy to help!"' },
          ].map((step, i) => (
            <div key={step.hash} className="flex gap-4 py-4 border-b border-outline-var last:border-b-0">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">{i + 1}</div>
              <div className="flex-1">
                <div className="text-sm font-bold font-mono text-primary mb-1">{step.hash}</div>
                <div className="text-sm text-on-surface-var leading-relaxed">{step.text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
