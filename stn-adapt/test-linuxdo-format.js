const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright-core');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'scanWebpage.js'), 'utf8');
const fixturePath = process.argv[2] || path.join(__dirname, "sample-linuxdo-format.html");
if (!fixturePath) throw new Error('Usage: node stn-adapt/test-linuxdo-format.js <DOM snapshot>');
(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
  try {
    const page = await browser.newPage();
    await page.route('**/*', r => r.request().isNavigationRequest() ? r.fulfill({ contentType: 'text/html; charset=utf-8', body: fs.readFileSync(fixturePath, 'utf8') }) : r.abort());
    await page.goto('https://linux.do/t/topic/1923706');
    const original = await page.evaluate(() => ({ codes: Array.from(document.querySelectorAll('#post_1 .cooked pre code')).map(c => c.textContent.trim()), summaries: Array.from(document.querySelectorAll('#post_1 .cooked summary')).map(s => s.textContent.trim()), tables: document.querySelectorAll('#post_1 .cooked table').length }));
    assert.ok(original.summaries.length > 0);
    for (const v2 of [false, true]) {
      await page.evaluate(v2 => { delete window.result; window.extraParamsJson = JSON.stringify({ v2 }); window.asyncId = 'format'; window.chrome = { runtime: { sendMessage: (r, cb) => { window.result = r; cb({}); } } }; }, v2);
      await page.addScriptTag({ content: source });
      await page.waitForFunction(() => window.result);
      const result = await page.evaluate(() => window.result);
      for (const summary of original.summaries) assert.ok(result.content.includes(summary));
      assert.doesNotMatch(result.content, /codeblock-button-wrapper|<details|<summary/);
      if (v2) {
        assert.doesNotMatch(result.content, /\[!\[/);
        const blocks = Array.from(result.content.matchAll(/```[^\n]*\n([\s\S]*?)\n```/g)).map(m => m[1].trim());
        assert.deepEqual(blocks, original.codes, 'code indentation and newlines survive conversion');
        assert.match(result.content, /^> \*\*agent 的流程/m);
      } else {
        const counts = await page.evaluate(content => { const d = new DOMParser().parseFromString(content, 'text/html'); return { tables: d.querySelectorAll('table').length, codes: Array.from(d.querySelectorAll('pre code')).map(c => c.textContent.trim()) }; }, result.content);
        assert.deepEqual(counts.codes, original.codes); assert.equal(counts.tables, original.tables);
      }
      console.log(`PASS ${v2 ? 'Markdown' : 'HTML'}: ${original.summaries.length} fold labels, ${original.codes.length} unchanged code blocks, images without nested links`);
    }
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
