// 真机验证：--load-extension 加载扩展，到目标站点跑一次真实注入链路
const { chromium } = require("playwright-core");
const path = require("path");

const EXT = "C:/Users/diriw/Documents/GitHub/SaveToNotion";
const EXT_ID = "ldmmifpegigmeammaeckplhnjbbpccmm";
const CHROME = "C:/Users/diriw/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe";
// 用干净 URL。带装饰段（-uid-/-fpage-/-page-）的 URL 服务端会 302 到拦截页，
// 那是站点行为，不是适配问题 —— 所以真机验证必须用规范化后的 URL。
const TARGET = "https://level-plus.net/read.php?tid-2881354.html";

(async () => {
  // profile 目录必须每次新建。
// 实测：站点会把「被判为访客」的会话记在 cookie 里，复用同一 profile 会持续拿到
// 「本版块为正规版块,只有注册会员才能进入!」拦截页 —— 表现为"时好时坏"。
// 用一次性随机目录，避免脏会话干扰。
const PROFILE = "C:/tmp/stn-lp-" + Date.now();

const ctx = await chromium.launchPersistentContext(PROFILE, {
    executablePath: CHROME,
    headless: false,
    // 站点会按指纹给匿名访客返回拦截页，用常见真实 UA 对齐
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    args: [
      "--disable-extensions-except=" + EXT,
      "--load-extension=" + EXT,
      "--no-first-run",
      "--no-default-browser-check",
      "--lang=zh-CN",
    ],
  });

  const results = [];
  const check = (name, ok, extra) =>
    results.push({ name, ok: !!ok, extra: extra === undefined ? "" : String(extra) });

  // 1) 扩展是否真加载（有 service worker 才有）
  let sw = null;
  for (let i = 0; i < 30 && !sw; i++) {
    sw = ctx.serviceWorkers().find((w) => w.url().includes(EXT_ID));
    if (!sw) await new Promise((r) => setTimeout(r, 500));
  }
  check("扩展 serviceWorker 已激活", !!sw, sw ? sw.url() : "未找到");
  if (sw) check("扩展 ID 正确", sw.url().includes(EXT_ID), EXT_ID);

  // 2) 打开目标页
  const page = await ctx.newPage();
  const pageErrors = [];
  page.on("pageerror", (e) => pageErrors.push(String(e)));
  await page.goto(TARGET, { waitUntil: "domcontentloaded", timeout: 60000 })
    .catch((e) => check("打开目标页", false, e.message));
  await page.waitForTimeout(2500);

  // 3) 在页面上下文里跑 parseMetaTags 的站点分支（模拟扩展注入后的取值）
  const probe = await page.evaluate(() => {
    const q = (s) => document.querySelector(s);
    const body = q("#read_tpc");
    const subject = q("h1#subject_tpc");
    return {
      hasSubject: !!subject,
      subject: subject ? subject.textContent.trim() : null,
      hasReadTpc: !!body,
      bodyLen: body ? body.textContent.trim().length : 0,
      author: (q('a[href*="action-show-uid-"] strong') || {}).textContent || null,
      hasTime: !!q('span[title^="\u53d1\u8868\u4e8e"]'),
      loc: location.href,
      imgCount: body ? body.querySelectorAll("img").length : 0,
    };
  });
  check("页面有 #subject_tpc", probe.hasSubject, probe.subject);
  check("页面有 #read_tpc", probe.hasReadTpc, "正文长度 " + probe.bodyLen);
  check("能取到作者", !!probe.author, probe.author);
  check("能取到发帖时间节点", probe.hasTime);
  check("正文有图片", probe.imgCount > 0, probe.imgCount + " 张");

  // 4) 验证标题剥离正则对真实 <title> 生效
  const titleRaw = await page.title();
  const stripped = titleRaw.replace(/\s*\|\s*[^|]*?(South Plus|南\+)[^|]*$/i, "").trim();
  check("真实 <title> 可剥离站点后缀", !/\|\s*茶馆/.test(stripped), JSON.stringify(stripped));

  // 站点自身已知报错（已用无扩展对照实验证实：control-noext.js 同样复现）
  const SITE_KNOWN_ERRORS = [/reading 'version'/];
  const ownErrors = pageErrors.filter((e) => !SITE_KNOWN_ERRORS.some((re) => re.test(e)));
  check(
    "无扩展引入的页面 JS 错误",
    ownErrors.length === 0,
    ownErrors.length ? ownErrors.slice(0, 3).join(" | ") : "仅站点自身错误 " + pageErrors.length + " 条（已排除）"
  );

  console.log("\n=== level-plus.net 真机验证 ===\n");
  let pass = 0, fail = 0;
  for (const r of results) {
    if (r.ok) { pass++; console.log("  OK   " + r.name + (r.extra ? "  -> " + r.extra : "")); }
    else { fail++; console.log("  FAIL " + r.name + (r.extra ? "  -> " + r.extra : "")); }
  }
  console.log("\n" + pass + " passed, " + fail + " failed");
  console.log(fail === 0 ? "RESULT: PASS" : "RESULT: FAIL");

  await ctx.close();
  process.exit(fail === 0 ? 0 : 1);
})();
