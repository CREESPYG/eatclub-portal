import { useState, useMemo } from 'react';
import DynamicTitle from '../components/DynamicTitle';

// ── DATA ──────────────────────────────────────────────────────────────────────

const BASE_TABLE = [
  { ingredient: '🧀 Mozzarella Cheese', ptBig: '120g', ptCB: '120g', ptChickenCB: '120g', ptReg: '60g', ptRegCB: '60g', tcBig: '120g', tcCB: '120g', tcChickenCB: '120g', tcReg: '60g', tcRegCB: '60g' },
  { ingredient: '🍅 Pizza Sauce',       ptBig: '100g', ptCB: '100g', ptChickenCB: '100g', ptReg: '50g', ptRegCB: '50g', tcBig: '100g', tcCB: '100g', tcChickenCB: '100g', tcReg: '50g', tcRegCB: '50g' },
  { ingredient: '🫓 Tortilla (CB only)',ptBig: '1 Big', ptCB: '1 Big', ptChickenCB: '—', ptReg: '1 Small', ptRegCB: '—', tcBig: '1 Big', tcCB: '1 Big', tcChickenCB: '—', tcReg: '1 Small', tcRegCB: '—' },
  { ingredient: '🧀 Filler Cheese (CB)',ptBig: '—', ptCB: '120g', ptChickenCB: '80g', ptReg: '—', ptRegCB: '60g', tcBig: '—', tcCB: '120g', tcChickenCB: '80g', tcReg: '—', tcRegCB: '60g' },
  { ingredient: '🐔 Plain Chicken (Chicken CB)', ptBig: '—', ptCB: '—', ptChickenCB: '100g', ptReg: '—', ptRegCB: '—', tcBig: '—', tcCB: '—', tcChickenCB: '100g', tcReg: '—', tcRegCB: '—' },
];

const VEG_MOJO = [
  { name: 'Double Cheese Margherita', lcName: 'Old World Margherita', onion:'—', caps:'—', tom:'—', corn:'—', mush:'—', olives:'—', jalap:'—', paprika:'—', ppPaneer:'—', tikkaPaneer:'—', herbPaneer:'—' },
  { name: "Farmer's Market", lcName: 'Garden Harvest', onion:'—', caps:'30', tom:'40', corn:'—', mush:'—', olives:'—', jalap:'—', paprika:'—', ppPaneer:'—', tikkaPaneer:'—', herbPaneer:'—' },
  { name: 'Farm Vibe', lcName: '—', onion:'—', caps:'40', tom:'30', corn:'—', mush:'—', olives:'—', jalap:'—', paprika:'—', ppPaneer:'—', tikkaPaneer:'—', herbPaneer:'—' },
  { name: 'Corn, Cheese & Jalapeños', lcName: '—', onion:'—', caps:'—', tom:'—', corn:'30', mush:'—', olives:'—', jalap:'20', paprika:'—', ppPaneer:'—', tikkaPaneer:'—', herbPaneer:'—' },
  { name: 'Fabulous Three', lcName: '—', onion:'—', caps:'30', tom:'40', corn:'—', mush:'—', olives:'15', jalap:'—', paprika:'—', ppPaneer:'—', tikkaPaneer:'—', herbPaneer:'—' },
  { name: 'Zesty Veggie Delight', lcName: '—', onion:'—', caps:'30', tom:'40', corn:'—', mush:'—', olives:'—', jalap:'20', paprika:'—', ppPaneer:'—', tikkaPaneer:'—', herbPaneer:'—' },
  { name: 'Olive Garden', lcName: '—', onion:'—', caps:'40', tom:'30', corn:'—', mush:'—', olives:'15', jalap:'—', paprika:'—', ppPaneer:'—', tikkaPaneer:'—', herbPaneer:'—' },
  { name: 'Spicy Mexicano', lcName: 'Fiery Hotshot', onion:'—', caps:'30', tom:'30', corn:'20', mush:'—', olives:'—', jalap:'15', paprika:'—', ppPaneer:'—', tikkaPaneer:'—', herbPaneer:'—' },
  { name: 'Magic Mushrooms', lcName: 'Mushroom Affair', onion:'—', caps:'—', tom:'—', corn:'—', mush:'40', olives:'30', jalap:'—', paprika:'—', ppPaneer:'—', tikkaPaneer:'—', herbPaneer:'60' },
  { name: 'Indi Tandoori Paneer', lcName: '—', onion:'30', caps:'30', tom:'—', corn:'—', mush:'—', olives:'—', jalap:'—', paprika:'—', ppPaneer:'—', tikkaPaneer:'50', herbPaneer:'—' },
  { name: 'Paneer Tikka', lcName: '—', onion:'30', caps:'—', tom:'—', corn:'—', mush:'—', olives:'—', jalap:'—', paprika:'—', ppPaneer:'—', tikkaPaneer:'100', herbPaneer:'—' },
  { name: 'Veggie Paradise', lcName: 'Mother Earth', onion:'30', caps:'40', tom:'30', corn:'—', mush:'—', olives:'15', jalap:'—', paprika:'15', ppPaneer:'—', tikkaPaneer:'—', herbPaneer:'—' },
  { name: 'Italian Fiesta', lcName: 'Italian Feast', onion:'—', caps:'—', tom:'30', corn:'—', mush:'60', olives:'15', jalap:'—', paprika:'20', ppPaneer:'—', tikkaPaneer:'—', herbPaneer:'—' },
  { name: 'Peri Peri Paneer', lcName: 'Peri Peri Paneer', onion:'—', caps:'20', tom:'30', corn:'—', mush:'—', olives:'—', jalap:'15', paprika:'—', ppPaneer:'100', tikkaPaneer:'—', herbPaneer:'—' },
  { name: '**Paneer Makhani', lcName: 'LC Exclusive', onion:'30', caps:'20', tom:'20', corn:'—', mush:'—', olives:'—', jalap:'—', paprika:'—', ppPaneer:'—', tikkaPaneer:'100', herbPaneer:'—', lcOnly: true },
  { name: 'All Veggies Madness', lcName: 'Veggie Houseful', onion:'30', caps:'20', tom:'20', corn:'15', mush:'30', olives:'15', jalap:'20', paprika:'—', ppPaneer:'—', tikkaPaneer:'—', herbPaneer:'—' },
  { name: 'Paneer Overload', lcName: 'Paneer Double Smash', onion:'30', caps:'20', tom:'20', corn:'—', mush:'—', olives:'—', jalap:'—', paprika:'—', ppPaneer:'50', tikkaPaneer:'50', herbPaneer:'—' },
  { name: 'Crowded House Veg', lcName: 'Total Domination', onion:'30', caps:'20', tom:'15', corn:'15', mush:'—', olives:'15', jalap:'—', paprika:'—', ppPaneer:'50', tikkaPaneer:'—', herbPaneer:'—' },
];

const NV_MOJO = [
  { name: 'Pepper Chicken Magic', lcName: '—', onion:'40', caps:'—', tom:'—', corn:'—', mush:'—', olives:'—', jalap:'—', ppChkn:'—', bbqChkn:'—', plainChkn:'50', tikkaChkn:'—', pepperoni:'—', mutton:'—' },
  { name: 'Chicken Blaze', lcName: '—', onion:'30', caps:'—', tom:'—', corn:'—', mush:'—', olives:'—', jalap:'—', ppChkn:'—', bbqChkn:'—', plainChkn:'50', tikkaChkn:'—', pepperoni:'—', mutton:'—' },
  { name: 'Chicken Smokey Joe', lcName: '—', onion:'30', caps:'—', tom:'—', corn:'—', mush:'—', olives:'—', jalap:'—', ppChkn:'—', bbqChkn:'—', plainChkn:'—', tikkaChkn:'100', pepperoni:'—', mutton:'—' },
  { name: 'Peri Peri Chicken', lcName: 'Peri Peri Chicken', onion:'20', caps:'15', tom:'—', corn:'—', mush:'—', olives:'—', jalap:'15', ppChkn:'100', bbqChkn:'—', plainChkn:'—', tikkaChkn:'—', pepperoni:'—', mutton:'—' },
  { name: 'BBQ Chicken', lcName: 'TexMex Chicken', onion:'20', caps:'15', tom:'—', corn:'—', mush:'—', olives:'—', jalap:'—', ppChkn:'—', bbqChkn:'20', plainChkn:'100', tikkaChkn:'—', pepperoni:'—', mutton:'—' },
  { name: 'Fiery Chicken', lcName: '—', onion:'20', caps:'15', tom:'—', corn:'—', mush:'—', olives:'—', jalap:'—', ppChkn:'—', bbqChkn:'—', plainChkn:'100', tikkaChkn:'—', pepperoni:'—', mutton:'—' },
  { name: 'Chicken Corn Delight', lcName: '—', onion:'15', caps:'—', tom:'—', corn:'—', mush:'—', olives:'—', jalap:'—', ppChkn:'—', bbqChkn:'—', plainChkn:'100', tikkaChkn:'—', pepperoni:'—', mutton:'—' },
  { name: 'Chicken Tikka', lcName: 'Indi Chicken Tikka', onion:'30', caps:'20', tom:'—', corn:'—', mush:'—', olives:'—', jalap:'—', ppChkn:'—', bbqChkn:'—', plainChkn:'—', tikkaChkn:'100', pepperoni:'—', mutton:'—' },
  { name: 'Chicken Mexicano', lcName: '—', onion:'30', caps:'20', tom:'20', corn:'—', mush:'—', olives:'—', jalap:'—', ppChkn:'—', bbqChkn:'—', plainChkn:'100', tikkaChkn:'—', pepperoni:'—', mutton:'—' },
  { name: 'Double Trouble Chicken', lcName: 'Double Down Chicken', onion:'20', caps:'15', tom:'—', corn:'—', mush:'—', olives:'—', jalap:'—', ppChkn:'—', bbqChkn:'—', plainChkn:'100', tikkaChkn:'50', pepperoni:'—', mutton:'—' },
  { name: 'Fire Me Up Chicken', lcName: 'Fiery Spicy Chicken', onion:'20', caps:'15', tom:'—', corn:'—', mush:'—', olives:'—', jalap:'—', ppChkn:'50', bbqChkn:'—', plainChkn:'100', tikkaChkn:'—', pepperoni:'—', mutton:'—' },
  { name: 'Chicken Italiana', lcName: 'Chicken Crave', onion:'20', caps:'30', tom:'—', corn:'—', mush:'—', olives:'—', jalap:'—', ppChkn:'—', bbqChkn:'—', plainChkn:'100', tikkaChkn:'50', pepperoni:'—', mutton:'—' },
  { name: "Mojo's Chicken Special", lcName: '—', onion:'20', caps:'15', tom:'30', corn:'20', mush:'—', olives:'—', jalap:'—', ppChkn:'—', bbqChkn:'50', plainChkn:'50', tikkaChkn:'50', pepperoni:'—', mutton:'—' },
  { name: 'Chicken Full Smash', lcName: 'Chicken Domination', onion:'30', caps:'20', tom:'15', corn:'15', mush:'—', olives:'—', jalap:'—', ppChkn:'—', bbqChkn:'50', plainChkn:'50', tikkaChkn:'50', pepperoni:'—', mutton:'—' },
  { name: 'The Meat Eater', lcName: 'The Carnivore', onion:'—', caps:'—', tom:'—', corn:'—', mush:'—', olives:'—', jalap:'—', ppChkn:'50', bbqChkn:'50', plainChkn:'50', tikkaChkn:'50', pepperoni:'—', mutton:'—' },
  { name: 'Mad Over Lamb', lcName: '—', onion:'30', caps:'—', tom:'—', corn:'—', mush:'—', olives:'—', jalap:'—', ppChkn:'—', bbqChkn:'—', plainChkn:'—', tikkaChkn:'—', pepperoni:'—', mutton:'100' },
  { name: 'Classic Pepperoni', lcName: 'OG Pepperoni', onion:'—', caps:'—', tom:'—', corn:'—', mush:'—', olives:'—', jalap:'—', ppChkn:'—', bbqChkn:'—', plainChkn:'—', tikkaChkn:'—', pepperoni:'24pcs', mutton:'—' },
  { name: '**Butter Chicken', lcName: 'LC Exclusive', onion:'30', caps:'20', tom:'20', corn:'—', mush:'—', olives:'—', jalap:'—', ppChkn:'—', bbqChkn:'—', plainChkn:'100', tikkaChkn:'—', pepperoni:'—', mutton:'—', lcOnly: true },
];

const GARLIC_VEG = [
  { mojoName: 'Classic Garlic Breadsticks + Cheesy Dip', lcName: 'Garlic Bread and Dip', t1: 'Garlic Butter Before Baking 20g', t2: '—', t3: '—', season: '—', gb: '10g' },
  { mojoName: 'Cheeselicious Garlic Bread + Cheesy Dip', lcName: 'Cheese Burst Garlic Breadsticks', t1: 'Filler Cheese 30g', t2: '—', t3: '—', season: '—', gb: '10g' },
  { mojoName: 'Mexican Stuffed Garlic Bread + Cheesy Dip', lcName: 'Tex-Mex Stuffed Garlic Breadsticks', t1: 'Filler Cheese 30g', t2: 'Corn 10g', t3: 'Jalapeños 20g', season: 'Veg Sprinkler 2g', gb: '10g' },
  { mojoName: 'Italian Stuffed Garlic Bread + Cheesy Dip', lcName: 'Italian Stuffed Garlic Breadsticks', t1: 'Filler Cheese 30g', t2: 'Mushrooms 20g', t3: 'Olives 10g', season: 'Veg Sprinkler 2g', gb: '10g' },
  { mojoName: 'Paneer Tikka Stuffed Garlic Bread + Cheesy Dip', lcName: 'Paneer Stuffed Garlic Breadsticks', t1: 'Filler Cheese 30g', t2: 'Tikka Paneer 30g', t3: 'Onions 10g', season: '—', gb: '10g' },
  { mojoName: 'Paneer Peri Peri Stuffed Garlic Bread + Cheesy Dip', lcName: '—', t1: 'Mayo Sauce 30g', t2: 'Peri Peri Paneer 30g', t3: 'Capsicum 10g', season: '—', gb: '10g' },
];

const GARLIC_NV = [
  { mojoName: 'Mexican Chicken Stuffed Garlic Bread + Cheesy Dip', lcName: 'Chicken Herb Stuffed Garlic Breadsticks', t1: 'Filler Cheese 30g', t2: 'Herbed Chicken 30g', t3: 'Jalapeños 10g', gb: '10g' },
  { mojoName: 'Chicken Tikka Stuffed Garlic Bread + Cheesy Dip', lcName: '—', t1: 'Filler Cheese 30g', t2: 'Tikka Chicken 30g', t3: 'Onions 10g', gb: '10g' },
  { mojoName: 'Chicken Peri Peri Stuffed Garlic Bread + Cheesy Dip', lcName: '—', t1: 'Mayo Sauce 30g', t2: 'Peri Peri Chicken 30g', t3: 'Capsicum 10g', gb: '10g' },
  { mojoName: 'Pepperoni Stuffed Garlic Bread + Cheesy Dip', lcName: '100% Pepperoni Stuffed Garlic Breadsticks', t1: 'Filler Cheese 30g', t2: 'Pepperoni 6 pcs', t3: '—', gb: '10g' },
];

const VALUE_PIZZAS = [
  { name: 'Spicy Jalapeno Pizza', type: 'veg', topping: 'Jalapenos 20g' },
  { name: 'Golden Corn Pizza', type: 'veg', topping: 'Corn 20g' },
  { name: 'Capsicum Pizza', type: 'veg', topping: 'Capsicum 20g' },
  { name: 'Onion Pizza', type: 'veg', topping: 'Onion 20g' },
  { name: 'Tomato Pizza', type: 'veg', topping: 'Tomato 20g' },
  { name: 'Chicken & Onion', type: 'nonveg', topping: 'Herb Chicken 20g + Onion 20g' },
];

const PASTA_DATA = [
  { name: 'Classic Alfredo Pasta', sauce: 'White Sauce', sauceAmt: '300g', veg: '—', nv: '—' },
  { name: 'Red & Yellow Pepper Alfredo Pasta', sauce: 'White Sauce', sauceAmt: '300g', veg: 'Red + Yellow Capsicum 25+25g', nv: '—' },
  { name: 'Olive & Mushroom Alfredo Pasta', sauce: 'White Sauce', sauceAmt: '300g', veg: 'Olive 15g + Mushroom 25g', nv: '—' },
  { name: 'Cheesy Chicken Alfredo Pasta', sauce: 'White Sauce', sauceAmt: '300g', veg: '—', nv: 'Herb Chicken 80g' },
  { name: 'Chicken Bell-Peppers Alfredo Pasta', sauce: 'White Sauce', sauceAmt: '300g', veg: 'Red + Yellow Capsicum 25+25g', nv: 'Herb Chicken 80g' },
  { name: 'Creamy Chicken Mushroom Pasta', sauce: 'White Sauce', sauceAmt: '300g', veg: 'Olive 15g + Mushroom 25g', nv: 'Herb Chicken 80g' },
  { name: 'Original Arrabiata Pasta', sauce: 'Red Sauce', sauceAmt: '300g', veg: '—', nv: '—' },
  { name: 'Colored Peppers Arrabiata Pasta', sauce: 'Red Sauce', sauceAmt: '300g', veg: 'Red + Yellow Capsicum 25+25g', nv: '—' },
  { name: 'Mushroom Olive Arrabiata Pasta', sauce: 'Red Sauce', sauceAmt: '300g', veg: 'Olive 15g + Mushroom 25g', nv: '—' },
  { name: 'Herb Chicken Arrabiata Pasta', sauce: 'Red Sauce', sauceAmt: '300g', veg: '—', nv: 'Herb Chicken 80g' },
  { name: 'Chicken & Peppers Arrabiata Pasta', sauce: 'Red Sauce', sauceAmt: '300g', veg: 'Red + Yellow Capsicum 25+25g', nv: 'Herb Chicken 80g' },
  { name: 'Chicken & Mushroom Arrabiata Pasta', sauce: 'Red Sauce', sauceAmt: '300g', veg: 'Olive 15g + Mushroom 25g', nv: 'Herb Chicken 80g' },
  { name: 'Signature Mixed Pink Pasta', sauce: 'Pink (White + Red)', sauceAmt: '150+150g', veg: '—', nv: '—' },
  { name: 'Bell-Peppers Mixed Pink Pasta', sauce: 'Pink (White + Red)', sauceAmt: '150+150g', veg: 'Red + Yellow Capsicum 25+25g', nv: '—' },
  { name: 'Olive & Shroom Pink Pasta', sauce: 'Pink (White + Red)', sauceAmt: '150+150g', veg: 'Olive 15g + Mushroom 25g', nv: '—' },
  { name: 'Chicken Mixed Pink Pasta', sauce: 'Pink (White + Red)', sauceAmt: '150+150g', veg: '—', nv: 'Herb Chicken 80g' },
  { name: 'Makhni Fusion Indi Pasta', sauce: 'Orange Gravy', sauceAmt: '300g', veg: '—', nv: '—' },
  { name: 'Paneer Makhni Indi Pasta', sauce: 'Orange Gravy', sauceAmt: '300g', veg: 'Tikka Paneer (Mojo) 80g', nv: '—' },
  { name: 'Butter Chicken Indi Pasta', sauce: 'Orange Gravy', sauceAmt: '300g', veg: '—', nv: 'Herb Chicken 80g' },
  { name: 'Classic Pesto Pasta', sauce: 'White + Pesto', sauceAmt: '230+70g', veg: '—', nv: '—' },
  { name: 'Red & Yellow Pepper Pesto Pasta', sauce: 'White + Pesto', sauceAmt: '230+70g', veg: 'Red + Yellow Capsicum 25+25g', nv: '—' },
  { name: 'Olive & Mushroom Pesto Pasta', sauce: 'White + Pesto', sauceAmt: '230+70g', veg: 'Olive 15g + Mushroom 25g', nv: '—' },
  { name: 'Cheesy Chicken Pesto Pasta', sauce: 'White + Pesto', sauceAmt: '230+70g', veg: '—', nv: 'Herb Chicken 80g' },
  { name: 'Pesto Chicken Mushroom Pasta', sauce: 'White + Pesto', sauceAmt: '230+70g', veg: 'Olive 15g + Mushroom 25g', nv: 'Herb Chicken 80g' },
];

const SAUCE_COLORS = {
  'White Sauce': 'rgba(255,255,255,0.12)',
  'Red Sauce': 'rgba(244,67,54,0.15)',
  'Pink (White + Red)': 'rgba(233,30,99,0.15)',
  'Orange Gravy': 'rgba(255,87,34,0.15)',
  'White + Pesto': 'rgba(76,175,80,0.15)',
};

const PRP_DATA = {
  chicken: [
    { type: '🌶️ Peri Peri', k1: '200g', k500: '100g', k250: '50g' },
    { type: '🌿 Herb', k1: '200g', k500: '100g', k250: '50g' },
    { type: '🍖 BBQ', k1: '200g', k500: '100g', k250: '50g' },
    { type: '🫙 Tikka', k1: '200g', k500: '100g', k250: '50g' },
  ],
  paneer: [
    { type: '🌶️ Peri Peri', k1: '200g', k500: '100g', k250: '50g' },
    { type: '🫙 Tikka', k1: '200g', k500: '100g', k250: '50g' },
  ],
};

const TABS = [
  { id: 'base', label: '🍕 Base & Cheese' },
  { id: 'veg', label: '🥦 Veg Toppings' },
  { id: 'nonveg', label: '🍗 Non-Veg Toppings' },
  { id: 'garlic', label: '🍞 Garlic Breadsticks' },
  { id: 'value', label: '💰 Value Pizzas' },
  { id: 'pasta', label: '🍝 Pastas' },
  { id: 'prp', label: '🐔 PRP Marination' },
  { id: 'production', label: '⚙️ Production' },
];

function Cell({ val }) {
  const isGram = val !== '—' && val !== 'LC Exclusive';
  return <td style={{ color: isGram ? 'var(--md-primary)' : 'var(--md-on-surface-var)', fontWeight: isGram ? 600 : 400, fontSize: 12 }}>{val}</td>;
}

export default function MojoPortioning() {
  const [active, setActive] = useState('base');
  const [pastaFilter, setPastaFilter] = useState('All');
  const pastaSauces = useMemo(() => ['All', ...new Set(PASTA_DATA.map(p => p.sauce))], []);
  const filteredPasta = useMemo(() => pastaFilter === 'All' ? PASTA_DATA : PASTA_DATA.filter(p => p.sauce === pastaFilter), [pastaFilter]);

  return (
    <div className="page-content">
      <h1 className="page-title"><DynamicTitle text="🍕 Mojo / Lean Crust Portioning" /></h1>
      <p className="page-subtitle">Complete portioning standards — MOJO · LeanCrust · Zulu · Pizzas · Garlic Breads · Pastas · PRP</p>

      <div className="alert alert-info mb-16">
        <span className="alert-icon">info</span>
        <div><strong>LC Note:</strong> LeanCrust uses <strong>Thin Crust base only</strong>. All portioning amounts are identical to MOJO. LC-exclusive pizzas are highlighted in blue.</div>
      </div>

      <div className="tab-bar mb-24" style={{ flexWrap: 'wrap', gap: 6 }}>
        {TABS.map(t => (
          <button key={t.id} className={`tab-btn ${active === t.id ? 'active' : ''}`} onClick={() => setActive(t.id)}>{t.label}</button>
        ))}
      </div>

      {/* ── BASE & CHEESE ── */}
      {active === 'base' && (
        <div>
          <div className="alert alert-warning mb-16">
            <span className="alert-icon">warning</span>
            <div><strong>Half & Half Pizzas:</strong> ALL amounts below are for <strong>Pan Tossed Big (10")</strong>. Regular (7") = HALF of all topping amounts.</div>
          </div>
          <div className="alert alert-info mb-16">
            <span className="alert-icon">info</span>
            <div><strong>Butter Chicken & Paneer Makhani (LC Only):</strong> Use <strong>Orange Gravy</strong> instead of Pizza Sauce — same quantity.</div>
          </div>
          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: 12 }}>📐 Base Ingredients by Pizza Type</h3>
            <div className="portion-table-wrap">
              <table className="portion-table">
                <thead>
                  <tr>
                    <th>Ingredient</th>
                    <th>PT Big (10")</th>
                    <th>PT Cheese Blast</th>
                    <th>PT Chicken CB</th>
                    <th>PT Reg (7")</th>
                    <th>PT Reg CB</th>
                    <th>TC Big (10")</th>
                    <th>TC Cheese Blast</th>
                    <th>TC Chicken CB</th>
                    <th>TC Reg (7")</th>
                    <th>TC Reg CB</th>
                  </tr>
                </thead>
                <tbody>
                  {BASE_TABLE.map(r => (
                    <tr key={r.ingredient}>
                      <td className="row-header">{r.ingredient}</td>
                      <Cell val={r.ptBig} /><Cell val={r.ptCB} /><Cell val={r.ptChickenCB} />
                      <Cell val={r.ptReg} /><Cell val={r.ptRegCB} />
                      <Cell val={r.tcBig} /><Cell val={r.tcCB} /><Cell val={r.tcChickenCB} />
                      <Cell val={r.tcReg} /><Cell val={r.tcRegCB} />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card mt-16">
            <h3 style={{ fontWeight: 700, marginBottom: 12 }}>📦 Dough Ball Weights</h3>
            <div className="grid-2">
              <div style={{ textAlign: 'center', padding: 16 }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--md-primary)' }}>270g</div>
                <div style={{ fontWeight: 700 }}>10 Inch — Big Pizza</div>
                <div style={{ fontSize: 12, color: 'var(--md-on-surface-var)' }}>Pan Oiling: 3-4g | Base Oiling: 3-4g</div>
              </div>
              <div style={{ textAlign: 'center', padding: 16 }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--md-secondary)' }}>135g</div>
                <div style={{ fontWeight: 700 }}>7 Inch — Regular Pizza</div>
                <div style={{ fontSize: 12, color: 'var(--md-on-surface-var)' }}>Pan Oiling: 3-4g | Base Oiling: 3-4g</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── VEG TOPPINGS ── */}
      {active === 'veg' && (
        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: 8 }}>🥦 Veg Pizza Toppings — Pan Tossed Big (10") amounts in grams</h3>
          <div style={{ fontSize: 12, color: 'var(--md-on-surface-var)', marginBottom: 12 }}>💡 For Regular (7") — <strong>HALVE</strong> all amounts. Thin Crust = same amounts as Pan Tossed.</div>
          <div className="portion-table-wrap">
            <table className="portion-table">
              <thead>
                <tr>
                  <th style={{ minWidth: 180 }}>MOJO Name</th>
                  <th>Onion</th><th>Capsicum</th><th>Tomato</th><th>Corn</th><th>Mushroom</th>
                  <th>Olives</th><th>Jalap.</th><th>Paprika</th><th>PP Paneer</th><th>Tikka Pan.</th><th>Herb Pan.</th>
                  <th>LC Name</th>
                </tr>
              </thead>
              <tbody>
                {VEG_MOJO.map(r => (
                  <tr key={r.name} className="veg-row" style={r.lcOnly ? { borderLeft: '3px solid #2196F3' } : {}}>
                    <td className="row-header">{r.name}</td>
                    <Cell val={r.onion}/><Cell val={r.caps}/><Cell val={r.tom}/><Cell val={r.corn}/>
                    <Cell val={r.mush}/><Cell val={r.olives}/><Cell val={r.jalap}/><Cell val={r.paprika}/>
                    <Cell val={r.ppPaneer}/><Cell val={r.tikkaPaneer}/><Cell val={r.herbPaneer}/>
                    <td style={{ fontSize: 11, color: r.lcOnly ? '#2196F3' : 'var(--md-on-surface-var)', fontWeight: r.lcOnly ? 700 : 400 }}>{r.lcName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── NON-VEG TOPPINGS ── */}
      {active === 'nonveg' && (
        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: 8 }}>🍗 Non-Veg Pizza Toppings — Pan Tossed Big (10") amounts in grams</h3>
          <div style={{ fontSize: 12, color: 'var(--md-on-surface-var)', marginBottom: 12 }}>💡 For Regular (7") — <strong>HALVE</strong> all amounts. Thin Crust = same amounts as Pan Tossed.</div>
          <div className="portion-table-wrap">
            <table className="portion-table">
              <thead>
                <tr>
                  <th style={{ minWidth: 180 }}>MOJO Name</th>
                  <th>Onion</th><th>Caps.</th><th>Tom.</th><th>Corn</th><th>Mush.</th>
                  <th>Olives</th><th>Jalap.</th><th>PP Chkn</th><th>BBQ Chkn</th><th>Plain Chkn</th><th>Tikka Chkn</th><th>Pepperoni</th><th>Mutton</th>
                  <th>LC Name</th>
                </tr>
              </thead>
              <tbody>
                {NV_MOJO.map(r => (
                  <tr key={r.name} className="nv-row" style={r.lcOnly ? { borderLeft: '3px solid #2196F3' } : {}}>
                    <td className="row-header">{r.name}</td>
                    <Cell val={r.onion}/><Cell val={r.caps}/><Cell val={r.tom}/><Cell val={r.corn}/>
                    <Cell val={r.mush}/><Cell val={r.olives}/><Cell val={r.jalap}/>
                    <Cell val={r.ppChkn}/><Cell val={r.bbqChkn}/><Cell val={r.plainChkn}/><Cell val={r.tikkaChkn}/><Cell val={r.pepperoni}/><Cell val={r.mutton}/>
                    <td style={{ fontSize: 11, color: r.lcOnly ? '#2196F3' : 'var(--md-on-surface-var)', fontWeight: r.lcOnly ? 700 : 400 }}>{r.lcName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── GARLIC BREADSTICKS ── */}
      {active === 'garlic' && (
        <div>
          <div className="alert alert-info mb-16">
            <span className="alert-icon">info</span>
            <div>All breadsticks use <strong>Small Pizza Base (1 pc)</strong>. Garlic Butter is applied <em>After Baking</em> for all variants.</div>
          </div>
          <div className="card mb-16">
            <h3 style={{ fontWeight: 700, color: 'var(--veg-green)', marginBottom: 12 }}>🥦 VEG Garlic Breadsticks</h3>
            <div className="portion-table-wrap">
              <table className="portion-table">
                <thead>
                  <tr><th>MOJO Name</th><th>LC Name</th><th>Filling / Sauce 1</th><th>Topping 2</th><th>Topping 3</th><th>Seasoning</th><th>Garlic Butter (After Baking)</th></tr>
                </thead>
                <tbody>
                  {GARLIC_VEG.map(r => (
                    <tr key={r.mojoName} className="veg-row">
                      <td className="row-header">{r.mojoName}</td>
                      <td style={{ fontSize: 11, color: 'var(--md-on-surface-var)' }}>{r.lcName}</td>
                      <td style={{ color: 'var(--md-primary)', fontWeight: 600, fontSize: 12 }}>{r.t1}</td>
                      <Cell val={r.t2}/><Cell val={r.t3}/>
                      <td style={{ fontSize: 12 }}>{r.season}</td>
                      <td style={{ color: 'var(--md-primary)', fontWeight: 600 }}>{r.gb}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="card">
            <h3 style={{ fontWeight: 700, color: 'var(--nv-red)', marginBottom: 12 }}>🍗 NON-VEG Garlic Breadsticks</h3>
            <div className="portion-table-wrap">
              <table className="portion-table">
                <thead>
                  <tr><th>MOJO Name</th><th>LC Name</th><th>Filling / Sauce 1</th><th>Topping 2</th><th>Topping 3</th><th>Garlic Butter (After Baking)</th></tr>
                </thead>
                <tbody>
                  {GARLIC_NV.map(r => (
                    <tr key={r.mojoName} className="nv-row">
                      <td className="row-header">{r.mojoName}</td>
                      <td style={{ fontSize: 11, color: 'var(--md-on-surface-var)' }}>{r.lcName}</td>
                      <td style={{ color: 'var(--md-primary)', fontWeight: 600, fontSize: 12 }}>{r.t1}</td>
                      <Cell val={r.t2}/><Cell val={r.t3}/>
                      <td style={{ color: 'var(--md-primary)', fontWeight: 600 }}>{r.gb}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── VALUE PIZZAS ── */}
      {active === 'value' && (
        <div>
          <div className="alert alert-info mb-16">
            <span className="alert-icon">info</span>
            <div>All Value Pizzas use <strong>Small Pan Tossed Base</strong>. Standard structure: Sauce 40g · Filler Cheese 20g · Mozzarella 30g · Topping 20g.</div>
          </div>
          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: 12 }}>💰 Value Pizza Portioning</h3>
            <div className="portion-table-wrap">
              <table className="portion-table">
                <thead><tr><th>Pizza Name</th><th>Base</th><th>Pizza Sauce</th><th>Filler Cheese</th><th>Mozzarella</th><th>Topping</th></tr></thead>
                <tbody>
                  {VALUE_PIZZAS.map(p => (
                    <tr key={p.name} className={p.type === 'veg' ? 'veg-row' : 'nv-row'}>
                      <td className="row-header">{p.name}</td>
                      <td>Small Pan Tossed</td>
                      <td style={{ color: 'var(--md-primary)', fontWeight: 600 }}>40g</td>
                      <td style={{ color: 'var(--md-primary)', fontWeight: 600 }}>20g</td>
                      <td style={{ color: 'var(--md-primary)', fontWeight: 600 }}>30g</td>
                      <td style={{ color: 'var(--md-primary)', fontWeight: 600 }}>{p.topping}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── PASTA ── */}
      {active === 'pasta' && (
        <div>
          <div className="alert alert-info mb-16">
            <span className="alert-icon">info</span>
            <div><strong>Common for ALL Pastas:</strong> Pasta 140g · Sauce (see table) · Garlic Butter 10g · Sandwich Bread 0.25pc · Foil Sheet 0.25pc · EatClub Common Box · Veg/NV Sticker · Garlic Butter on bread 2.5g</div>
          </div>
          <div className="tab-bar mb-16" style={{ flexWrap: 'wrap', gap: 6 }}>
            {pastaSauces.map(s => (
              <button key={s} className={`tab-btn ${pastaFilter === s ? 'active' : ''}`} onClick={() => setPastaFilter(s)} style={{ fontSize: 12, padding: '6px 12px' }}>{s}</button>
            ))}
          </div>
          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: 12 }}>🍝 Pasta Portioning</h3>
            <div className="portion-table-wrap">
              <table className="portion-table">
                <thead><tr><th>Pasta Name</th><th>Sauce Type</th><th>Sauce Amount</th><th>Veg Topping</th><th>Non-Veg Topping</th></tr></thead>
                <tbody>
                  {filteredPasta.map(p => {
                    const isNV = p.nv !== '—';
                    const isVeg = p.veg !== '—';
                    return (
                      <tr key={p.name} className={isNV && !isVeg ? 'nv-row' : isVeg ? 'veg-row' : ''}>
                        <td className="row-header">{p.name}</td>
                        <td><span style={{ background: SAUCE_COLORS[p.sauce] || 'transparent', padding: '3px 10px', borderRadius: 10, fontSize: 12 }}>{p.sauce}</span></td>
                        <td style={{ color: 'var(--md-primary)', fontWeight: 600 }}>{p.sauceAmt}</td>
                        <td style={{ fontSize: 12, color: 'var(--veg-green)' }}>{p.veg}</td>
                        <td style={{ fontSize: 12, color: 'var(--nv-red)' }}>{p.nv}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── PRP MARINATION ── */}
      {active === 'prp' && (
        <div className="grid-2">
          <div className="card">
            <h3 style={{ fontWeight: 700, color: 'var(--nv-red)', marginBottom: 12 }}>🐔 Chicken PRP — Peri Peri / Herb / BBQ / Tikka</h3>
            <div className="portion-table-wrap">
              <table className="portion-table">
                <thead><tr><th>Marination Type</th><th>1 KG Chicken</th><th>500g</th><th>250g</th></tr></thead>
                <tbody>
                  {PRP_DATA.chicken.map(r => (
                    <tr key={r.type} className="nv-row">
                      <td className="row-header">{r.type}</td>
                      <td style={{ color: 'var(--md-primary)', fontWeight: 600 }}>{r.k1}</td>
                      <td style={{ color: 'var(--md-primary)', fontWeight: 600 }}>{r.k500}</td>
                      <td style={{ color: 'var(--md-primary)', fontWeight: 600 }}>{r.k250}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="alert alert-info mt-12" style={{ padding: '10px 12px', fontSize: 12 }}>
              <span className="alert-icon">info</span>
              <div><strong>Wings Marination:</strong> 6 pcs = 40g | 12 pcs = 80g<br/>
              Box8: Veri Peri / Pepper Garlic / Teekha Meetha / Tandoori Fiery<br/>
              Mojo: Peri Peri / Garlic Herb / Americano BBQ / Smoked Tandoori<br/>
              LC: Peri Peri Baked / Herb Grilled Baked / BBQ Smoked Baked</div>
            </div>
          </div>
          <div className="card">
            <h3 style={{ fontWeight: 700, color: 'var(--veg-green)', marginBottom: 12 }}>🧀 Paneer PRP — Peri Peri / Tikka</h3>
            <div className="portion-table-wrap">
              <table className="portion-table">
                <thead><tr><th>Marination Type</th><th>1 KG Paneer</th><th>500g</th><th>250g</th></tr></thead>
                <tbody>
                  {PRP_DATA.paneer.map(r => (
                    <tr key={r.type} className="veg-row">
                      <td className="row-header">{r.type}</td>
                      <td style={{ color: 'var(--md-primary)', fontWeight: 600 }}>{r.k1}</td>
                      <td style={{ color: 'var(--md-primary)', fontWeight: 600 }}>{r.k500}</td>
                      <td style={{ color: 'var(--md-primary)', fontWeight: 600 }}>{r.k250}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── PRODUCTION ── */}
      {active === 'production' && (
        <div>
          <div className="card mb-16">
            <h3 style={{ fontWeight: 700, marginBottom: 12 }}>🫓 Pan Tossed Dough Recipe</h3>
            <div className="portion-table-wrap">
              <table className="portion-table">
                <thead><tr><th>Ingredient</th><th>2.5 KG Dough</th><th>5 KG Dough</th></tr></thead>
                <tbody>
                  {[
                    ['💧 Water', '1400g', '2800g'],
                    ['🌻 Sunday Oil (initial + add)', '100g + 25g', '200g + 50g'],
                    ['🧂 DB Normal Yeast', '1 Packet DB Normal 2.5', '2 Packets DB Normal 2.5'],
                    ['🌾 Maida', '2500g', '5000g'],
                    ['🧂 Pizza Powder', '60g', '120g'],
                    ['❄️ Fat Flakes', '100g', '200g'],
                  ].map(([ing, a, b]) => (
                    <tr key={ing}><td className="row-header">{ing}</td>
                      <td style={{ color: 'var(--md-primary)', fontWeight: 600 }}>{a}</td>
                      <td style={{ color: 'var(--md-primary)', fontWeight: 600 }}>{b}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ fontSize: 12, color: 'var(--md-on-surface-var)', marginTop: 12 }}>
              ⏱️ DB Normal Mixing: 5 mins · Mix order: Water → DB Normal → Sunday Oil · Kneading: 10 mins
            </div>
          </div>

          <div className="grid-2">
            <div className="card mb-16">
              <h3 style={{ fontWeight: 700, marginBottom: 12 }}>🍫 Chocolava Recipe</h3>
              <div className="portion-table-wrap">
                <table className="portion-table">
                  <thead><tr><th>Ingredient</th><th>20 Pcs</th><th>40 Pcs</th></tr></thead>
                  <tbody>
                    {[['🍫 Chocolava Premix', '1 KG', '1 KG'], ['🌻 Sunday Oil', '400g', '800g'], ['💧 RO Water', '400g', '800g']].map(([i, a, b]) => (
                      <tr key={i}><td className="row-header">{i}</td>
                        <td style={{ color: 'var(--md-primary)', fontWeight: 600 }}>{a}</td>
                        <td style={{ color: 'var(--md-primary)', fontWeight: 600 }}>{b}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="card mb-16">
              <h3 style={{ fontWeight: 700, marginBottom: 12 }}>🍋 Lemonade Recipe</h3>
              <div className="portion-table-wrap">
                <table className="portion-table">
                  <thead><tr><th>Ingredient</th><th>10 Bottles</th><th>20 Bottles</th></tr></thead>
                  <tbody>
                    {[['🧪 Premix', '75g', '150g'], ['🍬 Sugar', '250g', '500g'], ['💧 Water', '3000g (3L)', '6000g (6L)']].map(([i, a, b]) => (
                      <tr key={i}><td className="row-header">{i}</td>
                        <td style={{ color: 'var(--md-primary)', fontWeight: 600 }}>{a}</td>
                        <td style={{ color: 'var(--md-primary)', fontWeight: 600 }}>{b}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: 12 }}>🧀 Extra Toppings Add-On Amounts</h3>
            <div className="grid-2">
              <div>
                <div style={{ fontWeight: 700, marginBottom: 8, color: 'var(--md-primary)' }}>📏 Medium Pizza (10")</div>
                <div className="portion-table-wrap">
                  <table className="portion-table" style={{ fontSize: 13 }}>
                    <thead><tr><th>KDS Name</th><th>Grams</th></tr></thead>
                    <tbody>
                      {[
                        ['Medium Paneer Tikka','40g','veg'],['Medium Mushrooms','40g','veg'],['Medium Black Olives','20g','veg'],
                        ['Medium Spicy Jalapeños','20g','veg'],['Medium Red Paprika','20g','veg'],['Medium Golden Corn','20g','veg'],
                        ['Medium BBQ Chicken','40g','nv'],['Medium Plain Chicken','40g','nv'],['Medium Chicken Tikka','40g','nv'],['Medium Spicy Chicken (PP)','40g','nv'],
                      ].map(([n, g, t]) => (
                        <tr key={n} className={t === 'veg' ? 'veg-row' : 'nv-row'}>
                          <td>{n}</td><td style={{ color: 'var(--md-primary)', fontWeight: 600 }}>{g}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div>
                <div style={{ fontWeight: 700, marginBottom: 8, color: 'var(--md-secondary)' }}>📐 Small Pizza (7")</div>
                <div className="portion-table-wrap">
                  <table className="portion-table" style={{ fontSize: 13 }}>
                    <thead><tr><th>KDS Name</th><th>Grams</th></tr></thead>
                    <tbody>
                      {[
                        ['Small Paneer Cubes','20g','veg'],['Small Mushrooms','20g','veg'],['Small Black Olives','10g','veg'],
                        ['Small Spicy Jalapeños','10g','veg'],['Small Red Paprika','10g','veg'],['Small Golden Corn','10g','veg'],
                        ['Small BBQ Chicken','20g','nv'],['Small Plain Chicken','20g','nv'],['Small Chicken Tikka','20g','nv'],['Small Spicy Chicken (PP)','20g','nv'],
                      ].map(([n, g, t]) => (
                        <tr key={n} className={t === 'veg' ? 'veg-row' : 'nv-row'}>
                          <td>{n}</td><td style={{ color: 'var(--md-primary)', fontWeight: 600 }}>{g}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
