// Real first-post DOM captured from linux.do/t/topic/1675456, without session data.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright-core');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(__dirname, 'sample-linuxdo.html'), 'utf8');
const scanSource = fs.readFileSync(path.join(root, 'scanWebpage.js'), 'utf8');
const metaSource = fs.readFileSync(path.join(root, 'parseMetaTags.js'), 'utf8');
const helper = source => source.slice(source.indexOf('function getLinuxDoArticle('), source.indexOf('\n}', source.indexOf('function getLinuxDoArticle(')) + 2);
assert.equal(helper(scanSource), helper(metaSource), 'metadata and content use the same site rules');
const workerSource = fs.readFileSync(path.join(root, 'serviceWorker.js'), 'utf8');
const linuxRule = workerSource.match(/"linux\.do":\{url:e=>e\.url\}/)[0];
const rules = new Function('return ({' + linuxRule + '})')();
const metadataPipeline = workerSource.slice(workerSource.indexOf('async function Lt('), workerSource.indexOf('function aa('));
const readMetadata = new Function('jt', 'oa', metadataPipeline + '; return Lt;');
const chromePath = process.env.CHROME_PATH || (process.platform === 'darwin' ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' : undefined);
(async () => {
  const browser = await chromium.launch({ ...(chromePath && { executablePath: chromePath }), headless: true });
  try {
    const page = await browser.newPage();
    let apiStatus = 200, apiCalls = 0, firstPost;
    await page.route('**/*', route => {
      if (/\/t\/1675456\.json(?:\?post_number=\d+)?$/.test(route.request().url())) {
        apiCalls++;
        return route.fulfill({ status: apiStatus, contentType: 'application/json', body: JSON.stringify({ title: '首帖接口标题', post_stream: { posts: [firstPost, { post_number: 57, cooked: '<p>错误的回帖</p>' }] } }) });
      }
      return route.request().isNavigationRequest() ? route.fulfill({ contentType: 'text/html; charset=utf-8', body: html }) : route.abort();
    });
    const scan = async (options = {}) => {
      await page.evaluate(options => {
        delete window.scanResult;
        window.extraParamsJson = JSON.stringify(options);
        window.asyncId = 'linuxdo-test';
        window.chrome = { runtime: { sendMessage: (result, cb) => { window.scanResult = result; cb({}); } } };
      }, options);
      await page.addScriptTag({ content: scanSource });
      await page.waitForFunction(() => window.scanResult);
      return page.evaluate(() => window.scanResult);
    };
    await page.goto('https://linux.do/t/topic/1675456');
    firstPost = await page.evaluate(() => ({ post_number: 1, username: 'sauterne', created_at: '2026-03-01T14:51:25.049Z', cooked: document.querySelector('#post_1 .cooked').innerHTML }));
    const original = await page.evaluate(() => ({ headings: document.querySelectorAll('#post_1 .cooked h1,#post_1 .cooked h2,#post_1 .cooked h3').length, title: document.querySelector('#topic-title h1').textContent.replace(/\s+/g, ' ').trim() }));
    for (const v2 of [false, true]) {
      await page.goto('https://linux.do/t/topic/1675456?u=test#reply');
      await page.evaluate(() => { document.body.insertAdjacentHTML('beforeend', '<aside>侧栏噪音</aside><article id="post_57"><div class="cooked">错误的回帖</div></article>'); });
      const result = await scan({ v2, v2OnlyCustomExtractor: true, linuxDoScope: 'first' });
      assert.equal(result.title, original.title);
      assert.equal(result.author, 'sauterne');
      assert.equal(result.published, firstPost.created_at);
      assert.equal(result.url, 'https://linux.do/t/topic/1675456');
      assert.match(result.content, /11.*查看学生资格/);
      assert.match(result.content, /github\.com\/dongshuyan\/GoogleAccount/);
      assert.match(result.content, /original\/4X\/a\/9\/6\/a969bf716c25e05d1b5e6499f13a10020375e00f\.png/);
      assert.match(result.content, /original\/4X\/c\/7\/4\/c745b0381db3da8fe6aa7ac6eab054a93e628075\.png/);
      assert.doesNotMatch(result.content, /错误的回帖|侧栏噪音|TOPIC OWNER|ai-summarization-button|post-controls|site-icon|user_avatar/);
      if (v2) {
        assert.equal(result.contentFormat, 'md');
        assert.equal((result.content.match(/^#{1,6} /gm) || []).length, original.headings + 1);
        assert.ok(result.preview);
      } else {
        const headings = await page.evaluate(content => { const d = new DOMParser().parseFromString(content, 'text/html'); return d.querySelectorAll('h1,h2,h3').length; }, result.content);
        assert.equal(headings, original.headings + 1);
      }
      await page.addScriptTag({ content: metaSource.replace('const response = parseMetaTags();', 'const response = parseMetaTags(); window.metaResult = response;') });
      const meta = await page.evaluate(() => window.metaResult);
      assert.equal(meta.title, original.title);
      assert.equal(meta.author, result.author);
      assert.equal(meta.publicationDate, result.published);
      assert.equal(meta.url, result.url);
      assert.equal(meta.image, result.image);
      const pipeline = readMetadata((_id, _opts, cb) => cb([meta]), rules);
      const merged = await pipeline({ id: 1, url: 'https://linux.do/t/topic/1675456/57?u=test' });
      assert.equal(merged.url, result.url, 'background pipeline retains the normalized topic URL');
      assert.equal(apiCalls, 0, 'loaded first post never fetches');
      console.log(`PASS real DOM: ${v2 ? 'Markdown' : 'HTML'}, ${original.headings} headings, author/date, original images, no forum noise`);
      await page.goto('https://linux.do/t/topic/1675456/57');
      await page.evaluate(() => { document.querySelector('#post_1').remove(); document.body.insertAdjacentHTML('beforeend', '<article id="post_57"><div class="cooked">错误的回帖</div></article>'); });
      const recovered = await scan({ v2, linuxDoScope: 'first' });
      assert.equal(recovered.title, '首帖接口标题');
      assert.equal(recovered.author, 'sauterne');
      assert.equal(recovered.url, 'https://linux.do/t/topic/1675456');
      assert.match(recovered.content, /11.*查看学生资格/);
      assert.doesNotMatch(recovered.content, /错误的回帖/);
      apiCalls = 0;
      apiStatus = 403;
      const failed = await scan({ v2, linuxDoScope: 'first' });
      assert.equal(failed.content, '');
      assert.match(failed.error, /#1.*403/);
      apiCalls = 0; apiStatus = 200;
      const skipped = await scan({ v2, skipContent: true });
      assert.equal(skipped.content, undefined);
      assert.equal(apiCalls, 0);
      console.log('PASS unloaded first post: API recovery, permission failure, skipContent');
    }
    await page.goto('https://example.com/t/topic/1675456');
    const generic = await scan();
    assert.notEqual(generic.author, 'sauterne', 'other hosts retain their generic parser');
    console.log('PASS unrelated host unchanged');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
