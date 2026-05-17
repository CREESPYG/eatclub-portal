import { useState } from 'react';

const TABS = [
  {
    id: 'quality', label: '🍱 Quality Issue',
    content: (
      <div>
        <div className="alert alert-info mb-16">
          <span className="alert-icon">smart_toy</span>
          <strong>Bot Trigger:</strong> "Items are different from what I ordered" / "Report quality issues"
        </div>
        <div className="card mb-16" style={{ borderLeft: '4px solid var(--md-primary)' }}>
          <div style={{ fontWeight: 700, marginBottom: 6, fontSize: 15 }}>Hash Sequence</div>
          <div className="mono" style={{ color: 'var(--md-primary)', fontSize: 14 }}>#1 Hello Custom - L2 → #Apology</div>
        </div>
        <h3 className="section-title">Decision Tree</h3>
        <div className="decision-tree">
          <div className="dt-node">Check customer history in SAAS</div>
          <div style={{ paddingLeft: 20 }}>
            <div className="dt-node no">❌ BAD CUSTOMER → #Apology - Fake CX (end chat, no credit)</div>
            <div className="dt-node yes">✅ GOOD CUSTOMER →</div>
            <div style={{ paddingLeft: 20 }}>
              <div className="dt-node">Non-Blunder → Apologize only (no credit/refund)</div>
              <div className="dt-node action">Genuine Blunder →</div>
              <div style={{ paddingLeft: 20 }}>
                <div className="dt-node yes">First credit? → #Credit Resolution → confirm → #Credit Confirmation</div>
                <div className="dt-node">Not first credit? → Check N-1 → #Refund Source</div>
              </div>
            </div>
          </div>
          <div className="dt-node action" style={{ marginTop: 12 }}>Close: #2 Closing Initiation → #3 Closing Rating → #4 Closing Final</div>
        </div>
      </div>
    )
  },
  {
    id: 'cancelled', label: '❌ Cancelled Order',
    content: (
      <div>
        <div className="alert alert-info mb-16">
          <span className="alert-icon">smart_toy</span>
          <strong>Bot trigger:</strong> "Why was my order cancelled?"
        </div>
        <div className="card mb-16" style={{ borderLeft: '4px solid var(--md-primary)' }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>Hash: <span className="mono" style={{ color: 'var(--md-primary)' }}>#Hello Custom → #Apology 1 - L1</span></div>
        </div>
        <div className="decision-tree">
          <div className="dt-node">Reason: DM at location, couldn't reach customer</div>
          <div style={{ paddingLeft: 20 }}>
            <div className="dt-node action">→ Send #Cancel - Not Reachable</div>
            <div className="dt-node">Customer asks for refund?</div>
            <div style={{ paddingLeft: 20 }}>
              <div className="dt-node yes">L1: Explain food was prepared, delivery attempted</div>
              <div className="dt-node no">L2: #Cancel - Not Reachable No Refund</div>
            </div>
          </div>
          <div className="dt-node">Other cancellation reason → Explain reason, close</div>
          <div className="dt-node action" style={{ marginTop: 12 }}>Close: #2 Closing Initiation → #3 Closing Rating → #4 Closing Final</div>
        </div>
      </div>
    )
  },
  {
    id: 'n1-logic', label: '🔄 N-1 Refund Logic',
    content: (
      <div>
        <div className="grid-2 mb-16">
          <div className="card" style={{ borderTop: '3px solid var(--md-tertiary)' }}>
            <div style={{ fontWeight: 700, color: 'var(--md-tertiary)', marginBottom: 12, fontSize: 15 }}>✅ GIVE REFUND/CREDIT</div>
            <div className="dt-node yes" style={{ marginBottom: 8 }}>Condition A: N-1 order has NO previous refund/credit → Approve resolution</div>
            <div className="dt-node yes">Condition B: N-1 HAS refund BUT genuine blunder confirmed AND good history → Approve</div>
          </div>
          <div className="card" style={{ borderTop: '3px solid var(--md-error)' }}>
            <div style={{ fontWeight: 700, color: 'var(--md-error)', marginBottom: 12, fontSize: 15 }}>❌ DENY REFUND/CREDIT</div>
            <div className="dt-node no" style={{ marginBottom: 8 }}>Condition A: N-1 already had refund/credit → Deny, apologize, escalate if needed</div>
            <div className="dt-node no">Condition B: N-1 no refund BUT N-2/N-3 had refund → Deny, apologize, escalate</div>
          </div>
        </div>
        <div className="card">
          <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 15 }}>Templates for Denial</div>
          {['#Fake CX - Refund Denial L1', '#Fake CX - Refund Denial L2', '#Fake CX - Bad History', '#Fake CX - Bad History - II'].map(t => (
            <div key={t} className="mono" style={{ fontSize: 13, color: 'var(--md-primary)', marginBottom: 8, padding: '6px 10px', background: 'rgba(var(--md-primary-rgb),0.07)', borderRadius: 8 }}>{t}</div>
          ))}
        </div>
      </div>
    )
  },
  {
    id: 'rating', label: '⭐ Rating Rules',
    content: (
      <div>
        <div className="alert alert-error mb-16">
          <span className="alert-icon">error</span>
          <strong>NEVER INCREASE a rating above what the customer gave. You can DECREASE or MATCH only!</strong>
        </div>
        <div className="grid-2">
          <div className="card">
            <div style={{ fontWeight: 700, color: 'var(--md-primary)', marginBottom: 12, fontSize: 15 }}>BIG4 Issues → ALWAYS 1★ Food + 1★ Experience</div>
            {['VegNonVeg [Maker 1000 + Manager 1000]', 'InsectFound [Maker 1000]', 'ExternalElement [Maker 1000]', 'HairFound [Maker 300]', 'BadHandling [DM 250]'].map(t => (
              <div key={t} className="chip chip-red" style={{ display: 'block', marginBottom: 8, padding: '6px 12px', fontSize: 13 }}>{t}</div>
            ))}
          </div>
          <div className="card">
            <div style={{ fontWeight: 700, color: 'var(--md-tertiary)', marginBottom: 12, fontSize: 15 }}>Blank Feedback Rules</div>
            <div className="dt-node yes">High intensity food complaint → 1★ Food</div>
            <div className="dt-node">Low intensity food complaint → 3★ Food</div>
            <div className="dt-node yes">No food issue → 5★ Food</div>
            <div className="dt-node no">Experience issue exists → 1★ Experience</div>
            <div className="dt-node yes">No experience issue → 5★ Experience</div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'handoff', label: '🔀 Bot → Human Handoff',
    content: (
      <div>
        <div className="card mb-16" style={{ borderLeft: '4px solid #FF9800' }}>
          <div style={{ fontWeight: 700, marginBottom: 14, fontSize: 15 }}>When to Handoff from Bot to Human Agent</div>
          {[
            'Customer explicitly asks for human agent ("human", "agent", "representative", "person")',
            'Complaint about BIG4 (VegNonVeg, InsectFound, ExternalElement, HairFound)',
            'Order value dispute > ₹500',
            'Customer escalates 3+ consecutive times',
            'Refund request denied by L1',
          ].map((s, i) => (
            <div key={i} className="flow-step">
              <div className="flow-num">{i + 1}</div>
              <div className="flow-content"><div className="flow-desc">{s}</div></div>
            </div>
          ))}
        </div>
        <div className="card mb-16" style={{ borderLeft: '4px solid var(--md-primary)' }}>
          <div style={{ fontWeight: 700, marginBottom: 14, fontSize: 15 }}>Handoff Process — Step by Step</div>
          {[
            "Bot sends automatic message: \"We're connecting you to an agent…\"",
            'You receive the chat in Yellow.ai Inbox with full bot conversation history (cloud.yellow.ai)',
            'Send #1 Hello Custom - L2 to resume the conversation as a human agent',
            'Follow standard resolution flow based on the issue type',
            'Close with #3 Closing Rating → #4 Closing Final',
          ].map((s, i) => (
            <div key={i} className="flow-step">
              <div className="flow-num">{i + 1}</div>
              <div className="flow-content"><div className="flow-desc">{s}</div></div>
            </div>
          ))}
        </div>
        <div className="card" style={{ background: 'rgba(var(--md-primary-rgb),0.05)', border: '1px dashed rgba(var(--md-primary-rgb),0.3)' }}>
          <div style={{ fontWeight: 700, marginBottom: 10, fontSize: 14, color: 'var(--md-primary)' }}>📧 Email Support (tawk.to — Legacy)</div>
          <div style={{ fontSize: 13, color: 'var(--md-on-surface-var)', lineHeight: 1.6 }}>
            tawk.to is used for <strong>Email support ONLY</strong>.<br />
            Dashboard: <span className="mono" style={{ color: 'var(--md-primary)' }}>dashboard.tawk.to</span><br />
            Login: <span className="mono">pooja.box8@gmail.com</span>
          </div>
        </div>
      </div>
    )
  },
];

export default function AgentGuide() {
  const [active, setActive] = useState('quality');
  const tab = TABS.find(t => t.id === active);
  return (
    <div className="page-content">
      {/* Header Banner */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 24px', marginBottom: 28, borderRadius: 18, background: 'linear-gradient(135deg, rgba(var(--md-primary-rgb),0.15), rgba(var(--md-primary-rgb),0.05))', border: '1px solid rgba(var(--md-primary-rgb),0.3)' }}>
        <div style={{ width: 52, height: 52, borderRadius: 16, background: 'var(--md-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 8px 20px rgba(var(--md-primary-rgb),0.3)' }}>
          <span className="material-symbols-outlined" style={{ color: 'white', fontSize: 28 }}>smart_toy</span>
        </div>
        <div>
          <h1 className="page-title" style={{ marginBottom: 4 }}>Chat Agent Guide</h1>
          <p style={{ margin: 0, fontSize: 14, color: 'var(--md-on-surface-var)', lineHeight: 1.5 }}>
            Yellow.ai chatbot handoff flows · Decision trees · Agent resolution SOPs for every chat scenario
          </p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
          <div className="chip" style={{ background: 'rgba(var(--md-primary-rgb),0.15)', color: 'var(--md-primary)', fontSize: 12, fontWeight: 800 }}>Yellow.ai</div>
          <div className="chip" style={{ background: 'rgba(76,175,80,0.15)', color: '#4CAF50', fontSize: 12, fontWeight: 800 }}>Chat Only</div>
        </div>
      </div>

      <div className="tab-bar mb-24">
        {TABS.map(t => (
          <button key={t.id} className={`tab-btn ${active === t.id ? 'active' : ''}`} onClick={() => setActive(t.id)}>{t.label}</button>
        ))}
      </div>
      {tab.content}
    </div>
  );
}
