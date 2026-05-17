import { useState } from 'react';

const TPL_CATEGORIES = [
  'All',
  'OOS & Cancellation',
  'Not Reachable',
  'Fake Order',
  'Infra Issues',
  'DM & Delivery',
  'Customer Calls',
  'Service & Discount',
  'Zomato Platform'
];

const TPL_DATA = [
  {
    id: 'oos-cancel-1',
    title: 'Item OOS — Customer Refuses Alternate (Cancellation)',
    category: 'OOS & Cancellation',
    tag: 'Out of Stock',
    rating: '(1-1) ⭐',
    ratingColor: '#F44336',
    action: 'Call Outlet',
    fields: [
      { label: 'Outlet OOS Item', placeholder: '___________', key: 'oos_item' },
      { label: 'Nearby Outlet Issue', placeholder: '___________', key: 'nearby_issue' }
    ],
    template: `Outlet me [OOS_ITEM] oos hai customer ko sara menu bata diya hai customer ready nahi hai alternate ke liye customer ko free food ke liye bhi bola hai but customer Ready nahi hai TRF Possible nahi hai because nearby outlet [NEARBY_ISSUE] isliye order ko cancel kiya ja raha hai`,
    note: '⚠️ Rating: 1 star Food + 1 star Experience | Action: Call Outlet'
  },
  {
    id: 'oos-transfer-1',
    title: 'Item OOS — Customer Agrees for Sampling/Transfer',
    category: 'OOS & Cancellation',
    tag: 'CC other',
    rating: '(5-5) ⭐⭐⭐⭐⭐',
    ratingColor: '#4CAF50',
    action: 'Call Outlet (For Outlet Active)',
    fields: [
      { label: 'OOS Item', placeholder: '___________', key: 'oos_item' },
      { label: 'Customer Alternative', placeholder: '___________', key: 'cx_alt' },
      { label: 'Tracking ID', placeholder: '___________', key: 'tracking_id' }
    ],
    template: `Outlet me [OOS_ITEM] oos hai customer [CX_ALT] ke liye agree hai customer ka order sampling me place kiya hai Tracking id [TRACKING_ID].`,
    note: '⚠️ Prep time > 10 min → Call Outlet | Before 10 min → Inform concerned, resolve in 10 min'
  },
  {
    id: 'oos-transfer-no-confirm',
    title: 'OOS Transfer — No Outlet Confirmation',
    category: 'OOS & Cancellation',
    tag: 'CC other',
    rating: '(5-5) ⭐⭐⭐⭐⭐',
    ratingColor: '#4CAF50',
    action: 'Call DM if FND > 5 min and Distance > 100m',
    fields: [],
    template: `Out Of Stock Transfer — Outlet ko 2 baar call attempt kiya hai transfer confirmation ke liye outlet ke end se koi response nahi tha isliye transfer kar diya hai Without confirmation`,
    note: '⚠️ Call DM: FND > 5 min AND Distance > 100 m case pr call karna h'
  },
  {
    id: 'oos-transfer-cx-disagree',
    title: 'Item OOS — Transfer After Outlet Confirmation (CX Disagrees Modification)',
    category: 'OOS & Cancellation',
    tag: 'CC other',
    rating: '(5-5) ⭐⭐⭐⭐⭐',
    ratingColor: '#4CAF50',
    action: 'Call Outlet',
    fields: [],
    template: `Item oos hai modification ke liye customer agree nahi hai isliye order ko transfer kiya hai outlet se confirmation karne ke baad`,
    note: '⚠️ Always confirm with outlet before transfer in this case'
  },
  {
    id: 'nr-cancel-address',
    title: 'Not Reachable — Incomplete Address (Cancellation)',
    category: 'Not Reachable',
    tag: 'CC other',
    rating: '(5-5) ⭐⭐⭐⭐⭐',
    ratingColor: '#4CAF50',
    action: 'Cancel Order',
    fields: [
      { label: 'Minutes / Hours elapsed', placeholder: '______mins/hour', key: 'time_elapsed' }
    ],
    template: `DM customer ke address per hai address proper nahi hai koi flat no./shop no. ya koi society ka name mention nahi hai customer call answer nahi kar rahe hai — kalerya/personal dono se bhi — and customer ko WhatsApp message / call kiya hai customer ka wahan se bhi response nahi hai order ko almost [TIME_ELAPSED] ho gaya hai isliye order ko cancel kar rahe hain`,
    note: '⚠️ Must attempt: Kalerya call + Personal call + WhatsApp message before cancellation'
  },
  {
    id: 'nr-cancel-security',
    title: 'Not Reachable — Security Blocking Entry (Cancellation)',
    category: 'Not Reachable',
    tag: 'CC other',
    rating: '(5-5) ⭐⭐⭐⭐⭐',
    ratingColor: '#4CAF50',
    action: 'Cancel Order',
    fields: [
      { label: 'DM Wait Time (mins)', placeholder: '______min', key: 'dm_wait' }
    ],
    template: `DM customer ke address per hai security without approval entry nahi de raha hai customer ko call kiya hai but customer call answer nahi kar rahe hai — WhatsApp per bhi customer ka koi response nahi hai — personal number se bhi koi response nahi de raha hai security food rakhne se mana kar rahe hai DM last [DM_WAIT] min se security ke paas khade hai isliye order cancel kiya ja rahi hai`,
    note: '⚠️ Document: Kalerya + Personal + WhatsApp attempts before raising cancellation'
  },
  {
    id: 'nr-security-deliver',
    title: 'Not Reachable — Security Gate, Mark Delivered',
    category: 'Not Reachable',
    tag: 'CC other',
    rating: '(5-5) ⭐⭐⭐⭐⭐',
    ratingColor: '#4CAF50',
    action: 'Instruct DM to leave at Security',
    fields: [
      { label: 'DM Wait Time (mins)', placeholder: '______min', key: 'dm_wait' }
    ],
    template: `Customer call answer nahi kar raha hai WhatsApp per bhi koi response nahi hai kalerya and personal number se bhi try kar liya hai DM last [DM_WAIT] min se security gate per khade hai customer ka approval nahi aa raha hai isliye security se baat karke order ko security ke paas rakh ke delivered mark karne bola hai DM ko`,
    note: '⚠️ Use only when security agrees to receive order on customer behalf'
  },
  {
    id: 'nr-call-attempt-1',
    title: 'CC Call Attempt 1 — Entry Denied',
    category: 'Not Reachable',
    tag: 'CC other',
    rating: '(5-5) ⭐⭐⭐⭐⭐',
    ratingColor: '#4CAF50',
    action: 'DM to wait 10 mins',
    fields: [],
    template: `Customer call answer nahi kar rahe hai entry allowed nahi hai DM security gate per hai customer ko WhatsApp message bhi kiya hai DM ko 10 min wait karne bola hai location per`,
    note: '⚠️ This is Attempt 1 — Follow up required after 10 minutes'
  },
  {
    id: 'nr-call-attempt-doorbell',
    title: 'CC Call Attempt — No Doorbell Response',
    category: 'Not Reachable',
    tag: 'CC other',
    rating: '(5-5) ⭐⭐⭐⭐⭐',
    ratingColor: '#4CAF50',
    action: 'DM to wait 10 mins',
    fields: [],
    template: `Customer call answer nahi kar raha hai door bell press karne pe bhi koi response nahi mil raha hai isliye DM ko 10 mins wait karne bola hai`,
    note: '⚠️ Follow up after 10 mins — escalate if still no response'
  },
  {
    id: 'fake-cod-new',
    title: 'Fake Order — COD, Incomplete Address, First Order',
    category: 'Fake Order',
    tag: 'CC other',
    rating: '(5-5) ⭐⭐⭐⭐⭐',
    ratingColor: '#4CAF50',
    action: 'Cancel as Fake | ⚠️ SENIOR APPROVAL REQUIRED',
    fields: [
      { label: 'Customer Phone Number', placeholder: '_______', key: 'cx_phone' }
    ],
    template: `COD order hai customer address proper mention nahi kiye hai address me building name flat number missing hai DM customer ke diye huwe location per khada hai customer ka number [CX_PHONE] hai and ye first order hai isliye order ko fake consider karke cancel kar rahe hai`,
    note: '🚨 SENIOR APPROVAL REQUIRED for new employees. First order + COD + Incomplete address = Fake criteria'
  },
  {
    id: 'fake-cod-repeat',
    title: 'Fake Order — COD, Previous Orders Delivered, Now Refusing',
    category: 'Fake Order',
    tag: 'CC other',
    rating: '(5-5) ⭐⭐⭐⭐⭐',
    ratingColor: '#4CAF50',
    action: 'Cancel as Fake',
    fields: [],
    template: `COD order hai customer ke previous orders delivered hua hai abhi customer bol rahe hai ke mai order nahi le sakta hun location per nahi hun by mistake order place ho gaya hai isliye fake consider karke order ko cancel kiya ja raha hai`,
    note: '⚠️ Must verify: previous order history delivered before using this template'
  },
  {
    id: 'infra-outlet-cancel',
    title: 'Outlet Infra Issue — Cancellation (No TRF Possible)',
    category: 'Infra Issues',
    tag: 'CC other',
    rating: '(5-5) ⭐⭐⭐⭐⭐',
    ratingColor: '#4CAF50',
    action: 'Deactivate Outlet + Cancel Order',
    fields: [
      { label: 'Infra Issue Type', placeholder: '_________', key: 'infra_issue' },
      { label: 'TRF Not Possible Reason', placeholder: '______', key: 'trf_reason' }
    ],
    template: `Outlet me [INFRA_ISSUE] hua hai isliye outlet closed karwa diya hai ek bhi order delivered nahi ho payega bataya hai abhi ke liye outlet deactivate hai isliye order cancel kar rahe hai because TRF possible nahi hai [TRF_REASON]`,
    note: '⚠️ Deactivate outlet first, then cancel all pending orders'
  },
  {
    id: 'infra-cx-calls-cancel',
    title: 'Infra Issue — Customer Called, Order Cancelled',
    category: 'Infra Issues',
    tag: 'CC other',
    rating: '(5-5) ⭐⭐⭐⭐⭐',
    ratingColor: '#4CAF50',
    action: 'Cancel Order',
    fields: [
      { label: 'Infra Issue Type', placeholder: '____________', key: 'infra_issue' }
    ],
    template: `Customer ne call kiya tha order status ke liye but unfortunately ye order deliver nahi ho pa raha hai because outlet me [INFRA_ISSUE] issue hai isliye order ko cancel kiya ja raha hai`,
    note: '⚠️ Inform customer clearly about the issue before cancellation'
  },
  {
    id: 'infra-cx-calls-reschedule',
    title: 'Infra Issue — Customer Called, Reschedule Next Day',
    category: 'Infra Issues',
    tag: 'CC other',
    rating: '(5-5) ⭐⭐⭐⭐⭐',
    ratingColor: '#4CAF50',
    action: 'Modify Cancel → Reschedule',
    fields: [
      { label: 'Infra Issue Type', placeholder: '____________', key: 'infra_issue' }
    ],
    template: `Customer ne call kiya tha order status ke liye but unfortunately ye order deliver nahi ho pa raha hai because outlet me [INFRA_ISSUE] issue hai isliye customer ko free food ke liye reschedule ka bataya hai CX agree hai isliye ye order ko modify me cancel karke kal ke liye reschedule karwaya hai`,
    note: '⚠️ Use only when customer agrees to reschedule. Modify-cancel → Reschedule flow'
  },
  {
    id: 'dm-hold-location',
    title: 'DM Delivery HOLD — Wrong Location',
    category: 'DM & Delivery',
    tag: 'CC other',
    rating: '(5-5) ⭐⭐⭐⭐⭐',
    ratingColor: '#4CAF50',
    action: 'Apply HOLD tag',
    fields: [
      { label: 'Distance from correct address (km)', placeholder: '_____km', key: 'distance' }
    ],
    template: `Customer ka location wrong hai new address customer ka DM ke location se [DISTANCE] km hai isliye hold tag lagaya ja raha hai`,
    note: '⚠️ Apply HOLD — do not cancel. Contact customer to confirm correct address'
  },
  {
    id: 'dm-hold-40min',
    title: 'DM Delivery HOLD — 40 Minutes Dispatched',
    category: 'DM & Delivery',
    tag: 'CC other',
    rating: '(5-5) ⭐⭐⭐⭐⭐',
    ratingColor: '#4CAF50',
    action: 'Apply HOLD tag + Wait 10 mins',
    fields: [],
    template: `Order dispatched huwe 40 min ho raha hai customer ka address per DM hai CX ko WhatsApp message bhi kiya hai DM ko bataya hai ke hold tag lagaya ja raha hai 10 min aur wait karne bola gaya hai`,
    note: '⚠️ 40 min dispatched threshold for HOLD tag'
  },
  {
    id: 'dm-change-request',
    title: 'DM Change Request — Outlet Called',
    category: 'DM & Delivery',
    tag: 'CC other',
    rating: '(5-5) ⭐⭐⭐⭐⭐',
    ratingColor: '#4CAF50',
    action: 'Reassign DM',
    fields: [
      { label: 'DM Issue Type', placeholder: '_________', key: 'dm_issue' },
      { label: 'Old DM Name', placeholder: '__________', key: 'old_dm' },
      { label: 'New DM Name', placeholder: '__________', key: 'new_dm' }
    ],
    template: `Outlet se call aya hai DM change karne ke liye DM ka [DM_ISSUE] issue hai DM [OLD_DM] ke naam se change karke [NEW_DM] ke naam per assign kar rahe hai`,
    note: '⚠️ Outlet must call to request DM change — document old DM name and new DM name'
  },
  {
    id: 'cx-order-status-late',
    title: 'Customer Call — Order Status / Late 60+',
    category: 'Customer Calls',
    tag: 'General_OrderLate_60+',
    rating: '(1-1) ⭐',
    ratingColor: '#F44336',
    action: 'Inform ETA',
    fields: [
      { label: 'Current Stage', placeholder: '_______stage', key: 'stage' },
      { label: 'ETA (mins)', placeholder: '_______min', key: 'eta' }
    ],
    template: `Customer ne call kiya tha order status ke liye abhi order [STAGE] stage per hai [ETA] min me delivered hoga customer ko inform kiya hai`,
    note: '⚠️ Tag: General_OrderLate_60+ | Rating: 1 star Food + 1 star Experience'
  },
  {
    id: 'cx-call-disconnect',
    title: 'Call Disconnect — Mistakenly by Agent',
    category: 'Customer Calls',
    tag: 'CC other',
    rating: '(5-5) ⭐⭐⭐⭐⭐',
    ratingColor: '#4CAF50',
    action: 'Call Back Customer',
    fields: [],
    template: `Customer ka call by mistakenly disconnect hua hai mere end se — dubara customer ko call karke resolution diya hai`,
    note: '⚠️ Always call back immediately when you disconnect by mistake'
  },
  {
    id: 'cx-special-instructions',
    title: 'Customer — Special Instructions Request',
    category: 'Customer Calls',
    tag: 'CC other',
    rating: '(5-5) ⭐⭐⭐⭐⭐',
    ratingColor: '#4CAF50',
    action: 'Inform Chef (No Guarantee)',
    fields: [],
    template: `Customer special instructions ke liye call kiye the customer ko inform kiya hai as per SOP order banaya jata hai hum chef ko inform to kar rahe hai but 100% ye follow hoga iske promise nahi kar paynge bataya hai`,
    note: '⚠️ Never promise 100% fulfillment of special instructions'
  },
  {
    id: 'cx-mobile-change',
    title: 'Customer — Mobile Number Change Request',
    category: 'Customer Calls',
    tag: 'CC other',
    rating: '(5-5) ⭐⭐⭐⭐⭐',
    ratingColor: '#4CAF50',
    action: 'Inform Outlet + DM',
    fields: [
      { label: 'New Mobile Number', placeholder: '_________', key: 'new_mobile' }
    ],
    template: `Customer ne call kiya tha mobile number change ke liye Customer new mobile no. [NEW_MOBILE] same inform kiya hai Outlet/DM ko.`,
    note: '⚠️ Inform both Outlet AND DM of the number change'
  },
  {
    id: 'cx-address-change',
    title: 'Customer — Address Change Request',
    category: 'Customer Calls',
    tag: 'CC other',
    rating: '(5-5) ⭐⭐⭐⭐⭐',
    ratingColor: '#4CAF50',
    action: 'Inform Outlet + DM',
    fields: [
      { label: 'New Address', placeholder: '__________', key: 'new_address' },
      { label: 'Customer Mobile Number', placeholder: '__________', key: 'cx_mobile' }
    ],
    template: `Customer new address [NEW_ADDRESS] customer mobile number [CX_MOBILE] same inform kiya hai Outlet/DM ko.`,
    note: '⚠️ Inform both Outlet AND DM of the address change'
  },
  {
    id: 'cx-cancel-online-paid',
    title: 'Customer Call — Cancellation Request (Online Paid)',
    category: 'Customer Calls',
    tag: 'CC other',
    rating: '(5-5) ⭐⭐⭐⭐⭐',
    ratingColor: '#4CAF50',
    action: 'Inform No Refund → Cancel if Agreed',
    fields: [],
    template: `Customer ne call kiya tha order cancellation ke liye online paid hai customer ko inform kiya hai ke agar abhi cancellation hota hai isme refund nahi ho payega and abhi order ko cancel kar diya ja raha hai customer agree hai isliye`,
    note: '⚠️ Must inform customer: Online paid cancellation = NO refund. Proceed only if customer agrees.'
  },
  {
    id: 'cx-cancel-cod-fake',
    title: 'Customer Call — COD Cancellation (Fake Reason)',
    category: 'Customer Calls',
    tag: 'CC other',
    rating: '(5-5) ⭐⭐⭐⭐⭐',
    ratingColor: '#4CAF50',
    action: 'Cancel as Fake',
    fields: [
      { label: 'Customer Reason', placeholder: '____________', key: 'cx_reason' }
    ],
    template: `COD order hai customer ka call aya hai cancellation ke liye because customer bata rahe hai [CX_REASON] isliye order ko fake me cancel kiya ja raha hai`,
    note: '⚠️ Document customer reason before marking as fake'
  },
  {
    id: 'cx-cancel-late-60',
    title: 'Late 60+ Cancellation — Customer Refuses Free Food/Full Refund',
    category: 'Customer Calls',
    tag: 'General_OrderLate_60+',
    rating: '(1-1) ⭐',
    ratingColor: '#F44336',
    action: 'Cancel Order',
    fields: [],
    template: `Order ko 1 hour ho gaya hai customer ko order cancel karna hai Free Food/Full Refund bhi offer kiya hai but customer agree nahi hai isliye order ko cancel kiya ja raha hai`,
    note: '⚠️ MUST offer Free Food + Full Refund first. Cancel only if customer refuses both.'
  },
  {
    id: 'service-discount',
    title: 'Service Discount — UPI/Netbanking Failure, Good History',
    category: 'Service & Discount',
    tag: 'CC other',
    rating: '(5-5) ⭐⭐⭐⭐⭐',
    ratingColor: '#4CAF50',
    action: 'Apply Service Discount',
    fields: [
      { label: 'Payment Method Failed', placeholder: '______UPI/Netbanking', key: 'payment_method' }
    ],
    template: `Customer ka [PAYMENT_METHOD] work nahi kar raha hai customer ka history kaafi accha hai previous orders delivered hue hai customer ko cash ke baare me pocha hai customer ke paas cash bhi available nahi hai customer ko pehle kabhi service discount nahi diya gaya hai cross check kiya hai isliye customer ko service discount diya ja raha hai and order delivery karwa rahe hai`,
    note: '⚠️ Checklist before applying: ✓ Good history ✓ Previous orders delivered ✓ Cash not available ✓ No prior service discount given ✓ Cross-checked'
  },
  {
    id: 'zomato-nr-initiate',
    title: 'Zomato — Customer Not Reachable: Initiate Chat with Z CC',
    category: 'Zomato Platform',
    tag: 'Zomato CC Chat',
    rating: 'N/A — Platform Resolution',
    ratingColor: '#FF5722',
    action: 'EC CC initiates chat with Zomato CC',
    fields: [],
    template: `We have encountered an issue with Order placed through the Zomato platform. Despite our best efforts, we have been unable to deliver the order due to an unreachable Customer Contact number. We kindly request your assistance in this matter. Please check and follow up with the customer and also take rider on conference. If the customer remains unresponsive and unreachable, we would appreciate your help in canceling the current order on behalf of Zomato.`,
    note: '⚠️ EC CC initiates the chat with Z CC when rider is at CX location and CX is unreachable'
  },
  {
    id: 'zomato-nr-rider-before-edt',
    title: 'Zomato — Rider Reached Before EDT, CX Not Reachable',
    category: 'Zomato Platform',
    tag: 'Zomato — Wait for EDT',
    rating: 'N/A',
    ratingColor: '#FF9800',
    action: 'No cancellation yet — Wait till EDT + 10 min',
    fields: [
      { label: 'EDT Time', placeholder: '7:00 PM', key: 'edt_time' }
    ],
    template: `Rider reached before EDT. No cancellation at this stage. Zomato asks to reach out at EDT + 10 min. Will inform Rider to call at EDT + 10 min & Cut rider call. If Zomato support is unable to reach CX — Zomato will initiate cancellation from their end.`,
    note: `⏱️ SCENARIO: Rider reached BEFORE EDT (e.g., at 6:50 PM, EDT = 7:00 PM)`
  },
  {
    id: 'zomato-nr-rider-on-edt',
    title: 'Zomato — Rider Reached on EDT Exactly',
    category: 'Zomato Platform',
    tag: 'Zomato — Push for CX Reachout',
    rating: 'N/A',
    ratingColor: '#FF9800',
    action: 'EC to push Zomato to reach CX now',
    fields: [],
    template: `Our rider is waiting at customer location for a while now. Request to please assist in this matter at the earliest.`,
    note: `⏱️ SCENARIO: Rider reached exactly on EDT (e.g., 7:00 PM)`
  },
  {
    id: 'zomato-nr-rider-after-edt',
    title: 'Zomato — Rider Reached After EDT + 10 min',
    category: 'Zomato Platform',
    tag: 'Zomato — Final Step',
    rating: 'N/A',
    ratingColor: '#4CAF50',
    action: 'Zomato contacts CX — Deliver or Cancel',
    fields: [],
    template: `We apologize for any inconvenience caused and thank you for your prompt attention to this urgent matter.`,
    note: `⏱️ SCENARIO: Rider reached AFTER EDT + 10 min (e.g., 7:15 PM)`
  },
  {
    id: 'zomato-nr-full-flow',
    title: 'Zomato CX Not Reachable — COMPLETE FLOW REFERENCE',
    category: 'Zomato Platform',
    tag: 'REFERENCE CARD',
    rating: 'Full SOP',
    ratingColor: '#7B1FA2',
    action: 'Read full flow before acting',
    fields: [],
    template: `ZOMATO CUSTOMER NOT REACHABLE — FULL SOP

STEP 1: RIDER REACHES CX LOCATION → CX UNREACHABLE
→ EC CC initiates chat with Z CC using standard NR template
→ Template: "We have encountered an issue with Order placed through the Zomato platform. Despite our best efforts, we have been unable to deliver the order due to an unreachable Customer Contact number. We kindly request your assistance..."

SCENARIO A — Rider before EDT (e.g., 6:50 PM, EDT = 7:00 PM):
→ NO cancellation yet
→ Zomato: "Wait till EDT + 10 min"
→ Inform rider to call at EDT + 10 min → Cut rider call
→ If Z CC can't reach CX → Zomato initiates cancellation

SCENARIO B — Rider arrives on EDT (7:00 PM):
→ EC CC PUSHES Zomato to reach CX NOW
→ If Zomato delays → inform rider to call at EDT + 10 min → Cut call
→ Follow-up: "Our rider is waiting at customer location for a while now. Request to please assist in this matter at the earliest."

SCENARIO C — Rider arrived after EDT + 10 min (7:15 PM+):
→ Zomato reaches CX
→ If CX Reachable: Z CC conference call Rider + CX + Z CC → Deliver → Z CC closes chat
→ If CX NOT Reachable: Zomato cancels
→ EC waits with rider on call for Zomato cancellation
→ Close: "We apologize for any inconvenience caused and thank you for your prompt attention to this urgent matter."`,
    note: '📌 Reference card — use this to understand the full Zomato NR flow before applying individual templates'
  }
];

export default function CCTemplates() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const filteredData = TPL_DATA.filter(t => {
    const matchesCategory = activeCategory === 'All' || t.category === activeCategory;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         t.template.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         t.tag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Group by category
  const groups = {};
  filteredData.forEach(t => {
    if (!groups[t.category]) groups[t.category] = [];
    groups[t.category].push(t);
  });

  return (
    <div className="page-content" style={{ animation: 'fadeIn 0.5s ease' }}>
      <div className="page-header" style={{ animation: 'gravityDrop 0.5s ease', marginBottom: 24 }}>
        <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 32, color: 'var(--md-primary)' }}>assignment</span>
          CC Templates
        </h1>
        <p className="page-subtitle">Copy-ready scripts, tags & ratings for every scenario · Click to copy instantly</p>
      </div>

      {/* Search Bar */}
      <div className="card" style={{ marginBottom: 24, padding: '16px 24px', animation: 'slideUp 0.4s ease' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span className="material-symbols-outlined" style={{ color: 'var(--md-on-surface-var)' }}>search</span>
          <input 
            type="text"
            placeholder="Search templates — OOS, Not Reachable, Fake Order, Zomato…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              flex: 1, 
              background: 'transparent', 
              border: 'none', 
              color: 'var(--md-on-surface)', 
              fontSize: '15px', 
              outline: 'none',
              fontFamily: 'inherit'
            }}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--md-on-surface-var)' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Filter */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32, animation: 'slideUp 0.45s ease' }}>
        {TPL_CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '8px 18px',
              borderRadius: '20px',
              border: '1.5px solid var(--md-outline)',
              background: activeCategory === cat ? 'var(--md-primary)' : 'transparent',
              color: activeCategory === cat ? 'white' : 'var(--md-on-surface)',
              fontSize: '13px',
              fontWeight: activeCategory === cat ? 700 : 500,
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
              transform: activeCategory === cat ? 'scale(1.05)' : 'scale(1)'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Templates List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 40, animation: 'slideUp 0.5s ease' }}>
        {Object.entries(groups).map(([cat, templates]) => (
          <div key={cat}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
              <div style={{ height: '2px', flex: 1, background: 'linear-gradient(90deg, var(--md-primary), transparent)', opacity: 0.3 }}></div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--md-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>{cat}</h2>
              <div style={{ height: '2px', flex: 1, background: 'linear-gradient(270deg, var(--md-primary), transparent)', opacity: 0.3 }}></div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20 }}>
              {templates.map(t => (
                <div key={t.id} className="card" style={{ 
                  padding: 0, 
                  overflow: 'hidden', 
                  border: '1px solid var(--md-outline)',
                  transition: 'transform 0.2s',
                  animation: 'springPop 0.4s ease'
                }}>
                  {/* Header */}
                  <div style={{ 
                    padding: '16px 20px', 
                    background: 'var(--md-surface-variant)', 
                    borderBottom: '1px solid var(--md-outline)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 12
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 900, fontSize: '17px', color: 'var(--md-on-surface)', letterSpacing: '-0.2px' }}>{t.title}</div>
                      <div style={{ display: 'flex', gap: 10, marginTop: 10, flexWrap: 'wrap' }}>
                        <span style={{ background: 'rgba(var(--md-primary-rgb), 0.15)', color: 'var(--md-primary)', padding: '4px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 800, border: '1px solid rgba(var(--md-primary-rgb), 0.2)' }}>🏷️ {t.tag}</span>
                        <span style={{ background: `${t.ratingColor}20`, color: t.ratingColor, padding: '4px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 900, border: `1px solid ${t.ratingColor}40` }}>⭐ {t.rating}</span>
                        <span style={{ background: 'rgba(var(--md-on-surface-var-rgb), 0.1)', color: 'var(--md-on-surface)', padding: '4px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, border: '1px solid var(--md-outline)' }}>⚡ {t.action}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleCopy(t.id, t.template)}
                      className="btn"
                      style={{ 
                        background: copiedId === t.id ? '#4CAF50' : 'var(--md-primary)',
                        color: 'white',
                        padding: '8px 16px',
                        fontSize: '13px',
                        borderRadius: '10px'
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{copiedId === t.id ? 'check' : 'content_copy'}</span>
                      {copiedId === t.id ? 'Copied!' : 'Copy'}
                    </button>
                  </div>

                  {/* Body */}
                  <div style={{ padding: '20px' }}>
                    <div style={{ 
                      background: 'var(--md-background)', 
                      padding: '18px 22px', 
                      borderRadius: '14px', 
                      fontFamily: 'var(--font-mono)', 
                      fontSize: '14.5px', 
                      lineHeight: '1.8',
                      color: 'var(--md-on-surface)',
                      border: '1.5px solid var(--md-outline)',
                      whiteSpace: 'pre-wrap',
                      userSelect: 'all',
                      cursor: 'text',
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                      {t.template}
                    </div>

                    {t.fields && t.fields.length > 0 && (
                      <div style={{ marginTop: 20, padding: '16px', background: 'rgba(var(--md-primary-rgb), 0.07)', borderRadius: '12px', border: '1px solid rgba(var(--md-primary-rgb), 0.2)' }}>
                        <div style={{ fontSize: '12px', fontWeight: 900, color: 'var(--md-primary)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit_note</span>
                          CRITICAL: FILL IN THE BLANKS
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                          {t.fields.map(f => (
                            <div key={f.key} style={{ background: 'var(--md-surface)', border: '1.5px solid var(--md-outline)', padding: '6px 14px', borderRadius: '8px', fontSize: '12.5px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                              <span style={{ color: 'var(--md-on-surface-var)', fontWeight: 500 }}>{f.label}:</span>
                              <span style={{ color: 'var(--md-primary)', marginLeft: 8, fontWeight: 800 }}>[{f.placeholder}]</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {t.note && (
                      <div style={{ 
                        marginTop: 16, 
                        padding: '16px 20px', 
                        background: 'rgba(255,152,0,0.08)', 
                        borderLeft: '5px solid #FF9800', 
                        borderRadius: '0 12px 12px 0', 
                        fontSize: '14px', 
                        color: 'var(--md-on-surface)', 
                        lineHeight: 1.6,
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px'
                      }}>
                        <span className="material-symbols-outlined" style={{ color: '#FF9800', marginTop: '2px' }}>warning</span>
                        <div style={{ opacity: 0.9 }}>{t.note}</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
