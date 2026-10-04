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
    return Object.assign(Object.assign({}, data), { domainName: window.location.hostname });
}
// @ts-ignore
const response = parseMetaTags();
return response;


/***/ })

/******/ });