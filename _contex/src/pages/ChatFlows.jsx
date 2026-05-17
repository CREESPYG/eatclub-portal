import { useState } from 'react';

const TABS = [
  {
    id: 'food-quality', label: 'Food Quality Issue',
    steps: [
      { title: 'Greeting', desc: 'Send #1 Hello Custom - L2 or #Hello Custom' },
      { title: 'Bot shows complaint', desc: '"Report quality issues in the food"' },
      { title: 'Send Apology', desc: 'Send #Apology template' },
      { title: 'Check Customer History', desc: 'Determine: Give Credit / Escalate if Fake CX' },
      { title: 'Decision: Good Customer + Genuine Blunder', desc: 'Send #Credit Resolution → confirm → #Credit Confirmation. ₹100 wallet credit.' },
      { title: 'Decision: Good Customer + Non-Blunder', desc: 'Apologise only, no credits given. Use #Apology templates.' },
      { title: 'Decision: Bad Customer', desc: 'Send #Apology - Fake CX. No credit/refund.' },
      { title: 'N-1 Logic', desc: 'Check N-1 order history before giving any resolution. See Refunds module.' },
      { title: 'Closing', desc: '#2 Closing Initiation → #3 Closing Rating → #4 Closing Final' },
    ]
  },
  {
    id: 'missing-item', label: 'Missing Item',
    steps: [
      { title: 'Greeting', desc: 'Send greeting template' },
      { title: 'Drill for details', desc: 'Send #Drill Missing: "Sorry to hear that. Can you please let me know which items are missing?"' },
      { title: 'DM Check', desc: 'Send #Missing - DM Check: "Have you asked your delivery rider about the missing item?"' },
      { title: 'If DM confirms missing', desc: 'Tag: ProductMissing [DM250]' },
      { title: 'Offer redelivery', desc: '#Miss+ Redelivery: "Should I arrange delivery of the missing item?" OR Credits if redelivery not possible' },
      { title: 'Closing', desc: '#2 Closing Initiation → #3 Closing Rating → #4 Closing Final' },
    ]
  },
  {
    id: 'delivery', label: 'Delivery Issue',
    content: (
      <div>
        <div className="card mb-16">
          <div style={{fontWeight: 700, marginBottom: 12, color: 'var(--md-secondary)'}}>Order Late</div>
          {[
            'Check order status in SAAS',
            'If Prepared/Received state → General_OrderLate_50+ or 60+, outlet\'s fault → 3★ Experience',
            'If Dispatched state → DM\'s fault → 1★ Experience',
            'Send appropriate apology: #Late Order Apology / #Late Order Apology L1 / L2',
            'Can offer: #Late Order Discount (₹100 discount on current order)',
            'Close with standard closing sequence',
          ].map((s, i) => <div key={i} className="flow-step"><div className="flow-num">{i+1}</div><div className="flow-content"><div className="flow-desc">{s}</div></div></div>)}
        </div>
        <div className="card">
          <div style={{fontWeight: 700, marginBottom: 12, color: 'var(--md-error)'}}>Order Not Delivered / Early Assigned</div>
          {[
            'Check if order marked delivered but customer did not receive it',
            'Send #Early Assigning Contact: "DM has marked delivered. Please try calling: XXXXXX"',
            'Tag: EarlyAssigning [DM250]',
            'Rating: 1★ Experience',
          ].map((s, i) => <div key={i} className="flow-step"><div className="flow-num">{i+1}</div><div className="flow-content"><div className="flow-desc">{s}</div></div></div>)}
        </div>
      </div>
    )
  },
  {
    id: 'payment', label: 'Payment & Refund',
    content: (
      <div>
        <div className="card mb-16">
          <div style={{fontWeight: 700, marginBottom: 12, color: 'var(--md-secondary)'}}>Failed Transaction</div>
          {[
            'Check SAAS → Failed TXN section',
            'If amount debited but order not placed → process refund from SAAS',
            'Send #Transaction Issue confirmation',
          ].map((s, i) => <div key={i} className="flow-step"><div className="flow-num">{i+1}</div><div className="flow-content"><div className="flow-desc">{s}</div></div></div>)}
        </div>
        <div className="card">
          <div style={{fontWeight: 700, marginBottom: 12, color: 'var(--md-primary)'}}>Refund Request (Post Resolution)</div>
          {[
            'Check N-1 order history',
            'Case 1 (Give Refund): N-1 has no previous refund/credit OR N-1 has refund but genuine blunder + good history',
            'Case 2 (No Refund): N-1 already had refund/credit OR N-1 no refund but N-2/N-3 had one',
            'Credit (wallet): Custom Refund amount in SAAS → App wallet',
            'Bank refund: Custom refund amount in SAAS → Bank account (needs manager approval)',
            'Send: #Refund Source / #Credit Resolution / #Credit Confirmation',
          ].map((s, i) => <div key={i} className="flow-step"><div className="flow-num">{i+1}</div><div className="flow-content"><div className="flow-desc">{s}</div></div></div>)}
        </div>
      </div>
    )
  },
  {
    id: 'cancellation', label: 'Cancellation',
    content: (
      <div>
        <div className="alert alert-warning mb-16">
          <span className="alert-icon">warning</span>
          <div><strong>NEVER cancel without drilling first!</strong> Always check order status before proceeding.</div>
        </div>
        <div className="card mb-16">
          <div style={{fontWeight: 700, marginBottom: 12}}>Order Status Decision Tree</div>
          <div className="dt-node">Placed / Received / Prepared → Send #Cancel - No Refund warning (food wastage)</div>
          <div className="dt-node no">Dispatched → Send #Cancel Dispatched Order (cannot cancel, food dispatched)</div>
        </div>
        <div className="card mb-16">
          <div style={{fontWeight: 700, marginBottom: 12}}>Cancellation via Google Form</div>
          <a href="https://docs.google.com/forms/d/e/1FAIpQLSdVieGrNW5SAUp2aomoK7h4uMWiRSAvQy4KFf7lldYYNIshQA/formResponse" target="_blank" rel="noopener noreferrer" style={{color: 'var(--md-primary)', fontSize: 12, fontFamily: 'var(--font-mono)'}}>
            docs.google.com/forms (Cancellation Form)
          </a>
        </div>
        <div className="card">
          <div style={{fontWeight: 700, marginBottom: 12}}>Cancellation Reasons</div>
          <div className="portion-table-wrap">
            <table className="portion-table">
              <thead>
                <tr>
                  <th>#</th><th>Reason</th><th>Agent Action</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['1','Order Late','Try to deliver first, explain delay'],
                  ['2','Item Out of Stock','Attempt alternative/modification'],
                  ['3','Order Modified','Repunch after cancel'],
                  ['4','Outlet Infra Issue','Check asset sheet first, POS complaint'],
                  ['5','Fake Order','Cash orders mostly'],
                  ['6','Duplicate Order','Tech issue, cancel 2nd order'],
                  ['7','Late Night Outlet Fault','Outlet abandoning delivery'],
                  ['8','Customer Cancelled','FORGOT COUPON / WRONG ITEMS (1 min window only)'],
                  ['9','Customer Not Reachable','DMs only'],
                  ['10','Testing Order','Tech/data team orders'],
                  ['11','Third Party Cancelled','Zomato mails / Swiggy DM not attended'],
                ].map(([num, reason, action]) => (
                  <tr key={num}>
                    <td style={{fontWeight: 700, color: 'var(--md-primary)'}}>{num}</td>
                    <td className="row-header">{reason}</td>
                    <td>{action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="alert alert-warning mt-16">
          <span className="alert-icon">warning</span>
          <div><strong>BEFORE cancelling for Asset Issue:</strong> Check Very Critical Asset Deactivation Sheet first! → <a href="https://docs.google.com/spreadsheets/d/1InH8gyVW2VImP2LRrmv5XQMAVXX9Z6fIFVYoeftULUU/edit" target="_blank" rel="noopener noreferrer" style={{color:'var(--md-secondary)'}}>Open Sheet</a></div>
        </div>
      </div>
    )
  },
];

export default function ChatFlows() {
  const [active, setActive] = useState('food-quality');
  const tab = TABS.find(t => t.id === active);

  return (
    <div className="page-content">
      <h1 className="page-title">Chat Flows & SOPs</h1>
      <p className="page-subtitle">Step-by-step decision trees for every chat scenario</p>

      <div className="tab-bar mb-24">
        {TABS.map(t => (
          <button key={t.id} className={`tab-btn ${active === t.id ? 'active' : ''}`} onClick={() => setActive(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      <div>
        {tab.steps && (
          <div className="card">
            {tab.steps.map((s, i) => (
              <div key={s.title} className="flow-step">
                <div className="flow-num">{i + 1}</div>
                <div className="flow-content">
                  <div className="flow-title">{s.title}</div>
                  <div className="flow-desc">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        )}
        {tab.content && tab.content}
      </div>
    </div>
  );
}
