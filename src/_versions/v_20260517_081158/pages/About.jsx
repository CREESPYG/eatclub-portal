import { useState } from 'react';

const BRANDS = [
  {
    id: 'box8',
    icon: '🍛',
    name: 'BOX8',
    tagline: "India's #1 Home-Style Meals",
    color: '#FF5722',
    bg: 'rgba(255,87,34,0.08)',
    url: 'https://eatclub.in/box8',
    founded: '2012',
    cuisine: 'Indian Home-Style',
    highlight: '₹99 – ₹349',
    cities: ['Mumbai', 'Pune', 'Bangalore', 'Delhi NCR', 'Hyderabad'],
    desc: 'India\'s leading cloud kitchen brand for home-style Indian meals. Best known for dal chawal, meal bowls, biryanis, starters, and comfort food served fresh every time.',
    menuCategories: [
      { cat: 'Meal Bowls', items: ['All-in-1 Meal (Rice/Biryani/Paratha base)', 'Dal Chawal', 'Rajma Chawal', 'Paneer Tikka Meal', 'Chicken Curry Meal'] },
      { cat: 'Biryani & Rice', items: ['Chicken Biryani', 'Mutton Biryani', 'Veg Biryani', 'Egg Biryani', 'Meal Rice (side)'] },
      { cat: 'Thaali', items: ['Veg Thaali', 'Non-Veg Thaali', 'Paneer Thaali'] },
      { cat: 'Starters', items: ['Paneer Tikka', 'Chicken Wings (6/12 pcs)', 'Seekh Kebab', 'Crispy Corn'] },
      { cat: 'Wraps', items: ['Paneer Tikka Wrap', 'Chicken Tikka Wrap', 'Aloo Wrap'] },
      { cat: 'Sides & Extras', items: ['Raita', 'Pickle', 'Papad', 'Extra Rice', 'Extra Dal'] },
      { cat: 'Desserts', items: ['Gulab Jamun', 'Rasmalai', 'Choco Lava (from MOJO)'] },
      { cat: 'Drinks', items: ['Nimbu Soda', 'Masala Chaas', 'Aam Panna', 'Cold Coffee'] },
    ],
    agentTip: 'BOX8 orders are mostly meal-based — for missing items, check if it was Raita, Dal, Rice or a full side. All-in-1 Meal is a popular item — base is Rice or Biryani Rice (280g) or Paratha (1 pack).',
  },
  {
    id: 'mojo',
    icon: '🍕',
    name: 'MOJO Pizza',
    tagline: 'The Bigg Pizza Brand',
    color: '#FF8F00',
    bg: 'rgba(255,143,0,0.08)',
    url: 'https://eatclub.in/mojo-pizza',
    founded: '2015',
    cuisine: 'Pizza & Italian',
    highlight: '₹99 – ₹499',
    cities: ['Mumbai', 'Pune', 'Bangalore', 'Delhi NCR', 'Hyderabad', 'Chennai'],
    desc: 'MOJO Pizza is EatClub\'s flagship pizza brand. Offers Regular 7" and Big 10" pizzas in Pan Tossed and Thin Crust bases. Also known for Cheese Blast, Half & Half, and Value Fun Pizzas at ₹99.',
    menuCategories: [
      { cat: 'Value Pizzas (₹99)', items: ['Veg Value Fun Pizza', 'Non-Veg Value Fun Pizza', 'Bigg Cheese Margherita'] },
      { cat: 'Veg Pizzas', items: ['Margherita', 'Farmhouse', 'Paneer Tikka Pizza', 'Pesto Veggie', 'Corn & Cheese'] },
      { cat: 'Non-Veg Pizzas', items: ['Chicken Tikka Pizza', 'BBQ Chicken', 'Pepperoni', 'Chicken Club', 'Fiery Chicken'] },
      { cat: 'Cheese Blast', items: ['Cheese Blast Margherita', 'Cheese Blast Paneer', 'Chicken Cheese Blast'] },
      { cat: 'Half & Half (H&H)', items: ['Any 2 flavours on one pizza base — same size only'] },
      { cat: 'Garlic Breads', items: ['SGBS (Stuffed Garlic Bread Sticks)', 'Cheesy GBS', 'Herb GBS'] },
      { cat: 'Wraps', items: ['Paneer Tikka Wrap', 'Chicken Tikka Wrap'] },
      { cat: 'Pasta', items: ['Mac & Cheese', 'Arrabbiata Pasta', 'White Sauce Pasta'] },
      { cat: 'Drinks', items: ['Pepsi', 'Mountain Dew', 'Sting', '7UP'] },
    ],
    agentTip: 'MOJO has 2 sizes — Regular 7" and Big 10". Bases: Pan Tossed (PT) vs Thin Crust (TC). Cheese Blast = stuffed crust with cheese inside the base. H&H = Half & Half — 2 different toppings on ONE pizza. Value Fun Pizzas are ₹99.',
  },
  {
    id: 'leancrust',
    icon: '🥗',
    name: 'Lean Crust',
    tagline: 'Guilt-Free Thin Crust Pizza',
    color: '#43A047',
    bg: 'rgba(67,160,71,0.08)',
    url: 'https://eatclub.in/lean-crust',
    founded: '2018',
    cuisine: 'Health Pizza',
    highlight: '₹149 – ₹399',
    cities: ['Mumbai', 'Pune', 'Bangalore', 'Delhi NCR'],
    desc: 'Lean Crust is the health-conscious pizza brand under EatClub. Thin crust only. Same portioning specifications as MOJO Pizza thin crust. Positioned for fitness-focused customers who want pizza without the guilt.',
    menuCategories: [
      { cat: 'Signature Thin Crust', items: ['Veg Lean Crust Pizza', 'Chicken Lean Crust Pizza', 'Paneer Special Lean Crust'] },
      { cat: 'Protein Options', items: ['High-Protein Chicken Pizza', 'Paneer & Corn Thin Crust'] },
      { cat: 'Sides', items: ['Lean Garlic Bread', 'Side Salad'] },
    ],
    agentTip: 'Lean Crust portioning follows the same standards as MOJO Thin Crust. If a CX complains about pizza quality from Lean Crust, use the same pizza tags as MOJO (PanTossedBase doesn\'t apply — it\'s always thin crust here).',
  },
  {
    id: 'itminaan',
    icon: '🍚',
    name: 'Itminaan Biryani',
    tagline: 'Authentic Dum Biryani Specialists',
    color: '#9C27B0',
    bg: 'rgba(156,39,176,0.08)',
    url: 'https://eatclub.in/itminaan-biryani',
    founded: '2016',
    cuisine: 'Biryani & Mughlai',
    highlight: '₹149 – ₹449',
    cities: ['Mumbai', 'Pune', 'Bangalore', 'Delhi NCR', 'Hyderabad'],
    desc: 'Itminaan is EatClub\'s biryani specialist brand. Famous for Matka Biryani (slow-cooked in clay pots). Also operates sub-brands: ZAZA Mughal Biryani and 1881 Biryani. CX must note: Itminaan starters cold = ColdFood [Manager400], but Itminaan BIRYANI cold = Cold Itminaan [Maker300].',
    subBrands: ['ZAZA Mughal Biryani', '1881 Biryani'],
    menuCategories: [
      { cat: 'Matka Biryani (Signature)', items: ['Chicken Matka Biryani', 'Mutton Matka Biryani', 'Veg Matka Biryani', 'Egg Matka Biryani', 'Paneer Matka Biryani'] },
      { cat: 'Regular Biryani', items: ['Chicken Biryani', 'Mutton Biryani', 'Veg Biryani'] },
      { cat: 'Starters', items: ['Chicken Tikka', 'Seekh Kebab', 'Paneer Tikka', 'Chicken Wings'] },
      { cat: 'Desserts', items: ['Shahi Tukda', 'Gulab Jamun', 'Phirni'] },
      { cat: 'Drinks', items: ['Rose Sharbat', 'Cold Coffee', 'Nimbu Soda'] },
    ],
    agentTip: 'CRITICAL TAG RULE: Itminaan matka biryani cold = "Cold Itminaan [Maker300]". Itminaan starters cold (e.g. tikka, wings) = "ColdFood [Manager400]". These are different tags — do not confuse them!',
  },
];

const PLATFORM_FEATURES = [
  { icon: 'local_offer', label: 'Flat 30% OFF', desc: 'Every order on the app — no minimum', color: '#FF5722' },
  { icon: 'local_shipping', label: '₹0 Delivery Fee', desc: 'Always free delivery, no threshold', color: '#2196F3' },
  { icon: 'inventory_2', label: '₹0 Packaging Fee', desc: 'No packaging charges ever', color: '#4CAF50' },
  { icon: 'account_balance', label: '₹0 Platform Fee', desc: 'Unlike Swiggy/Zomato — zero fees', color: '#9C27B0' },
  { icon: 'schedule', label: '38 Min Delivery', desc: 'Average delivery time guarantee', color: '#FF8F00' },
  { icon: 'nights_stay', label: 'Late Night till 3 AM', desc: 'Available in select cities until 3:00 AM', color: '#00BCD4' },
];

const PAYMENT_METHODS = ['UPI (GPay, PhonePe, Paytm)', 'Credit / Debit Cards', 'Net Banking', 'EatClub Wallet / Credits', 'Cash on Delivery (COD)', 'Sodexo & Meal Cards'];

const CITIES_DATA = [
  { city: 'Mumbai', outlets: '100+', note: 'Largest market — HQ city' },
  { city: 'Pune', outlets: '60+', note: 'Strong Box8 presence' },
  { city: 'Bangalore', outlets: '50+', note: 'Tech hub — high MOJO demand' },
  { city: 'Delhi NCR', outlets: '40+', note: 'Includes Noida, Gurgaon, Faridabad' },
  { city: 'Hyderabad', outlets: '30+', note: 'Biryani + BOX8 dominant' },
  { city: 'Chennai', outlets: '15+', note: 'Growing market' },
  { city: 'Kolkata', outlets: '10+', note: 'New market — limited brands' },
];

const CALL_SOURCES = [
  {
    icon: 'person', title: 'Customer → CC', color: '#FF5722',
    items: [
      'Order Modification or Cancellation (item issues, duplicate, takeaway→delivery)',
      'Food quality complaints (cold, missing, wrong, stale, etc.)',
      'Delivery issues (late, not received, wrong address)',
      'Refund or credit queries',
      'New order placement support',
    ]
  },
  {
    icon: 'delivery_dining', title: 'Delivery Man (DM) → CC', color: '#FF8F00',
    items: [
      'Customer not reachable at delivery location',
      'Requesting CC to help contact customer',
      'Address clarification or navigation issue',
      'Order pickup problem from outlet',
    ]
  },
  {
    icon: 'storefront', title: 'Outlet → CC', color: '#43A047',
    items: [
      'Order cancellation communication (OOS, infra issues)',
      'Asset/bike/tech infra problem (check deactivation sheet first!)',
      'Staff rude behavior escalation',
      'KOT or order modification requests',
    ]
  },
];

const CALLER_BRIDGE = [
  { label: 'Own EatClub Customer', number: '080-68172526', note: 'Direct app orders' },
  { label: 'Zomato Customer', number: '080-61970384', note: 'Zomato platform orders' },
  { label: 'Swiggy Customer', number: '020-46201538', note: 'Swiggy platform orders' },
  { label: 'Delivery Men (DMs)', number: '020-67325678', note: 'DM calling CC for help' },
  { label: 'Outlet / Restaurant', number: '011-61191678', note: 'Outlet calling CC' },
];

export default function About() {
  const [activeBrand, setActiveBrand] = useState('box8');
  const brand = BRANDS.find(b => b.id === activeBrand);

  return (
    <div className="page-content">
      {/* HERO */}
      <div className="hero" style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 14px', borderRadius: 20, background: 'rgba(255,87,34,.12)', border: '1px solid rgba(255,87,34,.2)', fontSize: 10, fontWeight: 800, letterSpacing: '.8px', textTransform: 'uppercase', color: 'var(--md-primary)', marginBottom: 12 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>language</span>
              Live Data from eatclub.in
            </div>
            <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 10 }}>About <span style={{ color: 'var(--md-primary)' }}>EatClub</span> Brands</h1>
            <p style={{ fontSize: 14, color: 'var(--md-on-surface-var)', lineHeight: 1.7, maxWidth: 560 }}>
              India's highest-rated food delivery app — multi-brand cloud kitchen network. <strong>Flat 30% OFF</strong> every order + ₹0 delivery + ₹0 packaging + ₹0 platform fees. 7 cities, 450+ outlets, 8+ brands.
            </p>
            <a href="https://eatclub.in" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 12, padding: '8px 18px', borderRadius: 20, background: 'var(--md-primary)', color: 'white', fontSize: 12, fontWeight: 700, textDecoration: 'none', transition: 'transform .2s' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>open_in_new</span>
              Visit eatclub.in
            </a>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[['450+','Outlets'],['7','Cities'],['8+','Brands'],['21','Modules'],['180+','Templates'],['75+','Tags']].map(([v,l]) => (
              <div key={l} style={{ textAlign: 'center', padding: '12px 20px', borderRadius: 14, background: 'rgba(255,87,34,.06)', border: '1px solid rgba(255,87,34,.12)' }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--md-primary)', lineHeight: 1 }}>{v}</div>
                <div style={{ fontSize: 10, color: 'var(--md-on-surface-var)', marginTop: 3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.4px' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PLATFORM FEATURES */}
      <h2 className="section-title">
        <span className="material-symbols-outlined" style={{ color: 'var(--md-primary)' }}>star_rate</span>
        Why EatClub? — Platform USPs
      </h2>
      <div className="grid-3 mb-32">
        {PLATFORM_FEATURES.map((f, i) => (
          <div key={f.label} className={`card anim-delay-${i + 1}`} style={{ borderTop: `3px solid ${f.color}`, padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${f.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 20, color: f.color }}>{f.icon}</span>
              </div>
              <div style={{ fontSize: 15, fontWeight: 800, color: f.color }}>{f.label}</div>
            </div>
            <p style={{ fontSize: 12, color: 'var(--md-on-surface-var)', lineHeight: 1.5 }}>{f.desc}</p>
          </div>
        ))}
      </div>

      {/* BRANDS DEEP-DIVE */}
      <h2 className="section-title">
        <span className="material-symbols-outlined" style={{ color: 'var(--md-primary)' }}>restaurant</span>
        Our Brands — Full Menu & Details
      </h2>

      {/* Brand tabs */}
      <div className="tab-bar mb-24">
        {BRANDS.map(b => (
          <button key={b.id} className={`tab-btn ${activeBrand === b.id ? 'active' : ''}`} onClick={() => setActiveBrand(b.id)}>
            {b.icon} {b.name}
          </button>
        ))}
      </div>

      {/* Active brand card */}
      <div className="card mb-32" style={{ borderTop: `4px solid ${brand.color}`, padding: 0, overflow: 'hidden', animation: 'springPop .35s ease' }} key={brand.id}>
        {/* Brand header */}
        <div style={{ background: brand.bg, padding: '20px 24px', borderBottom: '1px solid var(--md-outline-var)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ fontSize: 48, lineHeight: 1 }}>{brand.icon}</div>
              <div>
                <h3 style={{ fontSize: 22, fontWeight: 900, color: brand.color, marginBottom: 4 }}>{brand.name}</h3>
                <div style={{ fontSize: 12, color: 'var(--md-on-surface-var)', marginBottom: 6 }}>{brand.tagline}</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <span className="chip chip-gray" style={{ fontSize: 10 }}>📅 Since {brand.founded}</span>
                  <span className="chip" style={{ background: `${brand.color}15`, color: brand.color, fontSize: 10 }}>💰 {brand.highlight}</span>
                  <span className="chip chip-gray" style={{ fontSize: 10 }}>🍽️ {brand.cuisine}</span>
                </div>
              </div>
            </div>
            <a href={brand.url} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '7px 14px', borderRadius: 20, background: brand.color, color: 'white', fontSize: 11, fontWeight: 700, textDecoration: 'none' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>open_in_new</span>
              View Menu
            </a>
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.7, marginTop: 14, color: 'var(--md-on-surface)' }}>{brand.desc}</p>
          {brand.subBrands && (
            <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: 'var(--md-on-surface-var)', fontWeight: 700 }}>Sub-brands:</span>
              {brand.subBrands.map(s => <span key={s} className="chip chip-purple" style={{ fontSize: 10 }}>{s}</span>)}
            </div>
          )}
        </div>

        {/* Menu categories */}
        <div style={{ padding: '20px 24px' }}>
          <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--md-on-surface-var)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '.6px' }}>📋 Menu Categories</h4>
          <div className="grid-3" style={{ gap: 12 }}>
            {brand.menuCategories.map((cat) => (
              <div key={cat.cat} style={{ background: 'var(--md-surface-2)', borderRadius: 12, padding: 14, border: '1px solid var(--md-outline-var)' }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: brand.color, marginBottom: 8, paddingBottom: 6, borderBottom: `1px solid ${brand.color}25` }}>{cat.cat}</div>
                <ul style={{ margin: 0, paddingLeft: 14 }}>
                  {cat.items.map(item => (
                    <li key={item} style={{ fontSize: 11, color: 'var(--md-on-surface-var)', marginBottom: 3, lineHeight: 1.5 }}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Cities */}
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--md-on-surface-var)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.5px' }}>📍 Available Cities</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {brand.cities.map(c => <span key={c} className="chip" style={{ background: `${brand.color}10`, color: brand.color, fontSize: 11 }}>{c}</span>)}
            </div>
          </div>

          {/* Agent tip */}
          <div style={{ marginTop: 16, display: 'flex', gap: 10, padding: '12px 14px', borderRadius: 10, background: 'rgba(255,87,34,.06)', border: '1px solid rgba(255,87,34,.12)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--md-primary)', flexShrink: 0, marginTop: 1 }}>support_agent</span>
            <div style={{ fontSize: 12, lineHeight: 1.6, color: 'var(--md-on-surface-var)' }}>
              <strong style={{ color: 'var(--md-primary)' }}>CC Agent Tip:</strong> {brand.agentTip}
            </div>
          </div>
        </div>
      </div>

      {/* CITIES PRESENCE */}
      <h2 className="section-title">
        <span className="material-symbols-outlined" style={{ color: 'var(--md-primary)' }}>location_on</span>
        City Presence — 300+ Outlets
      </h2>
      <div className="grid-4 mb-32">
        {CITIES_DATA.map((c, i) => (
          <div key={c.city} className={`card anim-delay-${i + 1}`} style={{ padding: 16, textAlign: 'center' }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>
              {c.city === 'Mumbai' ? '🌆' : c.city === 'Pune' ? '🏙️' : c.city === 'Bangalore' ? '💻' : c.city === 'Delhi NCR' ? '🏛️' : c.city === 'Hyderabad' ? '🕌' : c.city === 'Chennai' ? '🌊' : '🏮'}
            </div>
            <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--md-on-surface)', marginBottom: 3 }}>{c.city}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--md-primary)', marginBottom: 4 }}>{c.outlets}</div>
            <div style={{ fontSize: 10, color: 'var(--md-on-surface-var)', lineHeight: 1.4 }}>{c.note}</div>
          </div>
        ))}
      </div>

      {/* PAYMENT METHODS */}
      <h2 className="section-title">
        <span className="material-symbols-outlined" style={{ color: 'var(--md-primary)' }}>payments</span>
        Payment Methods Accepted
      </h2>
      <div className="card mb-32">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {PAYMENT_METHODS.map(pm => (
            <div key={pm} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, background: 'var(--md-surface-2)', border: '1px solid var(--md-outline-var)', fontSize: 12, fontWeight: 600 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--md-primary)' }}>
                {pm.includes('UPI') ? 'qr_code' : pm.includes('Card') ? 'credit_card' : pm.includes('Net') ? 'account_balance' : pm.includes('Wallet') ? 'wallet' : pm.includes('Cash') ? 'money' : 'card_membership'}
              </span>
              {pm}
            </div>
          ))}
        </div>
        <div className="alert alert-info" style={{ marginTop: 16, marginBottom: 0 }}>
          <span className="alert-icon">info</span>
          <span><strong>COD Orders:</strong> No refund to source for COD. Cash was paid at door — no digital refund possible. Wallet credits can still be given if applicable.</span>
        </div>
      </div>

      {/* CALL SOURCES */}
      <h2 className="section-title">
        <span className="material-symbols-outlined" style={{ color: 'var(--md-primary)' }}>call_received</span>
        3 Sources CC Receives Calls From
      </h2>
      <div className="alert alert-info mb-24">
        <span className="alert-icon">info</span>
        All calls arrive via <strong>Kaleyra Portal</strong>. Agent must stay logged in at all times during shift. Identify caller by Bridge Number saved in your phone.
      </div>
      <div className="grid-3 mb-32">
        {CALL_SOURCES.map((cs, i) => (
          <div key={cs.title} className={`card anim-delay-${i + 1}`} style={{ borderLeft: `4px solid ${cs.color}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <span className="material-symbols-outlined" style={{ color: cs.color, fontSize: 24 }}>{cs.icon}</span>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: cs.color }}>{cs.title}</h3>
            </div>
            <ul style={{ paddingLeft: 16, margin: 0 }}>
              {cs.items.map(item => (
                <li key={item} style={{ fontSize: 12, color: 'var(--md-on-surface-var)', marginBottom: 6, lineHeight: 1.5 }}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* CALLER BRIDGE NUMBERS */}
      <h2 className="section-title">
        <span className="material-symbols-outlined" style={{ color: 'var(--md-primary)' }}>dialpad</span>
        Caller Bridge Numbers — Save in Phone!
      </h2>
      <div className="alert alert-warning mb-16">
        <span className="alert-icon">warning</span>
        Save ALL bridge numbers in your phone to identify callers <strong>before you pick up</strong>.
      </div>
      <div className="phone-grid mb-32">
        {CALLER_BRIDGE.map(p => (
          <div key={p.number} className="phone-card">
            <span className="phone-icon material-symbols-outlined">phone_in_talk</span>
            <div className="phone-info">
              <h4>{p.number}</h4>
              <span>{p.label}</span>
              <span style={{ display: 'block', fontSize: 10, color: 'var(--md-on-surface-dim)', marginTop: 2 }}>{p.note}</span>
            </div>
          </div>
        ))}
      </div>

      {/* KEY AGENT QUICK FACTS */}
      <h2 className="section-title">
        <span className="material-symbols-outlined" style={{ color: 'var(--md-primary)' }}>bolt</span>
        Quick Facts Every Agent Must Know
      </h2>
      <div className="grid-2">
        {[
          { icon: 'schedule', label: 'Operating Hours', val: '11:00 AM – 3:00 AM (Mon–Sun)', color: '#2196F3' },
          { icon: 'currency_rupee', label: 'Price Range', val: '₹100 – ₹600 per order', color: '#4CAF50' },
          { icon: 'qr_code', label: 'App Store ID (iOS)', val: '1535583068 — EatClub', color: '#9C27B0' },
          { icon: 'android', label: 'Android Package', val: 'com.poncho.eatclub', color: '#FF8F00' },
          { icon: 'email', label: 'Customer Email', val: 'hello@eatclub.in', color: '#FF5722' },
          { icon: 'phone', label: 'Support Phone', val: '+91-22-33552698', color: '#00BCD4' },
          { icon: 'store', label: 'HQ', val: 'Mumbai, Maharashtra', color: '#FF5722' },
          { icon: 'delivery_dining', label: 'Avg Delivery Time', val: '38 minutes', color: '#FF8F00' },
        ].map(f => (
          <div key={f.label} className="card-sm" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px' }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: `${f.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 17, color: f.color }}>{f.icon}</span>
            </div>
            <div>
              <div style={{ fontSize: 10, color: 'var(--md-on-surface-var)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.4px' }}>{f.label}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--md-on-surface)', marginTop: 1 }}>{f.val}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
