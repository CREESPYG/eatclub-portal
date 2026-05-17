const row = (k, v, color = 'text-primary') => (
  <div key={k} className="flex justify-between py-2.5 border-b border-outline-var gap-3">
    <span className="text-sm text-on-surface-var flex-1">{k}</span>
    <span className={`text-sm font-bold ${color} font-mono text-right flex-shrink-0`}>{v}</span>
  </div>
);

function SectionHead({ children, color = 'text-primary' }) {
  return <h3 className={`font-bold text-base ${color} mb-3 mt-1`}>{children}</h3>;
}

export default function CheatSheet() {
  return (
    <div className="flex-1 p-6 md:p-8 animate-[fadeIn_0.18s_ease]" id="page-cheatsheet">

      <div className="mb-8 animate-[gravityDrop_0.45s_ease_both]">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase mb-3 bg-primary/12 text-primary border border-primary/20">
          Quick Reference · Print-Ready
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-3 tracking-tight">Operations <em className="not-italic text-primary">Cheat Sheet</em></h1>
        <p className="text-sm text-on-surface-var leading-relaxed max-w-xl">All KPIs, portioning charts, penalties — at a glance. Makeline-ready operational reference.</p>
      </div>

      {/* ── KPIs ───────────────────────────────────────── */}
      <h2 className="text-xl font-bold text-on-surface mb-5 flex items-center gap-2.5">📊 KPIs <span className="flex-1 h-px bg-outline" /></h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        <div className="bg-surface-variant rounded-2xl p-5 border border-outline border-t-[3px] border-t-primary animate-[gravityDrop_0.3s_ease_both]">
          <SectionHead color="text-primary">💬 Chat KPIs</SectionHead>
          {[['FRT (First Response Time)','≤ 10 seconds'],['ART (Average Response Time)','≤ 30 seconds'],['AHT (Avg Handling Time)','≤ 20 minutes'],['CSAT','≥ 85%'],['FCR (First Contact Resolution)','≥ 80%'],['Concurrent Chats','Max 4 simultaneous']].map(([k,v])=>row(k,v))}
        </div>
        <div className="bg-surface-variant rounded-2xl p-5 border border-outline border-t-[3px] border-t-warning animate-[gravityDrop_0.3s_ease_both]">
          <SectionHead color="text-warning">📞 Call KPIs</SectionHead>
          {[['Rings Before Answer','≤ 3 rings'],['AHT','≤ 4 minutes'],['CSAT','≥ 85%'],['ACW (After Call Work)','≤ 3 minutes'],['First Hold Time','≤ 2 minutes'],['Call Occupancy','≥ 80%']].map(([k,v])=>row(k,v,'text-warning'))}
        </div>
      </div>

      {/* ── PHONE NUMBERS ──────────────────────────────── */}
      <h2 className="text-xl font-bold text-on-surface mb-5 flex items-center gap-2.5">📱 Bridge Numbers Quick Card <span className="flex-1 h-px bg-outline" /></h2>
      <div className="bg-surface-variant rounded-2xl p-5 border border-outline mb-6 animate-[gravityDrop_0.3s_ease_both]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          {[['Own EatClub CX → CC','080-68172526'],['Zomato CX → CC','080-61970384'],['Swiggy CX → CC','020-46201538'],['DM → CC','020-67325678'],['Outlet → CC','011-61191678'],['Dunzo → CC','011-40051349'],['Chatbot CX → CC','020-67325679'],['CC → Outlet','080-61930323']].map(([label,num])=>(
            <div key={num} className="flex items-center gap-2.5 py-2 border-b border-outline-var">
              <span className="material-symbols-outlined text-primary text-lg">call</span>
              <div>
                <div className="text-base font-bold font-mono text-primary">{num}</div>
                <div className="text-xs text-on-surface-var">{label}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 p-2.5 bg-primary/8 rounded-lg text-sm text-on-surface-var">
          📱 <strong>Kaleyra Outbound:</strong> Bangalore = 8068249383 · Mumbai/Pune = 2245073565 · Delhi = 1140052747 · Hyderabad = 4068164959
        </div>
      </div>

      {/* ── REFUND AUTHORITY ───────────────────────────── */}
      <h2 className="text-xl font-bold text-on-surface mb-5 flex items-center gap-2.5">💰 Refund Authority Matrix <span className="flex-1 h-px bg-outline" /></h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        <div className="bg-surface-variant rounded-2xl p-5 border border-outline animate-[gravityDrop_0.3s_ease_both]">
          <SectionHead>🔑 Who Can Give What</SectionHead>
          {[['L1 Agent','≤ ₹100 wallet credits'],['L2 Senior Agent','₹100–₹200 credits'],['L3 Manager','≤ ₹500 credits / source'],['Bank Refund','Manager approval required'],['Credits timeline','Within 24 hours'],['Bank timeline','5–7 working days']].map(([k,v])=>row(k,v))}
        </div>
        <div className="bg-surface-variant rounded-2xl p-5 border border-outline animate-[gravityDrop_0.3s_ease_both]">
          <SectionHead>🚫 COD & Platform Rules</SectionHead>
          {[['COD Orders','Wallet credits ONLY. No bank refund.'],['Swiggy/Zomato Order','Platform handles. CC gives NO refund.'],['Magicpin Order','Platform handles. CC gives NO refund.'],['Account Block Rule','1 paid + 4 ≤₹100 orders all with refunds'],['Fake CX Pattern','Consecutive refunds on last 2 orders']].map(([k,v])=>row(k,v,'text-error'))}
        </div>
      </div>

      {/* ── PENALTY CODES ──────────────────────────────── */}
      <h2 className="text-xl font-bold text-on-surface mb-5 flex items-center gap-2.5">💸 Penalty Codes & BIG4 Tags <span className="flex-1 h-px bg-outline" /></h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        <div className="bg-surface-variant rounded-2xl p-5 border border-outline animate-[gravityDrop_0.3s_ease_both]">
          <SectionHead color="text-error">⚠️ Penalty Amounts</SectionHead>
          {[['Maker300','₹300 deducted from Maker'],['Maker1000','₹1,000 deducted from Maker'],['DM250','₹250 deducted from DM'],['Manager200','₹200 deducted from Manager'],['Manager400','₹400 deducted from Manager'],['Manager1000','₹1,000 deducted from Manager']].map(([code,amt])=>(
            <div key={code} className="flex justify-between py-2 border-b border-outline-var">
              <span className="text-sm text-primary font-bold font-mono">{code}</span>
              <span className="text-sm text-on-surface-var">{amt}</span>
            </div>
          ))}
        </div>
        <div className="bg-surface-variant rounded-2xl p-5 border border-outline animate-[gravityDrop_0.3s_ease_both]">
          <SectionHead color="text-error">🚨 BIG4 Tags (Always Image + 1★ Food + 1★ Exp)</SectionHead>
          {[['VegNonVeg','Maker1000 + Manager1000 · Max ₹500 or Product Source'],['ExternalElement','Maker1000 + Manager1000 · Max ₹500 or Product'],['InsectFound','Maker1000 · Max ₹500 or Product Amount'],['HairFound','Maker300 · Max ₹500 or Product Amount']].map(([tag,pen])=>(
            <div key={tag} className="py-2 border-b border-outline-var">
              <div className="flex justify-between mb-0.5">
                <span className="text-sm font-extrabold text-error">{tag}</span>
                <span className="text-[11px] bg-error/15 text-error px-2 py-0.5 rounded-full font-bold">📷 IMAGE REQUIRED</span>
              </div>
              <span className="text-xs text-on-surface-var">{pen}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── N-1 LOGIC ──────────────────────────────────── */}
      <h2 className="text-xl font-bold text-on-surface mb-5 flex items-center gap-2.5">🔍 N-1 Refund Logic <span className="flex-1 h-px bg-outline" /></h2>
      <div className="bg-surface-variant rounded-2xl p-5 border border-outline mb-6 animate-[gravityDrop_0.3s_ease_both]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <SectionHead color="text-success">✅ GIVE Refund When</SectionHead>
            {['Case 1A: N-1 had NO refund/credit (clean slate)','Case 1B: N-1 had refund BUT genuine blunder + good history','First-ever order (N-1 = no history)','Outlet confirmed fault (OOS, closed, wrong product made)'].map((t,i)=>(
              <div key={i} className="p-2 bg-success/8 rounded-lg mb-1.5 text-sm text-success border-l-[3px] border-success">✅ {t}</div>
            ))}
          </div>
          <div>
            <SectionHead color="text-error">❌ DENY Refund When</SectionHead>
            {['N-1 had refund AND current complaint is not a genuine blunder','Case 2B: N-1 clean BUT N-2 had refund','N-1 + N-2 both had refunds (bad pattern)','Last 2+ consecutive orders all had refunds'].map((t,i)=>(
              <div key={i} className="p-2 bg-error/8 rounded-lg mb-1.5 text-sm text-error border-l-[3px] border-error">❌ {t}</div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MOJO PORTIONING ────────────────────────────── */}
      <h2 className="text-xl font-bold text-on-surface mb-5 flex items-center gap-2.5">🍕 MOJO Makeline — Portioning Charts <span className="flex-1 h-px bg-outline" /></h2>
      <div className="bg-surface-variant rounded-2xl p-5 border border-outline mb-6 animate-[gravityDrop_0.3s_ease_both]">
        <SectionHead>🍕 Pizza Base (Big 10" / Regular 7")</SectionHead>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm min-w-[600px]">
            <thead><tr><th className="bg-surface-3 p-3 text-center text-primary font-bold text-xs border border-outline whitespace-nowrap">Ingredient</th><th className="bg-surface-3 p-3 text-center text-primary font-bold text-xs border border-outline whitespace-nowrap">PT Big</th><th className="bg-surface-3 p-3 text-center text-primary font-bold text-xs border border-outline whitespace-nowrap">PT CB</th><th className="bg-surface-3 p-3 text-center text-primary font-bold text-xs border border-outline whitespace-nowrap">PT CCB</th><th className="bg-surface-3 p-3 text-center text-primary font-bold text-xs border border-outline whitespace-nowrap">PT Regular</th><th className="bg-surface-3 p-3 text-center text-primary font-bold text-xs border border-outline whitespace-nowrap">PT Reg CB</th><th className="bg-surface-3 p-3 text-center text-primary font-bold text-xs border border-outline whitespace-nowrap">TC Big</th><th className="bg-surface-3 p-3 text-center text-primary font-bold text-xs border border-outline whitespace-nowrap">TC CB</th><th className="bg-surface-3 p-3 text-center text-primary font-bold text-xs border border-outline whitespace-nowrap">TC CCB</th><th className="bg-surface-3 p-3 text-center text-primary font-bold text-xs border border-outline whitespace-nowrap">TC Regular</th><th className="bg-surface-3 p-3 text-center text-primary font-bold text-xs border border-outline whitespace-nowrap">TC Reg CB</th></tr></thead>
            <tbody>
              {[['Mozzarella Cheese','120g','120g','120g','60g','60g','120g','120g','120g','60g','60g'],
                ['Pizza Sauce','100g','100g','100g','50g','50g','100g','100g','100g','50g','50g'],
                ['Tortilla (for CB)','—','1 Big','1 Big','—','1 Small','—','1 Big','1 Big','—','1 Small'],
                ['Filler Cheese (CB)','—','120g','80g','—','60g','—','120g','80g','—','60g'],
                ['Plain Chicken (CCB)','—','—','100g','—','—','—','—','100g','—','—'],
              ].map(([name,...vals])=>(
                <tr key={name}><td className="p-3 border border-outline-var bg-surface-2 text-on-surface font-semibold text-sm text-left border-l-4 border-l-primary">{name}</td>{vals.map((v,i)=><td key={i} className={`p-3 border border-outline-var text-center text-sm ${v==='—' ? 'text-on-surface-dim font-normal' : 'text-primary font-bold'}`}>{v}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-2.5 p-2.5 bg-warning/8 rounded-lg text-sm text-warning">
          ⚠️ <strong>Butter Chicken & Paneer Makhani</strong> use <strong>Orange Gravy</strong> instead of Pizza Sauce (same 100g/50g quantity) · 
          <strong>Dough ball weights:</strong> 10" = 270g · 7" = 135g
        </div>
      </div>

      <div className="bg-surface-variant rounded-2xl p-5 border border-outline mb-6 animate-[gravityDrop_0.3s_ease_both]">
        <SectionHead>🥦 Veg Pizza Toppings — Pan Tossed Big (grams)</SectionHead>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm min-w-[600px]">
            <thead><tr><th className="bg-surface-3 p-3 text-center text-primary font-bold text-xs border border-outline whitespace-nowrap">Pizza Name</th><th className="bg-surface-3 p-3 text-center text-primary font-bold text-xs border border-outline whitespace-nowrap">Onion</th><th className="bg-surface-3 p-3 text-center text-primary font-bold text-xs border border-outline whitespace-nowrap">Capsicum</th><th className="bg-surface-3 p-3 text-center text-primary font-bold text-xs border border-outline whitespace-nowrap">Tomato</th><th className="bg-surface-3 p-3 text-center text-primary font-bold text-xs border border-outline whitespace-nowrap">Corn</th><th className="bg-surface-3 p-3 text-center text-primary font-bold text-xs border border-outline whitespace-nowrap">Mushroom</th><th className="bg-surface-3 p-3 text-center text-primary font-bold text-xs border border-outline whitespace-nowrap">Olives</th><th className="bg-surface-3 p-3 text-center text-primary font-bold text-xs border border-outline whitespace-nowrap">Jalapeños</th><th className="bg-surface-3 p-3 text-center text-primary font-bold text-xs border border-outline whitespace-nowrap">Paprika</th><th className="bg-surface-3 p-3 text-center text-primary font-bold text-xs border border-outline whitespace-nowrap">Peri Peri Paneer</th><th className="bg-surface-3 p-3 text-center text-primary font-bold text-xs border border-outline whitespace-nowrap">Tikka Paneer</th></tr></thead>
            <tbody>
              {[
                ['Double Cheese Margherita','—','—','—','—','—','—','—','—','—','—'],
                ["Farmer's Market",'—','40','—','30','—','—','—','—','—','—'],
                ['Farm Vibe Pizza','—','—','—','—','—','—','—','—','—','—'],
                ['Corn, Cheese & Jalapeños','—','—','—','30','—','—','20','—','—','—'],
                ['Zesty Veggie','30','40','—','—','—','—','20','—','—','—'],
                ['Olive Garden','—','40','30','—','—','15','—','—','—','—'],
                ['Spicy Mexicano','30','—','30','—','—','—','20','15','—','—'],
                ['Magic Mushrooms','—','40','30','—','60','—','—','—','—','—'],
                ['Indi Tandoori Paneer','30','30','—','—','—','—','—','—','—','50'],
                ['Paneer Tikka','30','—','—','—','—','—','—','—','—','100'],
                ['Veggie Paradise','30','40','30','—','—','15','—','15','—','—'],
                ['Italian Fiesta','30','60','—','—','—','15','20','—','—','—'],
                ['Peri Peri Paneer Pizza','20','30','—','—','—','—','15','—','100','—'],
                ['**Paneer Makhni (Orange Gravy)','30','20','20','—','—','—','—','—','—','100'],
                ['All Veggies Madness','30','20','20','15','30','15','20','—','—','—'],
                ['Paneer Overload','30','20','20','—','—','—','—','—','—','50+50'],
                ['Crowded House Veg','30','20','—','15','—','15','15','—','—','50'],
              ].map(([name,...vals])=>(
                <tr key={name} className="bg-success/6 hover:bg-success/12 transition-colors"><td className="p-3 border border-outline-var bg-success/6 text-on-surface font-semibold text-sm text-left border-l-4 border-l-success">{name}</td>{vals.map((v,i)=><td key={i} className={`p-3 border border-outline-var text-center text-sm ${v==='—' ? 'text-on-surface-dim font-normal' : 'text-success font-bold'}`}>{v}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-surface-variant rounded-2xl p-5 border border-outline mb-6 animate-[gravityDrop_0.3s_ease_both]">
        <SectionHead color="text-error">🍗 Non-Veg Pizza Toppings — Pan Tossed Big (grams)</SectionHead>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm min-w-[600px]">
            <thead><tr><th className="bg-surface-3 p-3 text-center text-primary font-bold text-xs border border-outline whitespace-nowrap">Pizza Name</th><th className="bg-surface-3 p-3 text-center text-primary font-bold text-xs border border-outline whitespace-nowrap">Onion</th><th className="bg-surface-3 p-3 text-center text-primary font-bold text-xs border border-outline whitespace-nowrap">Capsicum</th><th className="bg-surface-3 p-3 text-center text-primary font-bold text-xs border border-outline whitespace-nowrap">Tomato</th><th className="bg-surface-3 p-3 text-center text-primary font-bold text-xs border border-outline whitespace-nowrap">Corn</th><th className="bg-surface-3 p-3 text-center text-primary font-bold text-xs border border-outline whitespace-nowrap">Mushroom</th><th className="bg-surface-3 p-3 text-center text-primary font-bold text-xs border border-outline whitespace-nowrap">Olives</th><th className="bg-surface-3 p-3 text-center text-primary font-bold text-xs border border-outline whitespace-nowrap">Herb Chkn</th><th className="bg-surface-3 p-3 text-center text-primary font-bold text-xs border border-outline whitespace-nowrap">Peri Chkn</th><th className="bg-surface-3 p-3 text-center text-primary font-bold text-xs border border-outline whitespace-nowrap">BBQ Chkn</th><th className="bg-surface-3 p-3 text-center text-primary font-bold text-xs border border-outline whitespace-nowrap">Tikka Chkn</th><th className="bg-surface-3 p-3 text-center text-primary font-bold text-xs border border-outline whitespace-nowrap">Pepperoni</th><th className="bg-surface-3 p-3 text-center text-primary font-bold text-xs border border-outline whitespace-nowrap">Mutton</th></tr></thead>
            <tbody>
              {[
                ['Pepper Chicken Magic','40','—','—','—','—','—','—','—','—','—','50','—'],
                ['Chicken Blaze','30','—','—','—','—','—','—','—','—','—','50','—'],
                ['Chicken Smokey Joe','30','—','—','—','—','—','—','—','100','—','—','—'],
                ['Chicken Corn Delight','—','—','—','15','—','—','—','—','—','100','—','—'],
                ['Fiery Chicken','—','20','—','15','—','—','—','—','—','100','—','—'],
                ['Peri Peri Chicken','—','20','—','15','—','15','—','100','—','—','—','—'],
                ['BBQ Chicken','—','20','—','15','—','20','—','—','100','—','—','—'],
                ['Chicken Mexicano','30','20','20','—','—','—','—','—','—','100','—','—'],
                ['Chicken Tikka','30','20','—','—','—','—','—','—','—','100','—','—'],
                ['Double Trouble','—','20','—','15','—','—','—','—','50','100','—','—'],
                ['Fire Me Up','—','20','—','15','—','—','—','50','—','100','—','—'],
                ['Chicken Italiana','—','20','—','—','—','30','—','—','50','100','—','—'],
                ['**Butter Chicken (Orange Gravy)','30','20','20','—','—','—','—','—','—','100','—','—'],
                ['Classic Pepperoni','—','—','—','—','—','—','—','—','—','—','24pc','—'],
                ["MOJO's Chicken Special","—","20","—","15","30","20","50","—","50","50","—","—"],
                ['Chicken Full Smash','30','20','—','15','—','15','50','—','50','50','—','—'],
                ['The Meat Eater','—','—','—','—','—','—','50','—','50','50','—','50'],
                ['Mad Over Lamb','30','—','—','—','—','—','—','—','—','—','—','100'],
              ].map(([name,...vals])=>(
                <tr key={name} className="bg-error/6 hover:bg-error/12 transition-colors"><td className="p-3 border border-outline-var bg-error/6 text-on-surface font-semibold text-sm text-left border-l-4 border-l-error">{name}</td>{vals.map((v,i)=><td key={i} className={`p-3 border border-outline-var text-center text-sm ${v==='—' ? 'text-on-surface-dim font-normal' : 'text-error font-bold'}`}>{v}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-2.5 text-sm text-on-surface-var">💡 All H&H pizzas = half the amounts of Pan Tossed Big · Lean Crust = same portioning as MOJO (thin crust base only) · Regular 7" = half topping amounts · Extra topping add-on: Medium (10") = 40g · Small (7") = 20g</div>
      </div>

      <div className="bg-surface-variant rounded-2xl p-5 border border-outline mb-6 animate-[gravityDrop_0.3s_ease_both]">
        <SectionHead>🍞 Value Pizzas (Small Pan Tossed)</SectionHead>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm min-w-[400px]">
            <thead><tr><th className="bg-surface-3 p-3 text-center text-primary font-bold text-xs border border-outline whitespace-nowrap">Item</th><th className="bg-surface-3 p-3 text-center text-primary font-bold text-xs border border-outline whitespace-nowrap">Pizza Sauce</th><th className="bg-surface-3 p-3 text-center text-primary font-bold text-xs border border-outline whitespace-nowrap">Filler Cheese</th><th className="bg-surface-3 p-3 text-center text-primary font-bold text-xs border border-outline whitespace-nowrap">Mozzarella</th><th className="bg-surface-3 p-3 text-center text-primary font-bold text-xs border border-outline whitespace-nowrap">Toppings</th></tr></thead>
            <tbody>
              {[['Spicy Jalapeño Pizza','40g','20g','30g','Jalapeños 20g'],['Golden Corn Pizza','40g','20g','30g','Corn 20g'],['Capsicum Pizza','40g','20g','30g','Capsicum 20g'],['Onion Pizza','40g','20g','30g','Onion 20g'],['Tomato Pizza','40g','20g','30g','Tomato 20g'],['Chicken & Onion','40g','20g','30g','Herb Chicken 20g + Onion 20g']].map(([n,s,f,m,t])=>(
                <tr key={n}><td className="p-3 border border-outline-var bg-surface-2 text-on-surface font-semibold text-sm text-left border-l-4 border-l-primary">{n}</td><td className="p-3 border border-outline-var text-center">{s}</td><td className="p-3 border border-outline-var text-center">{f}</td><td className="p-3 border border-outline-var text-center text-primary font-bold">{m}</td><td className="p-3 border border-outline-var text-center text-on-surface-var">{t}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-surface-variant rounded-2xl p-5 border border-outline mb-6 animate-[gravityDrop_0.3s_ease_both]">
        <SectionHead>🧄 Garlic Breadsticks (MOJO/Lean Crust) — All items use Small Pizza Base</SectionHead>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm min-w-[600px]">
            <thead><tr><th className="bg-surface-3 p-3 text-center text-primary font-bold text-xs border border-outline whitespace-nowrap">Item</th><th className="bg-surface-3 p-3 text-center text-primary font-bold text-xs border border-outline whitespace-nowrap">Type</th><th className="bg-surface-3 p-3 text-center text-primary font-bold text-xs border border-outline whitespace-nowrap">Sauce/Base</th><th className="bg-surface-3 p-3 text-center text-primary font-bold text-xs border border-outline whitespace-nowrap">Filling 1</th><th className="bg-surface-3 p-3 text-center text-primary font-bold text-xs border border-outline whitespace-nowrap">Filling 2</th><th className="bg-surface-3 p-3 text-center text-primary font-bold text-xs border border-outline whitespace-nowrap">Filling 3</th><th className="bg-surface-3 p-3 text-center text-primary font-bold text-xs border border-outline whitespace-nowrap">Garlic Butter</th></tr></thead>
            <tbody>
              {[
                ['Classic Garlic Bread + Cheesy Dip','VEG','Garlic Butter (before bake) 20g','—','—','—','10g (after bake)'],
                ['Cheeslicious / Cheese Burst','VEG','Filler Cheese 30g','—','—','—','10g (after bake)'],
                ['Mexican Stuffed Garlic Bread','VEG','Filler Cheese 30g','Corn 10g','Jalapeños 20g','Veg Sprinkler 2g','10g (after bake)'],
                ['Italian Stuffed Garlic Bread','VEG','Filler Cheese 30g','Mushroom 20g','Olives 10g','Veg Sprinkler 2g','10g (after bake)'],
                ['Paneer Tikka Stuffed Garlic Bread','VEG','Filler Cheese 30g','Tikka Paneer 30g','Onions 10g','—','10g (after bake)'],
                ['Paneer Peri Peri Stuffed Garlic Bread','VEG','Mayo Sauce 30g','Peri Peri Paneer 30g','Capsicum 10g','—','10g (after bake)'],
                ['Mexican Chicken Stuffed','NON-VEG','Filler Cheese 30g','Herbed Chicken 30g','Jalapeños 10g','—','10g (after bake)'],
                ['Chicken Tikka Stuffed','NON-VEG','Filler Cheese 30g','Tikka Chicken 30g','Onions 10g','—','10g (after bake)'],
                ['Chicken Peri Peri Stuffed','NON-VEG','Mayo Sauce 30g','Peri Peri Chicken 30g','Capsicum 10g','—','10g (after bake)'],
                ['Pepperoni Stuffed','NON-VEG','Filler Cheese 30g','Pepperoni 6pcs','—','—','10g (after bake)'],
              ].map(([n,t,...rest])=>(
                <tr key={n} className={t==='VEG' ? 'bg-success/6 hover:bg-success/12' : 'bg-error/6 hover:bg-error/12'}><td className="p-3 border border-outline-var bg-surface-2 text-on-surface font-semibold text-sm text-left border-l-4 border-l-primary">{n}</td>
                  <td className="p-3 border border-outline-var text-center"><span className={`px-2 py-0.5 rounded-md text-xs font-bold ${t==='VEG' ? 'bg-success/20 text-success' : 'bg-error/20 text-error'}`}>{t}</span></td>
                  {rest.map((v,i)=><td key={i} className={`p-3 border border-outline-var text-center text-sm ${v==='—' ? 'text-on-surface-dim' : 'text-on-surface'}`}>{v}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-surface-variant rounded-2xl p-5 border border-outline mb-6 animate-[gravityDrop_0.3s_ease_both]">
        <SectionHead>🐔 PRP Marination (MOJO)</SectionHead>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="mb-2 font-bold text-on-surface-var text-sm">🍗 CHICKEN (Peri-Peri / Herb / BBQ / Tikka)</div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead><tr><th className="bg-surface-3 p-2.5 text-center text-primary font-bold text-xs border border-outline">Plain Chicken Qty</th><th className="bg-surface-3 p-2.5 text-center text-primary font-bold text-xs border border-outline">Marination</th></tr></thead>
                <tbody>
                  {[['1 KG','200g each type'],['500g','100g each type'],['250g','50g each type']].map(([q,m])=>(
                    <tr key={q} className="bg-error/6"><td className="p-2.5 border border-outline-var bg-error/6 text-on-surface font-semibold text-sm text-left border-l-4 border-l-error">{q}</td><td className="p-2.5 border border-outline-var text-center text-error font-bold">{m}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <div className="mb-2 font-bold text-on-surface-var text-sm">🧀 PANEER (Peri-Peri / Tikka)</div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead><tr><th className="bg-surface-3 p-2.5 text-center text-primary font-bold text-xs border border-outline">Paneer Cubes Qty</th><th className="bg-surface-3 p-2.5 text-center text-primary font-bold text-xs border border-outline">Marination</th></tr></thead>
                <tbody>
                  {[['1 KG','200g each type'],['500g','100g each type'],['250g','50g each type']].map(([q,m])=>(
                    <tr key={q} className="bg-success/6"><td className="p-2.5 border border-outline-var bg-success/6 text-on-surface font-semibold text-sm text-left border-l-4 border-l-success">{q}</td><td className="p-2.5 border border-outline-var text-center text-success font-bold">{m}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="mt-2.5 p-2.5 bg-primary/8 rounded-lg text-sm text-on-surface-var">
          🔑 <strong>Starters:</strong> Chicken Wings 6pcs = 40g marination · 12pcs = 80g · Boneless Chicken 200g packet = 40g marination + 20g mayo · Non-Veg: green chutney 20g
        </div>
      </div>

      <div className="bg-surface-variant rounded-2xl p-5 border border-outline mb-6 animate-[gravityDrop_0.3s_ease_both]">
        <SectionHead>⚙️ Production Recipes</SectionHead>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="font-bold mb-2 text-primary text-sm">🍕 Pan Tossed Dough</div>
            {[['Maida (Base)','2.5 KG → 4.2 KG total'],['Water','1400g'],['Sunday Oil','100g + 25g'],['DB Normal','1 packet (2.5)'],['Pizza Powder','60g'],['Fat Flakes','100g'],['Kneading Time','10 minutes'],['Dough Ball 10"','270g'],['Dough Ball 7"','135g']].map(([k,v])=>row(k,v))}
          </div>
          <div>
            <div className="font-bold mb-2 text-tertiary text-sm">🍫 Chocolava Cake (20 pcs)</div>
            {[['Chocolava Premix','1 KG'],['Sunday Oil','400g'],['RO Water','400g']].map(([k,v])=>row(k,v,'text-tertiary'))}
            <div className="font-bold mb-2 mt-4 text-blue-500 text-sm">🍋 Lemonade (10 bottles)</div>
            {[['Premix','75g'],['Sugar','250g'],['RO Water','3000g']].map(([k,v])=>row(k,v,'text-[#2196F3]'))}
          </div>
        </div>
      </div>

      {/* ── BOX8 PORTIONING QUICK REF ──────────────────── */}
      <h2 className="text-xl font-bold text-on-surface mb-5 flex items-center gap-2.5">📦 BOX8 / Daily Kitchen — Quick Portioning Reference <span className="flex-1 h-px bg-outline" /></h2>
      <div className="bg-surface-variant rounded-2xl p-5 border border-outline mb-6 animate-[gravityDrop_0.3s_ease_both]">
        <SectionHead>🍱 Meal Base Choices (All-in-1 / Mini Meal / 2-in-1 Box)</SectionHead>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="font-bold mb-2 text-sm text-primary">🍱 All-in-1 Meal (BOX8)</div>
            {[['Rice Base (Meal/Biryani)','280g'],['Paratha option','1 pack'],['Phulka option','1 pack'],['Rice + Paratha/Phulka','160g rice + 1 pack'],['Side Gravy (Dal/Chole/Rajma)','120g'],['Salad','Desi Salad 40g + Chaat masala + Green Chutney 20g'],['Dessert','Gulab Jamun 8 pcs or Moong Dal Halwa 60g'],['Packing','Big Meal Tray + Box8 Sleeve + Spoon + Envelope']].map(([k,v])=>row(k,v))}
          </div>
          <div>
            <div className="font-bold mb-2 text-sm text-warning">🥘 Mini Meal (BOX8)</div>
            {[['Rice Base','250g'],['Paratha/Phulka','1 pack'],['Rice + Paratha','160g + 1 pack'],['Salad','Desi Salad 40g + Chaat masala + Green Chutney 20g'],['Packing','Small Meal Tray + Box8 Sleeve + Spoon + Envelope']].map(([k,v])=>row(k,v,'text-warning'))}
            <div className="font-bold mb-2 mt-4 text-sm text-blue-500">🥗 Desi Box / NH1 Bowl</div>
            {[['Rice (Meal/Biryani)','250g'],['Salad + Chutney','Desi Salad 40g + Green Chutney 15g + Garlic Yogurt 15g']].map(([k,v])=>row(k,v,'text-[#2196F3]'))}
          </div>
        </div>
      </div>

      <div className="bg-surface-variant rounded-2xl p-5 border border-outline mb-6 animate-[gravityDrop_0.3s_ease_both]">
        <SectionHead>🥣 Gravy Quantities by Meal Type</SectionHead>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm min-w-[600px]">
            <thead><tr><th className="bg-surface-3 p-3 text-center text-primary font-bold text-xs border border-outline whitespace-nowrap">Dish Type</th><th className="bg-surface-3 p-3 text-center text-primary font-bold text-xs border border-outline whitespace-nowrap">All-in-1</th><th className="bg-surface-3 p-3 text-center text-primary font-bold text-xs border border-outline whitespace-nowrap">Mini Meal</th><th className="bg-surface-3 p-3 text-center text-primary font-bold text-xs border border-outline whitespace-nowrap">Desi Box / NH1</th><th className="bg-surface-3 p-3 text-center text-primary font-bold text-xs border border-outline whitespace-nowrap">Full Curry</th><th className="bg-surface-3 p-3 text-center text-primary font-bold text-xs border border-outline whitespace-nowrap">Half Curry</th></tr></thead>
            <tbody>
              {[['Dal/Rajma/Chole','180g','220g','260g','520g','260g'],['Gravy Dishes','110g','140g','160g','320g','160g'],['Toppings: Paneer/Chicken/Mutton','70g','70g–100g','100g','160–200g','80–100g'],['Eggs (Egg Curry)','1.5 pcs','1.5 pcs','2 pcs','3 pcs','1.5 pcs'],['Dum Aloo pieces','3 pcs (50–55g)','3 pcs (50–55g)','4 pcs (70–75g)','8 pcs (140–145g)','4 pcs (70–75g)'],['Malai Kofta pieces','3 pcs','3 pcs','4 pcs','8 pcs','4 pcs']].map(([n,...vals])=>(
                <tr key={n}><td className="p-3 border border-outline-var bg-surface-2 text-on-surface font-semibold text-sm text-left border-l-4 border-l-primary">{n}</td>{vals.map((v,i)=><td key={i} className="p-3 border border-outline-var text-center text-primary font-bold">{v}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-2.5 p-2.5 bg-primary/8 rounded-lg text-sm text-on-surface-var">
          📦 <strong>Full Curry packing:</strong> Big Curry Container + Eatclub Common Box + Veg/NV Sticker + Spoon + Envelope · <strong>Half Curry:</strong> Small Curry Container + same extras
        </div>
      </div>

      <div className="bg-surface-variant rounded-2xl p-5 border border-outline mb-6 animate-[gravityDrop_0.3s_ease_both]">
        <SectionHead>🍛 Biryani Quick Reference</SectionHead>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm min-w-[600px]">
            <thead><tr><th className="bg-surface-3 p-3 text-center text-primary font-bold text-xs border border-outline whitespace-nowrap">Brand / Format</th><th className="bg-surface-3 p-3 text-center text-primary font-bold text-xs border border-outline whitespace-nowrap">Dum Rice Total</th><th className="bg-surface-3 p-3 text-center text-primary font-bold text-xs border border-outline whitespace-nowrap">Extra</th><th className="bg-surface-3 p-3 text-center text-primary font-bold text-xs border border-outline whitespace-nowrap">NV Chicken Gravy</th><th className="bg-surface-3 p-3 text-center text-primary font-bold text-xs border border-outline whitespace-nowrap">NV Topping</th><th className="bg-surface-3 p-3 text-center text-primary font-bold text-xs border border-outline whitespace-nowrap">Veg Gravy</th><th className="bg-surface-3 p-3 text-center text-primary font-bold text-xs border border-outline whitespace-nowrap">Veg Topping</th></tr></thead>
            <tbody>
              {[
                ['Itminaan (1 KG Matka)','440 + 200g = 640g','Raita 2pcs + Dessert','50g','200g','100g','160g'],
                ['Zaza Mughal Biryani','220 + 100g = 320g','Raita 1pc','25g','100g','50g','70–80g'],
                ['1881 (Black Bowl)','220 + 100g = 320g','NO Raita · Black Bowl + Paper Bag','20g','70g','40g','35–70g'],
                ['NH1 Round Bowl','220 + 100g = 320g','Desi Salad + Yogurt + Green Chutney','20g','70g','40g','35–70g'],
                ['Box8 Biryani Thali','170 + 100g = 270g','Raita 100g + Onion 40g + Green Chutney','20g','70g','40g','35–70g'],
                ['Zaza Biryani Thali (Mini)','170 + 100g = 270g','Raita + Samosa 2pcs + Gulab Jamun 8pcs','20g','70g','40g','35–70g'],
              ].map(([n,...vals])=>(
                <tr key={n}><td className="p-3 border border-outline-var bg-surface-2 text-on-surface font-semibold text-sm text-left border-l-4 border-l-primary">{n}</td>{vals.map((v,i)=><td key={i} className={`p-3 border border-outline-var text-center text-sm ${i > 0 ? 'text-primary font-bold' : ''}`}>{v}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── SERVICE & SAAS ─────────────────────────────── */}
      <h2 className="text-xl font-bold text-on-surface mb-5 flex items-center gap-2.5">🖥️ Service Info & SAAS Quick Reference <span className="flex-1 h-px bg-outline" /></h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        <div className="bg-surface-variant rounded-2xl p-5 border border-outline animate-[gravityDrop_0.3s_ease_both]">
          <SectionHead>⏰ Service Hours & Operations</SectionHead>
          {[['Delivery Hours','7 days/week, 11 AM – 3 AM'],['Orders Until','3 AM (no new orders after)'],['SAAS URL','saas.box8.co.in'],['Browser Tabs','8 tabs always open during shift'],['Kaleyra Status','Stay logged in throughout entire shift'],['Swiggy Step 1 (Kaleyra)','Dial 8047225038 from Kaleyra'],['Swiggy Step 2','Dial 9548682405 from personal mobile']].map(([k,v])=>row(k,v))}
        </div>
        <div className="bg-surface-variant rounded-2xl p-5 border border-outline animate-[gravityDrop_0.3s_ease_both]">
          <SectionHead>🚫 SAAS Key Actions</SectionHead>
          {[['Customer order lookup','Order Intake → Brand → Enter phone number'],['Outlet/DM lookup','Tracker → Select Outlet → Status'],['Wallet refund','Order → Edit → Custom Refund → Wallet'],['Bank refund','Order → Edit → Custom Refund → Bank'],['Feedback rating','Feedback Addition section'],['Failed payment refund','Failed TXN section'],['Cancel form','docs.google.com/forms cancellation form'],['MISS Coupon','Re-send missing item at ₹0']].map(([action,path])=>(
            <div key={action} className="py-2 border-b border-outline-var">
              <div className="text-sm font-semibold text-on-surface mb-0.5">{action}</div>
              <div className="text-xs text-on-surface-var font-mono">{path}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── RATINGS QUICK REF ──────────────────────────── */}
      <h2 className="text-xl font-bold text-on-surface mb-5 flex items-center gap-2.5">⭐ Ratings Quick Reference (UPDATED RULES) <span className="flex-1 h-px bg-outline" /></h2>
      <div className="bg-surface-variant rounded-2xl p-5 border border-outline mb-6 animate-[gravityDrop_0.3s_ease_both]">
        <div className="p-2.5 bg-error/8 rounded-lg mb-4 text-sm text-error border-l-[3px] border-error font-semibold">
          🔴 UPDATED: Customer gives 2★/3★/4★ → Agent ALWAYS gives 1★. Agents NEVER give 3★ or 4★.
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            {[['Customer 5★ + No complaint','5★ Food + 5★ Exp'],['BIG4 Tag (any)','1★ Food + 1★ Exp (always)'],['ExternalElement','1★ Food + 1★ Exp (always)'],['OrderLate in Dispatched','1★ Exp (DM fault)'],['DM_RudeBehavior','1★ Exp'],['DM_WrongProductDelivered','1★ Exp']].map(([s,r])=>(
              <div key={s} className="flex justify-between py-2 border-b border-outline-var gap-2">
                <span className="text-sm text-on-surface-var flex-1">{s}</span>
                <span className="text-sm font-bold text-primary text-right">{r}</span>
              </div>
            ))}
          </div>
          <div>
            {[['Blank + High intensity food issue','1★ Food'],['Blank + Low intensity food issue','3★ Food (but agent gives 1★ for customer 2–4★)'],['OrderLate in Placed/Received','1★ Exp (outlet fault)'],['OutletRudeness','1★ Exp'],['StickerMismatch','3★ Exp → but 1★ if customer gave 2–4★'],['No food complaint, experience ok','5★ Food + 5★ Exp']].map(([s,r])=>(
              <div key={s} className="flex justify-between py-2 border-b border-outline-var gap-2">
                <span className="text-sm text-on-surface-var flex-1">{s}</span>
                <span className="text-sm font-bold text-primary text-right">{r}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
