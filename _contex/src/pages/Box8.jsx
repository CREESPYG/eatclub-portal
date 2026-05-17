import { useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import DynamicTitle from '../components/DynamicTitle';

const GRAVY_COLORS = {
  'Yellow Dal':'rgba(255,215,0,0.15)','Kadhi + Pakoda':'rgba(255,193,7,0.15)',
  'Rajma':'rgba(180,60,40,0.18)','Chole':'rgba(120,80,40,0.15)','Dal Makhani':'rgba(80,40,20,0.18)',
  'Butter Gravy':'rgba(255,152,0,0.15)','Palak Gravy':'rgba(76,175,80,0.2)','Yellow Gravy':'rgba(255,235,59,0.15)',
  'Orange Gravy':'rgba(255,87,34,0.18)','Chicken Gravy':'rgba(255,160,0,0.15)','Mutton Gravy':'rgba(183,28,28,0.18)',
};

const ALL_IN_ONE = [
  {n:'Dilli Rajma / Homestyle Rajma',t:'veg',g:'Rajma',q:'180g',tops:[]},
  {n:'Amritsari Chole / Punjabi Chole',t:'veg',g:'Chole',q:'180g',tops:[]},
  {n:'Dal Makhani',t:'veg',g:'Dal Makhani',q:'180g',tops:[]},
  {n:'Aloo Matar / Mom Style Aloo Matar',t:'veg',g:'Butter Gravy',q:'110g',tops:['Dum Aloo 3pcs (50-55g)','Matar 20g']},
  {n:'Aloo Palak',t:'veg',g:'Palak Gravy',q:'110g',tops:['Dum Aloo 3pcs (50-55g)']},
  {n:'Banarasi Dum Aloo / Aloo Dum',t:'veg',g:'Butter Gravy',q:'110g',tops:['Dum Aloo 3pcs (50-55g)']},
  {n:'Malai Kofta / Veg Kofta',t:'veg',g:'Yellow Gravy',q:'110g',tops:['Malai Kofta 3pcs']},
  {n:'Subz Kadhai / Mixed Veg',t:'veg',g:'Butter Gravy',q:'110g',tops:['Red Paneer 30g','Mixed Veg 30g','Onion+Capsicum 5+5g']},
  {n:'Subz Handi',t:'veg',g:'Yellow Gravy',q:'110g',tops:['Red Paneer 30g','Mixed Veg 30g','Onion+Capsicum 5+5g']},
  {n:'Mushroom Masala',t:'veg',g:'Butter Gravy',q:'110g',tops:['Cooked Mushroom 60g','Onion 10g']},
  {n:'Matar Paneer / Fam\'s Favorite',t:'veg',g:'Butter Gravy',q:'110g',tops:['Red Paneer 50g','Matar 20g']},
  {n:'Paneer Makhni / Shahi Paneer',t:'veg',g:'Orange Gravy',q:'110g',tops:['Red Paneer 70g']},
  {n:'Paneer Tikka Masala',t:'veg',g:'Butter Gravy',q:'110g',tops:['Red Paneer 70g']},
  {n:'Kadhai Paneer',t:'veg',g:'Butter Gravy',q:'110g',tops:['Red Paneer 60g','Onion+Capsicum 5+5g']},
  {n:'Paneer Lababdar',t:'veg',g:'Yellow Gravy',q:'110g',tops:['Red Paneer 70g']},
  {n:'Mughlai Paneer / Paneer Masala',t:'veg',g:'Yellow Gravy',q:'110g',tops:['Red Paneer 60g','Onion 10g']},
  {n:'Palak Paneer',t:'veg',g:'Palak Gravy',q:'110g',tops:['Red Paneer 70g']},
  {n:'Homestyle Egg Curry',t:'nv',g:'Butter Gravy',q:'110g',tops:['Boiled Eggs 1.5pcs']},
  {n:'Butter Chicken / Shahi Chicken',t:'nv',g:'Orange Gravy',q:'110g',tops:['Red Chicken 70g']},
  {n:'Chicken Tikka Masala / Sunday Chicken',t:'nv',g:'Butter Gravy',q:'110g',tops:['Red Chicken 70g']},
  {n:'Kadhai Chicken',t:'nv',g:'Butter Gravy',q:'110g',tops:['Brown Chicken 60g','Onion+Capsicum 5+5g']},
  {n:'Chicken Lababdar',t:'nv',g:'Yellow Gravy',q:'110g',tops:['Brown Chicken 70g']},
  {n:'Mughlai Chicken',t:'nv',g:'Yellow Gravy',q:'110g',tops:['Red Chicken 60g','Onion 10g']},
  {n:'Homestyle Chicken / Masala Chicken',t:'nv',g:'Chicken Gravy',q:'110g',tops:['Brown Chicken 70g']},
  {n:'Saag Chicken / Saag Wala Chicken',t:'nv',g:'Palak Gravy',q:'110g',tops:['Red Chicken 70g']},
  {n:'Dhaba Style Mutton / Mutton Curry',t:'nv',g:'Mutton Gravy',q:'110g',tops:['Mutton Boti 70g']},
];

const MINI_MEAL = [
  {n:'Homestyle Yellow Dal',t:'veg',g:'Yellow Dal',q:'220g',tops:[]},
  {n:'Kadhi Pakoda',t:'veg',g:'Kadhi + Pakoda',q:'220g',tops:['Pakodas 3pcs']},
  {n:'Dilli Rajma / Homestyle Rajma',t:'veg',g:'Rajma',q:'220g',tops:[]},
  {n:'Amritsari Chole / Punjabi Chole',t:'veg',g:'Chole',q:'220g',tops:[]},
  {n:'Dal Makhni',t:'veg',g:'Dal Makhani',q:'220g',tops:[]},
  {n:'Aloo Matar / Mom Style',t:'veg',g:'Butter Gravy',q:'140g',tops:['Dum Aloo 3pcs (50-55g)','Matar 20g']},
  {n:'Aloo Palak',t:'veg',g:'Palak Gravy',q:'140g',tops:['Aloo 3pcs (50-55g)']},
  {n:'Banarasi Dum Aloo / Aloo Dum',t:'veg',g:'Butter Gravy',q:'140g',tops:['Dum Aloo 3pcs (50-55g)']},
  {n:'Malai Kofta / Veg Kofta',t:'veg',g:'Yellow Gravy',q:'140g',tops:['Malai Kofta 3pcs']},
  {n:'Subz Kadhai / Mixed Veg',t:'veg',g:'Butter Gravy',q:'140g',tops:['Red Paneer 30g','Mixed Veg 30g','Onion+Capsicum 5+5g']},
  {n:'Subz Handi',t:'veg',g:'Yellow Gravy',q:'140g',tops:['Red Paneer 30g','Mixed Veg 30g','Onion+Capsicum 5+5g']},
  {n:'Mushroom Masala',t:'veg',g:'Butter Gravy',q:'140g',tops:['Cooked Mushroom 60g','Onion 10g']},
  {n:'Matar Paneer / Fam\'s Favorite',t:'veg',g:'Butter Gravy',q:'140g',tops:['Red Paneer 50g','Matar 20g']},
  {n:'Paneer Makhni / Shahi Paneer',t:'veg',g:'Orange Gravy',q:'140g',tops:['Red Paneer 70g']},
  {n:'Paneer Tikka Masala / Sunday Paneer',t:'veg',g:'Butter Gravy',q:'140g',tops:['Red Paneer 70g']},
  {n:'Kadhai Paneer',t:'veg',g:'Butter Gravy',q:'140g',tops:['Red Paneer 60g','Onion+Capsicum 5+5g']},
  {n:'Paneer Lababdar',t:'veg',g:'Yellow Gravy',q:'140g',tops:['Red Paneer 70g']},
  {n:'Mughlai Paneer / Paneer Masala',t:'veg',g:'Yellow Gravy',q:'140g',tops:['Red Paneer 60g','Onion 10g']},
  {n:'Palak Paneer',t:'veg',g:'Palak Gravy',q:'140g',tops:['Red Paneer 70g']},
  {n:'Homestyle Egg Curry',t:'nv',g:'Butter Gravy',q:'140g',tops:['Boiled Eggs 1.5pcs']},
  {n:'Butter Chicken / Shahi Chicken',t:'nv',g:'Orange Gravy',q:'140g',tops:['Red Chicken 70g']},
  {n:'Chicken Tikka Masala / Sunday Chicken',t:'nv',g:'Butter Gravy',q:'140g',tops:['Red Chicken 70g']},
  {n:'Kadhai Chicken',t:'nv',g:'Butter Gravy',q:'140g',tops:['Brown Chicken 60g','Onion+Capsicum 5+5g']},
  {n:'Chicken Lababdar',t:'nv',g:'Yellow Gravy',q:'140g',tops:['Brown Chicken 70g']},
  {n:'Mughlai Chicken',t:'nv',g:'Yellow Gravy',q:'140g',tops:['Red Chicken 60g','Onion 10g']},
  {n:'Homestyle Chicken / Masala Chicken',t:'nv',g:'Chicken Gravy',q:'140g',tops:['Brown Chicken 70g']},
  {n:'Saag Chicken',t:'nv',g:'Palak Gravy',q:'140g',tops:['Red Chicken 70g']},
  {n:'Dhaba Style Mutton / Mutton Curry',t:'nv',g:'Mutton Gravy',q:'140g',tops:['Mutton Boti 70g']},
];

const DESI_BOX = [
  {n:'Desi Dal Tadka',t:'veg',g:'Yellow Dal',q:'260g',tops:[]},
  {n:'Punjabi Kadhi Pakoda',t:'veg',g:'Kadhi + Pakoda',q:'220g + 4pcs',tops:[]},
  {n:'Dilli Wale Rajma',t:'veg',g:'Rajma',q:'260g',tops:[]},
  {n:'Amritsari Chole',t:'veg',g:'Chole',q:'260g',tops:[]},
  {n:'Dal Makhani',t:'veg',g:'Dal Makhani',q:'260g',tops:[]},
  {n:'Aloo Matar',t:'veg',g:'Butter Gravy',q:'160g',tops:['Dum Aloo 4pcs (70-75g)','Matar 30g']},
  {n:'Aloo Palak',t:'veg',g:'Palak Gravy',q:'160g',tops:['Dum Aloo 4pcs (70-75g)']},
  {n:'Banarasi Dum Aloo',t:'veg',g:'Butter Gravy',q:'160g',tops:['Dum Aloo 4pcs (70-75g)']},
  {n:'Malai Kofta',t:'veg',g:'Yellow Gravy',q:'160g',tops:['Malai Kofta 4pcs']},
  {n:'Subz Kadhai',t:'veg',g:'Butter Gravy',q:'160g',tops:['Red Paneer 40g','Mixed Veg 40g','Onion+Capsicum 10+10g']},
  {n:'Subz Handi / Old Ludhiana Subz Lababdar',t:'veg',g:'Yellow Gravy',q:'160g',tops:['Red Paneer 40g','Mixed Veg 40g','Onion+Capsicum 10+10g']},
  {n:'Mushroom Masala',t:'veg',g:'Butter Gravy',q:'160g',tops:['Cooked Mushroom 80g','Onion 20g']},
  {n:'Matar Paneer / Punjabi Style',t:'veg',g:'Butter Gravy',q:'160g',tops:['Red Paneer 70g','Matar 30g']},
  {n:'Paneer Makhni / Dilliwala Paneer Makhani',t:'veg',g:'Orange Gravy',q:'160g',tops:['Red Paneer 100g']},
  {n:'Paneer Tikka Masala',t:'veg',g:'Butter Gravy',q:'160g',tops:['Red Paneer 100g']},
  {n:'Kadhai Paneer',t:'veg',g:'Butter Gravy',q:'160g',tops:['Red Paneer 80g','Onion+Capsicum 10+10g']},
  {n:'Paneer Lababdar',t:'veg',g:'Yellow Gravy',q:'160g',tops:['Red Paneer 100g']},
  {n:'Mughlai Paneer',t:'veg',g:'Yellow Gravy',q:'160g',tops:['Red Paneer 80g','Onion 20g']},
  {n:'Palak Paneer',t:'veg',g:'Palak Gravy',q:'160g',tops:['Red Paneer 100g']},
  {n:'Homestyle Egg Curry',t:'nv',g:'Butter Gravy',q:'160g',tops:['Boiled Eggs 2pcs']},
  {n:'Butter Chicken',t:'nv',g:'Orange Gravy',q:'160g',tops:['Red Chicken 100g']},
  {n:'Chicken Tikka Masala',t:'nv',g:'Butter Gravy',q:'160g',tops:['Red Chicken 100g']},
  {n:'Chicken Kadhai',t:'nv',g:'Butter Gravy',q:'160g',tops:['Brown Chicken 80g','Onion+Capsicum 10+10g']},
  {n:'Chicken Lababdar',t:'nv',g:'Yellow Gravy',q:'160g',tops:['Brown Chicken 100g']},
  {n:'Mughlai Chicken',t:'nv',g:'Yellow Gravy',q:'160g',tops:['Red Chicken 80g','Onion 20g']},
  {n:'Homestyle Chicken',t:'nv',g:'Chicken Gravy',q:'160g',tops:['Brown Chicken 100g']},
  {n:'Saag Chicken',t:'nv',g:'Palak Gravy',q:'160g',tops:['Red Chicken 100g']},
  {n:'Dhaba Style Mutton',t:'nv',g:'Mutton Gravy',q:'160g',tops:['Mutton Boti 100g']},
];

const FULL_CURRY = [
  {n:'Desi Dal Tadka',t:'veg',g:'Yellow Dal',q:'520g',tops:[]},
  {n:'Punjabi Kadhi Pakoda',t:'veg',g:'Kadhi + Pakoda',q:'520g',tops:['Pakodas 8pcs']},
  {n:'Dilli Waale Rajma',t:'veg',g:'Rajma',q:'520g',tops:[]},
  {n:'Amritsari Chole',t:'veg',g:'Chole',q:'520g',tops:[]},
  {n:'Dal Makhni',t:'veg',g:'Dal Makhani',q:'520g',tops:[]},
  {n:'Aloo Matar',t:'veg',g:'Butter Gravy',q:'320g',tops:['Aloo 8pcs (140-145g)','Matar 60g']},
  {n:'Aloo Palak',t:'veg',g:'Palak Gravy',q:'320g',tops:['Aloo 8pcs (140-145g)']},
  {n:'Banarasi Dum Aloo',t:'veg',g:'Butter Gravy',q:'320g',tops:['Dum Aloo 8pcs (140-145g)']},
  {n:'Malai Kofta',t:'veg',g:'Yellow Gravy',q:'320g',tops:['Malai Kofta 8pcs']},
  {n:'Subz Kadhai',t:'veg',g:'Butter Gravy',q:'320g',tops:['Red Paneer 70g','Mixed Veg 70g','Onion+Capsicum 20+20g']},
  {n:'Subz Handi',t:'veg',g:'Yellow Gravy',q:'320g',tops:['Red Paneer 70g','Mixed Veg 70g','Onion+Capsicum 20+20g']},
  {n:'Mushroom Masala',t:'veg',g:'Butter Gravy',q:'320g',tops:['Cooked Mushroom 140g','Onion 40g']},
  {n:'Matar Paneer',t:'veg',g:'Butter Gravy',q:'320g',tops:['Red Paneer 160g','Matar 60g']},
  {n:'Paneer Makhni',t:'veg',g:'Orange Gravy',q:'320g',tops:['Red Paneer 200g']},
  {n:'Paneer Tikka Masala',t:'veg',g:'Butter Gravy',q:'320g',tops:['Red Paneer 200g']},
  {n:'Kadhai Paneer',t:'veg',g:'Butter Gravy',q:'320g',tops:['Red Paneer 160g','Onion+Capsicum 20+20g']},
  {n:'Paneer Lababdar',t:'veg',g:'Yellow Gravy',q:'320g',tops:['Red Paneer 200g']},
  {n:'Mughlai Paneer',t:'veg',g:'Yellow Gravy',q:'320g',tops:['Red Paneer 160g','Onion 40g']},
  {n:'Palak Paneer',t:'veg',g:'Palak Gravy',q:'320g',tops:['Red Paneer 200g']},
  {n:'Homestyle Egg Curry',t:'nv',g:'Butter Gravy',q:'320g',tops:['Boiled Eggs 3pcs']},
  {n:'Butter Chicken',t:'nv',g:'Orange Gravy',q:'320g',tops:['Red Chicken 200g']},
  {n:'Chicken Tikka Masala',t:'nv',g:'Butter Gravy',q:'320g',tops:['Red Chicken 200g']},
  {n:'Kadhai Chicken',t:'nv',g:'Butter Gravy',q:'320g',tops:['Brown Chicken 160g','Onion+Capsicum 20+20g']},
  {n:'Chicken Lababdar',t:'nv',g:'Yellow Gravy',q:'320g',tops:['Brown Chicken 200g']},
  {n:'Mughlai Chicken',t:'nv',g:'Yellow Gravy',q:'320g',tops:['Red Chicken 160g','Onion 40g']},
  {n:'Homestyle Chicken',t:'nv',g:'Chicken Gravy',q:'320g',tops:['Brown Chicken 200g']},
  {n:'Saag Chicken',t:'nv',g:'Palak Gravy',q:'320g',tops:['Red Chicken 200g']},
  {n:'Dhaba Style Mutton',t:'nv',g:'Mutton Gravy',q:'320g',tops:['Mutton Boti 200g']},
];


const HALF_CURRY_TOPS = [
  [],[['Pakodas 4pcs']],[],[],[],
  ['Aloo 4pcs (70-75g)','Matar 30g'],['Aloo 4pcs (70-75g)'],['Dum Aloo 4pcs (70-75g)'],['Malai Kofta 4pcs'],
  ['Red Paneer 35g','Mixed Veg 35g','Onion+Capsicum 10+10g'],['Red Paneer 35g','Mixed Veg 35g','Onion+Capsicum 10+10g'],
  ['Cooked Mushroom 70g','Onion 20g'],['Red Paneer 80g','Matar 30g'],['Red Paneer 100g'],['Red Paneer 100g'],
  ['Red Paneer 80g','Onion+Capsicum 10+10g'],['Red Paneer 100g'],['Red Paneer 80g','Onion 20g'],['Red Paneer 100g'],
  ['Boiled Eggs 1.5pcs'],['Red Chicken 100g'],['Red Chicken 100g'],['Brown Chicken 80g','Onion+Capsicum 10+10g'],
  ['Brown Chicken 100g'],['Red Chicken 80g','Onion 20g'],['Brown Chicken 100g'],['Red Chicken 100g'],['Mutton Boti 100g'],
];

const HALF_C = FULL_CURRY.map((item, idx) => ({
  ...item,
  q: item.q.replace('520g','260g').replace('320g','160g'),
  tops: HALF_CURRY_TOPS[idx] || [],
}));


const BIRYANI_TABS = [
  { id:'itminaan', label:'Itminaan (1 KG)' },
  { id:'zaza',     label:'Zaza' },
  { id:'1881',     label:'1881' },
  { id:'nh1',      label:'NH1 (Round Bowl)' },
  { id:'box8thali',label:'Box8 Biryani Thali' },
];

const BIRYANI_META = {
  itminaan:  { rice:'Dum Rice 440g + 200g (top) = 640g total', extra:'Raita 2pcs + Dessert' },
  zaza:      { rice:'Dum Rice 220g + 100g (top) = 320g total', extra:'Raita 1pc' },
  '1881':    { rice:'Dum Rice 220g + 100g (top) = 320g total', extra:'No Raita — Black Bowl + Paper Bag' },
  nh1:       { rice:'Dum Rice 220g + 100g (top) = 320g total', extra:'Desi Salad 40g + Green Chutney 15g + Yogurt 15g | Round Bowl + NH1 Sleeve' },
  box8thali: { rice:'Dum Rice 170g + 100g (top) = 270g total', extra:'Raita 100g | Onion 40g + Green Chutney 20g | Small Meal Tray + Box8 Sleeve' },
};

const BIRYANI_ITEMS = {
  itminaan: [
    {n:'Dum-Aloo',t:'veg',base:'Butter Masala 100g',tops:['Aloo 160g (10pcs)','Butter Masala top 100g']},
    {n:'Veg Nawabi',t:'veg',base:'Butter Masala 100g',tops:['Mixed Veg 160g','Butter Masala top 100g']},
    {n:'Veg & Paneer Overload',t:'veg',base:'Butter Masala 100g',tops:['Red Paneer 80g','Mixed Veg 80g','Butter Masala top 100g']},
    {n:'Original Paneer',t:'veg',base:'Butter Masala 100g',tops:['Red Paneer 160g','Butter Masala top 100g']},
    {n:'Paneer Makhni',t:'veg',base:'Orange Gravy 100g',tops:['Red Paneer 160g','Orange Gravy top 100g']},
    {n:'Tangdi Chicken',t:'nv',base:'Chicken Gravy 50g',tops:['Chicken Tangdi 2pcs','Chicken Gravy top 50g']},
    {n:'Original Chicken',t:'nv',base:'Chicken Gravy 50g',tops:['Brown Chicken 200g','Chicken Gravy top 50g']},
    {n:'Chicken Tikka',t:'nv',base:'Chicken Gravy 50g',tops:['Red Chicken 200g','Chicken Gravy top 50g']},
    {n:'Bhuna Chicken',t:'nv',base:'Butter Masala 50g',tops:['Red Chicken 200g','Butter Masala top 50g']},
    {n:'Butter Chicken',t:'nv',base:'Orange Gravy 50g',tops:['Red Chicken 200g','Orange Gravy top 50g']},
    {n:'Overload Chicken',t:'nv',base:'Chicken Gravy 50g',tops:['Brown Chicken 200g','Red Chicken 200g','Chicken Gravy top 50g']},
    {n:'Gosht Mutton',t:'nv',base:'Mutton Curry 50g',tops:['Mutton Boti 200g','Mutton Curry top 50g']},
  ],
  zaza: [
    {n:'Dum Aloo Value Bowl',t:'veg',base:'Butter Gravy 40g',tops:['Aloo 4pcs (70g)','Butter Gravy top 40g']},
    {n:'Paneer Value Bowl',t:'veg',base:'Butter Gravy 40g',tops:['Red Paneer 70g','Butter Gravy top 40g']},
    {n:'Aloo & Veg Mughal Biryani',t:'veg',base:'Butter Gravy 50g',tops:['Aloo+Mixed Veg 40+40g','Butter Gravy top 50g']},
    {n:'Veg Handi Mughal',t:'veg',base:'Butter Gravy 50g',tops:['Mixed Veg 80g','Butter Gravy top 50g']},
    {n:'Chole Mughal Biryani',t:'veg',base:'Chole 140g',tops:[]},
    {n:'Paneer & Veg Mughal',t:'veg',base:'Butter Gravy 50g',tops:['Red Paneer 40g','Mixed Veg 40g','Butter Gravy top 50g']},
    {n:"Chef's Special Paneer Mughal",t:'veg',base:'Butter Gravy 50g',tops:['Red Paneer 80g','Butter Gravy top 50g']},
    {n:'Paneer Makhni Mughal',t:'veg',base:'Orange Gravy 50g',tops:['Red Paneer 80g','Orange Gravy top 50g']},
    {n:'Egg Value Bowl',t:'nv',base:'Butter Gravy 40g',tops:['Egg 1.5pcs','Butter Gravy top 40g']},
    {n:'Tangdi Chicken Value Bowl',t:'nv',base:'Chicken Gravy 20g',tops:['Chicken Tangdi 1pc','Chicken Gravy top 40g']},
    {n:'Chicken Boneless Value Bowl',t:'nv',base:'Chicken Gravy 20g',tops:['Brown Chicken 70g','Chicken Gravy top 20g']},
    {n:"Chef's Special Chicken Mughal",t:'nv',base:'Chicken Gravy 25g',tops:['Brown Chicken 100g','Chicken Gravy top 25g']},
    {n:'Chicken Tikka Mughal',t:'nv',base:'Chicken Gravy 25g',tops:['Red Chicken 100g','Chicken Gravy top 25g']},
    {n:'Butter Chicken Mughal',t:'nv',base:'Orange Gravy 25g',tops:['Red Chicken 100g','Orange Gravy top 25g']},
    {n:'Dhaba Chicken Mughal',t:'nv',base:'Butter Gravy 25g',tops:['Red Chicken 100g','Butter Gravy top 25g']},
    {n:'Double Chicken Tangdi Mughal',t:'nv',base:'Chicken Gravy 25g',tops:['Chicken Tangdi 2pcs','Chicken Gravy top 25g']},
    {n:'Chicken Overload Mughal',t:'nv',base:'Chicken Gravy 25g',tops:['Brown Chicken 100g','Red Chicken 100g','Chicken Gravy top 25g']},
    {n:'Mutton Special Mughal',t:'nv',base:'Mutton Curry 25g',tops:['Mutton Boti 100g','Mutton Curry top 25g']},
  ],
  '1881': [
    {n:'Aloo Dum Biryani',t:'veg',base:'Butter Gravy 40g',tops:['Aloo 4pcs (70g)','Butter Gravy top 40g']},
    {n:'Aloo & Veg Dum Biryani',t:'veg',base:'Butter Gravy 40g',tops:['Aloo+Mixed Veg 35+35g','Butter Gravy top 40g']},
    {n:'Subz Dum Biryani',t:'veg',base:'Butter Gravy 40g',tops:['Mixed Veg 70g','Butter Gravy top 40g']},
    {n:'Paneer & Subz Dum Biryani',t:'veg',base:'Butter Gravy 40g',tops:['Red Paneer 35g','Mixed Veg 35g','Butter Gravy top 40g']},
    {n:'Paneer Tikka Dum Biryani',t:'veg',base:'Butter Gravy 40g',tops:['Red Paneer 70g','Butter Gravy top 40g']},
    {n:'Egg Dum Biryani',t:'nv',base:'Butter Gravy 40g',tops:['Egg 1.5pcs','Butter Gravy top 40g']},
    {n:'Chicken Tangdi Dum Biryani',t:'nv',base:'Chicken Gravy 20g',tops:['Chicken Tangdi 1pc','Chicken Gravy top 20g']},
    {n:'Chicken Lucknowi Dum',t:'nv',base:'Chicken Gravy 20g',tops:['Brown Chicken 70g','Chicken Gravy top 20g']},
    {n:'Chicken Tikka Dum',t:'nv',base:'Chicken Gravy 20g',tops:['Red Chicken 70g','Chicken Gravy top 20g']},
    {n:'Bhuna Chicken Dum',t:'nv',base:'Butter Gravy 20g',tops:['Red Chicken 70g','Butter Gravy top 20g']},
    {n:'Double Chicken Tangdi Dum',t:'nv',base:'Chicken Gravy 20g',tops:['Chicken Tangdi 2pcs','Chicken Gravy top 20g']},
    {n:'Double Chicken Boneless Dum',t:'nv',base:'Chicken Gravy 20g',tops:['Brown Chicken 70g','Red Chicken 70g','Chicken Gravy top 20g']},
    {n:'Mutton Dum Biryani',t:'nv',base:'Mutton Curry 20g',tops:['Mutton Boti 70g','Mutton Curry top 20g']},
  ],
  nh1: [
    {n:'Aloo Dum Biryani',t:'veg',base:'Butter Gravy 40g',tops:['Aloo 4pcs (70g)','Butter Gravy top 40g']},
    {n:'Subz Khazana Biryani',t:'veg',base:'Butter Gravy 40g',tops:['Red Paneer 35g','Mixed Veg 35g','Butter Gravy top 40g']},
    {n:'Shahi Paneer Biryani',t:'veg',base:'Butter Gravy 40g',tops:['Red Paneer 70g','Butter Gravy top 40g']},
    {n:'Egg Dum Biryani',t:'nv',base:'Butter Gravy 40g',tops:['Eggs 1.5pcs','Butter Gravy top 40g']},
    {n:'Chicken Tangdi Biryani',t:'nv',base:'Chicken Gravy 20g',tops:['Chicken Tangdi 1pc','Chicken Gravy top 20g']},
    {n:'Murg Dum Biryani',t:'nv',base:'Chicken Gravy 20g',tops:['Brown Chicken 70g','Chicken Gravy top 20g']},
    {n:'Chicken Tikka Biryani',t:'nv',base:'Chicken Gravy 20g',tops:['Red Chicken 70g','Chicken Gravy top 20g']},
    {n:'Mutton Dum Biryani',t:'nv',base:'Mutton Gravy 20g',tops:['Mutton Boti 70g','Mutton Gravy top 20g']},
  ],
  box8thali: [
    {n:'Aloo Dum Biryani',t:'veg',base:'Butter Gravy 40g',tops:['Aloo 4pcs (70g)','Butter Gravy top 40g']},
    {n:'Subz Khazana Biryani',t:'veg',base:'Butter Gravy 40g',tops:['Red Paneer 35g','Mixed Veg 35g','Butter Gravy top 40g']},
    {n:'Shahi Paneer Biryani',t:'veg',base:'Butter Gravy 40g',tops:['Red Paneer 70g','Butter Gravy top 40g']},
    {n:'Egg Dum Biryani',t:'nv',base:'Butter Gravy 40g',tops:['Eggs 1.5pcs','Butter Gravy top 40g']},
    {n:'Chicken Tangdi Biryani',t:'nv',base:'Chicken Gravy 20g',tops:['Chicken Tangdi 1pc','Chicken Gravy top 20g']},
    {n:'Murg Dum Biryani',t:'nv',base:'Chicken Gravy 20g',tops:['Brown Chicken 70g','Chicken Gravy top 20g']},
    {n:'Chicken Tikka Biryani',t:'nv',base:'Chicken Gravy 20g',tops:['Red Chicken 70g','Chicken Gravy top 20g']},
    {n:'Mutton Dum Biryani',t:'nv',base:'Mutton Gravy 20g',tops:['Mutton Boti 70g','Mutton Gravy top 20g']},
  ],
};

const ROLLS = [
  {n:'Aloo Tikka Roll',t:'veg',s1:'Garlic Yogurt 30g',s2:'—',fill:'Aloo 5pcs + TikkaMM 13g',onion:'30g',s3:'Green Chutney 15g'},
  {n:'Aloo Chaat Roll',t:'veg',s1:'Garlic Yogurt 30g + Imli 20g',s2:'—',fill:'Aloo 5pcs + TikkaMM 13g',onion:'30g',s3:'Green Chutney 15g'},
  {n:'Aloo Chole Chatpata Roll',t:'veg',s1:'Garlic Yogurt 30g + Imli 20g',s2:'—',fill:'Aloo 3pcs + TikkaMM 8g + Chole 60g',onion:'30g',s3:'Green Chutney 15g'},
  {n:'Dum Aloo Masala Roll',t:'veg',s1:'Butter Gravy 50g',s2:'—',fill:'Aloo 5pcs + TikkaMM 13g',onion:'30g',s3:'Green Chutney 15g'},
  {n:'Peri Peri Aloo Roll',t:'veg',s1:'Garlic Yogurt 30g',s2:'Mayo 50g',fill:'Aloo 5pcs + TikkaMM 13g',onion:'30g',s3:'Green Chutney 15g'},
  {n:'Aloo Cheese Melt Roll',t:'veg',s1:'Garlic Yogurt 30g',s2:'Filler Cheese 50g',fill:'Aloo 5pcs + TikkaMM 13g',onion:'30g',s3:'Green Chutney 15g'},
  {n:'Chole Tikki Roll',t:'veg',s1:'Garlic Yogurt 30g + Imli 20g',s2:'—',fill:'Veg Tikki 40g + Chole 60g',onion:'30g',s3:'Green Chutney 15g'},
  {n:'Bombay Chaat Roll',t:'veg',s1:'Garlic Yogurt 30g + Imli 20g',s2:'—',fill:'Veg Tikki 80g',onion:'30g',s3:'Green Chutney 15g'},
  {n:'Peri Peri Veggie Patty Roll',t:'veg',s1:'Garlic Yogurt 30g',s2:'Mayo 50g',fill:'Veg Tikki 80g',onion:'30g',s3:'Green Chutney 15g'},
  {n:'Paneer Tikka Masala Roll',t:'veg',s1:'Butter Gravy 50g',s2:'—',fill:'Paneer Tikka 100g',onion:'30g',s3:'Green Chutney 15g'},
  {n:'Paneer Makhni Roll',t:'veg',s1:'Orange Gravy 50g',s2:'—',fill:'Paneer Tikka 100g',onion:'30g',s3:'Green Chutney 15g'},
  {n:'Paneer Mughlai Roll',t:'veg',s1:'Yellow Gravy 50g',s2:'—',fill:'Paneer Tikka 100g',onion:'30g',s3:'Green Chutney 15g'},
  {n:'Double Paneer Overload Roll',t:'veg',s1:'Butter Gravy 50g',s2:'—',fill:'Paneer Tikka 140g',onion:'30g',s3:'Green Chutney 15g'},
  {n:'Peri Peri Paneer Roll',t:'veg',s1:'Garlic Yogurt 30g',s2:'Mayo 50g',fill:'Paneer Tikka 100g',onion:'30g',s3:'Green Chutney 15g'},
  {n:'Cheese Melt Paneer Roll',t:'veg',s1:'Garlic Yogurt 30g',s2:'Filler Cheese 50g',fill:'Paneer Tikka 100g',onion:'30g',s3:'Green Chutney 15g'},
  {n:'Mushroom Tikka Roll',t:'veg',s1:'Butter Gravy 50g',s2:'—',fill:'Mushroom 80g',onion:'30g',s3:'Green Chutney 15g'},
  {n:'Peri Peri Mushroom Roll',t:'veg',s1:'Garlic Yogurt 30g',s2:'Mayo 50g',fill:'Mushroom 80g',onion:'30g',s3:'Green Chutney 15g'},
  {n:'Tandoori Chicken Roll',t:'nv',s1:'Garlic Yogurt 30g',s2:'—',fill:'Red Chicken 100g',onion:'30g',s3:'Green Chutney 15g'},
  {n:'Nawabi Chicken Roll',t:'nv',s1:'Chicken Gravy 50g',s2:'—',fill:'Brown Chicken 100g',onion:'30g',s3:'Green Chutney 15g'},
  {n:'Butter Chicken Roll',t:'nv',s1:'Orange Gravy 50g',s2:'—',fill:'Red Chicken 100g',onion:'30g',s3:'Green Chutney 15g'},
  {n:'Chicken Tikka Masala Roll',t:'nv',s1:'Butter Gravy 50g',s2:'—',fill:'Red Chicken 100g',onion:'30g',s3:'Green Chutney 15g'},
  {n:'Chicken Mughlai Roll',t:'nv',s1:'Yellow Gravy 50g',s2:'—',fill:'Brown Chicken 100g',onion:'30g',s3:'Green Chutney 15g'},
  {n:'Double Chicken Overload Roll',t:'nv',s1:'Chicken Gravy 50g',s2:'—',fill:'Brown Chicken 100g + Red Chicken 40g',onion:'30g',s3:'Green Chutney 15g'},
  {n:'Peri Peri Chicken Roll',t:'nv',s1:'Garlic Yogurt 30g',s2:'Mayo 50g',fill:'Red Chicken 100g',onion:'30g',s3:'Green Chutney 15g'},
  {n:'Cheese Melt Chicken Roll',t:'nv',s1:'Garlic Yogurt 30g',s2:'Filler Cheese 50g',fill:'Red Chicken 100g',onion:'30g',s3:'Green Chutney 15g'},
  {n:'Bhuna Mutton Roll',t:'nv',s1:'Mutton Gravy 50g',s2:'—',fill:'Mutton Boti 100g',onion:'30g',s3:'Green Chutney 15g'},
];

function CurryTable({ data, title, packing }) {
  const rows = data.reduce((acc, r) => {
    const prev = acc[acc.length - 1];
    if (!prev || prev.type !== r.t) acc.push({ divider: true, type: r.t, key: `div-${r.n}` });
    acc.push({ divider: false, type: r.t, item: r });
    return acc;
  }, []);
  return (
    <div className="card">
      {title && <h3 style={{ fontWeight: 700, fontSize: 17, marginBottom: 6 }}>{title}</h3>}
      {packing && <div style={{ fontSize: 13, color: 'var(--md-on-surface-var)', marginBottom: 12 }}>📦 {packing}</div>}
      <div className="portion-table-wrap">
        <table className="portion-table">
          <thead><tr><th>Item Name</th><th>Base Gravy</th><th>Quantity</th><th>Toppings / Notes</th></tr></thead>
          <tbody>
            {rows.map(row => row.divider ? (
              <tr key={row.key} className={row.type === 'veg' ? 'section-divider-veg' : 'section-divider-nv'}>
                <td colSpan={4}>{row.type === 'veg' ? '🥦  VEGETARIAN ITEMS' : '🍗  NON-VEG ITEMS'}</td>
              </tr>
            ) : (
              <tr key={row.item.n} className={row.item.t === 'veg' ? 'veg-row' : 'nv-row'}>
                <td className="row-header">{row.item.n}</td>
                <td><span style={{ background: GRAVY_COLORS[row.item.g] || 'transparent', padding: '4px 10px', borderRadius: 8, fontSize: 13, fontWeight: 600 }}>{row.item.g}</span></td>
                <td style={{ color: 'var(--md-primary)', fontWeight: 700, fontSize: 15 }}>{row.item.q}</td>
                <td style={{ fontSize: 13, color: 'var(--md-on-surface-var)' }}>{row.item.tops.length ? row.item.tops.join(' · ') : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}



const TABS = [
  { id: 'allinone',   label: '🍱 All-in-1 Meal' },
  { id: 'minimeal',   label: '🥘 Mini Meal' },
  { id: 'desibox',    label: '🥗 Desi Box/NH1 Bowl' },
  { id: 'fullcurry',  label: '🫕 Full Curry' },
  { id: 'halfcurry',  label: '🍲 Half Curry' },
  { id: 'biryani',    label: '🍛 Biryani' },
  { id: 'rolls',      label: '🌯 Rolls' },
];

export default function Box8() {
  const [active, setActive] = useLocalStorage('ec_box8_tab', 'allinone');
  const [birTab, setBirTab] = useLocalStorage('ec_box8_birTab', 'itminaan');
  const [rollFilter, setRollFilter] = useLocalStorage('ec_box8_rollFilter', 'all');


  const filteredRolls = useMemo(() =>
    rollFilter === 'all' ? ROLLS : ROLLS.filter(r => r.t === rollFilter), [rollFilter]);

  return (
    <div className="page-content">
      <h1 className="page-title"><DynamicTitle text="📦 Box8 Portioning Charts" /></h1>
      <p className="page-subtitle">Complete portioning standards for all Box8 & Daily Kitchen meal types</p>

      <div className="tab-bar mb-24" style={{ flexWrap: 'wrap', gap: 6 }}>
        {TABS.map(t => (
          <button key={t.id} className={`tab-btn ${active === t.id ? 'active' : ''}`} onClick={() => setActive(t.id)}>{t.label}</button>
        ))}
      </div>

      {/* ALL-IN-ONE */}
      {active === 'allinone' && (
        <div>
          <div className="grid-2 mb-16">
            <div className="card">
              <h3 style={{ fontWeight: 700, color: 'var(--md-primary)', marginBottom: 10 }}>Box8 All-in-1 Common Items</h3>
              {[['Base','Meal Rice 280g OR Biryani Rice 280g OR Paratha (1 Pack) OR Phulka (1 Pack) OR Meal Rice 160g + Paratha/Phulka'],
                ['Side Dal','Dal Makhani 120g / Chole 120g / Rajma 120g / Yellow Dal 120g / Kadhi Pakoda 100g + 2pcs'],
                ['Salad','Desi Salad 40g + Chaat Masala + Green Chutney 20g'],
                ['Raita','100g'],['Dessert','Gulab Jamun 8pcs OR Moong Dal Halwa 60g'],
                ['Packing','Big Meal Tray + Box8 Sleeve + Spoon + Envelope'],
              ].map(([k,v])=><div key={k} className="flow-step"><div className="flow-num" style={{width:80,fontSize:10,borderRadius:6}}>{k}</div><div className="flow-content"><div className="flow-desc">{v}</div></div></div>)}
            </div>
            <div className="card">
              <h3 style={{ fontWeight: 700, color: 'var(--md-secondary)', marginBottom: 10 }}>Daily Kitchen Feast Thali</h3>
              {[['Base','Meal Rice 280g OR Paratha (1 Pack) OR Phulka (1 Pack) OR Meal Rice 160g + Paratha/Phulka'],
                ['Side Dal','Dal Makhani 120g / Chole 120g / Rajma 120g / Yellow Dal 120g / Kadhi Pakoda 100g + 2pcs'],
                ['Salad','Desi Salad 40g + Chaat Masala + Green Chutney 20g'],
                ['Raita','100g'],['Dessert','Gulab Jamun 8pcs OR Moong Dal Halwa 60g'],
                ['Packing','Big Meal Tray + Daily Kitchen Sleeve + Spoon + Envelope'],
              ].map(([k,v])=><div key={k} className="flow-step"><div className="flow-num" style={{width:80,fontSize:10,borderRadius:6}}>{k}</div><div className="flow-content"><div className="flow-desc">{v}</div></div></div>)}
            </div>
          </div>
          <CurryTable data={ALL_IN_ONE} title="All-in-1 Meal — Gravy Portioning" />
        </div>
      )}

      {/* MINI MEAL */}
      {active === 'minimeal' && (
        <div>
          <div className="grid-2 mb-16">
            <div className="card">
              <h3 style={{ fontWeight: 700, color: 'var(--md-primary)', marginBottom: 10 }}>Box8 Mini Meal Common Items</h3>
              {[['Base','Meal Rice 250g OR Biryani Rice 250g OR Paratha (1 Pack) OR Phulka (1 Pack) OR Meal Rice 160g + Paratha/Phulka'],
                ['Salad','Desi Salad 40g + Chaat Masala + Green Chutney 20g'],
                ['Side Dal','Yellow Dal 130g / Kadhi Pakoda 130g + 2 Pakodas'],
                ['Packing','Small Meal Tray + Box8 Sleeve + Spoon + Envelope'],
              ].map(([k,v])=><div key={k} className="flow-step"><div className="flow-num" style={{width:80,fontSize:10,borderRadius:6}}>{k}</div><div className="flow-content"><div className="flow-desc">{v}</div></div></div>)}
            </div>
            <div className="card">
              <h3 style={{ fontWeight: 700, color: 'var(--md-secondary)', marginBottom: 10 }}>Daily Kitchen Homely Thali</h3>
              {[['Base','Meal Rice 250g OR Paratha (1 Pack) OR Phulka (1 Pack) OR Meal Rice 160g + Paratha/Phulka'],
                ['Salad','Desi Salad 40g + Chaat Masala + Green Chutney 20g'],
                ['Side Dal','Yellow Dal 130g / Kadhi Pakoda 130g + 2 Pakodas'],
                ['Packing','Small Meal Tray + Daily Kitchen Sleeve + Spoon + Envelope'],
              ].map(([k,v])=><div key={k} className="flow-step"><div className="flow-num" style={{width:80,fontSize:10,borderRadius:6}}>{k}</div><div className="flow-content"><div className="flow-desc">{v}</div></div></div>)}
            </div>
          </div>
          <CurryTable data={MINI_MEAL.filter(i=>ALL_IN_ONE.find(o=>o.n===i.n)||['Homestyle Yellow Dal','Kadhi Pakoda'].includes(i.n))} title="Mini Meal — Gravy Portioning (Full item list)" />
        </div>
      )}

      {/* DESI BOX */}
      {active === 'desibox' && (
        <div>
          <div className="grid-2 mb-16">
            <div className="card">
              <h3 style={{ fontWeight: 700, color: 'var(--md-primary)', marginBottom: 10 }}>Desi Box / NH1 Bowl Common Items</h3>
              {[['Rice','Meal Rice / Biryani Rice 250g'],['Salad','Desi Salad 40g + Chaat Masala'],
                ['Chutney','Green Chutney 15g'],['Yogurt','Garlic Yogurt 15g']].map(([k,v])=>
                <div key={k} className="flow-step"><div className="flow-num" style={{width:80,fontSize:10,borderRadius:6}}>{k}</div><div className="flow-content"><div className="flow-desc">{v}</div></div></div>)}
            </div>
            <div className="card">
              <h3 style={{ fontWeight: 700, color: 'var(--md-secondary)', marginBottom: 10 }}>2in1 Box Meal Common Items</h3>
              {[['Base','Meal Rice 180g OR Paratha (1 Pack)'],['Packing','2in1 Box + Spoon + Envelope'],
                ['Roti Meal','4 Phulkas — 220g'],['Rice Meal','180g'],
                ['Paratha Meal','3 Parathas + Foil — 220g'],['5-Grain Roti','3 Missi Rotis + Foil']].map(([k,v])=>
                <div key={k} className="flow-step"><div className="flow-num" style={{width:80,fontSize:10,borderRadius:6}}>{k}</div><div className="flow-content"><div className="flow-desc">{v}</div></div></div>)}
            </div>
          </div>
          <CurryTable data={DESI_BOX} title="Desi Box / NH1 Bowl — Gravy Portioning" />
        </div>
      )}

      {/* FULL CURRY */}
      {active === 'fullcurry' && (
        <CurryTable
          data={FULL_CURRY}
          title="🫕 Full Curry Portioning"
          packing="Big Curry Container + EatClub Common Box / Paper Bag (Ghar Se) + Veg/Non-Veg Sticker + Spoon + Envelope"
        />
      )}

      {/* HALF CURRY */}
      {active === 'halfcurry' && (
        <CurryTable
          data={HALF_C}
          title="🍲 Half Curry Portioning"
          packing="Small Curry Container + EatClub Common Box / Paper Bag (Ghar Se) + Veg/Non-Veg Sticker + Spoon + Envelope"
        />
      )}

      {/* BIRYANI */}
      {active === 'biryani' && (
        <div>
          <div className="alert alert-warning mb-16">
            <span className="alert-icon">warning</span>
            <div><strong>Cold Itminaan:</strong> ONLY for matka biryani that arrived cold. Starters from Itminaan arriving cold = <strong>ColdFood [Manager400]</strong> — NOT Cold Itminaan!</div>
          </div>
          <div className="tab-bar mb-16" style={{ flexWrap: 'wrap', gap: 6 }}>
            {BIRYANI_TABS.map(t => (
              <button key={t.id} className={`tab-btn ${birTab === t.id ? 'active' : ''}`} onClick={() => setBirTab(t.id)} style={{ fontSize: 13 }}>{t.label}</button>
            ))}
          </div>
          {(() => {
            const meta = BIRYANI_META[birTab];
            const items = BIRYANI_ITEMS[birTab] || [];
            return (
              <div>
                <div className="grid-2 mb-16">
                  <div className="card" style={{ borderLeft: '4px solid var(--md-primary)' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--md-on-surface-var)', marginBottom: 4 }}>🍚 RICE</div>
                    <div style={{ fontWeight: 700, color: 'var(--md-primary)' }}>{meta.rice}</div>
                  </div>
                  <div className="card" style={{ borderLeft: '4px solid var(--md-secondary)' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--md-on-surface-var)', marginBottom: 4 }}>📦 EXTRAS & PACKING</div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{meta.extra}</div>
                  </div>
                </div>
                <div className="card">
                  <div className="portion-table-wrap">
                    <table className="portion-table">
                      <thead><tr><th>Item Name</th><th>Base Gravy</th><th>Toppings</th></tr></thead>
                      <tbody>
                        {items.map(r => (
                          <tr key={r.n} className={r.t === 'veg' ? 'veg-row' : 'nv-row'}>
                            <td className="row-header">{r.n}</td>
                            <td style={{ color: 'var(--md-primary)', fontWeight: 600, fontSize: 12 }}>{r.base}</td>
                            <td style={{ fontSize: 12, color: 'var(--md-on-surface-var)' }}>{r.tops.join(' · ') || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ROLLS */}
      {active === 'rolls' && (
        <div>
          <div className="alert alert-info mb-16">
            <span className="alert-icon">info</span>
            <div><strong>Common for ALL Rolls:</strong> Aata/Maida Roti 1pc (full roll) or Matka Roti 1pc (mini roll)</div>
          </div>
          <div className="tab-bar mb-16" style={{ gap: 8 }}>
            {[['all','All'],['veg','🥦 Veg'],['nv','🍗 Non-Veg']].map(([id,label])=>(
              <button key={id} className={`tab-btn ${rollFilter===id?'active':''}`} onClick={()=>setRollFilter(id)} style={{fontSize:13}}>{label}</button>
            ))}
          </div>
          <div className="card">
            <div className="portion-table-wrap">
              <table className="portion-table">
                <thead><tr><th>Roll Name</th><th>Sauce 1 (Bottom)</th><th>Sauce 2</th><th>Filling</th><th>Onion</th><th>Sauce 3 (Top)</th></tr></thead>
                <tbody>
                  {filteredRolls.map(r => (
                    <tr key={r.n} className={r.t === 'veg' ? 'veg-row' : 'nv-row'}>
                      <td className="row-header">{r.n}</td>
                      <td style={{ color: 'var(--md-primary)', fontWeight: 600, fontSize: 12 }}>{r.s1}</td>
                      <td style={{ fontSize: 12 }}>{r.s2}</td>
                      <td style={{ color: 'var(--md-primary)', fontWeight: 600, fontSize: 12 }}>{r.fill}</td>
                      <td style={{ fontSize: 12 }}>{r.onion}</td>
                      <td style={{ fontSize: 12 }}>{r.s3}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
