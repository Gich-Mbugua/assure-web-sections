// Run: NODE_PATH="$CODEX_PRIMARY_RUNTIME_NODE_MODULES" node tests/enquiry.cjs
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage();
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('file://'+path.resolve(__dirname,'../project-enquiry/demo.html'));
 const f=n=>page.locator(`[name="${n}"]`);
 await page.locator('[type=submit]').click();
 assert(await page.locator('.asl-output').isHidden());
 for(const [n,v] of Object.entries({name:'Jane Client',project:'Shop fit-out',location:'Nairobi',phone:'+254 712 345678',email:'jane@example.com'}))await f(n).fill(v);
 await f('name').fill('   ');await page.locator('[type=submit]').click();assert(await page.locator('.asl-output').isHidden());await f('name').fill('Jane Client');
 await f('phone').fill('abc123');await page.locator('[type=submit]').click();assert(await page.locator('.asl-output').isHidden());await f('phone').fill('+254 712 345678');
 await f('email').fill('wrong');await page.locator('[type=submit]').click();assert(await page.locator('.asl-output').isHidden());await f('email').fill('jane@example.com');
 for(const type of ['Exhibition booth','Signage','Branding','Interior fit-out']){
 await f('type').selectOption(type);await page.locator('[type=submit]').click();assert((await f('summary').inputValue()).includes('Project type: '+type));
 }
 await f('width').fill('-1');await page.locator('[type=submit]').click();assert(await page.locator('.asl-output').isHidden());await f('width').fill('5');await f('depth').fill('2');
 await f('dateStatus').selectOption('Fixed deadline');await page.locator('[type=submit]').click();assert(await page.locator('.asl-output').isHidden());
 await f('date').fill('2020-01-01');await page.locator('[type=submit]').click();assert(await page.locator('.asl-output').isHidden());await f('date').fill('2099-12-20');
 await f('budgetStatus').selectOption('Indicative budget available');await page.locator('[type=submit]').click();assert(await page.locator('.asl-output').isHidden());await f('budget').fill('50000');
 await f('requirements').fill('<img src=x onerror=alert(1)>');await page.locator('[type=submit]').click();
 assert((await f('summary').inputValue()).includes('width: 5 × depth: 2 × height: TBC'));
 assert((await f('summary').inputValue()).includes('<img src=x onerror=alert(1)>'));assert.equal(await page.locator('.asl-output img').count(),0);
 await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{value:undefined,configurable:true}));await page.locator('.asl-copy').click();assert((await page.locator('.asl-status').textContent()).includes('Automatic copy is unavailable'));
 await page.evaluate(()=>{window.copied='';Object.defineProperty(navigator,'clipboard',{value:{writeText:async text=>{window.copied=text}},configurable:true});});await page.locator('.asl-copy').click();assert.equal(await page.evaluate(()=>window.copied),await f('summary').inputValue());
 await f('project').fill('Changed');assert(await page.locator('.asl-output').isHidden());
 for(const width of [320,375,768,1280]){await page.setViewportSize({width,height:900});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Overflow at ${width}`);}
 await page.locator('[type=reset]').click();await page.waitForTimeout(30);assert.equal(await f('name').inputValue(),'');assert(await page.locator('.asl-output').isHidden());
 assert.deepEqual(errors,[]);
 // Multiple Elementor widget instances remain independent.
 await page.evaluate(()=>{const root=document.querySelector('.asl-enquiry');const copy=root.cloneNode(true);delete copy.dataset.aslReady;document.body.append(copy);const script=document.createElement('script');script.textContent=root.querySelector('script').textContent;document.body.append(script);});
 const second=page.locator('.asl-enquiry').nth(1);await second.locator('[name=name]').fill('Second');assert.equal(await f('name').first().inputValue(),'');
 const nojs=await browser.newContext({javaScriptEnabled:false});const plain=await nojs.newPage();await plain.goto(page.url());assert(await plain.locator('[type=submit]').isDisabled());await nojs.close();
 await browser.close();console.log('PASS: validation, four types, summary, XSS-safe text, clipboard paths, stale output, reset, four viewport widths, multiple instances, no-JS protection.');
})().catch(e=>{console.error(e);process.exit(1)});
