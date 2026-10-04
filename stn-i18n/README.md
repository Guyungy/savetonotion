# Save.to 汉化

> 目录名不能用 `_` 开头——Chrome 保留 `_` 前缀（`_locales` / `_metadata`），
> 用 `_i18n` 会直接导致扩展加载失败。故命名为 `stn-i18n`。

## 这是什么

给 Save.to 扩展做的中文化。不改动打包产物，在 DOM 层做文本替换。

- `dict.js` — 英中词典（648 条精确匹配 + 48 条正则规则）
- `engine.js` — 替换引擎，用 MutationObserver 监听 DOM 变化

## 怎么用

已经接好了，直接加载扩展即可：

1. `chrome://extensions` → 打开「开发者模式」
2. 「加载已解压的扩展程序」→ 选 `C:\Users\diriw\Documents\GitHub\SaveToNotion`
3. 打开 popup / 设置页 / 升级弹窗，界面即为中文

### 加词 / 改词

只改 `dict.js`，两种写法：

```js
// 1. 精确匹配（推荐，最安全）
"Save Form": "保存表单",

// 2. 正则规则（处理带变量的句子，放在 RULES 数组里）
{ re: /^(\d+)\s+forms$/, to: "$1 个表单" },
```

改完刷新扩展即可，不用重新打包。

## 有什么坑

**1. RULES 的顺序不能乱。** 越具体的规则必须越靠前。
`^Delete (.+)$` 会吞掉 `^Delete "(.+)"\?$`——后者写在后面就永远轮不到。
现在的顺序是：带引号的精确模式 → 数字模式 → 固定前缀 → 通用动词前缀。

**2. 只翻文本节点和 4 个安全属性。** `placeholder` / `title` / `aria-label` / `alt`。
`value`、`name`、`id`、`d`（SVG path）、`class` 一律不碰——动了会直接让功能崩。

**3. 自动跳过这些节点：** `SCRIPT` `STYLE` `SVG` `CODE` `PRE` `INPUT` `TEXTAREA` `CANVAS` `IFRAME`，
以及 `contenteditable`（用户正在输入的地方）。

**4. React 重渲染会把中文冲回英文。** 引擎靠 MutationObserver 再改回来，会有极短暂的闪烁。

**5. 没翻到的地方是正常的。** 词典是白名单制——不确定的一律不翻，宁可留英文也不误翻。
缺哪条就把英文原文加进 `dict.js`。

**6. `restricted_popup` 和 `onboarding_guide_popup` 是纯静态 HTML，直接改的标签，不走引擎。**

## 验证过的

- jsdom 单元测试 28 项全通过（精确命中 / 规则匹配 / 危险节点跳过 / 敏感属性不被篡改）
- Chromium 真实渲染验证：popup 首屏渲染出「选择表单」「3 个表单」「文件夹名称」

## 回滚

删掉 `stn-i18n/` 目录，再把 6 个 HTML 里的 `stn-i18n/*.js` 引用和 manifest 里的两条 resource 删掉即可。
原打包产物（`main.js` / `options.js` / `serviceWorker.js`）**一行都没动**。
