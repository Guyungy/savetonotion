# stn-debug —— 调试开关

## 这是什么

Save.to 扩展（v4.3.14）的**调试用 VIP 解锁工具**。把会员判定改为恒真，
用来在不需要真付费的情况下调试 Pro 功能。

`unlock_vip.py` 会改 4 处打包文件里的判定点。

## 怎么用

```bash
python unlock_vip.py            # 解锁全部 VIP
python unlock_vip.py --status   # 查看当前状态
python unlock_vip.py --revert   # 还原（从 .orig 备份）
```

改完必须**真机验证**：

```bash
"C:/Users/diriw/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe" \
  --load-extension="C:/Users/diriw/Documents/GitHub/SaveToNotion" \
  --disable-extensions-except="C:/Users/diriw/Documents/GitHub/SaveToNotion"
```

## 改了什么（4 处）

| # | 文件 | 位置 | 原始 | 改为 |
|---|---|---|---|---|
| A | `popup/static/js/main.js` | `loadProStatus` | `i=po\|\|…isPro\|\|!1` | `i=!0` |
| B | `popup/static/js/main.js` | `Pe`（= `checkUserUpgraded`） | `return po\|\|f.current` | `return !0` |
| C | `popup/static/js/main.js` | `D`（proSource 分发） | `d(e.isPro)` | `d(!0)` |
| D | `options.js` | `loadProStatus` | `o=Sm\|\|…isPro\|\|!1` | `o=!0` |

**作用范围：**

- **B** 是**所有额度检查的统一开关** —— 推文线程（3）、邮件（6）、Outlook、
  AI 查询（150）等全部走它。恒真 → 各额度函数直接 `return null`（不限制）。
- **A / C / D** 决定 UI 上的 `isPro` 状态 —— 表单数量上限（4）、Edit Page
  终身 10 次、升级按钮显隐等。

## 有什么坑

### 1. 🔴 `po` / `Sm` 不是「强制 Pro」开关

网上和早期分析里常把 `po` 说成 Pro 覆盖变量，**是错的**。
它的真实定义是：

```js
po = chrome.runtime.getManifest().description.includes("Safari")
```

即 **Safari 平台标识**。`Sm` 是 options.js 里的同一个东西。
所以 `po || isPro` 在 Chrome 上等价于 `false || isPro` —— 改 `po` 没用，
得改 `isPro` 那一侧。

### 2. 同一文件多个 patch 不能各自写盘

踩过的坑：`main.js` 有 A/B/C 三处要改，最初每次 `replace` 后立刻 `write`，
结果后一次写盘覆盖前一次，**只有最后一个生效**。
→ 现在按文件分组，在内存里累积所有替换，每个文件只写一次。

### 3. 复验不能只看新串在不在

`!0` 这种短串在压缩文件里到处都是，`new in s` 会**误报成功**。
→ 唯一可靠判据是 **「原始串是否已消失」**。

### 4. `isPro` 的字面匹配会误伤

`options.js` 里 `isPro` 的原始命中有 78 处，但**大部分是误报** ——
它们是 `isPropagationStopped`、`isProcessing`、`isProjectionDirty` 的子串。
真实命中只有 29 处。
→ 统计/匹配时必须加词边界：`isPro(?![A-Za-z0-9_])`。

### 5. 会被扩展升级覆盖

`main.js` / `options.js` 是打包产物。扩展在线更新后所有改动丢失。
→ 升级后重跑 `unlock_vip.py` 即可（幂等，已解锁会跳过）。

### 6. 只解锁客户端

改的是**本地判定**。服务端如有校验（Notion 写入权限、AI 额度后端计数），
不受影响。调试够用，别当破解用。

## 备份

`unlock_vip.py` 会在首次修改前把原文件存为 `<文件名>.orig`：

```
popup/static/js/main.js.orig
options.js.orig
```

`.orig` 已在 `.gitignore` 里排除，不会入库。
