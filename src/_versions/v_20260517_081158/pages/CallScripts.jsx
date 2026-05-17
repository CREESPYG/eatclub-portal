export default function CallScripts() {
  const scripts = [
    {
      title: 'Script 1: Order Identification',
      items: [
        { sub: 'When CUSTOMER calls', steps: ['SAAS → Order Intake → Select Brand → Enter customer number → Search', 'Check Running Orders (current) and Completed Orders (past)'] },
        { sub: 'When OUTLET/DM calls', steps: ['SAAS → Tracker → Select Outlet', 'Outlet call: Status = Received', 'DM call: Status = Dispatched → find by DM name'] },
      ]
    },
    {
      title: 'Script 2: Hold Protocol',
      items: [
        { sub: 'BEFORE putting on hold', steps: ['"May I put you on hold for 1-2 minutes while I check this for you?"', '[Wait for customer consent — mandatory]'] },
        { sub: 'WHEN returning from hold', steps: ['"Thank you for being on hold, [Customer Name]."', '"I\'ve checked your order and here\'s what I found..."', 'Time limit: 2 minutes maximum first hold'] },
        { sub: 'If need more time', steps: ['"I apologize, I need just 1 more minute. Thank you for your patience."'] },
      ]
    },
    {
      title: 'Script 3: Angry Customer',
      steps: [
        'Step 1: Let them speak — do NOT interrupt',
        'Step 2: Acknowledge: "I completely understand how frustrating this must be..."',
        'Step 3: Empathize: "I\'m really sorry you had to go through this..."',
        'Step 4: Take ownership: "I\'m going to personally make sure this gets resolved..."',
        'Step 5: Provide solution',
        'Step 6: Confirm resolution: "Is there anything else I can help you with?"',
        'Step 7: Close professionally',
      ]
    },
    {
      title: 'Script 4: Transfer Protocol',
      items: [
        { sub: 'Warm Transfer (to supervisor)', steps: ['"I\'m going to connect you with my supervisor who will be better able to assist you. Please hold for just a moment."', '[Brief the supervisor BEFORE connecting customer]'] },
        { sub: 'Cold Transfer (technical issues)', steps: ['"I need to transfer you to our [department] team. Please hold and they will assist you shortly."'] },
      ]
    },
  ];

  const outletDm = [
    { title: 'Order Transfer Request', steps: [
      'Check KML Maps: outlet → customer distance',
      'Distance ≤ 6 km: same DM can deliver (if dispatched state)',
      'Use Reroute option in SAAS',
    ]},
    { title: 'Address Change Request', steps: [
      'Allowed ONLY if: New address is in SAME outlet\'s delivery zone',
      'Order must be in DISPATCHED state',
    ]},
    { title: 'Mark Order Delivered', steps: [
      'Use when DM couldn\'t mark via app due to location issues',
      'Action: Mark delivered from SAAS directly',
    ]},
  ];

  const noTransfer = ['Ecoworld', 'Prestige Shantiniketan', 'Brigade Tech Gardens', 'DLF The Hub', 'Pritech Park', 'Grand HighStreet Mall', 'Capital Mall', 'Phoenix Mall of the Millennium Pune', 'Growels Mall', 'Korum Mall', 'R City Mall', 'Airoli Gigaplex', 'Airoli Mindspace', 'OIC Lower Parel', 'Elpro City Square Mall', 'Kharadi Mindspace', 'Ville Parle West (cycle DM only)'];

  return (
    <div className="page-content">
      <h1 className="page-title">Call Scripts & Scenarios</h1>
      <p className="page-subtitle">Word-for-word scripts for every call scenario</p>

      <div className="col-gap-8 mb-32">
        {scripts.map(sc => (
          <div key={sc.title} className="card">
            <h3 style={{fontSize: 15, fontWeight: 700, marginBottom: 16, color: 'var(--md-primary)'}}>{sc.title}</h3>
            {sc.steps && sc.steps.map((s, i) => (
              <div key={i} className="flow-step">
                <div className="flow-num">{i + 1}</div>
                <div className="flow-content"><div className="flow-desc">{s}</div></div>
              </div>
            ))}
            {sc.items && sc.items.map(item => (
              <div key={item.sub} style={{marginBottom: 16}}>
                <div style={{fontSize: 12, fontWeight: 700, color: 'var(--md-secondary)', marginBottom: 8}}>{item.sub}</div>
                {item.steps.map((s, i) => (
                  <div key={i} style={{fontSize: 12, color: 'var(--md-on-surface-var)', marginBottom: 6, paddingLeft: 12, borderLeft: '2px solid var(--md-outline)'}}>
                    {s}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>

      <h2 className="section-title"><span className="material-symbols-outlined" style={{color:'var(--md-primary)'}}>storefront</span> Outlet/DM Call Scenarios</h2>
      <div className="grid-3 mb-32">
        {outletDm.map(o => (
          <div key={o.title} className="card">
            <h3 style={{fontWeight: 700, fontSize: 14, marginBottom: 12, color: 'var(--md-secondary)'}}>{o.title}</h3>
            {o.steps.map((s, i) => <div key={i} className="flow-step"><div className="flow-num">{i+1}</div><div className="flow-content"><div className="flow-desc">{s}</div></div></div>)}
          </div>
        ))}
      </div>

      <h2 className="section-title"><span className="material-symbols-outlined" style={{color:'var(--md-error)'}}>block</span> Do NOT Transfer Outlets</h2>
      <div className="card">
        <div style={{display: 'flex', flexWrap: 'wrap', gap: 8}}>
          {noTransfer.map(o => <span key={o} className="chip chip-red">{o}</span>)}
        </div>
      </div>
    </div>
  );
}
