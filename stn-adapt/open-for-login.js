// 打开登录页，并自动触发验证码显示（该站验证码默认 visibility:hidden，
// 需点聚焦「认证码」输入框并等约 2s 才 show()）。
const { chromium } = require("playwright-core");

const EXT = "C:/Users/diriw/Documents/GitHub/SaveToNotion";
const EXT_ID = "ldmmifpegigmeammaeckplhnjbbpccmm";
const CHROME = "C:/Users/diriw/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe";
const PROFILE = "C:/tmp/stn-login-profile";   // 沿用上次的目录
const LOGIN = "https://level-plus.net/login.php";

(async () => {
  const ctx = await chromium.launchPersistentContext(PROFILE, {
    executablePath: CHROME,
    headless: false,
    viewport: null,
    args: [
      "--disable-extensions-except=" + EXT,
      "--load-extension=" + EXT,
      "--no-first-run",
      "--no-default-browser-check",
      "--start-maximized",
    ],
  });

  let sw = null;
  for (let i = 0; i < 30 && !sw; i++) {
    sw = ctx.serviceWorkers().find((w) => w.url().includes(EXT_ID));
    if (!sw) await new Promise((r) => setTimeout(r, 500));
  }
  console.log("扩展:", sw ? "已加载 OK" : "未检测到");

  const page = ctx.pages()[0] || (await ctx.newPage());
  await page.goto(LOGIN, { waitUntil: "domcontentloaded", timeout: 60000 }).catch((e) =>
    console.log("打开登录页失败:", e.message)
  );
  await page.waitForTimeout(2000);

  // 自动触发验证码显示
  const r = await page.evaluate(() => {
    const input = document.querySelector('input[name="gdcode"]');
    const img = document.querySelector("#ckcode");
    const box = img && img.closest("div");
    const before = box ? box.getAttribute("style") : "(无容器)";
    if (input) {
      input.focus();
      input.click && input.click();
    }
    // 兜底：直接把它显示出来（不等 2s 的 setTimeout）
    if (box) box.style.visibility = "visible";
    const after = box ? box.getAttribute("style") : "(无容器)";
    return {
      hasInput: !!input,
      hasImg: !!img,
      imgSrc: img ? img.getAttribute("src") : null,
      imgNatural: img ? img.naturalWidth + "x" + img.naturalHeight : null,
      imgComplete: img ? img.complete : null,
      before, after,
    };
  });

  console.log("\n=== 验证码状态 ===");
  console.log("  认证码输入框:", r.hasInput ? "有" : "无");
  console.log("  验证码图    :", r.hasImg ? r.imgSrc : "无");
  console.log("  图实际尺寸  :", r.imgNatural);
  console.log("  图加载完成  :", r.imgComplete);
  console.log("  容器 style  :", r.before, " -> ", r.after);

  // 再等一会，抓一次图看是不是真的渲染出来了
  await page.waitForTimeout(2500);
  const shot = "C:/Users/diriw/Documents/GitHub/SaveToNotion/stn-adapt/login-page.png";
  await page.screenshot({ path: shot, fullPage: false });
  console.log("\n已截图: " + shot);

  console.log("\n======================================================");
  console.log("窗口已打开，验证码应该已显示。");
  console.log("请直接输入用户名 / 密码 / 认证码，然后点「登 录」。");
  console.log("（如果验证码还是空的，点一下验证码图片本身可换一张）");
  console.log("======================================================");

  // 轮询检测登录成功，成功后存快照
  const deadline = Date.now() + 12 * 60 * 1000;
  let state = {};
  while (Date.now() < deadline) {
    await page.waitForTimeout(4000);
    try {
      state = await page.evaluate(() => {
        const t = document.body ? document.body.innerText : "";
        return {
          url: location.href,
          notLogged: /您没有登录|只有注册会员才能进入/.test(t),
          hasUser: !!document.querySelector('a[href*="action-show-uid-"]'),
        };
      });
    } catch (_e) {
      continue;
    }
    // 登录成功的判据：页面上出现了只有登录后才有的元素
    if (state.hasUser && !state.notLogged) {
      console.log("\n✅ 检测到已登录: " + state.url);
      break;
    }
  }

  if (state.hasUser && !state.notLogged) {
    await page.goto("https://level-plus.net/read.php?tid-2881354.html", { waitUntil: "domcontentloaded" }).catch(() => {});
    await page.waitForTimeout(2000);
    const html = await page.content();
    const fs = require("fs");
    const out = "C:/Users/diriw/Documents/GitHub/SaveToNotion/stn-adapt/sample-levelplus-logged.html";
    fs.writeFileSync(out, html, "utf8");
    console.log("✅ 已保存登录态快照: " + out + " (" + html.length + " 字节)");
  } else {
    console.log("\n⏱ 12 分钟未检测到登录成功。浏览器保持打开。");
  }

  await new Promise(() => {});
})();
