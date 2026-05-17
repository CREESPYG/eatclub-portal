/* global process */
import fs from 'fs';

try {
  const dumpRaw = fs.readFileSync('eatclub_api_dump.json', 'utf8');
  const dump = JSON.parse(dumpRaw);
  if (!dump || dump.length === 0) {
    console.log("No dumps found");
    process.exit();
  }
  
  // Try to find the catalog
  let productsMap = {};
  for (const resp of dump) {
      if (resp.data.products && Object.keys(resp.data.products).length > 0) {
          productsMap = resp.data.products;
          break;
      }
  }

  if (Object.keys(productsMap).length === 0) {
      console.log("No products found in the catalog map");
      process.exit();
  }
  
  console.log(`Found ${Object.keys(productsMap).length} completely raw products.`);
  
  const formattedItems = [];
  
  for (const [, product] of Object.entries(productsMap)) {
      let brandName = "EatClub Brand";
      if (product.brand_name) {
          brandName = product.brand_name;
      }
      
      const itemName = product.name || product.title;
      let imageUrl = product.image_url || product.image || '';
      const desc = product.description || '';
      
      let originalPrice = product.price || 0;
      let passPrice = product.pass_price || product.discounted_price || null;
      if (!passPrice && originalPrice) {
          passPrice = Math.floor(originalPrice * 0.7);
      }
      
      let portion = "Standard Portion";
      let ingredients = [];

      if (desc.includes('[') && desc.includes(']')) {
          const match = desc.match(/\[(.*?)\]/);
          if (match) {
              portion = match[1];
          }
      }
      
      if (desc) {
          ingredients = desc.split(',').map(s => s.replace(/\[|\]/g, '').trim()).filter(Boolean);
      }

      formattedItems.push({
          brand: brandName,
          item_name: itemName,
          image_url: imageUrl,
          description: desc,
          ingredients: ingredients.slice(0, 5),
          portion: portion,
          original_price: originalPrice,
          eatclub_pass_price: passPrice
      });
  }
  
  fs.writeFileSync('menu_database.json', JSON.stringify(formattedItems, null, 2));
  console.log(`Successfully formatted and wrote ${formattedItems.length} items to menu_database.json!`);

} catch (e) {
  console.log("Error logic:", e.message);
}
