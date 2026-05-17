export default function Resolution() {
  const flows = [
    {
      title: 'Resolution 1: Foreign Object (ExternalElement / HairFound / InsectFound)',
      color: 'text-error',
      colorHex: '#E53935',
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
      color: 'text-tertiary',
      colorHex: '#9C27B0',
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
      color: 'text-[#2196F3]',
      colorHex: '#2196F3',
      steps: [
        'Cold BIRYANI (Matka/Itminaan): Tag Cold Itminaan [Maker300] → Credits or refund based on N-1',
        'Cold STARTERS (from Itminaan or any brand): Tag ColdFood [Manager400] NOT Cold Itminaan',
        'Cold FOOD (general — pizza, meal, etc.): Tag ColdFood [Manager400] → Check if order was late first and add late tag too if applicable',
      ]
    },
    {
      title: 'Resolution 4: Stale vs Not Fresh Decision',
      color: 'text-warning',
      colorHex: '#FF9800',
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
      color: 'text-[#FF5722]',
      colorHex: '#FF5722',
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
    <div className="flex-1 p-6 md:p-8 animate-[fadeIn_0.18s_ease]">
      <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">Issue Resolution Flows</h1>
      <p className="text-base text-on-surface-var mb-8 leading-relaxed">Step-by-step resolution guides for complex complaint scenarios</p>

      <div className="flex flex-col gap-3">
        {flows.map((flow) => (
          <div key={flow.title} className="bg-surface-variant rounded-2xl p-5 border border-outline border-l-[3px] animate-[gravityDrop_0.3s_ease_both]" style={{ borderLeftColor: flow.colorHex }}>
            <h3 className={`text-sm font-bold mb-4 ${flow.color}`}>{flow.title}</h3>
            {flow.alert && (
              <div className={`flex gap-2.5 items-start p-3 mb-4 rounded-xl text-sm ${
                flow.alert.type === 'error'
                  ? 'bg-error/10 text-error border border-error/30'
                  : 'bg-blue-500/10 text-[#2196F3] border border-blue-500/30'
              }`}>
                <span className="material-symbols-outlined flex-shrink-0">{flow.alert.type === 'error' ? 'error' : 'info'}</span>
                <span>{flow.alert.text}</span>
              </div>
            )}
            {flow.steps.map((s, i) => (
              <div key={i} className="flex gap-4 py-3 border-b border-outline-var last:border-b-0">
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold" style={{ background: flow.colorHex }}>{i + 1}</div>
                <div className="flex-1 text-sm text-on-surface-var leading-relaxed">{s}</div>
              </div>
            ))}
            {flow.examples && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                {flow.examples.map(ex => (
                  <div key={ex.check} className="bg-surface-2 rounded-xl p-3 border border-outline">
                    <div className={`text-sm font-bold mb-2 ${ex.check.includes('✅') ? 'text-tertiary' : 'text-error'}`}>{ex.check}</div>
                    {ex.examples.map(e => <div key={e} className="text-xs text-on-surface-var mb-1">{e}</div>)}
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
