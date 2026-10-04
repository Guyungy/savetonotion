// 页面快照体检：确认抓下来的 HTML 是真内容，不是拦截页/风控页。
//
// 为什么需要这个：该站对匿名访客的响应不稳定 —— 实测同一个 URL
//   不带 cookie  → 200 / 205KB / 真内容
//   带异地 cookie → 200 / 31KB  / 「您没有登录或者您没有权限访问此页面」
// 两种都是 HTTP 200 + 完整 HTML。只看状态码会被骗，必须查内容特征。
//
// 用法： node stn-adapt/check-snapshot.js [快照路径]
const fs = require("fs");
const path = require("path");

const file = process.argv[2] || path.join(__dirname, "sample-levelplus.html");
if (!fs.existsSync(file)) {
  console.error("找不到快照: " + file);
  process.exit(1);
}
const html = fs.readFileSync(file, "utf8");

// 真内容必须有的节点
const REQUIRED = [
  ['id="read_tpc"', "首帖正文容器"],
  ['id="subject_tpc"', "帖子标题节点"],
  ["action-show-uid-", "楼主链接"],
];
// 拦截页/风控页特征
const BLOCKERS = [
  ["只有注册会员才能进入", "版块权限拦截页"],
  ["您没有登录或者您没有权限访问此页面", "未登录拦截页"],
  ["cf-browser-verification", "Cloudflare 挑战页"],
  ["Just a moment", "Cloudflare 等待页"],
  ["Enable JavaScript and cookies to continue", "Cloudflare JS 挑战"],
];

let ok = true;
console.log("=== 快照体检: " + path.basename(file) + " (" + html.length + " 字节) ===\n");

console.log("[必需节点]");
for (const [needle, label] of REQUIRED) {
  const hit = html.includes(needle);
  if (!hit) ok = false;
  console.log("  " + (hit ? "OK  " : "FAIL") + " " + label + "  (" + needle + ")");
}

console.log("\n[拦截页特征]");
let blocked = false;
for (const [needle, label] of BLOCKERS) {
  const hit = html.includes(needle);
  if (hit) { ok = false; blocked = true; }
  console.log("  " + (hit ? "HIT " : "clean") + " " + label);
}

const title = (html.match(/<title>([^<]*)<\/title>/i) || [])[1];
console.log("\n<title>: " + (title || "(无)"));

console.log("\n" + (ok ? "RESULT: PASS —— 是真内容，可用作测试快照" : "RESULT: FAIL —— 这份快照不可用"));
if (blocked) {
  console.log("\n提示: 抓到拦截页了。重新抓取时不要带 cookie ——");
  console.log("      实测该站匿名请求反而能拿到真内容，带异地登录 cookie 会被降级为拦截页。");
}
process.exit(ok ? 0 : 1);
