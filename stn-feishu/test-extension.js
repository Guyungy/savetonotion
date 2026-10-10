const assert = require('node:assert/strict');
const fs = require('node:fs'), os = require('node:os'), path = require('node:path');
const { chromium } = require('playwright-core');
const root = path.resolve(__dirname, '..');
(async () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(),'stn-feishu-hook-test-'));let context;
  try {
    context = await chromium.launchPersistentContext(path.join(temp,'profile'), { executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless:true, viewport:{width:1280,height:1600},ignoreDefaultArgs:['--disable-extensions'],args:['--enable-unsafe-extension-debugging'] });
    const cdp = await context.browser().newBrowserCDPSession();const {id} = await cdp.send('Extensions.loadUnpacked',{path:root});
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
    await popup.getByLabel('同步到飞书').waitFor();assert.equal(await popup.getByLabel('同步到飞书').isChecked(),true);
    assert.equal(await popup.getByRole('button',{name:'保存到飞书',exact:true}).count(),0);
    // A viewport-sized React panel clips nodes appended outside its footer.
    // Verify mounting into the actual save-controls slot at compact extension size.
    assert.match(fs.readFileSync(path.join(root,'popup/static/js/main.js'),'utf8'), /data-stn-feishu-hook-slot/);
    await popup.setViewportSize({width:420,height:560});
    const drawPanel = () => {
      const panel=document.createElement('div');panel.style.cssText='position:absolute;inset:0;display:flex;flex-direction:column;overflow:hidden;background:white';
      const header=document.createElement('div');header.textContent='保存页面';header.style.cssText='padding:20px;flex-shrink:0';
      const content=document.createElement('div');content.style.cssText='flex:1;min-height:0;overflow:auto';const large=document.createElement('div');large.style.height='1200px';content.append(large);
      const footer=document.createElement('div');footer.style.cssText='padding:16px;flex-shrink:0';
      const slot=document.createElement('div');slot.dataset.stnFeishuHookSlot='true';
      const save=document.createElement('button');save.textContent='保存到 Notion';save.style.cssText='height:40px;width:100%';footer.append(slot,save);panel.append(header,content,footer);document.getElementById('root').replaceChildren(panel);
    };
    await popup.evaluate(drawPanel);
    await popup.waitForFunction(()=>document.querySelector('[data-stn-feishu-hook-slot] #stn-feishu-hook'));
    let bounds=await popup.locator('#stn-feishu-hook').boundingBox();assert(bounds.y>=0 && bounds.y+bounds.height<=560);
    await popup.evaluate(drawPanel); // Re-render must remount without losing the hook.
    await popup.waitForFunction(()=>document.querySelector('[data-stn-feishu-hook-slot] #stn-feishu-hook'));
    bounds=await popup.locator('#stn-feishu-hook').boundingBox();assert(bounds.y>=0 && bounds.y+bounds.height<=560);
    await popup.getByLabel('同步到飞书').uncheck();await page.waitForFunction(async()=>!(await ask('state')).enabled);
    const after=await worker.evaluate(()=>feishuCalls.length);
    assert.equal(await worker.evaluate(()=>M.submitCapture(capture,{}, {onProgress(){}})),true);
    await worker.evaluate(()=>new Promise(resolve=>setTimeout(resolve,100)));assert.equal(await worker.evaluate(()=>feishuCalls.length),after);
    await page.locator('#forget').click();await page.waitForFunction(()=>document.getElementById('status').textContent.includes('已清除'));
    assert.equal((await page.evaluate(()=>ask('config'))).hasSecret,false);
    console.log('PASS actual Notion save hook: OFF by default, exact selected content/title, success-only, isolated Feishu failure, inline toggle, private credentials, tenant-only sharing, access repair, compact viewport visibility, React remount, clearing');
  } finally {if(context)await context.close();fs.rmSync(temp,{recursive:true,force:true});}
})().catch(error=>{console.error(error);process.exitCode=1;});
