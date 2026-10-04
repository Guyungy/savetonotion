# Discuz 论坛适配说明（javbus.com/forum 等）

## 这是什么

给 **Discuz! X 系论坛**做的通用保存适配，改的是 `parseMetaTags.js`，
新增 `applyDiscuzMetadata()` 分支（与 `applyXMetadata` / `applyLevelPlusMetadata` 并列）。

一批中文论坛（javbus 老司機論壇、各类资源站、地方论坛）都跑 Discuz X，
**结构高度标准化**，所以这一个分支能覆盖一整类站点，不是只服务 javbus。

## 为什么走 DOM 层

| 理由 | 说明 |
|---|---|
| 装饰参数在 query | `forum.php?mod=viewthread&tid=176873&extra=page%3D1&page=1`，`extra`/`page` 是噪音 |
| 页面有 og 标签吗 | **没有有效 og**，元数据只能退到 `<title>` |
| `<title>` 形态 | `帖子标题 - 老司機論壇`，需剥后缀 |
| 需要 DOM 才能拿 | 作者（`.authi`）、时间（`em#authorposton`）、正文（`.t_f`）都在 DOM 里 |

`nc` 表能清 `extra` 这类 query 参数，但拿不到作者/时间/正文，所以仍需 DOM 层。

## 抓取规则（Discuz X 标准结构）

| 字段 | 选择器 | 说明 |
|---|---|---|
| title | `#thread_subject` | 找不到则退回 `<title>` 并剥离 Discuz 后缀 |
| author | 楼层内 `.authi a` | 退回 `a[href*="uid="]` |
| publicationDate | `em[id^="authorposton"]` | 取其 `title` 属性（完整时间），剥离「发表于/發表於」 |
| description | 楼层内 `.t_f` | **剔除** `.quote`/`blockquote`/`.attach_nopermission`/`.showhide`，压空白截 500 |
| image | `.t_f` 内首张非表情图 | 跳过 `static/image/smiley` 下的表情 |
| url | 收敛为 `forum.php?mod=viewthread&tid=<tid>` | 去掉 `extra`/`page`/`highlight` 等 |

作者会拼进标题（`标题 - 作者`），与 YouTube / level-plus 分支风格一致。

## 楼层定位

```js
var firstPost = document.querySelector('#postlist div[id^="post_"]');  // 首个即楼主
```

先定位楼主楼层再在其内部找 `.authi` / `.t_f`，**避免抓成回帖者的信息**——
这是最容易出错的地方：`.authi` 和 `.t_f` 在每层都有，不限定作用域就会抓到二楼。

## 🔴 已知限制：无法真机验证选择器

**这个站强制登录**，实测两条路都拿不到页面：

```
curl（任何 UA/header）  → 302 → member.php?mod=logging&action=login
真浏览器（Playwright）  → 302 → 同上（不是 CF 质询，是 Discuz 自己的登录墙）
```

所以本适配的选择器基于 **Discuz X 官方模板变量 + 社区通行约定**，
仅经过**构造页面的离线单测**（`test-discuz.js`，14 用例），
**没有在真实页面上验证过**。

→ 你在自己浏览器里用一次，如果字段不对，按现象调
   `applyDiscuzMetadata()` 里的选择器即可，逻辑是模块化的。

### 如果真跑出问题，优先怀疑这几处

1. 该站用了**非默认模板**，`#thread_subject` / `.t_f` / `.authi` 可能被改名
2. 时间节点可能不是 `em[id^="authorposton"]`，而是 `.authi em` 或 `span`
3. 帖子可能设了「回复可见」，正文需登录+回复才显示
4. 部分站把正文放在 iframe 或懒加载容器里

排查办法：在帖子页按 F12，Console 里跑
```js
['#postlist','#thread_subject','.t_f','.authi','em[id^=authorposton]']
  .forEach(s => console.log(s, document.querySelectorAll(s).length));
```
哪个是 0，就改哪个选择器。

## 怎么用

```bash
export NODE_PATH="C:/Users/diriw/.workbuddy/binaries/node/workspace/node_modules"
node stn-adapt/test-discuz.js          # 离线单测（构造页面，14 用例）
node stn-adapt/verify-extension-loads.js   # 确认扩展能加载
```

## 有什么坑

1. **`.t_f` 是 `<td>`，必须包在 `<table>` 里。** 写测试用例时图省事把 `td`
   直接塞进 `div`，会被 HTML 解析器丢弃，`.t_f` 数量变 0 —— 这会让你误以为
   选择器写错了。真实页面没问题，**是测试用例的锅**。

2. **作用域必须限定到楼主楼层。** 直接 `document.querySelector('.authi a')`
   拿到的可能是任意一楼；`.t_f` 同理。先取 `#postlist div[id^="post_"]`。

3. **时间要取 `title` 属性，不是 textContent。** Discuz 的 `em#authorposton`
   显示文本常被截断成 `2024-01-01`，`title` 里才是完整 `2024-01-01 12:00:00`。

4. **「发表于」有简繁两种写法。** 正则要同时覆盖 `发表于/發表於/发表於/發表于`，
   否则繁体站（如本站在用的）前缀剥不掉。

5. **表情图路径要过滤。** Discuz 表情在 `static/image/smiley/` 下，
   不过滤则封面图会是张 15px 表情。

6. **改打包产物 = 升级会丢。** 扩展升级覆盖 `parseMetaTags.js` 后要重放这处改动。

7. **别把 `?.[1]` 链式表达式写太长。** 本次真实踩到：一段
   `(a?.[1] ?? b)?.[1]` 让 `tid=176873` 变成了 `tid=7`（字符串取下标）。
   最后改成先用 `searchParams.get()` 取，再用 `||` 兜底，清晰且不会错。
