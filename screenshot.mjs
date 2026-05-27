import puppeteer from 'puppeteer-core';

const browser = await puppeteer.launch({
  executablePath: 'F:\\MobileTasks\\chrome\\win64-149.0.7827.22\\chrome-win64\\chrome.exe',
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

async function shot(page, name) {
  await page.screenshot({ path: name, fullPage: true });
  console.log('📸', name);
}

const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844 });
page.on('pageerror', err => console.log('PAGEERROR:', err.message.slice(0,100)));
page.on('console', msg => { if (msg.type()==='error') console.log('[err]', msg.text().slice(0,100)); });

await page.goto('http://localhost:8082', { waitUntil: 'networkidle2', timeout: 30000 });
await new Promise(r => setTimeout(r, 3000));
await shot(page, 'screen-login.png');

// Fill fields
const inputs = await page.$$('input');
await inputs[0].click(); await inputs[0].type('test.op');
await inputs[1].click(); await inputs[1].type('test123');
await inputs[2].click(); await inputs[2].type('30');

// Find the Sign in button element and click via JS event
await page.evaluate(() => {
  const all = Array.from(document.querySelectorAll('div'));
  const btn = all.find(d => d.textContent?.trim() === 'Sign in' && d.children.length === 0);
  if (btn) {
    btn.scrollIntoView();
    btn.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, isPrimary: true }));
    btn.dispatchEvent(new PointerEvent('pointerup',   { bubbles: true, isPrimary: true }));
    btn.dispatchEvent(new MouseEvent('click',          { bubbles: true }));
    console.log('Clicked Sign in');
  } else {
    console.log('Not found. Divs:', all.map(d=>d.textContent?.trim()).filter(t=>t&&t.length<20).join('|'));
  }
});

await new Promise(r => setTimeout(r, 6000));
await shot(page, 'screen-after-login.png');

const body = await page.evaluate(() => document.body.innerText.slice(0, 500));
console.log('\n=== SCREEN TEXT ===\n', body);

await browser.close();
