// 用构造的 Discuz X 标准结构页面离线验证 applyDiscuzMetadata。
// 该站（javbus.com/forum）强制登录，拿不到真实页面，所以按 Discuz X
// 官方模板变量与社区通行的选择器约定构造用例。
// 真实站点跑起来若选择器不符，用 verify-discuz-live.js 对比后调整。
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const ROOT = path.resolve(__dirname, "..");
const SRC = fs.readFileSync(path.join(ROOT, "parseMetaTags.js"), "utf8");

function extractFn(src, name) {
  const start = src.indexOf("function " + name);
  if (start < 0) throw new Error("找不到 " + name);
  let i = src.indexOf("{", start), depth = 0;
  for (let j = i; j < src.length; j++) {
    if (src[j] === "{") depth++;
    else if (src[j] === "}") { depth--; if (depth === 0) return src.slice(start, j + 1); }
  }
  throw new Error("配平失败: " + name);
}
const FN_SRC = extractFn(SRC, "applyDiscuzMetadata");

// ---- Discuz X 标准帖子页骨架 ----
// 注意：.t_f 在真实 Discuz 里是 <td>，必须包在 <table> 内。
// 直接把 td 塞进 div 会被 HTML 解析器丢弃（这是写测试时踩过的坑）。
function discuzPage(opts) {
  const o = Object.assign({
    subject: "測試帖子標題",
    author: "測試用戶",
    time: "2024-01-01 12:00:00",
    body: "這是正文內容，包含一些文字。",
    bodyImg: "https://example.com/pic.jpg",
    extraParams: "&extra=page%3D1&page=1",
  }, opts || {});
  return `<!DOCTYPE html><html><head><title>${o.subject} - 老司機論壇</title></head><body>
<div id="wrap">
  <h1 id="thread_subject">${o.subject}</h1>
  <div id="postlist">
    <div id="post_1234567">
      <table><tr>
        <td class="pls"><div class="authi"><a href="home.php?mod=space&uid=100" class="xw1">${o.author}</a></div></td>
        <td class="plc">
          <div class="pi"><em id="authorposton1234567" title="發表於 ${o.time}">${o.time}</em></div>
          <table><tr><td class="t_f" id="postmessage_1234567">
            <div class="quote"><blockquote>這是引用的內容不該出現</blockquote></div>
            ${o.body}
            <img src="/static/image/smiley/default/smile.gif" />
            <img src="${o.bodyImg}" />
          </td></tr></table>
        </td>
      </tr></table>
    </div>
    <div id="post_1234568">
      <table><tr>
        <td class="pls"><div class="authi"><a href="home.php?mod=space&uid=200">回帖的人</a></div></td>
        <td class="plc">
          <div class="pi"><em id="authorposton1234568" title="發表於 2024-01-02 08:00:00">2024-01-02</em></div>
          <table><tr><td class="t_f">二樓的內容</td></tr></table>
        </td>
      </tr></table>
    </div>
  </div>
</div></body></html>`;
}

const results = [];
function check(name, actual, expect) {
  const ok = expect instanceof RegExp ? expect.test(String(actual)) : actual === expect;
  results.push({ ok, name, actual, expect: String(expect) });
}

function runOn(html, url, data) {
  const dom = new JSDOM(html, { url });
  const f = new Function("window", "document", FN_SRC + "; return applyDiscuzMetadata;");
  const fn = f(dom.window, dom.window.document);
  fn(data);
  return data;
}

(async () => {
  // 1) 标准 Discuz 帖子页
  const d1 = { title: "測試帖子標題 - 老司機論壇", url: "", description: "" };
  runOn(discuzPage(), "https://www.javbus.com/forum/forum.php?mod=viewthread&tid=176873&extra=page%3D1", d1);
  check("标题取自 #thread_subject", d1.title, "測試帖子標題 - 測試用戶");
  check("标题不含站点后缀", /老司機論壇/.test(d1.title), false);
  check("作者取自 .authi a", d1.author, "測試用戶");
  check("时间取自 em#authorposton（去「發表於」）", d1.publicationDate, "2024-01-01 12:00:00");
  check("正文取自 .t_f", d1.description, /這是正文內容/);
  check("引用块已被剔除", /引用的內容/.test(String(d1.description)), false);
  check("表情图被跳过，取真实图", d1.image, "https://example.com/pic.jpg");
  check("URL 收敛为 mod+tid", d1.url, "https://www.javbus.com/forum/forum.php?mod=viewthread&tid=176873");
  check("URL 已去掉 extra", /extra/.test(d1.url), false);

  // 2) 缺少 #thread_subject，应从 <title> 剥离
  const html2 = discuzPage({ subject: "備用標題" }).replace('<h1 id="thread_subject">備用標題</h1>', "");
  const d2 = { title: "備用標題 - 老司機論壇", url: "" };
  runOn(html2, "https://www.javbus.com/forum/forum.php?mod=viewthread&tid=1", d2);
  check("无 #thread_subject 时不崩", typeof d2.title, "string");

  // 3) 非 Discuz 页面必须原样不动
  const d3 = { title: "Untouched", url: "https://example.com/x", description: "keep" };
  runOn("<html><body><h1>hi</h1></body></html>", "https://example.com/x", d3);
  check("非 Discuz 站点标题不变", d3.title, "Untouched");
  check("非 Discuz 站点 URL 不变", d3.url, "https://example.com/x");
  check("非 Discuz 站点描述不变", d3.description, "keep");

  // 4) 非 viewthread 的 forum.php 页面，URL 不应被改
  const d4 = { title: "t", url: "https://www.javbus.com/forum/forum.php?mod=forumdisplay&fid=2" };
  runOn(discuzPage(), "https://www.javbus.com/forum/forum.php?mod=forumdisplay&fid=2", d4);
  check("forumdisplay 页 URL 不被改", d4.url, "https://www.javbus.com/forum/forum.php?mod=forumdisplay&fid=2");

  console.log("=== Discuz 适配离线验证 ===\n");
  let pass = 0, fail = 0;
  for (const r of results) {
    if (r.ok) { pass++; console.log("  OK   " + r.name + "  -> " + JSON.stringify(r.actual)); }
    else { fail++; console.log("  FAIL " + r.name + "  -> 实际: " + JSON.stringify(r.actual) + "  期望: " + r.expect); }
  }
  console.log("\n" + pass + " passed, " + fail + " failed");
  console.log(fail === 0 ? "RESULT: PASS" : "RESULT: FAIL");
  process.exit(fail === 0 ? 0 : 1);
})();
