# EatClub Fully Functional Menu Explorer & Training Site - Antigravity Generation Prompt

**Objective:**
Rebuild the "EatClub Menu Explorer" for an external site or new module, identically porting the complex React structure, the high-fidelity CSS styling, and the completely populated Menu Database (comprising multiple brands, items, portioning, prices, and agent tips).

---

## Instructions for Developer/AI:

1. Copy the contents of the `eatclubMenu.js` file into your project's data folder.
2. Copy the CSS block below into your `EatClubMenu.css` file.
3. Copy the React component into `EatClubMenu.jsx` and ensure that `lucide-react` or material icons are installed for UI functionality.

---

### 1. The Menu Database (`src/data/eatclubMenu.js`)

```javascript
/* ════════════════════════════════════════════════
   EATCLUB MENU & BRAND DATABASE
   Generated via Google Antigravity
════════════════════════════════════════════════ */

export const ME_BRANDS = [
  { id: 'all', name: 'All Brands', emoji: '🍽️', color: '#FF5722' },
  { id: 'box8', name: 'BOX8', shortDesc: 'Desi Meals', emoji: '🍱', color: '#ffb300' },
  { id: 'mojo', name: 'MOJO Pizza', shortDesc: '2X Toppings', emoji: '🍕', color: '#e53935' },
  { id: 'leancrust', name: 'LeanCrust', shortDesc: 'Thin Crust', emoji: '🍕', color: '#43a047' },
  { id: 'itminaan', name: 'Itminaan', shortDesc: 'Matka Biryani', emoji: '🫙', color: '#5d4037' },
  { id: 'nh1', name: 'NH1 Bowls', shortDesc: 'Biryani', emoji: '🍚', color: '#e91e63' },
  { id: 'wefit', name: 'WeFit', shortDesc: 'Protein Meals', emoji: '🥗', color: '#8bc34a' },
  { id: 'mealful', name: 'Mealful Rolls', shortDesc: 'Big Rolls', emoji: '🌯', color: '#fdd835' },
  { id: 'hola', name: 'Hola Pasta', shortDesc: 'Gourmet Pasta', emoji: '🍝', color: '#ff9800' }
];

export const meImgUrl = (slug) => {
  return slug ? `https://assets.box8.co.in/box8/items/${slug}.jpg` : null;
};

export const mePassPrice = (mrp) => {
  return Math.ceil(Math.floor(mrp * 0.7)); 
};

export const ME_ITEMS = [
  // ================= BOX8 =================
  {
    id: "bx8-dum-aloo",
    brand: "box8",
    category: "Desi Meals",
    name: "Kashmiri Dum Aloo Meal",
    veg: true,
    mrp: 238,
    desc: "Baby potatoes slow-cooked in a rich yogurt & cashew gravy, served with aromatic rice/parathas.",
    ingredients: ["Baby Potatoes", "Kashmiri Red Chilli", "Yogurt", "Cashew Paste", "Basmati Rice/Parathas"],
    portion: "Serves 1 (Approx 450g) | 1 Base + 1 Main + Salad",
    image_slug: "kashmiri-dum-aloo-meal",
    portioning_note: "Total weight should be strictly 450g. Gravy: 200g, Rice: 200g.",
    agent_tip: "If customer complains about spice level, politely explain Kashmiri chilli provides color, not intense heat. Issue 20% refund if strictly dissatisfied."
  },
  {
    id: "bx8-paneer-makhani",
    brand: "box8",
    category: "Desi Meals",
    name: "Paneer Makhani Meal",
    veg: true,
    mrp: 298,
    desc: "Soft paneer cubes in our signature creamy tomato & butter gravy, served with your choice of base.",
    ingredients: ["Paneer Cubes (6 pcs)", "Tomato Puree", "Cream & Butter", "Kasuri Methi", "Basmati Rice/Parathas"],
    portion: "Serves 1 (Approx 450g) | 1 Base + 1 Main + Salad",
    image_slug: "paneer-makhani-meal",
    portioning_note: "Must contain exactly 6 paneer cubes. Standard gravy weight: 200g.",
    agent_tip: "Common complaint is 'sweetness'. Explain Makhani gravies are naturally sweeter. Deny refund for sweetness unless completely spoilt."
  },
  {
    id: "bx8-chicken-tikka",
    brand: "box8",
    category: "Desi Meals",
    name: "Chicken Tikka Meal",
    veg: false,
    mrp: 338,
    desc: "Tandoor roasted chicken chunks in mildly spiced onion-tomato gravy, served with your choice of base.",
    ingredients: ["Roasted Boneless Chicken (6 pcs)", "Onion-Tomato Masala", "Garam Masala", "Basmati Rice/Parathas"],
    portion: "Serves 1 (Approx 450g) | 1 Base + 1 Main + Salad",
    image_slug: "chicken-tikka-meal",
    portioning_note: "Must contain 6 boneless chicken chunks. No bones allowed.",
    agent_tip: "If bone found in boneless meal, apologize profusely and initiate a 100% refund or free replacement immediately."
  },
  {
    id: "bx8-dal-makhani",
    brand: "box8",
    category: "Desi Meals",
    name: "Dal Makhani Meal",
    veg: true,
    mrp: 228,
    desc: "Overnight slow-cooked black dal & creamy butter, served with choice of base and salad.",
    ingredients: ["Whole Black Urad Dal", "Rajma", "Butter", "Fresh Cream", "Basmati Rice/Parathas"],
    portion: "Serves 1 (Approx 450g)",
    image_slug: "dal-makhani-meal",
    portioning_note: "Dal portion: 220g. Should be thick, not watery.",
    agent_tip: "Check consistency complaints. Dal Makhani is slow-cooked for 12 hours. Offer standard 15% discount for consistency/taste issues."
  },

  // ================= MOJO PIZZA =================
  {
    id: "mj-margherita",
    brand: "mojo",
    category: "Pizzas",
    name: "Classic Margherita",
    veg: true,
    mrp: 299,
    desc: "Classic delight with 100% real mozzarella cheese on our signature base. Always double cheese!",
    ingredients: ["Mojo Pizza Base (10 inch)", "Double Mozzarella Cheese", "Signature Tomato Sauce"],
    portion: "Medium (10 inch) | Serves 2",
    image_slug: "margherita-pizza",
    portioning_note: "Ensure cheese pull. Double cheese baked till golden.",
    agent_tip: "If customer complains 'no toppings', remind them Margherita is a plain cheese pizza. No refund."
  },
  {
    id: "mj-farmer-market",
    brand: "mojo",
    category: "Pizzas",
    name: "Farmers Market Pizza",
    veg: true,
    mrp: 499,
    desc: "Loaded with crunchy capsicum, onion, mushroom, corn & black olives with double cheese.",
    ingredients: ["Onion", "Capsicum", "Mushroom", "Sweet Corn", "Black Olives", "Mozzarella Cheese"],
    portion: "Medium (10 inch) | Serves 2",
    image_slug: "farmers-market-pizza",
    portioning_note: "Toppings should be edge-to-edge.",
    agent_tip: "Missing topping complaints require photo proof for 50%+ refund. Otherwise, offer Rs 100 EatClub cash."
  },
  {
    id: "mj-crowd-pleaser",
    brand: "mojo",
    category: "Pizzas",
    name: "Crowd Pleaser Pizza",
    veg: false,
    mrp: 549,
    desc: "Double meat combo of spicy chicken tikka and herb grilled chicken along with onions & double cheese.",
    ingredients: ["Spicy Chicken Tikka", "Herb Grilled Chicken", "Onion", "Double Mozzarella Cheese", "Signature Sauce"],
    portion: "Medium (10 inch) | Serves 2 | 2X Toppings",
    image_slug: "crowd-pleaser-pizza",
    portioning_note: "Minimum 12 chunks of chicken total.",
    agent_tip: "Ensure clear photos if customer claims 'less toppings' as MOJO guarantees 2X toppings. If proven false, politely decline refund."
  },

  // ================= LEANCRUST =================
  {
    id: "lc-veggie-supreme",
    brand: "leancrust",
    category: "Thin Crust",
    name: "Farmhouse Thin Crust",
    veg: true,
    mrp: 449,
    desc: "Light, ultra-thin crust loaded with bell peppers, tomatoes, onions, mushrooms & olives.",
    ingredients: ["Whole Wheat Thin Crust (10 inch)", "Trifecta Bell Peppers", "Mushrooms", "Black Olives", "Low-fat Mozzarella"],
    portion: "Medium (10 inch) | Serves 2",
    image_slug: "lc-farmhouse-pizza",
    portioning_note: "Crust thickness < 3mm. Cut strictly into 6 slices.",
    agent_tip: "If 'burnt edge' complaint: thin crust edges naturally char faster due to high heat baking. Educate customer, 10% EC cash gesture if angry."
  },
  {
    id: "lc-peri-chicken",
    brand: "leancrust",
    category: "Thin Crust",
    name: "Peri Peri Chicken Thin Crust",
    veg: false,
    mrp: 529,
    desc: "Fiery peri peri chicken, red onions, red paprika heavily topped on an ultra-thin crust.",
    ingredients: ["Thin Crust Base", "Peri Peri Chicken Chunks", "Red Onions", "Red Paprika", "Low-fat Cheese"],
    portion: "Medium (10 inch) | Serves 2",
    image_slug: "lc-peri-chicken",
    portioning_note: "10 chicken chunks evenly distributed.",
    agent_tip: "Spicy warning! Address 'too spicy' complaints politely, no refund for spice intolerance."
  },

  // ================= ITMINAAN =================
  {
    id: "it-chicken-biryani",
    brand: "itminaan",
    category: "Matka Biryani",
    name: "Chicken Matka Biryani",
    veg: false,
    mrp: 349,
    desc: "Slow-cooked in authentic Dum-Pukht style, served in an earthen matka. Aromatic & flavourful.",
    ingredients: ["Boneless Chicken Chunks (5 pcs)", "Long grain Basmati", "Fried Onions (Birista)", "Mint Leaves", "Saffron Milk"],
    portion: "Serves 1-2 (500g) | 5 Boneless Pcs | Served with Raita",
    image_slug: "chicken-dum-biryani",
    portioning_note: "Served exclusively in signature Earthen Matka container. 5 distinct chicken pieces.",
    agent_tip: "If Matka broken on delivery: Apologize, offer 100% refund or re-delivery immediately. Flag rider."
  },
  {
    id: "it-veg-biryani",
    brand: "itminaan",
    category: "Matka Biryani",
    name: "Veg Matka Biryani",
    veg: true,
    mrp: 289,
    desc: "Slow-cooked veg dum biryani in earthen matka — garden fresh veggies, paneer and royal spices.",
    ingredients: ["Carrots, Beans, Cauliflower", "Paneer Cubes (4 pcs)", "Premium Basmati Rice", "Dum Masala"],
    portion: "Serves 1-2 (500g) | Served with Raita",
    image_slug: "veg-dum-biryani",
    portioning_note: "Must have at least 4 paneer cubes mixed with vegetables.",
    agent_tip: "If missing raita: Process a flat Rs 40 partial refund to EatClub wallet immediately without argument."
  },
  {
    id: "it-mutton-biryani",
    brand: "itminaan",
    category: "Matka Biryani",
    name: "Mutton Matka Biryani",
    veg: false,
    mrp: 449,
    desc: "Slow-dum-cooked mutton biryani in matka — tender mutton falling off the bone.",
    ingredients: ["Bone-in Mutton Pieces (3-4 pcs)", "Whole Spices", "Basmati Rice", "Ghee", "Kewra Water"],
    portion: "Serves 1-2 (500g) | 3-4 Bone-in Pcs | With Raita",
    image_slug: "mutton-dum-biryani",
    portioning_note: "Mutton contains bones. Meat should be tender. 3-4 pieces standard.",
    agent_tip: "If customer complains about bones: Mutton Biryani is explicitly bone-in for flavor. Deny refund."
  },

  // ================= NH1 BOWLS =================
  {
    id: "nh-chole-rice",
    brand: "nh1",
    category: "Bowls",
    name: "Amritsari Chole Rice Bowl",
    veg: true,
    mrp: 199,
    desc: "Comfort in a bowl! Authentic Amritsari chole served over jeera rice with pickled onions.",
    ingredients: ["Kabuli Chana", "Amritsari Masala", "Jeera Rice", "Sirka Pyaaz (Pickled Onions)"],
    portion: "Regular Bowl (400g)",
    image_slug: "chole-chawal-bowl",
    portioning_note: "200g Rice + 200g Chole.",
    agent_tip: "Often ordered for quick single meals. Quick resolution required, Rs 50 credit if spilled."
  },
  {
    id: "nh-rajma-rice",
    brand: "nh1",
    category: "Bowls",
    name: "Rajma Chawal Bowl",
    veg: true,
    mrp: 199,
    desc: "Delhi style Rajma chawal to make you feel at home. Simple, nostalgic, and delicious.",
    ingredients: ["Red Kidney Beans (Rajma)", "Tomato-Onion Gravy", "Steamed Rice", "Desi Ghee"],
    portion: "Regular Bowl (400g)",
    image_slug: "rajma-chawal-bowl",
    portioning_note: "Ensure proper ratio (1:1 rice to gravy).",
    agent_tip: "Comfort food classic. Taste complaints are subjective, limit logic to ingredient freshness."
  },

  // ================= WEFIT =================
  {
    id: "wf-grilled-chicken",
    brand: "wefit",
    category: "Protein Meals",
    name: "High Protein Grilled Chicken",
    veg: false,
    mrp: 350,
    desc: "Lean grilled chicken breast served with roasted veggies and a light jus. Keto-friendly.",
    ingredients: ["Chicken Breast (150g)", "Broccoli", "Bell Peppers", "Olive Oil", "Herb Jus"],
    portion: "Regular (350g) | Protein: 42g | Calories: 320 kcal",
    image_slug: "wefit-grilled-chicken",
    portioning_note: "Chicken weight raw is 200g, cooked is ~150g.",
    agent_tip: "Health conscious customers. If they complain chicken is 'dry', explain lean breast meat lacks fat. No replacements for dryness, only if undercooked."
  },
  {
    id: "wf-tofu-salad",
    brand: "wefit",
    category: "Protein Meals",
    name: "Asian Tofu Protein Salad",
    veg: true,
    mrp: 275,
    desc: "Fresh greens piled high with sesame glazed tofu, edamame and a ginger-soy dressing.",
    ingredients: ["Firm Tofu", "Mixed Greens", "Edamame Beans", "Cherry Tomatoes", "Ginger-Soy Dressing"],
    portion: "Large Bowl (300g) | Protein: 22g | Calories: 240 kcal",
    image_slug: "wefit-tofu-salad",
    portioning_note: "Dressing must be sent in a separate sealed 30ml container.",
    agent_tip: "If dressing is mixed inside or missing entirely: Issue full replacement or 100% refund."
  },

  // ================= MEALFUL ROLLS =================
  {
    id: "mr-chicken-bhuna",
    brand: "mealful",
    category: "Big Rolls",
    name: "Chicken Bhuna Roll",
    veg: false,
    mrp: 239,
    desc: "A massive roll stuffed with slow roasted chicken bhuna, onions and mint chutney wrapped in a flaky paratha.",
    ingredients: ["Chicken Bhuna Masala", "Flaky Laccha Paratha", "Sliced Onions", "Mint Mayo/Chutney"],
    portion: "Jumbo Roll (300g) | Wrapped in foil",
    image_slug: "chicken-bhuna-roll",
    portioning_note: "Roll diameter must be at least 2.5 inches. Properly sealed ends.",
    agent_tip: "If filling spills heavily out of the roll during delivery: 30% discount code."
  },
  {
    id: "mr-paneer-tikka",
    brand: "mealful",
    category: "Big Rolls",
    name: "Paneer Tikka Jumbo Roll",
    veg: true,
    mrp: 229,
    desc: "Juicy paneer tikka chunks wrapped with crunchy capsicum and onions in a flaky paratha.",
    ingredients: ["Paneer Tikka Chunks (6 pcs)", "Capsicum & Onion", "Mint Chutney", "Laccha Paratha"],
    portion: "Jumbo Roll (300g) | Wrapped in foil",
    image_slug: "paneer-tikka-roll",
    portioning_note: "Ensure at least 6 pieces of paneer inside the roll.",
    agent_tip: "Soggy roll complaints: Usually due to steam trap in foil during transit. Offer 15% wallet credit."
  },

  // ================= HOLA PASTA =================
  {
    id: "hp-arrabbiata",
    brand: "hola",
    category: "Gourmet Pasta",
    name: "Penne Arrabbiata",
    veg: true,
    mrp: 289,
    desc: "Classic spicy tomato and garlic sauce tossed with penne pasta and fresh basil.",
    ingredients: ["Penne Pasta", "San Marzano Tomato Sauce", "Garlic", "Chilli Flakes", "Fresh Basil"],
    portion: "Regular (350g) | Served with Garlic Bread",
    image_slug: "penne-arrabbiata",
    portioning_note: "Sauce ratio is 1:1 to pasta. Not dry.",
    agent_tip: "If garlic bread is missing: Issue Rs 60 partial refund immediately."
  },
  {
    id: "hp-alfredo-chicken",
    brand: "hola",
    category: "Gourmet Pasta",
    name: "Chicken Alfredo Cream Pasta",
    veg: false,
    mrp: 349,
    desc: "Rich, creamy parmesan sauce over penne with roasted chicken bits and mushrooms.",
    ingredients: ["Penne Pasta", "Cream & Parmesan", "Roasted Chicken Chunks", "Button Mushrooms"],
    portion: "Regular (350g) | Served with Garlic Bread",
    image_slug: "chicken-alfredo",
    portioning_note: "Chicken chunks: Minimum 50g cooked.",
    agent_tip: "Cream sauces thicken heavily during transit. Tell customer to stir well or microwave for 20 seconds."
  }
];

// Combine arrays to export
export const MENU_DB = {
    brands: ME_BRANDS,
    items: ME_ITEMS
};
```

---

### 2. The Main Interactive React Component (`src/pages/EatClubMenu.jsx`)

```javascript
/* eslint-disable react/prop-types */
import { useState, useMemo } from 'react';
import { ME_BRANDS, ME_ITEMS, meImgUrl, mePassPrice } from '../data/eatclubMenu';
import './EatClubMenu.css';

export default function EatClubMenu() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeBrand, setActiveBrand] = useState('all');
  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedItems, setExpandedItems] = useState({});

  const toggleExpand = (id) => {
    setExpandedItems(prev => ({...prev, [id]: !prev[id]}));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setActiveBrand('all');
    setActiveCategory('All');
  };

  const clearSearch = () => setSearchTerm('');

  // Extract unique categories based on active brand/search
  const availableCategories = useMemo(() => {
    if (searchTerm) return [];
    let items = ME_ITEMS;
    if (activeBrand !== 'all') {
      items = items.filter(i => i.brand === activeBrand);
    }
    const cats = new Set(items.map(i => i.category));
    return ['All', ...cats];
  }, [activeBrand, searchTerm]);

  // Main filter pipeline
  const filteredItems = useMemo(() => {
    let rs = ME_ITEMS;
    
    // POWER SEARCH FILTERING
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return rs.filter(item => {
         const matchesName = item.name.toLowerCase().includes(q);
         const matchesDesc = item.desc.toLowerCase().includes(q);
         const matchesIng = item.ingredients.some(i => i.toLowerCase().includes(q));
         const matchesBrand = item.brand.toLowerCase().includes(q);
         const matchesTip = item.agent_tip.toLowerCase().includes(q);
         return matchesName || matchesDesc || matchesIng || matchesBrand || matchesTip;
      });
    }

    if (activeBrand !== 'all') rs = rs.filter(i => i.brand === activeBrand);
    if (activeCategory !== 'All') rs = rs.filter(i => i.category === activeCategory);
    return rs;
  }, [activeBrand, activeCategory, searchTerm]);

  // Highlighting utility for search results
  const highlightText = (text, query) => {
    if (!query || !text) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() ? 
        <mark key={i} className="me-hl">{part}</mark> : 
        part
    );
  };

  return (
    <div className="page-content slide-up">
      <div className="card hero-card" style={{ padding: '24px 32px', marginBottom: 24, background: 'var(--md-surface-variant)', border: '1px solid var(--md-outline)' }}>
        <p className="me-hero-sub" style={{ fontSize: 11, fontWeight: 800, color: 'var(--md-primary)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>location_on</span>
          CHANDIVALI • POWAI LOCATION
        </p>
        <h1 className="page-title" style={{ fontSize: 32, fontWeight: 900, marginBottom: 12 }}>
          Menu <span style={{ color: 'var(--md-primary)' }}>Explorer</span>
        </h1>
        <p className="page-desc" style={{ fontSize: 13, color: 'var(--md-on-surface-var)', maxWidth: 650, lineHeight: 1.5 }}>
          Search any item a customer mentions — instantly see ingredients, portioning, MRP vs EatClub Pass price, and specific agent handling tips extracted live from the master database.
        </p>
      </div>

      {/* Power Search */}
      <div className="me-search-hero">
        <div className="me-search-wrap">
          <span className="material-symbols-outlined me-search-icon">search</span>
          <input 
            type="text" 
            placeholder="Search item, ingredient, brand... e.g. 'Dal Makhani', 'Pizza', 'Margherita'"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {searchTerm && (
            <button className="me-search-clear" onClick={clearSearch}>
              <span className="material-symbols-outlined">close</span>
            </button>
          )}
        </div>
        {searchTerm && (
           <div className="me-search-stats">
              Found <b>{filteredItems.length}</b> result{filteredItems.length !== 1 ? 's' : ''} for "{searchTerm}"
           </div>
        )}
      </div>

      {/* Mode 1: Search Results View (Takes Over) */}
      {searchTerm && (
        <div className="me-results-panel">
          {filteredItems.length === 0 ? (
             <div className="card me-empty">
                <span className="material-symbols-outlined" style={{fontSize: 48, opacity: 0.5}}>search_off</span>
                <h3>No items found</h3>
                <p>Try searching for a different ingredient or item name.</p>
             </div>
          ) : (
            filteredItems.map(item => {
              const b = ME_BRANDS.find(x => x.id === item.brand);
              const pPrice = mePassPrice(item.mrp);
              return (
                <div key={item.id} className="card me-result-card slide-up">
                  <div className="me-result-header">
                     <div className="me-result-brand-badge" style={{ background: b.color + '1A', color: b.color, border: `1px solid ${b.color}33` }}>
                        {b.emoji} {b.name.toUpperCase()}
                     </div>
                  </div>
                  <h3 className="me-result-name">{highlightText(item.name, searchTerm)}</h3>
                  <div className="me-result-cat">{item.category} • {item.veg ? 'Veg 🟩' : 'Non-Veg 🟥'}</div>
                  <p className="me-result-desc">{highlightText(item.desc, searchTerm)}</p>

                  <div className="me-result-price-block">
                     <div className="me-rp-mrp">
                        <span className="me-rp-label">Store MRP</span>
                        <span className="me-rp-value-mrp">₹{item.mrp}</span>
                     </div>
                     <span className="material-symbols-outlined me-rp-arrow">arrow_right_alt</span>
                     <div className="me-rp-pass">
                        <span className="me-rp-label">EatClub Pass</span>
                        <span className="me-rp-value-pass">₹{pPrice}</span>
                        <span className="me-rp-saving">Save ₹{item.mrp - pPrice}</span>
                     </div>
                  </div>

                  <div className="me-result-ing-section">
                    <div className="me-result-section-label">Core Ingredients</div>
                    <div className="me-result-ing-tags">
                       {item.ingredients.map((ing, i) => (
                         <span key={i} className="me-ing-tag">{highlightText(ing, searchTerm)}</span>
                       ))}
                    </div>
                  </div>

                  <div className="me-result-portion">
                     <span className="material-symbols-outlined" style={{fontSize: 16, color: 'var(--md-primary)'}}>scale</span>
                     <div>
                       <strong style={{display: 'block', fontSize: 10, marginBottom: 2}}>Portion Details</strong>
                       {highlightText(item.portion, searchTerm)}
                     </div>
                  </div>

                  <div className="me-result-pnote">
                     <span className="material-symbols-outlined" style={{fontSize: 16, color: '#f57c00'}}>check_circle</span>
                     <div>
                       <strong style={{display: 'block', fontSize: 10, marginBottom: 2}}>Standard Instructions</strong>
                       {highlightText(item.portioning_note, searchTerm)}
                     </div>
                  </div>

                  <div className="me-result-agent-tip">
                     <span className="material-symbols-outlined" style={{fontSize: 16, color: '#d32f2f'}}>support_agent</span>
                     <div>
                       <strong style={{display: 'block', fontSize: 10, marginBottom: 2}}>Agent Handling Tip</strong>
                       {highlightText(item.agent_tip, searchTerm)}
                     </div>
                  </div>

                </div>
              );
            })
          )}
        </div>
      )}

      {/* Mode 2: Browse View (Shows Tabs and Grid) */}
      {!searchTerm && (
        <>
          {/* Brand Tabs */}
          <div className="me-brand-tabs">
            {ME_BRANDS.map(b => (
              <div 
                key={b.id} 
                className={`me-brand-tab ${activeBrand === b.id ? 'me-brand-tab-active' : ''}`}
                style={activeBrand === b.id ? { '--bc': b.color } : {}}
                onClick={() => { setActiveBrand(b.id); setActiveCategory('All'); }}
              >
                 <span className="me-bt-emoji">{b.emoji}</span>
                 <span className="me-bt-name">{b.name}</span>
                 {b.id !== 'all' && <span className="me-bt-short">{b.shortDesc}</span>}
              </div>
            ))}
          </div>

          {/* Category Chips */}
          {availableCategories.length > 1 && (
            <div className="me-category-nav slide-up" style={{animationDelay: '0.1s'}}>
               {availableCategories.map(cat => (
                 <button 
                  key={cat}
                  className={`me-cat-chip ${activeCategory === cat ? 'me-cat-chip-active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                 >
                   {cat}
                 </button>
               ))}
            </div>
          )}

          {/* Grid View */}
          <div className="me-item-grid slide-up" style={{animationDelay: '0.2s'}}>
             {filteredItems.map(item => {
               const pPrice = mePassPrice(item.mrp);
               const isExpanded = !!expandedItems[item.id];
               return (
                 <div key={item.id} className="card me-item-card" style={{ padding: '0px', overflow: 'hidden' }}>
                    <div className="me-item-img-wrap">
                      {item.image_slug ? (
                        <img 
                           src={meImgUrl(item.image_slug)} 
                           alt={item.name} 
                           className="me-item-img"
                           onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
                        />
                      ) : null}
                      <div className="me-item-img-fallback" style={{ display: item.image_slug ? 'none' : 'flex' }}>
                         {ME_BRANDS.find(b => b.id === item.brand)?.emoji || '🍽️'}
                      </div>
                      <div className={`me-item-veg-dot ${item.veg ? 'me-veg' : 'me-nonveg'}`}></div>
                    </div>

                    <div className="me-item-body">
                       <h3 className="me-item-name">{item.name}</h3>
                       <div className="me-item-cat-tag" style={{ background: 'var(--md-surface-variant)' }}>
                          {item.category}
                       </div>
                       <p className="me-item-desc">{item.desc}</p>

                       <div className="me-item-price-row">
                          <div className="me-price-block">
                             <span className="me-price-label">MRP</span>
                             <span className="me-price-mrp">₹{item.mrp}</span>
                          </div>
                          <span className="material-symbols-outlined me-price-divider">arrow_right_alt</span>
                          <div className="me-price-block">
                             <span className="me-price-label">PASS PRICE</span>
                             <span className="me-price-pass">₹{pPrice}</span>
                             <span className="me-price-save">Save ₹{item.mrp - pPrice}</span>
                          </div>
                       </div>

                       <div className="me-item-expand-btn" onClick={() => toggleExpand(item.id)}>
                          <span className="material-symbols-outlined me-expand-icon" style={{ transform: isExpanded ? 'rotate(180deg)' : 'none' }}>
                            expand_more
                          </span>
                          {isExpanded ? 'Hide Details' : 'Ingredients & Portioning'}
                       </div>

                       {isExpanded && (
                          <div className="me-item-details slide-up" style={{ animationDuration: '0.3s' }}>
                             <div className="me-detail-section">
                                <div className="me-detail-label">Recipe Ingredients</div>
                                <ul className="me-ingredient-list">
                                   {item.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
                                </ul>
                             </div>
                             <div className="me-detail-section">
                                <div className="me-detail-label">Portion Standard</div>
                                <div className="me-portion-text">{item.portion}</div>
                             </div>
                             <div className="me-detail-warning">
                                <strong style={{fontSize: 9, color: '#f57c00', textTransform: 'uppercase', marginBottom: 4, display: 'block'}}>Store Alert</strong>
                                <span className="me-portion-note">{item.portioning_note}</span>
                             </div>
                             <div className="me-detail-agent" style={{marginTop: 8}}>
                                <strong style={{fontSize: 9, color: '#d32f2f', textTransform: 'uppercase', marginBottom: 4, display: 'block'}}>Handling Tip</strong>
                                <span className="me-agent-tip">{item.agent_tip}</span>
                             </div>
                          </div>
                       )}
                    </div>
                 </div>
               );
             })}
          </div>
        </>
      )}
    </div>
  );
}
```

---

### 3. Dedicated Stylesheet (`src/pages/EatClubMenu.css`)

```css
/* ════════════════════════════════════════════════
   MENU EXPLORER MODULE CSS
════════════════════════════════════════════════ */

.me-search-hero { margin-bottom: 24px; }
.me-search-wrap {
  position: relative; display: flex; align-items: center;
  background: var(--md-surface-2); border: 2px solid var(--md-primary);
  border-radius: 28px; overflow: hidden;
  box-shadow: 0 4px 20px rgba(255,87,34,.15); transition: box-shadow .3s;
}
.me-search-wrap:focus-within { box-shadow: 0 6px 28px rgba(255,87,34,.25); }
.me-search-icon { font-size: 22px; color: var(--md-primary); padding: 0 14px; flex-shrink: 0; }
.me-search-wrap input {
  flex: 1; padding: 14px 0; background: transparent; border: none; outline: none;
  color: var(--md-on-surface); font-size: 14px; font-family: var(--font-body);
}
.me-search-clear {
  background: transparent; border: none; cursor: pointer; padding: 0 14px; 
  color: var(--md-on-surface-var); display: flex; align-items: center; transition: color .2s;
}
.me-search-clear:hover { color: var(--md-primary); }
.me-search-stats { font-size: 11px; color: var(--md-on-surface-var); margin-top: 8px; padding: 0 6px; }
mark.me-hl { background: rgba(255,87,34,.2); color: var(--md-on-surface); border-radius: 3px; padding: 0 2px; }

/* Brand Tabs */
.me-brand-tabs { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; margin-bottom: 14px; }
.me-brand-tabs::-webkit-scrollbar { height: 3px; }
.me-brand-tabs::-webkit-scrollbar-thumb { background: var(--md-outline); border-radius: 2px; }
.me-brand-tab {
  flex-shrink: 0; display: flex; flex-direction: column; align-items: center; 
  padding: 10px 16px; border-radius: 14px; cursor: pointer; border: 1px solid var(--md-outline);
  background: var(--md-surface-variant); gap: 2px; transition: all .2s cubic-bezier(.34,1.56,.64,1); min-width: 90px;
}
.me-brand-tab:hover { border-color: var(--bc); transform: translateY(-2px); }
.me-brand-tab-active { background: var(--bc, var(--md-primary)); border-color: var(--bc, var(--md-primary)); color: white; box-shadow: 0 4px 12px rgba(0,0,0,.3); }
.me-bt-emoji { font-size: 22px; } .me-bt-name { font-size: 11px; font-weight: 700; text-align: center; } .me-bt-short { font-size: 9px; opacity: .75; text-align: center; }

/* Category chips */
.me-category-nav { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; margin-bottom: 16px; flex-wrap: wrap; }
.me-cat-chip { padding: 5px 14px; border-radius: 20px; font-size: 11px; font-weight: 600; cursor: pointer; border: 1px solid var(--md-outline); background: var(--md-surface-variant); color: var(--md-on-surface-var); transition: all .2s; flex-shrink: 0; }
.me-cat-chip:hover { border-color: var(--md-primary); color: var(--md-primary); }
.me-cat-chip-active { background: var(--md-primary); color: white; border-color: var(--md-primary); }

/* Item grid */
.me-item-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 14px; }
.me-item-card { padding: 0; overflow: hidden; position: relative; }
.me-item-img-wrap { position: relative; height: 160px; overflow: hidden; background: var(--md-surface-2); }
.me-item-img { width: 100%; height: 100%; object-fit: cover; transition: transform .4s ease; }
.me-item-card:hover .me-item-img { transform: scale(1.04); }
.me-item-img-fallback { width: 100%; height: 100%; align-items: center; justify-content: center; font-size: 56px; background: var(--md-surface-2); }
.me-item-veg-dot { position: absolute; top: 10px; right: 10px; width: 14px; height: 14px; border-radius: 3px; border: 2px solid white; }
.me-veg { background: #4CAF50; } .me-nonveg { background: #F44336; }
.me-item-body { padding: 14px; display: flex; flex-direction: column; flex: 1; }
.me-item-name { font-weight: 800; font-size: 13px; margin-bottom: 5px; }
.me-item-cat-tag { display: inline-block; padding: 2px 8px; border-radius: 6px; font-size: 9px; font-weight: 700; margin-bottom: 6px; width: fit-content; }
.me-item-desc { font-size: 11px; color: var(--md-on-surface-var); line-height: 1.5; margin-bottom: 10px; flex: 1; }

.me-item-price-row { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 10px; background: var(--md-surface-2); margin-bottom: 10px; }
.me-price-block { display: flex; flex-direction: column; }
.me-price-label { font-size: 9px; color: var(--md-on-surface-var); font-weight: 700; letter-spacing: .5px; text-transform: uppercase; }
.me-price-mrp { font-size: 14px; font-weight: 800; text-decoration: line-through; color: var(--md-on-surface-var); }
.me-price-divider { font-size: 16px; color: var(--md-primary); font-weight: 800; flex-shrink: 0; }
.me-price-pass { font-size: 20px; font-weight: 900; color: var(--md-primary); line-height: 1; }
.me-price-save { font-size: 9px; background: rgba(76,175,80,.15); color: #4CAF50; padding: 1px 5px; border-radius: 4px; font-weight: 700; margin-top: 2px; width: fit-content; }

.me-item-expand-btn { display: flex; align-items: center; gap: 6px; cursor: pointer; font-size: 11px; font-weight: 700; color: var(--md-primary); padding: 5px 0; user-select: none; margin-top: auto; }
.me-item-details { margin-top: 10px; }
.me-detail-section { margin-bottom: 10px; }
.me-detail-label { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: .5px; margin-bottom: 5px; color: var(--md-on-surface-var); }
.me-ingredient-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 4px; }
.me-ingredient-list li { display: flex; gap: 6px; font-size: 11px; padding: 4px 8px; background: var(--md-surface-2); border-radius: 6px; }
.me-ingredient-list li::before { content: '•'; color: var(--md-primary); font-weight: 800; }
.me-portion-text { font-size: 11px; font-family: var(--font-mono); padding: 6px 10px; background: var(--md-surface-2); border-radius: 6px; }
.me-detail-warning { background: rgba(255,87,34,.07); padding: 8px; border-radius: 8px; border: 1px solid rgba(255,87,34,.15); }
.me-portion-note, .me-agent-tip { font-size: 11px; line-height: 1.5; }
.me-detail-agent { background: rgba(255,87,34,.06); padding: 8px; border-radius: 8px; border: 1px solid rgba(255,87,34,.12); }

/* Search Results Cards */
.me-results-panel { display: flex; flex-direction: column; gap: 14px; }
.me-result-card { padding: 16px; }
.me-result-header { display: flex; align-items: center; margin-bottom: 6px; }
.me-result-brand-badge { padding: 3px 10px; border-radius: 20px; font-size: 10px; font-weight: 700; display: inline-flex; align-items: center; gap: 4px; }
.me-result-name { font-weight: 800; font-size: 14px; margin-bottom: 3px; }
.me-result-cat { font-size: 10px; color: var(--md-on-surface-var); margin-bottom: 6px; }
.me-result-desc { font-size: 11px; color: var(--md-on-surface-var); line-height: 1.5; margin-bottom: 12px; }
.me-result-price-block { display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-radius: 12px; background: var(--md-surface-2); border: 1px solid rgba(255,87,34,.15); margin-bottom: 14px; }
.me-rp-mrp, .me-rp-pass { display: flex; flex-direction: column; gap: 2px; }
.me-rp-label { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: .5px; color: var(--md-on-surface-var); }
.me-rp-value-mrp { font-size: 18px; font-weight: 800; text-decoration: line-through; color: var(--md-on-surface-var); }
.me-rp-arrow { font-size: 20px; color: var(--md-primary); font-weight: 900; }
.me-rp-value-pass { font-size: 28px; font-weight: 900; color: var(--md-primary); line-height: 1; }
.me-rp-saving { font-size: 10px; background: rgba(76,175,80,.15); color: #4CAF50; padding: 2px 7px; border-radius: 5px; font-weight: 800; width: fit-content; }
.me-result-ing-section { margin-bottom: 10px; }
.me-result-section-label { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: .5px; color: var(--md-on-surface-var); margin-bottom: 6px; }
.me-result-ing-tags { display: flex; flex-wrap: wrap; gap: 5px; }
.me-ing-tag { padding: 3px 8px; border-radius: 20px; font-size: 10px; background: var(--md-surface-2); border: 1px solid var(--md-outline); color: var(--md-on-surface); }
.me-result-portion { display: flex; gap: 6px; align-items: flex-start; font-size: 11px; line-height: 1.5; padding: 7px 10px; border-radius: 7px; margin-bottom: 8px; background: var(--md-surface-2); color: var(--md-on-surface); }
.me-result-pnote { display: flex; gap: 6px; font-size: 10px; line-height: 1.5; padding: 7px 10px; border-radius: 7px; margin-bottom: 8px; background: rgba(255,87,34,.07); border: 1px solid rgba(255,87,34,.12); color: var(--md-on-surface); }
.me-result-agent-tip { display: flex; gap: 6px; font-size: 11px; line-height: 1.6; padding: 8px 10px; border-radius: 8px; margin-bottom: 10px; background: rgba(255,87,34,.05); border: 1px solid rgba(255,87,34,.1); }
.me-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; padding: 48px 16px; text-align: center; color: var(--md-on-surface-var); font-size: 13px; }
```
