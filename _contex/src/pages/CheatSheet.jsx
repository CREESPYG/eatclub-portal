const row = (k, v, color = 'var(--md-primary)') => (
  <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid var(--md-outline-var)', gap:12 }}>
    <span style={{ fontSize:14, color:'var(--md-on-surface-var)', flex:1 }}>{k}</span>
    <span style={{ fontSize:14, fontWeight:700, color, fontFamily:'var(--font-mono)', textAlign:'right', flexShrink:0 }}>{v}</span>
  </div>
);

function SectionHead({ children, color = 'var(--md-primary)' }) {
  return <h3 style={{ fontWeight:800, fontSize:16, color, marginBottom:12, marginTop:4 }}>{children}</h3>;
}

export default function CheatSheet() {
  return (
    <div className="page-content" id="page-cheatsheet">

      <div className="page-header" style={{ animation:'gravityDrop .45s ease both' }}>
        <div className="ph-chip">Quick Reference · Print-Ready</div>
        <h1 className="ph-title">Operations <em>Cheat Sheet</em></h1>
        <p className="ph-sub">All KPIs, portioning charts, penalties — at a glance. Makeline-ready operational reference.</p>
      </div>

      {/* ── KPIs ───────────────────────────────────────── */}
      <h2 className="section-title">📊 KPIs</h2>
      <div className="grid-2 mb-24">
        <div className="card" style={{ borderTop:'3px solid var(--md-primary)' }}>
          <SectionHead color="var(--md-primary)">💬 Chat KPIs</SectionHead>
          {[['FRT (First Response Time)','≤ 10 seconds'],['ART (Average Response Time)','≤ 30 seconds'],['AHT (Avg Handling Time)','≤ 20 minutes'],['CSAT','≥ 85%'],['FCR (First Contact Resolution)','≥ 80%'],['Concurrent Chats','Max 4 simultaneous']].map(([k,v])=>row(k,v))}
        </div>
        <div className="card" style={{ borderTop:'3px solid #FF9800' }}>
          <SectionHead color="#FF9800">📞 Call KPIs</SectionHead>
          {[['Rings Before Answer','≤ 3 rings'],['AHT','≤ 4 minutes'],['CSAT','≥ 85%'],['ACW (After Call Work)','≤ 3 minutes'],['First Hold Time','≤ 2 minutes'],['Call Occupancy','≥ 80%']].map(([k,v])=>row(k,v,'#FF9800'))}
        </div>
      </div>

      {/* ── PHONE NUMBERS ──────────────────────────────── */}
      <h2 className="section-title">📱 Bridge Numbers Quick Card</h2>
      <div className="card mb-24">
        <div className="grid-2">
          {[['Own EatClub CX → CC','080-68172526'],['Zomato CX → CC','080-61970384'],['Swiggy CX → CC','020-46201538'],['DM → CC','020-67325678'],['Outlet → CC','011-61191678'],['Dunzo → CC','011-40051349'],['Chatbot CX → CC','020-67325679'],['CC → Outlet','080-61930323']].map(([label,num])=>(
            <div key={num} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 0', borderBottom:'1px solid var(--md-outline-var)' }}>
              <span className="material-symbols-outlined" style={{ fontSize:18, color:'var(--md-primary)' }}>call</span>
              <div>
                <div style={{ fontSize:15, fontWeight:700, fontFamily:'var(--font-mono)', color:'var(--md-primary)' }}>{num}</div>
                <div style={{ fontSize:12, color:'var(--md-on-surface-var)' }}>{label}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop:12, padding:'10px 14px', background:'rgba(var(--md-primary-rgb),0.08)', borderRadius:8, fontSize:13, color:'var(--md-on-surface-var)' }}>
          📱 <strong>Kaleyra Outbound:</strong> Bangalore = 8068249383 · Mumbai/Pune = 2245073565 · Delhi = 1140052747 · Hyderabad = 4068164959
        </div>
      </div>

      {/* ── REFUND AUTHORITY ───────────────────────────── */}
      <h2 className="section-title">💰 Refund Authority Matrix</h2>
      <div className="grid-2 mb-24">
        <div className="card">
          <SectionHead>🔑 Who Can Give What</SectionHead>
          {[['L1 Agent','≤ ₹100 wallet credits'],['L2 Senior Agent','₹100–₹200 credits'],['L3 Manager','≤ ₹500 credits / source'],['Bank Refund','Manager approval required'],['Credits timeline','Within 24 hours'],['Bank timeline','5–7 working days']].map(([k,v])=>row(k,v))}
        </div>
        <div className="card">
          <SectionHead>🚫 COD & Platform Rules</SectionHead>
          {[['COD Orders','Wallet credits ONLY. No bank refund.'],['Swiggy/Zomato Order','Platform handles. CC gives NO refund.'],['Magicpin Order','Platform handles. CC gives NO refund.'],['Account Block Rule','1 paid + 4 ≤₹100 orders all with refunds'],['Fake CX Pattern','Consecutive refunds on last 2 orders']].map(([k,v])=>row(k,v,'#F44336'))}
        </div>
      </div>

      {/* ── PENALTY CODES ──────────────────────────────── */}
      <h2 className="section-title">💸 Penalty Codes & BIG4 Tags</h2>
      <div className="grid-2 mb-24">
        <div className="card">
          <SectionHead color="#F44336">⚠️ Penalty Amounts</SectionHead>
          {[['Maker300','₹300 deducted from Maker'],['Maker1000','₹1,000 deducted from Maker'],['DM250','₹250 deducted from DM'],['Manager200','₹200 deducted from Manager'],['Manager400','₹400 deducted from Manager'],['Manager1000','₹1,000 deducted from Manager']].map(([code,amt])=>(
            <div key={code} style={{ display:'flex', justifyContent:'space-between', padding:'9px 0', borderBottom:'1px solid var(--md-outline-var)' }}>
              <span className="mono" style={{ fontSize:13, color:'var(--md-primary)', fontWeight:700 }}>{code}</span>
              <span style={{ fontSize:13, color:'var(--md-on-surface-var)' }}>{amt}</span>
            </div>
          ))}
        </div>
        <div className="card">
          <SectionHead color="#F44336">🚨 BIG4 Tags (Always Image + 1★ Food + 1★ Exp)</SectionHead>
          {[['VegNonVeg','Maker1000 + Manager1000 · Max ₹500 or Product Source'],['ExternalElement','Maker1000 + Manager1000 · Max ₹500 or Product'],['InsectFound','Maker1000 · Max ₹500 or Product Amount'],['HairFound','Maker300 · Max ₹500 or Product Amount']].map(([tag,pen])=>(
            <div key={tag} style={{ padding:'9px 0', borderBottom:'1px solid var(--md-outline-var)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:2 }}>
                <span style={{ fontSize:14, fontWeight:800, color:'#F44336' }}>{tag}</span>
                <span style={{ fontSize:11, background:'rgba(244,67,54,0.15)', color:'#F44336', padding:'2px 8px', borderRadius:10, fontWeight:700 }}>📷 IMAGE REQUIRED</span>
              </div>
              <span style={{ fontSize:12, color:'var(--md-on-surface-var)' }}>{pen}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── N-1 LOGIC ──────────────────────────────────── */}
      <h2 className="section-title">🔍 N-1 Refund Logic</h2>
      <div className="card mb-24">
        <div className="grid-2">
          <div>
            <SectionHead color="#4CAF50">✅ GIVE Refund When</SectionHead>
            {['Case 1A: N-1 had NO refund/credit (clean slate)','Case 1B: N-1 had refund BUT genuine blunder + good history','First-ever order (N-1 = no history)','Outlet confirmed fault (OOS, closed, wrong product made)'].map((t,i)=>(
              <div key={i} style={{ padding:'8px 12px', background:'rgba(76,175,80,0.08)', borderRadius:8, marginBottom:6, fontSize:14, color:'#4CAF50', borderLeft:'3px solid #4CAF50' }}>✅ {t}</div>
            ))}
          </div>
          <div>
            <SectionHead color="#F44336">❌ DENY Refund When</SectionHead>
            {['N-1 had refund AND current complaint is not a genuine blunder','Case 2B: N-1 clean BUT N-2 had refund','N-1 + N-2 both had refunds (bad pattern)','Last 2+ consecutive orders all had refunds'].map((t,i)=>(
              <div key={i} style={{ padding:'8px 12px', background:'rgba(244,67,54,0.08)', borderRadius:8, marginBottom:6, fontSize:14, color:'#F44336', borderLeft:'3px solid #F44336' }}>❌ {t}</div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MOJO PORTIONING ────────────────────────────── */}
      <h2 className="section-title">🍕 MOJO Makeline — Portioning Charts</h2>
      <div className="card mb-24">
        <SectionHead>🍕 Pizza Base (Big 10" / Regular 7")</SectionHead>
        <div className="portion-table-wrap">
          <table className="portion-table">
            <thead><tr><th>Ingredient</th><th>PT Big</th><th>PT CB (CB=Cheese Blast)</th><th>PT CCB (Chkn CB)</th><th>PT Regular</th><th>PT Reg CB</th><th>Thin Crust Big</th><th>TC CB</th><th>TC CCB</th><th>TC Regular</th><th>TC Reg CB</th></tr></thead>
            <tbody>
              {[['Mozzarella Cheese','120g','120g','120g','60g','60g','120g','120g','120g','60g','60g'],
                ['Pizza Sauce','100g','100g','100g','50g','50g','100g','100g','100g','50g','50g'],
                ['Tortilla (for CB)','—','1 Big','1 Big','—','1 Small','—','1 Big','1 Big','—','1 Small'],
                ['Filler Cheese (CB)','—','120g','80g','—','60g','—','120g','80g','—','60g'],
                ['Plain Chicken (CCB)','—','—','100g','—','—','—','—','100g','—','—'],
              ].map(([name,...vals])=>(
                <tr key={name}><td className="row-header">{name}</td>{vals.map((v,i)=><td key={i} style={{ color: v==='—' ? 'var(--md-on-surface-dim)' : 'var(--md-primary)', fontWeight: v==='—' ? 400 : 700 }}>{v}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop:10, padding:'8px 14px', background:'rgba(255,152,0,0.08)', borderRadius:8, fontSize:13, color:'#FF9800' }}>
          ⚠️ <strong>Butter Chicken & Paneer Makhani</strong> use <strong>Orange Gravy</strong> instead of Pizza Sauce (same 100g/50g quantity) · 
          <strong>Dough ball weights:</strong> 10" = 270g · 7" = 135g
        </div>
      </div>

      <div className="card mb-24">
        <SectionHead>🥦 Veg Pizza Toppings — Pan Tossed Big (grams)</SectionHead>
        <div className="portion-table-wrap">
          <table className="portion-table">
            <thead><tr><th>Pizza Name (MOJO / Lean Crust)</th><th>Onion</th><th>Capsicum</th><th>Tomato</th><th>Corn</th><th>Mushroom</th><th>Olives</th><th>Jalapeños</th><th>Paprika</th><th>Peri Peri Paneer</th><th>Tikka Paneer</th></tr></thead>
            <tbody>
              {[
                ['Double Cheese Margherita / Old World Margherita','—','—','—','—','—','—','—','—','—','—'],
                ["Farmer's Market / Garden Harvest",'—','40','—','30','—','—','—','—','—','—'],
                ['Farm Vibe Pizza','—','—','—','—','—','—','—','—','—','—'],
                ['Corn, Cheese & Jalapeños','—','—','—','30','—','—','20','—','—','—'],
                ['Zesty Veggie / Fabulous Three','30','40','—','—','—','—','20','—','—','—'],
                ['Olive Garden','—','40','30','—','—','15','—','—','—','—'],
                ['Spicy Mexicano / Fiery Hotshot','30','—','30','—','—','—','20','15','—','—'],
                ['Magic Mushrooms / Mushroom Affair','—','40','30','—','60','—','—','—','—','—'],
                ['Indi Tandoori Paneer','30','30','—','—','—','—','—','—','—','50'],
                ['Paneer Tikka','30','—','—','—','—','—','—','—','—','100'],
                ['Veggie Paradise / Mother Earth','30','40','30','—','—','15','—','15','—','—'],
                ['Italian Fiesta / Italian Feast','30','60','—','—','—','15','20','—','—','—'],
                ['Peri Peri Paneer Pizza','20','30','—','—','—','—','15','—','100','—'],
                ['**Paneer Makhni (Orange Gravy)','30','20','20','—','—','—','—','—','—','100'],
                ['All Veggies Madness / Veggie Houseful','30','20','20','15','30','15','20','—','—','—'],
                ['Paneer Overload / Paneer Double Smash','30','20','20','—','—','—','—','—','—','50+50'],
                ['Crowded House Veg / Total Domination','30','20','—','15','—','15','15','—','—','50'],
              ].map(([name,...vals])=>(
                <tr key={name} className="veg-row"><td className="row-header">{name}</td>{vals.map((v,i)=><td key={i} style={{ color: v==='—' ? 'var(--md-on-surface-dim)' : '#4CAF50', fontWeight: v==='—' ? 400 : 700 }}>{v}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card mb-24">
        <SectionHead color="#F44336">🍗 Non-Veg Pizza Toppings — Pan Tossed Big (grams)</SectionHead>
        <div className="portion-table-wrap">
          <table className="portion-table">
            <thead><tr><th>Pizza Name (MOJO / Lean Crust)</th><th>Onion</th><th>Capsicum</th><th>Tomato</th><th>Corn</th><th>Mushroom</th><th>Olives</th><th>Herb Chicken</th><th>Peri-Peri Chkn</th><th>BBQ Chicken</th><th>Tikka Chkn</th><th>Pepperoni</th><th>Mutton</th></tr></thead>
            <tbody>
              {[
                ['Pepper Chicken Magic','40','—','—','—','—','—','—','—','—','—','50','—'],
                ['Chicken Blaze','30','—','—','—','—','—','—','—','—','—','50','—'],
                ['Chicken Smokey Joe','30','—','—','—','—','—','—','—','100','—','—','—'],
                ['Chicken Corn Delight','—','—','—','15','—','—','—','—','—','100','—','—'],
                ['Fiery Chicken','—','20','—','15','—','—','—','—','—','100','—','—'],
                ['Peri Peri Chicken','—','20','—','15','—','15','—','100','—','—','—','—'],
                ['BBQ Chicken / TexMex Chicken','—','20','—','15','—','20','—','—','100','—','—','—'],
                ['Chicken Mexicano','30','20','20','—','—','—','—','—','—','100','—','—'],
                ['Chicken Tikka / Indi Chicken Tikka','30','20','—','—','—','—','—','—','—','100','—','—'],
                ['Double Trouble / Chicken Double Down','—','20','—','15','—','—','—','—','50','100','—','—'],
                ['Fire Me Up / Fiery Spicy Chicken','—','20','—','15','—','—','—','50','—','100','—','—'],
                ['Chicken Italiana / Chicken Crave','—','20','—','—','—','30','—','—','50','100','—','—'],
                ['**Butter Chicken (Orange Gravy)','30','20','20','—','—','—','—','—','—','100','—','—'],
                ['Classic Pepperoni / OG Pepperoni','—','—','—','—','—','—','—','—','—','—','24pc','—'],
                ["MOJO's Chicken Special","—","20","—","15","30","20","50","—","50","50","—","—"],
                ['Chicken Full Smash / Chicken Domination','30','20','—','15','—','15','50','—','50','50','—','—'],
                ['The Meat Eater / The Carnivore','—','—','—','—','—','—','50','—','50','50','—','50'],
                ['Mad Over Lamb','30','—','—','—','—','—','—','—','—','—','—','100'],
              ].map(([name,...vals])=>(
                <tr key={name} className="nv-row"><td className="row-header">{name}</td>{vals.map((v,i)=><td key={i} style={{ color: v==='—' ? 'var(--md-on-surface-dim)' : '#F44336', fontWeight: v==='—' ? 400 : 700 }}>{v}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop:10, fontSize:13, color:'var(--md-on-surface-var)' }}>💡 All H&H pizzas = half the amounts of Pan Tossed Big · Lean Crust = same portioning as MOJO (thin crust base only) · Regular 7" = half topping amounts · Extra topping add-on: Medium (10") = 40g · Small (7") = 20g</div>
      </div>

      <div className="card mb-24">
        <SectionHead>🍞 Value Pizzas (Small Pan Tossed)</SectionHead>
        <div className="portion-table-wrap">
          <table className="portion-table">
            <thead><tr><th>Item</th><th>Pizza Sauce</th><th>Filler Cheese</th><th>Mozzarella</th><th>Toppings</th></tr></thead>
            <tbody>
              {[['Spicy Jalapeño Pizza','40g','20g','30g','Jalapeños 20g'],['Golden Corn Pizza','40g','20g','30g','Corn 20g'],['Capsicum Pizza','40g','20g','30g','Capsicum 20g'],['Onion Pizza','40g','20g','30g','Onion 20g'],['Tomato Pizza','40g','20g','30g','Tomato 20g'],['Chicken & Onion','40g','20g','30g','Herb Chicken 20g + Onion 20g']].map(([n,s,f,m,t])=>(
                <tr key={n}><td className="row-header">{n}</td><td>{s}</td><td>{f}</td><td style={{ color:'var(--md-primary)', fontWeight:700 }}>{m}</td><td style={{ color:'var(--md-on-surface-var)' }}>{t}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card mb-24">
        <SectionHead>🧄 Garlic Breadsticks (MOJO/Lean Crust) — All items use Small Pizza Base</SectionHead>
        <div className="portion-table-wrap">
          <table className="portion-table">
            <thead><tr><th>Item</th><th>Type</th><th>Sauce/Base</th><th>Filling 1</th><th>Filling 2</th><th>Filling 3</th><th>Garlic Butter</th></tr></thead>
            <tbody>
              {[
                ['Classic Garlic Bread + Cheesy Dip','VEG','Garlic Butter (before bake) 20g','—','—','—','10g (after bake)'],
                ['Cheeslicious / Cheese Burst Garlic Bread','VEG','Filler Cheese 30g','—','—','—','10g (after bake)'],
                ['Mexican Stuffed Garlic Bread','VEG','Filler Cheese 30g','Corn 10g','Jalapeños 20g','Veg Sprinkler 2g','10g (after bake)'],
                ['Italian Stuffed Garlic Bread','VEG','Filler Cheese 30g','Mushroom 20g','Olives 10g','Veg Sprinkler 2g','10g (after bake)'],
                ['Paneer Tikka Stuffed Garlic Bread','VEG','Filler Cheese 30g','Tikka Paneer 30g','Onions 10g','—','10g (after bake)'],
                ['Paneer Peri Peri Stuffed Garlic Bread','VEG','Mayo Sauce 30g','Peri Peri Paneer 30g','Capsicum 10g','—','10g (after bake)'],
                ['Mexican Chicken / Chicken Herb Stuffed Garlic Bread','NON-VEG','Filler Cheese 30g','Herbed Chicken 30g','Jalapeños 10g','—','10g (after bake)'],
                ['Chicken Tikka Stuffed Garlic Bread','NON-VEG','Filler Cheese 30g','Tikka Chicken 30g','Onions 10g','—','10g (after bake)'],
                ['Chicken Peri Peri Stuffed Garlic Bread','NON-VEG','Mayo Sauce 30g','Peri Peri Chicken 30g','Capsicum 10g','—','10g (after bake)'],
                ['Pepperoni Stuffed Garlic Bread','NON-VEG','Filler Cheese 30g','Pepperoni 6pcs','—','—','10g (after bake)'],
              ].map(([n,t,...rest])=>(
                <tr key={n} className={t==='VEG' ? 'veg-row' : 'nv-row'}>
                  <td className="row-header">{n}</td>
                  <td><span style={{ background: t==='VEG' ? '#4CAF5030' : '#F4433630', color: t==='VEG' ? '#4CAF50' : '#F44336', padding:'2px 8px', borderRadius:6, fontSize:12, fontWeight:700 }}>{t}</span></td>
                  {rest.map((v,i)=><td key={i} style={{ fontSize:13, color: v==='—' ? 'var(--md-on-surface-dim)' : 'var(--md-on-surface)' }}>{v}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card mb-24">
        <SectionHead>🐔 PRP Marination (MOJO)</SectionHead>
        <div className="grid-2">
          <div>
            <div style={{ marginBottom:8, fontWeight:700, color:'var(--md-on-surface-var)', fontSize:13 }}>🍗 CHICKEN (Peri-Peri / Herb / BBQ / Tikka)</div>
            <div className="portion-table-wrap">
              <table className="portion-table">
                <thead><tr><th>Plain Chicken Qty</th><th>Marination</th></tr></thead>
                <tbody>
                  {[['1 KG','200g each type'],['500g','100g each type'],['250g','50g each type']].map(([q,m])=>(
                    <tr key={q} className="nv-row"><td className="row-header">{q}</td><td style={{ color:'#F44336', fontWeight:700 }}>{m}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <div style={{ marginBottom:8, fontWeight:700, color:'var(--md-on-surface-var)', fontSize:13 }}>🧀 PANEER (Peri-Peri / Tikka)</div>
            <div className="portion-table-wrap">
              <table className="portion-table">
                <thead><tr><th>Paneer Cubes Qty</th><th>Marination</th></tr></thead>
                <tbody>
                  {[['1 KG','200g each type'],['500g','100g each type'],['250g','50g each type']].map(([q,m])=>(
                    <tr key={q} className="veg-row"><td className="row-header">{q}</td><td style={{ color:'#4CAF50', fontWeight:700 }}>{m}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div style={{ marginTop:10, padding:'8px 14px', background:'rgba(var(--md-primary-rgb),0.08)', borderRadius:8, fontSize:13, color:'var(--md-on-surface-var)' }}>
          🔑 <strong>Starters:</strong> Chicken Wings 6pcs = 40g marination · 12pcs = 80g · Boneless Chicken 200g packet = 40g marination + 20g mayo · Non-Veg: green chutney 20g
        </div>
      </div>

      <div className="card mb-24">
        <SectionHead>⚙️ Production Recipes</SectionHead>
        <div className="grid-2">
          <div>
            <div style={{ fontWeight:700, marginBottom:8, color:'var(--md-primary)', fontSize:14 }}>🍕 Pan Tossed Dough</div>
            {[['Maida (Base)','2.5 KG → 4.2 KG total'],['Water','1400g'],['Sunday Oil','100g + 25g'],['DB Normal','1 packet (2.5)'],['Pizza Powder','60g'],['Fat Flakes','100g'],['Kneading Time','10 minutes'],['Dough Ball 10"','270g'],['Dough Ball 7"','135g']].map(([k,v])=>row(k,v))}
          </div>
          <div>
            <div style={{ fontWeight:700, marginBottom:8, color:'#9C27B0', fontSize:14 }}>🍫 Chocolava Cake (20 pcs)</div>
            {[['Chocolava Premix','1 KG'],['Sunday Oil','400g'],['RO Water','400g']].map(([k,v])=>row(k,v,'#9C27B0'))}
            <div style={{ fontWeight:700, marginBottom:8, marginTop:16, color:'#2196F3', fontSize:14 }}>🍋 Lemonade (10 bottles)</div>
            {[['Premix','75g'],['Sugar','250g'],['RO Water','3000g']].map(([k,v])=>row(k,v,'#2196F3'))}
          </div>
        </div>
      </div>

      {/* ── BOX8 PORTIONING QUICK REF ──────────────────── */}
      <h2 className="section-title">📦 BOX8 / Daily Kitchen — Quick Portioning Reference</h2>
      <div className="card mb-24">
        <SectionHead>🍱 Meal Base Choices (All-in-1 / Mini Meal / 2-in-1 Box)</SectionHead>
        <div className="grid-2">
          <div>
            <div style={{ fontWeight:700, marginBottom:8, fontSize:14, color:'var(--md-primary)' }}>🍱 All-in-1 Meal (BOX8)</div>
            {[['Rice Base (Meal/Biryani)','280g'],['Paratha option','1 pack'],['Phulka option','1 pack'],['Rice + Paratha/Phulka','160g rice + 1 pack'],['Side Gravy (Dal/Chole/Rajma)','120g'],['Salad','Desi Salad 40g + Chaat masala + Green Chutney 20g'],['Dessert','Gulab Jamun 8 pcs or Moong Dal Halwa 60g'],['Packing','Big Meal Tray + Box8 Sleeve + Spoon + Envelope']].map(([k,v])=>row(k,v))}
          </div>
          <div>
            <div style={{ fontWeight:700, marginBottom:8, fontSize:14, color:'#FF9800' }}>🥘 Mini Meal (BOX8)</div>
            {[['Rice Base','250g'],['Paratha/Phulka','1 pack'],['Rice + Paratha','160g + 1 pack'],['Salad','Desi Salad 40g + Chaat masala + Green Chutney 20g'],['Packing','Small Meal Tray + Box8 Sleeve + Spoon + Envelope']].map(([k,v])=>row(k,v,'#FF9800'))}
            <div style={{ fontWeight:700, marginBottom:8, marginTop:16, fontSize:14, color:'#2196F3' }}>🥗 Desi Box / NH1 Bowl</div>
            {[['Rice (Meal/Biryani)','250g'],['Salad + Chutney','Desi Salad 40g + Green Chutney 15g + Garlic Yogurt 15g']].map(([k,v])=>row(k,v,'#2196F3'))}
          </div>
        </div>
      </div>

      <div className="card mb-24">
        <SectionHead>🥣 Gravy Quantities by Meal Type</SectionHead>
        <div className="portion-table-wrap">
          <table className="portion-table">
            <thead><tr><th>Dish Type</th><th>All-in-1 Base Gravy</th><th>Mini Meal Base Gravy</th><th>Desi Box / NH1</th><th>Full Curry</th><th>Half Curry</th></tr></thead>
            <tbody>
              {[['Dal/Rajma/Chole (no topping)','180g','220g','260g','520g','260g'],['Gravy Dishes (Aloo, Kofta, etc.)','110g','140g','160g','320g','160g'],['Toppings: Paneer / Chicken / Mutton','70g','70g–100g','100g','160–200g','80–100g'],['Eggs (Egg Curry)','1.5 pcs','1.5 pcs','2 pcs','3 pcs','1.5 pcs'],['Dum Aloo pieces','3 pcs (50–55g)','3 pcs (50–55g)','4 pcs (70–75g)','8 pcs (140–145g)','4 pcs (70–75g)'],['Malai Kofta pieces','3 pcs','3 pcs','4 pcs','8 pcs','4 pcs']].map(([n,...vals])=>(
                <tr key={n}><td className="row-header">{n}</td>{vals.map((v,i)=><td key={i} style={{ fontWeight:700, color:'var(--md-primary)' }}>{v}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop:10, padding:'8px 14px', background:'rgba(var(--md-primary-rgb),0.08)', borderRadius:8, fontSize:13, color:'var(--md-on-surface-var)' }}>
          📦 <strong>Full Curry packing:</strong> Big Curry Container + Eatclub Common Box + Veg/NV Sticker + Spoon + Envelope · <strong>Half Curry:</strong> Small Curry Container + same extras
        </div>
      </div>

      <div className="card mb-24">
        <SectionHead>🍛 Biryani Quick Reference</SectionHead>
        <div className="portion-table-wrap">
          <table className="portion-table">
            <thead><tr><th>Brand / Format</th><th>Dum Rice Total</th><th>Extra</th><th>NV Chicken Gravy</th><th>NV Topping</th><th>Veg Gravy</th><th>Veg Topping</th></tr></thead>
            <tbody>
              {[
                ['Itminaan (1 KG Matka)','440 + 200g = 640g total','Raita 2pcs + Dessert','50g','200g','100g','160g'],
                ['Zaza Mughal Biryani','220 + 100g = 320g total','Raita 1pc','25g','100g','50g','70–80g'],
                ['1881 (Black Bowl)','220 + 100g = 320g total','NO Raita · Black Bowl + Paper Bag','20g','70g','40g','35–70g'],
                ['NH1 Round Bowl','220 + 100g = 320g total','Desi Salad + Yogurt + Green Chutney','20g','70g','40g','35–70g'],
                ['Box8 Biryani Thali','170 + 100g = 270g total','Raita 100g + Onion 40g + Green Chutney','20g','70g','40g','35–70g'],
                ['Zaza Biryani Thali (Mini)','170 + 100g = 270g total','Raita + Samosa 2pcs + Gulab Jamun 8pcs','20g','70g','40g','35–70g'],
              ].map(([n,...vals])=>(
                <tr key={n}><td className="row-header">{n}</td>{vals.map((v,i)=><td key={i} style={{ fontSize:13, color:'var(--md-primary)', fontWeight: i > 0 ? 700 : 400 }}>{v}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── SERVICE & SAAS ─────────────────────────────── */}
      <h2 className="section-title">🖥️ Service Info & SAAS Quick Reference</h2>
      <div className="grid-2 mb-24">
        <div className="card">
          <SectionHead>⏰ Service Hours & Operations</SectionHead>
          {[['Delivery Hours','7 days/week, 11 AM – 3 AM'],['Orders Until','3 AM (no new orders after)'],['SAAS URL','saas.box8.co.in'],['Browser Tabs','8 tabs always open during shift'],['Kaleyra Status','Stay logged in throughout entire shift'],['Swiggy Step 1 (Kaleyra)','Dial 8047225038 from Kaleyra'],['Swiggy Step 2','Dial 9548682405 from personal mobile']].map(([k,v])=>row(k,v))}
        </div>
        <div className="card">
          <SectionHead>🚫 SAAS Key Actions</SectionHead>
          {[['Customer order lookup','Order Intake → Brand → Enter phone number'],['Outlet/DM lookup','Tracker → Select Outlet → Status'],['Wallet refund','Order → Edit → Custom Refund → Wallet'],['Bank refund','Order → Edit → Custom Refund → Bank'],['Feedback rating','Feedback Addition section'],['Failed payment refund','Failed TXN section'],['Cancel form','docs.google.com/forms cancellation form'],['MISS Coupon','Re-send missing item at ₹0']].map(([action,path])=>(
            <div key={action} style={{ padding:'8px 0', borderBottom:'1px solid var(--md-outline-var)' }}>
              <div style={{ fontSize:14, fontWeight:600, color:'var(--md-on-surface)', marginBottom:2 }}>{action}</div>
              <div className="mono" style={{ fontSize:12, color:'var(--md-on-surface-var)' }}>{path}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── RATINGS QUICK REF ──────────────────────────── */}
      <h2 className="section-title">⭐ Ratings Quick Reference (UPDATED RULES)</h2>
      <div className="card mb-24">
        <div style={{ padding:'10px 14px', background:'rgba(244,67,54,0.08)', borderRadius:8, marginBottom:14, fontSize:14, color:'#F44336', borderLeft:'3px solid #F44336', fontWeight:600 }}>
          🔴 UPDATED: Customer gives 2★/3★/4★ → Agent ALWAYS gives 1★. Agents NEVER give 3★ or 4★.
        </div>
        <div className="grid-2">
          <div>
            {[['Customer 5★ + No complaint','5★ Food + 5★ Exp'],['BIG4 Tag (any)','1★ Food + 1★ Exp (always)'],['ExternalElement','1★ Food + 1★ Exp (always)'],['OrderLate in Dispatched','1★ Exp (DM fault)'],['DM_RudeBehavior','1★ Exp'],['DM_WrongProductDelivered','1★ Exp']].map(([s,r])=>(
              <div key={s} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid var(--md-outline-var)', gap:8 }}>
                <span style={{ fontSize:13, color:'var(--md-on-surface-var)', flex:1 }}>{s}</span>
                <span style={{ fontSize:13, fontWeight:700, color:'var(--md-primary)', textAlign:'right' }}>{r}</span>
              </div>
            ))}
          </div>
          <div>
            {[['Blank + High intensity food issue','1★ Food'],['Blank + Low intensity food issue','3★ Food (but agent gives 1★ for customer 2–4★)'],['OrderLate in Placed/Received','1★ Exp (outlet fault)'],['OutletRudeness','1★ Exp'],['StickerMismatch','3★ Exp → but 1★ if customer gave 2–4★'],['No food complaint, experience ok','5★ Food + 5★ Exp']].map(([s,r])=>(
              <div key={s} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid var(--md-outline-var)', gap:8 }}>
                <span style={{ fontSize:13, color:'var(--md-on-surface-var)', flex:1 }}>{s}</span>
                <span style={{ fontSize:13, fontWeight:700, color:'var(--md-primary)', textAlign:'right' }}>{r}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}

