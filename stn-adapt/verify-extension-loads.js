// 只干一件事：确认扩展能被 Chrome 真正加载。
// 这是发现「_ 前缀文件」这类 manifest 校验错误的唯一可靠手段。
const { chromium } = require("playwright-core");

const EXT = "C:/Users/diriw/Documents/GitHub/SaveToNotion";
const EXT_ID = "ldmmifpegigmeammaeckplhnjbbpccmm";
const CHROME = "C:/Users/diriw/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe";

(async () => {
  const ctx = await chromium.launchPersistentContext("C:/tmp/stn-load-" + Date.now(), {
    executablePath: CHROME,
    headless: false,
    args: [
      "--disable-extensions-except=" + EXT,
      "--load-extension=" + EXT,
      "--no-first-run",
      "--no-default-browser-check",
    ],
  });

  // 等 service worker 起来 —— 起来了就说明 manifest 通过校验、扩展真加载了
  let sw = null;
  for (let i = 0; i < 40 && !sw; i++) {
    sw = ctx.serviceWorkers().find((w) => w.url().includes(EXT_ID));
    if (!sw) await new Promise((r) => setTimeout(r, 500));
  }

  // 再看 chrome://extensions 有没有报错卡片
  const p = await ctx.newPage();
  await p.goto("chrome://extensions/");
  await p.waitForTimeout(1500);
  const info = await p.evaluate(() => {
    const mgr = document.querySelector("extensions-manager");
    const items = mgr && mgr.shadowRoot
      ? mgr.shadowRoot.querySelectorAll("extensions-item")
      : [];
    const out = [];
    items.forEach((it) => {
      const name = it.shadowRoot?.querySelector("#name")?.textContent?.trim();
      const errs = it.shadowRoot?.querySelectorAll("#errors, .warning").length;
      out.push({ name, errs });
    });
    return out;
  });

  console.log("=== 扩展加载验证 ===\n");
  console.log(sw ? "  OK   serviceWorker 已激活 -> " + sw.url() : "  FAIL 未检测到 serviceWorker（扩展未加载）");
  console.log("  chrome://extensions 条目: " + JSON.stringify(info));
  const ok = !!sw;
  console.log("\n" + (ok ? "RESULT: PASS —— 扩展可正常加载" : "RESULT: FAIL"));
  await ctx.close();
  process.exit(ok ? 0 : 1);
})();
