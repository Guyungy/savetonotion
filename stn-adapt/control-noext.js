// 对照实验：不带扩展，看同一个 JS 错误是否仍然出现
// 若出现 → 是站点的锅，不是扩展/适配的锅
const { chromium } = require("playwright-core");
const CHROME = "C:/Users/diriw/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe";
const TARGET = "https://level-plus.net/read.php?tid-2881354.html";

(async () => {
  const ctx = await chromium.launchPersistentContext("C:/tmp/stn-lp-noext", {
    executablePath: CHROME,
    headless: false,
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    args: ["--no-first-run", "--no-default-browser-check", "--lang=zh-CN"],
  });
  const page = await ctx.newPage();
  const errs = [];
  page.on("pageerror", (e) => errs.push(String(e)));
  await page.goto(TARGET, { waitUntil: "domcontentloaded", timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(3000);
  const t = await page.title();
  console.log("=== 无扩展对照实验 ===");
  console.log("title:", t);
  console.log("pageerror 数量:", errs.length);
  errs.slice(0, 5).forEach((e, i) => console.log("  [" + i + "] " + e));
  console.log(
    errs.some((e) => e.includes("reading 'version'"))
      ? "\n结论: 该错误在无扩展时同样出现 → 站点自身问题，与适配无关"
      : "\n结论: 无扩展时不出现 → 需要排查扩展/适配"
  );
  await ctx.close();
  process.exit(0);
})();
