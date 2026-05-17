export const ME_PASS_DISCOUNT = 0.30;

export const ME_BRANDS = [
  { id:'box8',      label:'BOX8',           emoji:'🍛', color:'#F57C00', short:'Desi Meals' },
  { id:'mojo',      label:'MOJO Pizza',     emoji:'🍕', color:'#E53935', short:'2X Toppings' },
  { id:'leancrust', label:'LeanCrust',      emoji:'🍕', color:'#6D4C41', short:'Thin Crust' },
  { id:'itminaan',  label:'Itminaan',       emoji:'🫙', color:'#4E342E', short:'Matka Biryani' },
  { id:'nh1',       label:'NH1 Bowls',      emoji:'🍚', color:'#C62828', short:'Biryani' },
  { id:'wefit',     label:'WeFit',          emoji:'🥗', color:'#2E7D32', short:'Protein Meals' },
  { id:'mealful',   label:'Mealful Rolls',  emoji:'🌯', color:'#558B2F', short:'Big Rolls' },
  { id:'hola',      label:'Hola Pasta',     emoji:'🍝', color:'#1565C0', short:'Gourmet Pasta' },
];

export const ME_ITEMS = [

// ══════════════════════════════════════════════
// BOX8 — ALL-IN-1 MEALS (Thali Meals)
// ══════════════════════════════════════════════
{
  id:'b001', brand:'box8', category:'All-In-1 Meals', name:'Dal Makhani All-In-1 Meal',
  veg:true, mrp:249,
  desc:'Creamy Dal Makhani slow-cooked overnight + Dal Makhani/Chole/Dilli Rajma + Paratha/Rice + Salad + Chutney + Dessert.',
  ingredients:['Dal Makhani (black urad dal, rajma, cream, butter, tomato, spices)','Choice of Paratha or Rice','Green Salad (onion, cucumber, tomato)','Green Chutney','Choice of Chole/Rajma as side','Choco Lava Cake or Gulab Jamun (dessert)'],
  portion:'Rice 280g OR 1 Paratha pack · Gravy 120g · Salad 40g · Chutney 20g',
  image_slug:'dal-makhani-all-in-1',
  portioning_note:'Main gravy = 120g. Aloo-based gravies = 140g. Check portioning sheet for side gravy.',
  agent_tip:'Most ordered item. If CX complains dal is less — check 120g standard. If stale smell — Stale tag.'
},
{
  id:'b002', brand:'box8', category:'All-In-1 Meals', name:'Paneer Makhani All-In-1 Meal',
  veg:true, mrp:279,
  desc:'Rich Punjabi Makhni curry with melt-in-the-mouth paneer + Dal Makhani/Chole/Rajma + Paratha/Rice + Salad + Chutney + Dessert.',
  ingredients:['Paneer cubes (200g)','Makhani gravy (tomato, cream, butter, cashew, spices)','Choice of Paratha or Rice','Dal Makhani/Chole/Rajma side','Green Salad','Green Chutney','Dessert'],
  portion:'Paneer: 10 pcs (~200g plain paneer). Gravy: 120g. Rice 280g or 1 Paratha pack.',
  image_slug:'paneer-makhani-all-in-1',
  portioning_note:'Paneer Tikka Masala thali = Plain Paneer 200g + Tikka Marination 40g + Chaat Masala 2g.',
  agent_tip:'If CX says paneer is rubbery/tough — Not Fresh tag. Less paneer = LessQuantity tag.'
},
{
  id:'b003', brand:'box8', category:'All-In-1 Meals', name:'Amritsari Chole All-In-1 Meal',
  veg:true, mrp:249,
  desc:'Amritsari chole (spiced chickpeas) + Dal Makhani/Chole/Dilli Rajma + Paratha/Rice + Salad + Chutney + Dessert.',
  ingredients:['Amritsari Chole (chickpeas, onion, tomato, chole masala, ginger-garlic)','Choice of Paratha or Rice','Dal Makhani or Chole side','Green Salad','Green Chutney','Dessert'],
  portion:'Main gravy: 120g · Rice 280g or 1 Paratha pack · Salad 40g · Chutney 20g',
  image_slug:'amritsari-chole-all-in-1',
  portioning_note:'Standard All-In-1 portioning applies.',
  agent_tip:'If CX says chole is sour/tangy — that is natural amritsari style. Genuine taste complaints → Salty/Spicy/Tasteless tag.'
},
{
  id:'b004', brand:'box8', category:'All-In-1 Meals', name:'Butter Chicken All-In-1 Meal',
  veg:false, mrp:299,
  desc:'Seriously delicious Butter Chicken + Dal Makhani/Chole/Dilli Rajma + Paratha/Rice + Salad + Chutney + Dessert.',
  ingredients:['Butter Chicken (boneless chicken in tomato-cream-butter gravy)','Dal Makhani side','Choice of Paratha or Rice','Green Salad','Green Chutney','Dessert'],
  portion:'Main gravy: 120g · Rice 280g or 1 Paratha pack · Salad 40g · Chutney 20g',
  image_slug:'butter-chicken-all-in-1',
  portioning_note:'Non-veg All-In-1 standard: 120g gravy with chicken pieces.',
  agent_tip:'Popular non-veg option. Complaint about less chicken in gravy = LessQuantity. Undercooked chicken = Raw/Uncooked tag.'
},
{
  id:'b005', brand:'box8', category:'All-In-1 Meals', name:'Dilli Rajma All-In-1 Meal',
  veg:true, mrp:249,
  desc:'Authentic Dilli style Rajma + Dal Makhani/Chole/Dilli Rajma + Paratha/Rice + Salad + Chutney + Dessert.',
  ingredients:['Red Kidney Beans (rajma) cooked Dilli style with onion-tomato gravy','Dal Makhani side','Paratha or Rice','Salad','Chutney','Dessert'],
  portion:'120g gravy · 280g Rice or 1 Paratha pack · 40g Salad · 20g Chutney',
  image_slug:'dilli-rajma-all-in-1',
  portioning_note:'Standard All-In-1 portioning.',
  agent_tip:'Rajma colour is naturally dark — not a quality issue. If completely undercooked beans = Raw/Uncooked.'
},
{
  id:'b006', brand:'box8', category:'All-In-1 Meals', name:'Kadhai Paneer All-In-1 Meal',
  veg:true, mrp:279,
  desc:'Fresh paneer simmered in a spicy kadhai curry + Dal Makhani/Chole/Rajma + Paratha/Rice + Salad + Chutney + Dessert.',
  ingredients:['Kadhai Paneer (paneer, capsicum, onion, tomato, kadhai masala)','Dal Makhani side','Paratha or Rice','Salad','Chutney','Dessert'],
  portion:'120g gravy · 280g Rice or 1 Paratha pack · 40g Salad · 20g Chutney',
  image_slug:'kadhai-paneer-all-in-1',
  portioning_note:'Standard paneer portioning: ~10 pieces per serving.',
  agent_tip:'Spicier than Paneer Makhani — if CX says too spicy, it is the dish style. Salty/Spicy tag if genuinely excessive.'
},

// ══════════════════════════════════════════════
// BOX8 — MINI MEALS (Rice Bowl)
// ══════════════════════════════════════════════
{
  id:'b010', brand:'box8', category:'Mini Meals', name:'Dal Makhani Mini Meal',
  veg:true, mrp:169,
  desc:'Dal Makhani slow-cooked overnight with whole spices & fresh cream + Paratha/Rice + Salad.',
  ingredients:['Dal Makhani (black urad dal, cream, butter, tomato, spices)','Paratha or Rice','Green Salad'],
  portion:'Rice: 250g · Gravy: 220g (regular) or 140g (aloo-based) · No side gravy in mini meal',
  image_slug:'dal-makhani-mini-meal',
  portioning_note:'Mini Meal portion: Rice 250g, Gravy 220g (non-aloo) or 140g (aloo-based). No dessert included.',
  agent_tip:'If CX compares mini meal to thali meal — mini meal has no side gravy, no dessert, no chutney. Explain the difference.'
},
{
  id:'b011', brand:'box8', category:'Mini Meals', name:'Dilli Wale Rajma Rice Bowl',
  veg:true, mrp:169,
  desc:'Really good Rajma served with Rice + Salad + Mint chutney + Garlic yogurt.',
  ingredients:['Red Kidney Beans rajma curry','Steamed Rice','Green Salad','Mint Chutney','Garlic Yogurt (raita)'],
  portion:'Rice: 250g · Rajma: 220g · Salad · Chutney · Raita on side',
  image_slug:'rajma-rice-bowl',
  portioning_note:'Rice Bowl format — raita included with this item specifically.',
  agent_tip:'Raita is included with this item. If raita missing — Raita_Missing tag, full raita value refund.'
},
{
  id:'b012', brand:'box8', category:'Mini Meals', name:'Ghee Dal Khichdi Meal',
  veg:true, mrp:179,
  desc:'Chilka moong dal khichdi with a tadka of ghee, hing, jeera, garam masala & degi mirch + Papad + Pickle + Onions.',
  ingredients:['Chilka Moong Dal','Basmati Rice','Pure Desi Ghee','Hing (asafoetida)','Jeera (cumin)','Garam Masala','Degi Mirch','Papad','Pickle','Sliced Onions'],
  portion:'Khichdi: ~400g (rice+dal combined) · Papad 1pc · Pickle small portion · Onion slice',
  image_slug:'ghee-dal-khichdi',
  portioning_note:'Gluten-free item. No paratha/bread accompaniment in this item.',
  agent_tip:'Popular comfort food. If CX says no ghee taste — check if it is Ghee Khichdi Project brand (separate brand). This is BOX8 khichdi.'
},

// ══════════════════════════════════════════════
// BOX8 — STARTERS / OPENERS
// ══════════════════════════════════════════════
{
  id:'b020', brand:'box8', category:'Starters', name:'Peri Peri Chicken Wings (6 pcs)',
  veg:false, mrp:179,
  desc:'Tender & juicy chicken wings marinated & tossed with Peri Peri sauce. Grilled to perfection.',
  ingredients:['Chicken Wings 6 pieces (~240g raw)','Peri Peri Marinade (chilli, garlic, lemon, spices)','Green Chutney dip'],
  portion:'6 pieces · Marination: 40g · Served with green chutney',
  image_slug:'peri-peri-chicken-wings',
  portioning_note:'6pc = 40g marination. 12pc = 80g marination. Per portioning guide.',
  agent_tip:'Cold wings = ColdFood [Router] tag. Undercooked = Raw/Uncooked [Maker]. Less pieces = LessQuantity.'
},
{
  id:'b021', brand:'box8', category:'Starters', name:'Peri Peri Chicken Wings (12 pcs)',
  veg:false, mrp:299,
  desc:'Double portion of tender Peri Peri chicken wings — perfect for sharing.',
  ingredients:['Chicken Wings 12 pieces (~480g raw)','Peri Peri Marinade 80g','Green Chutney dip'],
  portion:'12 pieces · Marination: 80g',
  image_slug:'peri-peri-chicken-wings-12',
  portioning_note:'12pc = 80g marination (double of 6pc).',
  agent_tip:'Sharing portion. Same quality rules as 6pc. Check marination coverage on complaint.'
},
{
  id:'b022', brand:'box8', category:'Starters', name:'Paneer Tikka (10 pcs)',
  veg:true, mrp:199,
  desc:'Classic tandoori paneer tikka — chargrilled paneer cubes in tandoori marinade, served with chutney.',
  ingredients:['Plain Paneer 200g (10 pieces)','Tikka Marinade 40g (curd, tandoori spices, ginger-garlic)','Chaat Masala 2g','Pudina chutney'],
  portion:'10 pcs · Plain Paneer 200g · Tikka Marination 40g · Chaat Masala 2g',
  image_slug:'paneer-tikka',
  portioning_note:'Portioning: Plain Paneer 200g + Tikka Marination 40g + Chaat Masala 2g. Exact from portioning sheet.',
  agent_tip:'Standard starter. If CX says paneer is raw/not grilled = Raw/Uncooked. If dry = Not Fresh.'
},

// ══════════════════════════════════════════════
// BOX8 — BIRYANI
// ══════════════════════════════════════════════
{
  id:'b030', brand:'box8', category:'Biryani', name:'Chicken Dum Biryani',
  veg:false, mrp:229,
  desc:'Murg Dum Biryani — boneless chicken marinated in red masala, flame-grilled and dum-cooked with basmati rice. Served with raita.',
  ingredients:['Boneless Chicken (marinated in biryani masala)','Basmati Rice','Caramelised Onion (birista)','Mint & Coriander','Saffron/food colour','Dahi Raita'],
  portion:'Full biryani box — Rice + Chicken + Raita',
  image_slug:'chicken-dum-biryani',
  portioning_note:'Biryani served with raita. If raita missing — Raita_Missing tag.',
  agent_tip:'Raita is included. If missing = Raita_Missing [Router][DM] — full raita value refund.'
},
{
  id:'b031', brand:'box8', category:'Biryani', name:'Veg Dum Biryani',
  veg:true, mrp:199,
  desc:'Fragrant dum biryani with vegetables and paneer, layered with saffron rice.',
  ingredients:['Mixed Vegetables (potato, carrot, beans, peas)','Paneer cubes','Basmati Rice','Biryani Masala','Birista (caramelised onion)','Dahi Raita'],
  portion:'Full biryani box — Rice + Veg + Raita',
  image_slug:'veg-dum-biryani',
  portioning_note:'Raita accompanies all biryanis.',
  agent_tip:'Veg biryani. Raita missing = Raita_Missing. Wrong biryani type = WrongProduct tags.'
},

// ══════════════════════════════════════════════
// BOX8 — PARATHAS
// ══════════════════════════════════════════════
{
  id:'b040', brand:'box8', category:'Parathas', name:'Ghee Tawa Paratha (Pack of 3)',
  veg:true, mrp:99,
  desc:'Garma-garam soft whole wheat parathas made with Desi ghee on tawa.',
  ingredients:['Whole Wheat Flour (atta)','Desi Ghee','Salt'],
  portion:'3 parathas · 1 Paratha pack per standard meal',
  image_slug:'ghee-tawa-paratha',
  portioning_note:'1 paratha pack = standard All-In-1 meal accompaniment. Pack of 3 is standalone order.',
  agent_tip:'If paratha is hard/dry = Paratha [Maker300] tag. Stale smell = Stale tag. Oil excess = Not Fresh.'
},

// ══════════════════════════════════════════════
// BOX8 — DESSERTS
// ══════════════════════════════════════════════
{
  id:'b050', brand:'box8', category:'Desserts', name:'Choco Lava Cake',
  veg:true, mrp:79,
  desc:'Classic warm chocolate lava cake with a gooey centre. Best eaten immediately.',
  ingredients:['Dark Chocolate','All-Purpose Flour','Eggs/Egg substitute','Butter','Sugar','Cocoa Powder'],
  portion:'1 piece (~80g)',
  image_slug:'choco-lava-cake',
  portioning_note:'Served warm. Gooey centre is the standard. No lava = quality issue.',
  agent_tip:'No lava/gooey centre = ChocoLava [Maker300] tag. Refund: ₹50 or ₹80 credits. NOT full order refund.'
},
{
  id:'b051', brand:'box8', category:'Desserts', name:'Gulab Jamun (2 pcs)',
  veg:true, mrp:59,
  desc:'Soft, melt-in-mouth gulab jamuns soaked in rose-cardamom sugar syrup.',
  ingredients:['Khoya (reduced milk)','All-Purpose Flour','Rose Water','Cardamom','Sugar Syrup'],
  portion:'2 pieces in syrup',
  image_slug:'gulab-jamun',
  portioning_note:'Standard dessert. Part of All-In-1 meal dessert rotation.',
  agent_tip:'If dessert missing from All-In-1 meal — not a separate tag, part of overall meal. DessertMissing tag if standalone order.'
},

// ══════════════════════════════════════════════
// BOX8 — WRAPS / ROLLS
// ══════════════════════════════════════════════
{
  id:'b060', brand:'box8', category:'Wraps', name:'Chicken Tikka Paratha Wrap',
  veg:false, mrp:179,
  desc:'Grilled chicken tikka packed into a whole wheat paratha wrap with veggies and sauce.',
  ingredients:['Grilled Chicken Tikka pieces','Whole Wheat Paratha','Lettuce / Cabbage','Onion','Capsicum','Mint Chutney','Tikka Sauce'],
  portion:'1 large wrap (~300g)',
  image_slug:'chicken-tikka-paratha-wrap',
  portioning_note:'Wrap portioning: 1 whole wheat paratha base. Standard wrap.',
  agent_tip:'Wrong base (e.g. tortilla instead of paratha) = Wrap_WrongBase [Maker][Router]. Quality issue = Wrap [Maker300].'
},
{
  id:'b061', brand:'box8', category:'Wraps', name:'Paneer Tikka Paratha Wrap',
  veg:true, mrp:159,
  desc:'Grilled paneer tikka packed into a whole wheat paratha with crunchy veggies and mint chutney.',
  ingredients:['Paneer Tikka pieces','Whole Wheat Paratha','Lettuce / Cabbage','Onion','Capsicum','Mint Chutney'],
  portion:'1 large wrap (~280g)',
  image_slug:'paneer-tikka-paratha-wrap',
  portioning_note:'Standard wrap paratha base.',
  agent_tip:'Paratha quality issue = Paratha [Maker300]. Wrong base = Wrap_WrongBase.'
},

// ══════════════════════════════════════════════
// MOJO PIZZA — VEG PIZZAS
// ══════════════════════════════════════════════
{
  id:'m001', brand:'mojo', category:'Veg Pizzas', name:'Double Cheese Margherita (Regular 7")',
  veg:true, mrp:159,
  desc:'Golden corn with Mozzarella & Molten Cheese. 100% Dairy Cheese | 0% Mayonnaise.',
  ingredients:['Pizza Base (Dough)','Tomato Pizza Sauce','Double Mozzarella Cheese 120g','Golden Corn'],
  portion:'Regular 7" pizza — Mozzarella 60g + Sauce 40g (standard regular size)',
  image_slug:'double-cheese-margherita',
  portioning_note:'Regular (7"): Mozzarella 60g, Sauce 40g. Big (10"): Mozzarella 120g, Sauce 80g.',
  agent_tip:'Most common cheese complaint = Less/NoCheeseBlast or PanTossedBase / ThinCrustBase. Check which base was ordered.'
},
{
  id:'m002', brand:'mojo', category:'Veg Pizzas', name:'Golden Corn Pizza (Regular 7")',
  veg:true, mrp:159,
  desc:'Golden corn with mozzarella cheese on tomato base. Light and crispy.',
  ingredients:['Pizza Base','Tomato Sauce','Mozzarella Cheese 60g','Sweet Golden Corn'],
  portion:'Regular 7" — Mozzarella 60g, Sauce 40g',
  image_slug:'golden-corn-pizza',
  portioning_note:'Standard regular pizza portioning.',
  agent_tip:'Corn quantity complaint = LessQuantity [Maker]. Wrong base = ThinCrustBase or PanTossedBase.'
},
{
  id:'m003', brand:'mojo', category:'Veg Pizzas', name:'Veg & Veg Half & Half (Big 10")',
  veg:true, mrp:299,
  desc:'Pick half each of any 2 Veg Pizzas & make one Big 10" Pizza. Serves 2-3.',
  ingredients:['Big 10" Pizza Base','Double the toppings across 2 halves','Mozzarella Cheese 120g total','Tomato Sauce 80g'],
  portion:'Big 10" — Mozzarella 120g, Sauce 80g. Each half has its own topping set.',
  image_slug:'veg-veg-half-half',
  portioning_note:'H&H pizza: each half has dedicated toppings. Cheese distributed across full pizza.',
  agent_tip:'Wrong half = Pizza_H&HMistakes [Maker][Router]. Wrong base type = Pizza_WrongBase_ThinCrust.'
},
{
  id:'m004', brand:'mojo', category:'Veg Pizzas', name:'Value Fun Pizza (Regular 7")',
  veg:true, mrp:99,
  desc:'Budget pizza at ₹99. Basic toppings, full MOJO cheese. Great value.',
  ingredients:['Regular Pizza Base','Tomato Sauce','Mozzarella Cheese 60g','Basic veg toppings (corn/capsicum)'],
  portion:'Regular 7" — standard portioning',
  image_slug:'value-fun-pizza',
  portioning_note:'Value range. Same base portioning as standard regular pizza.',
  agent_tip:'Most price-sensitive item. CX may complain about "less toppings" — this is a value pizza. Explain this is the value range.'
},

// ══════════════════════════════════════════════
// MOJO PIZZA — NON-VEG PIZZAS
// ══════════════════════════════════════════════
{
  id:'m010', brand:'mojo', category:'Non-Veg Pizzas', name:'Chicken Smokey Joe (Regular 7")',
  veg:false, mrp:189,
  desc:'Smoky chicken with BBQ sauce, onion, capsicum, Mozzarella cheese.',
  ingredients:['Chicken pieces (marinated smoky BBQ)','Pizza Base','BBQ Sauce','Mozzarella Cheese 60g','Onion','Capsicum'],
  portion:'Regular 7" — Mozzarella 60g, Sauce 40g + BBQ sauce',
  image_slug:'chicken-smokey-joe',
  portioning_note:'Non-veg regular pizza standard portioning.',
  agent_tip:'Chicken not cooked through = Raw/Uncooked [Maker]. Check if complaint is about smoky taste vs actual rawness.'
},
{
  id:'m011', brand:'mojo', category:'Non-Veg Pizzas', name:'Non-Veg & Non-Veg Half & Half (Big 10")',
  veg:false, mrp:349,
  desc:'Pick half each of any 2 Non-Veg Pizzas — make 1 big 10" Pizza. Serves 2-3.',
  ingredients:['Big 10" Pizza Base','2 different non-veg toppings across halves','Mozzarella 120g','Chicken on both halves'],
  portion:'Big 10" — Mozzarella 120g, Sauce 80g',
  image_slug:'nonveg-nonveg-half-half',
  portioning_note:'H&H standard portioning for big pizza.',
  agent_tip:'VegNonVeg confusion here would require image proof. Pizza_H&HMistakes if wrong toppings on wrong half.'
},
{
  id:'m012', brand:'mojo', category:'Non-Veg Pizzas', name:'Veg & Non-Veg Half & Half (Big 10")',
  veg:false, mrp:329,
  desc:'Veg & Non-Veg? BOTH! Pick half each of a Veg & a Non-Veg Pizza.',
  ingredients:['Big 10" Pizza Base','Veg toppings on one half','Chicken/Non-veg toppings on other half','Mozzarella 120g shared'],
  portion:'Big 10" — Mozzarella 120g, Sauce 80g',
  image_slug:'veg-nonveg-half-half',
  portioning_note:'H&H mixed. Cheese shared across pizza.',
  agent_tip:'⚠️ HIGH RISK: VegNonVeg cross-contamination complaint here = VegNonVeg [Maker1000][Manager1000]. Image required. Max ₹500 or specific product amt.'
},

// ══════════════════════════════════════════════
// MOJO PIZZA — SIDES & EXTRAS
// ══════════════════════════════════════════════
{
  id:'m020', brand:'mojo', category:'Sides', name:'Classic Garlic Breadsticks',
  veg:true, mrp:99,
  desc:'Crispy garlic breadsticks with herb butter. Perfect side with any pizza.',
  ingredients:['Bread dough','Garlic butter','Mixed herbs','Mozzarella topping'],
  portion:'4-5 breadsticks per portion',
  image_slug:'garlic-breadsticks',
  portioning_note:'SGBS_GBS tag applies for quality issues with garlic bread.',
  agent_tip:'SGBS = Stuffed Garlic Bread/Sliders. Quality = SGBS_GBS [Maker300]. Wrong type = SGBS_Wrong [Maker][Router].'
},
{
  id:'m021', brand:'mojo', category:'Sides', name:'Chicken Wings (6 pcs) — MOJO',
  veg:false, mrp:179,
  desc:'Crispy, flavour-packed chicken wings. Available in Peri Peri / BBQ / Classic.',
  ingredients:['Chicken Wings 6 pcs','Marinade (choice of flavour)','Dipping sauce'],
  portion:'6 pieces · 40g marination',
  image_slug:'mojo-chicken-wings',
  portioning_note:'Same portioning as BOX8: 6pc = 40g marination.',
  agent_tip:'Cold wings = ColdFood tag. Undercooked = Raw/Uncooked. Less than 6 pieces = LessQuantity.'
},
{
  id:'m022', brand:'mojo', category:'Sides', name:'Choco Lava Cake — MOJO',
  veg:true, mrp:79,
  desc:'Warm molten chocolate lava cake. Same classic dessert as BOX8.',
  ingredients:['Dark Chocolate','Butter','Eggs/substitute','Flour','Sugar'],
  portion:'1 piece ~80g',
  image_slug:'mojo-choco-lava',
  portioning_note:'No lava = ChocoLava [Maker300] tag.',
  agent_tip:'ChocoLava refund = ₹50 or ₹80 credits. Not stale/raw — just no molten centre issue.'
},

// ══════════════════════════════════════════════
// MOJO PIZZA — COMBOS
// ══════════════════════════════════════════════
{
  id:'m030', brand:'mojo', category:'Combos', name:'Pack of 2 Pizzas @ ₹299',
  veg:true, mrp:299,
  desc:'Pick any 2 Value Pizzas at a steal deal. Irresistible in every way!',
  ingredients:['2 x Regular 7" Value Pizzas (choice of flavour)'],
  portion:'2 x Regular 7" pizzas — standard portioning each',
  image_slug:'pack-of-2-pizzas',
  portioning_note:'Combo — 2 individual pizzas packaged together.',
  agent_tip:'If one pizza is wrong = WrongProduct_SameCategory_SingleOrder [Router][DM] — 50% of that pizza value in credits.'
},

// ══════════════════════════════════════════════
// LEANCRUST PIZZA
// ══════════════════════════════════════════════
{
  id:'l001', brand:'leancrust', category:'Veg Pizzas', name:'Classic Margherita Thin Crust (Regular 7")',
  veg:true, mrp:149,
  desc:'The OG thin crust Margherita — tomato sauce, mozzarella, fresh basil. Light and crispy.',
  ingredients:['Thin Crust Base','Tomato Sauce 40g','Mozzarella Cheese 60g','Fresh Basil'],
  portion:'Regular 7" thin crust — Mozzarella 60g, Sauce 40g',
  image_slug:'leancrust-margherita',
  portioning_note:'LeanCrust = thin crust base. ThinCrustBase [Maker300] tag if base issue.',
  agent_tip:'ThinCrustBase = base quality issue. Pizza_WrongBase_ThinCrust = if wrong base delivered. 50% of product in credits for wrong base.'
},
{
  id:'l002', brand:'leancrust', category:'Non-Veg Pizzas', name:'Chicken Tikka Thin Crust (Regular 7")',
  veg:false, mrp:189,
  desc:'Tender chicken tikka on crispy thin crust with mozzarella and tandoori sauce.',
  ingredients:['Thin Crust Base','Tandoori Sauce','Mozzarella 60g','Chicken Tikka pieces'],
  portion:'Regular 7" — standard thin crust portioning',
  image_slug:'leancrust-chicken-tikka',
  portioning_note:'Thin crust standard portioning.',
  agent_tip:'Thin crust is thinner by design. If CX says "base is too thin/crispy" — explain product design. Not a quality defect.'
},
{
  id:'l003', brand:'leancrust', category:'Veg Pizzas', name:'Cheese Blast Thin Crust (Regular 7")',
  veg:true, mrp:199,
  desc:'Cheese-filled crust with mozzarella topping. The cheesiest thin crust pizza.',
  ingredients:['Thin Crust Base with Cheese-stuffed border','Tomato Sauce 40g','Mozzarella 60g','Cheese-filled crust'],
  portion:'Regular 7" — cheese in crust border + standard cheese on top',
  image_slug:'cheese-blast-thin-crust',
  portioning_note:'⚠️ Cheese Blast uncooked = Raw/Uncooked [Maker] NOT PanTossedBase/ThinCrustBase.',
  agent_tip:'CRITICAL: If Cheese Blast is uncooked/raw — use Raw/Uncooked [Maker] tag. NOT base tags. Less cheese = Less/NoCheeseBlast [Maker].'
},

// ══════════════════════════════════════════════
// ITMINAAN — MATKA BIRYANI
// ══════════════════════════════════════════════
{
  id:'i001', brand:'itminaan', category:'Matka Biryani', name:'Chicken Matka Biryani',
  veg:false, mrp:249,
  desc:'Slow-cooked in authentic Dum-Pukht style, served in an earthen matka. Aromatic & flavourful.',
  ingredients:['Boneless Chicken (dum marinated)','Basmati Rice','Whole Spices (clove, cardamom, star anise, bay leaf)','Saffron Water','Caramelised Onions (birista)','Fresh Mint','Dahi Raita'],
  portion:'Full matka (~400g biryani) + Raita',
  image_slug:'itminaan-chicken-matka',
  portioning_note:'⚠️ ColdItminaan [Maker300] = ONLY matka biryani cold. NOT for starters/sides cold.',
  agent_tip:'CRITICAL: Cold Itminaan biryani = ColdItminaan [Maker300]. Cold starters at Itminaan = ColdFood [Manager400]. DO NOT confuse.'
},
{
  id:'i002', brand:'itminaan', category:'Matka Biryani', name:'Veg Matka Biryani',
  veg:true, mrp:219,
  desc:'Slow-cooked veg dum biryani in earthen matka — vegetables and paneer in fragrant rice.',
  ingredients:['Mixed Vegetables (potato, carrot, beans)','Paneer','Basmati Rice','Whole Spices','Saffron','Birista','Mint','Raita'],
  portion:'Full matka (~400g) + Raita',
  image_slug:'itminaan-veg-matka',
  portioning_note:'Raita included. Raita missing = Raita_Missing tag.',
  agent_tip:'Same ColdItminaan rule: only matka biryani cold = ColdItminaan tag. Raita missing = Raita_Missing refund.'
},
{
  id:'i003', brand:'itminaan', category:'Matka Biryani', name:'Mutton Matka Biryani',
  veg:false, mrp:299,
  desc:'Slow-dum-cooked mutton biryani in matka — tender mutton with whole spices.',
  ingredients:['Bone-in Mutton pieces (dum cooked)','Basmati Rice','Whole Spices','Saffron','Birista','Mint','Dahi Raita'],
  portion:'Full matka (~420g) + Raita',
  image_slug:'itminaan-mutton-matka',
  portioning_note:'Premium item. Cold = ColdItminaan.',
  agent_tip:'Most expensive biryani item. High-stakes complaint. Handle with care. Cold = ColdItminaan [Maker300].'
},

// ══════════════════════════════════════════════
// NH1 BOWLS — BIRYANI
// ══════════════════════════════════════════════
{
  id:'n001', brand:'nh1', category:'Biryani Bowls', name:'Chicken Biryani Bowl',
  veg:false, mrp:199,
  desc:"India's Most Flavourful Biryani — highway-style chicken biryani with raita.",
  ingredients:['Chicken pieces (bone-in/boneless, marinated)','Basmati Rice','Highway Biryani Masala','Birista','Mint','Saffron colour','Dahi Raita'],
  portion:'Full biryani bowl + Raita',
  image_slug:'nh1-chicken-biryani',
  portioning_note:'Standard biryani. Raita included.',
  agent_tip:'Different from Itminaan (no matka). NH1 = highway style. Cold = ColdFood tag (not ColdItminaan).'
},
{
  id:'n002', brand:'nh1', category:'Biryani Bowls', name:'Mutton Biryani Bowl',
  veg:false, mrp:259,
  desc:'Rich mutton biryani with tender mutton pieces cooked in highway-style masala.',
  ingredients:['Mutton pieces (bone-in)','Basmati Rice','NH1 Biryani Masala','Birista','Mint','Raita'],
  portion:'Full biryani bowl + Raita',
  image_slug:'nh1-mutton-biryani',
  portioning_note:'Premium non-veg. Raita included.',
  agent_tip:'NH1 mutton vs Itminaan mutton — different style, different price. Clarify brand if CX is confused.'
},
{
  id:'n003', brand:'nh1', category:'Biryani Bowls', name:'Veg Biryani Bowl',
  veg:true, mrp:169,
  desc:'Flavourful vegetable biryani with highway-style spices.',
  ingredients:['Mixed Vegetables','Basmati Rice','Biryani Masala','Birista','Mint','Raita'],
  portion:'Full bowl + Raita',
  image_slug:'nh1-veg-biryani',
  portioning_note:'Standard. Raita included.',
  agent_tip:'If biryani dessert is wrong = BiryaniDessert_Wrong [Router][DM] — ₹50 fixed refund.'
},

// ══════════════════════════════════════════════
// WEFIT — PROTEIN MEALS
// ══════════════════════════════════════════════
{
  id:'w001', brand:'wefit', category:'Protein Bowls', name:'High Protein Chicken Bowl',
  veg:false, mrp:299,
  desc:'Grilled chicken breast with quinoa/brown rice, roasted vegetables. Up to 45g protein.',
  ingredients:['Grilled Chicken Breast (~180g)','Quinoa or Brown Rice','Roasted Broccoli, Capsicum, Zucchini','Olive Oil','Herbs & Seasoning'],
  portion:'~500g total · Chicken 180g · Grains 150g · Veggies 170g',
  image_slug:'wefit-chicken-bowl',
  portioning_note:'High-protein item. Customer base is health-conscious — very aware of quantities.',
  agent_tip:'WeFit CX is very quality-conscious. Less quantity complaints are common. LessQuantity [Maker] — ₹50/100/150 credits.'
},
{
  id:'w002', brand:'wefit', category:'Protein Bowls', name:'Paneer Protein Bowl',
  veg:true, mrp:269,
  desc:'Paneer cubes with quinoa, roasted vegetables. Up to 35g protein.',
  ingredients:['Paneer cubes (~150g)','Quinoa or Brown Rice','Roasted Vegetables','Olive Oil','Herbs'],
  portion:'~450g total · Paneer 150g · Grains 150g · Veggies 150g',
  image_slug:'wefit-paneer-bowl',
  portioning_note:'Protein-focused. Same tags as regular paneer issues.',
  agent_tip:'WeFit customers are premium. Handle complaints with care. Protein count is marketing claim — not directly verifiable.'
},
{
  id:'w003', brand:'wefit', category:'Salads', name:'Greek Salad',
  veg:true, mrp:199,
  desc:'Classic Greek salad with cucumber, tomato, olives, feta, herbs, olive oil.',
  ingredients:['Cucumber','Tomato','Red Onion','Kalamata Olives','Feta Cheese','Oregano','Olive Oil','Lemon'],
  portion:'~300g salad',
  image_slug:'wefit-greek-salad',
  portioning_note:'Cold item. Should be served chilled.',
  agent_tip:'CX says salad is warm/not fresh — ColdFood tag could apply. Missing feta = Wrong Add-on/Ingredient_Missing.'
},

// ══════════════════════════════════════════════
// MEALFUL ROLLS — BIG ROLLS
// ══════════════════════════════════════════════
{
  id:'r001', brand:'mealful', category:'Veg Rolls', name:'Paneer Tikka Mealful Roll',
  veg:true, mrp:169,
  desc:"India's Biggest Rolls — paneer tikka in a 9-inch roll with veggies and sauce.",
  ingredients:['Grilled Paneer Tikka','9-inch Whole Wheat Roll Base','Onion','Capsicum','Lettuce','Mint Chutney','Tikka Sauce'],
  portion:'1 x 9-inch big roll (~320g)',
  image_slug:'mealful-paneer-tikka-roll',
  portioning_note:'Wrap portioning standard. 9-inch base. Quality = Wrap [Maker300].',
  agent_tip:'Wrong base type = Wrap_WrongBase. Quality issue = Wrap [Maker300]. ₹100/₹200 credits.'
},
{
  id:'r002', brand:'mealful', category:'Non-Veg Rolls', name:'Chicken Tikka Mealful Roll',
  veg:false, mrp:189,
  desc:'Grilled chicken tikka in a big 9-inch roll — full meal in one roll.',
  ingredients:['Grilled Chicken Tikka pieces','9-inch Whole Wheat Roll','Onion','Capsicum','Lettuce','Mint Chutney'],
  portion:'1 x 9-inch big roll (~350g)',
  image_slug:'mealful-chicken-tikka-roll',
  portioning_note:'Non-veg roll standard.',
  agent_tip:'Undercooked chicken = Raw/Uncooked [Maker]. Wrong base = Wrap_WrongBase.'
},
{
  id:'r003', brand:'mealful', category:'Non-Veg Rolls', name:'Egg Roll',
  veg:false, mrp:149,
  desc:'Classic egg roll in a soft base — egg, onion, capsicum, spice.',
  ingredients:['Egg (full egg)','Soft Roll Base','Onion','Capsicum','Green Chutney','Sauces'],
  portion:'1 roll (~280g)',
  image_slug:'mealful-egg-roll',
  portioning_note:'Standard roll. Egg-based item.',
  agent_tip:'Egg not cooked = Raw/Uncooked. Missing egg = Ingredient_Missing/LessQuantity.'
},

// ══════════════════════════════════════════════
// HOLA PASTA
// ══════════════════════════════════════════════
{
  id:'h001', brand:'hola', category:'Pasta', name:'Arrabbiata Pasta',
  veg:true, mrp:219,
  desc:'Classic Italian spicy tomato sauce pasta — penne with arrabbiata, garlic, chilli.',
  ingredients:['Penne Pasta','Arrabbiata Sauce (tomato, garlic, red chilli, olive oil)','Parmesan / Cheese topping','Fresh Basil'],
  portion:'~350g pasta',
  image_slug:'hola-arrabbiata',
  portioning_note:'Pasta portioning from Mojo/LC portioning sheet — Pasta/Value section.',
  agent_tip:'Sauce quantity complaints = Salty/Spicy/Tasteless tag. Undercooked pasta = Raw/Uncooked [Maker].'
},
{
  id:'h002', brand:'hola', category:'Pasta', name:'Pesto Pasta',
  veg:true, mrp:239,
  desc:'Fresh basil pesto with penne pasta — gourmet Italian style.',
  ingredients:['Penne Pasta','Basil Pesto (basil, pine nuts, parmesan, olive oil, garlic)','Cherry Tomatoes','Parmesan'],
  portion:'~350g pasta',
  image_slug:'hola-pesto',
  portioning_note:'Pesto is a premium sauce. Less sauce = LessQuantity.',
  agent_tip:'Pesto pasta is a premium item. If sauce seems less — CX expectation may be different. LessQuantity if genuinely less.'
},
{
  id:'h003', brand:'hola', category:'Pasta', name:'Chicken Alfredo Pasta',
  veg:false, mrp:269,
  desc:'Creamy white sauce pasta with grilled chicken — classic Italian-American comfort.',
  ingredients:['Penne Pasta','Alfredo Sauce (cream, butter, parmesan, garlic)','Grilled Chicken pieces','Parmesan garnish'],
  portion:'~380g pasta with chicken',
  image_slug:'hola-chicken-alfredo',
  portioning_note:'Cream-based sauce. Serve hot.',
  agent_tip:'White sauce cold = ColdFood tag. Chicken undercooked = Raw/Uncooked. Less chicken = LessQuantity.'
}
]; // end ME_ITEMS

export function mePassPrice(mrp) {
  return Math.ceil(mrp * (1 - ME_PASS_DISCOUNT));
}

export function meImgUrl(slug) {
  return `https://assets.box8.co.in/box8/items/${slug}.jpg`;
}
