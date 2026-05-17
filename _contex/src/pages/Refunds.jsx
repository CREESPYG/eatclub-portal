export default function Refunds({ navigate }) {
  return (
    <div className="page-content">
      <h1 className="page-title">Refunds & Compensation</h1>
      <p className="page-subtitle">Authority limits, processing methods, and N-1 decision logic</p>

      <div className="rm-xref-banner" style={{ animation: 'gravityDrop .4s ease both', marginBottom: 20 }}>
        <span className="material-symbols-outlined">payments</span>
        <div>
          <strong>Complete Refund Matrix — 75 tags with exact amounts</strong>
          <div style={{ fontSize: 11, marginTop: 4, color: 'var(--md-on-surface-var)' }}>
            Tag-wise rules · Proportionate refund logic · Case checklists
          </div>
        </div>
        {navigate && <button className="btn rm-xref-btn" onClick={() => navigate('refunds-master')}>Open →</button>}
      </div>

      <h2 className="section-title">Refund Authority Table</h2>
      <div className="card mb-24">
        <div className="portion-table-wrap">
          <table className="info-table">
            <thead><tr><th>Level</th><th>Role</th><th>Authority</th></tr></thead>
            <tbody>
              {[
                ['L1','Agent','Up to ₹100 wallet credits'],
                ['L2','Team Lead','Up to ₹200 wallet credits'],
                ['L3','Manager','Case by case'],
                ['Any','Bank Refund','Always needs manager approval'],
              ].map(([level,role,auth])=>(
                <tr key={level}><td><span className="badge badge-orange">{level}</span></td><td style={{fontWeight:600}}>{role}</td><td style={{color:'var(--md-primary)'}}>{auth}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <h2 className="section-title">Refund Processing Methods</h2>
      <div className="grid-2 mb-24">
        <div className="card" style={{borderTop:'3px solid var(--md-tertiary)'}}>
          <h3 style={{fontWeight:700,color:'var(--md-tertiary)',marginBottom:12}}>💳 Wallet (App Credits)</h3>
          {['SAAS → Find order → Edit → Custom Refund Amount','Enter amount → Select Wallet','Credits reflect within 24 hours'].map((s,i)=>(
            <div key={i} className="flow-step"><div className="flow-num">{i+1}</div><div className="flow-content"><div className="flow-desc">{s}</div></div></div>
          ))}
        </div>
        <div className="card" style={{borderTop:'3px solid var(--md-primary)'}}>
          <h3 style={{fontWeight:700,color:'var(--md-primary)',marginBottom:12}}>🏦 Bank (Original Source)</h3>
          {['SAAS → Find order → Edit → Custom Refund Amount','Enter amount → Select Bank','Reflects within 5-7 working days','Needs Manager approval'].map((s,i)=>(
            <div key={i} className="flow-step"><div className="flow-num">{i+1}</div><div className="flow-content"><div className="flow-desc">{s}</div></div></div>
          ))}
        </div>
      </div>

      <h2 className="section-title">Failed Transaction Refund</h2>
      <div className="card mb-24">
        {['SAAS → Failed TXN section','Find transaction → Click Refund','Amount credited to original source'].map((s,i)=>(
          <div key={i} className="flow-step"><div className="flow-num">{i+1}</div><div className="flow-content"><div className="flow-desc">{s}</div></div></div>
        ))}
      </div>

      <h2 className="section-title">N-1 Decision Logic</h2>
      <div className="grid-2 mb-24">
        <div className="card" style={{borderLeft:'4px solid var(--md-tertiary)'}}>
          <h3 style={{fontWeight:700,color:'var(--md-tertiary)',marginBottom:12}}>✅ GIVE Refund/Credit</h3>
          <div className="dt-node yes mb-8">Condition A: N-1 has NO previous refund/credit (clean slate)</div>
          <div className="dt-node yes">Condition B: N-1 HAS refund BUT genuine blunder confirmed AND customer has good history</div>
        </div>
        <div className="card" style={{borderLeft:'4px solid var(--md-error)'}}>
          <h3 style={{fontWeight:700,color:'var(--md-error)',marginBottom:12}}>❌ DENY Refund/Credit</h3>
          <div className="dt-node no mb-8">Condition A: N-1 already had refund/credit</div>
          <div className="dt-node no">Condition B: N-1 clean BUT N-2 or N-3 had refund/credit</div>
        </div>
      </div>

      <h2 className="section-title">When NOT to Refund</h2>
      <div className="card mb-24">
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          {[
            'Order already cancelled without refund eligibility (food prepared)',
            'Fake complaint (image mismatch, bad customer history)',
            'Customer not reachable — food was prepared and delivery attempted',
            'COD orders — no refund to source (food delivered)',
            'Third-party orders with external refund already processed',
            'Credits already given in N-1 (Case 2 logic)',
            'Customer used MGT8 code — record only, no refund',
          ].map((s,i)=><div key={i} className="dt-node no">{s}</div>)}
        </div>
      </div>

      <h2 className="section-title">Penalty Codes Reference</h2>
      <div className="card">
        <div className="portion-table-wrap">
          <table className="info-table">
            <thead><tr><th>Code</th><th>Amount</th><th>Applies To</th></tr></thead>
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
                <tr key={code}><td><span className={`badge ${amt==='-' || amt==='Feedback only' ? 'badge-gray' : 'badge-orange'}`}>{code}</span></td><td style={{color:'var(--md-primary)',fontWeight:600}}>{amt}</td><td>{applies}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
