export default function Resolution() {
  const flows = [
    {
      title: 'Resolution 1: Foreign Object (ExternalElement / HairFound / InsectFound)',
      color: 'var(--md-error)',
      steps: [
        'Send #Ask Image to customer',
        'Verify image (clear, shows object, not previously shared)',
        'If IMAGE VALID: Tag appropriate (ExternalElement/HairFound/InsectFound) → Rating: 1★ Food + 1★ Experience → Refund/Replacement based on N-1 logic',
        'If IMAGE INVALID: Send #Image Invalid or #False Image → No resolution without valid image',
      ],
      alert: { type: 'error', text: 'CRITICAL: These issues REQUIRE image. Cannot resolve without one.' }
    },
    {
      title: 'Resolution 2: VegNonVeg Complaint',
      color: '#9C27B0',
      steps: [
        'Verify order (was it a veg order?)',
        'Ask for image of delivered item + packaging label (#Ask Image)',
        'If CONFIRMED veg/non-veg swap: Tag VegNonVeg [Maker1000 + Manager1000] → Rating: 1★ Food + 1★ Experience → Immediate refund + escalation to kitchen manager',
        'If CANNOT CONFIRM from image: Send #Image does not Match → Cannot proceed without verification',
      ],
      alert: { type: 'error', text: 'CRITICAL: Image mandatory. Penalty: Maker ₹1000 + Manager ₹1000.' }
    },
    {
      title: 'Resolution 3: Cold Food',
      color: '#2196F3',
      steps: [
        'Cold BIRYANI (Matka/Itminaan): Tag Cold Itminaan [Maker300] → Credits or refund based on N-1',
        'Cold STARTERS (from Itminaan or any brand): Tag ColdFood [Manager400] NOT Cold Itminaan',
        'Cold FOOD (general — pizza, meal, etc.): Tag ColdFood [Manager400] → Check if order was late first and add late tag too if applicable',
      ]
    },
    {
      title: 'Resolution 4: Stale vs Not Fresh Decision',
      color: '#FF8F00',
      steps: [
        'Ask: Did customer use EXPLICIT keywords? "smelly" / "stinking" / "rotten" / "bitter taste" / "sour taste"',
        'YES → Stale [Maker300]',
        'NO → Not Fresh [Maker] (subjective, no explicit stale keywords)',
      ],
      examples: [
        { check: '✅ Stale', examples: ['"food was smelling"', '"dal makhani gone sour"', '"paratha tasting sour/bitter"'] },
        { check: '❌ Not Fresh', examples: ['"pizza toppings didn\'t appear fresh"', '"chicken wasn\'t fresh" (vague)', '"didn\'t taste good"'] },
      ]
    },
    {
      title: 'Resolution 5: Cheese Blast Uncooked',
      color: '#FF5722',
      steps: [
        'Cheese Blast = pizza with tortilla layer on top + filler cheese inside',
        'Customer says cheese blast pizza base is uncooked → This is NORMAL — the tortilla layer on top can feel "uncooked" if pizza is cold or less warm',
        'Tag: Raw/Uncooked [Maker] (NOT PanTossedBase or ThinCrustBase)',
        'Explain to customer that this is the cheese blast structure',
      ],
      alert: { type: 'info', text: 'Cheese blast customers often confuse the tortilla layer with uncooked pizza base. Always use Raw/Uncooked tag.' }
    },
  ];

  return (
    <div className="page-content">
      <h1 className="page-title">Issue Resolution Flows</h1>
      <p className="page-subtitle">Step-by-step resolution guides for complex complaint scenarios</p>

      <div className="col-gap-8">
        {flows.map((flow) => (
          <div key={flow.title} className="card" style={{borderLeft: `3px solid ${flow.color}`}}>
            <h3 style={{fontSize: 15, fontWeight: 700, color: flow.color, marginBottom: 16}}>{flow.title}</h3>
            {flow.alert && (
              <div className={`alert alert-${flow.alert.type} mb-16`}>
                <span className="alert-icon">{flow.alert.type === 'error' ? 'error' : 'info'}</span>
                {flow.alert.text}
              </div>
            )}
            {flow.steps.map((s, i) => (
              <div key={i} className="flow-step">
                <div className="flow-num" style={{background: flow.color}}>{i + 1}</div>
                <div className="flow-content"><div className="flow-desc">{s}</div></div>
              </div>
            ))}
            {flow.examples && (
              <div className="grid-2 mt-16">
                {flow.examples.map(ex => (
                  <div key={ex.check} className={`card-sm ${ex.check.includes('✅') ? '' : ''}`}>
                    <div style={{fontWeight: 700, marginBottom: 8, color: ex.check.includes('✅') ? 'var(--md-tertiary)' : 'var(--md-error)'}}>{ex.check}</div>
                    {ex.examples.map(e => <div key={e} style={{fontSize: 12, color: 'var(--md-on-surface-var)', marginBottom: 4}}>{e}</div>)}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
