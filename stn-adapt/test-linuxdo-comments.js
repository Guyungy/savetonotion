const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright-core');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'scanWebpage.js'), 'utf8');
const clipSource = fs.readFileSync(path.join(root, 'clipContent.js'), 'utf8');
const metaSource = fs.readFileSync(path.join(root, 'parseMetaTags.js'), 'utf8');
const helper = s => s.slice(s.indexOf('function getLinuxDoArticle('), s.indexOf('\n}', s.indexOf('function getLinuxDoArticle(')) + 2);
assert.equal(helper(source), helper(clipSource));
assert.equal(helper(source), helper(metaSource));
const utilitySource = clipSource.slice(clipSource.indexOf('function getLinuxDoArticle('), clipSource.indexOf('exports.serializeClipContent = serializeClipContent;'));
const fixture = fs.readFileSync(path.join(__dirname, 'sample-linuxdo-comments.html'), 'utf8');
const worker = fs.readFileSync(path.join(root, 'serviceWorker.js'), 'utf8');
const scanDispatch = worker.slice(worker.indexOf('async function Wc('), worker.indexOf('async function Wc(') + 1800);
assert.match(scanDispatch, /linuxDoScope:t\?\.linuxDoScope/);
assert.match(scanDispatch, /linuxDoPostNumber:t\?\.linuxDoPostNumber/);
const chromePath = process.env.CHROME_PATH || (process.platform === 'darwin' ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' : undefined);
(async () => {
  const browser = await chromium.launch({ ...(chromePath && { executablePath: chromePath }), headless: true });
  try {
    const page = await browser.newPage();
    let apiCalls = 0;
    await page.route('**/*', r => {
      if (r.request().url().includes('.json')) { apiCalls++; return r.fulfill({ status: 403, body: '{}' }); }
      return r.request().isNavigationRequest() ? r.fulfill({ contentType: 'text/html; charset=utf-8', body: fixture }) : r.abort();
    });
    const scan = async (opts = {}) => {
      await page.evaluate(opts => {
        delete window.scanResult;
        window.extraParamsJson = JSON.stringify(opts); window.asyncId = 'comment-test';
        window.chrome = { runtime: { sendMessage: (result, cb) => { window.scanResult = result; cb({}); } } };
      }, opts);
      await page.addScriptTag({ content: source });
      await page.waitForFunction(() => window.scanResult);
      return page.evaluate(() => window.scanResult);
    };
    const serialize = async selector => {
      await page.addScriptTag({ content: utilitySource + ';window.serializeLinuxDoTest = serializeClipContent;' });
      return page.evaluate(selector => window.serializeLinuxDoTest(document.querySelector(selector)), selector);
    };
    for (const v2 of [false, true]) {
      await page.goto('https://linux.do/t/topic/1675456/57?u=test#reply');
      const floors = await page.evaluate(() => Array.from(document.querySelectorAll('article[id^="post_"]')).filter(p => p.querySelector('.cooked')).map(p => Number(p.id.slice(5))));
      assert.ok(floors.length > 1);
      assert.ok(!floors.includes(1));
      const range = await scan({ v2 });
      assert.equal(range.author, 'fancyukyo');
      assert.equal(range.url, 'https://linux.do/t/topic/1675456/57');
      assert.match(range.content, /感谢佬友分享经验，我将仔细研读/);
      assert.match(range.content, /可惜不好认证/);
      assert.match(range.content, /啊？我这测试没问题呢/);
      assert.ok(range.postNumbers.includes(65), 'expanded reply is included even when main floor is unloaded');
      for (const n of floors) assert.ok(range.postNumbers.includes(n));
      assert.equal(new Set(range.postNumbers).size, range.postNumbers.length);
      assert.doesNotMatch(range.content, /post-controls|show-replies|user_avatar|discourse-reactions/);
      assert.equal(apiCalls, 0, 'loaded page range never requests the entire discussion');
      const floor = await scan({ v2, linuxDoScope: 'post' });
      assert.deepEqual(floor.postNumbers, [57]);
      assert.match(floor.content, /感谢佬友分享经验，我将仔细研读/);
      assert.doesNotMatch(floor.content, /可惜不好认证|啊？我这测试没问题呢/);
      const selected = await scan({ v2, contentSelector: '#post_53' });
      assert.deepEqual(selected.postNumbers, [53]);
      assert.equal(selected.author, 'hyruur');
      assert.match(selected.content, /可惜不好认证/);
      assert.doesNotMatch(selected.content, /感谢佬友分享经验，我将仔细研读/);
      const missing = await scan({ v2, contentSelector: '#not-found' });
      assert.equal(missing.content, ''); assert.match(missing.error, /选取区域/);
      assert.equal(apiCalls, 0);
      await page.addScriptTag({ content: metaSource.replace('const response = parseMetaTags();', 'const response = parseMetaTags();window.metaResult = response;') });
      const meta = await page.evaluate(() => window.metaResult);
      assert.equal(meta.author, 'fancyukyo');
      assert.equal(meta.url, range.url);
      console.log('PASS ' + (v2 ? 'Markdown' : 'HTML') + ': loaded range, expanded comments, selected floor, reply URL/author, no out-of-range fetch');
    }
    const commentHTML = await serialize('#embedded-posts__bottom--52');
    assert.match(commentHTML, /#65.*sauterne/);
    assert.match(commentHTML, /回复 #52/);
    assert.match(commentHTML, /啊？我这测试没问题呢/);
    assert.doesNotMatch(commentHTML, /可惜不好认证|感谢佬友分享经验，我将仔细研读|user_avatar/);
    const paragraph = await serialize('#post_52 .cooked > p');
    assert.match(paragraph, /alan1020456/);
    assert.doesNotMatch(paragraph, /这个链接贴错了|啊？我这测试没问题呢/);
    const image = await serialize('#post_52 .cooked img');
    assert.match(image, /original\/4X\/9\/9\/e\/99ebb584a044456df7e0cbf29227eeb6a4423fc1.png/);
    assert.doesNotMatch(image, /这个链接贴错了/);
    const wholeFloor = await serialize('#post_52');
    assert.match(wholeFloor, /这个链接贴错了/);
    assert.match(wholeFloor, /啊？我这测试没问题呢/);
    assert.doesNotMatch(wholeFloor, /post-controls|user_avatar/);
    // A duplicate embedded reply and stream floor must occur only once in a page capture.
    await page.evaluate(() => {
      const body = document.querySelector('#embedded-posts__bottom--52 .cooked').innerHTML;
      document.querySelector('.post-stream').insertAdjacentHTML('beforeend', '<article id="post_65"><div class="names"><a data-user-card="sauterne">sauterne</a></div><div class="cooked">'+body+'</div></article>');
    });
    const dedup = await scan({ v2: true });
    assert.equal(dedup.postNumbers.filter(n => n === 65).length, 1);
    assert.equal((dedup.content.match(/啊？我这测试没问题呢/g) || []).length, 1);
    await page.goto('https://example.com');
    await page.evaluate(() => { document.body.insertAdjacentHTML('beforeend', '<p id="generic-selection"><b>Keep formatting</b></p>'); });
    assert.equal(await serialize('#generic-selection'), '<p id="generic-selection"><b>Keep formatting</b></p>');
    console.log('PASS area selection: single paragraph/image, whole floor with comments, expanded comment-only range, deduplication, other hosts unchanged');
    // Exercise the actual webpack bundle's area-picker payload, not only its serializer.
    await page.goto('https://linux.do/t/topic/1675456/57');
    await page.evaluate(() => {
      window.action = 'startClipContent'; window.props = {}; window.asyncId = 'clip-test'; window.idName = 'clip-test';
      window.chrome = { runtime: { sendMessage: (message, cb) => { if (message.type === 'asyncExec') window.clipResult = message; cb?.({}); } } };
    });
    await page.addScriptTag({ content: clipSource });
    await page.locator('#post_53 .cooked p').hover();
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    await page.locator('#post_53 .cooked p').click();
    await page.locator('#stn-confirm-button').click();
    await page.waitForFunction(() => window.clipResult);
    const picked = await page.evaluate(() => window.clipResult);
    assert.equal(picked.success, true);
    assert.match(picked.payload.html, /#53.*hyruur/);
    assert.match(picked.payload.html, /可惜不好认证/);
    assert.doesNotMatch(picked.payload.html, /感谢佬友分享经验，我将仔细研读/);
    console.log('PASS actual area-picker bundle: hover → selection → confirmation → comment payload');

  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
