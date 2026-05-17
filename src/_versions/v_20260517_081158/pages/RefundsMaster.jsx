import { useState, useMemo } from 'react';

const RM_CATEGORIES = [
  'all', 'BIG4', 'DM Issue', 'Product Issue',
  'Router Mistake', 'Kitchen Mistake',
  'Outlet Mistake', 'Not for Customer', 'Big Mistake', 'Chef Mistake'
];

const RM_CAT_COLOR = {
  'BIG4': '#B71C1C',
  'Big Mistake': '#C62828',
  'DM Issue': '#1565C0',
  'Product Issue': '#E65100',
  'Product Issue- Check': '#F57C00',
  'Subjective': '#00838F',
  'Router Mistake': '#6A1B9A',
  'Kitchen Mistake': '#2E7D32',
  'Chef Mistake': '#558B2F',
  'Outlet Mistake': '#F57C00',
  'Not for Customer': '#616161'
};

const RM_METHOD = {
  'source': { label: 'Source', color: '#1565C0' },
  'credits': { label: 'Credits', color: '#E65100' },
  'both': { label: 'Both', color: '#2E7D32' },
  'na': { label: 'NA', color: '#616161' }
};

const REFUND_MATRIX = [
  { cat:'Outlet Mistake', tag:'IceCream - Temperature Abuse / Melted', penalty:'Outlet', refund:'Full Product Amount in Credits', method:'credits', note:'Full ice cream product value — not entire order.', special:false },
  { cat:'BIG4', tag:'VegNonVeg [Maker1000][Manager1000]', penalty:'Maker₹1000 + Manager₹1000', refund:'Max ₹500 Source Refund OR Specific Product Amount', method:'source', note:'Image required. Capped at max ₹500 or the exact product amount.', special:true },
  { cat:'BIG4', tag:'Stone / Bone / Masala in Food [Kitchen]', penalty:'Kitchen', refund:'Stone/Bone → Max ₹500 Source OR Specific Product Amount | ⚠️ Masala → ONLY ₹100 Credits', method:'source', note:'CRITICAL: Masala cases = ONLY ₹100 credits. Stone/Bone = Max ₹500 or specific product amt.', special:true },
  { cat:'BIG4', tag:'ExternalElement [Maker1000]', penalty:'Maker₹1000', refund:'Max ₹500 Source Refund OR Specific Product Amount', method:'source', note:'Image required. Capped at max ₹500 or specific product amt.', special:true },
  { cat:'BIG4', tag:'InsectFound [Maker1000]', penalty:'Maker₹1000', refund:'Max ₹500 Source Refund OR Specific Product Amount', method:'source', note:'Image required. Capped at max ₹500 or specific product amt.', special:true },
  { cat:'Not for Customer', tag:'CustomerOpinion/Others [Maker]', penalty:'Maker', refund:'NA', method:'na', note:'Opinion-based feedback — no refund.', special:false },
  { cat:'Not for Customer', tag:'General_OtherServiceIssues', penalty:'—', refund:'₹100 Credits (optional — subjective)', method:'credits', note:'Optional at agent discretion. Some CX may not agree.', special:false },
  { cat:'Not for Customer', tag:'Fake Complaint', penalty:'—', refund:'NA', method:'na', note:'No refund for fake complaints.', special:false },
  { cat:'Not for Customer', tag:'General_Order_Out of Stock', penalty:'—', refund:'NA', method:'na', note:'No auto-refund. Try to save order first (modification/transfer).', special:false },
  { cat:'Not for Customer', tag:'General_Wrong_Order_Status (Not Delivered)', penalty:'DM', refund:'Replacement OR Full Source Refund', method:'both', note:'Order marked delivered but CX says not received. Replacement first.', special:false },
  { cat:'Not for Customer', tag:'LateCancellation', penalty:'—', refund:'NA', method:'na', note:'', special:false },
  { cat:'Not for Customer', tag:'CC Escalation', penalty:'—', refund:'NA', method:'na', note:'', special:false },
  { cat:'Not for Customer', tag:'DMDeliveryHold', penalty:'—', refund:'NA', method:'na', note:'Internal operational tag.', special:false },
  { cat:'Not for Customer', tag:'General_StickerMismatch', penalty:'—', refund:'NA', method:'na', note:'Sticker error alone does not warrant refund.', special:false },
  { cat:'Not for Customer', tag:'TC_Tech Error', penalty:'—', refund:'NA', method:'na', note:'Tech error — no customer refund.', special:false },
  { cat:'Not for Customer', tag:'[CC_CALL] 1st/2nd/3rd ATTEMPT CUST NOT PICK', penalty:'—', refund:'NA', method:'na', note:'Call attempt tracking only.', special:false },
  { cat:'Not for Customer', tag:'Cc others / DM Random Call / Outlet Random Call', penalty:'—', refund:'NA', method:'na', note:'', special:false },
  { cat:'Not for Customer', tag:'General_OrderLate_50+', penalty:'—', refund:'₹100 Credits (as per ETA)', method:'credits', note:'Fixed ₹100. For truly late orders → FREE order policy applies separately.', special:false },
  { cat:'Not for Customer', tag:'General_OrderLate_60+', penalty:'—', refund:'₹150 Credits (as per ETA)', method:'credits', note:'Fixed ₹150. FREE order policy applies for genuinely late cases.', special:false },
  { cat:'DM Issue', tag:'EarlyAssigning [DM250] — Order Was Delivered', penalty:'DM₂₅₀', refund:'₹100 Credits (fixed)', method:'credits', note:'Order actually delivered per records but CX disputes. Fixed ₹100.', special:false },
  { cat:'DM Issue', tag:'DM_RudeBehavior [DM250]', penalty:'DM₂₅₀', refund:'₹200 Credits (fixed)', method:'credits', note:'Fixed ₹200. No subjective range.', special:false },
  { cat:'DM Issue', tag:'ItemMissing_SingleOrder [Router][DM]', penalty:'DM₂₅₀', refund:'Full Missing Product Amount in Source', method:'source', note:'Only the missing item value — not full order.', special:false },
  { cat:'DM Issue', tag:'ItemMissing_MultiOrder [DM]', penalty:'DM', refund:'Full Missing Amount — Source or Credits', method:'both', note:'Multi-order involved — can use source or credits.', special:false },
  { cat:'DM Issue', tag:'DessertMissing [Router][DM]', penalty:'DM', refund:'Full Missing Product Amount in Source', method:'source', note:'Full dessert item value from source.', special:false },
  { cat:'DM Issue', tag:'DessertInterchange [DM]', penalty:'DM', refund:'50% of Interchange Product Amount in Credits', method:'credits', note:'Wrong dessert delivered. 50% of that wrong item value.', special:false },
  { cat:'DM Issue', tag:'DrinksMissing [DM]', penalty:'DM', refund:'Full Missing Product Amount in Source', method:'source', note:'', special:false },
  { cat:'DM Issue', tag:'DrinksInterchange [DM]', penalty:'DM', refund:'50% of Interchange Product Amount in Credits', method:'credits', note:'Wrong drink delivered. 50% of that item.', special:false },
  { cat:'DM Issue', tag:'IceCream_Missing [DM]', penalty:'DM', refund:'Full Missing Product Amount in Source', method:'source', note:'', special:false },
  { cat:'DM Issue', tag:'IceCream_Wrong [DM]', penalty:'DM', refund:'50% of Wrong Product Amount in Credits', method:'credits', note:'', special:false },
  { cat:'DM Issue', tag:'FreebieMissing [Router][DM]', penalty:'DM₂₅₀', refund:'₹50 or ₹100 Credits (subjective)', method:'credits', note:'Free item shown on bill but not delivered.', special:false },
  { cat:'DM Issue', tag:'CutleryMissing [DM]', penalty:'DM', refund:'₹25 or ₹50 Credits (subjective)', method:'credits', note:'', special:false },
  { cat:'DM Issue', tag:'SeasoningMissing [DM]', penalty:'DM', refund:'₹25 or ₹50 Credits (subjective)', method:'credits', note:'', special:false },
  { cat:'DM Issue', tag:'Chutney/MayoMissing [Router][DM]', penalty:'DM', refund:'₹50 Credits (fixed)', method:'credits', note:'', special:false },
  { cat:'DM Issue', tag:'Raita_Missing [Router][DM]', penalty:'DM', refund:'Full Missing Raita Amount in Source', method:'source', note:'', special:false },
  { cat:'DM Issue', tag:'CheesyDip_Missing [Router][DM]', penalty:'DM', refund:'₹50 Credits (fixed)', method:'credits', note:'', special:false },
  { cat:'DM Issue', tag:'BadHandling_Pizza [DM]', penalty:'DM', refund:'Not Edible → Full Product Amount (Source) | Edible → 50% Product Amount (Source)', method:'source', note:'JUDGE EDIBILITY: Cannot eat = full refund from source. Damaged but edible = 50% from source.', special:true },
  { cat:'DM Issue', tag:'Drinks_Not_Cold [Maker][DM]', penalty:'DM', refund:'₹20 or ₹50 Credits (subjective)', method:'credits', note:'', special:false },
  { cat:'Big Mistake', tag:'HairFound [Maker300]', penalty:'Maker₃₀₀', refund:'₹100 or ₹200 Credits (subjective)', method:'credits', note:'Image required. Amount based on severity of complaint.', special:false },
  { cat:'Product Issue', tag:'Stale [Maker300]', penalty:'Maker₃₀₀', refund:'Full Product Amount — Source or Credits', method:'both', note:'Full refund of the STALE PRODUCT only — not the entire order.', special:false },
  { cat:'Product Issue', tag:'Raw/Uncooked [Maker]', penalty:'Maker', refund:'₹100 or ₹200 Credits (subjective)', method:'credits', note:'', special:false },
  { cat:'Product Issue', tag:'Not Fresh [Maker]', penalty:'Maker', refund:'₹100 or ₹200 Credits (subjective)', method:'credits', note:'', special:false },
  { cat:'Product Issue', tag:'Burnt/Overcooked [Maker]', penalty:'Maker', refund:'₹100 or ₹200 Credits (subjective)', method:'credits', note:'General items. For pizza use Pizza_Burnt tag.', special:false },
  { cat:'Product Issue', tag:'Pizza_Burnt/Overcooked [Maker]', penalty:'Maker', refund:'₹100 or ₹200 Credits (subjective)', method:'credits', note:'Pizza-specific burnt tag.', special:false },
  { cat:'Product Issue', tag:'ColdFood [Router]', penalty:'Router', refund:'50% of Cold Product Amount in Credits', method:'credits', note:'50% of the specific cold product value — not entire order.', special:false },
  { cat:'Product Issue', tag:'Wrap [Maker300]', penalty:'Maker₃₀₀', refund:'₹100 or ₹200 Credits (subjective)', method:'credits', note:'', special:false },
  { cat:'Product Issue', tag:'Wrap_WrongBase [Maker][Router]', penalty:'Maker + Router', refund:'₹50 or ₹100 Credits (subjective)', method:'credits', note:'Wrong base type in wrap.', special:false },
  { cat:'Product Issue', tag:'Paratha [Maker300]', penalty:'Maker₃₀₀', refund:'₹100 or ₹200 Credits (subjective)', method:'credits', note:'', special:false },
  { cat:'Product Issue', tag:'SGBS_GBS [Maker300]', penalty:'Maker₃₀₀', refund:'₹100 or ₹200 Credits (subjective)', method:'credits', note:'Garlic bread / stuffed GBS quality issue.', special:false },
  { cat:'Product Issue', tag:'SGBS_Wrong [Maker][Router]', penalty:'Maker + Router', refund:'₹100 or ₹200 Credits (subjective)', method:'credits', note:'Wrong garlic bread type delivered.', special:false },
  { cat:'Product Issue', tag:'ChocoLava [Maker300]', penalty:'Maker₃₀₀', refund:'₹50 or ₹80 Credits (subjective)', method:'credits', note:'Lower range — smaller item.', special:false },
  { cat:'Product Issue', tag:'Wrong Add-on / Ingredient_Missing [Maker]', penalty:'Maker', refund:'₹50, ₹100, or ₹150 Credits (subjective)', method:'credits', note:'Based on which ingredient and how much it affected the dish.', special:false },
  { cat:'Product Issue', tag:'PanTossedBase [Maker300]', penalty:'Maker₃₀₀', refund:'₹100 or ₹200 Credits (subjective)', method:'credits', note:'', special:false },
  { cat:'Product Issue', tag:'ThinCrustBase [Maker300]', penalty:'Maker₃₀₀', refund:'₹100 or ₹200 Credits (subjective)', method:'credits', note:'', special:false },
  { cat:'Product Issue', tag:'Salty/Spicy/Tasteless/Sweet [Maker]', penalty:'Maker', refund:'₹50, ₹100, or ₹150 Credits (subjective)', method:'credits', note:'⚠️ CHECK before giving — verify complaint is genuine.', special:false },
  { cat:'Product Issue', tag:'Salty/Spicy/Tasteless/Sweet_Gravy [Kitchen]', penalty:'Kitchen', refund:'₹50, ₹100, or ₹150 Credits (subjective)', method:'credits', note:'⚠️ CHECK before giving — verify complaint is genuine.', special:false },
  { cat:'Subjective', tag:'LessQuantity [Maker]', penalty:'Maker', refund:'₹50, ₹100, or ₹150 Credits (subjective)', method:'credits', note:'Proportionate to how much less was received.', special:false },
  { cat:'Subjective', tag:'Less/NoCheeseBlast [Maker]', penalty:'Maker', refund:'₹100 or ₹200 Credits (subjective)', method:'credits', note:'Cheese blast had less or no cheese filling inside.', special:false },
  { cat:'Product Issue', tag:'WrongProduct_SameCategory_SingleOrder [Router][DM]', penalty:'Router + DM', refund:'50% of Wrong Product Amount in Credits', method:'credits', note:'Same category (e.g. Veg pizza → different Veg pizza). Single order.', special:false },
  { cat:'Product Issue', tag:'WrongProduct_SameCategory_MultiOrder [DM]', penalty:'DM', refund:'50% of Wrong Product Amount in Credits', method:'credits', note:'Same category, multiple orders involved.', special:false },
  { cat:'Product Issue', tag:'WrongProduct_DiffCategory_SingleOrder [Router][DM]', penalty:'Router + DM', refund:'75% of Wrong Product Amount in Credits', method:'credits', note:'Different category (e.g. Veg delivered instead of NonVeg). Higher compensation.', special:false },
  { cat:'Product Issue', tag:'WrongProduct_DiffCategory_MultiOrder [DM]', penalty:'DM', refund:'75% of Wrong Product Amount in Credits', method:'credits', note:'Different category, multi-order.', special:false },
  { cat:'Product Issue', tag:'WrongProduct_SameCategory_PackedItem [Router]', penalty:'Router', refund:'50% of Wrong Product Amount in Credits', method:'credits', note:'Packed/sealed item, same category, wrong variant.', special:false },
  { cat:'Product Issue', tag:'Pizza_H&HMistakes [Maker][Router]', penalty:'Maker + Router', refund:'₹100 or ₹200 Credits (subjective)', method:'credits', note:'Half & half pizza preparation error.', special:false },
  { cat:'Product Issue', tag:'Pizza_WrongBase_ThinCrust [Maker][Router]', penalty:'Maker + Router', refund:'50% of Wrong Base Product Amount in Credits', method:'credits', note:'Wrong base type (thin crust mistake).', special:false },
  { cat:'Product Issue', tag:'RiceIssue [Maker]', penalty:'Maker', refund:'₹100 or ₹200 Credits (subjective)', method:'credits', note:'', special:false },
  { cat:'Product Issue', tag:'WrongRice [Maker][Router]', penalty:'Maker + Router', refund:'₹50 or ₹100 Credits (subjective)', method:'credits', note:'Wrong type of rice (e.g. Biryani rice instead of Meal rice).', special:false },
  { cat:'Product Issue', tag:'Thaali_WrongBase [Maker][Router]', penalty:'Maker + Router', refund:'₹50 or ₹100 Credits (subjective)', method:'credits', note:'Thali sent with wrong base (rice/paratha/phulka).', special:false },
  { cat:'Product Issue', tag:'Thaali_WrongDessert [Maker][Router]', penalty:'Maker + Router', refund:'₹50 or ₹100 Credits (subjective)', method:'credits', note:'Wrong dessert in thali.', special:false },
  { cat:'Product Issue', tag:'Thaali_WrongSideGravy [Maker][Router]', penalty:'Maker + Router', refund:'₹50 or ₹100 Credits (subjective)', method:'credits', note:'Wrong side gravy in thali.', special:false },
  { cat:'Chef Mistake', tag:'PizzaSaver_Cutting [Maker300]', penalty:'Maker₃₀₀', refund:'₹100 or ₹200 Credits (subjective)', method:'credits', note:'Pizza saver missing or improper cutting.', special:false },
  { cat:'Router Mistake', tag:'WrongPackaging [Router][DM]', penalty:'Router + DM', refund:'₹50 or ₹100 Credits (subjective)', method:'credits', note:'', special:false },
  { cat:'Router Mistake', tag:'ExpiredProduct [Router][DM]', penalty:'Router + DM', refund:'Full Expired Product Amount in Source', method:'source', note:'Full value of expired product from original payment.', special:false },
  { cat:'Router Mistake', tag:'KOT_Mistakes [Router][DM]', penalty:'Router + DM', refund:'NA', method:'na', note:'Kitchen Order Ticket mistakes — no customer refund.', special:false },
  { cat:'Router Mistake', tag:'BiryaniDessert_Wrong [Router][DM]', penalty:'Router + DM', refund:'₹50 Credits (fixed)', method:'credits', note:'Wrong biryani dessert delivered.', special:false },
  { cat:'Router Mistake', tag:'BadPackaging [Router][DM]', penalty:'Router + DM', refund:'₹100 or ₹200 Credits (subjective) — based on consumption chances', method:'credits', note:'Judge: can food be consumed? Low chances = ₹200. High chances = ₹100.', special:true },
  { cat:'Kitchen Mistake', tag:'Packaging_Kitchen_Mistake', penalty:'Kitchen', refund:'₹50 or ₹100 Credits (subjective)', method:'credits', note:'Packaging mistake from kitchen side.', special:false }
];

const RM_CHECKLISTS = [
  {
    icon: 'report',
    title: 'Fake Order',
    color: '#C62828',
    steps: [
      'Address pe kya issue hai?',
      'CX ko call kyun nahi lag raha? Personal number se try kiya? WhatsApp try kiya?',
      'CX order kyun nahi lena chahta? Exact reason note karo.',
      'Discount offer karne ke baad bhi nahi le raha? Kya offer diya?',
      'CX ka order history check karo — past mein delivery hua hai ya nahi?'
    ],
    note: 'Cancellation ke time details mein reason likhna hai — taaki third person bhi samajh sake ki CC ne order bachaane ka pura try kiya tha.'
  },
  {
    icon: 'phone_missed',
    title: 'Customer Not Reachable',
    color: '#1565C0',
    steps: [
      'DM door delivery kyun nahi kar pa raha? Address issue hai?',
      'CX ko call lagane par kya response? Ringing? Switched off?',
      'Personal number se try kiya? WhatsApp try kiya?',
      'Address issue mein nearby logo se confirm karne ki koshish karo.'
    ],
    note: 'Har attempt ko feedback mein document karo. DM ko wait karwao aur DMDeliveryHold tag lagao.'
  },
  {
    icon: 'storefront',
    title: 'Outlet Infra Issues',
    color: '#E65100',
    steps: [
      'Outlet ne complaint raise kiya hai ya nahi?',
      'Outlet deactivate kiya hai ya nahi?',
      'Bike / tech issue hai → Transfer ya Repunch karo.',
      'Late issue hai → Transfer ya Repunch try karo.'
    ],
    note: 'Asset deactivation sheet check karna MANDATORY hai before any cancellation for infra reason.'
  },
  {
    icon: 'inventory_2',
    title: 'Item Out of Stock (OOS)',
    color: '#6A1B9A',
    steps: [
      'Same outlet par modification try karo (substitute item dena).',
      'Nearby outlet pe transfer try karo.',
      'Apology ke saath credits dena + extra item dena — lekin ORDER BACHANA HAI.',
      'CX se baat nahi bhi hua ho — feedback mein likhke alternate item bhejo.'
    ],
    note: 'OOS mein automatic refund nahi. Pehle order bachane ki koshish karo.'
  },
  {
    icon: 'timer_off',
    title: 'Order Late',
    color: '#F57F17',
    steps: [
      'Late order cases mein CX ko FREE mein order dena hai (full order complimentary).',
      'Credits aur Source — dono method se refund de sakte hain.'
    ],
    note: '⚠️ Policy: Genuinely late order = FREE order. Sirf ₹100/₹150 credits nahi — full order free.'
  },
  {
    icon: 'wrong_location',
    title: 'Wrong Address',
    color: '#00695C',
    steps: [
      'CX se correct address lo.',
      'Wahan pe repunch ya transfer karo.',
      'Same correct address ko feedback mein bhi mention karo (documentation).',
      'DM ko DMDeliveryHold tag karke convince karo ki order deliver kare.'
    ],
    note: 'DM ko hold karo, naya address arrange karo. Cancellation last resort hai.'
  },
  {
    icon: 'cancel',
    title: 'Customer Refused to Accept',
    color: '#B71C1C',
    steps: [
      'Order dispatched state mein hai → CX ko FREE mein order offer karo.',
      'Credits aur Source refund dono mein de sakte hain.',
      'Cancellation bachana mandatory — pehle free offer try karo.'
    ],
    note: 'Cancellation = food wastage. Free offer is always better than cancel.'
  },
  {
    icon: 'content_copy',
    title: 'Duplicate Order',
    color: '#1A237E',
    steps: [
      'Order dispatched stage mein hai → CX ko FREE mein dono orders offer karo.',
      'Credits aur Source refund dono mein de sakte hain.',
      'Cancellation bachana mandatory — free offer try karo.'
    ],
    note: 'Dono orders accept karna best outcome. One free, one paid.'
  }
];

const RM_RATING_RULES = [
  { icon: 'star_half', rule: '3★ aur 4★ KABHI NAHI DENI — kisi bhi case mein', detail: 'Agent ko sirf 1★ ya 5★ dena hai. 3 star ya 4 star kabhi valid nahi hain.', type: 'absolute' },
  { icon: 'star', rule: 'Customer ne 2★, 3★ ya 4★ di → Agent dega 1★', detail: 'Customer rating 2/3/4 ho toh agent ko 1★ deni hai. Rating reduce karna allowed hai.', type: 'absolute' },
  { icon: 'payments', rule: 'Swiggy · Zomato · Magicpin orders mein REFUND NAHI', detail: 'Third-party platform orders mein CC ki taraf se koi refund nahi dena hai.', type: 'critical' },
  { icon: 'manage_search', rule: 'Tag karne se pehle previous agent ka tag + feedback check karo', detail: 'Kisi aur agent ne already tag ya feedback kiya hai kya — pehle verify karo.', type: 'process' },
  { icon: 'history', rule: 'Last 2 orders mein refund liya → Current order = Fake Complaint', detail: 'Agar CX ne last 2 consecutive orders mein refund liya hai toh fake consider karo. 2★ rating, no refund.', type: 'critical' },
  { icon: 'block', rule: 'Kisi agent ne pehle 2★ di hai → Refund NAHI', detail: 'Same order par previously 2★ di gayi hai toh ab koi refund nahi dena.', type: 'absolute' },
  { icon: 'receipt_long', rule: 'Zomato/Swiggy feedback mein "refund amt" → Fake Complaint tag', detail: 'Platform feedback mein refund amount mentioned hone par — opinion/service-other mein tag nahi. Issue-based tag karo, nahi toh Fake Complaint.', type: 'process' },
  { icon: 'currency_exchange', rule: 'Platform ne refund diya → Validate karo, galat hua toh recover karo', detail: 'Zomato/Swiggy ne CX ko refund diya toh check karo — galat refund hai toh recover karna hoga. Isliye Fake Complaint tag.', type: 'critical' }
];

const RM_TYPE_STYLE = {
  'absolute': { label:'ABSOLUTE RULE', bg:'#B71C1C' },
  'critical':  { label:'CRITICAL',     bg:'#E65100' },
  'process':   { label:'PROCESS',      bg:'#1565C0' }
};

export default function RefundsMaster() {
  const [rmActiveFilter, setRMActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openAccordion, setOpenAccordion] = useState(null);

  const filteredMatrix = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return REFUND_MATRIX.filter(r => {
      const matchQ = !q || r.tag.toLowerCase().includes(q) || r.refund.toLowerCase().includes(q) || r.cat.toLowerCase().includes(q) || (r.note && r.note.toLowerCase().includes(q));
      const matchF = rmActiveFilter === 'all' || r.cat === rmActiveFilter;
      return matchQ && matchF;
    });
  }, [searchQuery, rmActiveFilter]);

  const hl = (s) => searchQuery ? s.replace(new RegExp(searchQuery, 'gi'), m => `<mark>${m}</mark>`) : s;

  return (
    <div className="page-content" id="page-refunds-master">
      <div className="page-header" style={{ animation: 'gravityDrop .45s ease both' }}>
        <div className="ph-chip">Module 19 · Master Reference</div>
        <h1 className="ph-title">Refund <em>Master</em> Sheet</h1>
        <p className="ph-sub">Complete tag-wise refund matrix · Case checklists · Blocked customer rules · Updated rating logic</p>
      </div>

      <div className="rm-alert" style={{ animation: 'gravityDrop .45s .05s ease both' }}>
        <span className="material-symbols-outlined">campaign</span>
        <div>
          <strong>Important Reminder</strong><br/>
          <span>VALUE PRODUCTS ke cases mein <u>proportionately</u> refund karna hai — jaise meeting mein bataya gaya tha.</span>
        </div>
      </div>

      <section className="rm-section" style={{ animation: 'slideUp .4s .1s ease both' }}>
        <div className="rm-section-header">
          <h2 className="rm-section-title">
            <span className="material-symbols-outlined">table_chart</span>
            Refund Matrix
          </h2>
          <span id="rm-count" className="rm-count-badge">{filteredMatrix.length} entries</span>
        </div>

        <div className="rm-controls">
          <div className="search-wrap rm-search">
            <span className="material-symbols-outlined">search</span>
            <input type="text" placeholder="Search tag or rule..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
          <div className="rm-filter-chips">
            {Object.entries({
              'all':'All','BIG4':'BIG4','DM Issue':'DM Issue',
              'Product Issue':'Product','Router Mistake':'Router',
              'Kitchen Mistake':'Kitchen','Outlet Mistake':'Outlet',
              'Not for Customer':'Not for CX','Big Mistake':'Big Mistake',
              'Chef Mistake':'Chef Mistake','Subjective':'Subjective'
            }).map(([k, label]) => (
              <button key={k} className={`rm-chip ${rmActiveFilter === k ? 'rm-chip-active' : ''}`} onClick={() => setRMActiveFilter(k)}>{label}</button>
            ))}
          </div>
        </div>

        <div className="rm-table-wrap card">
          <table className="rm-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Tag</th>
                <th>Penalty</th>
                <th>Refund Rule</th>
                <th>Method</th>
              </tr>
            </thead>
            <tbody>
              {filteredMatrix.length ? filteredMatrix.map((r, i) => {
                const cc = RM_CAT_COLOR[r.cat] || '#666';
                const mb = RM_METHOD[r.method] || { label: r.method, color: '#666' };
                return (
                  <tr key={i} className="rm-row" style={{ '--rc': cc, animation: `slideUp .3s ${Math.min(i * .03, .4)}s ease both`, opacity: 0, animationFillMode: 'both' }}>
                    <td>
                      <span className="rm-cat-badge" style={{ background: `${cc}18`, color: cc, border: `1px solid ${cc}35` }} dangerouslySetInnerHTML={{ __html: hl(r.cat) }}></span>
                    </td>
                    <td className="rm-tag-td">
                      <div className="rm-tag-name" dangerouslySetInnerHTML={{ __html: hl(r.tag) }}></div>
                      {r.note && <div className="rm-tag-note" dangerouslySetInnerHTML={{ __html: hl(r.note) }}></div>}
                      {r.special && <span className="rm-special">⚠️ Special Rule</span>}
                    </td>
                    <td><span className="rm-penalty">{r.penalty}</span></td>
                    <td className="rm-refund-td" dangerouslySetInnerHTML={{ __html: hl(r.refund) }}></td>
                    <td>
                      <span className="rm-method-badge" style={{ background: `${mb.color}18`, color: mb.color, border: `1px solid ${mb.color}35` }}>{mb.label}</span>
                    </td>
                  </tr>
                );
              }) : <tr><td colSpan="5" style={{ textAlign: 'center', padding: '32px', color: 'var(--md-on-surface-var)' }}>No matching entries</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rm-section" style={{ animation: 'slideUp .4s .18s ease both' }}>
        <div className="rm-section-header">
          <h2 className="rm-section-title">
            <span className="material-symbols-outlined">checklist</span>
            Case Handling Checklists
          </h2>
          <span className="rm-section-sub">Before cancellation — document everything</span>
        </div>
        <div className="rm-checklists">
          {RM_CHECKLISTS.map((c, i) => (
            <div key={i} className="rm-case-card card" style={{ animation: `gravityDrop .45s ${i * .06}s ease both`, opacity: 0, animationFillMode: 'both' }}>
              <div className={`rm-case-head ${openAccordion === i ? 'rm-case-head-open' : ''}`} onClick={() => setOpenAccordion(openAccordion === i ? null : i)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className="rm-case-icon" style={{ background: `${c.color}18`, color: c.color }}>
                    <span className="material-symbols-outlined">{c.icon}</span>
                  </div>
                  <strong className="rm-case-title">{c.title}</strong>
                </div>
                <span className="material-symbols-outlined rm-acc-arr" style={{ transform: openAccordion === i ? 'rotate(180deg)' : 'rotate(0deg)' }}>expand_more</span>
              </div>
              <div className="rm-case-body" style={{ display: openAccordion === i ? 'block' : 'none' }}>
                <ol className="rm-steps">
                  {c.steps.map((s, idx) => <li key={idx}>{s}</li>)}
                </ol>
                {c.note && (
                  <div className="rm-case-note">
                    <span className="material-symbols-outlined" style={{ fontSize: '15px', flexShrink: 0 }}>info</span>
                    <span>{c.note}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rm-section" style={{ animation: 'slideUp .4s .24s ease both' }}>
        <div className="rm-section-header">
          <h2 className="rm-section-title">
            <span className="material-symbols-outlined">person_off</span>
            Customer Blocking Rules
          </h2>
        </div>
        <div className="rm-blocked-grid">
          <div className="rm-blocked-card rm-blocked-red" style={{ animation: 'springPop .45s .28s ease both' }}>
            <div className="rm-blocked-title">
              <span className="material-symbols-outlined">block</span> BLOCKED
            </div>
            <ul className="rm-blocked-list">
              <li>
                <span className="rm-bl-dot rm-bl-dot-red">1</span>
                <span><strong>Refund exploitation:</strong> 1st order paid hai + next 4 consecutive orders ₹0 or below ₹100 AND sab mein refund le raha hai — "apne hi refund pe kha raha hai"</span>
              </li>
              <li>
                <span className="rm-bl-dot rm-bl-dot-red">2</span>
                <span><strong>Multi-account fraud:</strong> 1 address se multiple accounts hain AND sab mein issue raise karke refund liya hai</span>
              </li>
            </ul>
            <div className="rm-blocked-footer rm-blocked-footer-red">
              🚫 Block immediately — no refund, no resolution
            </div>
          </div>

          <div className="rm-blocked-card rm-blocked-amber" style={{ animation: 'springPop .45s .33s ease both' }}>
            <div className="rm-blocked-title">
              <span className="material-symbols-outlined">warning</span>
              Fake — NOT Blocked
            </div>
            <ul className="rm-blocked-list">
              <li>
                <span className="rm-bl-dot rm-bl-dot-amber">1</span>
                <span><strong>Alternating pattern:</strong> 1 order pay → kha le → no issue → next order complaint → next order pay → kha le → no issue. Cycle chal raha hai.</span>
              </li>
              <li>
                <span className="rm-bl-dot rm-bl-dot-amber">2</span>
                <span><strong>Good history, recent abuse:</strong> 10+ delivered orders hain (genuine customer) + recent orders mein issue raise karke refund le raha hai</span>
              </li>
            </ul>
            <div className="rm-blocked-footer rm-blocked-footer-amber">
              ⚠️ Apply Reputation Tag only — do not block
            </div>
          </div>
        </div>
      </section>

      <section className="rm-section" style={{ animation: 'slideUp .4s .3s ease both' }}>
        <div className="rm-section-header">
          <h2 className="rm-section-title">
            <span className="material-symbols-outlined">star</span>
            Updated Rating Logic
          </h2>
        </div>
        <div className="rm-rating-card card">
          <div className="rm-rating-new-badge">UPDATED RULES</div>
          <div id="rmRatingRules">
            {RM_RATING_RULES.map((r, i) => {
              const ts = RM_TYPE_STYLE[r.type];
              return (
                <div key={i} className="rm-rule-row">
                  <div className="rm-rule-icon">
                    <span className="material-symbols-outlined">{r.icon}</span>
                  </div>
                  <div className="rm-rule-body">
                    <div className="rm-rule-stmt">
                      <span>{r.rule}</span>
                      <span className="rm-rule-badge" style={{ background: ts.bg }}>{ts.label}</span>
                    </div>
                    <div className="rm-rule-detail">{r.detail}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
