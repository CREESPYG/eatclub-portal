import { useState, useRef, useEffect } from 'react';

const S = {
  P: 'var(--md-primary)', Prgb: 'var(--md-primary-rgb)',
  S: 'var(--md-surface)', SV: 'var(--md-surface-variant)',
  OnS: 'var(--md-on-surface)', OnSV: 'var(--md-on-surface-var)',
  Out: 'var(--md-outline)', Err: 'var(--md-error)',
  Ter: 'var(--md-tertiary)',
};

// ────── SIMULATED CHAT COMPONENT ──────

function ChatSimulator({ scenario, onReset }) {
  const [step, setStep] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const chatEndRef = useRef(null);

  const { title, icon, steps, outcome, summary } = scenario;
  const totalSteps = steps.length;

  const currentStep = steps[Math.min(step, totalSteps - 1)];
  const isComplete = step >= totalSteps;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [step, revealed]);

  const handleNext = () => {
    if (!revealed) {
      setRevealed(true);
    } else {
      setRevealed(false);
      setStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handleReset = () => {
    setStep(0);
    setRevealed(false);
    onReset?.();
  };

  return (
    <div>
      {/* Scenario Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20, padding: '16px 22px', borderRadius: 16, background: S.SV, border: `1px solid ${S.Out}` }}>
        <div style={{ width: 48, height: 48, borderRadius: 14, background: `linear-gradient(135deg,${S.P},rgba(var(--md-primary-rgb),0.7))`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: 24 }}>{icon}</span>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 17, fontWeight: 800, color: S.OnS }}>{title}</div>
          <div style={{ fontSize: 13, color: S.OnSV, marginTop: 2 }}>
            Step {Math.min(step + 1, totalSteps)} of {totalSteps}
            {currentStep?.tag && <span style={{ marginLeft: 10, padding: '2px 10px', borderRadius: 5, background: 'rgba(var(--md-primary-rgb),0.12)', color: S.P, fontWeight: 700, fontSize: 12 }}>#{currentStep.tag}</span>}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 3 }}>
          {steps.map((_, i) => (
            <div key={i} style={{
              width: 8, height: 8, borderRadius: '50%',
              background: i < step + (revealed ? 1 : 0) ? S.P : S.Out,
              transition: 'background 0.3s',
            }} />
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div style={{
        background: S.S, borderRadius: 18, border: `1px solid ${S.Out}`,
        overflow: 'hidden', marginBottom: 20, boxShadow: '0 6px 32px rgba(0,0,0,0.1)',
      }}>
        {/* Chat Header */}
        <div style={{
          padding: '14px 20px', background: `linear-gradient(135deg,${S.P},rgba(var(--md-primary-rgb),0.85))`,
          display: 'flex', alignItems: 'center', gap: 12, color: '#fff',
        }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
            CX
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 800 }}>Chat Simulation</div>
            <div style={{ fontSize: 11, opacity: 0.8 }}>Live conversation preview</div>
          </div>
          <div style={{ fontSize: 11, opacity: 0.7 }}>● Live</div>
        </div>

        {/* Messages */}
        <div style={{ padding: 18, minHeight: 340, maxHeight: 520, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Show all completed steps as messages */}
          {steps.slice(0, step).map((s, i) => (
            <div key={i}>
              <div style={{ display: 'flex', marginBottom: 3, justifyContent: 'flex-start' }}>
                <div style={{
                  maxWidth: '85%', padding: '10px 16px', borderRadius: '14px 14px 14px 5px',
                  fontSize: 14, lineHeight: 1.6,
                  background: S.SV, color: S.OnS, border: `1px solid ${S.Out}`,
                }}>
                  <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 4, color: S.OnSV }}>👤 Customer</div>
                  <div>{s.customer}</div>
                </div>
              </div>
              <div style={{ display: 'flex', marginBottom: 5, justifyContent: 'flex-end' }}>
                <div style={{
                  maxWidth: '85%', padding: '10px 16px', borderRadius: '14px 14px 5px 14px',
                  fontSize: 14, lineHeight: 1.6,
                  background: `linear-gradient(135deg,${S.P},rgba(var(--md-primary-rgb),0.85))`,
                  color: '#fff',
                }}>
                  <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 4, opacity: 0.8 }}>🟢 Agent Reply</div>
                  <div>{s.agent}</div>
                  {s.tag && <div style={{ fontSize: 11, marginTop: 5, opacity: 0.7, fontWeight: 700 }}>#{s.tag}</div>}
                </div>
              </div>
              {s.note && (
                <div style={{ fontSize: 12, color: S.OnSV, fontStyle: 'italic', padding: '6px 12px', marginBottom: 5, background: 'rgba(var(--md-primary-rgb),0.05)', borderRadius: 8, borderLeft: `3px solid ${S.P}` }}>
                  💡 {s.note}
                </div>
              )}
            </div>
          ))}

          {/* Current step - show customer message first */}
          {!isComplete && currentStep && (
            <div>
              <div style={{ display: 'flex', marginBottom: 3, justifyContent: 'flex-start' }}>
                <div style={{
                  maxWidth: '85%', padding: '10px 16px', borderRadius: '14px 14px 14px 5px',
                  fontSize: 14, lineHeight: 1.6,
                  background: S.SV, color: S.OnS, border: `1px solid ${S.Out}`,
                  animation: 'fadeIn 0.3s ease',
                }}>
                  <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 4, color: S.OnSV }}>👤 Customer</div>
                  <div>{currentStep.customer}</div>
                </div>
              </div>

              {/* Agent reply (revealed) or waiting for user */}
              {revealed ? (
                <div style={{ display: 'flex', marginBottom: 5, justifyContent: 'flex-end', animation: 'fadeIn 0.3s ease' }}>
                  <div style={{
                    maxWidth: '85%', padding: '10px 16px', borderRadius: '14px 14px 5px 14px',
                    fontSize: 14, lineHeight: 1.6,
                    background: `linear-gradient(135deg,${S.P},rgba(var(--md-primary-rgb),0.85))`,
                    color: '#fff',
                  }}>
                    <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 4, opacity: 0.8 }}>🟢 Agent Reply</div>
                    <div>{currentStep.agent}</div>
                    {currentStep.tag && <div style={{ fontSize: 11, marginTop: 5, opacity: 0.7, fontWeight: 700 }}>#{currentStep.tag}</div>}
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px 0' }}>
                  <div style={{
                    padding: '8px 18px', borderRadius: 24, fontSize: 13, color: S.OnSV,
                    background: S.SV, border: `1px dashed ${S.Out}`, fontStyle: 'italic',
                  }}>
                    Click "Show Reply" to reveal agent response →
                  </div>
                </div>
              )}

              {revealed && currentStep.note && (
                <div style={{ fontSize: 12, color: S.OnSV, fontStyle: 'italic', padding: '6px 12px', marginBottom: 5, background: 'rgba(var(--md-primary-rgb),0.05)', borderRadius: 8, borderLeft: `3px solid ${S.P}` }}>
                  💡 {currentStep.note}
                </div>
              )}

              {revealed && currentStep.action && (
                <div style={{ fontSize: 12, padding: '8px 14px', marginBottom: 5, background: 'rgba(76,175,80,0.08)', borderRadius: 8, borderLeft: `3px solid ${S.Ter}` }}>
                  <span style={{ fontWeight: 700, color: S.Ter }}>✅ Action Required: </span>
                  <span style={{ color: S.OnSV }}>{currentStep.action}</span>
                </div>
              )}
            </div>
          )}

          {/* Completion message */}
          {isComplete && (
            <div style={{ textAlign: 'center', padding: 28, animation: 'fadeIn 0.3s ease' }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>✅</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: S.Ter, marginBottom: 10 }}>Scenario Complete!</div>
              <div style={{ fontSize: 14, color: S.OnSV, lineHeight: 1.7, maxWidth: 480, margin: '0 auto' }}>
                {outcome}
              </div>
              {summary && (
                <div style={{ marginTop: 16, fontSize: 13, color: S.OnSV, background: S.SV, borderRadius: 10, padding: '12px 18px', textAlign: 'left', lineHeight: 1.7 }}>
                  <strong style={{ color: S.OnS }}>Key takeaways:</strong> {summary}
                </div>
              )}
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 12 }}>
        <button onClick={handleNext}
          style={{
            flex: 1, padding: '14px 24px', borderRadius: 14, border: 'none',
            background: isComplete ? S.SV : `linear-gradient(135deg,${S.P},rgba(var(--md-primary-rgb),0.85))`,
            color: isComplete ? S.OnSV : '#fff',
            fontSize: 14, fontWeight: 800, cursor: isComplete ? 'default' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            opacity: isComplete ? 0.5 : 1,
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
              {isComplete ? 'check' : revealed ? 'arrow_forward' : 'visibility'}
            </span>
            {isComplete ? 'Completed' : revealed ? 'Next Message →' : 'Show Reply'}
          </button>
        <button onClick={handleReset}
          style={{
            padding: '14px 24px', borderRadius: 14,
            border: `1px solid ${S.Out}`, background: S.SV,
            color: S.OnS, fontSize: 14, fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 7, whiteSpace: 'nowrap',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>refresh</span>
            Reset
          </button>
      </div>
    </div>
  );
}

// ────── SCENARIO DATA ──────

const SCENARIOS = [
  {
    id: 'food-quality',
    icon: 'restaurant',
    title: 'Food Quality Issue — Wrong Item Delivered',
    steps: [
      {
        customer: 'Hi, I ordered a Margherita pizza but I received a Veggie Supreme instead. This is really disappointing.',
        agent: 'I sincerely apologise for the mix-up with your order. I completely understand your frustration. Let me check your order details and get this sorted for you right away.',
        tag: 'Apology',
        note: 'Always start with a genuine apology. Never make excuses.',
        action: 'Check order in SAAS → Verify items vs what was delivered',
      },
      {
        customer: 'This has never happened before. I want this fixed.',
        agent: 'I can see this is your first time reporting an issue — thank you for your patience. Since this is a genuine blunder from our end, I\'d like to offer you a credit of ₹100 as a gesture of compensation. Would that be acceptable?',
        tag: 'Credit Resolution',
        note: 'Check N-1 history. First-time complaint → process credit. Repeat → different flow.',
        action: 'Confirm N-1 has no previous refund → Process credit in SAAS',
      },
      {
        customer: 'Yes, that\'s fine. How will I receive it?',
        agent: 'The credit of ₹100 has been added to your EatClub wallet and will be applied to your next order automatically. You\'ll see it reflected immediately. I apologise again for the inconvenience caused today.',
        tag: 'Credit Confirmation',
        note: 'Always confirm the credit amount and how/when the customer will receive it.',
      },
      {
        customer: 'Okay, thank you for sorting it out.',
        agent: 'You\'re welcome! Is there anything else I can help you with before we wrap up?',
        tag: '2 Closing Initiation',
        note: 'Always ask if there\'s anything else — don\'t rush to close.',
      },
      {
        customer: 'No, that\'s all. Thanks!',
        agent: 'Thank you! Could you please take a moment to rate your experience? Your feedback helps us improve. Have a great day! 😊',
        tag: '3 Closing Rating → 4 Closing Final',
        note: 'Rating: Food issue → 1★ Food, Experience → 3★ (if resolved well). Never skip closing sequence.',
      },
    ],
    outcome: 'Customer received ₹100 wallet credit for the wrong item. Chat closed with standard #2 → #3 → #4 sequence. Rating set to Food: 1★, Experience: 3★.',
    summary: 'Always apologize first, verify the issue, check N-1 history, process credit for genuine first-time blunders, and never skip the closing sequence.',
  },
  {
    id: 'missing-item',
    icon: 'inventory_2',
    title: 'Missing Item — Partial Delivery',
    steps: [
      {
        customer: 'Hello, I ordered Chicken Biryani and 2 Garlic Breads, but I only got the Biryani. The Garlic Breads are missing.',
        agent: 'I\'m really sorry to hear that your order arrived incomplete. Let me check the details and get this sorted for you. Could you please confirm — were the Garlic Breads in a separate sealed package or were they missing from the bag entirely?',
        tag: 'Drill Missing',
        note: 'Drill for details: sealed package = restaurant missed it. Open bag = DM issue.',
        action: 'Check order items in SAAS vs what customer received',
      },
      {
        customer: 'They\'re just not in the bag at all. I checked everything.',
        agent: 'Thank you for confirming. I can see the Garlic Breads (x2) valued at ₹180 were part of your order. Since this is a clear miss from the restaurant, I\'ll process a full refund for the missing items. You\'ll receive ₹180 back to your original payment method within 24-48 hours.',
        tag: 'Missing Item',
        note: 'For missing items, always refund the value of the missing item(s), not the entire order.',
        action: 'Process refund in SAAS for missing item value → Tag: ProductMissing',
      },
      {
        customer: 'Okay, thank you. Will I get a confirmation?',
        agent: 'Yes, you\'ll receive an email confirmation once the refund is processed. I sincerely apologise for the inconvenience. Is there anything else I can help you with?',
        tag: '2 Closing Initiation',
      },
      {
        customer: 'No, that\'s all. Thanks for your help!',
        agent: 'Thank you for your understanding! Please take a moment to rate your experience. Have a great day! 😊',
        tag: '3 Closing Rating → 4 Closing Final',
        note: 'Rating: Missing item → Food: 3★, Experience: 3★.',
      },
    ],
    outcome: 'Customer received ₹180 refund for missing Garlic Breads. Refund processed to original payment method. Chat closed with standard sequence.',
    summary: 'Always confirm which items are missing, verify against the order, refund only the value of missing items, and send confirmation.',
  },
  {
    id: 'delivery-late',
    icon: 'schedule',
    title: 'Delivery Issue — Order is Late',
    steps: [
      {
        customer: 'Where is my order? It\'s been 50 minutes and it still says "Preparing". This is too long!',
        agent: 'I completely understand your frustration with the wait. Let me check the status of your order right away and find out what\'s happening.',
        note: 'Check order status in SAAS: Prepared/Received = outlet fault. Dispatched = DM fault.',
        action: 'Check SAAS → Current order status → Determine fault source',
      },
      {
        customer: 'I\'ve been waiting for almost an hour now.',
        agent: 'I can see your order has been prepared but is delayed from the outlet side. I sincerely apologise for this. I\'d like to offer you a ₹75 credit on your current order as a gesture of apology. Your order should be dispatched shortly.',
        tag: 'Late Order Apology',
        note: 'Delay tiers: <15min = apology only. 15-30min = ₹20-50 credit. 30-60min = ₹50-100 credit. >60min = full/item refund.',
        action: 'Apply appropriate credit based on delay time → Set rating: Food: 5★, Experience: 3★',
      },
      {
        customer: 'Alright, I appreciate the credit. When will it arrive?',
        agent: 'Your order is being dispatched now and should reach you within the next 15-20 minutes. The ₹75 credit will be applied to this order automatically. I apologise again for the delay!',
        tag: 'Late Order Discount',
      },
      {
        customer: 'Okay, thank you.',
        agent: 'You\'re welcome! Is there anything else I can help you with?',
        tag: '2 Closing Initiation',
      },
      {
        customer: 'No, that\'s all.',
        agent: 'Thank you for your patience! Please rate your experience when you get a moment. Have a wonderful day! 😊',
        tag: '3 Closing Rating → 4 Closing Final',
      },
    ],
    outcome: 'Customer received ₹75 credit for 50-min delay. Order dispatched and expected in 15-20 mins. Rating: Food 5★, Experience 3★.',
    summary: 'Check order status first, determine fault (outlet vs DM), apply correct delay tier compensation, and set ratings accordingly.',
  },
  {
    id: 'delivery-undelivered',
    icon: 'location_off',
    title: 'Delivery Issue — Not Delivered (Marked Delivered)',
    steps: [
      {
        customer: 'My order shows as delivered on the app, but I haven\'t received anything! This is a serious issue.',
        agent: 'I understand this is very concerning. Let me look into this immediately and get to the bottom of it.',
        note: 'This is a critical issue. Check SAAS delivery status first.',
        action: 'Check SAAS → Verify delivery status and DM details',
      },
      {
        customer: 'I\'ve been home the whole time. Nobody came.',
        agent: 'I can see the order was marked as delivered by the delivery partner. This is unacceptable. Let me contact the delivery partner immediately to verify. Could you please confirm your complete address and a contact number where we can reach you?',
        tag: 'Early Assigning Contact',
        note: 'Send #Early Assigning Contact hash. Tag: EarlyAssigning [DM250].',
        action: 'Try calling DM → If unresponsive, escalate to operations',
      },
      {
        customer: 'My address is correct. They just didn\'t deliver it.',
        agent: 'I\'ve escalated this to our operations team. Since the order was not delivered despite being marked as complete, I\'m processing a full refund for your order. You\'ll receive the amount back within 24-48 hours. I sincerely apologise for this experience.',
        tag: 'Credit Resolution',
        note: 'Full refund for non-delivered orders. Rating: Food: 5★ (not eaten), Experience: 1★.',
        action: 'Process full refund in SAAS → Tag: EarlyAssigning → Set rating 1★ Experience',
      },
      {
        customer: 'This should not have happened. I expect better.',
        agent: 'You\'re absolutely right, and I apologise from the bottom of my heart. This has been flagged to our team to ensure it doesn\'t happen again. Is there anything else I can help you with?',
        tag: '2 Closing Initiation',
      },
    ],
    outcome: 'Full refund processed. DM penalised (EarlyAssigning tag, DM250). Rating: Food 5★, Experience 1★. Escalated to operations.',
    summary: 'Non-delivered orders always get full refund. Tag the DM. Rating: 1★ Experience. Escalate to operations team.',
  },
  {
    id: 'payment-failed',
    icon: 'credit_card_off',
    title: 'Payment Failed — Amount Debited',
    steps: [
      {
        customer: 'I tried to place an order but it failed. However, the money has been deducted from my account. What do I do?',
        agent: 'I understand your concern. Let me check the transaction status in our system and help you get this resolved.',
        note: 'Always check SAAS → Failed TXN section first.',
        action: 'Check SAAS → Failed Transactions → Verify if debited but not placed',
      },
      {
        customer: 'Yes, I have the SMS confirming the debit. But no order was placed.',
        agent: 'I can see the transaction in our failed payments queue. The amount has been deducted but the order was not confirmed. I\'m processing an immediate refund from our end. The amount will be credited back to your account within 24-48 hours. You can try placing the order again.',
        tag: 'Transaction Issue',
        note: 'Process refund from SAAS directly. The refund comes from the merchant side.',
        action: 'Process refund in SAAS Failed TXN section → Confirm with customer',
      },
      {
        customer: 'Okay, please make sure it goes through quickly.',
        agent: 'Absolutely. I\'ve initiated the refund and you\'ll receive a confirmation email shortly. I apologise for the inconvenience. Is there anything else I can help you with?',
        tag: '2 Closing Initiation',
      },
    ],
    outcome: 'Refund initiated for failed transaction. Customer advised to re-order. No rating needed since order wasn\'t placed.',
    summary: 'Check Failed TXN in SAAS. Process refund immediately. No food/experience rating since order was not delivered.',
  },
  {
    id: 'cancellation',
    icon: 'cancel',
    title: 'Customer Wants to Cancel',
    steps: [
      {
        customer: 'I need to cancel my order. I accidentally ordered from the wrong restaurant.',
        agent: 'I understand you need to cancel. Let me check the current status of your order first.',
        note: 'NEVER cancel without checking order status first!',
        action: 'Check order status in SAAS: Placed / Received / Prepared / Dispatched',
      },
      {
        customer: 'It just went through a few minutes ago.',
        agent: 'Your order is in "Placed" status, so we can still process a cancellation. Please note that since the preparation has started, there may be a small cancellation fee. I\'ll proceed with the cancellation now. Would you like me to go ahead?',
        tag: 'Cancel - No Refund',
        note: 'Placed/Received/Prepared → can cancel but food waste applies. Dispatched → cannot cancel (food en route). 1-min window for free cancellation.',
        action: 'If within 1-min window → Free cancellation. Otherwise → #Cancel - No Refund',
      },
      {
        customer: 'Yes, please cancel it.',
        agent: 'Cancellation has been processed. Since the food was already being prepared, a nominal cancellation fee of ₹XX applies. The remaining amount will be refunded to your original payment method within 24-48 hours. I apologise for any inconvenience.',
        tag: 'Cancel - No Refund',
        note: 'If the customer insists, escalate to L2 with #Refund Source.',
      },
    ],
    outcome: 'Order cancelled. Customer informed about cancellation policy. Partial refund processed where applicable.',
    summary: 'Always check order status before cancelling. Placed/Received/Prepared = cancellable. Dispatched = cannot cancel. Use 1-min window for free cancellation.',
  },
  {
    id: 'refund-request',
    icon: 'payments',
    title: 'Refund Request — Post-Resolution',
    steps: [
      {
        customer: 'I want a refund for my last order. The food quality was not good and I\'m not satisfied.',
        agent: 'I understand you\'re unhappy with your order. Let me check your order history and see how I can help.',
        note: 'Check N-1 order history FIRST. This determines everything.',
        action: 'Check N-1 order → Does it have a previous refund?',
      },
      {
        customer: 'I\'ve ordered from you many times before.',
        agent: 'Thank you for being a regular customer! I can see your previous order (N-1) did not have any refund issued, and your order history shows good standing. Since this is a first-time complaint and a genuine quality concern, I\'m happy to process a refund of ₹120 as a gesture of goodwill.',
        tag: 'Credit Resolution',
        note: 'N-1 has NO refund → Approve (if genuine). N-1 HAS refund → Check N-2/N-3 → May deny.',
        action: 'Process credit/refund → Confirm amount with customer',
      },
      {
        customer: 'Thank you, that works.',
        agent: 'The refund of ₹120 has been processed to your EatClub wallet and will be available immediately. I apologise for the experience. Is there anything else I can help with?',
        tag: 'Credit Confirmation',
      },
    ],
    outcome: 'Customer received ₹120 wallet credit. N-1 was clean with no previous refunds. Chat resolved amicably.',
    summary: 'Always check N-1 first. Clean N-1 + genuine issue = approve. Repeat refunds = deny with #Fake CX templates. Wallet credits are faster than bank refunds.',
  },
];

// ────── MAIN COMPONENT ──────

export default function ChatFlows() {
  const [active, setActive] = useState('food-quality');
  const [resetKey, setResetKey] = useState(0);
  const scenario = SCENARIOS.find(s => s.id === active);

  const handleTabChange = (id) => {
    setActive(id);
    setResetKey(prev => prev + 1);
  };

  return (
    <div className="page-content">
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .cf-tab-bar { display: flex; gap: 10px; margin-bottom: 22px; overflow-x: auto; padding-bottom: 4px; flex-wrap: wrap; }
        .cf-tab-btn { padding: 10px 20px; border-radius: 100px; border: 1px solid var(--md-outline); background: var(--md-surface-variant); color: var(--md-on-surface-var); font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.2s; white-space: nowrap; display: flex; align-items: center; gap: 8px; }
        .cf-tab-btn:hover { border-color: var(--md-primary); background: rgba(var(--md-primary-rgb),0.08); color: var(--md-on-surface); }
        .cf-tab-btn.active { background: var(--md-primary); color: #fff; border-color: var(--md-primary); }
      `}</style>

      {/* Hero */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '20px 28px', marginBottom: 26, borderRadius: 20, background: 'linear-gradient(135deg, rgba(var(--md-primary-rgb),0.12), rgba(var(--md-primary-rgb),0.04))', border: '1px solid rgba(var(--md-primary-rgb),0.25)' }}>
        <div style={{ width: 56, height: 56, borderRadius: 18, background: 'var(--md-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 8px 24px rgba(var(--md-primary-rgb),0.35)' }}>
          <span className="material-symbols-outlined" style={{ color: 'white', fontSize: 30 }}>forum</span>
        </div>
        <div>
          <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--md-on-surface)', letterSpacing: '-0.3px', marginBottom: 3 }}>Chat Flows & SOPs</div>
          <div style={{ fontSize: 14, color: 'var(--md-on-surface-var)', lineHeight: 1.6 }}>
            Interactive chat simulations — Click through real scenarios to learn agent responses, hash tags, and resolution flows
          </div>
        </div>
        <div style={{ marginLeft: 'auto', flexShrink: 0 }}>
          <div className="chip" style={{ background: 'rgba(76,175,80,0.12)', color: '#4CAF50', fontSize: 12, fontWeight: 800 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 14, verticalAlign: 'middle', marginRight: 5 }}>play_arrow</span>
            Interactive Training
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="cf-tab-bar">
        {SCENARIOS.map(s => (
          <button key={s.id} className={`cf-tab-btn ${active === s.id ? 'active' : ''}`} onClick={() => handleTabChange(s.id)}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{s.icon}</span>
            {s.title.split(' — ')[0]}
          </button>
        ))}
      </div>

      {/* Simulator */}
      {scenario && <ChatSimulator key={resetKey} scenario={scenario} onReset={() => {}} />}
    </div>
  );
}
