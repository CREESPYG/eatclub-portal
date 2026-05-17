export default function Escalation() {
  const levels = [
    { level: 'L1', who: 'CC Agent', color: 'text-tertiary', bg: 'bg-tertiary', triggers: ['Standard complaints — food issues, late order, missing items'], resolution: 'Credits up to ₹100, apology, standard templates' },
    { level: 'L2', who: 'Senior Agent / Team Lead', color: 'text-secondary', bg: 'bg-secondary', triggers: ['Customer dissatisfied with L1', 'Repeated complaints on same order', 'Refund denied 2+ times', 'BIG4 issues (VegNonVeg/Insect/External/Hair)'], resolution: 'Refund up to ₹200, escalation email to hello@eatclub.in' },
    { level: 'L3', who: 'Manager / Supervisor', color: 'text-primary', bg: 'bg-primary', triggers: ['Customer threatening social media', 'Refund > ₹200 needed', 'Outlet manipulation suspected', 'Agent behavioral complaint'], resolution: 'Higher refunds, outlet action, manager callback. Contact: hello@eatclub.in' },
    { level: 'L4', who: 'Operations Head', color: 'text-error', bg: 'bg-error', triggers: ['Legal threat', 'Media escalation', 'Systematic outlet issues', 'Employee misconduct'], resolution: 'Full investigation, policy exception possible' },
  ];
  return (
    <div className="flex-1 p-6 md:p-8 animate-[fadeIn_0.18s_ease]">
      <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">Escalation Matrix</h1>
      <p className="text-base text-on-surface-var mb-8 leading-relaxed">4-level escalation framework — who, when, and how to escalate</p>

      <div className="flex flex-col gap-3 mb-8">
        {levels.map((l, i) => (
          <div key={l.level} className={`bg-surface-variant rounded-2xl p-5 border border-outline border-l-4 animate-[gravityDrop_0.3s_ease_both]`} style={{ borderLeftColor: `var(--md-${l.level === 'L1' ? 'tertiary' : l.level === 'L2' ? 'secondary' : l.level === 'L3' ? 'primary' : 'error'})` }}>
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-12 h-12 rounded-xl ${l.bg} flex items-center justify-center font-extrabold text-base text-white flex-shrink-0`}>{l.level}</div>
              <div className={`text-base font-bold ${l.color}`}>{l.who}</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-[11px] font-bold text-on-surface-var mb-2 uppercase tracking-wide">TRIGGERS</div>
                {l.triggers.map(t => <div key={t} className="p-2 bg-surface-2 rounded-lg mb-1.5 text-xs text-on-surface border-l-[3px] border-outline">{t}</div>)}
              </div>
              <div>
                <div className="text-[11px] font-bold text-on-surface-var mb-2 uppercase tracking-wide">RESOLUTION AUTHORITY</div>
                <div className="p-2.5 bg-secondary/8 rounded-lg text-sm text-on-surface border-l-[3px] border-secondary">{l.resolution}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-on-surface mb-5 flex items-center gap-2.5">Email Templates for Escalation <span className="flex-1 h-px bg-outline" /></h2>
      <div className="bg-surface-variant rounded-2xl p-5 border border-outline animate-[gravityDrop_0.3s_ease_both]">
        {['#Email EC → "Please drop us an email at hello@eatclub.in for the same. Our team will get in touch with you soon."',
          '#Email - L2 → "We understand your concern. We request you to drop us an email. Our team will try to help you out."',
          '#Email - L3 → "I would request you to drop a mail to hello@eatclub.in for further help."',
          '#Chat Transfer to Supervisor → "Supervisors are busy, will mail to support team at hello@eatclub.in."',
        ].map(t => {
          const [tag, ...rest] = t.split('→');
          return (
            <div key={t} className="p-2.5 bg-surface-2 rounded-lg mb-2 text-xs border-l-[3px] border-primary last:mb-0">
              <span className="font-mono text-primary font-bold">{tag}</span>
              <span className="text-on-surface-var">→{rest.join('→')}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
