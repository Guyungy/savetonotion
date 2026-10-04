# stn-adapt —— 网站适配工具

## 这是什么

给 Save.to 扩展（v4.3.14）增加新网站适配的工具包。**不改任何逻辑代码**，
只往 `serviceWorker.js` 的两张数据表里插条目。

- `适配扩展手册.md` —— 完整方法论文档（四层适配机制、parser schema、验证方式）
- `add_site.py` —— 一键往适配表插站点的脚本

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
"C:/Users/diriw/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe" \
  --load-extension="C:/Users/diriw/Documents/GitHub/SaveToNotion" \
  --disable-extensions-except="C:/Users/diriw/Documents/GitHub/SaveToNotion"
```

然后到 `chrome://extensions` 看有没有红字报错，扩展 ID 应为
`ldmmifpegigmeammaeckplhnjbbpccmm`。

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
