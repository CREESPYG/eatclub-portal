export default function Escalation() {
  const levels = [
    { level: 'L1', who: 'CC Agent', color: 'var(--md-tertiary)', triggers: ['Standard complaints — food issues, late order, missing items'], resolution: 'Credits up to ₹100, apology, standard templates' },
    { level: 'L2', who: 'Senior Agent / Team Lead', color: 'var(--md-secondary)', triggers: ['Customer dissatisfied with L1', 'Repeated complaints on same order', 'Refund denied 2+ times', 'BIG4 issues (VegNonVeg/Insect/External/Hair)'], resolution: 'Refund up to ₹200, escalation email to hello@eatclub.in' },
    { level: 'L3', who: 'Manager / Supervisor', color: 'var(--md-primary)', triggers: ['Customer threatening social media', 'Refund > ₹200 needed', 'Outlet manipulation suspected', 'Agent behavioral complaint'], resolution: 'Higher refunds, outlet action, manager callback. Contact: hello@eatclub.in' },
    { level: 'L4', who: 'Operations Head', color: 'var(--md-error)', triggers: ['Legal threat', 'Media escalation', 'Systematic outlet issues', 'Employee misconduct'], resolution: 'Full investigation, policy exception possible' },
  ];
  return (
    <div className="page-content">
      <h1 className="page-title">Escalation Matrix</h1>
      <p className="page-subtitle">4-level escalation framework — who, when, and how to escalate</p>

      <div className="col-gap-8 mb-32">
        {levels.map((l, i) => (
          <div key={l.level} className={`card anim-delay-${i+1}`} style={{borderLeft: `4px solid ${l.color}`}}>
            <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:12}}>
              <div style={{width:48,height:48,borderRadius:12,background:l.color,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:16,color:'white',flexShrink:0}}>{l.level}</div>
              <div><div style={{fontWeight:700,fontSize:16,color:l.color}}>{l.who}</div></div>
            </div>
            <div className="grid-2">
              <div>
                <div style={{fontSize:11,fontWeight:700,color:'var(--md-on-surface-var)',marginBottom:8}}>TRIGGERS</div>
                {l.triggers.map(t=><div key={t} className="dt-node" style={{marginBottom:6,fontSize:12}}>{t}</div>)}
              </div>
              <div>
                <div style={{fontSize:11,fontWeight:700,color:'var(--md-on-surface-var)',marginBottom:8}}>RESOLUTION AUTHORITY</div>
                <div className="dt-node action">{l.resolution}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="section-title">Email Templates for Escalation</h2>
      <div className="card">
        {['#Email EC → "Please drop us an email at hello@eatclub.in for the same. Our team will get in touch with you soon."',
          '#Email - L2 → "We understand your concern. We request you to drop us an email. Our team will try to help you out."',
          '#Email - L3 → "I would request you to drop a mail to hello@eatclub.in for further help."',
          '#Chat Transfer to Supervisor → "Supervisors are busy, will mail to support team at hello@eatclub.in."',
        ].map(t => <div key={t} className="dt-node" style={{marginBottom:8,fontSize:12}}><span className="mono" style={{color:'var(--md-primary)'}}>{t.split('→')[0]}</span>→{t.split('→')[1]}</div>)}
      </div>
    </div>
  );
}
