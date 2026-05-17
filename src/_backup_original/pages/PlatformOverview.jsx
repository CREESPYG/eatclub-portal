import { useState } from 'react';

const PO_NAV_ITEMS = [
  {
    label: 'DELIVER TO',
    icon: 'location_on',
    color: '#E65100',
    desc: 'Customer enters their delivery address here. Dropdown lets them switch between saved or new addresses.',
    agent_note: 'If CX says "I can\'t find my address" — ask them to type in DELIVER TO field on website/app.'
  },
  {
    label: 'Why EatClub?',
    icon: 'info',
    color: '#1565C0',
    desc: 'Explains the membership benefits and EatClub\'s value proposition to new users.',
    agent_note: 'Direct curious or hesitant customers here for self-service education about EatClub.'
  },
  {
    label: 'Deals',
    icon: 'local_offer',
    color: '#2E7D32',
    desc: 'Shows all current active offers, promo codes, and discounts across all brands.',
    agent_note: 'If CX asks about current deals — tell them to check the DEALS section on website/app.'
  },
  {
    label: 'Cart',
    icon: 'shopping_cart',
    color: '#6A1B9A',
    desc: 'Shows the customer\'s current cart. Items can be added from any restaurant.',
    agent_note: 'If CX says items disappeared from cart — this is a session/cache issue. Advise to re-add.'
  },
  {
    label: 'Get the App',
    icon: 'download',
    color: '#00695C',
    desc: 'Button with QR code — opens app download links for Play Store and App Store.',
    agent_note: 'Direct customers who want to download the app here. QR code is easiest route.'
  },
  {
    label: 'Sign In',
    icon: 'login',
    color: '#F57F17',
    desc: 'Login / register with mobile number. OTP-based authentication.',
    agent_note: 'If CX can\'t login — check if they\'re using the correct registered mobile number.'
  }
];

const PO_DEALS = [
  {
    type: 'HERO BANNER',
    icon: 'campaign',
    color: '#00838F',
    title: '50% OFF — New User Offer',
    code: 'FIRST3',
    details: [
      '50% OFF on first 3 orders',
      '₹0 Delivery Fee',
      '₹0 Packaging Fee',
      '₹0 Platform Fee'
    ],
    agent_note: 'This code is for NEW users only (first 3 orders). If CX has used EatClub before, code will not apply — this is expected behaviour.'
  },
  {
    type: 'TOP OFFER',
    icon: 'rice_bowl',
    color: '#E65100',
    title: 'Biryani @ ₹99',
    code: null,
    details: [
      'Select Biryani items starting at ₹99',
      'Available across NH1 Bowls, Itminaan Matka Biryani',
      'No code needed — price shown directly'
    ],
    agent_note: 'If CX asks why biryani shows ₹99 online but order total is different — check if delivery/other charges apply for their account type.'
  },
  {
    type: 'TOP OFFER',
    icon: 'local_pizza',
    color: '#B71C1C',
    title: 'Value Fun Pizzas @ ₹99',
    code: null,
    details: [
      'Budget pizza range at ₹99',
      'Available at MOJO Pizza & LeanCrust Pizza',
      'No code needed — price shown directly'
    ],
    agent_note: 'If CX says pizza price changed from ₹99 to higher at checkout — check if it\'s the correct product (toppings/size may differ).'
  },
  {
    type: 'TOP OFFER',
    icon: 'spa',
    color: '#2E7D32',
    title: 'Guilt Free Category',
    code: null,
    details: [
      'Dedicated section for healthy, calorie-conscious meals',
      'WeFit brand — protein bowls, salads, sandwiches',
      'Up to 65g protein options available'
    ],
    agent_note: 'Customers specifically looking for healthy meals should be directed to Guilt Free / WeFit section.'
  },
  {
    type: 'TOP OFFER',
    icon: 'new_releases',
    color: '#6A1B9A',
    title: "What's New",
    code: null,
    details: [
      'Showcases newly launched items across all brands',
      'Updated regularly when brands add new products',
      'Great for customers exploring the platform'
    ],
    agent_note: "If CX asks \"what's new on EatClub\" — direct them to the What's New section on homepage."
  },
  {
    type: 'MID BANNER',
    icon: 'loyalty',
    color: '#1565C0',
    title: '50% OFF + Zero Fees — App Download Banner',
    code: 'FIRST3',
    details: [
      'Recurring banner encouraging app download',
      'Same FIRST3 offer highlighted',
      '₹0 Delivery | ₹0 Packaging | ₹0 Platform Fee'
    ],
    agent_note: 'This banner appears mid-scroll to remind customers to download the app. App users get a better ordering experience.'
  }
];

const PO_BRANDS = [
  {
    name: 'MOJO Pizza',
    subtitle: '2X Toppings',
    tagline: "India's Highest Rated Pizza Delivery Chain",
    category: 'pizza',
    emoji: '🍕',
    color: '#E65100',
    highlight: 'Double toppings on every pizza',
    agent_tip: 'Most popular pizza brand. If CX asks about pizza delivery, MOJO is the top recommendation.',
    fees: '₹0 Delivery · ₹0 Packaging'
  },
  {
    name: 'LeanCrust Pizza',
    subtitle: null,
    tagline: 'The Thin Crust Experts',
    category: 'pizza',
    emoji: '🍕',
    color: '#795548',
    highlight: 'Thin crust specialty pizza',
    agent_tip: 'For customers who prefer thin crust over pan/stuffed base, LeanCrust is the go-to.',
    fees: '₹0 Delivery · ₹0 Packaging'
  },
  {
    name: 'BOX8',
    subtitle: 'Desi Meals',
    tagline: "India's Largest Desi Meals Brand",
    category: 'indian',
    emoji: '🍛',
    color: '#F57C00',
    highlight: 'All-in-1 boxes, Mini Meals, Thalis',
    agent_tip: 'Core Box8 brand. Most common queries will involve BOX8 products. Check portioning guide for details.',
    fees: '₹0 Delivery · ₹0 Packaging'
  },
  {
    name: 'WeFit',
    subtitle: null,
    tagline: 'Upto 65 gm Protein in Bowls, Salads & Sandwiches',
    category: 'healthy',
    emoji: '🥗',
    color: '#2E7D32',
    highlight: 'High-protein healthy meals',
    agent_tip: 'Health-conscious customers. If CX asks about low-calorie or high-protein food, direct to WeFit.',
    fees: '₹0 Delivery · ₹0 Packaging'
  },
  {
    name: 'NH1 Bowls',
    subtitle: null,
    tagline: "India's Most Flavourful Biryani",
    category: 'biryani',
    emoji: '🍚',
    color: '#C62828',
    highlight: 'Highway-style flavourful biryani',
    agent_tip: 'NH1 = biryani specialists. Not to be confused with Itminaan (which is slow-cooked matka biryani).',
    fees: '₹0 Delivery · ₹0 Packaging'
  },
  {
    name: 'Itminaan Matka Biryani',
    subtitle: null,
    tagline: 'Slow Cooked & Served in an Earthen Matka',
    category: 'biryani',
    emoji: '🫙',
    color: '#6D4C41',
    highlight: 'Authentic dum biryani in matka',
    agent_tip: 'ColdItminaan tag = ONLY matka biryani cold (not starters). Keep this distinction in mind.',
    fees: '₹0 Delivery · ₹0 Packaging'
  },
  {
    name: 'Mealful Rolls',
    subtitle: null,
    tagline: "India's Biggest Rolls",
    category: 'wraps',
    emoji: '🌯',
    color: '#558B2F',
    highlight: 'Large, stuffed rolls',
    agent_tip: 'Roll complaints: check Wrap / Wrap_WrongBase tags in refund matrix.',
    fees: '₹0 Delivery · ₹0 Packaging'
  },
  {
    name: 'Daily Kitchen',
    subtitle: 'Homely Meals',
    tagline: 'Mom-Style Homely Meals That You Can Have Daily',
    category: 'indian',
    emoji: '🍲',
    color: '#E53935',
    highlight: 'Everyday comfort food',
    agent_tip: 'Targets repeat customers who want daily home-style food. Lower price point.',
    fees: '₹0 Delivery · ₹0 Packaging'
  },
  {
    name: 'BOOM Sandwich',
    subtitle: null,
    tagline: 'Sub Style Sandwiches, Freshly Made',
    category: 'sandwiches',
    emoji: '🥪',
    color: '#D32F2F',
    highlight: 'Subway-style freshly made subs',
    agent_tip: 'Sandwich brand. CX complaints likely around fillings and freshness.',
    fees: '₹0 Delivery · ₹0 Packaging'
  },
  {
    name: 'The Ghee Khichdi Project',
    subtitle: null,
    tagline: 'Comforting, Wholesome & Made with 100% Pure Ghee',
    category: 'indian',
    emoji: '🫕',
    color: '#F9A825',
    highlight: 'Pure ghee khichdi — comfort food',
    agent_tip: 'Niche brand. Customers ordering this are specifically seeking comfort/healthy food with ghee.',
    fees: '₹0 Delivery · ₹0 Packaging'
  },
  {
    name: 'Bhatti Chicken',
    subtitle: null,
    tagline: 'Grilled in a Bhatti, Not Fried',
    category: 'chicken',
    emoji: '🍗',
    color: '#BF360C',
    highlight: 'Bhatti-grilled, not fried chicken',
    agent_tip: 'If CX says chicken is raw/undercooked — use Raw/Uncooked tag. NOT fried so texture may seem different.',
    fees: '₹0 Delivery · ₹0 Packaging'
  },
  {
    name: 'Hola Pasta',
    subtitle: null,
    tagline: 'Fresh Gourmet Pasta',
    category: 'pasta',
    emoji: '🍝',
    color: '#1565C0',
    highlight: 'Gourmet fresh pasta',
    agent_tip: 'Pasta complaints around sauce quantity/taste → Salty/Spicy/Tasteless tags.',
    fees: '₹0 Delivery · ₹0 Packaging'
  },
  {
    name: 'Globo Ice Creams',
    subtitle: null,
    tagline: 'Ice Creams of the World. Taste That Teleports You.',
    category: 'desserts',
    emoji: '🍦',
    color: '#AD1457',
    highlight: 'Global ice cream flavours',
    agent_tip: 'Temperature-sensitive. IceCream_Missing / IceCream_Wrong / Temperature Abuse tags apply.',
    fees: '₹0 Delivery · ₹0 Packaging'
  },
  {
    name: 'Zaza / GharSe (Indian Taste)',
    subtitle: null,
    tagline: 'Authentic Indian Taste',
    category: 'indian',
    emoji: '🍽️',
    color: '#4527A0',
    highlight: 'Traditional Indian home cooking',
    agent_tip: 'Traditional Indian brand. Focus on authentic flavour complaints — use appropriate taste tags.',
    fees: '₹0 Delivery · ₹0 Packaging'
  }
];

const PO_BRAND_CATEGORIES = [
  { id: 'all',        label: 'All Brands', icon: 'restaurant_menu' },
  { id: 'pizza',      label: 'Pizza',      icon: 'local_pizza' },
  { id: 'indian',     label: 'Indian',     icon: 'rice_bowl' },
  { id: 'biryani',    label: 'Biryani',    icon: 'set_meal' },
  { id: 'healthy',    label: 'Healthy',    icon: 'spa' },
  { id: 'wraps',      label: 'Wraps',      icon: 'wrap_text' },
  { id: 'chicken',    label: 'Chicken',    icon: 'kebab_dining' },
  { id: 'pasta',      label: 'Pasta',      icon: 'ramen_dining' },
  { id: 'sandwiches', label: 'Sandwiches', icon: 'lunch_dining' },
  { id: 'desserts',   label: 'Desserts',   icon: 'icecream' }
];

const PO_MEMBERSHIP = {
  headline: 'One Membership, Many Benefits',
  pitch: 'A membership program that takes you straight to a no-nonsense, curated selection of restaurants.',
  benefits: [
    {
      icon: 'percent',
      title: '30% OFF on Every Order',
      desc: 'Members get 30% discount on all restaurants — every single order, no exceptions.',
      color: '#2E7D32'
    },
    {
      icon: 'delivery_dining',
      title: '₹0 Delivery Fee — Always',
      desc: 'Zero delivery charges on all orders for members. No minimum order value.',
      color: '#1565C0'
    },
    {
      icon: 'inventory_2',
      title: '₹0 Packaging Fee',
      desc: 'No packaging charges added at checkout for members.',
      color: '#6A1B9A'
    },
    {
      icon: 'devices',
      title: '₹0 Platform Fee',
      desc: 'No hidden platform or convenience fees for members.',
      color: '#E65100'
    },
    {
      icon: 'restaurant_menu',
      title: 'Curated Restaurant Selection',
      desc: 'Access to all 14 EatClub brand restaurants — all in one app.',
      color: '#00695C'
    },
    {
      icon: 'savings',
      title: 'Unlimited Savings',
      desc: 'No cap on how much you can save — savings compound with every order.',
      color: '#F57F17'
    }
  ],
  agent_script: 'If customer asks about membership: "EatClub membership dene par aapko har order par 30% OFF milega plus ₹0 Delivery, ₹0 Packaging aur ₹0 Platform fee — one flat membership, unlimited savings."'
};

const PO_FOOTER_LINKS = [
  {
    category: 'COMPANY',
    icon: 'business',
    color: '#1565C0',
    links: [
      { label: 'About Us',   url: 'https://www.eatclub.in/about', desc: 'EatClub brand story and team info' }
    ]
  },
  {
    category: 'GET HELP',
    icon: 'support_agent',
    color: '#2E7D32',
    links: [
      { label: 'Contact Us',       url: 'https://www.eatclub.in/contact',          desc: 'Customer support contact page' },
      { label: 'Help & Support',   url: 'https://www.eatclub.in/help',             desc: 'FAQs and self-service support' },
      { label: 'Delivery Policies',url: 'https://www.eatclub.in/delivery-policy',  desc: 'Delivery terms and conditions' },
      { label: 'Privacy Policies', url: 'https://www.eatclub.in/privacy',          desc: 'Data privacy information' },
      { label: 'Disclaimers',      url: 'https://www.eatclub.in/disclaimers',      desc: 'Legal disclaimers' }
    ]
  },
  {
    category: 'EXPLORE',
    icon: 'explore',
    color: '#E65100',
    links: [
      { label: 'Offers',      url: 'https://www.eatclub.in/offers',     desc: 'All current offers and promo codes' },
      { label: 'Bulk Order',  url: 'https://www.eatclub.in/bulk-order', desc: 'Corporate / large quantity orders' }
    ]
  }
];

export default function PlatformOverview() {
  const [poBrandFilter, setPOBrandFilter] = useState('all');
  const [openTooltip, setOpenTooltip] = useState(null);

  const filteredBrands = poBrandFilter === 'all' ? PO_BRANDS : PO_BRANDS.filter(b => b.category === poBrandFilter);

  const copyText = (txt) => {
    navigator.clipboard.writeText(txt);
  };

  return (
    <div className="page-content" id="page-platform-overview">

      <div className="page-header" style={{ animation: 'gravityDrop .45s ease both' }}>
        <div className="ph-chip">Customer Perspective · Live Platform</div>
        <h1 className="ph-title">EatClub <em>Platform</em> Guide</h1>
        <p className="ph-sub">
          Understand exactly what customers see on eatclub.in — 
          brands, deals, navigation, promo codes & membership.
          Knowing the platform helps you handle queries faster.
        </p>
        <a href="https://www.eatclub.in" target="_blank" rel="noopener noreferrer" className="btn po-live-btn" style={{marginTop: 12, display: 'inline-flex', padding: '8px 16px', borderRadius: 8, background: 'var(--md-surface-variant)', color: 'var(--md-on-surface)', textDecoration: 'none', alignItems: 'center', gap: 6, fontWeight: 700}}>
          <span className="material-symbols-outlined" style={{fontSize: 18}}>open_in_new</span>
          Open eatclub.in
        </a>
      </div>

      <div className="po-pills-row" style={{ animation: 'gravityDrop .45s .05s ease both' }}>
        <div className="po-pill po-pill-orange">
          <span className="material-symbols-outlined">local_offer</span>
          <div>
            <div className="po-pill-label">Active Code</div>
            <div className="po-pill-value">FIRST3</div>
          </div>
        </div>
        <div className="po-pill po-pill-green">
          <span className="material-symbols-outlined">percent</span>
          <div>
            <div className="po-pill-label">New User Offer</div>
            <div className="po-pill-value">50% OFF</div>
          </div>
        </div>
        <div className="po-pill po-pill-blue">
          <span className="material-symbols-outlined">delivery_dining</span>
          <div>
            <div className="po-pill-label">Delivery Fee</div>
            <div className="po-pill-value">₹0 Always</div>
          </div>
        </div>
        <div className="po-pill po-pill-purple">
          <span className="material-symbols-outlined">inventory_2</span>
          <div>
            <div className="po-pill-label">Packaging Fee</div>
            <div className="po-pill-value">₹0 Always</div>
          </div>
        </div>
        <div className="po-pill po-pill-teal">
          <span className="material-symbols-outlined">devices</span>
          <div>
            <div className="po-pill-label">Platform Fee</div>
            <div className="po-pill-value">₹0 Always</div>
          </div>
        </div>
        <div className="po-pill po-pill-amber">
          <span className="material-symbols-outlined">restaurant</span>
          <div>
            <div className="po-pill-label">Total Brands</div>
            <div className="po-pill-value">14 Restaurants</div>
          </div>
        </div>
      </div>

      <section className="po-section" style={{ animation: 'slideUp .4s .08s ease both' }}>
        <div className="po-section-hd">
          <h2 className="po-section-title">
            <span className="material-symbols-outlined">menu</span>
            Website Navigation
          </h2>
          <span className="po-section-sub">What customers see in the top nav bar</span>
        </div>
        <div className="po-nav-map card" id="poNavMap">
          <div className="po-nav-bar">
            <div className="po-nav-logo">
              <strong style={{ fontSize: '18px', letterSpacing: '-1px' }}>EAT<br/>CLUB</strong>
            </div>
            {PO_NAV_ITEMS.map((n, idx) => (
              <div key={idx} className="po-nav-item-wrap" onClick={() => setOpenTooltip(openTooltip === idx ? null : idx)}>
                <div className="po-nav-btn" style={{ '--nc': n.color }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>{n.icon}</span>
                  <span>{n.label}</span>
                </div>
                <div className={`po-nav-tooltip ${openTooltip === idx ? 'visible' : ''}`}>
                  <div className="po-nt-title">{n.label}</div>
                  <div className="po-nt-desc">{n.desc}</div>
                  <div className="po-nt-agent">
                    <span className="material-symbols-outlined" style={{ fontSize: '13px', flexShrink: 0 }}>support_agent</span>
                    <span>{n.agent_note}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: '11px', color: 'var(--md-on-surface-var)', padding: '10px 16px 12px', margin: 0 }}>
            💡 Tap any nav item to see agent guidance
          </p>
        </div>
      </section>

      <section className="po-section" style={{ animation: 'slideUp .4s .14s ease both' }}>
        <div className="po-section-hd">
          <h2 className="po-section-title">
            <span className="material-symbols-outlined">sell</span>
            Current Deals & Offers
          </h2>
          <span className="po-section-sub">What customers currently see on homepage</span>
        </div>
        <div className="po-deals-grid">
          {PO_DEALS.map((d, i) => (
            <div key={i} className="po-deal-card card" style={{ animation: `springPop .4s ${i * .06}s ease both`, opacity: 0, animationFillMode: 'both' }}>
              <div className="po-deal-top" style={{ background: `${d.color}18`, borderBottom: `1px solid ${d.color}25` }}>
                <div className="po-deal-type" style={{ background: d.color, color: 'white' }}>
                  {d.type}
                </div>
                <span className="material-symbols-outlined" style={{ color: d.color, fontSize: '24px' }}>{d.icon}</span>
              </div>
              <div className="po-deal-body">
                <div className="po-deal-title">{d.title}</div>
                {d.code && (
                  <div className="po-deal-code">
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>confirmation_number</span>
                    Code: <strong>{d.code}</strong>
                    <button className="btn po-copy-btn" style={{padding: '4px 8px', fontSize: 10, borderRadius: 4, marginLeft: 8}} onClick={() => copyText(d.code)}>Copy</button>
                  </div>
                )}
                <ul className="po-deal-list">
                  {d.details.map((x, idx) => <li key={idx}>{x}</li>)}
                </ul>
                <div className="po-deal-agent">
                  <span className="material-symbols-outlined" style={{ fontSize: '13px', flexShrink: 0, color: 'var(--md-primary)' }}>support_agent</span>
                  <span>{d.agent_note}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="po-section" style={{ animation: 'slideUp .4s .2s ease both' }}>
        <div className="po-section-hd">
          <h2 className="po-section-title">
            <span className="material-symbols-outlined">store</span>
            All Restaurant Brands on Platform
          </h2>
          <span className="po-section-sub">
            <span id="poBrandCount">{filteredBrands.length}</span> brands · All with ₹0 Delivery, ₹0 Packaging, ₹0 Platform Fee
          </span>
        </div>

        <div className="po-brand-filters">
          {PO_BRAND_CATEGORIES.map(c => (
            <button key={c.id} className={`po-brand-chip ${poBrandFilter === c.id ? 'po-brand-chip-active' : ''}`} onClick={() => setPOBrandFilter(c.id)}>
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>{c.icon}</span>
              {c.label}
            </button>
          ))}
        </div>

        <div className="po-brands-grid">
          {filteredBrands.length ? filteredBrands.map((b, i) => (
            <div key={b.name} className="po-brand-card card" style={{ animation: `springPop .35s ${i * .04}s ease both`, opacity: 0, animationFillMode: 'both', borderLeft: `3px solid ${b.color}` }}>
              <div className="po-brand-head">
                <div className="po-brand-emoji" style={{ background: `${b.color}15` }}>{b.emoji}</div>
                <div className="po-brand-info">
                  <div className="po-brand-name">{b.name}
                    {b.subtitle && <span className="po-brand-sub"> — {b.subtitle}</span>}
                  </div>
                  <div className="po-brand-tagline">{b.tagline}</div>
                </div>
              </div>
              <div className="po-brand-highlight" style={{ background: `${b.color}10`, color: b.color }}>
                ✦ {b.highlight}
              </div>
              <div className="po-brand-fees">{b.fees}</div>
              <div className="po-brand-tip">
                <span className="material-symbols-outlined" style={{ fontSize: '13px', flexShrink: 0, color: 'var(--md-primary)' }}>tips_and_updates</span>
                <span>{b.agent_tip}</span>
              </div>
            </div>
          )) : <div style={{ padding: '32px', textAlign: 'center', color: 'var(--md-on-surface-var)' }}>No brands in this category</div>}
        </div>
      </section>

      <section className="po-section" style={{ animation: 'slideUp .4s .26s ease both' }}>
        <div className="po-section-hd">
          <h2 className="po-section-title">
            <span className="material-symbols-outlined">card_membership</span>
            EatClub Membership
          </h2>
          <span className="po-section-sub">
            What agents should tell customers about the membership program
          </span>
        </div>
        <div className="po-membership-wrap">
          <div className="po-member-hero card" style={{ animation: 'gravityDrop .45s ease both', background: 'linear-gradient(135deg, rgba(255,87,34,.08), rgba(255,87,34,.02))' }}>
            <div className="po-member-top">
              <div>
                <div className="po-member-headline">{PO_MEMBERSHIP.headline}</div>
                <div className="po-member-pitch">{PO_MEMBERSHIP.pitch}</div>
              </div>
              <span className="material-symbols-outlined po-member-icon">card_membership</span>
            </div>
            <div className="po-member-grid">
              {PO_MEMBERSHIP.benefits.map((b, i) => (
                <div key={i} className="po-member-benefit" style={{ animation: `springPop .4s ${i * .07}s ease both`, opacity: 0, animationFillMode: 'both' }}>
                  <div className="po-mb-icon" style={{ background: `${b.color}18`, color: b.color }}>
                    <span className="material-symbols-outlined">{b.icon}</span>
                  </div>
                  <div>
                    <div className="po-mb-title">{b.title}</div>
                    <div className="po-mb-desc">{b.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="po-member-script">
              <span className="material-symbols-outlined" style={{ fontSize: '16px', flexShrink: 0, color: 'var(--md-primary)' }}>record_voice_over</span>
              <div>
                <strong style={{ fontSize: '11px', display: 'block', marginBottom: '3px' }}>Agent Script</strong>
                <span style={{ fontSize: '11px' }}>{PO_MEMBERSHIP.agent_script}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="po-section" style={{ animation: 'slideUp .4s .3s ease both' }}>
        <div className="po-section-hd">
          <h2 className="po-section-title">
            <span className="material-symbols-outlined">smartphone</span>
            App & Download Info
          </h2>
        </div>
        <div className="po-app-card card">
          <div className="po-app-inner">
            <div className="po-app-text">
              <div className="po-app-title">EatClub App</div>
              <p className="po-app-desc">
                Customers can order via the <strong>EatClub app</strong> (Android & iOS) 
                or directly on <strong>eatclub.in</strong>. 
                If a customer asks about downloading the app, direct them to scan 
                the QR code on the website or search "EatClub" on the Play Store / App Store.
              </p>
              <div className="po-app-tags">
                <span className="po-app-tag">🤖 Android — Play Store</span>
                <span className="po-app-tag">🍎 iOS — App Store</span>
                <span className="po-app-tag">🌐 eatclub.in</span>
              </div>
            </div>
            <div className="po-app-code-note">
              <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--md-primary)' }}>qr_code_2</span>
              <div style={{ fontSize: '11px', color: 'var(--md-on-surface-var)', textAlign: 'center', marginTop: '6px' }}>
                QR on website<br/>to download app
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="po-section" style={{ animation: 'slideUp .4s .34s ease both' }}>
        <div className="po-section-hd">
          <h2 className="po-section-title">
            <span className="material-symbols-outlined">link</span>
            Website Footer Links
          </h2>
          <span className="po-section-sub">Useful links to share with customers</span>
        </div>
        <div className="po-footer-links-grid">
          {PO_FOOTER_LINKS.map((col, i) => (
            <div key={i} className="po-footer-col card" style={{ animation: `slideUp .4s ${i * .08}s ease both`, opacity: 0, animationFillMode: 'both' }}>
              <div className="po-footer-col-head">
                <span className="material-symbols-outlined" style={{ color: col.color }}>{col.icon}</span>
                <strong>{col.category}</strong>
              </div>
              <div className="po-footer-link-list">
                {col.links.map(lk => (
                  <a key={lk.label} href={lk.url} target="_blank" rel="noopener noreferrer" className="po-footer-link" style={{textDecoration:'none', color:'var(--md-on-surface)', display:'flex', flexDirection:'column', gap:4, marginBottom:12}}>
                    <div style={{fontWeight:600}}>{lk.label}</div>
                    <div style={{fontSize:10, color:'var(--md-on-surface-var)'}}>{lk.desc}</div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
