# level-plus.net（南+ South Plus）适配说明

## 这是什么

给 `level-plus.net` 论坛做的保存适配。改的是 `parseMetaTags.js`，
在 `applyXMetadata()` 旁边新增了一个 `applyLevelPlusMetadata()` 站点分支。

## 为什么不是改数据表

`add_site.py` 那套（`oa` / `nc` 两张表）**搞不定这个站**，原因有两个：

1. **装饰参数在 path 里，不在 query 里。**
   页面 URL 形如
   `read.php?tid-2881354-uid-1025736-fpage-0-toread--page-3.html`
   —— 看起来像 query，其实是 phpwind 伪静态，整串塞在 path 段。
   而扩展的 `cleanupUrl()`（`it()`）只清 `search` 和 `hash`，
   **完全不碰 `pathname`**，`nc` 表再怎么写都够不着。

2. **标题/作者/时间全在 DOM 里，og 标签一个都没有。**
   实测该站 `<head>` 里 **没有任何 `og:` / `twitter:` 标签，也没有 `link[rel=canonical]`**。
   扩展只能退到 `<title>` 兜底，而 `<title>` 是
   `帖子标题| 茶馆 - 南+ South Plus - powered by Pu!mdHd`。
   `oa` 表的 `title:(e,t)=>…` 回调虽然能改标题，但**拿不到 DOM**，
   取不到 `#subject_tpc` 里的干净标题。

两条加起来 → 只能走有 DOM 权限的 `parseMetaTags.js`。

## 抓取规则（全部实测自真实页面）

| 字段 | 来源 | 说明 |
|---|---|---|
| title | `h1#subject_tpc` | `<h1 class="fl" id="subject_tpc">`，纯标题无后缀 |
| title 兜底 | `<title>` + 正则剥离 | 列表页没有 `#subject_tpc`，走这条 |
| author | `a[href*="action-show-uid-"] strong` | 楼主链接里的 `<strong>` |
| publicationDate | `span[title^="发表于"]` | `title` 属性里是 `发表于: 2026-06-06 00:38` |
| description | `#read_tpc` 的 textContent | 压缩空白后截 500 字 |
| image | `#read_tpc` 内第一张**非表情**图 | 跳过 `/(smile|emoticon|face|icon)s?\//` |
| url | `/read.php` + `tid-<数字>` 重组 | 清掉 `uid/fpage/toread/page/skinco` 等全部装饰段 |

作者会拼进标题（`标题 - 作者`），和 YouTube 分支的 `标题 - 频道` 风格一致。

## 覆盖的 URL 形态

```
✓ read.php?tid-2881354.html                      正常帖子
✓ read.php?tid-2881354-uid-941515.html           只看楼主（清 -uid-）
✓ read.php?tid-2881354-fpage-0-toread--page-3.html  翻页（清 -fpage-/-toread-/-page-）
✓ read.php?tid-2881354-skinco-wind.html          换肤（清 -skinco-）
→ 以上全部正规化成 read.php?tid-2881354.html
```

非 `/read.php` 的页面（`index.php?cateid-N.html`、`u.php?...`）**URL 不动**，只跑标题/作者逻辑。

## 改动点（3 处，都在 `parseMetaTags.js`）

1. 新增 `applyLevelPlusMetadata(data)` 函数（在 `applyXMetadata` 之后、`parseMetaTags` 之前）
2. `parseMetaTags()` 里在 `applyXMetadata(data)` 之后加一行 `applyLevelPlusMetadata(data);`
3. 无其他文件改动

备份在 `stn-adapt/parseMetaTags.js.orig`。

## 怎么用

```bash
# 离线单测（用真实抓下来的页面，13+ 用例）
export NODE_PATH="C:/Users/diriw/.workbuddy/binaries/node/workspace/node_modules"
node stn-adapt/_test_levelplus.js

# 真机验证（真加载扩展 → 真开目标页 → 查 DOM 节点可用性）
node stn-adapt/_verify_levelplus_live.js
```

页面快照在仓库根的 `_site_probe.html`（已加 .gitignore）。

## 有什么坑

1. **`nc` 表够不着 path 段。** 这是最容易踩的——
   看到 URL 里有 `?tid-2881354-uid-...` 就以为能加 `--params uid` 删掉，
   实际它整个是 pathname 的一部分，`URLSearchParams` 解析出来是空的。
   判断方法：`new URL(u).search` 是空串就是 path 段的锅。

2. **这个站的 `?` 后面没有真正的 query。** phpwind 的伪静态写法，
   `URL` 构造函数会把它当 search 存，但 `searchParams` 拿不到键值对。

3. **表情图必须过滤。** 帖子正文混着 `images/post/smile/smallface/face029.jpg`，
   不过滤的话封面图会是张 15px 的表情。

4. **`\u53d1\u8868\u4e8e` 别写成中文。** 打包产物是 UTF-8 无 BOM，
   但为稳妥起见用转义写，避免编码环节出岔子。

5. **文档后缀正则要够宽。** `<title>` 后缀是
   `| 茶馆 - 南+ South Plus - powered by Pu!mdHd`，
   且"茶馆"是会变的版块名，不能硬编码，得用 `[^|]*?(South Plus|南\+)` 匹配。

6. **改打包产物 = 升级会丢。** 和 VIP 解锁同理，
   扩展升级覆盖 `parseMetaTags.js` 后要重放这 3 处改动。

7. **🔴 带装饰段的 URL 服务端会 302。** 这是实测踩到的：
   ```
   curl "…/read.php?tid-2881354-uid-1025736-page-3.html"   → 302 → 拦截页
   curl "…/read.php?tid-2881354.html"                       → 200 → 真实内容
   ```
   服务端不认这些装饰段，直接把你踢到「本版块为正规版块,只有注册会员才能进入!」。
   两个后果：
   - **测试时千万别用带装饰段的 URL**，否则会误判成"适配失效"
   - **URL 正规化的价值比预想的大** —— 不只是让收藏的链接好看，
     而是它本来就是个会 302 的坏链接。用户从"只看楼主"/翻页点进去复制地址栏，
     存到 Notion 的是个跳转到拦截页的 URL
   - 正则要同时能吃下 `uid` / `fpage` / `toread` / `page` / `skinco`，
     且 `-toread--page-3` 中间有**连续两个连字符**（`toread--page`），别写成单 `-`

8. **站点自身有 JS 报错**（`Cannot read properties of null (reading 'version')`）。
   这是站点脚本的问题，跟扩展无关，真机验证时别把它算成失败。
   判断方法：`stn-adapt/_control_noext.js`（无扩展对照实验）复现同一条报错。

9. **🔴 站点会「记住」访客身份，导致时好时坏。**
   这是本次最耗时间的坑。表现：
   ```
   第 1 次运行 → 拿到真实内容，全绿
   第 2 次运行（复用同一 profile）→ 拦截页「本版块为正规版块,只有注册会员才能进入!」
   ```
   根因：站点把「判定为访客」的结果写进 cookie，**复用 profile 就会一直吃拦截页**，
   看起来像"适配随机失效"，实际跟适配无关。
   → **profile 目录必须每次新建**（脚本里用 `Date.now()` 生成）。
   另外 `launchPersistentContext` 还要显式设 `userAgent`，
   否则 Playwright 的默认 UA 更容易被判为访客。

10. **curl 200 不代表你能拿到内容。** 拦截页也是 200 + 完整 HTML，
    得检查 `<title>` 里有没有「注册会员才能进入」，或看关键节点在不在。
    `curl -w` 只看 `http_code` 会被骗。
