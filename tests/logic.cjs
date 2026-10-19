// Dependency-free checks of the actual embedded script with a minimal DOM harness.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(require('node:path').join(__dirname,'../project-enquiry/elementor.html'),'utf8');
const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];new vm.Script(script);
const defaults={type:'Exhibition booth',measurement:'Estimated — site measurement needed',unit:'metres',installation:'Yes',dateStatus:'To be confirmed',budgetStatus:'To be confirmed',vat:'Not confirmed'};
const fields={};for(const name of [...html.matchAll(/name="([^"]+)"/g)].map(m=>m[1]))fields[name]={value:defaults[name]||'',error:'',setCustomValidity(s){this.error=s},focus(){},select(){this.selected=true}};
const handlers={},copy={},out={hidden:true},status={},guidance={},fieldset={},submit={};
const form={elements:{namedItem:n=>fields[n]},querySelector:s=>s==='fieldset'?fieldset:submit,addEventListener:(e,f)=>handlers[e]=f,reportValidity:()=>!Object.values(fields).some(f=>f.error||(f.required&&!f.value))};
const root={dataset:{},querySelector:s=>({'form':form,'.asl-output':out,'.asl-status':status,'.asl-guidance':guidance,'.asl-copy':{addEventListener:(e,f)=>copy[e]=f}}[s])};
const context={document:{querySelectorAll:()=>[root]},navigator:{},window:{isSecureContext:true},setTimeout:f=>f()};vm.runInNewContext(script,context);
const set=(n,v)=>{fields[n].value=v;handlers.input()};const generate=()=>handlers.submit({preventDefault(){}});
generate();assert(out.hidden);
for(const [n,v]of Object.entries({name:'Jane',project:'Display',phone:'+254712345678',email:'jane@example.com',location:'Nairobi'}))set(n,v);
for(const type of ['Exhibition booth','Signage','Branding','Interior fit-out']){set('type',type);generate();assert(!out.hidden);assert(fields.summary.value.includes(type));}
set('width','5');set('depth','2');set('requirements','<script>alert(1)</script>');generate();assert(fields.summary.value.includes('width: 5 × depth: 2 × height: TBC'));assert(fields.summary.value.includes('Estimated'));assert(fields.summary.value.includes('Budget: TBC'));assert(fields.summary.value.includes('<script>alert(1)</script>'));
set('dateStatus','Fixed deadline');assert(fields.date.required);generate();assert(out.hidden);set('date','2099-12-20');set('budgetStatus','Indicative budget available');generate();assert(out.hidden);set('budget','50000');generate();assert(!out.hidden);
set('name','   ');generate();assert(out.hidden);set('name','Jane');set('phone','bad');generate();assert(out.hidden);set('phone','+254712345678');generate();
(async()=>{await copy.click();assert(fields.summary.selected);assert(status.textContent.includes('Automatic copy'));let copied;context.navigator.clipboard={writeText:async s=>copied=s};await copy.click();assert.equal(copied,fields.summary.value);set('project','Updated');assert(out.hidden);assert.equal(fields.summary.value,'');handlers.reset();assert.equal(fields.phone.error,'');console.log('PASS: embedded script syntax, required text/phone logic, four project types, unknown details, dimension summary, conditional requirements, safe text, both copy paths, stale summary and reset. Native browser constraints/layout require browser suite.');})().catch(e=>{console.error(e);process.exitCode=1});
