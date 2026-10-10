// Load the unpacked extension in an isolated Chrome profile; never touch the user's profile.
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { chromium } = require('playwright-core');
const EXT = path.resolve(__dirname, '..');
const EXT_ID = 'ldmmifpegigmeammaeckplhnjbbpccmm';
const CHROME = process.env.CHROME_PATH || (process.platform === 'darwin'
  ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  : process.platform === 'win32' ? 'C:/Program Files/Google/Chrome/Application/chrome.exe' : '/usr/bin/google-chrome');
(async () => {
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'stn-load-'));
  let ctx;
  try {
    ctx = await chromium.launchPersistentContext(profile, {
      executablePath: CHROME,
      headless: process.env.STN_HEADED !== '1',
      ignoreDefaultArgs: ['--disable-extensions'],
      // Recent stable Chrome supports unpacked loading via browser CDP rather than --load-extension.
      args: ['--enable-unsafe-extension-debugging'],
    });
    const cdp = await ctx.browser().newBrowserCDPSession();
    const { id } = await cdp.send('Extensions.loadUnpacked', { path: EXT });
    if (id !== EXT_ID) throw new Error('Unexpected extension ID: ' + id);
    await ctx.pages()[0].goto('chrome-extension://' + id + '/popup/index.html');
    const worker = ctx.serviceWorkers().find(w => w.url().includes(id)) || await ctx.waitForEvent('serviceworker', { timeout: 10000 });
    if (worker.url() !== 'chrome-extension://' + id + '/serviceWorker.js') throw new Error('Unexpected service worker');
    console.log('PASS extension loaded, service worker active: ' + worker.url());
  } finally {
    if (ctx) await ctx.close();
    fs.rmSync(profile, { recursive: true, force: true });
  }
})().catch(error => { console.error('FAIL extension load:', error.message); process.exitCode = 1; });
