# Save.to：保存到 Notion / 飞书，中文界面与网站适配

基于 Save.to（原 Save to Notion）v4.3.14 解包扩展进行维护，提供中文界面和网站抓取适配。支持把网页正文或选取的页面区域保存到 Notion，也可用飞书企业自建应用将正文或文字选区保存为飞书云文档。本仓库为本地修改版，Notion 使用原产品的账号与连接流程，飞书独立配置 App ID / App Secret。

## 安装与更新

1. 下载本仓库 ZIP 并解压，或克隆仓库：

   ```sh
   git clone https://github.com/Guyungy/savetonotion.git
   ```

2. 在 Chrome 打开 `chrome://extensions`，启用开发者模式。
3. 点击「加载已解压的扩展程序」，选择包含 `manifest.json` 的仓库根目录。
4. 保存到 Notion 时，按照扩展界面提示完成账号连接；保存到飞书时，参考下方「保存到飞书」，通过网页右键菜单进入配置，无需先连接 Notion。

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

每条楼层或评论带有楼层号、作者、原帖链接，以及页面可提供的发布时间。保留正文标题、引用、链接卡片和表情；灯箱图片使用原图地址。头像、操作按钮、站点小图标和图片尺寸提示会被移除。折叠说明块展开为带引用标题的正文；代码保留原始反引号、缩进和换行，图片不再嵌套灯箱链接。同一条回复同时出现在展开区和普通楼层时会去重。

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
node stn-adapt/test-linuxdo-format.js
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


## 保存到飞书

现在可将网页正文保存为飞书云文档。网页右键选择 **保存到飞书**，或在 Save.to 面板点击同名按钮。也可从扩展详情页的“扩展程序选项”打开应用设置。

1. 在[飞书开放平台](https://open.feishu.cn/app)创建企业自建应用，启用机器人能力并发布应用版本。填写该应用的 **App ID** 和 **App Secret**，点击“验证并保存设置”。验证成功仅表示凭证有效，云文档权限仍需单独开通。
2. 在权限管理中开通创建、编辑云文档及“文本内容转换为云文档块”所需权限。接口对应权限以开放平台当前提示为准，参考[文档创建](https://open.feishu.cn/document/server-docs/docs/docs/docx-v1/document/create)、[内容转换](https://open.feishu.cn/document/ukTMukTMukTM/uUDN04SN0QjL1QDN/document-docx/docx-v1/document/convert)和[嵌套块写入](https://open.feishu.cn/api-explorer?project=docx&resource=document.block.descendant&apiName=create&version=v1)。新增权限后重新发布版本并由企业管理员批准（如需要）。
3. 建议填写云空间目标文件夹链接（`/drive/folder/…`）或 token，并把应用添加为有编辑权限的协作者。你的飞书账号也须能访问该文件夹。留空时文档归应用所有，个人账号可能无法打开；此功能不会自动向其他人共享文档。
4. 在目标网页右键打开保存页，检查正文预览，必要时修改标题，再点击 **保存到飞书**。完成后可打开生成的文档。

**保存范围与格式：** 整页沿用现有正文提取逻辑；Linux.do 包含当前 DOM 中已加载的楼层与评论，不自动加载完整主题。文字选区模式先在原网页拖选内容，再点击“提取网页文字选区”，可跨楼层选择。飞书选区使用浏览器文字选择，不复用 Notion 的区域框选工具。标题、段落、列表、链接、引用、代码块及表格通过飞书 HTML 转换接口写入，最终样式由飞书决定。图片目前保存为原图链接，不上传图片；视频、交互组件及原站 CSS 不会完整保留。正文中附原文链接。

**凭证与错误处理：** App Secret 存放于 `chrome.storage.local`，不使用同步存储，也不写入源码。该存储不加密；仅在可信设备上配置，卸载扩展或点击“清除应用设置”可删除。密钥只发往飞书官方认证接口；设置页不会读取回显已存密钥。网页嵌入的公开面板只能打开设置页，不能通过消息读取凭证或执行飞书保存。不要把真实凭证提交到 Git。此仓库不包含默认 App ID 或 App Secret。

保存会创建一个新文档，不追加到旧文档。内容按完整父子结构分批写入（每批最多 1000 块），超过限制的单个嵌套结构会在创建文档前报错。写入中途失败会给出已创建文档的链接并标记“正文未完全写入”，不会自动重试写入导致重复段落。手动重试会创建新文档。缺少权限、文件夹无访问权限或企业应用未发布时，页面会显示飞书错误码。

开发验证：

```bash
node stn-feishu/test-api.js
# 使用本地 playwright-core 与系统 Chrome 验证页面、后台消息和提取流程
node stn-feishu/test-extension.js
```

实现位于 `stn-feishu/`，通过 `serviceWorker.js` 的消息入口调用现有正文提取器；飞书设置页不是网页可访问资源。新增唯一必要的 API 主机权限为 `https://open.feishu.cn/*`。
