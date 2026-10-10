# Linux.do 话题、楼层与评论适配

适配范围为 `https://linux.do/t/<slug>/<topic-id>` 及其楼层链接。

## 使用方式

- **整页正文保存**：抓取当前 DOM 中已加载的楼层和已展开的评论。每条带楼层号、作者、发布时间（页面可提供时）及原帖链接。不会遍历整个话题，也不会自动展开评论。
- **选取页面区域**：选择单楼、若干楼层的容器或展开评论区域，只保留该范围内的正文和评论。选一段文字或一张图，不会扩大到整层。整楼选择包括该楼内已展开的评论。
- **列表选取**：所选条目同样通过 Linux.do 序列化器，保留楼层上下文和原图。
- **单楼链接**：元数据的作者和日期来自该楼，链接保留楼层编号；整页正文仍按当前已加载范围保存。单独保存该楼可使用页面区域选择。

Discourse 会随滚动加载和卸载楼层，所以“当前页面”指保存瞬间实际加载的正文，可能包括视口之外的相邻楼层。尚未加载、折叠或无权访问的评论不在默认范围内。

## 实现

- `parseMetaTags.js`：首帖、当前楼层及浮动标题元数据。
- `serviceWorker.js`：保留规范化的楼层 URL，去掉 query/hash；转发可选的 `linuxDoScope` 与 `linuxDoPostNumber` 参数。
- `scanWebpage.js`：默认 `page` 范围提取 `.cooked`，同时识别普通楼层 `article#post_N` 和 `.embedded-posts .reply[data-post-id]`。重复出现的评论按楼层号去重，优先普通楼层的完整时间信息，并保留已知回复关系。HTML 和 Markdown 共用范围规则。
- `clipContent.js`：区域选择、列表选择都使用相同序列化器。保留引用、链接卡片、表情和原图；清理头像、按钮、图标及灯箱尺寸提示。

`getLinuxDoArticle` 在三个独立注入脚本中保持一致，测试验证其一致性。

开发接口可传 `linuxDoScope: "post"`（当前 URL 指定楼层）、`linuxDoScope: "first"`（仅首帖）、`linuxDoPostNumber: N`（指定楼层）。如果单楼模式的目标未加载，通过当前会话的同源 `/t/<topic-id>.json?post_number=N` 读取目标楼层。只接受对应 `post_number`；失败返回空正文和错误。默认页面范围已有正文时不发起补抓，`skipContent` 也不请求接口。`contentSelector` 范围优先，选择无效时不退回整页。

## 验证

```sh
node stn-adapt/test-linuxdo.js
node stn-adapt/test-linuxdo-comments.js
node stn-adapt/test-linuxdo-format.js
node stn-adapt/test-discuz.js
node stn-adapt/test-levelplus.js
node stn-adapt/verify-extension-loads.js
```

需要可解析的 `playwright-core`；旧站点测试需要 `jsdom`。可把依赖放在扩展目录外并设置 `NODE_PATH`。测试默认使用 macOS 系统 Chrome，其他路径可通过 `CHROME_PATH` 指定。加载验证使用临时 profile，不影响用户浏览器。

`sample-linuxdo.html` 和 `sample-linuxdo-comments.html` 为话题 1675456 的正文与展开评论 DOM 快照，不含会话 token、私信或侧栏。检查包括首帖 24 个原标题、正文原图、末节、作者/日期、页内多楼、展开评论、去重、单段/单图选区、区域选择完整交互、无效选区、接口失败和其他网站不受影响。

已在登录的真实话题页面验证整页 HTML / Markdown、指定第 57 楼、仅展开评论区域；确认第 65 楼评论保留作者 `sauterne` 及回复 #52 的关系。

本次验证未写入 Notion。使用本地修改前，请在 Chrome 扩展管理中重新加载此解包扩展，再刷新目标网页。自动升级可能覆盖本地修改。

## 复杂格式修复

话题 1923706 使用大量折叠说明、代码和表格。保存时将 `details/summary` 转为静态正文及加粗引用标题，保留折叠块中已存在的正文；这不涉及自动加载折叠的楼层评论。灯箱图片移除外层链接，代码工具栏清理后保留代码原始反引号、缩进与换行，围栏长度根据代码内容调整。格式回归快照覆盖 31 个折叠标题、30 段代码及 2 张表格。
