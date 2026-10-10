const assert = require('node:assert/strict');
const fs = require('node:fs'), os = require('node:os'), path = require('node:path');
const { chromium } = require('playwright-core');
const root = path.resolve(__dirname, '..');
(async () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(),'stn-feishu-test-'));
  let context;
  try {
    const extension = path.join(temp,'extension'); fs.mkdirSync(extension);
    for (const entry of fs.readdirSync(root)) if (entry !== 'manifest.json' && entry !== '.git') fs.symlinkSync(path.join(root,entry),path.join(extension,entry));
    const manifest = JSON.parse(fs.readFileSync(path.join(root,'manifest.json')));
    manifest.host_permissions.push('https://linux.do/*');
    fs.writeFileSync(path.join(extension,'manifest.json'),JSON.stringify(manifest));
    context = await chromium.launchPersistentContext(path.join(temp,'profile'), { executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless:true, viewport:{width:1280,height:1600}, ignoreDefaultArgs:['--disable-extensions'],args:['--enable-unsafe-extension-debugging'] });
    const cdp = await context.browser().newBrowserCDPSession();
    const {id} = await cdp.send('Extensions.loadUnpacked',{path:extension});
    const source = await context.newPage();
    await source.route('https://linux.do/**', route => route.fulfill({contentType:'text/html',body:fs.readFileSync(path.join(root,'stn-adapt/sample-linuxdo-comments.html'),'utf8')}));
    await source.goto('https://linux.do/t/topic/1675456');
    const page = await context.newPage(); await page.goto(`chrome-extension://${id}/stn-feishu/index.html`);
    const worker = context.serviceWorkers().find(w=>w.url().includes(id)) || await context.waitForEvent('serviceworker');
    const sourceId = await worker.evaluate(async () => (await chrome.tabs.query({})).find(t=>t.url?.startsWith('https://linux.do/')).id);
    const captured = await page.evaluate(async tabId=>ask('capture',{tabId}),sourceId);
    assert.match(captured.content,/楼|回复/);
    assert(captured.content.length>100);
    await page.goto(`chrome-extension://${id}/stn-feishu/index.html?tabId=${sourceId}`);
    await page.waitForFunction(()=>document.getElementById('status').textContent.includes('正文已提取'));
    assert.equal(await page.locator('#save').isDisabled(),false);
    assert(await page.locator('#title').inputValue());
    const prepared = await page.evaluate(()=>article);
    assert.match(prepared.html,/原文/); assert.doesNotMatch(prepared.html,/<img\b/);
    const denied = await worker.evaluate(async()=>{
      try { await feishuMessage({action:'config'},{id:chrome.runtime.id,url:'https://linux.do/t/topic/1',tab:{id:1,url:'https://linux.do'}}); return false; } catch (_) { return true; }
    }); assert(denied);
    const foreignDenied = await worker.evaluate(async()=>{try {await feishuMessage({action:'open'},{id:'other'});return false;}catch(_){return true;}});assert(foreignDenied);
    const publicPopup = await context.newPage(); await publicPopup.goto(`chrome-extension://${id}/popup/index.html`);
    await publicPopup.getByRole('button',{name:'保存到飞书',exact:true}).waitFor();
    assert.equal(await publicPopup.evaluate(async()=>{const r=await chrome.runtime.sendMessage({type:'stn-feishu',action:'config'});return r.ok;}),false);
    await source.evaluate(()=>{const selection=getSelection(),range=document.createRange();range.selectNodeContents(document.querySelector('.cooked'));selection.removeAllRanges();selection.addRange(range);});
    const selected = await page.evaluate(tabId=>ask('capture',{tabId,selection:true}),sourceId); assert(selected.content.length>10);
    await worker.evaluate(()=>{
      globalThis.fetch = async (url,options) => ({ ok:true,json:async()=> url.includes('/internal') ? {code:0,tenant_access_token:'test-token'} : url.endsWith('/convert') ? {code:0,data:{first_level_block_ids:['p'],blocks:[{block_id:'p',block_type:2,text:{elements:[{text_run:{content:'test'}}]}}]}} : url.endsWith('/documents') ? {code:0,data:{document:{document_id:'test-doc'}}} : {code:0,data:{}} });
    });
    await page.locator('#settings').evaluate(el=>el.open=true);
    await page.locator('#appId').fill('cli_test'); await page.locator('#appSecret').fill('fake-secret');
    await page.getByRole('button',{name:'验证并保存设置'}).click();
    await page.waitForFunction(()=>document.getElementById('status').textContent.includes('应用凭证已验证'));
    assert.equal(await page.locator('#appSecret').inputValue(),'');
    const config = await page.evaluate(()=>ask('config')); assert.equal(config.hasSecret,true); assert.equal(config.appSecret,undefined);
    await page.locator('#save').scrollIntoViewIfNeeded();
    await page.waitForTimeout(250);
    await page.locator('#save').click();
    await page.waitForFunction(()=>document.getElementById('status').textContent.startsWith('已保存到飞书'));
    assert.match(await page.locator('#result').getAttribute('href'),/test-doc/);
    await page.locator('#settings').evaluate(el=>el.open=true);
    await page.locator('#forget').scrollIntoViewIfNeeded(); await page.waitForTimeout(250);
    await page.locator('#forget').click();
    await page.waitForFunction(()=>document.getElementById('status').textContent.includes('已清除'));
    assert.equal((await page.evaluate(()=>ask('config'))).hasSecret,false);
    console.log('PASS Feishu extension: page capture, selection, preview, private-message gate, credential storage, save UI and clearing');
  } finally { if(context)await context.close();fs.rmSync(temp,{recursive:true,force:true}); }
})().catch(e=>{console.error(e);process.exitCode=1;});
