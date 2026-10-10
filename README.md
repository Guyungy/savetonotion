# Save to Notion：中文界面与网站适配

基于 Save.to（原 Save to Notion）v4.3.14 解包扩展进行维护，提供中文界面和网站抓取适配。支持把网页正文或选取的页面区域保存到 Notion。本仓库为本地修改版，与原产品的账号及 Notion 连接流程保持一致。

## 安装与更新

1. 下载本仓库 ZIP 并解压，或克隆仓库：

   ```sh
   git clone https://github.com/Guyungy/savetonotion.git
   ```

2. 在 Chrome 打开 `chrome://extensions`，启用开发者模式。
3. 点击「加载已解压的扩展程序」，选择包含 `manifest.json` 的仓库根目录。
4. 打开扩展，按照界面提示完成 Notion 连接及保存目标配置。

更新本地代码后，在扩展管理页面点击重新加载，再刷新要保存的网页。已安装商店版时，使用扩展名称和 ID 核对当前加载版本，避免混用。

扩展 ID：`ldmmifpegigmeammaeckplhnjbbpccmm`。

## Linux.do：楼层和评论保存

支持 `https://linux.do/t/<slug>/<topic-id>` 话题页及末尾带楼层编号的链接，例如 `/t/topic/1675456/57`。需要在浏览器中能正常查看目标内容。

| 保存方式 | 保存范围 |
| --- | --- |
| 整页正文保存 | 保存瞬间页面已加载的楼层，以及已展开的评论 |
| 选取页面区域 | 所选单楼、多楼容器或展开评论区内的内容 |
| 选取一段文字或一张图片 | 仅所选内容，不自动扩大为整层 |
| 列表选取 | 所选条目的正文及楼层上下文 |

每条楼层或评论带有楼层号、作者、原帖链接，以及页面可提供的发布时间。保留正文标题、引用、链接卡片和表情；灯箱图片使用原图地址。头像、操作按钮、站点小图标和图片尺寸提示会被移除。同一条回复同时出现在展开区和普通楼层时会去重。

**保存单独某楼**：先跳到目标楼层，再用扩展的页面区域选择功能选中该楼。选择整楼时，也会包含该楼内已展开的评论。楼层链接的元数据会保留对应作者、时间和楼层编号。

**保存一段讨论**：先滚动到需要的范围，让楼层正文加载出来；需要展开回复时先在网页中展开，再选择包含这些楼层或评论的区域保存。

Linux.do 使用动态加载：滚动时会加载新楼层，也可能卸载较早的楼层。因此“当前页面”包含实际留在 DOM 中的正文，可能包括屏幕之外的相邻楼层，**不代表整个话题**。默认不会自动遍历所有楼层、展开折叠评论或获取无权访问的内容。

实现与开发接口见 [Linux.do 适配说明](stn-adapt/linuxdo适配说明.md)。

## 其他适配与中文界面

- **Discuz! X 论坛**：按标准页面结构提取楼主标题、作者、时间、摘要和封面，清理话题 URL。见 [Discuz 说明](stn-adapt/discuz适配说明.md)。
- **Level-plus**：提取楼主元数据，并清理写在 URL 路径中的装饰参数。见 [Level-plus 说明](stn-adapt/level-plus适配说明.md)。
- **中文界面**：在 DOM 层替换扩展界面的文本，词典和维护说明见 [汉化说明](stn-i18n/README.md)。
- **站点适配工具**：添加标题、图标和 URL 清洗规则，见 [适配工具 README](stn-adapt/README.md) 与 [适配扩展手册](stn-adapt/适配扩展手册.md)。

其他网站继续使用扩展已有的通用解析流程，实际效果取决于页面结构与内容加载状态。

## 开发验证

本仓库包含解包后的 JavaScript 产物，没有常规前端构建步骤。测试依赖放在扩展目录之外，避免把依赖文件一并加载为扩展资源：

```sh
# 在仓库根目录执行；依赖目录可自行选择
npm install --prefix /tmp/stn-test-deps --no-audit --no-fund playwright-core jsdom
export NODE_PATH=/tmp/stn-test-deps/node_modules

node stn-adapt/test-linuxdo.js
node stn-adapt/test-linuxdo-comments.js
node stn-adapt/test-discuz.js
node stn-adapt/test-levelplus.js
node stn-adapt/verify-extension-loads.js
```

Linux.do 测试使用离线真实 DOM 快照及模拟接口，不要求登录，不写入 Notion。覆盖 HTML / Markdown、首帖、页内多楼、展开评论、去重、单段与单图选区、区域选择完整交互、接口失败和非目标网站。快照不含会话 token、私信和侧栏。

浏览器测试默认使用 macOS 系统 Chrome；其他系统或安装路径请设置 `CHROME_PATH`。扩展加载检查通过 Chrome CDP 加载解包扩展，使用独立临时 profile，不修改用户浏览器配置。旧版 Chrome 如果不支持该接口，可在扩展管理页面手动加载核验。

已通过 Linux.do 真实登录页面验证、离线回归测试及独立 Chrome 扩展加载检查。**尚未验证实际写入 Notion 后的最终呈现**。

## 维护注意事项

- 扩展目录内的文件或目录不要以 `_` 开头：Chrome 将此前缀保留给系统，可能拒绝加载整个扩展。临时文件使用 `tmp-`、`test-` 或 `verify-` 前缀。
- 上游扩展升级可能覆盖本地修改；升级后需重新检查并应用适配补丁。
- `getLinuxDoArticle` 分别存在于三个独立注入脚本中。修改时保持一致，回归测试会检查一致性。
- 提交页面快照时仅保留测试所需内容，移除登录令牌及其他会话数据。
