export default function MojoHTMLBody() {
  return (
    <>
{/* ── TOP HEADER ── */}
<header id="top-header">
  <div className="header-logo">
    <span>🍕</span>
    <span>MOJO Makeline</span>
    <span className="logo-pill">Portioning Charts</span>
  </div>
  <div style={{'flex': '1'}}></div>
  <div style={{'fontSize': '12px', 'color': 'var(--on-surface-var)'}}>LC + Mojo + Zulu · Updated 23/05</div>
</header>

<div id="layout">

{/* ── SIDEBAR ── */}
<nav id="sidebar">
  <div className="nav-section-label">Sections</div>
  <button className="nav-item active" onClick="showSection('pizzas')">🍕 Pizzas (MOJO/LC/Zulu)</button>
  <button className="nav-item" onClick="showSection('value')">💰 Value Pizzas</button>
  <button className="nav-item" onClick="showSection('garlic')">🍞 Garlic Breadsticks</button>
  <button className="nav-item" onClick="showSection('sandwiches')">🥪 Sandwiches</button>
  <button className="nav-item" onClick="showSection('pastas')">🍝 Pastas</button>
  <button className="nav-item" onClick="showSection('starters')">🔥 NV Starters</button>
  <button className="nav-item" onClick="showSection('toppings')">🧀 Extra Toppings</button>
  <button className="nav-item" onClick="showSection('prp')">🐔 Chicken/Paneer PRP</button>
  <button className="nav-item" onClick="showSection('production')">⚙️ Production Items</button>
  <button className="nav-item" onClick="showSection('search')" style={{'marginTop': '8px', 'border': '1.5px solid var(--mojo-red)'}}>🔍 Power Search</button>
</nav>

{/* ── MAIN CONTENT ── */}
<main id="main-content">


{/* ════════════════════════════════════════════════════════
     SECTION 1: PIZZAS
════════════════════════════════════════════════════════ */}
<section id="sec-pizzas" className="page-section active">
  <div style={{'animation': 'gravityDrop .5s var(--spring)'}}>
    <h1 className="page-title">🍕 Pizza Portioning</h1>
    <p className="page-subtitle">MOJO · LeanCrust · Zulu — All base types, toppings &amp; gram amounts</p>
  </div>

  {/* Base Type Quick Reference */}
  <div style={{'display': 'flex', 'gap': '8px', 'flexWrap': 'wrap', 'marginBottom': '20px'}}>
    <button className="cat-chip active" onClick="showPizzaBrand(this,'mojo')">🍕 MOJO / LeanCrust</button>
    <button className="cat-chip" onClick="showPizzaBrand(this,'zulu')">🎯 Zulu</button>
  </div>

  {/* MOJO BASE REFERENCE CARDS */}
  <div id="pizza-brand-mojo">
    {/* Base Reference */}
    <div className="alert-info" style={{'marginBottom': '16px'}}>
      ℹ️ <strong>LeanCrust Note:</strong> LC aur MOJO ke same pizza hai — portioning mey koi antar nahi hai. LC ke sabhi pizzas me <strong>Thin Crust base</strong> hi jayega. LC ke 4 New Pizzas jo MOJO mey nahi aayenge woh BLUE marked hain.
    </div>
    <div className="alert-warning" style={{'marginBottom': '16px'}}>
      ⚠️ <strong>Butter Chicken &amp; Paneer Makhani:</strong> Inn dono Pizza mein <strong>Orange gravy</strong> jayegi — Same quantity as Pizza Sauce.
    </div>
    <div className="alert-warning" style={{'marginBottom': '20px'}}>
      ⚠️ <strong>Half &amp; Half Pizzas:</strong> All portioning below is for Pan Tossed BIG Pizzas. All Regular pizzas = HALF of Pan Tossed Big amounts.
    </div>

    {/* BASE AMOUNTS TABLE */}
    <h3 style={{'fontSize': '16px', 'fontWeight': '700', 'marginBottom': '12px', 'color': 'var(--ec-orange)'}}>📐 Base Ingredient Amounts by Type</h3>
    <div className="table-wrap card elevation-1" style={{'marginBottom': '24px'}}>
      <table className="portion-table">
        <thead>
          <tr>
            <th className="header-main">Ingredient</th>
            <th>Pan Tossed Big<br/>(10")</th>
            <th>PT Cheese Blast</th>
            <th>PT Chicken CB</th>
            <th>Pan Tossed Reg<br/>(7")</th>
            <th>PT Reg Cheese Blast</th>
            <th>Thin Crust Big<br/>(10")</th>
            <th>TC Cheese Blast</th>
            <th>TC Chicken CB</th>
            <th>Thin Crust Reg<br/>(7")</th>
            <th>TC Reg Cheese Blast</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>🧀 Mozzarella Cheese</td>
            <td className="gram">120g</td>
            <td className="gram">120g</td>
            <td className="gram">120g</td>
            <td className="gram">60g</td>
            <td className="gram">60g</td>
            <td className="gram">120g</td>
            <td className="gram">120g</td>
            <td className="gram">120g</td>
            <td className="gram">60g</td>
            <td className="gram">60g</td>
          </tr>
          <tr>
            <td>🍅 Pizza Sauce</td>
            <td className="gram">100g</td>
            <td className="gram">100g</td>
            <td className="gram">100g</td>
            <td className="gram">50g</td>
            <td className="gram">50g</td>
            <td className="gram">100g</td>
            <td className="gram">100g</td>
            <td className="gram">100g</td>
            <td className="gram">50g</td>
            <td className="gram">50g</td>
          </tr>
          <tr>
            <td>🫓 Tortilla</td>
            <td className="gram">1 Big</td>
            <td className="gram">1 Big</td>
            <td className="gram">—</td>
            <td className="gram">1 Small</td>
            <td className="gram">—</td>
            <td className="gram">1 Big</td>
            <td className="gram">1 Big</td>
            <td className="gram">—</td>
            <td className="gram">1 Small</td>
            <td className="gram">—</td>
          </tr>
          <tr>
            <td>🧀 Filler Cheese (CB only)</td>
            <td className="zero">—</td>
            <td className="gram">120g</td>
            <td className="gram">80g</td>
            <td className="zero">—</td>
            <td className="gram">60g</td>
            <td className="zero">—</td>
            <td className="gram">120g</td>
            <td className="gram">80g</td>
            <td className="zero">—</td>
            <td className="gram">60g</td>
          </tr>
          <tr>
            <td>🐔 Plain Chicken (Chicken CB only)</td>
            <td className="zero">—</td>
            <td className="zero">—</td>
            <td className="gram">100g</td>
            <td className="zero">—</td>
            <td className="zero">—</td>
            <td className="zero">—</td>
            <td className="zero">—</td>
            <td className="gram">100g</td>
            <td className="zero">—</td>
            <td className="zero">—</td>
          </tr>
        </tbody>
      </table>
    </div>

    {/* VEG PIZZA TOPPINGS */}
    <h3 style={{'fontSize': '16px', 'fontWeight': '700', 'marginBottom': '12px', 'color': 'var(--veg-green)'}}>🥦 VEG Pizzas — Topping Amounts (grams, for Big Pizza)</h3>
    <div className="alert-info" style={{'marginBottom': '12px'}}>
      💡 All amounts shown are for <strong>Pan Tossed Big (10")</strong>. For Regular (7"), halve all topping amounts.
    </div>
    <div className="table-wrap card elevation-1" style={{'marginBottom': '24px'}}>
      <table className="portion-table">
        <thead>
          <tr>
            <th className="header-main" style={{'minWidth': '200px'}}>MOJO Name</th>
            <th style={{'fontSize': '9px', 'background': '#1a2e1a', 'minWidth': '70px'}}>Onion</th>
            <th style={{'fontSize': '9px', 'background': '#1a2e1a', 'minWidth': '70px'}}>Capsicum</th>
            <th style={{'fontSize': '9px', 'background': '#1a2e1a', 'minWidth': '70px'}}>Tomato</th>
            <th style={{'fontSize': '9px', 'background': '#1a2e1a', 'minWidth': '70px'}}>Corn</th>
            <th style={{'fontSize': '9px', 'background': '#1a2e1a', 'minWidth': '70px'}}>Mushroom</th>
            <th style={{'fontSize': '9px', 'background': '#1a2e1a', 'minWidth': '70px'}}>Blk Olives</th>
            <th style={{'fontSize': '9px', 'background': '#1a2e1a', 'minWidth': '70px'}}>Jalapeños</th>
            <th style={{'fontSize': '9px', 'background': '#1a2e1a', 'minWidth': '70px'}}>Red Paprika</th>
            <th style={{'fontSize': '9px', 'background': '#1a2e1a', 'minWidth': '70px'}}>PP Paneer</th>
            <th style={{'fontSize': '9px', 'background': '#1a2e1a', 'minWidth': '70px'}}>Tikka Paneer</th>
            <th style={{'fontSize': '9px', 'background': '#1a2e1a', 'minWidth': '70px'}}>Herb Paneer</th>
            <th style={{'fontSize': '9px', 'minWidth': '120px'}}>LC Name</th>
          </tr>
        </thead>
        <tbody>
          <tr className="veg-row"><td>Double Cheese Margherita</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td style={{'fontSize': '11px', 'color': 'var(--on-surface-var)'}}>Old World Margherita</td></tr>
          <tr className="veg-row"><td>Farmer's Market</td><td className="zero">—</td><td className="gram">30</td><td className="gram">40</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td style={{'fontSize': '11px', 'color': 'var(--on-surface-var)'}}>Garden Harvest</td></tr>
          <tr className="veg-row"><td>Farm Vibe</td><td className="zero">—</td><td className="gram">40</td><td className="gram">30</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td style={{'fontSize': '11px', 'color': 'var(--on-surface-var)'}}>—</td></tr>
          <tr className="veg-row"><td>Corn, Cheese &amp; Jalapeños</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="gram">30</td><td className="zero">—</td><td className="zero">—</td><td className="gram">20</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td style={{'fontSize': '11px', 'color': 'var(--on-surface-var)'}}>—</td></tr>
          <tr className="veg-row"><td>Fabulous Three</td><td className="zero">—</td><td className="gram">30</td><td className="gram">40</td><td className="zero">—</td><td className="zero">—</td><td className="gram">15</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td style={{'fontSize': '11px', 'color': 'var(--on-surface-var)'}}>—</td></tr>
          <tr className="veg-row"><td>Zesty Veggie Delight</td><td className="zero">—</td><td className="gram">30</td><td className="gram">40</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="gram">20</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td style={{'fontSize': '11px', 'color': 'var(--on-surface-var)'}}>—</td></tr>
          <tr className="veg-row"><td>Olive Garden</td><td className="zero">—</td><td className="gram">40</td><td className="gram">30</td><td className="zero">—</td><td className="zero">—</td><td className="gram">15</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td style={{'fontSize': '11px', 'color': 'var(--on-surface-var)'}}>—</td></tr>
          <tr className="veg-row"><td>Spicy Mexicano</td><td className="zero">—</td><td className="gram">30</td><td className="gram">30</td><td className="gram">20</td><td className="zero">—</td><td className="zero">—</td><td className="gram">15</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td style={{'fontSize': '11px', 'color': 'var(--on-surface-var)'}}>Fiery Hotshot</td></tr>
          <tr className="veg-row"><td>Magic Mushrooms</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="gram">40</td><td className="gram">30</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="gram">60</td><td style={{'fontSize': '11px', 'color': 'var(--on-surface-var)'}}>Mushroom Affair</td></tr>
          <tr className="veg-row"><td>Indi Tandoori Paneer</td><td className="gram">30</td><td className="gram">30</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="gram">50</td><td className="zero">—</td><td style={{'fontSize': '11px', 'color': 'var(--on-surface-var)'}}>—</td></tr>
          <tr className="veg-row"><td>Paneer Tikka</td><td className="gram">30</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="gram">100</td><td className="zero">—</td><td style={{'fontSize': '11px', 'color': 'var(--on-surface-var)'}}>—</td></tr>
          <tr className="veg-row"><td>Veggie Paradise</td><td className="gram">30</td><td className="gram">40</td><td className="gram">30</td><td className="zero">—</td><td className="zero">—</td><td className="gram">15</td><td className="zero">—</td><td className="gram">15</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td style={{'fontSize': '11px', 'color': 'var(--on-surface-var)'}}>Mother Earth</td></tr>
          <tr className="veg-row"><td>Italian Fiesta</td><td className="zero">—</td><td className="zero">—</td><td className="gram">30</td><td className="zero">—</td><td className="gram">60</td><td className="gram">15</td><td className="zero">—</td><td className="gram">20</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td style={{'fontSize': '11px', 'color': 'var(--on-surface-var)'}}>Italian Feast</td></tr>
          <tr className="veg-row"><td>Peri Peri Paneer</td><td className="zero">—</td><td className="gram">20</td><td className="gram">30</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="gram">15</td><td className="zero">—</td><td className="gram">100</td><td className="zero">—</td><td className="zero">—</td><td style={{'fontSize': '11px', 'color': 'var(--on-surface-var)'}}>Peri Peri Paneer</td></tr>
          <tr className="veg-row" style={{'borderLeft': '3px solid #2196F3'}}><td>**Paneer Makhani <span className="badge-new">LC Only</span></td><td className="gram">30</td><td className="gram">20</td><td className="gram">20</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="gram">100</td><td className="zero">—</td><td style={{'fontSize': '11px', 'color': '#2196F3'}}>LC Exclusive</td></tr>
          <tr className="veg-row"><td>All Veggies Madness</td><td className="gram">30</td><td className="gram">20</td><td className="gram">20</td><td className="gram">15</td><td className="gram">30</td><td className="gram">15</td><td className="gram">20</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td style={{'fontSize': '11px', 'color': 'var(--on-surface-var)'}}>Veggie Houseful</td></tr>
          <tr className="veg-row"><td>Paneer Overload</td><td className="gram">30</td><td className="gram">20</td><td className="gram">20</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="gram">50</td><td className="gram">50</td><td className="zero">—</td><td style={{'fontSize': '11px', 'color': 'var(--on-surface-var)'}}>Paneer Double Smash</td></tr>
          <tr className="veg-row"><td>Crowded House Veg</td><td className="gram">30</td><td className="gram">20</td><td className="gram">15</td><td className="gram">15</td><td className="zero">—</td><td className="gram">15</td><td className="zero">—</td><td className="zero">—</td><td className="gram">50</td><td className="zero">—</td><td className="zero">—</td><td style={{'fontSize': '11px', 'color': 'var(--on-surface-var)'}}>Total Domination</td></tr>
        </tbody>
      </table>
    </div>

    {/* NON-VEG PIZZA TOPPINGS */}
    <h3 style={{'fontSize': '16px', 'fontWeight': '700', 'marginBottom': '12px', 'color': 'var(--nv-red)'}}>🍗 NON-VEG Pizzas — Topping Amounts (grams, for Big Pizza)</h3>
    <div className="table-wrap card elevation-1" style={{'marginBottom': '24px'}}>
      <table className="portion-table">
        <thead>
          <tr>
            <th className="header-main" style={{'minWidth': '200px'}}>MOJO Name</th>
            <th style={{'fontSize': '9px', 'background': '#2e1a1a', 'minWidth': '60px'}}>Onion</th>
            <th style={{'fontSize': '9px', 'background': '#2e1a1a', 'minWidth': '60px'}}>Capsicum</th>
            <th style={{'fontSize': '9px', 'background': '#2e1a1a', 'minWidth': '60px'}}>Tomato</th>
            <th style={{'fontSize': '9px', 'background': '#2e1a1a', 'minWidth': '60px'}}>Corn</th>
            <th style={{'fontSize': '9px', 'background': '#2e1a1a', 'minWidth': '60px'}}>Mushroom</th>
            <th style={{'fontSize': '9px', 'background': '#2e1a1a', 'minWidth': '60px'}}>Blk Olives</th>
            <th style={{'fontSize': '9px', 'background': '#2e1a1a', 'minWidth': '60px'}}>Jalapeños</th>
            <th style={{'fontSize': '9px', 'background': '#2e1a1a', 'minWidth': '60px'}}>PP Chkn</th>
            <th style={{'fontSize': '9px', 'background': '#2e1a1a', 'minWidth': '60px'}}>BBQ Chkn</th>
            <th style={{'fontSize': '9px', 'background': '#2e1a1a', 'minWidth': '60px'}}>Plain Chkn</th>
            <th style={{'fontSize': '9px', 'background': '#2e1a1a', 'minWidth': '60px'}}>Tikka Chkn</th>
            <th style={{'fontSize': '9px', 'background': '#2e1a1a', 'minWidth': '60px'}}>Pepperoni</th>
            <th style={{'fontSize': '9px', 'background': '#2e1a1a', 'minWidth': '60px'}}>Mutton</th>
            <th style={{'fontSize': '9px', 'minWidth': '120px'}}>LC Name</th>
          </tr>
        </thead>
        <tbody>
          <tr className="nv-row"><td>Pepper Chicken Magic</td><td className="gram">40</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="gram">50</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td style={{'fontSize': '11px', 'color': 'var(--on-surface-var)'}}>—</td></tr>
          <tr className="nv-row"><td>Chicken Blaze</td><td className="gram">30</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="gram">50</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td style={{'fontSize': '11px', 'color': 'var(--on-surface-var)'}}>—</td></tr>
          <tr className="nv-row"><td>Chicken Smokey Joe</td><td className="gram">30</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="gram">100</td><td className="zero">—</td><td className="zero">—</td><td style={{'fontSize': '11px', 'color': 'var(--on-surface-var)'}}>—</td></tr>
          <tr className="nv-row"><td>Chicken Corn Delight</td><td className="gram">15</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="gram">100</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td style={{'fontSize': '11px', 'color': 'var(--on-surface-var)'}}>—</td></tr>
          <tr className="nv-row"><td>Fiery Chicken</td><td className="gram">20</td><td className="gram">15</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="gram">100</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td style={{'fontSize': '11px', 'color': 'var(--on-surface-var)'}}>—</td></tr>
          <tr className="nv-row"><td>Peri Peri Chicken</td><td className="gram">20</td><td className="gram">15</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="gram">15</td><td className="gram">100</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td style={{'fontSize': '11px', 'color': 'var(--on-surface-var)'}}>Peri Peri Chicken</td></tr>
          <tr className="nv-row"><td>BBQ Chicken</td><td className="gram">20</td><td className="gram">15</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="gram">20</td><td className="gram">100</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td style={{'fontSize': '11px', 'color': 'var(--on-surface-var)'}}>TexMex Chicken</td></tr>
          <tr className="nv-row"><td>Chicken Mexicano</td><td className="gram">30</td><td className="gram">20</td><td className="gram">20</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="gram">100</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td style={{'fontSize': '11px', 'color': 'var(--on-surface-var)'}}>—</td></tr>
          <tr className="nv-row"><td>Chicken Tikka</td><td className="gram">30</td><td className="gram">20</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="gram">100</td><td className="zero">—</td><td className="zero">—</td><td style={{'fontSize': '11px', 'color': 'var(--on-surface-var)'}}>Indi Chicken Tikka</td></tr>
          <tr className="nv-row"><td>Double Trouble Chicken</td><td className="gram">20</td><td className="gram">15</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="gram">100</td><td className="gram">50</td><td className="zero">—</td><td className="zero">—</td><td style={{'fontSize': '11px', 'color': 'var(--on-surface-var)'}}>Double Down Chicken</td></tr>
          <tr className="nv-row"><td>Fire Me Up Chicken</td><td className="gram">20</td><td className="gram">15</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="gram">50</td><td className="gram">100</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td style={{'fontSize': '11px', 'color': 'var(--on-surface-var)'}}>Fiery Spicy Chicken</td></tr>
          <tr className="nv-row"><td>Chicken Italiana</td><td className="gram">20</td><td className="gram">30</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="gram">100</td><td className="gram">50</td><td className="zero">—</td><td className="zero">—</td><td style={{'fontSize': '11px', 'color': 'var(--on-surface-var)'}}>Chicken Crave</td></tr>
          <tr className="nv-row" style={{'borderLeft': '3px solid #2196F3'}}><td>**Butter Chicken <span className="badge-new">LC Only</span></td><td className="gram">30</td><td className="gram">20</td><td className="gram">20</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="gram">100</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td style={{'fontSize': '11px', 'color': '#2196F3'}}>LC Exclusive</td></tr>
          <tr className="nv-row"><td>Classic Pepperoni</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="gram">24</td><td className="zero">—</td><td style={{'fontSize': '11px', 'color': 'var(--on-surface-var)'}}>OG Pepperoni</td></tr>
          <tr className="nv-row"><td>Mojo's Chicken Special</td><td className="gram">20</td><td className="gram">15</td><td className="gram">30</td><td className="gram">20</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="gram">50</td><td className="gram">50</td><td className="gram">50</td><td className="zero">—</td><td className="zero">—</td><td style={{'fontSize': '11px', 'color': 'var(--on-surface-var)'}}>—</td></tr>
          <tr className="nv-row"><td>Chicken Full Smash</td><td className="gram">30</td><td className="gram">20</td><td className="gram">15</td><td className="gram">15</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="gram">50</td><td className="gram">50</td><td className="gram">50</td><td className="zero">—</td><td className="zero">—</td><td style={{'fontSize': '11px', 'color': 'var(--on-surface-var)'}}>Chicken Domination</td></tr>
          <tr className="nv-row"><td>The Meat Eater</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="gram">50</td><td className="gram">50</td><td className="gram">50</td><td className="gram">50</td><td className="zero">—</td><td className="zero">—</td><td style={{'fontSize': '11px', 'color': 'var(--on-surface-var)'}}>The Carnivore</td></tr>
          <tr className="nv-row"><td>Mad Over Lamb</td><td className="gram">30</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="gram">100</td><td style={{'fontSize': '11px', 'color': 'var(--on-surface-var)'}}>—</td></tr>
        </tbody>
      </table>
    </div>
  </div>

  {/* ZULU BRAND */}
  <div id="pizza-brand-zulu" style={{'display': 'none'}}>
    <h3 style={{'fontSize': '16px', 'fontWeight': '700', 'marginBottom': '12px', 'color': 'var(--veg-green)'}}>🥦 Zulu VEG Pizzas</h3>
    <div className="table-wrap card elevation-1" style={{'marginBottom': '24px'}}>
      <table className="portion-table">
        <thead>
          <tr>
            <th className="header-main" style={{'minWidth': '200px'}}>Zulu Name</th>
            <th style={{'fontSize': '9px'}}>Onion</th>
            <th style={{'fontSize': '9px'}}>Capsicum</th>
            <th style={{'fontSize': '9px'}}>Tomato</th>
            <th style={{'fontSize': '9px'}}>Corn</th>
            <th style={{'fontSize': '9px'}}>Mushroom</th>
            <th style={{'fontSize': '9px'}}>Blk Olives</th>
            <th style={{'fontSize': '9px'}}>Jalapeños</th>
            <th style={{'fontSize': '9px'}}>Red Paprika</th>
            <th style={{'fontSize': '9px'}}>PP Paneer</th>
            <th style={{'fontSize': '9px'}}>Tikka Paneer</th>
          </tr>
        </thead>
        <tbody>
          <tr className="veg-row"><td>OG Margherita</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td></tr>
          <tr className="veg-row"><td>Roasted Onion &amp; Cheese</td><td className="gram">30</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td></tr>
          <tr className="veg-row"><td>Capsicum Carnival</td><td className="zero">—</td><td className="gram">40</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td></tr>
          <tr className="veg-row"><td>Corn &amp; Cheese</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="gram">30</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td></tr>
          <tr className="veg-row"><td>Jalapeno Blaze</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="gram">20</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td></tr>
          <tr className="veg-row"><td>Hothead Pizza</td><td className="gram">30</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="gram">20</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td></tr>
          <tr className="veg-row"><td>Fresh Harvest</td><td className="zero">—</td><td className="gram">40</td><td className="gram">30</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td></tr>
          <tr className="veg-row"><td>Olive Twist</td><td className="gram">30</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="gram">15</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td></tr>
          <tr className="veg-row"><td>Good Earth</td><td className="gram">30</td><td className="gram">40</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="gram">15</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td></tr>
          <tr className="veg-row"><td>Cornfire</td><td className="gram">30</td><td className="gram">30</td><td className="zero">—</td><td className="gram">20</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td></tr>
          <tr className="veg-row"><td>Tikka Paneer</td><td className="gram">30</td><td className="gram">30</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="gram">50</td></tr>
          <tr className="veg-row"><td>Forest Fire</td><td className="gram">30</td><td className="gram">30</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="gram">20</td><td className="gram">15</td><td className="zero">—</td><td className="zero">—</td></tr>
          <tr className="veg-row"><td>Wild Shroom</td><td className="zero">—</td><td className="gram">40</td><td className="gram">30</td><td className="zero">—</td><td className="gram">60</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td></tr>
          <tr className="veg-row"><td>Smoked Makhni Paneer</td><td className="gram">30</td><td className="gram">40</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="gram">50</td></tr>
          <tr className="veg-row"><td>Farmville</td><td className="gram">30</td><td className="gram">30</td><td className="gram">30</td><td className="zero">—</td><td className="zero">—</td><td className="gram">15</td><td className="zero">—</td><td className="gram">20</td><td className="zero">—</td><td className="zero">—</td></tr>
          <tr className="veg-row"><td>Paneer Heatwave</td><td className="gram">40</td><td className="gram">30</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="gram">15</td><td className="zero">—</td><td className="zero">—</td><td className="gram">50</td></tr>
          <tr className="veg-row"><td>The Veggieverse</td><td className="gram">30</td><td className="gram">20</td><td className="gram">20</td><td className="gram">15</td><td className="gram">30</td><td className="gram">15</td><td className="gram">20</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td></tr>
          <tr className="veg-row"><td>Maxed Out</td><td className="gram">30</td><td className="gram">20</td><td className="gram">15</td><td className="gram">15</td><td className="zero">—</td><td className="gram">15</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="gram">50</td></tr>
        </tbody>
      </table>
    </div>

    <h3 style={{'fontSize': '16px', 'fontWeight': '700', 'marginBottom': '12px', 'color': 'var(--nv-red)'}}>🍗 Zulu NON-VEG Pizzas</h3>
    <div className="table-wrap card elevation-1" style={{'marginBottom': '24px'}}>
      <table className="portion-table">
        <thead>
          <tr>
            <th className="header-main" style={{'minWidth': '200px'}}>Zulu Name</th>
            <th style={{'fontSize': '9px'}}>Onion</th>
            <th style={{'fontSize': '9px'}}>Capsicum</th>
            <th style={{'fontSize': '9px'}}>Tomato</th>
            <th style={{'fontSize': '9px'}}>Corn</th>
            <th style={{'fontSize': '9px'}}>Mushroom</th>
            <th style={{'fontSize': '9px'}}>Jalapeños</th>
            <th style={{'fontSize': '9px'}}>PP Chkn</th>
            <th style={{'fontSize': '9px'}}>BBQ Chkn</th>
            <th style={{'fontSize': '9px'}}>Plain Chkn</th>
            <th style={{'fontSize': '9px'}}>Tikka Chkn</th>
            <th style={{'fontSize': '9px'}}>Pepperoni</th>
          </tr>
        </thead>
        <tbody>
          <tr className="nv-row"><td>Herb Rush Chicken</td><td className="gram">40</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="gram">50</td><td className="zero">—</td><td className="zero">—</td></tr>
          <tr className="nv-row"><td>Chicken Trailblazer</td><td className="gram">30</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="gram">50</td><td className="zero">—</td><td className="zero">—</td></tr>
          <tr className="nv-row"><td>Texas Chicken</td><td className="gram">30</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="gram">50</td><td className="zero">—</td><td className="zero">—</td></tr>
          <tr className="nv-row"><td>Tikka Chicken</td><td className="gram">30</td><td className="gram">30</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="gram">50</td><td className="zero">—</td></tr>
          <tr className="nv-row"><td>License to Grill</td><td className="gram">30</td><td className="gram">15</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="gram">50</td><td className="zero">—</td><td className="zero">—</td></tr>
          <tr className="nv-row"><td>Firecracker Chicken</td><td className="gram">40</td><td className="gram">20</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="gram">50</td><td className="zero">—</td><td className="zero">—</td></tr>
          <tr className="nv-row"><td>Cluckin' Hot</td><td className="gram">30</td><td className="gram">40</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="gram">15</td><td className="zero">—</td><td className="zero">—</td><td className="gram">100</td><td className="zero">—</td><td className="zero">—</td></tr>
          <tr className="nv-row"><td>Chicken Riot</td><td className="gram">30</td><td className="gram">20</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="gram">50</td><td className="gram">50</td><td className="zero">—</td><td className="zero">—</td></tr>
          <tr className="nv-row"><td>Cluck Attack</td><td className="gram">30</td><td className="gram">40</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="gram">15</td><td className="zero">—</td><td className="gram">50</td><td className="gram">50</td><td className="zero">—</td><td className="zero">—</td></tr>
          <tr className="nv-row"><td>Fiery Chick-Flick</td><td className="gram">30</td><td className="gram">20</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="gram">15</td><td className="zero">—</td><td className="gram">50</td><td className="gram">50</td><td className="zero">—</td><td className="zero">—</td></tr>
          <tr className="nv-row"><td>Butter Chicken</td><td className="gram">30</td><td className="gram">20</td><td className="gram">20</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="gram">100</td><td className="zero">—</td><td className="zero">—</td></tr>
          <tr className="nv-row"><td>Pepperoni</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="gram">24</td></tr>
          <tr className="nv-row"><td>Meathead</td><td className="gram">20</td><td className="gram">15</td><td className="gram">30</td><td className="gram">20</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="gram">50</td><td className="gram">50</td><td className="gram">50</td><td className="zero">—</td></tr>
          <tr className="nv-row"><td>The Carnivore</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="zero">—</td><td className="gram">50</td><td className="gram">50</td><td className="gram">50</td><td className="gram">50</td><td className="zero">—</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</section>


{/* ════════════════════════════════════════════════════════
     SECTION 2: VALUE PIZZAS
════════════════════════════════════════════════════════ */}
<section id="sec-value" className="page-section">
  <div style={{'animation': 'gravityDrop .5s var(--spring)'}}>
    <h1 className="page-title">💰 Value Pizzas</h1>
    <p className="page-subtitle">Small Pan Tossed Base · All ₹99 range items</p>
  </div>
  <div className="alert-info" style={{'marginBottom': '20px'}}>
    💡 All Value Pizzas use <strong>Small Pan Tossed Base</strong>. Same structure across all variants.
  </div>
  <div className="table-wrap card elevation-1">
    <table className="portion-table">
      <thead>
        <tr>
          <th className="header-main">Pizza Name</th>
          <th>Base</th>
          <th>Pizza Sauce</th>
          <th>Filler Cheese</th>
          <th>Mozzarella Cheese</th>
          <th>Toppings</th>
        </tr>
      </thead>
      <tbody>
        <tr className="veg-row"><td>Spicy Jalapeno Pizza</td><td>Small Pan Tossed</td><td className="gram">40g</td><td className="gram">20g</td><td className="gram">30g</td><td className="gram">Jalapenos 20g</td></tr>
        <tr className="veg-row"><td>Golden Corn Pizza</td><td>Small Pan Tossed</td><td className="gram">40g</td><td className="gram">20g</td><td className="gram">30g</td><td className="gram">Corn 20g</td></tr>
        <tr className="veg-row"><td>Capsicum Pizza</td><td>Small Pan Tossed</td><td className="gram">40g</td><td className="gram">20g</td><td className="gram">30g</td><td className="gram">Capsicum 20g</td></tr>
        <tr className="veg-row"><td>Onion Pizza</td><td>Small Pan Tossed</td><td className="gram">40g</td><td className="gram">20g</td><td className="gram">30g</td><td className="gram">Onion 20g</td></tr>
        <tr className="veg-row"><td>Tomato Pizza</td><td>Small Pan Tossed</td><td className="gram">40g</td><td className="gram">20g</td><td className="gram">30g</td><td className="gram">Tomato 20g</td></tr>
        <tr className="nv-row"><td>Chicken &amp; Onion</td><td>Small Pan Tossed</td><td className="gram">40g</td><td className="gram">20g</td><td className="gram">30g</td><td className="gram">Herb Chicken 20g + Onion 20g</td></tr>
      </tbody>
    </table>
  </div>
</section>


{/* ════════════════════════════════════════════════════════
     SECTION 3: GARLIC BREADSTICKS
════════════════════════════════════════════════════════ */}
<section id="sec-garlic" className="page-section">
  <div style={{'animation': 'gravityDrop .5s var(--spring)'}}>
    <h1 className="page-title">🍞 Garlic Breadsticks</h1>
    <p className="page-subtitle">SGBS/GBS — MOJO &amp; LeanCrust variants with exact portioning</p>
  </div>
  <div className="alert-info" style={{'marginBottom': '20px'}}>
    💡 All breadsticks use <strong>Small Pizza Base (1 pc)</strong>. Garlic Butter applied <em>After Baking</em> for most variants.
  </div>

  {/* VEG GARLIC BREADS */}
  <h3 style={{'fontSize': '15px', 'fontWeight': '700', 'marginBottom': '12px', 'color': 'var(--veg-green)'}}>🥦 VEG Garlic Breadsticks</h3>
  <div className="table-wrap card elevation-1" style={{'marginBottom': '24px'}}>
    <table className="portion-table">
      <thead>
        <tr>
          <th className="header-main">MOJO Name</th>
          <th>LC Name</th>
          <th>Sauce / Topping 1</th>
          <th>Filling / Topping 2</th>
          <th>Topping 3</th>
          <th>Seasoning</th>
          <th>Garlic Butter<br/>(After Baking)</th>
        </tr>
      </thead>
      <tbody>
        <tr className="veg-row">
          <td>Classic Garlic Breadsticks + Cheesy Dip</td>
          <td style={{'fontSize': '11px', 'color': 'var(--on-surface-var)'}}>Garlic Bread and Dip</td>
          <td className="gram">Garlic Butter Before Baking 20g</td>
          <td className="zero">—</td>
          <td className="zero">—</td>
          <td className="zero">—</td>
          <td className="gram">10g</td>
        </tr>
        <tr className="veg-row">
          <td>Cheeselicious Garlic Bread + Cheesy Dip</td>
          <td style={{'fontSize': '11px', 'color': 'var(--on-surface-var)'}}>Cheese Burst Garlic Breadsticks</td>
          <td className="gram">Filler Cheese 30g</td>
          <td className="zero">—</td>
          <td className="zero">—</td>
          <td className="zero">—</td>
          <td className="gram">10g</td>
        </tr>
        <tr className="veg-row">
          <td>Mexican Stuffed Garlic Bread + Cheesy Dip</td>
          <td style={{'fontSize': '11px', 'color': 'var(--on-surface-var)'}}>Tex-Mex Stuffed Garlic Breadsticks</td>
          <td className="gram">Filler Cheese 30g</td>
          <td className="gram">Corn 10g</td>
          <td className="gram">Jalapeños 20g</td>
          <td className="gram">Veg Sprinkler 2g</td>
          <td className="gram">10g</td>
        </tr>
        <tr className="veg-row">
          <td>Italian Stuffed Garlic Bread + Cheesy Dip</td>
          <td style={{'fontSize': '11px', 'color': 'var(--on-surface-var)'}}>Italian Stuffed Garlic Breadsticks</td>
          <td className="gram">Filler Cheese 30g</td>
          <td className="gram">Mushrooms 20g</td>
          <td className="gram">Olives 10g</td>
          <td className="gram">Veg Sprinkler 2g</td>
          <td className="gram">10g</td>
        </tr>
        <tr className="veg-row">
          <td>Paneer Tikka Stuffed Garlic Bread + Cheesy Dip</td>
          <td style={{'fontSize': '11px', 'color': 'var(--on-surface-var)'}}>Paneer Stuffed Garlic Breadsticks</td>
          <td className="gram">Filler Cheese 30g</td>
          <td className="gram">Tikka Paneer 30g</td>
          <td className="gram">Onions 10g</td>
          <td className="zero">—</td>
          <td className="gram">10g</td>
        </tr>
        <tr className="veg-row">
          <td>Paneer Peri Peri Stuffed Garlic Bread + Cheesy Dip</td>
          <td style={{'fontSize': '11px', 'color': 'var(--on-surface-var)'}}>—</td>
          <td className="gram">Mayo Sauce 30g</td>
          <td className="gram">Peri Peri Paneer 30g</td>
          <td className="gram">Capsicum 10g</td>
          <td className="zero">—</td>
          <td className="gram">10g</td>
        </tr>
      </tbody>
    </table>
  </div>

  {/* NON-VEG GARLIC BREADS */}
  <h3 style={{'fontSize': '15px', 'fontWeight': '700', 'marginBottom': '12px', 'color': 'var(--nv-red)'}}>🍗 NON-VEG Garlic Breadsticks</h3>
  <div className="table-wrap card elevation-1" style={{'marginBottom': '24px'}}>
    <table className="portion-table">
      <thead>
        <tr>
          <th className="header-main">MOJO Name</th>
          <th>LC Name</th>
          <th>Sauce / Topping 1</th>
          <th>Filling / Topping 2</th>
          <th>Topping 3</th>
          <th>Garlic Butter<br/>(After Baking)</th>
        </tr>
      </thead>
      <tbody>
        <tr className="nv-row">
          <td>Mexican Chicken Stuffed Garlic Bread + Cheesy Dip</td>
          <td style={{'fontSize': '11px', 'color': 'var(--on-surface-var)'}}>Chicken Herb Stuffed Garlic Breadsticks</td>
          <td className="gram">Filler Cheese 30g</td>
          <td className="gram">Herbed Chicken 30g</td>
          <td className="gram">Jalapeños 10g</td>
          <td className="gram">10g</td>
        </tr>
        <tr className="nv-row">
          <td>Chicken Tikka Stuffed Garlic Bread + Cheesy Dip</td>
          <td style={{'fontSize': '11px', 'color': 'var(--on-surface-var)'}}>—</td>
          <td className="gram">Filler Cheese 30g</td>
          <td className="gram">Tikka Chicken 30g</td>
          <td className="gram">Onions 10g</td>
          <td className="gram">10g</td>
        </tr>
        <tr className="nv-row">
          <td>Chicken Peri Peri Stuffed Garlic Bread + Cheesy Dip</td>
          <td style={{'fontSize': '11px', 'color': 'var(--on-surface-var)'}}>—</td>
          <td className="gram">Mayo Sauce 30g</td>
          <td className="gram">Peri Peri Chicken 30g</td>
          <td className="gram">Capsicum 10g</td>
          <td className="gram">10g</td>
        </tr>
        <tr className="nv-row">
          <td>Pepperoni Stuffed Garlic Bread + Cheesy Dip</td>
          <td style={{'fontSize': '11px', 'color': 'var(--on-surface-var)'}}>100% Pepperoni Stuffed Garlic Breadsticks</td>
          <td className="gram">Filler Cheese 30g</td>
          <td className="gram">Pepperoni 6 pcs</td>
          <td className="zero">—</td>
          <td className="gram">10g</td>
        </tr>
      </tbody>
    </table>
  </div>
</section>


{/* ════════════════════════════════════════════════════════
     SECTION 4: SANDWICHES
════════════════════════════════════════════════════════ */}
<section id="sec-sandwiches" className="page-section">
  <div style={{'animation': 'gravityDrop .5s var(--spring)'}}>
    <h1 className="page-title">🥪 Sandwiches 2025</h1>
    <p className="page-subtitle">Boom · Box8 · WeFit · MOJO — 25 varieties with full portioning</p>
  </div>
  <div className="alert-info" style={{'marginBottom': '12px'}}>
    💡 Common items for ALL sandwiches: <strong>1 Foil</strong> + <strong>1 EatClub Common Box</strong>
  </div>
  <div className="alert-warning" style={{'marginBottom': '20px'}}>
    ⚠️ Sandwich Salad = 50g (standard bottom base for most items)
  </div>

  {/* Category Chips */}
  <div style={{'display': 'flex', 'gap': '8px', 'flexWrap': 'wrap', 'marginBottom': '16px'}}>
    <button className="cat-chip active" onClick="filterSW(this,'all')">All (25)</button>
    <button className="cat-chip" onClick="filterSW(this,'classic')">1 Classic</button>
    <button className="cat-chip" onClick="filterSW(this,'spicy')">2 Spicy</button>
    <button className="cat-chip" onClick="filterSW(this,'cheeseburst')">3 Cheese Burst</button>
    <button className="cat-chip" onClick="filterSW(this,'gourmet')">4 Gourmet</button>
    <button className="cat-chip" onClick="filterSW(this,'overload')">5 2X Overload</button>
  </div>

  <div className="table-wrap card elevation-1">
    <table className="portion-table" id="sw-table">
      <thead>
        <tr>
          <th className="header-main" style={{'minWidth': '40px'}}>#</th>
          <th style={{'minWidth': '80px'}}>Filling</th>
          <th style={{'minWidth': '80px'}}>Category</th>
          <th style={{'minWidth': '120px'}}>Boom Name</th>
          <th style={{'minWidth': '120px'}}>Box8 Name</th>
          <th style={{'minWidth': '120px'}}>WeFit Name</th>
          <th style={{'minWidth': '120px'}}>MOJO Name</th>
          <th>Topping (Top)</th>
          <th>Sauce (Top)</th>
          <th>Salad (Bottom)</th>
          <th>Sauce (Bottom)</th>
        </tr>
      </thead>
      <tbody id="sw-tbody">
        {/* JS generated */}
      </tbody>
    </table>
  </div>
</section>


{/* ════════════════════════════════════════════════════════
     SECTION 5: PASTAS
════════════════════════════════════════════════════════ */}
<section id="sec-pastas" className="page-section">
  <div style={{'animation': 'gravityDrop .5s var(--spring)'}}>
    <h1 className="page-title">🍝 Pastas</h1>
    <p className="page-subtitle">All sauce types — White · Red · Pink · Orange Gravy · Pesto</p>
  </div>
  <div className="grid-4" style={{'marginBottom': '20px'}}>
    <div className="info-card card"><div className="info-value">140g</div><div className="info-label">🍝 Pasta (all)</div></div>
    <div className="info-card card"><div className="info-value">10g</div><div className="info-label">🧄 Garlic Butter</div></div>
    <div className="info-card card"><div className="info-value">1 pc</div><div className="info-label">📦 EatClub Box</div></div>
    <div className="info-card card"><div className="info-value">2.5g</div><div className="info-label">🧄 Garlic Butter (bread)</div></div>
  </div>
  <div className="alert-info" style={{'marginBottom': '16px'}}>
    💡 Common Items for all pastas: Pasta 140g · Garlic Butter 10g · Sandwich Bread 0.25 pc · Foil Sheet 0.25 pc · EatClub Common Box 1 pc · Veg/NV Sticker 1 pc · Garlic Butter on bread 2.5g
  </div>

  {/* Sauce filter */}
  <div style={{'display': 'flex', 'gap': '8px', 'flexWrap': 'wrap', 'marginBottom': '16px'}}>
    <button className="cat-chip active" onClick="filterPasta(this,'all')">All</button>
    <button className="cat-chip" onClick="filterPasta(this,'white')">🤍 White Sauce</button>
    <button className="cat-chip" onClick="filterPasta(this,'red')">❤️ Red Sauce</button>
    <button className="cat-chip" onClick="filterPasta(this,'pink')">🩷 Pink Sauce</button>
    <button className="cat-chip" onClick="filterPasta(this,'orange')">🧡 Orange Gravy</button>
    <button className="cat-chip" onClick="filterPasta(this,'pesto')">💚 Pesto</button>
  </div>

  <div className="table-wrap card elevation-1">
    <table className="portion-table" id="pasta-table">
      <thead>
        <tr>
          <th className="header-main">Pasta Name</th>
          <th>Sauce Type</th>
          <th>Sauce Amount</th>
          <th>Veg Topping</th>
          <th>Non-Veg Topping</th>
        </tr>
      </thead>
      <tbody id="pasta-tbody">
        {/* JS generated */}
      </tbody>
    </table>
  </div>
</section>


{/* ════════════════════════════════════════════════════════
     SECTION 6: STARTERS
════════════════════════════════════════════════════════ */}
<section id="sec-starters" className="page-section">
  <div style={{'animation': 'gravityDrop .5s var(--spring)'}}>
    <h1 className="page-title">🔥 Non-Veg Starters</h1>
    <p className="page-subtitle">Chicken Wings &amp; Boneless Chicken — Marination amounts</p>
  </div>
  <div className="grid-4" style={{'marginBottom': '20px'}}>
    <div className="info-card card"><div className="info-value">20g</div><div className="info-label">🫙 Green Chutney (common)</div></div>
    <div className="info-card card"><div className="info-value">20g</div><div className="info-label">🥛 Mayo Sauce (common)</div></div>
  </div>

  <div className="table-wrap card elevation-1">
    <table className="portion-table">
      <thead>
        <tr>
          <th className="header-main">Item</th>
          <th>Qty</th>
          <th>🫙 Tikka Marination</th>
          <th>🌶️ Peri Peri Marination</th>
          <th>🌿 Herb Marination</th>
          <th>🍖 BBQ Marination</th>
        </tr>
      </thead>
      <tbody>
        <tr className="nv-row">
          <td>🍗 Chicken Wings</td>
          <td className="gram">6 pcs</td>
          <td className="gram">40g</td>
          <td className="gram">40g</td>
          <td className="gram">40g</td>
          <td className="gram">40g</td>
        </tr>
        <tr className="nv-row">
          <td>🍗 Boneless Chicken (Raw)</td>
          <td className="gram">1 packet (200g)</td>
          <td className="gram">40g</td>
          <td className="gram">40g</td>
          <td className="gram">40g</td>
          <td className="gram">40g</td>
        </tr>
      </tbody>
    </table>
  </div>
</section>


{/* ════════════════════════════════════════════════════════
     SECTION 7: EXTRA TOPPINGS
════════════════════════════════════════════════════════ */}
<section id="sec-toppings" className="page-section">
  <div style={{'animation': 'gravityDrop .5s var(--spring)'}}>
    <h1 className="page-title">🧀 Extra Toppings Add-Ons</h1>
    <p className="page-subtitle">KDS Add-On amounts — Medium (10") &amp; Small (7")</p>
  </div>

  <div style={{'display': 'grid', 'gridTemplateColumns': '1fr 1fr', 'gap': '20px'}}>
    {/* Medium */}
    <div className="card elevation-1" style={{'padding': '20px'}}>
      <h3 style={{'fontSize': '15px', 'fontWeight': '700', 'marginBottom': '14px', 'color': 'var(--ec-orange)'}}>📏 Medium Pizza (10") Extra Toppings</h3>
      <table className="portion-table" style={{'fontSize': '13px'}}>
        <thead><tr><th className="header-main">KDS Name</th><th>Grams</th></tr></thead>
        <tbody>
          <tr className="veg-row"><td>Medium Paneer Tikka</td><td className="gram">40g</td></tr>
          <tr className="veg-row"><td>Medium Mushrooms</td><td className="gram">40g</td></tr>
          <tr className="veg-row"><td>Medium Black Olives</td><td className="gram">20g</td></tr>
          <tr className="veg-row"><td>Medium Spicy Jalapeños</td><td className="gram">20g</td></tr>
          <tr className="veg-row"><td>Medium Red Paprika</td><td className="gram">20g</td></tr>
          <tr className="veg-row"><td>Medium Golden Corn</td><td className="gram">20g</td></tr>
          <tr className="nv-row"><td>Medium BBQ Chicken</td><td className="gram">40g</td></tr>
          <tr className="nv-row"><td>Medium Plain Chicken</td><td className="gram">40g</td></tr>
          <tr className="nv-row"><td>Medium Chicken Tikka</td><td className="gram">40g</td></tr>
          <tr className="nv-row"><td>Medium Spicy Chicken (Peri Peri)</td><td className="gram">40g</td></tr>
        </tbody>
      </table>
    </div>
    {/* Small */}
    <div className="card elevation-1" style={{'padding': '20px'}}>
      <h3 style={{'fontSize': '15px', 'fontWeight': '700', 'marginBottom': '14px', 'color': 'var(--ec-orange)'}}>📐 Small Pizza (7") Extra Toppings</h3>
      <table className="portion-table" style={{'fontSize': '13px'}}>
        <thead><tr><th className="header-main">KDS Name</th><th>Grams</th></tr></thead>
        <tbody>
          <tr className="veg-row"><td>Small Paneer Cubes</td><td className="gram">20g</td></tr>
          <tr className="veg-row"><td>Small Mushrooms</td><td className="gram">20g</td></tr>
          <tr className="veg-row"><td>Small Black Olives</td><td className="gram">10g</td></tr>
          <tr className="veg-row"><td>Small Spicy Jalapeños</td><td className="gram">10g</td></tr>
          <tr className="veg-row"><td>Small Red Paprika</td><td className="gram">10g</td></tr>
          <tr className="veg-row"><td>Small Golden Corn</td><td className="gram">10g</td></tr>
          <tr className="nv-row"><td>Small BBQ Chicken</td><td className="gram">20g</td></tr>
          <tr className="nv-row"><td>Small Plain Chicken</td><td className="gram">20g</td></tr>
          <tr className="nv-row"><td>Small Chicken Tikka</td><td className="gram">20g</td></tr>
          <tr className="nv-row"><td>Small Spicy Chicken (Peri Peri)</td><td className="gram">20g</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</section>


{/* ════════════════════════════════════════════════════════
     SECTION 8: CHICKEN / PANEER PRP
════════════════════════════════════════════════════════ */}
<section id="sec-prp" className="page-section">
  <div style={{'animation': 'gravityDrop .5s var(--spring)'}}>
    <h1 className="page-title">🐔 Chicken / Paneer PRP</h1>
    <p className="page-subtitle">Pre-prep marination ratios — MOJO makeline</p>
  </div>

  <h3 style={{'fontSize': '15px', 'fontWeight': '700', 'marginBottom': '14px', 'color': 'var(--nv-red)'}}>🍗 Chicken PRP (Peri Peri / Herb / BBQ / Tikka)</h3>
  <div className="table-wrap card elevation-1" style={{'marginBottom': '24px'}}>
    <table className="portion-table">
      <thead>
        <tr>
          <th className="header-main">Marination Type</th>
          <th>Plain Chicken 1KG</th>
          <th>Plain Chicken 500g</th>
          <th>Plain Chicken 250g</th>
        </tr>
      </thead>
      <tbody>
        <tr className="nv-row"><td>🌶️ Peri Peri Marination</td><td className="gram">200g</td><td className="gram">100g</td><td className="gram">50g</td></tr>
        <tr className="nv-row"><td>🌿 Herb Marination</td><td className="gram">200g</td><td className="gram">100g</td><td className="gram">50g</td></tr>
        <tr className="nv-row"><td>🍖 BBQ Marination</td><td className="gram">200g</td><td className="gram">100g</td><td className="gram">50g</td></tr>
        <tr className="nv-row"><td>🫙 Tikka Marination</td><td className="gram">200g</td><td className="gram">100g</td><td className="gram">50g</td></tr>
      </tbody>
    </table>
  </div>

  <h3 style={{'fontSize': '15px', 'fontWeight': '700', 'marginBottom': '14px', 'color': 'var(--veg-green)'}}>🧀 Paneer PRP (Peri Peri / Tikka)</h3>
  <div className="table-wrap card elevation-1">
    <table className="portion-table">
      <thead>
        <tr>
          <th className="header-main">Marination Type</th>
          <th>Paneer Cubes 1KG</th>
          <th>Paneer Cubes 500g</th>
          <th>Paneer Cubes 250g</th>
        </tr>
      </thead>
      <tbody>
        <tr className="veg-row"><td>🌶️ Peri Peri Marination</td><td className="gram">200g</td><td className="gram">100g</td><td className="gram">50g</td></tr>
        <tr className="veg-row"><td>🫙 Tikka Marination</td><td className="gram">200g</td><td className="gram">100g</td><td className="gram">50g</td></tr>
      </tbody>
    </table>
  </div>
</section>


{/* ════════════════════════════════════════════════════════
     SECTION 9: PRODUCTION
════════════════════════════════════════════════════════ */}
<section id="sec-production" className="page-section">
  <div style={{'animation': 'gravityDrop .5s var(--spring)'}}>
    <h1 className="page-title">⚙️ Production Items</h1>
    <p className="page-subtitle">Dough · Chocolava · Lemonade · Base sizes</p>
  </div>

  {/* PAN TOSSED DOUGH */}
  <h3 style={{'fontSize': '15px', 'fontWeight': '700', 'marginBottom': '12px', 'color': 'var(--ec-orange)'}}>🫓 Pan Tossed Dough Recipe</h3>
  <div className="table-wrap card elevation-1" style={{'marginBottom': '24px'}}>
    <table className="portion-table">
      <thead>
        <tr>
          <th className="header-main">Ingredient</th>
          <th>2.5 KG Dough (Total = 4.2 KG)</th>
          <th>5 KG Dough (Total = 8.4 KG)</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>💧 Water</td><td className="gram">1400g</td><td className="gram">2800g</td></tr>
        <tr><td>🌻 Sunday Oil (initial + add)</td><td className="gram">100g + 25g</td><td className="gram">200g + 50g</td></tr>
        <tr><td>🧂 DB Normal Yeast</td><td className="gram">1 Packet of DB Normal 2.5</td><td className="gram">2 Packets of DB Normal 2.5</td></tr>
        <tr><td>🌾 Maida</td><td className="gram">2500g</td><td className="gram">5000g</td></tr>
        <tr><td>🧂 Pizza Powder</td><td className="gram">60g</td><td className="gram">120g</td></tr>
        <tr><td>❄️ Fat Flakes</td><td className="gram">100g</td><td className="gram">200g</td></tr>
        <tr style={{'background': 'rgba(255,152,0,0.05)'}}><td colSpan="3" style={{'color': '#FF9800', 'fontSize': '12px'}}>⏱️ DB Normal Mixing: 5 mins — jab tak DB Normal paani ke bubbles banne lage | Mix order: Water + DB Normal + Sunday Oil | Dough Kneading Time: 10 mins</td></tr>
      </tbody>
    </table>
  </div>

  {/* BASE SIZES */}
  <h3 style={{'fontSize': '15px', 'fontWeight': '700', 'marginBottom': '12px', 'color': 'var(--ec-orange)'}}>📐 Base Dough Ball Weights</h3>
  <div className="grid-3" style={{'marginBottom': '24px'}}>
    <div className="card elevation-1" style={{'padding': '20px', 'textAlign': 'center'}}>
      <div style={{'fontSize': '36px', 'marginBottom': '8px'}}>🍕</div>
      <div style={{'fontSize': '22px', 'fontWeight': '800', 'color': 'var(--mojo-red)'}}>270g</div>
      <div style={{'fontSize': '13px', 'fontWeight': '700', 'margin': '4px 0'}}>10 Inch — Big Pizza</div>
      <div style={{'fontSize': '12px', 'color': 'var(--on-surface-var)'}}>Pan Oiling: 3-4g | Base Oiling: 3-4g</div>
    </div>
    <div className="card elevation-1" style={{'padding': '20px', 'textAlign': 'center'}}>
      <div style={{'fontSize': '36px', 'marginBottom': '8px'}}>🍕</div>
      <div style={{'fontSize': '22px', 'fontWeight': '800', 'color': 'var(--ec-orange)'}}>135g</div>
      <div style={{'fontSize': '13px', 'fontWeight': '700', 'margin': '4px 0'}}>7 Inch — Regular Pizza</div>
      <div style={{'fontSize': '12px', 'color': 'var(--on-surface-var)'}}>Pan Oiling: 3-4g | Base Oiling: 3-4g</div>
    </div>
  </div>

  {/* CHOCOLAVA */}
  <h3 style={{'fontSize': '15px', 'fontWeight': '700', 'marginBottom': '12px', 'color': 'var(--ec-orange)'}}>🍫 Chocolava Recipe</h3>
  <div className="table-wrap card elevation-1" style={{'marginBottom': '24px'}}>
    <table className="portion-table">
      <thead>
        <tr>
          <th className="header-main">Ingredient</th>
          <th>20 Pieces</th>
          <th>40 Pieces</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>🍫 Chocolava Cake Premix</td><td className="gram">1 KG</td><td className="gram">1 KG</td></tr>
        <tr><td>🌻 Sunday Oil</td><td className="gram">400g</td><td className="gram">800g</td></tr>
        <tr><td>💧 RO Water</td><td className="gram">400g</td><td className="gram">800g</td></tr>
      </tbody>
    </table>
  </div>

  {/* LEMONADE */}
  <h3 style={{'fontSize': '15px', 'fontWeight': '700', 'marginBottom': '12px', 'color': 'var(--ec-orange)'}}>🍋 Lemonade Recipe</h3>
  <div className="table-wrap card elevation-1">
    <table className="portion-table">
      <thead>
        <tr>
          <th className="header-main">Ingredient</th>
          <th>10 Bottles</th>
          <th>20 Bottles</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>🧪 Premix</td><td className="gram">75g</td><td className="gram">150g</td></tr>
        <tr><td>🍬 Sugar</td><td className="gram">250g</td><td className="gram">500g</td></tr>
        <tr><td>💧 Water</td><td className="gram">3000g (3L)</td><td className="gram">6000g (6L)</td></tr>
      </tbody>
    </table>
  </div>
</section>


{/* ════════════════════════════════════════════════════════
     SECTION 10: POWER SEARCH
════════════════════════════════════════════════════════ */}
<section id="sec-search" className="page-section">
  <div style={{'animation': 'gravityDrop .5s var(--spring)'}}>
    <h1 className="page-title">🔍 Power Search</h1>
    <p className="page-subtitle">Search any item across all sections instantly</p>
  </div>
  <div className="card elevation-2" style={{'padding': '20px', 'marginBottom': '24px'}}>
    <input id="search-input" type="text" placeholder="Search: Paneer Tikka, Cheeselicious, Alfredo, Chicken Wings, Chocolava…" oninput="runSearch(this.value)"/>
    <div id="search-hint" style={{'fontSize': '12px', 'color': 'var(--on-surface-var)', 'marginTop': '8px'}}>
      Type to search across all portioning charts
    </div>
  </div>
  <div id="search-results"></div>
</section>


</main>
</div>
    </>
  );
}

