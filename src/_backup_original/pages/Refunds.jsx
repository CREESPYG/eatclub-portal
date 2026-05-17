export default function Refunds({ navigate }) {
  return (
    <div className="flex-1 p-6 md:p-8 animate-[fadeIn_0.18s_ease]">
      <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">Refunds & Compensation</h1>
      <p className="text-base text-on-surface-var mb-8 leading-relaxed">Authority limits, processing methods, and N-1 decision logic</p>

      <div className="flex items-start gap-3 p-4 bg-primary/8 rounded-2xl border border-primary/20 mb-6 animate-[gravityDrop_0.4s_ease_both]">
        <span className="material-symbols-outlined text-primary flex-shrink-0">payments</span>
        <div className="flex-1">
          <strong className="text-sm">Complete Refund Matrix — 75 tags with exact amounts</strong>
          <div className="text-xs text-on-surface-var mt-1">Tag-wise rules · Proportionate refund logic · Case checklists</div>
        </div>
        {navigate && (
          <button className="px-4 py-1.5 bg-primary text-white text-xs font-bold rounded-full hover:opacity-90 transition-opacity" onClick={() => navigate('refunds-master')}>Open →</button>
        )}
      </div>

      <h2 className="text-xl font-bold text-on-surface mb-5 flex items-center gap-2.5">Refund Authority Table <span className="flex-1 h-px bg-outline" /></h2>
      <div className="bg-surface-variant rounded-2xl p-5 border border-outline mb-6 animate-[gravityDrop_0.3s_ease_both]">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead><tr><th className="p-2.5 text-left text-[11px] font-semibold text-on-surface-var uppercase tracking-wide border-b border-outline-var">Level</th><th className="p-2.5 text-left text-[11px] font-semibold text-on-surface-var uppercase tracking-wide border-b border-outline-var">Role</th><th className="p-2.5 text-left text-[11px] font-semibold text-on-surface-var uppercase tracking-wide border-b border-outline-var">Authority</th></tr></thead>
            <tbody>
              {[
                ['L1','Agent','Up to ₹100 wallet credits'],
                ['L2','Team Lead','Up to ₹200 wallet credits'],
                ['L3','Manager','Case by case'],
                ['Any','Bank Refund','Always needs manager approval'],
              ].map(([level,role,auth])=>(
                <tr key={level} className="border-b border-outline-var last:border-b-0">
                  <td className="p-2.5"><span className="inline-flex px-2 py-0.5 rounded-md text-xs font-bold bg-warning/20 text-warning">{level}</span></td>
                  <td className="p-2.5 font-medium">{role}</td>
                  <td className="p-2.5 text-primary">{auth}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <h2 className="text-xl font-bold text-on-surface mb-5 flex items-center gap-2.5">Refund Processing Methods <span className="flex-1 h-px bg-outline" /></h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        <div className="bg-surface-variant rounded-2xl p-5 border border-outline border-t-[3px] border-t-tertiary animate-[gravityDrop_0.3s_ease_both]">
          <h3 className="text-sm font-bold text-tertiary mb-3">💳 Wallet (App Credits)</h3>
          {['SAAS → Find order → Edit → Custom Refund Amount','Enter amount → Select Wallet','Credits reflect within 24 hours'].map((s,i)=>(
            <div key={i} className="flex gap-3 py-2.5 border-b border-outline-var last:border-b-0">
              <div className="w-6 h-6 bg-gradient-to-br from-tertiary to-primary rounded-full flex items-center justify-center flex-shrink-0 text-white text-[10px] font-bold">{i+1}</div>
              <div className="flex-1 text-sm text-on-surface-var">{s}</div>
            </div>
          ))}
        </div>
        <div className="bg-surface-variant rounded-2xl p-5 border border-outline border-t-[3px] border-t-primary animate-[gravityDrop_0.3s_ease_both]">
          <h3 className="text-sm font-bold text-primary mb-3">🏦 Bank (Original Source)</h3>
          {['SAAS → Find order → Edit → Custom Refund Amount','Enter amount → Select Bank','Reflects within 5-7 working days','Needs Manager approval'].map((s,i)=>(
            <div key={i} className="flex gap-3 py-2.5 border-b border-outline-var last:border-b-0">
              <div className="w-6 h-6 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0 text-white text-[10px] font-bold">{i+1}</div>
              <div className="flex-1 text-sm text-on-surface-var">{s}</div>
            </div>
          ))}
        </div>
      </div>

      <h2 className="text-xl font-bold text-on-surface mb-5 flex items-center gap-2.5">Failed Transaction Refund <span className="flex-1 h-px bg-outline" /></h2>
      <div className="bg-surface-variant rounded-2xl p-5 border border-outline mb-6 animate-[gravityDrop_0.3s_ease_both]">
        {['SAAS → Failed TXN section','Find transaction → Click Refund','Amount credited to original source'].map((s,i)=>(
          <div key={i} className="flex gap-3 py-2.5 border-b border-outline-var last:border-b-0">
            <div className="w-6 h-6 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0 text-white text-[10px] font-bold">{i+1}</div>
            <div className="flex-1 text-sm text-on-surface-var">{s}</div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-on-surface mb-5 flex items-center gap-2.5">N-1 Decision Logic <span className="flex-1 h-px bg-outline" /></h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        <div className="bg-surface-variant rounded-2xl p-5 border border-outline border-l-4 border-l-tertiary animate-[gravityDrop_0.3s_ease_both]">
          <h3 className="text-sm font-bold text-tertiary mb-3">✅ GIVE Refund/Credit</h3>
          <div className="p-2.5 bg-success/8 rounded-lg mb-2 text-sm text-tertiary border-l-[3px] border-tertiary">Condition A: N-1 has NO previous refund/credit (clean slate)</div>
          <div className="p-2.5 bg-success/8 rounded-lg text-sm text-tertiary border-l-[3px] border-tertiary">Condition B: N-1 HAS refund BUT genuine blunder confirmed AND customer has good history</div>
        </div>
        <div className="bg-surface-variant rounded-2xl p-5 border border-outline border-l-4 border-l-error animate-[gravityDrop_0.3s_ease_both]">
          <h3 className="text-sm font-bold text-error mb-3">❌ DENY Refund/Credit</h3>
          <div className="p-2.5 bg-error/8 rounded-lg mb-2 text-sm text-error border-l-[3px] border-error">Condition A: N-1 already had refund/credit</div>
          <div className="p-2.5 bg-error/8 rounded-lg text-sm text-error border-l-[3px] border-error">Condition B: N-1 clean BUT N-2 or N-3 had refund/credit</div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-on-surface mb-5 flex items-center gap-2.5">When NOT to Refund <span className="flex-1 h-px bg-outline" /></h2>
      <div className="bg-surface-variant rounded-2xl p-5 border border-outline mb-6 animate-[gravityDrop_0.3s_ease_both]">
        <div className="flex flex-col gap-2">
          {[
            'Order already cancelled without refund eligibility (food prepared)',
            'Fake complaint (image mismatch, bad customer history)',
            'Customer not reachable — food was prepared and delivery attempted',
            'COD orders — no refund to source (food delivered)',
            'Third-party orders with external refund already processed',
            'Credits already given in N-1 (Case 2 logic)',
            'Customer used MGT8 code — record only, no refund',
          ].map((s,i)=><div key={i} className="p-2.5 bg-error/8 rounded-lg text-sm text-error border-l-[3px] border-error">{s}</div>)}
        </div>
      </div>

      <h2 className="text-xl font-bold text-on-surface mb-5 flex items-center gap-2.5">Penalty Codes Reference <span className="flex-1 h-px bg-outline" /></h2>
      <div className="bg-surface-variant rounded-2xl p-5 border border-outline animate-[gravityDrop_0.3s_ease_both]">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead><tr><th className="p-2.5 text-left text-[11px] font-semibold text-on-surface-var uppercase tracking-wide border-b border-outline-var">Code</th><th className="p-2.5 text-left text-[11px] font-semibold text-on-surface-var uppercase tracking-wide border-b border-outline-var">Amount</th><th className="p-2.5 text-left text-[11px] font-semibold text-on-surface-var uppercase tracking-wide border-b border-outline-var">Applies To</th></tr></thead>
            <tbody>
              {[
                ['Maker300','₹300','Maker (kitchen staff)'],
                ['Maker1000','₹1000','Maker (critical issues: VegNonVeg, Insect, External)'],
                ['Maker (no ₹)','Feedback only','Maker feedback, no deduction'],
                ['DM250','₹250','Delivery Person'],
                ['Manager200','₹200','Outlet Manager'],
                ['Manager400','₹400','Outlet Manager (cold food, rude behavior)'],
                ['Manager1000','₹1000','Outlet Manager (VegNonVeg)'],
                ['Kitchen','Feedback only','Kitchen team accountability'],
              ].map(([code,amt,applies])=>(
                <tr key={code} className="border-b border-outline-var last:border-b-0">
                  <td className="p-2.5"><span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-bold ${amt === 'Feedback only' ? 'bg-surface-3 text-on-surface-var' : 'bg-warning/20 text-warning'}`}>{code}</span></td>
                  <td className="p-2.5 text-primary font-semibold">{amt}</td>
                  <td className="p-2.5 text-on-surface-var">{applies}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
