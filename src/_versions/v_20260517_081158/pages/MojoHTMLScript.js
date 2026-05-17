/* eslint-disable no-unused-vars */
// ═══════════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════════
function showSection(id) {
  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
  document.getElementById('sec-' + id).classList.add('active');
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
  event.currentTarget.classList.add('active');
  window.scrollTo(0,0);
}

function showPizzaBrand(btn, brand) {
  document.querySelectorAll('#sec-pizzas .cat-chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('pizza-brand-mojo').style.display = brand==='mojo' ? 'block' : 'none';
  document.getElementById('pizza-brand-zulu').style.display = brand==='zulu' ? 'block' : 'none';
}

// ═══════════════════════════════════════════════════════
// SANDWICH DATA (from PDF Page 7)
// ═══════════════════════════════════════════════════════
const SW_DATA = [
  {n:1, fill:'Aloo', cat:'classic', catN:'1 Classic', boom:'Classic Tandoori Aloo', box8:'Aloo Chaat Agra Style... wait', b8correct:'Aloo + Tikka MM', wf:'-', mojo:'-', top:'Aloo + Tikka MM 80g (67+13)', sauceTop:'Garlic Yogurt 40g', salad:'Sandwich Salad 50g', sauceBot:'Green Chutney 20g'},
  {n:1, fill:'Aloo', cat:'classic', catN:'1 Classic', boom:'Classic Tandoori Aloo', box8:'(Aloo + Tikka MM)', wf:'-', mojo:'-', top:'Aloo + Tikka MM 80g (67+13)', sauceTop:'Garlic Yogurt 40g', salad:'Sandwich Salad 50g', sauceBot:'Green Chutney 20g'},
  {n:2, fill:'Aloo', cat:'classic', catN:'1 Classic', boom:'Classic Aloo Chaat', box8:'Agra Chaat Style', wf:'-', mojo:'-', top:'Aloo + Tikka MM 80g (67+13)', sauceTop:'Imli 20g + Garlic Yogurt 40g', salad:'Sandwich Salad 50g', sauceBot:'Green Chutney 20g'},
  {n:3, fill:'Veggies', cat:'classic', catN:'1 Classic', boom:'Classic Veggie Delight', box8:'-', wf:'Veggie Goodness Classic Veggie', mojo:'-', top:'Red/Yellow + Olives + Jalapeños 30+10+10g', sauceTop:'Garlic Yogurt 40g', salad:'Sandwich Salad 50g', sauceBot:'Green Chutney 20g'},
  {n:4, fill:'Tikki', cat:'classic', catN:'1 Classic', boom:'Classic Bombay Tikki', box8:'Aloo Tikki', wf:'-', mojo:'-', top:'Tikki 80g', sauceTop:'Garlic Yogurt 40g', salad:'Sandwich Salad 50g', sauceBot:'Green Chutney 20g'},
  {n:5, fill:'Tikki', cat:'classic', catN:'1 Classic', boom:'Classic Tikki Chaat', box8:'-', wf:'-', mojo:'-', top:'Tikki 80g', sauceTop:'Imli 20g + Garlic Yogurt 40g', salad:'Sandwich Salad 50g', sauceBot:'Green Chutney 20g'},
  {n:6, fill:'Paneer', cat:'classic', catN:'1 Classic', boom:'Classic Paneer Tikka', box8:'Paneer Tikka', wf:'Grilled Paneer Power', mojo:'Paneer Tikka', top:'Paneer Tikka 80g', sauceTop:'Garlic Yogurt 40g', salad:'Sandwich Salad 50g', sauceBot:'Green Chutney 20g'},
  {n:7, fill:'Paneer', cat:'classic', catN:'1 Classic', boom:'Classic Paneer Makhani', box8:'Paneer Makhani', wf:'-', mojo:'-', top:'Paneer Tikka 80g', sauceTop:'Orange Gravy 40g', salad:'Sandwich Salad 50g', sauceBot:'Orange Gravy 20g'},
  {n:8, fill:'Chicken', cat:'classic', catN:'1 Classic', boom:'Classic Chicken Tikka', box8:'Chicken Tikka', wf:'Grilled Chicken Power', mojo:'Chicken Tikka', top:'Red Chicken 80g', sauceTop:'Garlic Yogurt 40g', salad:'Sandwich Salad 50g', sauceBot:'Green Chutney 20g'},
  {n:9, fill:'Chicken', cat:'classic', catN:'1 Classic', boom:'Classic Butter Chicken', box8:'Butter Chicken', wf:'-', mojo:'-', top:'Red Chicken 80g', sauceTop:'Orange Gravy 40g', salad:'Sandwich Salad 50g', sauceBot:'Orange Gravy 20g'},
  {n:10, fill:'Mutton', cat:'classic', catN:'1 Classic', boom:'Classic Mutton Masala', box8:'-', wf:'-', mojo:'-', top:'Mutton 80g', sauceTop:'Garlic Yogurt 40g', salad:'Sandwich Salad 50g', sauceBot:'Green Chutney 20g'},
  {n:11, fill:'Aloo', cat:'spicy', catN:'2 Spicy', boom:'Spicy Aloo', box8:'-', wf:'-', mojo:'-', top:'Aloo + Tikka MM 80g (67+13)', sauceTop:'Mayo Sauce 40g', salad:'Sandwich Salad 50g + Jalapeños 10g', sauceBot:'Green Chutney 20g'},
  {n:12, fill:'Tikki', cat:'spicy', catN:'2 Spicy', boom:'Spicy Veg Patty', box8:'Spicy Aloo Patty', wf:'-', mojo:'-', top:'Tikki 80g', sauceTop:'Mayo Sauce 40g', salad:'Sandwich Salad 50g + Jalapeños 10g', sauceBot:'Green Chutney 20g'},
  {n:13, fill:'Mushroom', cat:'spicy', catN:'2 Spicy', boom:'Spicy Mushroom', box8:'-', wf:'-', mojo:'-', top:'Mushroom 80g', sauceTop:'Mayo Sauce 40g', salad:'Sandwich Salad 50g + Jalapeños 10g', sauceBot:'Green Chutney 20g'},
  {n:14, fill:'Paneer', cat:'spicy', catN:'2 Spicy', boom:'Spicy Paneer', box8:'-', wf:'Peri Peri Paneer', mojo:'Paneer Peri Peri', top:'Paneer Peri Peri 80g', sauceTop:'Mayo Sauce 40g', salad:'Sandwich Salad 50g + Jalapeños 10g', sauceBot:'Green Chutney 20g'},
  {n:15, fill:'Chicken', cat:'spicy', catN:'2 Spicy', boom:'Spicy Chicken', box8:'-', wf:'Peri Peri Chicken', mojo:'-', top:'Red Chicken 80g', sauceTop:'Mayo Sauce 40g', salad:'Sandwich Salad 50g + Jalapeños 10g', sauceBot:'Green Chutney 20g'},
  {n:16, fill:'Aloo', cat:'cheeseburst', catN:'3 Cheese Burst', boom:'Aloo Cheeseburst', box8:'Cheese Melt', wf:'-', mojo:'-', top:'Aloo + Tikka MM 80g (67+13)', sauceTop:'Filler Cheese 40g', salad:'Sandwich Salad 50g', sauceBot:'Green Chutney 20g'},
  {n:17, fill:'Paneer', cat:'cheeseburst', catN:'3 Cheese Burst', boom:'Classic Paneer Cheeseburst', box8:'Cheesy Paneer', wf:'-', mojo:'-', top:'Paneer Tikka 80g', sauceTop:'Filler Cheese 40g', salad:'Sandwich Salad 50g', sauceBot:'Green Chutney 20g'},
  {n:18, fill:'Paneer', cat:'cheeseburst', catN:'3 Cheese Burst', boom:'Pizza Paneer Cheeseburst', box8:'Paneer Pizza Cheeseburst', wf:'-', mojo:'-', top:'Paneer Peri Peri 80g', sauceTop:'Filler Cheese 40g', salad:'SW Salad 20g + Red/Yellow 20g + Olives 10g', sauceBot:'Pizza Sauce 20g'},
  {n:19, fill:'Chicken', cat:'cheeseburst', catN:'3 Cheese Burst', boom:'Classic Chicken Cheeseburst', box8:'Cheesy Chicken', wf:'Chicken Pizza Cheeseburst', mojo:'-', top:'Red Chicken 80g', sauceTop:'Filler Cheese 40g', salad:'Sandwich Salad 50g', sauceBot:'Green Chutney 20g'},
  {n:20, fill:'Chicken', cat:'cheeseburst', catN:'3 Cheese Burst', boom:'Pizza Chicken Cheeseburst', box8:'-', wf:'-', mojo:'-', top:'Plain Chicken 80g', sauceTop:'Filler Cheese 40g', salad:'SW Salad 20g + Red/Yellow 20g + Olives 10g', sauceBot:'Pizza Sauce 20g'},
  {n:21, fill:'Paneer', cat:'overload', catN:'5 2X Overload', boom:'Double Paneer', box8:'Double Paneer Tikka', wf:'Overload Paneer', mojo:'Mighty Paneer', top:'Paneer Tikka 120g', sauceTop:'Garlic Yogurt 40g', salad:'Sandwich Salad 50g', sauceBot:'Green Chutney 20g'},
  {n:22, fill:'Chicken', cat:'overload', catN:'5 2X Overload', boom:'Double Chicken', box8:'Double Chicken Tikka', wf:'Overload Chicken', mojo:'Mighty', top:'Red Chicken 80g + Plain Chicken 40g', sauceTop:'Garlic Yogurt 40g', salad:'Sandwich Salad 50g', sauceBot:'Green Chutney 20g'},
  {n:23, fill:'Mushroom', cat:'gourmet', catN:'4 Gourmet', boom:'Mushrooms, Pesto & Cheese', box8:'-', wf:'-', mojo:'-', top:'Mushroom 80g', sauceTop:'Pesto 20g + Mozzarella 40g', salad:'SW Salad 20g + Red/Yellow 20g + Olives 10g', sauceBot:'Pesto 20g'},
  {n:24, fill:'Paneer', cat:'gourmet', catN:'4 Gourmet', boom:'Paneer, Pesto & Cheese', box8:'-', wf:'-', mojo:'-', top:'Paneer Peri Peri 80g', sauceTop:'Pesto 20g + Mozzarella 40g', salad:'SW Salad 20g + Red/Yellow 20g + Olives 10g', sauceBot:'Pesto 20g'},
  {n:25, fill:'Chicken', cat:'gourmet', catN:'4 Gourmet', boom:'Chicken, Pesto & Cheese', box8:'-', wf:'-', mojo:'-', top:'Plain Chicken 80g', sauceTop:'Pesto 20g + Mozzarella 40g', salad:'SW Salad 20g + Red/Yellow 20g + Olives 10g', sauceBot:'Pesto 20g'},
];

function renderSW(data) {
  const isNV = ['Chicken','Mutton'].includes;
  const tbody = document.getElementById('sw-tbody');
  tbody.innerHTML = data.map(r => {
    const isNvFill = r.fill==='Chicken'||r.fill==='Mutton';
    const rowClass = isNvFill ? 'nv-row' : 'veg-row';
    return `<tr class="${rowClass}">
      <td>${r.n}</td>
      <td>${r.fill}</td>
      <td><span style="background:rgba(255,87,34,0.15);color:var(--ec-orange);padding:2px 8px;border-radius:10px;font-size:11px;">${r.catN}</span></td>
      <td style="font-size:12px;">${r.boom||'—'}</td>
      <td style="font-size:12px;">${r.box8||'—'}</td>
      <td style="font-size:12px;">${r.wf||'—'}</td>
      <td style="font-size:12px;">${r.mojo||'—'}</td>
      <td class="gram" style="font-size:12px;">${r.top}</td>
      <td class="gram" style="font-size:12px;">${r.sauceTop}</td>
      <td class="gram" style="font-size:12px;">${r.salad}</td>
      <td class="gram" style="font-size:12px;">${r.sauceBot}</td>
    </tr>`;
  }).join('');
}

function filterSW(btn, cat) {
  document.querySelectorAll('#sec-sandwiches .cat-chip').forEach(c=>c.classList.remove('active'));
  btn.classList.add('active');
  renderSW(cat==='all' ? SW_DATA : SW_DATA.filter(r=>r.cat===cat));
}

// ═══════════════════════════════════════════════════════
// PASTA DATA (from PDF Pages 8-9)
// ═══════════════════════════════════════════════════════
const PASTA_DATA = [
  // White Sauce
  {name:'Classic Alfredo Pasta', sauce:'white', sauceN:'White Sauce', sauceAmt:'300g', veg:'-', nv:'-'},
  {name:'Red & Yellow Pepper Alfredo Pasta', sauce:'white', sauceN:'White Sauce', sauceAmt:'300g', veg:'Red + Yellow Capsicum 25+25g', nv:'-'},
  {name:'Olive & Mushroom Alfredo Pasta', sauce:'white', sauceN:'White Sauce', sauceAmt:'300g', veg:'Olive 15g + Mushroom 25g', nv:'-'},
  {name:'Cheesy Chicken Alfredo Pasta', sauce:'white', sauceN:'White Sauce', sauceAmt:'300g', veg:'-', nv:'Herb Chicken 80g'},
  {name:'Chicken Bell-Peppers Alfredo Pasta', sauce:'white', sauceN:'White Sauce', sauceAmt:'300g', veg:'Red + Yellow Capsicum 25+25g', nv:'Herb Chicken 80g'},
  {name:'Creamy Chicken Mushroom Pasta', sauce:'white', sauceN:'White Sauce', sauceAmt:'300g', veg:'Olive 15g + Mushroom 25g', nv:'Herb Chicken 80g'},
  // Red Sauce
  {name:'Original Arrabiata Pasta', sauce:'red', sauceN:'Red Sauce', sauceAmt:'300g', veg:'-', nv:'-'},
  {name:'Colored Peppers Arrabiata Pasta', sauce:'red', sauceN:'Red Sauce', sauceAmt:'300g', veg:'Red + Yellow Capsicum 25+25g', nv:'-'},
  {name:'Mushroom Olive Arrabiata Pasta', sauce:'red', sauceN:'Red Sauce', sauceAmt:'300g', veg:'Olive 15g + Mushroom 25g', nv:'-'},
  {name:'Herb Chicken Arrabiata Pasta', sauce:'red', sauceN:'Red Sauce', sauceAmt:'300g', veg:'-', nv:'Herb Chicken 80g'},
  {name:'Chicken & Peppers Arrabiata Pasta', sauce:'red', sauceN:'Red Sauce', sauceAmt:'300g', veg:'Red + Yellow Capsicum 25+25g', nv:'Herb Chicken 80g'},
  {name:'Chicken & Mushroom Arrabiata Pasta', sauce:'red', sauceN:'Red Sauce', sauceAmt:'300g', veg:'Olive 15g + Mushroom 25g', nv:'Herb Chicken 80g'},
  // Pink Sauce
  {name:'Signature Mixed Pink Pasta', sauce:'pink', sauceN:'White + Red Sauce', sauceAmt:'150+150g', veg:'-', nv:'-'},
  {name:'Bell-Peppers Mixed Pink Pasta', sauce:'pink', sauceN:'White + Red Sauce', sauceAmt:'150+150g', veg:'Red + Yellow Capsicum 25+25g', nv:'-'},
  {name:'Olive & Shroom Pink Pasta', sauce:'pink', sauceN:'White + Red Sauce', sauceAmt:'150+150g', veg:'Olive 15g + Mushroom 25g', nv:'-'},
  {name:'Chicken Mixed Pink Pasta', sauce:'pink', sauceN:'White + Red Sauce', sauceAmt:'150+150g', veg:'-', nv:'Herb Chicken 80g'},
  {name:'Chicken Bell-Peppers Pink Pasta', sauce:'pink', sauceN:'White + Red Sauce', sauceAmt:'150+150g', veg:'Red + Yellow Capsicum 25+25g', nv:'Herb Chicken 80g'},
  {name:'Chicken & Shroom Pink Pasta', sauce:'pink', sauceN:'White + Red Sauce', sauceAmt:'150+150g', veg:'Olive 15g + Mushroom 25g', nv:'Herb Chicken 80g'},
  // Orange Gravy
  {name:'Makhni Fusion Indi Pasta', sauce:'orange', sauceN:'Orange Gravy', sauceAmt:'300g', veg:'-', nv:'-'},
  {name:'Paneer Makhni Indi Pasta', sauce:'orange', sauceN:'Orange Gravy', sauceAmt:'300g', veg:'Tikka Paneer (Mojo) 80g', nv:'-'},
  {name:'Butter Chicken Indi Pasta', sauce:'orange', sauceN:'Orange Gravy', sauceAmt:'300g', veg:'-', nv:'Herb Chicken 80g'},
  // Pesto
  {name:'Classic Pesto Pasta', sauce:'pesto', sauceN:'White + Pesto Sauce', sauceAmt:'230+70g', veg:'-', nv:'-'},
  {name:'Red & Yellow Pepper Pesto Pasta', sauce:'pesto', sauceN:'White + Pesto Sauce', sauceAmt:'230+70g', veg:'Red + Yellow Capsicum 25+25g', nv:'-'},
  {name:'Olive & Mushroom Pesto Pasta', sauce:'pesto', sauceN:'White + Pesto Sauce', sauceAmt:'230+70g', veg:'Olive 15g + Mushroom 25g', nv:'-'},
  {name:'Cheesy Chicken Pesto Pasta', sauce:'pesto', sauceN:'White + Pesto Sauce', sauceAmt:'230+70g', veg:'-', nv:'Herb Chicken 80g'},
  {name:'Chicken Bell-Peppers Pesto Pasta', sauce:'pesto', sauceN:'White + Pesto Sauce', sauceAmt:'230+70g', veg:'Red + Yellow Capsicum 25+25g', nv:'Herb Chicken 80g'},
  {name:'Pesto Chicken Mushroom Pasta', sauce:'pesto', sauceN:'White + Pesto Sauce', sauceAmt:'230+70g', veg:'Olive 15g + Mushroom 25g', nv:'Herb Chicken 80g'},
];

const SAUCE_COLORS = {
  white:'rgba(255,255,255,0.1)', red:'rgba(244,67,54,0.15)',
  pink:'rgba(233,30,99,0.15)', orange:'rgba(255,87,34,0.15)', pesto:'rgba(76,175,80,0.15)'
};

function renderPasta(data) {
  const tbody = document.getElementById('pasta-tbody');
  tbody.innerHTML = data.map(r => {
    const isNV = r.nv && r.nv !== '-';
    const isVeg = r.veg && r.veg !== '-';
    const rowClass = (isNV && !isVeg) ? 'nv-row' : isVeg ? 'veg-row' : '';
    return `<tr class="${rowClass}">
      <td>${r.name}</td>
      <td><span style="background:${SAUCE_COLORS[r.sauce]||''};color:var(--on-surface);padding:3px 10px;border-radius:10px;font-size:12px;">${r.sauceN}</span></td>
      <td class="gram">${r.sauceAmt}</td>
      <td style="font-size:12px;color:var(--veg-green);">${r.veg&&r.veg!=='-'?r.veg:'—'}</td>
      <td style="font-size:12px;color:var(--nv-red);">${r.nv&&r.nv!=='-'?r.nv:'—'}</td>
    </tr>`;
  }).join('');
}

function filterPasta(btn, sauce) {
  document.querySelectorAll('#sec-pastas .cat-chip').forEach(c=>c.classList.remove('active'));
  btn.classList.add('active');
  renderPasta(sauce==='all' ? PASTA_DATA : PASTA_DATA.filter(p=>p.sauce===sauce));
}

// ═══════════════════════════════════════════════════════
// POWER SEARCH
// ═══════════════════════════════════════════════════════
const SEARCH_INDEX = [
  // Sandwich items
  ...SW_DATA.map(r => ({
    section:'sandwiches', sectionN:'🥪 Sandwiches',
    name:`${r.boom||''} / ${r.box8||''} / ${r.wf||''} / ${r.mojo||''}`.replace(/\/-\//g,'').replace(/\s+/g,' ').trim(),
    details:`Filling: ${r.fill} | Cat: ${r.catN} | Topping: ${r.top} | Sauce Top: ${r.sauceTop} | Salad: ${r.salad} | Sauce Bot: ${r.sauceBot}`
  })),
  // Pasta items
  ...PASTA_DATA.map(p => ({
    section:'pastas', sectionN:'🍝 Pastas',
    name: p.name,
    details:`Sauce: ${p.sauceN} ${p.sauceAmt} | Veg: ${p.veg||'—'} | NV: ${p.nv||'—'} | Pasta 140g | Garlic Butter 10g`
  })),
  // Static search items
  {section:'garlic', sectionN:'🍞 Garlic Breadsticks', name:'Classic Garlic Breadsticks + Cheesy Dip', details:'Small Pizza Base | Garlic Butter Before Baking 20g | Garlic Butter After Baking 10g'},
  {section:'garlic', sectionN:'🍞 Garlic Breadsticks', name:'Cheeselicious Garlic Bread + Cheesy Dip', details:'Small Pizza Base | Filler Cheese 30g | Garlic Butter After Baking 10g'},
  {section:'garlic', sectionN:'🍞 Garlic Breadsticks', name:'Mexican Stuffed Garlic Bread + Cheesy Dip', details:'Small Pizza Base | Filler Cheese 30g | Corn 10g | Jalapeños 20g | Veg Sprinkler 2g | Garlic Butter 10g'},
  {section:'garlic', sectionN:'🍞 Garlic Breadsticks', name:'Italian Stuffed Garlic Bread + Cheesy Dip', details:'Small Pizza Base | Filler Cheese 30g | Mushrooms 20g | Olives 10g | Veg Sprinkler 2g | Garlic Butter 10g'},
  {section:'garlic', sectionN:'🍞 Garlic Breadsticks', name:'Paneer Tikka Stuffed Garlic Bread + Cheesy Dip', details:'Small Pizza Base | Filler Cheese 30g | Tikka Paneer 30g | Onions 10g | Garlic Butter 10g'},
  {section:'garlic', sectionN:'🍞 Garlic Breadsticks', name:'Paneer Peri Peri Stuffed Garlic Bread + Cheesy Dip', details:'Small Pizza Base | Mayo Sauce 30g | Peri Peri Paneer 30g | Capsicum 10g | Garlic Butter 10g'},
  {section:'garlic', sectionN:'🍞 Garlic Breadsticks', name:'Mexican Chicken Stuffed Garlic Bread', details:'Small Pizza Base | Filler Cheese 30g | Herbed Chicken 30g | Jalapeños 10g | Garlic Butter 10g'},
  {section:'garlic', sectionN:'🍞 Garlic Breadsticks', name:'Chicken Tikka Stuffed Garlic Bread', details:'Small Pizza Base | Filler Cheese 30g | Tikka Chicken 30g | Onions 10g | Garlic Butter 10g'},
  {section:'garlic', sectionN:'🍞 Garlic Breadsticks', name:'Chicken Peri Peri Stuffed Garlic Bread', details:'Small Pizza Base | Mayo Sauce 30g | Peri Peri Chicken 30g | Capsicum 10g | Garlic Butter 10g'},
  {section:'garlic', sectionN:'🍞 Garlic Breadsticks', name:'Pepperoni Stuffed Garlic Bread', details:'Small Pizza Base | Filler Cheese 30g | Pepperoni 6 pcs | Garlic Butter 10g'},
  {section:'starters', sectionN:'🔥 Starters', name:'Chicken Wings 6 pcs', details:'Tikka/Peri Peri/Herb/BBQ Marination: 40g each | Green Chutney 20g | Mayo Sauce 20g'},
  {section:'starters', sectionN:'🔥 Starters', name:'Boneless Chicken (Raw) 1 packet 200g', details:'Tikka/Peri Peri/Herb/BBQ Marination: 40g each | Green Chutney 20g | Mayo Sauce 20g'},
  {section:'production', sectionN:'⚙️ Production', name:'Chocolava Cake', details:'20 pcs: Premix 1KG + Sunday Oil 400g + RO Water 400g | 40 pcs: Premix 1KG + Sunday Oil 800g + RO Water 800g'},
  {section:'production', sectionN:'⚙️ Production', name:'Pan Tossed Dough 2.5 KG', details:'Water 1400g | Sunday Oil 100+25g | DB Normal 1 packet | Maida 2500g | Pizza Powder 60g | Fat Flakes 100g | Knead 10 mins'},
  {section:'production', sectionN:'⚙️ Production', name:'Pan Tossed Dough 5 KG', details:'Water 2800g | Sunday Oil 200+50g | DB Normal 2 packets | Maida 5000g | Pizza Powder 120g | Fat Flakes 200g | Knead 10 mins'},
  {section:'production', sectionN:'⚙️ Production', name:'Lemonade', details:'10 bottles: Premix 75g + Sugar 250g + Water 3000g | 20 bottles: Premix 150g + Sugar 500g + Water 6000g'},
  {section:'toppings', sectionN:'🧀 Toppings', name:'Extra Toppings Medium (10")', details:'Paneer Tikka 40g | Mushrooms 40g | Black Olives 20g | Jalapeños 20g | Red Paprika 20g | Golden Corn 20g | BBQ/Plain/Tikka/PP Chicken 40g each'},
  {section:'toppings', sectionN:'🧀 Toppings', name:'Extra Toppings Small (7")', details:'Paneer Cubes 20g | Mushrooms 20g | Black Olives 10g | Jalapeños 10g | Red Paprika 10g | Golden Corn 10g | BBQ/Plain/Tikka/PP Chicken 20g each'},
  {section:'value', sectionN:'💰 Value Pizzas', name:'Value Pizza Base', details:'Small Pan Tossed | Pizza Sauce 40g | Filler Cheese 20g | Mozzarella 30g | Topping 20g'},
  {section:'prp', sectionN:'🐔 PRP', name:'Chicken PRP Marination', details:'1KG Chicken: 200g marination | 500g: 100g | 250g: 50g — for Peri Peri / Herb / BBQ / Tikka'},
  {section:'prp', sectionN:'🐔 PRP', name:'Paneer PRP Marination', details:'1KG Paneer: 200g | 500g: 100g | 250g: 50g — for Peri Peri / Tikka'},
  {section:'pizzas', sectionN:'🍕 Pizzas', name:'Mozzarella Cheese Big Pizza (10")', details:'120g for all Big Pizza types including Cheese Blast variants'},
  {section:'pizzas', sectionN:'🍕 Pizzas', name:'Mozzarella Cheese Regular Pizza (7")', details:'60g for all Regular Pizza types including Cheese Blast'},
  {section:'pizzas', sectionN:'🍕 Pizzas', name:'Pizza Sauce Big (10")', details:'100g for all Big Pizza types'},
  {section:'pizzas', sectionN:'🍕 Pizzas', name:'Pizza Sauce Regular (7")', details:'50g for all Regular Pizza types'},
  {section:'pizzas', sectionN:'🍕 Pizzas', name:'Filler Cheese Cheese Blast Big', details:'120g filler for PT/TC Cheese Blast Big | 80g for Chicken Cheese Blast Big'},
  {section:'pizzas', sectionN:'🍕 Pizzas', name:'Filler Cheese Cheese Blast Regular', details:'60g filler for PT/TC Cheese Blast Regular'},
  {section:'pizzas', sectionN:'🍕 Pizzas', name:'Plain Chicken Cheese Blast', details:'100g Plain Chicken for Chicken Cheese Blast (all sizes)'},
];

function runSearch(query) {
  const q = query.trim().toLowerCase();
  const hint = document.getElementById('search-hint');
  const results = document.getElementById('search-results');
  if (!q || q.length < 2) {
    hint.innerHTML = 'Type to search across all portioning charts';
    results.innerHTML = '';
    return;
  }
  const matches = SEARCH_INDEX.filter(item =>
    (item.name+' '+item.details+' '+item.sectionN).toLowerCase().includes(q)
  );
  hint.innerHTML = `Found <strong>${matches.length}</strong> result${matches.length!==1?'s':''} for "<strong>${query}</strong>"`;
  if (!matches.length) {
    results.innerHTML = `<div class="card elevation-1" style="padding:32px;text-align:center;">
      <div style="font-size:48px;margin-bottom:12px;">🔍</div>
      <div style="font-size:18px;font-weight:700;">Nothing found</div>
      <div style="color:var(--on-surface-var);margin-top:8px;">Try: Paneer Tikka, Cheesy Dip, Alfredo, Chocolava…</div>
    </div>`;
    return;
  }
  function hl(text) {
    if (!text || !q) return text || '';
    return text.replace(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')})`, 'gi'),
      '<mark style="background:var(--mojo-red);color:#fff;padding:0 2px;border-radius:2px;">$1</mark>');
  }
  // Group by section
  const groups = {};
  matches.forEach(m => { if(!groups[m.sectionN]) groups[m.sectionN]=[]; groups[m.sectionN].push(m); });
  results.innerHTML = Object.entries(groups).map(([sn, items]) => `
    <div style="margin-bottom:20px;">
      <h3 style="font-size:14px;font-weight:700;color:var(--ec-orange);margin-bottom:10px;">${sn} (${items.length})</h3>
      <div style="display:grid;gap:8px;">
        ${items.map(item => `
          <div class="card elevation-1" style="padding:12px 16px;border-radius:12px;cursor:pointer;"
            onclick="showSection('${item.section}');document.querySelector('.nav-item').classList.remove('active')">
            <div style="font-weight:700;font-size:14px;margin-bottom:4px;">${hl(item.name)}</div>
            <div style="font-size:12px;color:var(--on-surface-var);font-family:'Roboto Mono',monospace;">${hl(item.details)}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

// ═══════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════
renderSW(SW_DATA);
renderPasta(PASTA_DATA);
