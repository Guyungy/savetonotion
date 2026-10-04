/**
 * Save.to 汉化运行时引擎
 * 思路：不碰打包产物，在 DOM 层拦截文本节点做替换。
 *
 * 安全约束（防止误翻导致功能损坏）：
 *  1. 只处理 TextNode，绝不修改属性值（value / placeholder 单独白名单处理）。
 *  2. 跳过 SCRIPT / STYLE / SVG / CODE / PRE 及 contenteditable 节点。
 *  3. 只替换「整段文本完全命中」或「命中词典键」的情况，不做子串模糊替换。
 *  4. 不回写 React 的 props，只改 DOM 文本；React 重渲染后由 observer 再次修正。
 */
(function () {
  "use strict";

  var G = (typeof window !== "undefined" ? window
        : (typeof self !== "undefined" ? self : globalThis));
  if (!G || !G.document) return;

  if (G.__STN_I18N_LOADED__) return;
  G.__STN_I18N_LOADED__ = true;

  var C = G.__STN_I18N;
  if (!C) {
    try { console.warn("[STN-i18n] dict.js 未加载，汉化已跳过"); } catch (e) {}
    return;
  }

  var document = G.document;
  var MutationObserver = G.MutationObserver;

  var DICT = C.dict || {};
  var RULES = C.rules || [];

  // 不遍历其子节点的标签
  var SKIP_TAGS = {
    SCRIPT: 1, STYLE: 1, SVG: 1, CODE: 1, PRE: 1, NOSCRIPT: 1,
    TEXTAREA: 1, INPUT: 1, CANVAS: 1, IFRAME: 1, MATH: 1
  };

  // 完全不碰属性的标签（表单控件的 value 等由浏览器管理，动了会坏事）
  var SKIP_ATTR_TAGS = {
    SCRIPT: 1, STYLE: 1, SVG: 1, CANVAS: 1, IFRAME: 1, MATH: 1
  };

  // placeholder / title 这类属性也翻，但用独立白名单，避免碰到 value/name 等敏感属性
  var ATTRS = ["placeholder", "title", "aria-label", "alt"];

  // 明显不是 UI 文案的特征：SVG path、URL、纯符号、CSS 类、变量名
  var JUNK = /^(M[\d.\s-]|#[0-9A-F]{3,6}$|\/|\.|_|~|@|[a-z_]+[A-Z]|[\d\s.]+$)/;
  var HAS_LATIN = /[A-Za-z]/;

  function shouldSkipNode(node) {
    var p = node.parentNode;
    if (!p) return true;
    var tag = p.nodeName;
    if (SKIP_TAGS[tag]) return true;
    // contenteditable 内不翻（用户正在输入）
    if (p.isContentEditable) return true;
    // 已标记为处理过
    if (node.__stnDone) return true;
    return false;
  }

  function lookup(raw) {
    if (!raw) return null;
    var t = raw.trim();
    if (!t || t.length < 2) return null;
    if (!HAS_LATIN.test(t)) return null;
    if (JUNK.test(t)) return null;

    // 1. 精确命中
    if (Object.prototype.hasOwnProperty.call(DICT, t)) {
      return preserve(raw, DICT[t]);
    }
    // 2. 规则匹配
    for (var i = 0; i < RULES.length; i++) {
      var m = RULES[i].re.exec(t);
      if (m) {
        var out = RULES[i].to;
        for (var k = m.length - 1; k >= 1; k--) {
          out = out.split("$" + k).join(m[k]);
        }
        return preserve(raw, out);
      }
    }
    return null;
  }

  // 保留原文首尾空白
  function preserve(raw, translated) {
    var lead = raw.match(/^\s*/)[0];
    var tail = raw.match(/\s*$/)[0];
    return lead + translated + tail;
  }

  function translateTextNode(node) {
    if (shouldSkipNode(node)) return;
    var raw = node.nodeValue;
    if (!raw || !HAS_LATIN.test(raw)) return;
    var out = lookup(raw);
    if (out !== null && out !== raw) {
      node.nodeValue = out;
      node.__stnDone = true;
    }
  }

  function translateAttrs(el) {
    if (!el || el.nodeType !== 1) return;
    if (SKIP_ATTR_TAGS[el.nodeName]) return;
    for (var i = 0; i < ATTRS.length; i++) {
      var a = ATTRS[i];
      var v = el.getAttribute && el.getAttribute(a);
      if (!v || !HAS_LATIN.test(v)) continue;
      var out = lookup(v);
      if (out !== null && out !== v) {
        el.setAttribute(a, out.trim());
      }
    }
  }

  function walk(root) {
    if (!root) return;
    if (root.nodeType === 3) {
      translateTextNode(root);
      return;
    }
    if (root.nodeType !== 1) return;
    // 属性先处理（INPUT 的 placeholder 也在这里翻）
    translateAttrs(root);
    // 子节点遍历则对部分标签跳过
    if (SKIP_TAGS[root.nodeName]) return;
    var kids = root.childNodes;
    for (var i = 0; i < kids.length; i++) walk(kids[i]);
  }

  // ---------- 启动 ----------
  function start() {
    walk(document.body || document.documentElement);

    var obs = new MutationObserver(function (muts) {
      for (var i = 0; i < muts.length; i++) {
        var m = muts[i];
        if (m.type === "childList") {
          for (var j = 0; j < m.addedNodes.length; j++) walk(m.addedNodes[j]);
        } else if (m.type === "characterData") {
          // React 重渲染会重置文本，这里再修正一次
          if (m.target && m.target.__stnDone) {
            var cur = m.target.nodeValue;
            var again = lookup(cur);
            if (again === null) m.target.__stnDone = false;
          }
          translateTextNode(m.target);
        } else if (m.type === "attributes") {
          translateAttrs(m.target);
        }
      }
    });

    obs.observe(document.documentElement, {
      childList: true, subtree: true,
      characterData: true, attributes: true,
      attributeFilter: ATTRS
    });

    // 动态 title（document.title）单独处理
    try {
      var dt = lookup(document.title);
      if (dt !== null && dt !== document.title) document.title = dt.trim();
    } catch (e) {}
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
