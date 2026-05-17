import { useState } from 'react';

const S = {
  P: 'var(--md-primary)', Prgb: 'var(--md-primary-rgb)',
  S: 'var(--md-surface)', SV: 'var(--md-surface-variant)',
  OnS: 'var(--md-on-surface)', OnSV: 'var(--md-on-surface-var)',
  Out: 'var(--md-outline)', Err: 'var(--md-error)',
  Ter: 'var(--md-tertiary)', Sec: 'var(--md-secondary)',
};

function SectionTitle({ icon, label }) {
  return (
    <div style={{ fontSize: 14, fontWeight: 800, color: S.OnS, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, letterSpacing: 0.3, textTransform: 'uppercase' }}>
      {icon && <span className="material-symbols-outlined" style={{ fontSize: 18, color: S.P }}>{icon}</span>}
      {label}
    </div>
  );
}

function ChatExample({ messages }) {
  return (
    <div style={{ background: S.S, borderRadius: 14, border: `1px solid ${S.Out}`, overflow: 'hidden', marginBottom: 20 }}>
      <div style={{ padding: '8px 18px', background: 'rgba(var(--md-primary-rgb),0.06)', borderBottom: `1px solid ${S.Out}`, fontSize: 12, fontWeight: 700, color: S.OnSV, letterSpacing: 1, textTransform: 'uppercase' }}>Example Conversation</div>
      <div style={{ padding: 16 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', marginBottom: 10, justifyContent: m.role === 'agent' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '85%',
              padding: '10px 16px',
              borderRadius: 14,
              fontSize: 14,
              lineHeight: 1.6,
              background: m.role === 'agent' ? `linear-gradient(135deg, ${S.P}, rgba(var(--md-primary-rgb),0.85))` : S.SV,
              color: m.role === 'agent' ? '#fff' : S.OnS,
              borderBottomRightRadius: m.role === 'agent' ? 5 : 14,
              borderBottomLeftRadius: m.role === 'agent' ? 14 : 5,
              border: m.role === 'agent' ? 'none' : `1px solid ${S.Out}`,
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 4, opacity: 0.75 }}>
                {m.role === 'agent' ? '🟢 You (Agent)' : '👤 Customer'}
              </div>
              <div>{m.text}</div>
              {m.hash && (
                <div style={{ fontSize: 11, marginTop: 5, color: m.role === 'agent' ? 'rgba(255,255,255,0.7)' : S.P, fontWeight: 700 }}>
                  {m.hash}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HashTag({ hash, desc }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 7, background: 'rgba(var(--md-primary-rgb),0.08)', fontSize: 13, fontWeight: 700, color: S.P, margin: '3px 5px 3px 0' }}>
      <span style={{ fontSize: 11 }}>#</span>
      {hash}
      {desc && <span style={{ fontWeight: 400, color: S.OnSV, fontSize: 11 }}>— {desc}</span>}
    </div>
  );
}

function FlowSteps({ steps }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {steps.map((s, i) => (
        <div key={i} className="flow-step">
          <div className="flow-num">{i + 1}</div>
          <div className="flow-content">
            <div className="flow-desc">{s}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ────── TAB DATA ──────

const TABS = [
  {
    id: 'quality',
    label: 'Food Quality Issue',
    content: (
      <div>
        <div className="alert alert-warning mb-16">
          <span className="alert-icon">smart_toy</span>
          <strong>Bot Triggers:</strong> "Items are different from what I ordered" / "Report quality issues" / "Food was bad" / "Taste issue"
        </div>

        <div className="grid-2 mb-16">
          <div className="card" style={{ borderTop: `3px solid ${S.P}` }}>
            <SectionTitle icon="tag" label="Hash Sequence" />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              <HashTag hash="#1 Hello Custom - L2" />
              <HashTag hash="#Apology" desc="Start with apology" />
              <HashTag hash="#Credit Resolution" desc="If applicable" />
              <HashTag hash="#Credit Confirmation" desc="Confirm credit" />
              <HashTag hash="#Fake CX" desc="Bad customer / deny" />
              <HashTag hash="#2 Closing Initiation" />
              <HashTag hash="#3 Closing Rating" />
              <HashTag hash="#4 Closing Final" />
            </div>
          </div>
          <div className="card" style={{ borderTop: `3px solid ${S.Ter}` }}>
            <SectionTitle icon="info" label="Quick Reference" />
            <div style={{ fontSize: 13, color: S.OnSV, lineHeight: 1.7 }}>
              <strong style={{ color: S.OnS }}>First credit?</strong> → Send #Credit Resolution → confirm → #Credit Confirmation<br />
              <strong style={{ color: S.OnS }}>Not first credit?</strong> → Check N-1 order → #Refund Source<br />
              <strong style={{ color: S.OnS }}>Bad customer history?</strong> → #Apology - Fake CX → end chat (no credit)<br />
              <strong style={{ color: S.OnS }}>Good customer, non-blunder?</strong> → Apologize only, no credit/refund
            </div>
          </div>
        </div>

        <div className="card mb-16">
          <SectionTitle icon="account_tree" label="Decision Tree" />
          <div className="decision-tree">
            <div className="dt-node">Customer reports quality issue</div>
            <div style={{ paddingLeft: 24 }}>
              <div className="dt-node">Check customer history in SAAS</div>
              <div style={{ paddingLeft: 24 }}>
                <div className="dt-node no">❌ Bad history / frequent complaints → <strong>#Apology - Fake CX</strong> (end chat, no credit)</div>
                <div className="dt-node yes">✅ Good customer → proceed</div>
                <div style={{ paddingLeft: 24 }}>
                  <div className="dt-node">Non-blunder (mild taste issue) → Apologize only, no credit</div>
                  <div className="dt-node action">⚠️ Genuine blunder (wrong item, spoiled food) →</div>
                  <div style={{ paddingLeft: 24 }}>
                    <div className="dt-node yes">First-ever credit? → <strong>#Credit Resolution</strong> → Customer confirms → <strong>#Credit Confirmation</strong></div>
                    <div className="dt-node">Had credit before? → Check N-1 → <strong>#Refund Source</strong></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="dt-node action" style={{ marginTop: 12 }}>→ Close with #2 → #3 → #4</div>
          </div>
        </div>

        <ChatExample messages={[
          { role: 'customer', text: 'I ordered a Margherita pizza but received a Veggie Supreme instead. This is wrong!' },
          { role: 'agent', text: 'I sincerely apologise for the mix-up with your order. Let me check this and make it right for you.', hash: '#Apology' },
          { role: 'customer', text: 'I want a refund or replacement.' },
          { role: 'agent', text: 'I understand your frustration. I can see this is your first time reporting an issue — I\'d like to process a credit for this inconvenience. Would that be okay?', hash: '#Credit Resolution' },
          { role: 'customer', text: 'Yes, that works.' },
          { role: 'agent', text: 'Perfect! I\'ve initiated a credit of ₹XXX for the incorrect item. You\'ll see it credited within 24-48 hours. Is there anything else I can help you with?', hash: '#Credit Confirmation' },
        ]} />

        <div className="card">
          <SectionTitle icon="checklist" label="Resolution Summary" />
          <div style={{ fontSize: 12, color: S.OnSV, lineHeight: 1.8 }}>
            <strong>1. Acknowledge & Apologize</strong> — Always start with #Apology<br />
            <strong>2. Verify</strong> — Check order details, customer history, and whether it's a genuine blunder<br />
            <strong>3. Resolve</strong> — First-time complaint → credit. Repeat → check N-1 rule. Bad history → deny politely<br />
            <strong>4. Confirm</strong> — Send #Credit Confirmation if credit was issued<br />
            <strong>5. Close</strong> — #2 Closing Initiation → #3 Closing Rating → #4 Closing Final
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'missing',
    label: 'Missing Items',
    content: (
      <div>
        <div className="alert alert-warning mb-16">
          <span className="alert-icon">smart_toy</span>
          <strong>Bot Triggers:</strong> "My order is missing items" / "I didn't receive all my food" / "Short delivery"
        </div>

        <div className="card mb-16" style={{ borderLeft: `4px solid ${S.P}` }}>
          <SectionTitle icon="tag" label="Hash Flow" />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            <HashTag hash="#Hello Custom - L2" />
            <HashTag hash="#Apology 1 - L1" />
            <HashTag hash="#Missing Item" desc="Main resolution" />
            <HashTag hash="#2 Closing Initiation" />
            <HashTag hash="#3 Closing Rating" />
            <HashTag hash="#4 Closing Final" />
          </div>
        </div>

        <div className="card mb-16">
          <SectionTitle icon="account_tree" label="Decision Tree" />
          <div className="decision-tree">
            <div className="dt-node">Customer reports missing item(s)</div>
            <div style={{ paddingLeft: 24 }}>
              <div className="dt-node">Ask: Which items are missing? Verify against order receipt</div>
              <div style={{ paddingLeft: 24 }}>
                <div className="dt-node">Item was in sealed package → Likely restaurant missed it</div>
                <div className="dt-node">Item was in open bag → Could be delivery partner issue</div>
                <div style={{ paddingLeft: 24 }}>
                  <div className="dt-node action">Both cases → Send <strong>#Missing Item</strong> hash</div>
                  <div style={{ paddingLeft: 24 }}>
                    <div className="dt-node yes">First occurrence → Process credit/refund for missing item value</div>
                    <div className="dt-node no">Repeat → Check N-1, may need escalation</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="dt-node action" style={{ marginTop: 12 }}>→ Close with #2 → #3 → #4</div>
          </div>
        </div>

        <ChatExample messages={[
          { role: 'customer', text: 'Hi, I ordered Chicken Biryani and 2 Garlic Breads, but I only got the Biryani. The breads are missing.' },
          { role: 'agent', text: 'I\'m really sorry to hear that! Let me look into this for you right away.', hash: '#Apology 1 - L1' },
          { role: 'agent', text: 'I can see the Garlic Breads (x2) were part of your order but not delivered. I\'ll process a refund for the missing items immediately.', hash: '#Missing Item' },
          { role: 'customer', text: 'Okay, thank you. How long will it take?' },
          { role: 'agent', text: 'The refund of ₹180 for the Garlic Breads will be processed back to your original payment method within 24-48 hours. You\'ll receive a confirmation via email. I apologise for the inconvenience caused.', hash: '#2 Closing Initiation' },
        ]} />
      </div>
    ),
  },
  {
    id: 'delivery',
    label: 'Delivery Issue',
    content: (
      <div>
        <div className="alert alert-warning mb-16">
          <span className="alert-icon">smart_toy</span>
          <strong>Bot Triggers:</strong> "Order is delayed" / "Delivery is late" / "Where is my order?" / "Driver went to wrong address"
        </div>

        <div className="grid-2 mb-16">
          <div className="card" style={{ borderTop: `3px solid ${S.P}` }}>
            <SectionTitle icon="tag" label="Hash Flow" />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              <HashTag hash="#Hello Custom - L2" />
              <HashTag hash="#Apology 1 - L1" />
              <HashTag hash="#Delivery Issue" desc="Main resolution" />
              <HashTag hash="#Delivery - Not Reachable" desc="If DM couldn't reach" />
              <HashTag hash="#2 Closing Initiation" />
              <HashTag hash="#3 Closing Rating" />
              <HashTag hash="#4 Closing Final" />
            </div>
          </div>
          <div className="card" style={{ borderTop: `3px solid #FF9800` }}>
            <SectionTitle icon="warning" label="Delay Tiers" />
            <div style={{ fontSize: 12, lineHeight: 1.8 }}>
              <strong style={{ color: S.Ter }}>&lt; 15 min</strong> — Apologize, no compensation<br />
              <strong style={{ color: '#FF9800' }}>15-30 min</strong> — Apologize + small credit (₹20-₹50)<br />
              <strong style={{ color: S.Err }}>30-60 min</strong> — Apologize + moderate credit (₹50-₹100)<br />
              <strong style={{ color: '#C62828' }}>&gt; 60 min</strong> — Apologize + full/item refund
            </div>
          </div>
        </div>

        <div className="card mb-16">
          <SectionTitle icon="account_tree" label="Decision Tree" />
          <div className="decision-tree">
            <div className="dt-node">Customer reports delivery issue</div>
            <div style={{ paddingLeft: 24 }}>
              <div className="dt-node">Identify issue type:</div>
              <div style={{ paddingLeft: 24 }}>
                <div className="dt-node action">Late delivery → Check delay time → Apply delay tier compensation</div>
                <div className="dt-node action">Wrong address → DM couldn't reach → <strong>#Delivery - Not Reachable</strong></div>
                <div className="dt-node action">Order not delivered (marked delivered) → Escalate to operations, full refund</div>
                <div className="dt-node action">Delivery partner rude → Apologize, escalate to DM team, small credit</div>
              </div>
            </div>
            <div className="dt-node action" style={{ marginTop: 12 }}>→ Always close with #2 → #3 → #4</div>
          </div>
        </div>

        <ChatExample messages={[
          { role: 'customer', text: 'My order was supposed to arrive 40 minutes ago. This is way too late!' },
          { role: 'agent', text: 'I sincerely apologise for the delay. Let me check the status of your order right away.', hash: '#Apology 1 - L1' },
          { role: 'agent', text: 'I can see your order was delayed due to high traffic in your area. I understand how frustrating this is. As a gesture of apology, I\'d like to offer you a ₹75 credit on your next order.', hash: '#Delivery Issue' },
          { role: 'customer', text: 'That\'s acceptable. When will the food arrive?' },
          { role: 'agent', text: 'Your order is out for delivery and should reach you in about 10-15 minutes. The credit of ₹75 will be applied to your next order automatically. I apologise again for the delay!', hash: '#2 Closing Initiation' },
        ]} />
      </div>
    ),
  },
  {
    id: 'cancelled',
    label: 'Cancelled Order',
    content: (
      <div>
        <div className="alert alert-warning mb-16">
          <span className="alert-icon">smart_toy</span>
          <strong>Bot Trigger:</strong> "Why was my order cancelled?" / "My order got cancelled automatically"
        </div>

        <div className="card mb-16" style={{ borderLeft: `4px solid ${S.P}` }}>
          <SectionTitle icon="tag" label="Hash Sequence" />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            <HashTag hash="#Hello Custom" />
            <HashTag hash="#Apology 1 - L1" />
            <HashTag hash="#Cancel - Not Reachable" desc="DM couldn't reach" />
            <HashTag hash="#Cancel - Not Reachable No Refund" desc="L2 denial" />
            <HashTag hash="#2 Closing Initiation" />
            <HashTag hash="#3 Closing Rating" />
            <HashTag hash="#4 Closing Final" />
          </div>
        </div>

        <div className="card mb-16">
          <SectionTitle icon="account_tree" label="Decision Tree" />
          <div className="decision-tree">
            <div className="dt-node">Customer asks why order was cancelled</div>
            <div style={{ paddingLeft: 24 }}>
              <div className="dt-node">Check cancellation reason in SAAS</div>
              <div style={{ paddingLeft: 24 }}>
                <div className="dt-node action">DM at location couldn't reach customer → Send <strong>#Cancel - Not Reachable</strong></div>
                <div style={{ paddingLeft: 24 }}>
                  <div className="dt-node yes">Customer asks for refund (L1) → Explain food was prepared and delivery was attempted</div>
                  <div className="dt-node no">Customer insists (L2) → <strong>#Cancel - Not Reachable No Refund</strong></div>
                </div>
                <div className="dt-node action">Restaurant cancelled → Explain reason, offer re-order help</div>
                <div className="dt-node action">Payment issue → Guide customer through payment</div>
              </div>
            </div>
            <div className="dt-node action" style={{ marginTop: 12 }}>→ Close with #2 → #3 → #4</div>
          </div>
        </div>

        <ChatExample messages={[
          { role: 'customer', text: 'Why was my order #12345 cancelled? I didn\'t cancel it!' },
          { role: 'agent', text: 'I understand your concern. Let me check the details of your order.', hash: '#Apology 1 - L1' },
          { role: 'agent', text: 'I can see that the delivery partner attempted to reach you at your address but was unable to connect. Since the food was already prepared, the order was cancelled after multiple attempts.', hash: '#Cancel - Not Reachable' },
          { role: 'customer', text: 'But I want a refund! It\'s not my fault.' },
          { role: 'agent', text: 'I completely understand your frustration. However, since the food was prepared and the delivery partner did attempt delivery, I\'m unable to process a refund on this occasion. I sincerely apologise for the inconvenience.', hash: '#Cancel - Not Reachable No Refund' },
        ]} />
      </div>
    ),
  },
  {
    id: 'payment',
    label: 'Payment & Refund',
    content: (
      <div>
        <div className="alert alert-warning mb-16">
          <span className="alert-icon">smart_toy</span>
          <strong>Bot Triggers:</strong> "My payment didn't go through" / "I was charged twice" / "Where is my refund?" / "Payment issue"
        </div>

        <div className="grid-2 mb-16">
          <div className="card" style={{ borderTop: `3px solid ${S.P}` }}>
            <SectionTitle icon="tag" label="Hash Flow" />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              <HashTag hash="#Apology 1 - L1" />
              <HashTag hash="#Refund Source" desc="Check refund source" />
              <HashTag hash="#Credit Resolution" />
              <HashTag hash="#Credit Confirmation" />
              <HashTag hash="#Fake CX - Refund Denial L1" />
              <HashTag hash="#Fake CX - Refund Denial L2" />
              <HashTag hash="#Fake CX - Bad History" />
            </div>
          </div>
          <div className="card" style={{ borderTop: `3px solid ${S.Ter}` }}>
            <SectionTitle icon="checklist" label="Approval Conditions" />
            <div style={{ fontSize: 12, lineHeight: 1.8 }}>
              <strong style={{ color: S.Ter }}>✅ APPROVE</strong> when:<br />
              • N-1 order has NO previous refund/credit<br />
              • OR N-1 HAS refund BUT genuine blunder + good history<br /><br />
              <strong style={{ color: S.Err }}>❌ DENY</strong> when:<br />
              • N-1 already had refund/credit<br />
              • OR N-2/N-3 had refund (even if N-1 clean)
            </div>
          </div>
        </div>

        <div className="card mb-16">
          <SectionTitle icon="account_tree" label="Refund Decision Flow" />
          <div className="decision-tree">
            <div className="dt-node">Customer requests refund/credit</div>
            <div style={{ paddingLeft: 24 }}>
              <div className="dt-node">Check N-1 order (previous order's refund history)</div>
              <div style={{ paddingLeft: 24 }}>
                <div className="dt-node">N-1 has NO refund →</div>
                <div style={{ paddingLeft: 24 }}>
                  <div className="dt-node yes">If genuine blunder → Process credit/refund ✅</div>
                  <div className="dt-node">If not genuine → Apologize only, no credit</div>
                </div>
                <div className="dt-node">N-1 HAS refund →</div>
                <div style={{ paddingLeft: 24 }}>
                  <div className="dt-node">Check N-2, N-3 history</div>
                  <div style={{ paddingLeft: 24 }}>
                    <div className="dt-node yes">Genuine blunder + good history → Approve once more ✅</div>
                    <div className="dt-node no">Repeat offender → Deny, use denial templates</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card mb-16">
          <SectionTitle icon="description" label="Denial Templates" />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <div className="chip chip-red">
              <span className="material-symbols-outlined" style={{ fontSize: 14, marginRight: 4, verticalAlign: 'middle' }}>block</span>
              #Fake CX - Refund Denial L1
            </div>
            <div className="chip chip-red">
              <span className="material-symbols-outlined" style={{ fontSize: 14, marginRight: 4, verticalAlign: 'middle' }}>block</span>
              #Fake CX - Refund Denial L2
            </div>
            <div className="chip chip-red">
              <span className="material-symbols-outlined" style={{ fontSize: 14, marginRight: 4, verticalAlign: 'middle' }}>block</span>
              #Fake CX - Bad History
            </div>
            <div className="chip chip-red">
              <span className="material-symbols-outlined" style={{ fontSize: 14, marginRight: 4, verticalAlign: 'middle' }}>block</span>
              #Fake CX - Bad History - II
            </div>
          </div>
        </div>

        <ChatExample messages={[
          { role: 'customer', text: 'I want a refund for my last order. The food was not good.' },
          { role: 'agent', text: 'I\'m sorry to hear that. Let me check your previous orders and get this sorted.', hash: '#Apology 1 - L1' },
          { role: 'agent', text: 'I can see that your previous order (N-1) already had a refund issued. Unfortunately, based on our policy, I\'m unable to process another refund at this time. I sincerely apologise for the inconvenience.', hash: '#Fake CX - Refund Denial L1' },
          { role: 'customer', text: 'That\'s not fair. I want to speak to someone senior.' },
          { role: 'agent', text: 'I understand your frustration. Let me explain this to a senior team member who can review your case further.', hash: '#Fake CX - Refund Denial L2' },
        ]} />
      </div>
    ),
  },
  {
    id: 'rating',
    label: 'Rating Rules',
    content: (
      <div>
        <div className="alert alert-error mb-16">
          <span className="alert-icon">error</span>
          <strong>CRITICAL:</strong> NEVER increase a rating above what the customer gave. You can DECREASE or MATCH only!
        </div>

        <div className="grid-2 mb-16">
          <div className="card" style={{ borderTop: `3px solid ${S.Err}` }}>
            <SectionTitle icon="report" label="BIG4 Issues → ALWAYS 1★" />
            <div style={{ fontSize: 12, color: S.OnSV, lineHeight: 1.9 }}>
              <div className="chip chip-red" style={{ display: 'block', marginBottom: 6, padding: '6px 12px', fontSize: 12 }}>🥩 Veg/Non-Veg Mix-up — Maker 1000 + Manager 1000</div>
              <div className="chip chip-red" style={{ display: 'block', marginBottom: 6, padding: '6px 12px', fontSize: 12 }}>🐛 Insect Found — Maker 1000</div>
              <div className="chip chip-red" style={{ display: 'block', marginBottom: 6, padding: '6px 12px', fontSize: 12 }}>🔩 External Element — Maker 1000</div>
              <div className="chip chip-red" style={{ display: 'block', marginBottom: 6, padding: '6px 12px', fontSize: 12 }}>💇 Hair Found — Maker 300</div>
              <div className="chip chip-red" style={{ display: 'block', marginBottom: 6, padding: '6px 12px', fontSize: 12 }}>👎 Bad Handling — DM 250</div>
            </div>
          </div>
          <div className="card" style={{ borderTop: `3px solid ${S.Ter}` }}>
            <SectionTitle icon="checklist" label="Blank Feedback Rules" />
            <div style={{ fontSize: 12, lineHeight: 1.9 }}>
              <div className="dt-node yes">High intensity food complaint → <strong>1★ Food</strong></div>
              <div className="dt-node">Low intensity food complaint → <strong>3★ Food</strong></div>
              <div className="dt-node yes">No food issue → <strong>5★ Food</strong></div>
              <div className="dt-node no">Experience issue exists → <strong>1★ Experience</strong></div>
              <div className="dt-node yes">No experience issue → <strong>5★ Experience</strong></div>
            </div>
          </div>
        </div>

        <div className="card mb-16">
          <SectionTitle icon="gavel" label="Rating Guidelines by Scenario" />
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ background: S.SV }}>
                  <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 700, borderBottom: `1px solid ${S.Out}` }}>Scenario</th>
                  <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 700, borderBottom: `1px solid ${S.Out}` }}>Food Rating</th>
                  <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 700, borderBottom: `1px solid ${S.Out}` }}>Experience Rating</th>
                  <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 700, borderBottom: `1px solid ${S.Out}` }}>Notes</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['BIG4 Issue (Veg/NonVeg, Insect, etc.)', '1★', '1★', 'Always 1★ both'],
                  ['Wrong item delivered', '1★', '3★', 'Food issue, moderate experience'],
                  ['Missing item', '3★', '3★', 'Partial food issue'],
                  ['Late delivery (&gt;30 min)', '5★', '1★', 'No food issue, bad experience'],
                  ['Late delivery (&lt;15 min)', '5★', '5★', 'Minor delay, no penalty'],
                  ['Customer service issue', '5★', '1★-3★', 'Based on severity'],
                  ['No complaint / happy customer', '5★', '5★', 'Standard'],
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${S.Out}` }}>
                    {row.map((cell, j) => (
                      <td key={j} style={{ padding: '8px 12px', color: S.OnSV, fontWeight: j === 0 ? 700 : 400, ...(['1★','1★-3★'].includes(cell) && j > 0 ? { color: S.Err, fontWeight: 700 } : {}) }}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'handoff',
    label: 'Bot → Human Handoff',
    content: (
      <div>
        <div className="alert alert-info mb-16">
          <span className="alert-icon">smart_toy</span>
          <strong>Yellow.ai → Human Agent:</strong> Bot automatically transfers chat to human when specific conditions are met
        </div>

        <div className="grid-2 mb-16">
          <div className="card" style={{ borderTop: `3px solid #FF9800` }}>
            <SectionTitle icon="priority_high" label="When to Handoff" />
            <FlowSteps steps={[
              'Customer explicitly asks: "human", "agent", "representative", "talk to person"',
              'Complaint about BIG4 (Veg/NonVeg, Insect, External Element, Hair)',
              'Order value dispute &gt; ₹500',
              'Customer escalates 3+ consecutive times in bot flow',
              'Refund request denied by L1 — customer insists on escalation',
              'Technical issue / app bug report',
              'Customer asks for manager/supervisor',
            ]} />
          </div>
          <div className="card" style={{ borderTop: `3px solid ${S.P}` }}>
            <SectionTitle icon="swap_horiz" label="Handoff Process" />
            <FlowSteps steps={[
              'Bot auto-sends: "We\'re connecting you to an agent…"',
              'Chat appears in Yellow.ai Inbox (cloud.yellow.ai) with full bot conversation history',
              'Send #1 Hello Custom - L2 to resume as human agent',
              'Review bot conversation history to understand the issue',
              'Follow standard resolution flow based on issue type',
              'Close with #3 Closing Rating → #4 Closing Final',
            ]} />
          </div>
        </div>

        <div className="card mb-16">
          <SectionTitle icon="chat" label="Example: Bot Pre-Chat + Agent Handoff" />
          <ChatExample messages={[
            { role: 'customer', text: 'This is disgusting. There was a hair in my food!' },
            { role: 'agent', text: 'I\'m extremely sorry to hear that. This is unacceptable and I apologise on behalf of the entire team. Let me escalate this immediately.', hash: '#Apology' },
            { role: 'customer', text: 'I want compensation and this needs to be looked into seriously.' },
            { role: 'agent', text: 'Absolutely. I\'m processing a full refund for this order and flagging this to our quality team. This is a serious issue that will be investigated.', hash: '#Credit Resolution' },
            { role: 'agent', text: 'Rating: Since this is a BIG4 issue (Hair Found), we MUST set Food → 1★ and Experience → 1★ in the system. Maker penalty: 300.', hash: '#Rating Note' },
          ]} />
        </div>

        <div className="card" style={{ background: 'rgba(var(--md-primary-rgb),0.03)', border: `1px dashed rgba(var(--md-primary-rgb),0.25)` }}>
          <SectionTitle icon="mail" label="Email Support (tawk.to — Legacy)" />
          <div style={{ fontSize: 12, color: S.OnSV, lineHeight: 1.8 }}>
            tawk.to is used for <strong>Email support ONLY</strong> (legacy system).<br />
            Dashboard: <span className="mono" style={{ color: S.P }}>dashboard.tawk.to</span><br />
            Login: <span className="mono">pooja.box8@gmail.com</span><br /><br />
            <strong style={{ color: S.OnS }}>Agent Note:</strong> Yellow.ai is the primary chat platform. tawk.to should only be used when specifically assigned for email follow-ups.
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'closing',
    label: 'Closing Sequences',
    content: (
      <div>
        <div className="alert alert-success mb-16">
          <span className="alert-icon">check_circle</span>
          <strong>Every chat MUST be closed with the standard 3-step hash sequence.</strong> No exceptions.
        </div>

        <div className="grid-3 mb-16" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          {[
            { step: '#2', title: 'Closing Initiation', desc: 'Start closing the conversation. Ask if there\'s anything else the customer needs.', color: S.P },
            { step: '#3', title: 'Closing Rating', desc: 'Ask the customer to rate their experience. This is mandatory for every chat.', color: '#FF9800' },
            { step: '#4', title: 'Closing Final', desc: 'Final thank you message. End the chat professionally.', color: S.Ter },
          ].map(c => (
            <div key={c.step} className="card" style={{ borderTop: `3px solid ${c.color}`, textAlign: 'center', padding: '20px 16px' }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: c.color, marginBottom: 4 }}>{c.step}</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: S.OnS, marginBottom: 8 }}>{c.title}</div>
              <div style={{ fontSize: 12, color: S.OnSV, lineHeight: 1.5 }}>{c.desc}</div>
            </div>
          ))}
        </div>

        <ChatExample messages={[
          { role: 'agent', text: 'Is there anything else I can help you with before we wrap up?', hash: '#2 Closing Initiation' },
          { role: 'customer', text: 'No, that\'s all. Thank you!' },
          { role: 'agent', text: 'Thank you for your time! Could you please take a moment to rate your experience with us today? Your feedback helps us improve.', hash: '#3 Closing Rating' },
          { role: 'customer', text: 'Sure, 4 stars.' },
          { role: 'agent', text: 'Thank you so much! Have a great day ahead. 😊', hash: '#4 Closing Final' },
        ]} />

        <div className="card mb-16">
          <SectionTitle icon="checklist" label="Closing Checklist" />
          <div style={{ fontSize: 12, lineHeight: 2 }}>
            {[
              '✅ Issue resolved or explained to customer\'s satisfaction',
              '✅ Customer acknowledged resolution',
              '✅ #2 Closing Initiation sent — asked if anything else needed',
              '✅ #3 Closing Rating sent — asked for rating/feedback',
              '✅ #4 Closing Final sent — polite sign-off',
              '✅ Rating updated in system (Food + Experience) per guidelines',
              '✅ If refund/credit issued — confirmed with customer and noted',
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: S.Ter, fontSize: 14 }}>{item.split('✅')[0]}✅</span>
                <span>{item.replace('✅ ', '')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'keynotes',
    label: 'Key Notes & Hash Library',
    content: (
      <div>
        <div className="alert alert-info mb-16">
          <span className="alert-icon">lightbulb</span>
          <strong>Master Reference:</strong> Complete hash tag library with example replies + agent mindset, logical POVs, drilling points, and what-to-check guides for every scenario.
        </div>

        {/* ───── HASH TAG LIBRARY ───── */}
        <div className="card mb-16" style={{ borderTop: `3px solid ${S.P}` }}>
          <SectionTitle icon="book" label="Hash Tag Library — Complete Reference" />
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ background: S.SV }}>
                  <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 700, borderBottom: `1px solid ${S.Out}`, whiteSpace: 'nowrap' }}>Hash Tag</th>
                  <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 700, borderBottom: `1px solid ${S.Out}` }}>Scenario</th>
                  <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 700, borderBottom: `1px solid ${S.Out}` }}>When to Use</th>
                  <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 700, borderBottom: `1px solid ${S.Out}` }}>Example Reply</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['#Hello Custom - L2', 'All', 'Opening as human agent after bot handoff', '"Hello! I am Ayush from EatClub support. I see you have been facing an issue with your order. Let me look into this and get it sorted for you right away."'],
                  ['#Apology', 'Food Quality', 'Generic apology for quality issues', '"I sincerely apologise for the trouble caused to you. This is not the experience we want our customers to have."'],
                  ['#Apology 1 - L1', 'Missing / Delivery / Cancel / Payment', 'Level 1 apology after understanding issue', '"I am really sorry to hear that! Let me check the details and make this right for you."'],
                  ['#Credit Resolution', 'Food Quality / Payment', 'Offering credit to the customer', '"I understand your frustration. Since this is your first time reporting an issue, I would like to process a credit for this inconvenience. Would that be okay?"'],
                  ['#Credit Confirmation', 'Food Quality / Payment', 'Confirming credit has been processed', '"Perfect! I have initiated a credit of ₹XXX and you will see it in your account within 24-48 hours. Is there anything else I can help with?"'],
                  ['#Missing Item', 'Missing Items', 'Main resolution for missing items', '"I can confirm the Garlic Breads (x2) were part of your order but not delivered. I will process a refund of ₹XXX for the missing items immediately."'],
                  ['#Delivery Issue', 'Delivery Issue', 'Main resolution for delivery problems', '"I can see your order was delayed due to [reason]. As a gesture of apology, I would like to offer you a ₹XXX credit on your next order."'],
                  ['#Delivery - Not Reachable', 'Delivery Issue', 'DM could not reach customer', '"I see the delivery partner attempted to reach you but was unable to connect. Your order was cancelled after multiple delivery attempts."'],
                  ['#Cancel - Not Reachable No Refund', 'Cancelled Order', 'L2 denial when customer insists on refund', '"I understand your frustration, but since the food was prepared and delivery was genuinely attempted, I am unable to process a refund on this occasion."'],
                  ['#Fake CX - Refund Denial L1', 'Payment & Refund', 'First-level refund denial (N-1 already had refund)', '"Your previous order (N-1) already had a refund issued. Unfortunately per policy I am unable to process another refund at this time."'],
                  ['#Fake CX - Refund Denial L2', 'Payment & Refund', 'Escalated denial after customer insists', '"I understand you are upset. Let me escalate this to our senior team who will review your case further and get back to you."'],
                  ['#Fake CX - Bad History', 'Payment & Refund', 'Multiple refunds in N-1, N-2, N-3 history', '"Our records show multiple previous refunds/credits have been issued on your account. Per our fair usage policy, further refunds cannot be processed."'],
                  ['#Fake CX - Bad History - II', 'Payment & Refund', 'Stronger denial for very frequent refunders', '"Your account has received refunds on N-1, N-2, and N-3 orders. Unfortunately we cannot honour further requests. This decision is final."'],
                  ['#2 Closing Initiation', 'All (MANDATORY)', 'Start wrapping up the conversation', '"Is there anything else I can help you with before we wrap up?"'],
                  ['#3 Closing Rating', 'All (MANDATORY)', 'Ask customer for rating/feedback', '"Thank you! Could you please take a moment to rate your experience? Your feedback helps us improve."'],
                  ['#4 Closing Final', 'All (MANDATORY)', 'Final polite sign-off', '"Thank you so much for your time! Have a great day ahead. 😊"'],
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${S.Out}` }}>
                    <td style={{ padding: '8px 10px', fontWeight: 700, color: S.P, whiteSpace: 'nowrap', fontFamily: 'monospace' }}>{row[0]}</td>
                    <td style={{ padding: '8px 10px', color: S.OnSV }}>{row[1]}</td>
                    <td style={{ padding: '8px 10px', color: S.OnSV }}>{row[2]}</td>
                    <td style={{ padding: '8px 10px', color: S.OnS, fontSize: 11, lineHeight: 1.5, maxWidth: 320 }}>{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ───── AGENT MINDSET & APPROACH ───── */}
        <div className="card mb-16" style={{ borderTop: `3px solid #9C27B0` }}>
          <SectionTitle icon="psychology" label="Agent Mindset & Approach — What to Do & How" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
            {[
              { title: '1. Pause & Assess', desc: 'Read the full bot conversation history before replying. Do NOT jump to resolution. Understand the WHAT, WHY, and WHEN of the issue.', color: '#9C27B0' },
              { title: '2. Empathy First', desc: 'Acknowledge the customer feeling before jumping to facts. "I understand how frustrating this must be" goes a long way. Tone matters more than words.', color: S.P },
              { title: '3. Verify Before Acting', desc: 'Always check SAAS: order status, N-1 history, delivery timeline, and customer notes. Never promise a resolution without verifying eligibility first.', color: '#FF9800' },
              { title: '4. Be Precise', desc: 'Use correct hash tags at every step. Hash tags = audit trail. Missing a hash tag = incomplete record = QA deduction.', color: S.Err },
              { title: '5. Escalate Smartly', desc: 'Know when you are out of your depth. BIG4 issues, disputes over ₹500, and technical bugs MUST be escalated. Do not attempt to fix everything alone.', color: S.Ter },
              { title: '6. Closing Is Mandatory', desc: 'Every single chat MUST end with #2 → #3 → #4. No exceptions. This is non-negotiable for QA compliance.', color: '#C62828' },
            ].map((item, i) => (
              <div key={i} style={{ padding: 14, borderRadius: 12, background: S.S, border: `1px solid ${S.Out}`, borderLeft: `4px solid ${item.color}` }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: S.OnS, marginBottom: 4 }}>{item.title}</div>
                <div style={{ fontSize: 12, color: S.OnSV, lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ───── LOGICAL POVs BY SCENARIO ───── */}
        <div className="card mb-16" style={{ borderTop: `3px solid #673AB7` }}>
          <SectionTitle icon="account_balance" label="Logical POVs — How to Think in Each Scenario" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { scenario: 'Food Quality Complaint', pov: 'Think: Is this a genuine kitchen mistake or a pattern? First-time complaints get the benefit of doubt. Repeat complaints need harder scrutiny. The customer may genuinely have gotten bad food, or they may be exploiting the system. Your job is to distinguish — not to assume bad faith, but not to be naive either.' },
              { scenario: 'Missing Item', pov: 'Think: Was the item sealed (restaurant missed) or loose (DM might have taken it)? Check the packaging type. Ask the customer what the bag looked like. Drilling the right question saves time and avoids wrongful blame on the restaurant.' },
              { scenario: 'Delivery Delay / Late', pov: 'Think: Was the delay caused by restaurant prep time, traffic, or DM reassignment? The cause determines whether we compensate and how much. A delay due to heavy rain ≠ a delay due to DM taking a different route. Each has a different response.' },
              { scenario: 'Delivery Not Received (Marked Delivered)', pov: 'Think: Could it be delivered to a neighbour? Wrong address? DM theft? This is the most sensitive scenario — assume nothing. Ask the customer to check with family/neighbours first. If genuinely not received, escalate to ops for DM investigation + full refund.' },
              { scenario: 'Payment / Double Charge', pov: 'Think: Is this a payment gateway glitch or a genuine double charge? Ask for screenshot of bank statement showing two debits. Many times it is a "hold" that auto-releases. Verify before issuing refund.' },
              { scenario: 'Cancelled Order', pov: 'Think: Who cancelled — system, restaurant, or DM? Each has a different responsibility. System auto-cancels after timeout = no refund needed (food prepared). Restaurant cancels = we mediate. DM cannot reach = explain delivery attempt.' },
              { scenario: 'BIG4 Issue (Hair/Insect/VegNonVeg)', pov: 'Think: This is CRITICAL. Always ask for photo/video evidence. Always escalate to ops regardless of what the customer says. Always set 1★ Food + 1★ Experience. Maker penalty applies. Do NOT try to resolve at L1 alone.' },
            ].map((item, i) => (
              <div key={i} style={{ padding: '12px 16px', borderRadius: 12, background: S.S, border: `1px solid ${S.Out}` }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: S.P, marginBottom: 4 }}>{item.scenario}</div>
                <div style={{ fontSize: 12, color: S.OnSV, lineHeight: 1.7 }}>{item.pov}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ───── PRESENCE OF MIND — WHAT TO CHECK ───── */}
        <div className="card mb-16" style={{ borderTop: `3px solid #E91E63` }}>
          <SectionTitle icon="search_insights" label="Presence of Mind — What to Check & How" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
            {[
              { check: 'Customer Identity', how: 'Ask for order ID first thing. Verify name + phone + address match in SAAS before proceeding.', why: 'Prevents fraud. Fake customers often fail at basic order details.' },
              { check: 'N-1 / N-2 / N-3 Refund History', how: 'Open SAAS → Customer History → Check last 3 orders for any refund/credit flags. Note the dates and amounts.', why: 'Determines eligibility. Frequent refunders get denied at L1 itself.' },
              { check: 'Delivery Timeline', how: 'Compare promised ETA vs actual delivery time. Check DM tracking logs for idle time or route deviation.', why: 'Determines delay tier compensation. Also checks if DM was actually at location.' },
              { check: 'Order Receipt vs Complaint', how: 'Cross-check what was ordered vs what customer claims is wrong/missing. Item names, quantities, add-ons.', why: 'Customer may have ordered wrong item themselves. Verify before apologising.' },
              { check: 'Bot Conversation History', how: 'Read the ENTIRE bot transcript before replying. Bot may have already gathered key info.', why: 'Avoids asking repetitive questions. Customer hates repeating themselves.' },
              { check: 'BIG4 Classification', how: 'Is the complaint about hair, insect, veg/non-veg mix-up, or foreign object? If yes → BIG4 protocol instantly.', why: 'BIG4 has separate handling. Must escalate, must set 1★, must apply maker penalty.' },
              { check: 'Customer Tone & Language', how: 'Is the customer angry, confused, or calm? Angry → more empathy. Confused → explain slowly. Calm → direct resolution.', why: 'Tone mismatch escalates frustration. Match the customer emotional state.' },
              { check: 'Previous Agent Notes', how: 'Check if this chat was already handled by another agent. Look for resolution attempts or promises made.', why: 'Prevents contradictory responses. Never override a previous agent commitment.' },
            ].map((item, i) => (
              <div key={i} style={{ padding: 12, borderRadius: 12, background: S.S, border: `1px solid ${S.Out}`, borderLeft: `4px solid ${S.P}` }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: S.OnS, marginBottom: 2 }}>🔍 {item.check}</div>
                <div style={{ fontSize: 11, color: S.OnSV, lineHeight: 1.6, marginBottom: 4 }}>
                  <strong style={{ color: S.P }}>How:</strong> {item.how}
                </div>
                <div style={{ fontSize: 11, color: S.OnSV, lineHeight: 1.5 }}>
                  <strong style={{ color: S.Ter }}>Why:</strong> {item.why}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ───── DRILLING POINTS — IMAGES & DETAILS ───── */}
        <div className="card mb-16" style={{ borderTop: `3px solid #2196F3` }}>
          <SectionTitle icon="photo_camera" label="Drilling Points — What to Ask Customers (Images & Details)" />
          <div className="alert alert-warning mb-16">
            <span className="alert-icon">priority_high</span>
            <strong>Golden Rule:</strong> When in doubt, ASK for evidence. A picture is worth 100 refund disputes. Never process a credit/refund without visual proof for food issues.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
            {[
              { scenario: 'Wrong Item Delivered', drill: 'Ask: "Could you please share a photo of the item you received along with the packing slip/sticker?" Check if the sticker matches a different order or different item code.', why: 'Sometimes items get swapped in the bag. Photo proves it is genuinely wrong, not just "tastes different".' },
              { scenario: 'Hair / Insect / Foreign Object', drill: 'Ask for CLEAR close-up photo with good lighting. Ask: "Can you send a photo of the item with the issue visible?" If possible, ask for video showing the object in the food.', why: 'BIG4 needs photo evidence for maker penalty. Without proof, the restaurant will deny and no penalty can be applied. Photo is mandatory for BIG4.' },
              { scenario: 'Missing Item', drill: 'Ask: "Which specific items are missing? Was the packaging seal intact when you opened the bag?" Ask if the bag had signs of tampering.', why: 'Helps determine if restaurant missed (sealed pack) vs DM took it (open/tampered bag). Different resolution path for each.' },
              { scenario: 'Payment Double Charged', drill: 'Ask: "Can you share a screenshot of your bank statement / UPI transaction history showing both debits?" Ask for transaction IDs of both charges.', why: 'Many "double charges" are pre-auth holds that auto-release in 3-5 days. Screenshot confirms actual double debit vs temporary hold.' },
              { scenario: 'Food Quantity / Portion Issue', drill: 'Ask: "Could you weigh the portion or share a photo next to a reference object (like a phone)?" Ask what they expected vs what they received.', why: 'Portion complaints are subjective. Photo with reference gives objective evidence. Sometimes the portion IS correct but customer expected more.' },
              { scenario: 'Delivery Marked Delivered but Not Received', drill: 'Ask: "Check with family members / neighbours / security. Can you share a photo of your doorstep/lobby area at the delivery time?" Ask if they heard the bell or got a call from DM.', why: 'DMs sometimes mark delivered and leave at wrong door. Photo of empty doorstep + DM GPS log together prove non-delivery.' },
              { scenario: 'Spoiled / Stale Food', drill: 'Ask: "Can you share a photo showing the colour/texture of the food? Does it have an unusual smell?" Ask for preparation date/time if visible on packing.', why: 'Visual evidence of spoilage (colour change, mould, separation) is needed to claim against the restaurant. Without it, it becomes your word vs theirs.' },
              { scenario: 'App / Technical Issue', drill: 'Ask: "Can you share a screen recording or screenshot of the error? What app version are you on? Android or iOS?" Ask them to try clearing cache / reinstalling.', why: 'Bugs need specific reproduction steps. Screenshots help the tech team identify the issue faster. Without details, tech support is guessing.' },
              { scenario: 'Loyalty / Coupon Not Applied', drill: 'Ask for screenshot of the coupon page showing the offer, and the payment page showing the total. Ask what coupon code they tried to use.', why: 'Coupons have T&Cs (min order, specific items, time limits). Screenshot shows whether it was a genuine system miss or customer misunderstanding of terms.' },
              { scenario: 'Rude Delivery Partner', drill: 'Ask: "Can you share the DM name or vehicle number visible in the app? Can you describe exactly what happened?" Ask if they would be comfortable sharing this for investigation.', why: 'DM complaints need specific details for the ops team to identify and take action against the right person. Vague complaints = no action possible.' },
            ].map((item, i) => (
              <div key={i} style={{ padding: 12, borderRadius: 12, background: S.S, border: `1px solid ${S.Out}`, borderTop: `3px solid #2196F3` }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: '#2196F3', marginBottom: 4 }}>{item.scenario}</div>
                <div style={{ fontSize: 11, color: S.OnS, lineHeight: 1.6, marginBottom: 6 }}>
                  <strong>💬 Ask:</strong> {item.drill}
                </div>
                <div style={{ fontSize: 11, color: S.OnSV, lineHeight: 1.5 }}>
                  <strong>🎯 Why:</strong> {item.why}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ───── GOLDEN RULES ───── */}
        <div className="card" style={{ background: 'rgba(233,30,99,0.04)', border: `2px solid rgba(233,30,99,0.25)` }}>
          <SectionTitle icon="star" label="Golden Rules — Never Forget" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
            {[
              'NEVER increase a rating — only decrease or match',
              'NEVER promise a refund without checking N-1 history first',
              'NEVER skip hash tags — every step must be tagged',
              'NEVER process BIG4 at L1 — always escalate',
              'NEVER argue with the customer — de-escalate always',
              'ALWAYS close with #2 → #3 → #4',
              'ALWAYS verify identity before sharing order details',
              'ALWAYS ask for photo evidence for food complaints',
              'ALWAYS check bot transcript before replying',
              'ALWAYS stay calm — the customer is frustrated, not personal',
            ].map((rule, i) => (
              <div key={i} style={{ padding: '10px 14px', borderRadius: 10, background: S.S, border: `1px solid ${S.Out}`, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>{rule.startsWith('NEVER') ? '⛔' : '✅'}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: rule.startsWith('NEVER') ? S.Err : S.Ter, lineHeight: 1.4 }}>{rule}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'refund-matrix',
    label: 'Refund Master Sheet',
    content: (
      <div>

        {/* ───── MASTER HEADER ───── */}
        <div style={{ padding: '18px 20px', marginBottom: 16, borderRadius: 16, background: 'linear-gradient(135deg, rgba(0,188,212,0.12), rgba(0,188,212,0.03))', border: '1px solid rgba(0,188,212,0.2)' }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: S.OnS, marginBottom: 4, letterSpacing: 0.3 }}>Refund Master Sheet</div>
          <div style={{ fontSize: 12, color: S.OnSV, lineHeight: 1.6 }}>Single-page decision reference covering all refund, credit, and compensation rules across every scenario. Use this sheet to quickly determine <strong style={{ color: S.P }}>what to give, when to give it, and when to say no</strong>.</div>
        </div>

        {/* ───── QUICK STATS ───── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: 16 }}>
          <div style={{ padding: '12px 14px', borderRadius: 12, background: 'linear-gradient(135deg, rgba(0,188,212,0.15), rgba(0,188,212,0.04))', border: '1px solid rgba(0,188,212,0.2)', textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: S.P }}>12</div>
            <div style={{ fontSize: 10, color: S.OnSV, fontWeight: 600, marginTop: 2 }}>Issue Scenarios</div>
          </div>
          <div style={{ padding: '12px 14px', borderRadius: 12, background: 'linear-gradient(135deg, rgba(76,175,80,0.15), rgba(76,175,80,0.04))', border: '1px solid rgba(76,175,80,0.2)', textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#4CAF50' }}>8</div>
            <div style={{ fontSize: 10, color: S.OnSV, fontWeight: 600, marginTop: 2 }}>N-Rule Combinations</div>
          </div>
          <div style={{ padding: '12px 14px', borderRadius: 12, background: 'linear-gradient(135deg, rgba(255,152,0,0.15), rgba(255,152,0,0.04))', border: '1px solid rgba(255,152,0,0.2)', textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#FF9800' }}>7</div>
            <div style={{ fontSize: 10, color: S.OnSV, fontWeight: 600, marginTop: 2 }}>Delay Tiers</div>
          </div>
          <div style={{ padding: '12px 14px', borderRadius: 12, background: 'linear-gradient(135deg, rgba(233,30,99,0.15), rgba(233,30,99,0.04))', border: '1px solid rgba(233,30,99,0.2)', textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#E91E63' }}>8</div>
            <div style={{ fontSize: 10, color: S.OnSV, fontWeight: 600, marginTop: 2 }}>Denial Rules</div>
          </div>
          <div style={{ padding: '12px 14px', borderRadius: 12, background: 'linear-gradient(135deg, rgba(156,39,176,0.15), rgba(156,39,176,0.04))', border: '1px solid rgba(156,39,176,0.2)', textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#9C27B0' }}>10</div>
            <div style={{ fontSize: 10, color: S.OnSV, fontWeight: 600, marginTop: 2 }}>Pre-Approval Checks</div>
          </div>
        </div>

        {/* ───── COLOR LEGEND ───── */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20, padding: '10px 16px', borderRadius: 10, background: S.S, border: `1px solid ${S.Out}`, alignItems: 'center' }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: S.OnSV, marginRight: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Legend</span>
          <span style={{ padding: '2px 9px', borderRadius: 4, fontSize: 9, fontWeight: 800, background: 'rgba(76,175,80,0.15)', color: '#4CAF50', border: '1px solid rgba(76,175,80,0.2)' }}>REFUND</span>
          <span style={{ padding: '2px 9px', borderRadius: 4, fontSize: 9, fontWeight: 800, background: 'rgba(0,188,212,0.15)', color: S.P, border: '1px solid rgba(0,188,212,0.2)' }}>CREDIT</span>
          <span style={{ padding: '2px 9px', borderRadius: 4, fontSize: 9, fontWeight: 800, background: 'rgba(255,152,0,0.12)', color: '#FF9800', border: '1px solid rgba(255,152,0,0.2)' }}>APOLOGY</span>
          <span style={{ padding: '2px 9px', borderRadius: 4, fontSize: 9, fontWeight: 800, background: 'rgba(233,30,99,0.12)', color: '#E91E63', border: '1px solid rgba(233,30,99,0.2)' }}>DENY</span>
          <span style={{ padding: '2px 9px', borderRadius: 4, fontSize: 9, fontWeight: 800, background: 'rgba(156,39,176,0.12)', color: '#9C27B0', border: '1px solid rgba(156,39,176,0.2)' }}>BIG4</span>
          <span style={{ padding: '2px 9px', borderRadius: 4, fontSize: 9, fontWeight: 800, background: 'rgba(244,67,54,0.12)', color: '#F44336', border: '1px solid rgba(244,67,54,0.2)' }}>PENALTY</span>
          <span style={{ padding: '2px 9px', borderRadius: 4, fontSize: 9, fontWeight: 800, background: 'rgba(156,39,176,0.12)', color: '#9C27B0', border: '1px solid rgba(156,39,176,0.2)' }}>CHECK/ESCALATE</span>
        </div>

        {/* ════════════════════════════════════════════════════════ */}
        {/* SECTION 1: ISSUE TYPE → RESOLUTION MATRIX             */}
        {/* ════════════════════════════════════════════════════════ */}
        <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 4, height: 24, borderRadius: 4, background: S.P }} />
          <span style={{ fontSize: 15, fontWeight: 900, color: S.OnS, letterSpacing: 0.3 }}>① ISSUE RESOLUTION MATRIX</span>
          <div style={{ flex: 1, height: 1, background: S.Out }} />
          <span style={{ fontSize: 10, color: S.OnSV, fontWeight: 600 }}>FIRST TIME VS REPEAT CUSTOMER</span>
        </div>
        <div style={{ fontSize: 11, color: S.OnSV, lineHeight: 1.5, marginBottom: 12, padding: '8px 14px', background: 'rgba(0,188,212,0.04)', borderRadius: 8, border: '1px solid rgba(0,188,212,0.1)' }}>
          <strong>How to read:</strong> Find the issue column → read across for what to offer a <strong>first-time</strong> reporter vs someone whose <strong>N-1 (previous order) was clean</strong> vs someone whose <strong>N-1 already got a refund</strong>. Each cell is color-coded by resolution type.
        </div>

        <div className="card mb-16" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
              <thead>
                <tr style={{ background: 'rgba(0,188,212,0.08)' }}>
                  <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 800, borderBottom: `2px solid ${S.P}`, color: S.OnS, width: '28%' }}>Issue Type</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 800, borderBottom: `2px solid ${S.P}`, color: S.P }}>First Occurrence</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 800, borderBottom: `2px solid ${S.P}`, color: S.P }}>Repeat · N-1 Clean</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 800, borderBottom: `2px solid ${S.P}`, color: S.Err }}>Repeat · N-1 Had Refund</th>
                </tr>
              </thead>
              <tbody>
                {/* ── Food / Order Issues Group ── */}
                <tr style={{ background: 'rgba(0,188,212,0.04)' }}><td colSpan={4} style={{ padding: '5px 12px', fontSize: 10, fontWeight: 800, color: S.P, textTransform: 'uppercase', letterSpacing: 1, borderBottom: `1px solid ${S.Out}` }}>🍔 FOOD &amp; ORDER ISSUES</td></tr>
                {[
                  { issue: 'Wrong Item Delivered', cat: 'refund', c1: 'Full item refund', c2: 'Full item refund', c3: 'Partial credit or deny' },
                  { issue: 'Missing Item', cat: 'refund', c1: 'Full missing item refund', c2: 'Full missing item refund', c3: 'Check N-2 / N-3' },
                  { issue: 'Food Quality (mild/taste)', cat: 'apology', c1: 'Apology only · No credit', c2: 'Apology only', c3: 'Deny' },
                  { issue: 'Food Quality (genuine blunder)', cat: 'credit', c1: 'Credit ₹50-₹150', c2: 'Credit ₹50-₹100', c3: 'Deny if frequent' },
                ].map((row, i) => {
                  const badge = (text) => {
                    if (!text) return null;
                    let bg, color;
                    if (text.includes('refund') || text.includes('Refund') || text.includes('Full')) { bg = 'rgba(76,175,80,0.15)'; color = '#4CAF50'; }
                    else if (text.includes('Deny') || text.includes('deny')) { bg = 'rgba(233,30,99,0.15)'; color = '#E91E63'; }
                    else if (text.includes('Credit') || text.includes('₹')) { bg = 'rgba(0,188,212,0.15)'; color = S.P; }
                    else if (text.includes('Apology')) { bg = 'rgba(255,152,0,0.12)'; color = '#FF9800'; }
                    else if (text.includes('Check') || text.includes('check')) { bg = 'rgba(156,39,176,0.12)'; color = '#9C27B0'; }
                    else if (text.includes('Penalty') || text.includes('penalty')) { bg = 'rgba(244,67,54,0.15)'; color = '#F44336'; }
                    else { bg = 'rgba(255,255,255,0.05)'; color = S.OnSV; }
                    return <span style={{ padding: '3px 10px', borderRadius: 5, fontSize: 10, fontWeight: 800, background: bg, color, whiteSpace: 'nowrap' }}>{text}</span>;
                  };
                  return (
                    <tr key={i} style={{ borderBottom: `1px solid ${S.Out}` }}>
                      <td style={{ padding: '9px 12px', fontWeight: 700, color: S.OnS, fontSize: 12 }}>{row.issue}</td>
                      <td style={{ padding: '9px 12px', textAlign: 'center' }}>{badge(row.c1)}</td>
                      <td style={{ padding: '9px 12px', textAlign: 'center' }}>{badge(row.c2)}</td>
                      <td style={{ padding: '9px 12px', textAlign: 'center' }}>{badge(row.c3)}</td>
                    </tr>
                  );
                })}

                {/* ── Delivery Issues Group ── */}
                <tr style={{ background: 'rgba(255,152,0,0.04)' }}><td colSpan={4} style={{ padding: '5px 12px', fontSize: 10, fontWeight: 800, color: '#FF9800', textTransform: 'uppercase', letterSpacing: 1, borderBottom: `1px solid ${S.Out}` }}>🚚 DELIVERY ISSUES</td></tr>
                {[
                  { issue: 'Delay < 15 min', cat: 'apology', c1: 'Apology only', c2: 'Apology only', c3: 'Apology only' },
                  { issue: 'Delay 15-30 min', cat: 'credit', c1: 'Credit ₹20-₹50', c2: 'Credit ₹20-₹50', c3: 'Apology only' },
                  { issue: 'Delay 30-60 min', cat: 'credit', c1: 'Credit ₹50-₹100', c2: 'Credit ₹50-₹100', c3: 'Apology only' },
                  { issue: 'Delay > 60 min', cat: 'refund', c1: 'Full / item refund', c2: 'Full / item refund', c3: 'Check history' },
                ].map((row, i) => {
                  const badge = (text) => {
                    if (!text) return null;
                    let bg, color;
                    if (text.includes('refund') || text.includes('Refund') || text.includes('Full')) { bg = 'rgba(76,175,80,0.15)'; color = '#4CAF50'; }
                    else if (text.includes('Deny') || text.includes('deny')) { bg = 'rgba(233,30,99,0.15)'; color = '#E91E63'; }
                    else if (text.includes('Credit') || text.includes('₹')) { bg = 'rgba(0,188,212,0.15)'; color = S.P; }
                    else if (text.includes('Apology')) { bg = 'rgba(255,152,0,0.12)'; color = '#FF9800'; }
                    else if (text.includes('Check') || text.includes('check')) { bg = 'rgba(156,39,176,0.12)'; color = '#9C27B0'; }
                    else { bg = 'rgba(255,255,255,0.05)'; color = S.OnSV; }
                    return <span style={{ padding: '3px 10px', borderRadius: 5, fontSize: 10, fontWeight: 800, background: bg, color, whiteSpace: 'nowrap' }}>{text}</span>;
                  };
                  return (
                    <tr key={i} style={{ borderBottom: `1px solid ${S.Out}` }}>
                      <td style={{ padding: '9px 12px', fontWeight: 700, color: S.OnS, fontSize: 12 }}>{row.issue}</td>
                      <td style={{ padding: '9px 12px', textAlign: 'center' }}>{badge(row.c1)}</td>
                      <td style={{ padding: '9px 12px', textAlign: 'center' }}>{badge(row.c2)}</td>
                      <td style={{ padding: '9px 12px', textAlign: 'center' }}>{badge(row.c3)}</td>
                    </tr>
                  );
                })}

                {/* ── BIG4 Issues Group ── */}
                <tr style={{ background: 'rgba(156,39,176,0.05)' }}><td colSpan={4} style={{ padding: '5px 12px', fontSize: 10, fontWeight: 800, color: '#9C27B0', textTransform: 'uppercase', letterSpacing: 1, borderBottom: `1px solid ${S.Out}` }}>🚨 BIG4 — ALWAYS FULL REFUND + PENALTY</td></tr>
                {[
                  { issue: 'Hair Found', cat: 'big4', c1: 'Full refund + Maker ₹300', c2: 'Full refund + Maker ₹300', c3: 'Full refund + Maker ₹300' },
                  { issue: 'Insect / Veg-NonVeg Mix', cat: 'big4', c1: 'Full refund + Maker ₹1000', c2: 'Full refund + Maker ₹1000', c3: 'Full refund + Maker ₹1000' },
                  { issue: 'External Element / Foreign Object', cat: 'big4', c1: 'Full refund + Maker ₹1000', c2: 'Full refund + Maker ₹1000', c3: 'Full refund + Maker ₹1000' },
                ].map((row, i) => {
                  const badge = (text) => {
                    if (!text) return null;
                    let bg, color;
                    if (text.includes('refund') || text.includes('Refund') || text.includes('Full')) { bg = 'rgba(76,175,80,0.15)'; color = '#4CAF50'; }
                    else if (text.includes('₹300') || text.includes('₹1000')) { bg = 'rgba(244,67,54,0.15)'; color = '#F44336'; }
                    else if (text.includes('Penalty') || text.includes('penalty')) { bg = 'rgba(244,67,54,0.15)'; color = '#F44336'; }
                    else { bg = 'rgba(255,255,255,0.05)'; color = S.OnSV; }
                    return <span style={{ padding: '3px 10px', borderRadius: 5, fontSize: 10, fontWeight: 800, background: bg, color, whiteSpace: 'nowrap' }}>{text}</span>;
                  };
                  return (
                    <tr key={i} style={{ borderBottom: `1px solid ${S.Out}`, background: 'rgba(156,39,176,0.03)' }}>
                      <td style={{ padding: '9px 12px', fontWeight: 800, color: '#9C27B0', fontSize: 12 }}>⚠️ {row.issue}</td>
                      <td style={{ padding: '9px 12px', textAlign: 'center' }}><span style={{ padding: '3px 10px', borderRadius: 5, fontSize: 10, fontWeight: 800, background: 'rgba(76,175,80,0.15)', color: '#4CAF50', whiteSpace: 'nowrap' }}>{row.c1.split(' + ')[0]}</span><span style={{ display: 'block', marginTop: 2 }}><span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 9, fontWeight: 800, background: 'rgba(244,67,54,0.15)', color: '#F44336', whiteSpace: 'nowrap' }}>+ {row.c1.split(' + ')[1]}</span></span></td>
                      <td style={{ padding: '9px 12px', textAlign: 'center' }}><span style={{ padding: '3px 10px', borderRadius: 5, fontSize: 10, fontWeight: 800, background: 'rgba(76,175,80,0.15)', color: '#4CAF50', whiteSpace: 'nowrap' }}>{row.c2.split(' + ')[0]}</span><span style={{ display: 'block', marginTop: 2 }}><span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 9, fontWeight: 800, background: 'rgba(244,67,54,0.15)', color: '#F44336', whiteSpace: 'nowrap' }}>+ {row.c2.split(' + ')[1]}</span></span></td>
                      <td style={{ padding: '9px 12px', textAlign: 'center' }}><span style={{ padding: '3px 10px', borderRadius: 5, fontSize: 10, fontWeight: 800, background: 'rgba(76,175,80,0.15)', color: '#4CAF50', whiteSpace: 'nowrap' }}>{row.c3.split(' + ')[0]}</span><span style={{ display: 'block', marginTop: 2 }}><span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 9, fontWeight: 800, background: 'rgba(244,67,54,0.15)', color: '#F44336', whiteSpace: 'nowrap' }}>+ {row.c3.split(' + ')[1]}</span></span></td>
                    </tr>
                  );
                })}

                {/* ── DM Issue ── */}
                <tr style={{ background: 'rgba(244,67,54,0.04)' }}><td colSpan={4} style={{ padding: '5px 12px', fontSize: 10, fontWeight: 800, color: '#F44336', textTransform: 'uppercase', letterSpacing: 1, borderBottom: `1px solid ${S.Out}` }}>👤 DELIVERY PARTNER ISSUES</td></tr>
                {[
                  { issue: 'DM Rude / Bad Handling', c1: 'DM Penalty ₹250 + apology', c2: 'DM Penalty ₹250 + apology', c3: 'DM Penalty ₹250 + apology' },
                ].map((row, i) => {
                  return (
                    <tr key={i} style={{ borderBottom: `1px solid ${S.Out}` }}>
                      <td style={{ padding: '9px 12px', fontWeight: 700, color: S.OnS, fontSize: 12 }}>{row.issue}</td>
                      <td style={{ padding: '9px 12px', textAlign: 'center' }}><span style={{ padding: '3px 10px', borderRadius: 5, fontSize: 10, fontWeight: 800, background: 'rgba(244,67,54,0.15)', color: '#F44336', whiteSpace: 'nowrap' }}>{row.c1}</span></td>
                      <td style={{ padding: '9px 12px', textAlign: 'center' }}><span style={{ padding: '3px 10px', borderRadius: 5, fontSize: 10, fontWeight: 800, background: 'rgba(244,67,54,0.15)', color: '#F44336', whiteSpace: 'nowrap' }}>{row.c2}</span></td>
                      <td style={{ padding: '9px 12px', textAlign: 'center' }}><span style={{ padding: '3px 10px', borderRadius: 5, fontSize: 10, fontWeight: 800, background: 'rgba(244,67,54,0.15)', color: '#F44336', whiteSpace: 'nowrap' }}>{row.c3}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════ */}
        {/* SECTION 2: N-RULE DECISION MATRIX                     */}
        {/* ════════════════════════════════════════════════════════ */}
        <div style={{ marginBottom: 8, marginTop: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 4, height: 24, borderRadius: 4, background: '#9C27B0' }} />
          <span style={{ fontSize: 15, fontWeight: 900, color: S.OnS, letterSpacing: 0.3 }}>② N-RULE ELIGIBILITY MATRIX</span>
          <div style={{ flex: 1, height: 1, background: S.Out }} />
          <span style={{ fontSize: 10, color: S.OnSV, fontWeight: 600 }}>LAST 3 ORDERS → VERDICT</span>
        </div>
        <div style={{ fontSize: 11, color: S.OnSV, lineHeight: 1.5, marginBottom: 12, padding: '8px 14px', background: 'rgba(156,39,176,0.04)', borderRadius: 8, border: '1px solid rgba(156,39,176,0.1)' }}>
          <strong>How to read:</strong> Look up the refund status of the customer&apos;s last 3 orders (<strong>N-1</strong> = most recent, <strong>N-2</strong> = before that, <strong>N-3</strong> = oldest). Green = &quot;Clean&quot; (no refund), Red = &quot;Had Refund&quot;. Match the combination to see the verdict and which hash tag to use.
        </div>

        <div className="card mb-16" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
              <thead>
                <tr style={{ background: 'rgba(156,39,176,0.08)' }}>
                  <th style={{ padding: '10px 10px', textAlign: 'center', fontWeight: 800, borderBottom: `2px solid #9C27B0`, color: '#9C27B0' }}>N-1</th>
                  <th style={{ padding: '10px 10px', textAlign: 'center', fontWeight: 800, borderBottom: `2px solid #9C27B0`, color: '#9C27B0' }}>N-2</th>
                  <th style={{ padding: '10px 10px', textAlign: 'center', fontWeight: 800, borderBottom: `2px solid #9C27B0`, color: '#9C27B0' }}>N-3</th>
                  <th style={{ padding: '10px 10px', textAlign: 'left', fontWeight: 800, borderBottom: `2px solid #9C27B0`, color: '#9C27B0', width: '30%' }}>Verdict</th>
                  <th style={{ padding: '10px 10px', textAlign: 'left', fontWeight: 800, borderBottom: `2px solid #9C27B0`, color: '#9C27B0' }}>Hash to Use</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { n1: 'Clean', n2: 'Clean', n3: 'Clean', verdict: '✅ APPROVE', verdictCat: 'approve', hash: '#Credit Resolution → #Credit Confirmation', note: 'If genuine blunder' },
                  { n1: 'Clean', n2: 'Had Refund', n3: 'Clean', verdict: '✅ APPROVE with caution', verdictCat: 'approve', hash: '#Credit Resolution', note: '' },
                  { n1: 'Clean', n2: 'Clean', n3: 'Had Refund', verdict: '✅ APPROVE', verdictCat: 'approve', hash: '#Credit Resolution', note: 'Single past refund is okay' },
                  { n1: 'Had Refund', n2: 'Clean', n3: 'Clean', verdict: '⚠️ CHECK CAREFULLY', verdictCat: 'warn', hash: '#Refund Source → decide', note: 'May deny if pattern detected' },
                  { n1: 'Had Refund', n2: 'Had Refund', n3: 'Clean', verdict: '❌ DENY L1', verdictCat: 'deny', hash: '#Fake CX - Refund Denial L1', note: '' },
                  { n1: 'Had Refund', n2: 'Clean', n3: 'Had Refund', verdict: '❌ DENY L1', verdictCat: 'deny', hash: '#Fake CX - Refund Denial L1', note: '' },
                  { n1: 'Had Refund', n2: 'Had Refund', n3: 'Had Refund', verdict: '❌ DENY — Bad History', verdictCat: 'deny', hash: '#Fake CX - Bad History', note: 'Final denial' },
                  { n1: 'Had Refund (BIG4)', n2: 'Clean', n3: 'Clean', verdict: '✅ APPROVE — BIG4 Exempt', verdictCat: 'approve', hash: '#Credit Resolution', note: 'BIG4 bypasses N-rule' },
                ].map((row, i) => {
                  const statusBg = row.verdictCat === 'approve' ? 'rgba(76,175,80,0.06)' : row.verdictCat === 'deny' ? 'rgba(233,30,99,0.06)' : 'rgba(255,152,0,0.06)';
                  const nColor = (v) => v === 'Clean' ? '#4CAF50' : '#E91E63';
                  return (
                    <tr key={i} style={{ borderBottom: `1px solid ${S.Out}`, background: statusBg }}>
                      <td style={{ padding: '10px 10px', textAlign: 'center', fontWeight: 800, color: nColor(row.n1), fontSize: 12 }}>{row.n1}</td>
                      <td style={{ padding: '10px 10px', textAlign: 'center', fontWeight: 800, color: nColor(row.n2), fontSize: 12 }}>{row.n2}</td>
                      <td style={{ padding: '10px 10px', textAlign: 'center', fontWeight: 800, color: nColor(row.n3), fontSize: 12 }}>{row.n3}</td>
                      <td style={{ padding: '10px 10px', fontWeight: 800, fontSize: 12, color: row.verdictCat === 'approve' ? '#4CAF50' : (row.verdictCat === 'deny' ? '#E91E63' : '#FF9800') }}>
                        {row.verdict}
                        {row.note && <span style={{ fontWeight: 400, color: S.OnSV, fontSize: 10, display: 'block' }}>{row.note}</span>}
                      </td>
                      <td style={{ padding: '10px 10px', color: S.P, fontFamily: 'monospace', fontSize: 10 }}>{row.hash}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={{ padding: '10px 14px', background: 'rgba(156,39,176,0.06)', borderTop: `1px solid ${S.Out}`, fontSize: 11, color: S.OnSV, lineHeight: 1.6 }}>
            <strong style={{ color: '#9C27B0' }}>🚨 BIG4 Exception:</strong> Hair, Insect, Veg/Non-Veg Mix-up, and Foreign Object complaints are <strong style={{ color: '#4CAF50' }}>ALWAYS eligible</strong> for full refund regardless of N-rule history. Maker/manager penalties apply independently.
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════ */}
        {/* SECTION 3: DELAY COMPENSATION TIER MATRIX             */}
        {/* ════════════════════════════════════════════════════════ */}
        <div style={{ marginBottom: 8, marginTop: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 4, height: 24, borderRadius: 4, background: '#FF9800' }} />
          <span style={{ fontSize: 15, fontWeight: 900, color: S.OnS, letterSpacing: 0.3 }}>③ DELAY COMPENSATION TIERS</span>
          <div style={{ flex: 1, height: 1, background: S.Out }} />
          <span style={{ fontSize: 10, color: S.OnSV, fontWeight: 600 }}>DURATION → COMPENSATION</span>
        </div>
        <div style={{ fontSize: 11, color: S.OnSV, lineHeight: 1.5, marginBottom: 12, padding: '8px 14px', background: 'rgba(255,152,0,0.04)', borderRadius: 8, border: '1px solid rgba(255,152,0,0.1)' }}>
          <strong>How to read:</strong> Match the delay duration to the compensation tier. Row color shows severity — <strong style={{ color: '#4CAF50' }}>green</strong> = apology only, <strong style={{ color: S.P }}>cyan</strong> = small credit, <strong style={{ color: '#FF9800' }}>orange</strong> = refund needed, <strong style={{ color: '#E91E63' }}>red</strong> = no compensation (customer/DM fault).
        </div>

        <div className="card mb-16" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
              <thead>
                <tr style={{ background: 'rgba(255,152,0,0.08)' }}>
                  <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 800, borderBottom: `2px solid #FF9800`, color: '#FF9800' }}>Delay Duration</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 800, borderBottom: `2px solid #FF9800`, color: '#FF9800' }}>Compensation</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 800, borderBottom: `2px solid #FF9800`, color: '#FF9800' }}>Hash</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 800, borderBottom: `2px solid #FF9800`, color: '#FF9800' }}>Notes</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { dur: '< 15 min', comp: 'None — Apology only', compCat: 'apology', hash: '#Apology 1 - L1', note: 'No compensation needed. Minor delay.' },
                  { dur: '15-30 min', comp: 'Credit ₹20-₹50', compCat: 'credit', hash: '#Delivery Issue', note: 'Small gesture. Check if customer is annoyed.' },
                  { dur: '30-60 min', comp: 'Credit ₹50-₹100', compCat: 'credit', hash: '#Delivery Issue', note: 'Moderate delay. Offer proactively.' },
                  { dur: '> 60 min', comp: 'Full / item value refund', compCat: 'refund', hash: '#Delivery Issue + escalation', note: 'Severe. May need manager approval.' },
                  { dur: '❌ Never arrived (marked del.)', comp: 'Full order refund', compCat: 'refund', hash: '#Delivery Issue → Escalate Ops', note: 'DM investigation. GPS + customer statement required.' },
                  { dur: '📍 Wrong address (customer)', comp: 'No compensation', compCat: 'deny', hash: '#Delivery - Not Reachable', note: 'Customer error. Food prepared. No refund.' },
                  { dur: '📞 DM could not reach', comp: 'No compensation', compCat: 'deny', hash: '#Cancel - Not Reachable No Refund', note: 'Multiple DM attempts. Food prepared.' },
                ].map((row, i) => {
                  let sevColor, sevBg;
                  if (row.compCat === 'apology') { sevColor = '#4CAF50'; sevBg = 'rgba(76,175,80,0.06)'; }
                  else if (row.compCat === 'credit') { sevColor = S.P; sevBg = 'rgba(0,188,212,0.06)'; }
                  else if (row.compCat === 'refund') { sevColor = '#FF9800'; sevBg = 'rgba(255,152,0,0.06)'; }
                  else { sevColor = '#E91E63'; sevBg = 'rgba(233,30,99,0.06)'; }
                  return (
                    <tr key={i} style={{ borderBottom: `1px solid ${S.Out}`, background: sevBg }}>
                      <td style={{ padding: '9px 12px', fontWeight: 800, color: S.OnS, fontSize: 12 }}>{row.dur}</td>
                      <td style={{ padding: '9px 12px', textAlign: 'center', fontWeight: 700, color: sevColor }}>{row.comp}</td>
                      <td style={{ padding: '9px 12px', color: S.P, fontFamily: 'monospace', fontSize: 10 }}>{row.hash}</td>
                      <td style={{ padding: '9px 12px', color: S.OnSV, fontSize: 11 }}>{row.note}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════ */}
        {/* SECTION 4: CREDIT & REFUND AMOUNT TABLE               */}
        {/* ════════════════════════════════════════════════════════ */}
        <div style={{ marginBottom: 8, marginTop: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 4, height: 24, borderRadius: 4, background: '#4CAF50' }} />
          <span style={{ fontSize: 15, fontWeight: 900, color: S.OnS, letterSpacing: 0.3 }}>④ EXACT ₹ AMOUNTS</span>
          <div style={{ flex: 1, height: 1, background: S.Out }} />
          <span style={{ fontSize: 10, color: S.OnSV, fontWeight: 600 }}>SCENARIO → AMOUNT → APPROVAL</span>
        </div>
        <div style={{ fontSize: 11, color: S.OnSV, lineHeight: 1.5, marginBottom: 12, padding: '8px 14px', background: 'rgba(76,175,80,0.04)', borderRadius: 8, border: '1px solid rgba(76,175,80,0.1)' }}>
          <strong>How to read:</strong> For each scenario, this table tells you the <strong>exact ₹ range</strong>, which <strong>payment method</strong> to use, and what <strong>approval level</strong> is needed. <strong style={{ color: '#4CAF50' }}>Green</strong> = L1 Agent can handle, <strong style={{ color: '#FF9800' }}>orange</strong> = needs escalation, <strong style={{ color: '#9C27B0' }}>purple</strong> = ops team must be involved.
        </div>

        <div className="card mb-16" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
              <thead>
                <tr style={{ background: 'rgba(76,175,80,0.08)' }}>
                  <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 800, borderBottom: `2px solid #4CAF50`, color: '#4CAF50', width: '32%' }}>Scenario</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 800, borderBottom: `2px solid #4CAF50`, color: '#4CAF50' }}>Amount</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 800, borderBottom: `2px solid #4CAF50`, color: '#4CAF50' }}>Payment Type</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 800, borderBottom: `2px solid #4CAF50`, color: '#4CAF50' }}>Approval Level</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { s: 'Wrong item (full value)', amt: 'Item MRP', type: 'Wallet / UPI', lvl: 'L1 Agent', lvlCat: 'l1' },
                  { s: 'Missing item (partial)', amt: '₹50-₹200 per item', type: 'Wallet Credit', lvl: 'L1 Agent', lvlCat: 'l1' },
                  { s: 'Food quality (minor) — apology', amt: '₹0', type: '—', lvl: 'N/A', lvlCat: 'na' },
                  { s: 'Food quality (genuine blunder)', amt: '₹50-₹150', type: 'Wallet Credit', lvl: 'L1 Agent', lvlCat: 'l1' },
                  { s: 'Delivery delay 15-30 min', amt: '₹20-₹50', type: 'Wallet Credit', lvl: 'L1 Agent', lvlCat: 'l1' },
                  { s: 'Delivery delay 30-60 min', amt: '₹50-₹100', type: 'Wallet Credit', lvl: 'L1 Agent', lvlCat: 'l1' },
                  { s: 'Delivery delay > 60 min', amt: '₹100 to full order', type: 'UPI / Wallet', lvl: 'L1 / Escalate', lvlCat: 'l2' },
                  { s: '🧴 Hair in food (BIG4)', amt: 'Full refund + Maker ₹300', type: 'UPI', lvl: 'L1 + Ops Escalate', lvlCat: 'ops' },
                  { s: '🐛 Insect / Veg-NonVeg (BIG4)', amt: 'Full refund + Maker ₹1000', type: 'UPI', lvl: 'L1 + Ops Escalate', lvlCat: 'ops' },
                  { s: 'DM rude behaviour', amt: '₹50-₹100 gesture + DM ₹250', type: 'Wallet Credit', lvl: 'L1 Agent', lvlCat: 'l1' },
                  { s: 'Order cancelled (restaurant)', amt: 'Full order refund', type: 'Original Payment', lvl: 'L1 Agent', lvlCat: 'l1' },
                  { s: 'Double charge (payment)', amt: 'Full extra charge refund', type: 'Original Payment', lvl: 'L1 Agent', lvlCat: 'l1' },
                ].map((row, i) => {
                  const lvlBg = row.lvlCat === 'l1' ? 'rgba(76,175,80,0.06)' : row.lvlCat === 'l2' ? 'rgba(255,152,0,0.06)' : row.lvlCat === 'ops' ? 'rgba(156,39,176,0.06)' : 'transparent';
                  const lvlColor = row.lvlCat === 'l1' ? '#4CAF50' : row.lvlCat === 'l2' ? '#FF9800' : row.lvlCat === 'ops' ? '#9C27B0' : S.OnSV;
                  return (
                    <tr key={i} style={{ borderBottom: `1px solid ${S.Out}`, background: lvlBg }}>
                      <td style={{ padding: '9px 12px', fontWeight: 700, color: S.OnS, fontSize: 12 }}>{row.s}</td>
                      <td style={{ padding: '9px 12px', textAlign: 'center', fontWeight: 800, color: '#4CAF50', fontSize: 12 }}>{row.amt}</td>
                      <td style={{ padding: '9px 12px', textAlign: 'center', color: S.OnSV }}>{row.type}</td>
                      <td style={{ padding: '9px 12px', textAlign: 'center', fontWeight: 700, color: lvlColor, fontSize: 11 }}>{row.lvl}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════ */}
        {/* SECTION 5: DENIAL CONDITIONS                           */}
        {/* ════════════════════════════════════════════════════════ */}
        <div style={{ marginBottom: 8, marginTop: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 4, height: 24, borderRadius: 4, background: '#E91E63' }} />
          <span style={{ fontSize: 15, fontWeight: 900, color: S.OnS, letterSpacing: 0.3 }}>⑤ DENIAL CONDITIONS</span>
          <div style={{ flex: 1, height: 1, background: S.Out }} />
          <span style={{ fontSize: 10, color: S.OnSV, fontWeight: 600 }}>WHEN TO SAY NO</span>
        </div>
        <div style={{ fontSize: 11, color: S.OnSV, lineHeight: 1.5, marginBottom: 12, padding: '8px 14px', background: 'rgba(233,30,99,0.04)', borderRadius: 8, border: '1px solid rgba(233,30,99,0.1)' }}>
          <strong>How to read:</strong> Each row describes a scenario where you <strong>cannot</strong> issue a refund or credit. The action column tells you exactly what to do, which <strong>hash tag</strong> to send, and important context to keep in mind.
        </div>

        <div className="card mb-16" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
              <thead>
                <tr style={{ background: 'rgba(233,30,99,0.08)' }}>
                  <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 800, borderBottom: `2px solid #E91E63`, color: '#E91E63' }}>Scenario</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 800, borderBottom: `2px solid #E91E63`, color: '#E91E63' }}>Action</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 800, borderBottom: `2px solid #E91E63`, color: '#E91E63' }}>Hash</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 800, borderBottom: `2px solid #E91E63`, color: '#E91E63' }}>Important Note</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { s: 'N-1 already had a refund', act: '❌ Deny L1', actCat: 'deny', hash: '#Fake CX - Refund Denial L1', note: 'Unless BIG4 or genuine 1st blunder with clean history' },
                  { s: 'N-2 AND N-3 both had refunds', act: '❌ Deny L1', actCat: 'deny', hash: '#Fake CX - Bad History', note: 'Frequent refund pattern. Do NOT approve.' },
                  { s: 'N-1, N-2, N-3 ALL had refunds', act: '❌ Deny — Bad History', actCat: 'deny', hash: '#Fake CX - Bad History - II', note: 'Final. Escalate only if customer insists 3+ times.' },
                  { s: 'Customer provided wrong address', act: '⛔ No Compensation', actCat: 'deny', hash: '#Cancel - Not Reachable No Refund', note: 'Food prepared. Delivery attempted. No refund.' },
                  { s: 'DM could not reach (no fault)', act: '⛔ No Refund', actCat: 'deny', hash: '#Cancel - Not Reachable No Refund', note: 'Multiple attempts failed. No refund.' },
                  { s: 'Mild taste issue (not genuine)', act: '🙏 Apology Only', actCat: 'warn', hash: '#Apology', note: 'Subjective. No visible issue = no credit.' },
                  { s: 'Customer is abusive / aggressive', act: '🚫 Disengage', actCat: 'warn', hash: '#Fake CX (escalate)', note: 'Report to manager. Stay professional.' },
                  { s: 'Wrong item ordered by customer', act: 'ℹ️ Educate', actCat: 'warn', hash: '#Apology (educate)', note: 'Customer ordered wrong. Explain politely.' },
                ].map((row, i) => {
                  const rowBg = row.actCat === 'deny' ? 'rgba(233,30,99,0.04)' : 'rgba(255,152,0,0.04)';
                  const actColor = row.actCat === 'deny' ? '#E91E63' : '#FF9800';
                  return (
                    <tr key={i} style={{ borderBottom: `1px solid ${S.Out}`, background: rowBg }}>
                      <td style={{ padding: '9px 12px', fontWeight: 700, color: S.OnS, fontSize: 12 }}>{row.s}</td>
                      <td style={{ padding: '9px 12px', textAlign: 'center', fontWeight: 800, color: actColor }}>{row.act}</td>
                      <td style={{ padding: '9px 12px', color: S.P, fontFamily: 'monospace', fontSize: 10 }}>{row.hash}</td>
                      <td style={{ padding: '9px 12px', color: S.OnSV, fontSize: 11, lineHeight: 1.5 }}>{row.note}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════ */}
        {/* SECTION 6: APPROVAL CHECKLIST                          */}
        {/* ════════════════════════════════════════════════════════ */}
        <div style={{ marginBottom: 8, marginTop: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 4, height: 24, borderRadius: 4, background: '#4CAF50' }} />
          <span style={{ fontSize: 15, fontWeight: 900, color: S.OnS, letterSpacing: 0.3 }}>⑥ PRE-APPROVAL CHECKLIST</span>
          <div style={{ flex: 1, height: 1, background: S.Out }} />
          <span style={{ fontSize: 10, color: S.OnSV, fontWeight: 600 }}>VERIFY BEFORE ISSUING</span>
        </div>
        <div style={{ fontSize: 11, color: S.OnSV, lineHeight: 1.5, marginBottom: 12, padding: '8px 14px', background: 'rgba(76,175,80,0.04)', borderRadius: 8, border: '1px solid rgba(76,175,80,0.1)' }}>
          <strong>Run through this checklist</strong> before issuing any refund or credit. Icons show the category: <span style={{ background: 'rgba(76,175,80,0.08)', padding: '1px 6px', borderRadius: 3, fontSize: 10, fontWeight: 700 }}>✅ Standard Check</span> <span style={{ background: 'rgba(156,39,176,0.08)', padding: '1px 6px', borderRadius: 3, fontSize: 10, fontWeight: 700 }}>📸 Evidence Required</span> <span style={{ background: 'rgba(255,152,0,0.08)', padding: '1px 6px', borderRadius: 3, fontSize: 10, fontWeight: 700 }}>💰 Amount Limit</span> <span style={{ background: 'rgba(0,188,212,0.08)', padding: '1px 6px', borderRadius: 3, fontSize: 10, fontWeight: 700 }}>🔚 Closing Step</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 8, marginBottom: 10 }}>
          {[
            { text: 'Has customer provided order ID?', cat: 'check' },
            { text: 'Is this a genuine blunder (not subjective)?', cat: 'check' },
            { text: 'N-1 checked — no refund issued previously?', cat: 'check' },
            { text: 'N-2/N-3 checked — no frequent refund pattern?', cat: 'check' },
            { text: 'Photo/video evidence collected (for food)?', cat: 'evidence' },
            { text: 'Correct hash tag selected for resolution?', cat: 'check' },
            { text: 'Credit amount within L1 approval limit?', cat: 'limit' },
            { text: 'Customer has confirmed they accept resolution?', cat: 'check' },
            { text: 'If BIG4 — escalated to ops with evidence?', cat: 'evidence' },
            { text: 'Closing sequence (#2 → #3 → #4) ready?', cat: 'closing' },
          ].map((item, i) => {
            const catColors = {
              check: { bg: 'rgba(76,175,80,0.08)', border: 'rgba(76,175,80,0.2)', icon: '✅' },
              evidence: { bg: 'rgba(156,39,176,0.08)', border: 'rgba(156,39,176,0.2)', icon: '📸' },
              limit: { bg: 'rgba(255,152,0,0.08)', border: 'rgba(255,152,0,0.2)', icon: '💰' },
              closing: { bg: 'rgba(0,188,212,0.08)', border: 'rgba(0,188,212,0.2)', icon: '🔚' },
            };
            const c = catColors[item.cat] || catColors.check;
            return (
              <div key={i} style={{ padding: '10px 14px', borderRadius: 10, background: c.bg, border: `1px solid ${c.border}`, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 14, flexShrink: 0 }}>{c.icon}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: S.OnS, lineHeight: 1.4 }}>{item.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    ),
  },
];

// ────── MAIN COMPONENT ──────

export default function AgentGuide() {
  const [active, setActive] = useState('quality');
  const tab = TABS.find(t => t.id === active);

  return (
    <div className="page-content">
      <style>{`
        .ag-hero { display: flex; align-items: center; gap: 16px; padding: 18px 24px; margin-bottom: 24px; border-radius: 18px; background: linear-gradient(135deg, rgba(var(--md-primary-rgb),0.12), rgba(var(--md-primary-rgb),0.04)); border: 1px solid rgba(var(--md-primary-rgb),0.25); }
        .ag-hero-icon { width: 52px; height: 52px; border-radius: 16px; background: var(--md-primary); display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 8px 20px rgba(var(--md-primary-rgb),0.3); }
        .ag-hero-icon .material-symbols-outlined { color: white; font-size: 28px; }
        .ag-hero h1 { margin: 0 0 2px; font-size: 20px; font-weight: 900; color: var(--md-on-surface); letter-spacing: -0.3px; }
        .ag-hero p { margin: 0; font-size: 13px; color: var(--md-on-surface-var); line-height: 1.5; }
        .tab-bar { display: flex; gap: 8px; margin-bottom: 20px; overflow-x: auto; padding-bottom: 4px; flex-wrap: wrap; }
        .tab-btn { padding: 8px 16px; border-radius: 100px; border: 1px solid var(--md-outline); background: var(--md-surface-variant); color: var(--md-on-surface-var); font-size: 12px; font-weight: 700; cursor: pointer; transition: all 0.2s; white-space: nowrap; display: flex; align-items: center; gap: 6px; }
        .tab-btn:hover { border-color: var(--md-primary); background: rgba(var(--md-primary-rgb),0.06); color: var(--md-on-surface); }
        .tab-btn.active { background: var(--md-primary); color: #fff; border-color: var(--md-primary); }
        @keyframes typingBounce { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-6px); } }
      `}</style>

      <div className="ag-hero">
        <div className="ag-hero-icon">
          <span className="material-symbols-outlined">smart_toy</span>
        </div>
        <div>
          <h1>Chat Agent Guide</h1>
          <p>Complete SOP · Decision flows · Example conversations · Hash sequences for every chat scenario</p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end', flexShrink: 0 }}>
          <div className="chip" style={{ background: 'rgba(var(--md-primary-rgb),0.12)', color: 'var(--md-primary)', fontSize: 11, fontWeight: 800 }}>Yellow.ai</div>
          <div className="chip" style={{ background: 'rgba(76,175,80,0.12)', color: '#4CAF50', fontSize: 11, fontWeight: 800 }}>Chat Support</div>
        </div>
      </div>

      <div className="tab-bar">
        {TABS.map(t => (
          <button key={t.id} className={`tab-btn ${active === t.id ? 'active' : ''}`} onClick={() => setActive(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {tab.content}
    </div>
  );
}
