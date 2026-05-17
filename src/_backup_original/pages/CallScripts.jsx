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
    <div className="flex-1 p-6 md:p-8 animate-[fadeIn_0.18s_ease]">
      <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">Call Scripts & Scenarios</h1>
      <p className="text-base text-on-surface-var mb-8 leading-relaxed">Word-for-word scripts for every call scenario</p>

      <div className="flex flex-col gap-3 mb-8">
        {scripts.map(sc => (
          <div key={sc.title} className="bg-surface-variant rounded-2xl p-5 border border-outline animate-[gravityDrop_0.3s_ease_both]">
            <h3 className="text-sm font-bold text-primary mb-4">{sc.title}</h3>
            {sc.steps && sc.steps.map((s, i) => (
              <div key={i} className="flex gap-4 py-3 border-b border-outline-var last:border-b-0">
                <div className="w-7 h-7 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">{i + 1}</div>
                <div className="flex-1 text-sm text-on-surface-var leading-relaxed">{s}</div>
              </div>
            ))}
            {sc.items && sc.items.map(item => (
              <div key={item.sub} className="mb-4">
                <div className="text-xs font-bold text-secondary mb-2">{item.sub}</div>
                {item.steps.map((s, i) => (
                  <div key={i} className="text-xs text-on-surface-var mb-1.5 pl-3 border-l-2 border-outline">{s}</div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-on-surface mb-5 flex items-center gap-2.5">
        <span className="material-symbols-outlined text-primary">storefront</span>
        Outlet/DM Call Scenarios
        <span className="flex-1 h-px bg-outline" />
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {outletDm.map(o => (
          <div key={o.title} className="bg-surface-variant rounded-2xl p-5 border border-outline animate-[gravityDrop_0.3s_ease_both]">
            <h3 className="text-sm font-bold text-secondary mb-3">{o.title}</h3>
            {o.steps.map((s, i) => (
              <div key={i} className="flex gap-3 py-2.5 border-b border-outline-var last:border-b-0">
                <div className="w-6 h-6 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0 text-white text-[10px] font-bold">{i + 1}</div>
                <div className="flex-1 text-sm text-on-surface-var leading-relaxed">{s}</div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-on-surface mb-5 flex items-center gap-2.5">
        <span className="material-symbols-outlined text-error">block</span>
        Do NOT Transfer Outlets
        <span className="flex-1 h-px bg-outline" />
      </h2>
      <div className="bg-surface-variant rounded-2xl p-5 border border-outline animate-[gravityDrop_0.3s_ease_both]">
        <div className="flex flex-wrap gap-2">
          {noTransfer.map(o => <span key={o} className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-error/15 text-error">{o}</span>)}
        </div>
      </div>
    </div>
  );
}
