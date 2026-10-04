# stn-adapt —— 网站适配工具

## 这是什么

给 Save.to 扩展（v4.3.14）增加新网站适配的工具包。

- `适配扩展手册.md` —— 完整方法论文档（四层适配机制、三条路径、parser schema）
- `add_site.py` —— 一键往适配表插站点的脚本（**只能改数据表**）
- `level-plus适配说明.md` —— 单站点适配实例（phpwind，需改 DOM 层）
- `discuz适配说明.md` —— Discuz! X 论坛**通用**适配（覆盖一整类站点）
- `test-levelplus.js` + `sample-levelplus.html` —— 离线单测与其页面快照
- `test-discuz.js` —— Discuz 适配的离线单测（构造页面，无需联网）

## 🔴 改任何东西之前先读这条

**扩展目录树内，任何文件或目录都不能以 `_` 开头。**

Chrome 把 `_` 前缀保留给系统，且**递归扫描整个扩展目录**：

```
错误: Cannot load extension with file or directory name _xxx.
      Filenames starting with "_" are reserved for use by the system.
      无法加载清单。
```

这个坑本项目踩了**两次**（`_i18n` 目录、`_site_probe.html` 快照）。
命名临时文件请一律用 `tmp-` / `verify-` / `test-` / `control-` 前缀。

改完扩展内任何文件后，跑一次这个确认（只 `ls` 是不够的，必须真加载）：

```bash
find . -name '_*' -not -path './.workbuddy/*' -not -path './.git/*'   # 应无输出
node stn-adapt/verify-extension-loads.js                              # 应 PASS
```

## 怎么用

### 看当前适配了哪些站点

```bash
python add_site.py --list
```

### 加一个站点

```bash
# 只清 URL 追踪参数
python add_site.py --host www.bilibili.com --params spm_id_from,vd_source,from_source

# 同时剥掉标题后缀
python add_site.py --host medium.com --params source,gi --title-suffix "Medium"

# 强制指定图标
python add_site.py --host www.zhihu.com --params utm_psn --icon "https://static.zhihu.com/favicon.ico"
```

### 撤销（从备份恢复）

```bash
python add_site.py --restore
```

### 验证

```bash
export NODE_PATH="C:/Users/diriw/.workbuddy/binaries/node/workspace/node_modules"

node stn-adapt/verify-extension-loads.js     # 扩展能否加载
node stn-adapt/check-snapshot.js             # 页面快照是不是真内容（不是拦截页）
node stn-adapt/test-levelplus.js             # level-plus 离线单测
node stn-adapt/test-discuz.js                # Discuz 离线单测（构造页面）
node stn-adapt/verify-levelplus-live.js      # 真机开目标页验证
node stn-adapt/control-noext.js              # 无扩展对照（排除站点自身报错）
```

扩展 ID 应为 `ldmmifpegigmeammaeckplhnjbbpccmm`。

### ⚠️ 抓页面快照时不要带 cookie

实测某站（level-plus.net）反直觉的行为：

| 请求 | 响应 |
|---|---|
| 不带 cookie | 200 / 205KB / **真内容** |
| 带真实登录 cookie | 200 / 31KB / **拦截页** |

登录令牌与 Cloudflare `cf_clearance` 配套，而后者绑定 IP+UA，
跨机器就失效并被风控降级。**拦截页同样是 200**，所以抓完务必跑
`check-snapshot.js`，不要靠状态码判断。

## 有什么坑

### 1. 🔴 两张表的 key 规范不一样

| 表 | key 要不要带 `www` | 原因 |
|---|---|---|
| `oa`（元数据覆写） | **不带** | 查表代码是 `hostname.replace(/^www\./,"")` |
| `nc`（URL 清洗） | **带** | 查表代码直接用 `t.hostname` |

脚本已帮你分别处理：传 `--host www.xxx.com`，它会自动给 `oa` 去掉 www。

### 2. 改压缩产物会被升级覆盖

`serviceWorker.js` 是打包产物。扩展一旦在线更新，所有手改都会丢。
→ 每次升级后重新跑一遍 `add_site.py`（把常用站点命令存成脚本，一条命令重放）。

### 3. 脚本会备份，但只保留一份

每次写入前覆盖 `serviceWorker.js.bak`。如果你连着改了好几轮想回退到更早版本，
备份已经被覆盖了。→ 重要改动前先 `git stash` 或手动复制一份。

### 4. 只能改「数据表」，不能加 parser

本脚本处理的是元数据覆写（title/icon）和 URL 参数清洗 —— 这两层是纯字典。

**要加页面悬浮按钮、列表抓取这类 parser，必须改 `content/content.js`**，
脚本不覆盖这块。做法见 `适配扩展手册.md` 的路径 B。

**还有一种情况脚本也搞不定**：URL 装饰参数写在 **path 段**（如 phpwind 的
`read.php?tid-123-uid-456.html`），而不是 query string。扩展的 `cleanupUrl()`
只清 `search` + `hash`，碰不到 `pathname`，`nc` 表再怎么写都没用。
这种要走 DOM 层（改 `parseMetaTags.js` 加站点分支），完整实例见
`level-plus适配说明.md`。

快速判断：`new URL(u).search` 拿出来是空串 → 参数在 path 段，脚本救不了。

### 5. 参数名会做合法性校验

只允许字母、数字、下划线、连字符。写错了会直接报错退出，不会写脏数据。

## 已知适配站点（脚本内置前）

| 站点 | 机制 |
|---|---|
| `mail.google.com` | 换 Gmail 图标 + **全站唯一保留 URL hash** |
| `youtube.com` | 去 `(N)` 未读计数 + 拼频道名 + 换图标 + 删 `ab_channel` |
| `x.com` | 剥 ` on X` 后缀 + 删 `ref_src/ref_url/s/source` |
| `www.linkedin.com` | 删 `trk`（唯一有完整 parser + 按钮注入） |
| `www.reddit.com` | 删 `ref` |
