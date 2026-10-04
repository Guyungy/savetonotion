// 用真实抓下来的页面离线验证 applyLevelPlusMetadata 的取值逻辑
// 只测站点专属分支，不依赖网络、不依赖扩展加载。
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const ROOT = path.resolve(__dirname, "..");
const SRC = fs.readFileSync(path.join(ROOT, "parseMetaTags.js"), "utf8");
const HTML = fs.readFileSync(path.join(ROOT, "_site_probe.html"), "utf8");

// 从打包文件里把 applyLevelPlusMetadata 整段抠出来，单独 eval
const start = SRC.indexOf("function applyLevelPlusMetadata");
if (start < 0) { console.error("FAIL: 找不到 applyLevelPlusMetadata"); process.exit(1); }
// 用花括号配平找函数结束
let i = SRC.indexOf("{", start), depth = 0, end = -1;
for (let j = i; j < SRC.length; j++) {
  if (SRC[j] === "{") depth++;
  else if (SRC[j] === "}") { depth--; if (depth === 0) { end = j + 1; break; } }
}
const FN_SRC = SRC.slice(start, end);

const results = [];
function check(name, actual, expect) {
  const ok = expect instanceof RegExp ? expect.test(String(actual)) : actual === expect;
  results.push({ ok, name, actual, expect: String(expect) });
}

async function run() {
  const dom = new JSDOM(HTML, { url: "https://level-plus.net/read.php?tid-2881354-uid-1025736-fpage-0-toread--page-3.html" });
  const { window } = dom;

  // 造一个宿主作用域，注入函数
  const factory = new Function("window", "document", FN_SRC + "; return applyLevelPlusMetadata;");
  const applyLevelPlusMetadata = factory(window, window.document);

  // 模拟 getMetadata 的原始输出：该站没有 og，只有 <title> 兜底
  const data = {
    title: "❤分享女友❤ 第十弹：抖音风/裸舞/情趣/巨乳| 茶馆 - 南+ South Plus - powered by Pu!mdHd",
    description: "图片镇楼。",
    url: window.location.href,
    provider: "level-plus.net",
    image: undefined,
  };

  applyLevelPlusMetadata(data);

  check("title 用 #subject_tpc 覆盖", data.title, /^❤分享女友❤ 第十弹：抖音风\/裸舞\/情趣\/巨乳 - 雨下一整晚$/);
  check("title 不含站点后缀", /\|\s*茶馆/.test(data.title), false);
  check("author 取自楼主链接", data.author, "雨下一整晚");
  check("publicationDate 取自发帖时间", data.publicationDate, /^2026-06-06 \d{2}:\d{2}$/);
  check("url 清掉 uid/fpage/toread/page 装饰段", data.url, "https://level-plus.net/read.php?tid-2881354.html");
  check("url 已不含 -uid-", /-uid-/.test(data.url), false);
  check("url 已不含 -page-", /-page-/.test(data.url), false);
  check("description 从正文提取", (data.description || "").length > 10, true);
  check("image 从正文首图兜底", data.image, /^https?:\/\//);

  // ---- 非目标站点必须原样不动 ----
  const dom2 = new JSDOM("<html><body><h1>hi</h1></body></html>", { url: "https://example.com/a/b" });
  const f2 = new Function("window", "document", FN_SRC + "; return applyLevelPlusMetadata;");
  const fn2 = f2(dom2.window, dom2.window.document);
  const d2 = { title: "Untouched", url: "https://example.com/a/b", description: "x" };
  fn2(d2);
  check("非目标站点 title 不变", d2.title, "Untouched");
  check("非目标站点 url 不变", d2.url, "https://example.com/a/b");

  // ---- 列表页（无 subject_tpc）不应崩，且走 <title> 剥离分支 ----
  const listHtml = "<html><head><title>茶馆 - 南+ South Plus - powered by Pu!mdHd</title></head><body></body></html>";
  const dom3 = new JSDOM(listHtml, { url: "https://level-plus.net/index.php?cateid-7.html" });
  const f3 = new Function("window", "document", FN_SRC + "; return applyLevelPlusMetadata;");
  const fn3 = f3(dom3.window, dom3.window.document);
  const d3 = { title: "茶馆 - 南+ South Plus - powered by Pu!mdHd", url: "https://level-plus.net/index.php?cateid-7.html" };
  let threw = false;
  try { fn3(d3); } catch (e) { threw = true; }
  check("列表页不抛异常", threw, false);
  check("列表页 URL 不被误改", d3.url, "https://level-plus.net/index.php?cateid-7.html");

  // ---- 正文首图是表情时，应跳到第一张真实图片 ----
  const smileHtml = '<html><body><h1 id="subject_tpc">T</h1><div id="read_tpc">'
    + '<img src="images/post/smile/smallface/face029.jpg" />'
    + '<img src="https://i.ibb.co/real/pic.jpg" />'
    + "</div></body></html>";
  const dom4 = new JSDOM(smileHtml, { url: "https://level-plus.net/read.php?tid-1.html" });
  const f4 = new Function("window", "document", FN_SRC + "; return applyLevelPlusMetadata;");
  const fn4 = f4(dom4.window, dom4.window.document);
  const d4 = { title: "old", url: "https://level-plus.net/read.php?tid-1.html" };
  fn4(d4);
  check("跳过表情图，取真实首图", d4.image, "https://i.ibb.co/real/pic.jpg");

  console.log("=== level-plus.net 适配离线验证 ===\n");
  let pass = 0, fail = 0;
  for (const r of results) {
    if (r.ok) { pass++; console.log("  OK   " + r.name + "  -> " + JSON.stringify(r.actual)); }
    else { fail++; console.log("  FAIL " + r.name + "  -> 实际: " + JSON.stringify(r.actual) + "  期望: " + r.expect); }
  }
  console.log("\n" + pass + " passed, " + fail + " failed");
  console.log(fail === 0 ? "RESULT: PASS" : "RESULT: FAIL");
  process.exit(fail === 0 ? 0 : 1);
}
run();
