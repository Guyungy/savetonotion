/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	
function __webpack_require__inject_script_fix(moduleId) {
  if(installedModules[moduleId]) { return installedModules[moduleId].exports;}
var module = installedModules[moduleId] = {
 i: moduleId,
 l: false,
 exports: {}
};
const resp = modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
module.l = true;
return resp;
}
 function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__inject_script_fix(__webpack_require__.s = 29);
/******/ })
/************************************************************************/
/******/ ({

/***/ 29:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function makeUrlAbsolute(base, relative) {
    return new URL(relative, base).href;
}
function parseUrl(url) {
    return new URL(url).host;
}
function getProvider(host) {
    return host
        .replace(/www[a-zA-Z0-9]*\./, "")
        .replace(".co.", ".")
        .split(".")
        .slice(0, -1)
        .join(" ");
}
function buildRuleSet(ruleSet) {
    return (doc, context) => {
        var _a;
        let maxScore = 0;
        let maxValue;
        let alternatives = [];
        for (let currRule = 0; currRule < ruleSet.rules.length; currRule++) {
            const [query, handler] = ruleSet.rules[currRule];
            const elements = Array.from(doc.querySelectorAll(query));
            if (elements.length) {
                for (const element of elements) {
                    let score = ruleSet.rules.length - currRule;
                    if (ruleSet.scorers) {
                        for (const scorer of ruleSet.scorers) {
                            const newScore = scorer(element, score);
                            if (newScore) {
                                score = newScore;
                            }
                        }
                    }
                    if (score > maxScore) {
                        maxScore = score;
                        maxValue = handler(element);
                    }
                    if (ruleSet.keep_alternatives) {
                        alternatives.push({ value: ((_a = ruleSet.processors) === null || _a === void 0 ? void 0 : _a.length) ? ruleSet.processors[0](handler(element), context) : handler(element), score: score });
                    }
                }
            }
        }
        if (!maxValue && ruleSet.defaultValue) {
            maxValue = ruleSet.defaultValue(context);
        }
        if (maxValue) {
            if (ruleSet.processors) {
                for (const processor of ruleSet.processors) {
                    maxValue = processor(maxValue, context);
                }
            }
            if (maxValue.trim) {
                maxValue = maxValue.trim();
            }
            return {
                value: maxValue,
                alternatives: alternatives.filter((a) => a.value !== maxValue).sort((a, b) => b.score - a.score).map((a) => a.value)
            };
        }
        return {};
    };
}
window.metadataRuleSets = {
    description: {
        rules: [
            [
                'meta[property="og:description"]',
                (element) => element.getAttribute("content"),
            ],
            [
                'meta[name="description" i]',
                (element) => element.getAttribute("content"),
            ],
        ],
    },
    icon: {
        keep_alternatives: true,
        rules: [
            [
                'link[rel="apple-touch-icon"]',
                (element) => element.getAttribute("href"),
            ],
            [
                'link[rel="apple-touch-icon-precomposed"]',
                (element) => element.getAttribute("href"),
            ],
            ['link[rel="icon" i]', (element) => element.getAttribute("href")],
            ['link[rel="fluid-icon"]', (element) => element.getAttribute("href")],
            ['link[rel="shortcut icon"]', (element) => element.getAttribute("href")],
            ['link[rel="Shortcut Icon"]', (element) => element.getAttribute("href")],
            ['link[rel="mask-icon"]', (element) => element.getAttribute("href")],
        ],
        scorers: [
            // Handles the case where multiple icons are listed with specific sizes ie
            // <link rel="icon" href="small.png" sizes="16x16">
            // <link rel="icon" href="large.png" sizes="32x32">
            (element, score) => {
                const sizes = element.getAttribute("sizes");
                if (sizes) {
                    const sizeMatches = sizes.match(/\d+/g);
                    if (sizeMatches) {
                        return sizeMatches[0];
                    }
                }
            },
        ],
        defaultValue: (context) => "favicon.ico",
        processors: [(icon_url, context) => makeUrlAbsolute(context.url, icon_url)],
    },
    image: {
        rules: [
            [
                'meta[property="og:image:secure_url"]',
                (element) => element.getAttribute("content"),
            ],
            [
                'meta[property="og:image:url"]',
                (element) => element.getAttribute("content"),
            ],
            [
                'meta[property="og:image"]',
                (element) => element.getAttribute("content"),
            ],
            [
                'meta[name="twitter:image"]',
                (element) => element.getAttribute("content"),
            ],
            [
                'meta[property="twitter:image"]',
                (element) => element.getAttribute("content"),
            ],
            ['meta[name="thumbnail"]', (element) => element.getAttribute("content")],
        ],
        processors: [
            (image_url, context) => makeUrlAbsolute(context.url, image_url),
        ],
    },
    keywords: {
        rules: [
            ['meta[name="keywords" i]', (element) => element.getAttribute("content")],
        ],
        processors: [
            (keywords, context) => keywords.split(",").map((keyword) => keyword.trim()),
        ],
    },
    title: {
        rules: [
            [
                'meta[property="og:title"]',
                (element) => element.getAttribute("content"),
            ],
            [
                'meta[name="twitter:title"]',
                (element) => element.getAttribute("content"),
            ],
            [
                'meta[property="twitter:title"]',
                (element) => element.getAttribute("content"),
            ],
            ['meta[name="hdl"]', (element) => element.getAttribute("content")],
            ["title", (element) => element.text],
        ],
    },
    language: {
        rules: [
            ["html[lang]", (element) => element.getAttribute("lang")],
            ['meta[name="language" i]', (element) => element.getAttribute("content")],
        ],
        processors: [(language, context) => language.split("-")[0]],
    },
    type: {
        rules: [
            [
                'meta[property="og:type"]',
                (element) => element.getAttribute("content"),
            ],
        ],
    },
    url: {
        rules: [
            ["a.amp-canurl", (element) => element.getAttribute("href")],
            ['link[rel="canonical"]', (element) => element.getAttribute("href")],
            ['meta[property="og:url"]', (element) => element.getAttribute("content")],
        ],
        defaultValue: (context) => context.url,
        processors: [(url, context) => makeUrlAbsolute(context.url, url)],
    },
    provider: {
        rules: [
            [
                'meta[property="og:site_name"]',
                (element) => element.getAttribute("content"),
            ],
        ],
        defaultValue: (context) => getProvider(parseUrl(context.url)),
    },
};
function getMetadata(doc, url, customRuleSets = undefined) {
    const metadata = {};
    const context = {
        url,
    };
    const ruleSets = customRuleSets || window.metadataRuleSets;
    Object.keys(ruleSets).map((ruleSetKey) => {
        const ruleSet = ruleSets[ruleSetKey];
        const builtRuleSet = buildRuleSet(ruleSet);
        const { value, alternatives } = builtRuleSet(doc, context);
        metadata[ruleSetKey] = value;
        if (ruleSet.keep_alternatives) {
            metadata[`${ruleSetKey}_alternatives`] = alternatives;
        }
    });
    return metadata;
}
function getSecondBlock(text) {
    // Split the text by the bullet point character
    var parts = text.split('•');
    // Check if there are at least two parts
    if (parts.length >= 2) {
        // Return the second part, trimmed of leading/trailing whitespace
        return parts[1].trim();
    }
    else {
        return null;
    }
}
function applyXMetadata(data) {
    var _a, _b, _c, _d;
    try {
        const hostname = window.location.hostname.toLowerCase();
        const isXHostname = ["x.com", "twitter.com"].some(domain => hostname === domain || hostname.endsWith(`.${domain}`));
        if (!isXHostname)
            return;
        const article = document.querySelector('[data-testid="twitterArticleRichTextView"]');
        if (article) {
            const articleTitle = (_b = (_a = document.querySelector('[data-testid="twitter-article-title"]')) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim();
            const articleImage = (_c = document.querySelector('a[href*="/article/"][href*="/media/"] [data-testid="tweetPhoto"] img')) === null || _c === void 0 ? void 0 : _c.getAttribute("src");
            data.x_article = true;
            data.title = articleTitle || data.title;
            data.image = (articleImage === null || articleImage === void 0 ? void 0 : articleImage.replace(/([?&])name=\w+/, "$1name=large")) || data.image;
        }
        const resp = window.location.pathname.match(/\/(.*)\/status\/(\d+)(?:\/photo\/(\d+))?/i);
        if (!resp)
            return;
        const photoNum = resp[3] || null;
        const node = photoNum
            ? document.querySelector(`div[aria-roledescription='carousel'] ul li:nth-child(${photoNum})`)
            : document.querySelector(`a[href='${window.location.pathname + `/photo/${photoNum || "1"}`}']`);
        const imageSrc = (_d = node === null || node === void 0 ? void 0 : node.querySelector("img")) === null || _d === void 0 ? void 0 : _d.src;
        if (imageSrc && (!data.x_article || !data.image)) {
            data.image = imageSrc;
        }
    }
    catch (_e) {
        return;
    }
}
function applyLevelPlusMetadata(data) {
    // level-plus.net (南+ South Plus) — phpwind 论坛
    // 站点没有 og:/twitter: 标签，也没有 canonical，全部靠 DOM 取。
    var _a, _b;
    try {
        var hostname = window.location.hostname.toLowerCase().replace(/^www\./, "");
        if (hostname !== "level-plus.net" && !hostname.endsWith(".level-plus.net"))
            return;
        // 标题：优先读帖子标题节点，退回 <title> 并剥掉站点后缀
        var subject = document.querySelector("h1#subject_tpc");
        var subjectText = subject ? (subject.textContent || "").trim() : "";
        if (subjectText) {
            data.title = subjectText;
        }
        else if (data.title) {
            data.title = data.title.replace(/\s*\|\s*[^|]*?(South Plus|南\+)[^|]*$/i, "").trim();
        }
        // 描述：读首帖正文（#read_tpc），压缩空白后截断
        var body = document.querySelector("#read_tpc");
        if (body) {
            var raw = (body.textContent || "").replace(/\s+/g, " ").trim();
            if (raw)
                data.description = raw.length > 500 ? raw.slice(0, 500) + "..." : raw;
            // 首贴无 og:image，用正文第一张图兜底（跳过表情/图标等小图）
            if (!data.image) {
                var imgs = body.querySelectorAll("img");
                for (var k = 0; k < imgs.length; k++) {
                    var cand = imgs[k].getAttribute("src") || imgs[k].getAttribute("data-src");
                    if (!cand)
                        continue;
                    if (/^data:/i.test(cand))
                        continue;
                    if (/\/(smile|emoticon|face|icon)s?\//i.test(cand))
                        continue;
                    try { cand = new URL(cand, window.location.href).href; } catch (_e3) { continue; }
                    data.image = cand;
                    break;
                }
            }
        }
        // 作者：楼主链接（u.php?action-show-uid-...）在首帖左侧
        var authorNode = document.querySelector('a[href*="action-show-uid-"] strong');
        if (authorNode) {
            var author = (authorNode.textContent || "").trim();
            if (author) {
                data.author = author;
                // 拼进标题，方便在 Notion 里一眼看出谁发的
                if (data.title)
                    data.title = "".concat(data.title, " - ").concat(author);
            }
        }
        // 发帖时间：<span title="发表于: YYYY-MM-DD HH:mm">
        var timeNode = document.querySelector('span[title^="\u53d1\u8868\u4e8e"]');
        var timeText = timeNode ? (timeNode.getAttribute("title") || "").replace(/^[^:]*:\s*/, "").trim() : "";
        if (timeText)
            data.publicationDate = timeText;
        // URL 正规化：read.php?tid-2881354-uid-941515.html 这类装饰段要清掉，
        // 只留 read.php?tid-<tid>.html
        var m = window.location.pathname.match(/\/read\.php$/i);
        if (m) {
            var tid = (_b = (_a = window.location.search.match(/tid-(\d+)/)) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : null;
            if (tid)
                data.url = "".concat(window.location.origin, "/read.php?tid-").concat(tid, ".html");
        }
    }
    catch (_e2) {
        return;
    }
}
function applyDiscuzMetadata(data) {
    // Discuz! X 论坛通用适配（javbus.com/forum 等一大批中文论坛都用它）
    // 结构高度标准化，选择器跨站点通用：
    //   标题  #thread_subject
    //   楼层  #postlist > div[id^="post_"]，首个即楼主
    //   正文  楼层内 .t_f（需排除 .quote 引用块）
    //   作者  楼层内 .authi a
    //   时间  em[id^="authorposton"]
    // URL 有 slug 与 query 两种写法，统一收敛成 tid 形式。
    try {
        if (!document.querySelector("#postlist") && !document.querySelector("#thread_subject"))
            return;
        // 标题
        var subj = document.querySelector("#thread_subject");
        var subjText = subj ? (subj.textContent || "").trim() : "";
        if (subjText) {
            data.title = subjText;
        }
        else if (data.title) {
            // 退回 <title>，剥掉「 - Discuz! Board」「 - 版块名 - Powered by Discuz!」等后缀
            data.title = data.title.replace(/\s*[-–|]\s*(Powered by Discuz!?|Discuz!? Board)\s*$/i, "")
                .replace(/\s*[-–|]\s*[^-–|]{1,40}\s*[-–|]\s*Powered by Discuz!?\s*$/i, "")
                .trim();
        }
        // 首帖：优先用 #postlist 里的第一个楼层，退回 #postlist 整体
        var postlist = document.querySelector("#postlist");
        var firstPost = postlist ? postlist.querySelector('div[id^="post_"]') : null;
        var scope = firstPost || postlist;
        var author = "";
        if (scope) {
            // 作者：.authi 内的首个链接（Discuz 标准）
            var authA = scope.querySelector(".authi a");
            if (authA) {
                author = (authA.textContent || "").trim();
            }
            else {
                // 兜底：楼层里指向 home.php?mod=space&uid= 的链接
                var uidA = scope.querySelector('a[href*="mod=space"][href*="uid="], a[href*="uid="]');
                if (uidA)
                    author = (uidA.textContent || "").trim();
            }
            if (author) {
                data.author = author;
                if (data.title)
                    data.title = "".concat(data.title, " - ").concat(author);
            }
            // 发帖时间：Discuz X 用 em#authorposton<pid>，title 属性是完整时间
            var timeEl = scope.querySelector('em[id^="authorposton"]');
            if (timeEl) {
                var timeText = (timeEl.getAttribute("title") || timeEl.textContent || "").trim();
                // title 形如 "发表于 2024-01-01 12:00:00"（简/繁都要兼容），去掉前缀词
                timeText = timeText.replace(/^\s*(?:\u53d1\u8868\u4e8e|\u767c\u8868\u65bc|\u53d1\u8868\u65bc|\u767c\u8868\u4e8e)\s*/, "").trim();
                if (timeText)
                    data.publicationDate = timeText;
            }
            // 正文：.t_f，排除引用块与附件列表
            var bodies = scope.querySelectorAll(".t_f");
            var text = "";
            for (var i = 0; i < bodies.length; i++) {
                var clone = bodies[i].cloneNode(true);
                // 删掉引用/附件/隐藏内容等噪音节点
                var junk = clone.querySelectorAll(".quote, blockquote, .attach_nopermission, .showhide, script, style");
                for (var j = 0; j < junk.length; j++) {
                    if (junk[j].parentNode)
                        junk[j].parentNode.removeChild(junk[j]);
                }
                var t = (clone.textContent || "").replace(/\s+/g, " ").trim();
                if (t) {
                    text = t;
                    break;
                }
            }
            if (text)
                data.description = text.length > 500 ? text.slice(0, 500) + "..." : text;
            // 封面：正文里第一张非表情的图（Discuz 表情在 static/image/smiley 下）
            if (!data.image) {
                var imgs = scope.querySelectorAll(".t_f img");
                for (var k = 0; k < imgs.length; k++) {
                    var cand = imgs[k].getAttribute("src") || imgs[k].getAttribute("file") || imgs[k].getAttribute("data-original");
                    if (!cand || /^data:/i.test(cand))
                        continue;
                    if (/\/smiley\/|\/smilies\/|\/images\/smiley|\/common\/smiley/i.test(cand))
                        continue;
                    try { cand = new URL(cand, window.location.href).href; } catch (_e4) { continue; }
                    data.image = cand;
                    break;
                }
            }
        }
        // URL 收敛：forum.php?mod=viewthread&tid=176873&extra=xxx -> 只留 mod + tid
        var u = new URL(window.location.href);
        var isViewThread = /\/forum\.php$/i.test(u.pathname) && /viewthread/i.test(u.search);
        if (isViewThread) {
            var tid = u.searchParams.get("tid");
            if (!tid) {
                var mTid = window.location.href.match(/[?&]tid=(\d+)/) || u.pathname.match(/thread-(\d+)/);
                tid = mTid ? mTid[1] : null;
            }
            if (tid) {
                data.url = "".concat(u.origin).concat(u.pathname, "?mod=viewthread&tid=").concat(tid);
            }
        }
    }
    catch (_e5) {
        return;
    }
}
function getLinuxDoArticle(doc, pageUrl, options) {
    var u = new URL(pageUrl);
    var route = u.pathname.match(/^\/t\/([^/]+)\/(\d+)(?:\/(\d+))?\/?$/);
    if (u.hostname !== "linux.do" || !route) return null;
    options = options || {};
    var titleEl = doc.querySelector("#topic-title h1, header h1.header-title");
    var title = titleEl ? titleEl.textContent.replace(/\s+/g, " ").trim() : "";
    if (!title) {
        var meta = doc.querySelector('meta[property="og:title"]');
        title = (meta ? meta.getAttribute("content") : doc.title || "").replace(/\s+-\s+[^\n]*LINUX DO\s*$/i, "").trim();
    }
    var topicUrl = u.origin + "/t/" + route[1] + "/" + route[2];
    var target = Number(options.postNumber || route[3] || 1);
    var root = options.root || doc;
    var bodySelector = '.cooked';
    var owners = 'article[id^="post_"], .embedded-posts .reply[data-post-id]';
    var bodies = Array.from(root.querySelectorAll(bodySelector));
    if (root.matches && root.matches(bodySelector)) bodies.unshift(root);
    // A selected paragraph/image must remain a paragraph/image, not expand to the entire floor.
    var partial = root.closest && root.closest(bodySelector);
    if (partial && !root.matches(bodySelector)) bodies = [root];
    if (options.scope === "post" || options.scope === "first") {
        if (options.scope === "first") target = 1;
        bodies = bodies.filter(function(body) { return numberOf(body.closest(owners)) === target; });
    }
    function numberOf(owner) {
        if (!owner) return null;
        var id = (owner.id || "").match(/^post_(\d+)$/);
        if (id) return Number(id[1]);
        var link = owner.querySelector('.post-link-arrow a[href], .post-date a[href]');
        if (!link) return null;
        try {
            var path = new URL(link.getAttribute("href"), pageUrl).pathname.match(/^\/t\/[^/]+\/(\d+)\/(\d+)\/?$/);
            return path && path[1] === route[2] ? Number(path[2]) : null;
        } catch (e) { return null; }
    }
    function clean(node) {
        var clone = node.cloneNode(true);
        clone.querySelectorAll("script,style,button,svg,.lightbox .meta,.avatar,.site-icon,.anchor,.cooked-selection-barrier").forEach(function(el) { el.remove(); });
        // Discourse UI wrappers have no portable meaning in Notion/Markdown.
        clone.querySelectorAll(".codeblock-button-wrapper").forEach(function(el) { el.remove(); });
        clone.querySelectorAll("details").forEach(function(details) {
            var container = doc.createElement("div");
            Array.from(details.childNodes).forEach(function(child) {
                if (child.nodeType === 1 && child.tagName === "SUMMARY") {
                    var label = doc.createElement("blockquote");
                    var paragraph = doc.createElement("p");
                    var strong = doc.createElement("strong");
                    strong.textContent = child.textContent.trim();
                    paragraph.appendChild(strong); label.appendChild(paragraph); container.appendChild(label);
                } else container.appendChild(child);
            });
            details.replaceWith(container);
        });
        var images = Array.from(clone.querySelectorAll("img"));
        if (clone.matches && clone.matches("img")) images.unshift(clone);
        images.forEach(function(img) {
            var lightbox = img.closest("a.lightbox") || (node.matches && node.matches("img") ? node.closest("a.lightbox") : null);
            var src = lightbox ? lightbox.getAttribute("href") : (img.getAttribute("src") || img.getAttribute("data-src"));
            if (src) { try { img.setAttribute("src", new URL(src, pageUrl).href); } catch (e) {} }
            if (lightbox) { img.removeAttribute("srcset"); img.removeAttribute("sizes"); }
        });
        clone.querySelectorAll("a.lightbox").forEach(function(link) {
            var image = link.querySelector("img");
            if (image) link.replaceWith(image);
        });
        var links = Array.from(clone.querySelectorAll("a[href]"));
        if (clone.matches && clone.matches("a[href]")) links.unshift(clone);
        links.forEach(function(a) {
            try { a.setAttribute("href", new URL(a.getAttribute("href"), pageUrl).href); } catch (e) {}
        });
        return clone;
    }
    var entries = [];
    bodies.forEach(function(body) {
        var owner = body.closest(owners);
        if (!owner) return;
        // .cooked nested inside another .cooked is content, not another comment.
        var cooked = body.closest(bodySelector);
        if (cooked && cooked.parentElement.closest(bodySelector)) return;
        var number = numberOf(owner);
        var key = number ? "floor:" + number : "post:" + owner.getAttribute("data-post-id");
        var embedded = owner.matches('.embedded-posts .reply[data-post-id]');
        var old = entries.findIndex(function(entry) { return entry.key === key; });
        if (old !== -1 && (!entries[old].embedded || embedded)) return;
        var authorEl = owner.querySelector(".names [data-user-card]");
        var author = authorEl ? authorEl.getAttribute("data-user-card") || authorEl.textContent.trim() : "";
        var timeEl = owner.querySelector(".post-date [data-time], .post-date time[datetime]");
        var published = "";
        if (timeEl) {
            var date = timeEl.hasAttribute("data-time") ? new Date(Number(timeEl.getAttribute("data-time"))) : new Date(timeEl.getAttribute("datetime"));
            if (!isNaN(date.getTime())) published = date.toISOString();
        }
        var parent = owner.closest('[id^="embedded-posts__"]');
        var parentNumber = parent && parent.id.match(/--(\d+)$/);
        var entry = { key: key, number: number, author: author, published: published, embedded: embedded, replyTo: parentNumber ? Number(parentNumber[1]) : null, body: clean(body) };
        if (old === -1) entries.push(entry);
        else { if (!entry.replyTo) entry.replyTo = entries[old].replyTo; entries[old] = entry; }
    });
    var result = { title: title, url: topicUrl + (target > 1 ? "/" + target : "") };
    if (!entries.length) return result;
    var primary = entries.find(function(entry) { return entry.number === target; }) || entries[0];
    if (options.root && entries.length === 1) result.url = topicUrl + (primary.number > 1 ? "/" + primary.number : "");
    result.author = primary.author;
    result.published = primary.published;
    var output = doc.createElement("div");
    entries.forEach(function(entry) {
        var section = doc.createElement("section");
        var heading = doc.createElement("h2");
        heading.textContent = (entry.number ? "#" + entry.number : "评论") + (entry.author ? " · " + entry.author : "") + (entry.replyTo ? "（回复 #" + entry.replyTo + "）" : "");
        section.appendChild(heading);
        var info = doc.createElement("p");
        var link = doc.createElement("a");
        link.href = topicUrl + (entry.number > 1 ? "/" + entry.number : ""); link.textContent = "原帖"; info.appendChild(link);
        if (entry.published) info.appendChild(doc.createTextNode(" · " + entry.published));
        section.appendChild(info);
        if (entry.body.matches(bodySelector)) { while (entry.body.firstChild) section.appendChild(entry.body.firstChild); }
        else section.appendChild(entry.body);
        output.appendChild(section);
    });
    result.content = output.innerHTML;
    result.description = output.textContent.replace(/\s+/g, " ").trim().slice(0, 500);
    var image = output.querySelector('img:not(.emoji)[src]');
    if (image) result.image = image.getAttribute("src");
    result.postNumbers = entries.map(function(entry) { return entry.number; }).filter(Boolean);
    return result;
}
function applyLinuxDoMetadata(data) {
    var article = getLinuxDoArticle(document, window.location.href, { scope: "post" });
    if (!article) return;
    ["title", "url", "author", "description", "image"].forEach(function(key) {
        if (article[key]) data[key] = article[key];
    });
    if (article.published) data.publicationDate = article.published;
}
function parseMetaTags() {
    var _a;
    let data = getMetadata(document, window.location);
    //youtube special code
    if ((_a = data.url) === null || _a === void 0 ? void 0 : _a.startsWith("https://www.youtube.com")) {
        const node = document.querySelector("#upload-info #channel-name #text-container");
        if (node != null) {
            data.yt_author = node.textContent.trim();
        }
        // get also yt_publication date
        const node2 = document.querySelector("tp-yt-paper-tooltip.ytd-watch-info-text");
        if (node2 != null) {
            data.publicationDate = getSecondBlock(node2.textContent.trim());
        }
        // get title of video
        const node3 = document.querySelector("#container h1.title yt-formatted-string");
        if (node3 != null) {
            data.yt_title = node3.textContent.trim();
        }
        // get channel avatar on current video
        const node4 = document.querySelector("ytd-watch-metadata #avatar #img");
        if (node4 != null) {
            data.yt_author_avatar = node4.getAttribute("src");
        }
    }
    applyXMetadata(data);
    applyLevelPlusMetadata(data);
    applyDiscuzMetadata(data);
    applyLinuxDoMetadata(data);
    return Object.assign(Object.assign({}, data), { domainName: window.location.hostname });
}
// @ts-ignore
const response = parseMetaTags();
return response;


/***/ })

/******/ });