import puppeteer from 'puppeteer';
import fs from 'fs/promises';

const DELAY_MIN = 1000;
const DELAY_MAX = 2000;

async function randomDelay(min = DELAY_MIN, max = DELAY_MAX) {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  await new Promise(r => setTimeout(r, delay));
}

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--window-size=1920,1080']
  });

  const page = await browser.newPage();
  
  try {
    console.log('Navigating...');
    await page.goto('https://eatclub.in/', { waitUntil: 'networkidle2', timeout: 60000 });

    const locationInputSelector = 'input.google-place-input';
    const deliverAtBtn = await page.$('.location-container, .user-location').catch(() => null);
    if (deliverAtBtn) {
       await deliverAtBtn.click();
       await randomDelay();
    }

    try {
        await page.waitForSelector(locationInputSelector, { timeout: 10000 });
        const inputVal = await page.$eval(locationInputSelector, el => el.value).catch(() => '');
        if (inputVal) {
          const crossIcon = await page.$('.cross-icon').catch(() => null);
          if (crossIcon) await crossIcon.click();
          await randomDelay();
        }

        await page.click(locationInputSelector);
        await page.type(locationInputSelector, 'Chandivali Powai', { delay: 100 });
        await randomDelay(1500, 2500);

        const suggestionSelector = '.google-place-input-container ul li, .search-results li, .autocomplete-list li';
        await page.waitForSelector(suggestionSelector, { timeout: 10000 });
        
        const elements = await page.$$(suggestionSelector);
        for (const el of elements) {
          const text = await page.evaluate(e => e.textContent, el);
          if (text.toLowerCase().includes('chandivali') || text.toLowerCase().includes('powai')) {
            await el.click();
            break;
          }
        }
        await randomDelay(3000, 4000);
    } catch (error) { void error; }

    console.log('Navigating to menu Directly...');
    await page.goto('https://eatclub.in/menu', { waitUntil: 'networkidle2', timeout: 30000 }).catch(()=>{});
    await randomDelay(4000, 5000); 

    const dbResult = [];

    const brandTabSelector = '.brand-tabs .brand-tab, .brand-logo, [class*="BrandTab"], .menu-brand-list img';
    await page.waitForSelector(brandTabSelector, { timeout: 10000 }).catch(() => console.log('Brand tabs not found...'));
    
    let menuBrandTabs = await page.$$(brandTabSelector);
    let menuBrandsCount = menuBrandTabs.length || 1;
    
    for (let i = 0; i < menuBrandsCount; i++) {
        const tabs = await page.$$(brandTabSelector);
        if (tabs.length > i) {
            const tab = tabs[i];
            const brandName = await page.evaluate(el => el.textContent.trim() || el.getAttribute('alt') || 'Unknown Brand', tab);
            
            console.log(`\n🍔 Scraping brand: ${brandName}`);
            await tab.click().catch(() => {});
            await randomDelay(3000, 4000);
        }

        const brandNameFallback = await page.evaluate(() => {
            const activeTab = document.querySelector('.brand-tab.active, [class*="ActiveBrand"]');
            if (activeTab) return activeTab.textContent.trim();
            const heading = document.querySelector('h1, .brand-title');
            if (heading) return heading.textContent.trim();
            return document.title.split('-')[0].trim() || 'EatClub Brand';
        });

        // Scroll fully down
        await page.evaluate(async () => {
            await new Promise((resolve) => {
                let totalHeight = 0;
                const distance = 300;
                const timer = setInterval(() => {
                    const scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;
                    if (totalHeight >= scrollHeight - window.innerHeight) {
                        clearInterval(timer);
                        resolve();
                    }
                }, 100);
            });
        });
        await randomDelay(2000, 3000);

        const itemsInfo = await page.evaluate((defaultBrand) => {
            const cards = document.querySelectorAll('.product-card, .item-card, [data-testid*="product"], .product-wrapper');
            const results = [];
            
            for (const card of cards) {
                try {
                    const itemName = card.querySelector('.product-title, .product-name, h3')?.textContent?.trim();
                    if (!itemName) continue;
                    
                    const imageUrl = card.querySelector('.product-img img, img.product-image, img')?.src || '';
                    const descriptionText = card.querySelector('.clamped-text, .product-desc')?.textContent?.trim() || '';
                    
                    const priceStr = card.querySelector('.price, .cost')?.textContent?.trim() || '';
                    const passPriceStr = card.querySelector('.membership-price-container b, .eatclub-pass-price, .discount-price')?.textContent?.trim() || '';
                    
                    const parsePrice = (str) => {
                        if (!str) return null;
                        const num = parseInt(str.replace(/[^0-9]/g, ''), 10);
                        return isNaN(num) ? null : num;
                    };

                    const originalPrice = parsePrice(priceStr);
                    const eatclubPassPrice = parsePrice(passPriceStr) || (originalPrice ? Math.floor(originalPrice * 0.7) : null);
                    
                    let portion = "Standard Portion";
                    let ingredients = [];

                    if (descriptionText.includes('[') && descriptionText.includes(']')) {
                        const match = descriptionText.match(/\[(.*?)\]/);
                        if (match) {
                            portion = match[1];
                        }
                    }
                    
                    if (descriptionText) {
                        ingredients = descriptionText.split(',').map(s => s.replace(/\[|\]/g, '').trim()).filter(Boolean);
                    }

                    results.push({
                        brand: defaultBrand,
                        item_name: itemName,
                        image_url: imageUrl,
                        description: descriptionText,
                        ingredients: ingredients,
                        portion: portion,
                        original_price: originalPrice,
                        eatclub_pass_price: eatclubPassPrice
                    });
                } catch(error) { void error; }
            }
            return results;
        }, brandNameFallback);

        for (const item of itemsInfo) {
             dbResult.push(item);
             console.log(`   ✔️ ${item.item_name} | Orig: ₹${item.original_price}`);
        }
    }

    await fs.writeFile('menu_database.json', JSON.stringify(dbResult, null, 2), 'utf-8');
    console.log(`\n🎉 Extracted ${dbResult.length} items to menu_database.json`);

  } catch (error) {
    console.error('🚨 Failed:', error);
  } finally {
    await browser.close();
  }
})();
