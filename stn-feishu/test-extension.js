const assert = require('node:assert/strict');
const fs = require('node:fs'), os = require('node:os'), path = require('node:path');
const { chromium } = require('playwright-core');
const root = path.resolve(__dirname, '..');
(async () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(),'stn-feishu-hook-test-'));let context;
  try {
    const extension=path.join(temp,'extension');fs.mkdirSync(extension);
    for(const entry of fs.readdirSync(root))if(entry!=='.git'&&entry!=='popup')fs.symlinkSync(path.join(root,entry),path.join(extension,entry));
    fs.cpSync(path.join(root,'popup'),path.join(extension,'popup'),{recursive:true});
    const mainPath=path.join(extension,'popup/static/js/main-feishu.js');
    const main=fs.readFileSync(mainPath,'utf8'),component=fs.readFileSync(path.join(root,'stn-feishu/control-component.js'),'utf8').split('function StnFeishuControl')[1];
    assert(main.includes('function StnFeishuControl'+component));
    // Test-only export renders the actual bundled Fields component and its real checkbox.
    const expose="globalThis.__stnRenderFields=function(props){var host=document.getElementById('stn-native-fields-test');if(!host){host=document.createElement('div');host.id='stn-native-fields-test';host.style.cssText='position:fixed;left:16px;right:16px;top:100px;padding:12px;background:white;z-index:5000';document.body.append(host);}a.render((0,sa.jsx)(Fge,props),host);};";
    fs.writeFileSync(mainPath,main.replace('function Fge(e){',expose+'function Fge(e){'));
    context = await chromium.launchPersistentContext(path.join(temp,'profile'), { executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless:true, viewport:{width:1280,height:1600},ignoreDefaultArgs:['--disable-extensions'],args:['--enable-unsafe-extension-debugging'] });
    const cdp = await context.browser().newBrowserCDPSession();const {id} = await cdp.send('Extensions.loadUnpacked',{path:extension});
    const page = await context.newPage();await page.goto(`chrome-extension://${id}/stn-feishu/index.html`);
    const worker = context.serviceWorkers().find(w=>w.url().includes(id)) || await context.waitForEvent('serviceworker');
    assert.equal(await page.locator('#enabled').isChecked(),false);
    assert.equal(await page.getByRole('button',{name:'保存到飞书',exact:true}).count(),0);
    await worker.evaluate(()=>{
      globalThis.feishuCalls=[];
      globalThis.fetch=async(url,options)=>{
        feishuCalls.push({url,body:JSON.parse(options.body)});
        if((globalThis.failFeishu && !url.includes('/internal')) || (globalThis.failSharing && url.includes('/permissions/')))return{ok:false,json:async()=>({code:999,msg:'mock Feishu denied'})};
        return{ok:true,json:async()=>url.includes('/internal')?{code:0,tenant_access_token:'fake-token'}:url.endsWith('/convert')?{code:0,data:{first_level_block_ids:['p'],blocks:[{block_id:'p',block_type:2,text:{elements:[]}}]}}:url.endsWith('/documents')?{code:0,data:{document:{document_id:'testdoc'}}}:{code:0,data:{}}};
      };
      rn=()=>{};K=async()=>({});_a=async()=>({success:true});
      y.capturedWebpage.get=async()=>({id:'capture'});y.custom.createHighlight=async value=>value;y.custom.createCapturedWebpage=async value=>value;
      no=async()=>{if(globalThis.failNotion)throw new Error('mock Notion failed');return{savingAs:'page',notionBlockId:'notion-test',notionParentId:'parent',title:'标题'};};
      globalThis.capture={session:{page:{id:'parent',type:'collection',spaceId:'space'},notionContext:{spacesMap:{space:{linkedUserIds:['user']}}}},payload:{type:'note',note:[['编辑后的标题']],properties:{content:{content:{type:'list',items:[{markdown:'## 所选第 3 楼\n\n```js\nconst a = 1;\n```'},{markdown:'所选评论\n\n![截图](https://example.com/image.png)'}]}}}},context:{executeDirectly:true,url:'https://linux.do/t/topic/1'}};
    });
    await page.locator('#appId').fill('cli_test');await page.locator('#appSecret').fill('fake-secret');await page.getByRole('button',{name:'验证并保存设置'}).click();
    await page.waitForFunction(()=>document.getElementById('status').textContent.includes('保持关闭'));
    const config=await page.evaluate(()=>ask('config'));assert.equal(config.enabled,false);assert.equal(config.appSecret,undefined);
    // Exercise the actual Notion submit handler, with only the remote Notion writer mocked.
    assert.equal(await worker.evaluate(()=>M.submitCapture(capture,{}, {onProgress(){}})),true);
    await worker.evaluate(()=>new Promise(resolve=>setTimeout(resolve,100)));
    assert.equal(await worker.evaluate(()=>feishuCalls.length),1); // Credential validation only; hook OFF.
    await page.evaluate(()=>ask('toggle',{enabled:true}));
    assert.equal(await worker.evaluate(()=>M.submitCapture(capture,{}, {onProgress(){}})),true);
    await page.waitForFunction(async()=> (await ask('state')).lastResult?.state==='success');
    const converted=await worker.evaluate(()=>feishuCalls.find(c=>c.url.endsWith('/convert')).body);
    assert.equal(converted.content_type,'markdown');assert.match(converted.content,/所选第 3 楼/);assert.match(converted.content,/所选评论/);assert.match(converted.content,/const a = 1;/);assert.doesNotMatch(converted.content,/!\[/);
    const linkedTitle=await worker.evaluate(()=>feishuArticleFromCapture({...capture,payload:{...capture.payload,note:[['[🔗 link]',[['a','https://example.com']]],[' — 编辑后的标题']]}},{title:'原标题'}).title);assert.equal(linkedTitle,'编辑后的标题');
    const created=await worker.evaluate(()=>feishuCalls.find(c=>c.url.endsWith('/documents')).body);assert.equal(created.title,'编辑后的标题');
    const before=await worker.evaluate(()=>{globalThis.failNotion=true;return feishuCalls.length;});
    assert.equal(await worker.evaluate(()=>M.submitCapture(capture,{}, {onProgress(){}})),false);
    assert.equal(await worker.evaluate(()=>feishuCalls.length),before);
    await worker.evaluate(()=>{globalThis.failNotion=false;globalThis.failFeishu=true;});
    assert.equal(await worker.evaluate(()=>M.submitCapture(capture,{}, {onProgress(){}})),true);
    await page.waitForFunction(async()=> (await ask('state')).lastResult?.state==='error');
    await worker.evaluate(()=>{globalThis.failFeishu=false;globalThis.failSharing=true;});
    assert.equal(await worker.evaluate(()=>M.submitCapture(capture,{}, {onProgress(){}})),true);
    await page.waitForFunction(async()=>!!(await ask('state')).lastResult?.permissionError);
    const restricted=(await page.evaluate(()=>ask('state'))).lastResult;assert.equal(restricted.partial,false);assert.equal(restricted.accessConfigured,false);
    await worker.evaluate(()=>{globalThis.failSharing=false;});
    await page.locator('#repairAccess').click();await page.waitForFunction(()=>document.getElementById('status').textContent.includes('重新打开文档即可'));
    assert.equal((await page.evaluate(()=>ask('state'))).lastResult.state,'success');
    const denied=await worker.evaluate(async()=>{try{await feishuMessage({action:'config'},{id:chrome.runtime.id,url:'https://linux.do',tab:{url:'https://linux.do'}});return false;}catch(_){return true;}});assert(denied);
    const popup=await context.newPage();await popup.goto(`chrome-extension://${id}/popup/index.html`);
    await popup.waitForFunction(()=>typeof __stnRenderFields==='function');
    await popup.setViewportSize({width:420,height:560});
    await popup.evaluate(()=>{window.moreFieldsClicks=0;__stnRenderFields({text:'3 more fields',hide:false,isExpanded:false,onClick:()=>{moreFieldsClicks++;}});});
    await popup.getByLabel('同步到飞书').waitFor();assert.equal(await popup.getByLabel('同步到飞书').isChecked(),true);
    assert.equal(await popup.getByRole('button',{name:'保存到飞书',exact:true}).count(),0);
    const fieldBounds=await popup.getByRole('button',{name:'3 more fields',exact:true}).boundingBox();
    let bounds=await popup.getByLabel('同步到飞书').boundingBox();assert(bounds.y>=0&&bounds.y+bounds.height<=560);assert(Math.abs(bounds.y-fieldBounds.y)<35);assert(bounds.x>fieldBounds.x+fieldBounds.width);
    await popup.getByRole('button',{name:'3 more fields',exact:true}).click();assert.equal(await popup.evaluate(()=>moreFieldsClicks),1);
    await popup.evaluate(()=>__stnRenderFields({text:'3 more fields',hide:false,isExpanded:true,onClick:()=>{moreFieldsClicks++;}}));
    assert.equal(await popup.getByLabel('同步到飞书').isChecked(),true);
    await popup.getByLabel('同步到飞书').uncheck();await page.waitForFunction(async()=>!(await ask('state')).enabled);
    const after=await worker.evaluate(()=>feishuCalls.length);
    assert.equal(await worker.evaluate(()=>M.submitCapture(capture,{}, {onProgress(){}})),true);
    await worker.evaluate(()=>new Promise(resolve=>setTimeout(resolve,100)));assert.equal(await worker.evaluate(()=>feishuCalls.length),after);
    await page.locator('#forget').click();await page.waitForFunction(()=>document.getElementById('status').textContent.includes('已清除'));
    assert.equal((await page.evaluate(()=>ask('config'))).hasSecret,false);
    console.log('PASS actual Notion save hook: OFF by default, exact selected content/title, success-only, isolated Feishu failure, inline toggle, private credentials, tenant-only sharing, access repair, native more-fields row, compact viewport visibility, React rerender, clearing');
  } finally {if(context)await context.close();fs.rmSync(temp,{recursive:true,force:true});}
})().catch(error=>{console.error(error);process.exitCode=1;});
