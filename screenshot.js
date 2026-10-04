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
/******/ 	return __webpack_require__inject_script_fix(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// License: MIT
// Author: Anton Medvedev <anton@medv.io>
// Source: https://github.com/antonmedv/finder
Object.defineProperty(exports, "__esModule", { value: true });
exports.finder = void 0;
let config;
let rootDocument;
function finder(input, options) {
    if (input.nodeType !== Node.ELEMENT_NODE) {
        throw new Error(`Can't generate CSS selector for non-element node type.`);
    }
    if ('html' === input.tagName.toLowerCase()) {
        return 'html';
    }
    const defaults = {
        root: document.body,
        idName: (name) => true,
        className: (name) => true,
        tagName: (name) => true,
        attr: (name, value) => false,
        seedMinLength: 1,
        optimizedMinLength: 2,
        threshold: 1000,
        maxNumberOfTries: 10000,
    };
    config = Object.assign(Object.assign({}, defaults), options);
    rootDocument = findRootDocument(config.root, defaults);
    let path = bottomUpSearch(input, 'all', () => bottomUpSearch(input, 'two', () => bottomUpSearch(input, 'one', () => bottomUpSearch(input, 'none'))));
    if (path) {
        const optimized = sort(optimize(path, input));
        if (optimized.length > 0) {
            path = optimized[0];
        }
        return selector(path);
    }
    else {
        throw new Error(`Selector was not found.`);
    }
}
exports.finder = finder;
function findRootDocument(rootNode, defaults) {
    if (rootNode.nodeType === Node.DOCUMENT_NODE) {
        return rootNode;
    }
    if (rootNode === defaults.root) {
        return rootNode.ownerDocument;
    }
    return rootNode;
}
function bottomUpSearch(input, limit, fallback) {
    let path = null;
    let stack = [];
    let current = input;
    let i = 0;
    while (current) {
        let level = maybe(id(current)) ||
            maybe(...attr(current)) ||
            maybe(...classNames(current)) ||
            maybe(tagName(current)) || [any()];
        const nth = index(current);
        if (limit == 'all') {
            if (nth) {
                level = level.concat(level.filter(dispensableNth).map((node) => nthChild(node, nth)));
            }
        }
        else if (limit == 'two') {
            level = level.slice(0, 1);
            if (nth) {
                level = level.concat(level.filter(dispensableNth).map((node) => nthChild(node, nth)));
            }
        }
        else if (limit == 'one') {
            const [node] = (level = level.slice(0, 1));
            if (nth && dispensableNth(node)) {
                level = [nthChild(node, nth)];
            }
        }
        else if (limit == 'none') {
            level = [any()];
            if (nth) {
                level = [nthChild(level[0], nth)];
            }
        }
        for (let node of level) {
            node.level = i;
        }
        stack.push(level);
        if (stack.length >= config.seedMinLength) {
            path = findUniquePath(stack, fallback);
            if (path) {
                break;
            }
        }
        current = current.parentElement;
        i++;
    }
    if (!path) {
        path = findUniquePath(stack, fallback);
    }
    if (!path && fallback) {
        return fallback();
    }
    return path;
}
function findUniquePath(stack, fallback) {
    const paths = sort(combinations(stack));
    if (paths.length > config.threshold) {
        return fallback ? fallback() : null;
    }
    for (let candidate of paths) {
        if (unique(candidate)) {
            return candidate;
        }
    }
    return null;
}
function selector(path) {
    let node = path[0];
    let query = node.name;
    for (let i = 1; i < path.length; i++) {
        const level = path[i].level || 0;
        if (node.level === level - 1) {
            query = `${path[i].name} > ${query}`;
        }
        else {
            query = `${path[i].name} ${query}`;
        }
        node = path[i];
    }
    return query;
}
function penalty(path) {
    return path.map((node) => node.penalty).reduce((acc, i) => acc + i, 0);
}
function unique(path) {
    const css = selector(path);
    switch (rootDocument.querySelectorAll(css).length) {
        case 0:
            throw new Error(`Can't select any node with this selector: ${css}`);
        case 1:
            return true;
        default:
            return false;
    }
}
function id(input) {
    const elementId = input.getAttribute('id');
    if (elementId && config.idName(elementId)) {
        return {
            name: '#' + CSS.escape(elementId),
            penalty: 0,
        };
    }
    return null;
}
function attr(input) {
    const attrs = Array.from(input.attributes).filter((attr) => config.attr(attr.name, attr.value));
    return attrs.map((attr) => ({
        name: `[${CSS.escape(attr.name)}="${CSS.escape(attr.value)}"]`,
        penalty: 0.5,
    }));
}
function classNames(input) {
    const names = Array.from(input.classList).filter(config.className);
    return names.map((name) => ({
        name: '.' + CSS.escape(name),
        penalty: 1,
    }));
}
function tagName(input) {
    const name = input.tagName.toLowerCase();
    if (config.tagName(name)) {
        return {
            name,
            penalty: 2,
        };
    }
    return null;
}
function any() {
    return {
        name: '*',
        penalty: 3,
    };
}
function index(input) {
    const parent = input.parentNode;
    if (!parent) {
        return null;
    }
    let child = parent.firstChild;
    if (!child) {
        return null;
    }
    let i = 0;
    while (child) {
        if (child.nodeType === Node.ELEMENT_NODE) {
            i++;
        }
        if (child === input) {
            break;
        }
        child = child.nextSibling;
    }
    return i;
}
function nthChild(node, i) {
    return {
        name: node.name + `:nth-child(${i})`,
        penalty: node.penalty + 1,
    };
}
function dispensableNth(node) {
    return node.name !== 'html' && !node.name.startsWith('#');
}
function maybe(...level) {
    const list = level.filter(notEmpty);
    if (list.length > 0) {
        return list;
    }
    return null;
}
function notEmpty(value) {
    return value !== null && value !== undefined;
}
function* combinations(stack, path = []) {
    if (stack.length > 0) {
        for (let node of stack[0]) {
            yield* combinations(stack.slice(1, stack.length), path.concat(node));
        }
    }
    else {
        yield path;
    }
}
function sort(paths) {
    return [...paths].sort((a, b) => penalty(a) - penalty(b));
}
function* optimize(path, input, scope = {
    counter: 0,
    visited: new Map(),
}) {
    if (path.length > 2 && path.length > config.optimizedMinLength) {
        for (let i = 1; i < path.length - 1; i++) {
            if (scope.counter > config.maxNumberOfTries) {
                return; // Okay At least I tried!
            }
            scope.counter += 1;
            const newPath = [...path];
            newPath.splice(i, 1);
            const newPathKey = selector(newPath);
            if (scope.visited.has(newPathKey)) {
                return;
            }
            if (unique(newPath) && same(newPath, input)) {
                yield newPath;
                scope.visited.set(newPathKey, true);
                yield* optimize(newPath, input, scope);
            }
        }
    }
}
function same(path, input) {
    return rootDocument.querySelector(selector(path)) === input;
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getNodeCss = void 0;
const finder_1 = __webpack_require__(0);
function getNodeCss(node) {
    if (node.nodeType == Node.TEXT_NODE) {
        return getNodeCss(node.parentNode);
    }
    return (0, finder_1.finder)(node);
}
exports.getNodeCss = getNodeCss;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.convertSvgElementToImageSource = void 0;
function convertSvgElementToImageSource(svgEl) {
    let svgData = new XMLSerializer().serializeToString(svgEl);
    let img = new Image();
    img.setAttribute('src', 'data:image/svg+xml;base64,' + btoa(svgData));
    return img.src;
}
exports.convertSvgElementToImageSource = convertSvgElementToImageSource;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.bgAsk = void 0;
function bgAsk(ev, props) {
    return new Promise((accept) => {
        chrome.runtime.sendMessage({
            event: ev,
            props,
            destination: 'background',
            v2: true,
        }, (resp) => {
            accept(resp);
        });
    });
}
exports.bgAsk = bgAsk;


/***/ }),
/* 4 */,
/* 5 */,
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
// ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
// ====== Utility code
// ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
// ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.displayCancelSnackbar = void 0;
const components_1 = __webpack_require__(8);
const utils_1 = __webpack_require__(9);
const getNodeCss_1 = __webpack_require__(1);
const convertSvgElementToImageSource_1 = __webpack_require__(2);
const bgAsk_1 = __webpack_require__(3);
const full_1 = __webpack_require__(11);
// @ts-ignore
function addCss2(rule) {
    let css = document.createElement('style');
    css.type = 'text/css';
    css.appendChild(document.createTextNode(rule)); // Support for the rest
    document.getElementsByTagName('head')[0].appendChild(css);
}
let isPickingImage = false;
function println(...args) {
    //hide on prod
    // return console.log(...args);
}
// @ts-ignore
let done = null;
let created;
function returnResponseToBackground(data) {
    var data = Object.assign({ asyncId, type: 'asyncExec' }, data);
    return new Promise((resolve) => {
        window.postMessage(data, '*');
        done = resolve;
    });
}
// utils
function debounce(func, wait, immediate, context) {
    var result;
    var timeout = null;
    return function (...args) {
        var later = function () {
            timeout = null;
            if (!immediate)
                result = func(...args);
        };
        var callNow = immediate && !timeout;
        // Tant que la fonction est appelée, on reset le timeout.
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow)
            result = func(...args);
        return result;
    };
}
function debounceImmediate(func, waitMs) {
    return debounce(func, waitMs, true);
}
/**
 * attach the MouseMove Event that will have a debounceImmediate
 */
let hoverImg = null;
function addImage(ev) {
    return __awaiter(this, void 0, void 0, function* () {
        if (hoverImg == null) {
            return;
        }
        ev.preventDefault();
        ev.stopPropagation();
        if (isPickingImage) {
            const css = (0, getNodeCss_1.getNodeCss)(hoverImg);
            // const fetchFaviconResp = await getCurrentPageFaviconAsBase64()
            // console.log('fetchFaviconResp', fetchFaviconResp)
            chrome.runtime.sendMessage({
                popup: {
                    name: 'pickDataAdded',
                    args: {
                        css,
                        domain: window.location.hostname || 'unknown',
                        faviconImageBase64: null,
                        // fetchFaviconResp.imageBase64 || null,
                    },
                },
            });
        }
        let imageUrl, imageBase64;
        // check if current image is svg instead
        if (hoverImg.tagName.toLowerCase() == 'svg') {
            imageBase64 = (0, convertSvgElementToImageSource_1.convertSvgElementToImageSource)(hoverImg);
        }
        else if (hoverImg.src.startsWith('data:image/')) {
            imageBase64 = hoverImg.src;
        }
        else {
            imageUrl = hoverImg.src;
        }
        let { width, height } = getDimension(hoverImg);
        window.postMessage({ type: 'FOUND_SELECT_IMAGE', imageUrl, imageBase64, width, height }, '*');
    });
}
function isInBound(el, x, y, padding) {
    if (!el)
        return false;
    let { left, right, top, bottom } = el.getBoundingClientRect();
    if (x >= left - padding &&
        x <= right + padding &&
        y >= bottom - padding &&
        y <= top + padding) {
        return true;
    }
    return false;
}
function findImage(el, x, y) {
    if (!el)
        return null;
    if (el.tagName.toLowerCase() == 'img') {
        return el;
    }
    let img = el.querySelector('img');
    if (!isInBound(img, x, y, 0))
        return null;
    return img;
}
function getSvgParent(el) {
    let tmp = el;
    let depth = 1;
    while (tmp && depth++ < 8) {
        if (tmp.tagName.toLowerCase() == 'svg') {
            return tmp;
        }
        tmp = tmp.parentElement;
    }
    return null;
}
function findSvg(el, x, y) {
    //find if
    if (!el)
        return null;
    if (el.tagName.toLowerCase() == 'svg') {
        return el;
    }
    const parentSvg = getSvgParent(el);
    if (isInBound(parentSvg, x, y, 5))
        return parentSvg;
    let svgs = el.querySelectorAll('svg');
    if (!svgs.length) {
        // last check: check if it's a parent instead
        return null;
    }
    let i = 0;
    for (let svg of svgs) {
        if (isInBound(svg, x, y, 5)) {
            return svg;
        }
        if (i > 5)
            break;
        i++;
    }
    return null;
}
function attachAddImage(el) {
    hoverImg = el;
    // document.body.addEventListener("click", addImage);
    hoverImg.addEventListener('click', addImage);
    el.style.cursor = 'copy';
    el.onmouseleave = () => {
        el.style.cursor = '';
        hoverImg.removeEventListener('click', addImage);
        el.onmouseleave = null;
        hoverImg = null;
    };
}
const trackMouse = debounceImmediate((event) => {
    // get mouse
    var eventDoc, doc, body;
    event = event || window.event; // IE-ism
    // If clientX/Y aren't available and clientX/Y are,
    // calculate clientX/Y - logic taken from jQuery.
    // (This is to support old IE)
    // if (event.clientX == null && event.clientX != null) {
    //   eventDoc = (event.target && event.target.ownerDocument) || document;
    //   doc = eventDoc.documentElement;
    //   body = eventDoc.body;
    // println("tracking mouse...", event.clientX, event.clientY, document.elementFromPoint(event.clientX, event.clientY));
    const el = document.elementFromPoint(event.clientX, event.clientY);
    let img = findImage(el, event.clientX, event.clientY);
    // check if there is an svg instead
    let svg = !img && findSvg(el, event.clientX, event.clientY);
    if (svg) {
        attachAddImage(svg);
    }
    if (img) {
        attachAddImage(img);
    }
    else {
        document.body.style.cursor = null;
    }
}, 10);
function evTrackMouse(ev) {
    trackMouse(ev);
}
function startSearchImageScript() {
    hoverImg = null;
    document.addEventListener('mousemove', evTrackMouse);
}
function cleanupSearchImageScript() {
    document.removeEventListener('mousemove', evTrackMouse);
    if (hoverImg) {
        println('remove hoverImg', hoverImg);
        hoverImg.style.cursor = '';
        hoverImg.onmouseleave = null;
        hoverImg.removeEventListener('click', addImage);
        hoverImg = null;
    }
}
//@ts-ignore
function htmlString2El(s) {
    var wrapper = document.createElement('div');
    wrapper.innerHTML = s;
    return wrapper.children[0];
}
//@ts-ignore
function comp2El(comp, vars) {
    const el = htmlString2El(comp.html(vars));
    Object.keys(vars).map((k) => {
        let x = el.querySelector(`#btn-${k}`);
        x.addEventListener('click', () => {
            window.postMessage({ type: vars[k] }, '*');
        });
    });
    addCss2(comp.css);
    return el;
}
function listenEscape(evt) {
    evt = evt || window.event;
    var isEscape = false;
    if ('key' in evt) {
        isEscape = evt.key === 'Escape' || evt.key === 'Esc';
    }
    else {
        isEscape = evt.keyCode === 27;
    }
    if (isEscape) {
        window.postMessage({ type: 'CANCEL' }, '*');
    }
}
function listenEnterCapturePortion(evt) {
    evt = evt || window.event;
    var isEscape = false;
    if ('key' in evt) {
        isEscape = evt.key === 'Enter' || evt.key === 'Esc';
    }
    else {
        isEscape = evt.keyCode === 27;
    }
    if (isEscape) {
        window.postMessage({ type: 'SAVE_CAPTURE_PORTION' }, '*');
    }
}
let oldCursor = document.body.style.cursor;
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// ====== Business Logic Reusable Code
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
function hideElement(id) {
    let el = document.getElementById(id);
    if (el) {
        el.style.display = 'none';
    }
}
function showElement(id) {
    let el = document.getElementById(id);
    if (el) {
        el.style.display = 'block';
    }
}
function hideDialog(id) {
    let el = document.getElementById(id);
    if (el) {
        el.close();
        el.style.display = 'none';
    }
}
function showDialog(id) {
    let el = document.getElementById(id);
    if (el) {
        el.showModal();
        el.style.display = 'block';
    }
}
function hidePopupIframe() {
    hideElement(`dialog-${idName}`);
    hideDialog("stn-quick-modal");
}
function showPopupIframeAndStopListening() {
    (0, utils_1.sleep)(50).then(() => stopContentScriptListener());
    showElement(`dialog-${idName}`);
    showDialog("stn-quick-modal");
}
// function hidePopupIframe() {
//     let d: any = document.querySelector(`#dialog-${idName}`)
//     if (d) {
//         d.style.removeProperty('display')
//         d.style.display = 'none'
//     }
// }
// function showPopupIframeAndStopListening() {
//     sleep(50).then(() => stopContentScriptListener())
//     let d: any = document.querySelector(`#dialog-${idName}`)
//     if (!d) return
//     d.style.display = 'block'
// }
function removeCancelSnackbar() {
    let el = document.querySelector(`#cancelsnackbar-${idName}`);
    el === null || el === void 0 ? void 0 : el.parentNode.removeChild(el);
}
function displayCancelSnackbar(msg, onCancel = null) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const el = htmlString2El((0, components_1.getCancelSnackbarHtml)({ msg, actionCancel: 'CANCEL' }));
        (_a = el.querySelector(`#btn-actionCancel`)) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
            if (onCancel) {
                onCancel();
            }
            else {
                window.postMessage({ type: 'CANCEL' }, '*');
            }
        });
        addCss2(`
    .outlined-button-small-${idName} {
      all: unset;
      display: block;
      height: 30px;
      padding: 4px 8px;
      border-style: solid;
      border-width: 1px;
      border-color: #335cff;
      border-radius: 6px;
      background-color: transparent;
      color: #335cff;
      text-decoration: none;
      cursor: pointer;
            margin: 0;
            width: auto;
            overflow: visible;
            background: transparent;
            font: inherit;
            line-height: normal;
            -webkit-font-smoothing: inherit;
            -moz-osx-font-smoothing: inherit;
            -webkit-appearance: none;
    }
    
    .outlined-button-small-${idName}:hover {
      background-color: rgba(46, 131, 230, 0.1);
    }
    
    .outlined-button-small-${idName}:active {
      background-color: rgba(46, 131, 230, 0.2);
    }
    
    .outlined-button-small-${idName}:focus {
      background-color: rgba(46, 131, 230, 0.1);
    }
    
    `);
        document.body.appendChild(el);
    });
}
exports.displayCancelSnackbar = displayCancelSnackbar;
// ======================================================
// ======================================================
// ====== Select Image
// ======================================================
// ======================================================
function getDimension(imageEl) {
    // get current width
    let width = imageEl.clientWidth;
    // get current height
    let height = imageEl.clientHeight;
    return { width, height };
}
function STN_selectImage() {
    return __awaiter(this, void 0, void 0, function* () {
        println('selectImage', idName);
        //hide iframe
        hidePopupIframe();
        displayCancelSnackbar();
        setTimeout(() => {
            var _a;
            startSearchImageScript();
            (_a = document.activeElement) === null || _a === void 0 ? void 0 : _a.blur();
        }, 50);
        document.addEventListener('keydown', listenEscape);
    });
}
function STN_pickImageCss() {
    return __awaiter(this, void 0, void 0, function* () {
        println('selectImage', idName);
        isPickingImage = true;
        //hide iframe
        hidePopupIframe();
        displayCancelSnackbar('Pick an image on the page');
        setTimeout(() => {
            var _a;
            startSearchImageScript();
            (_a = document.activeElement) === null || _a === void 0 ? void 0 : _a.blur();
        }, 50);
        document.addEventListener('keydown', listenEscape);
    });
}
function STN_cancelSelectImage() {
    return __awaiter(this, void 0, void 0, function* () {
        cleanupSearchImageScript();
        cleanupScriptAndShowPopup();
    });
}
function cleanupScriptAndShowPopup() {
    return __awaiter(this, void 0, void 0, function* () {
        showPopupIframeAndStopListening();
        document.removeEventListener('keydown', listenEscape);
        //remove cancelSnackBar
        removeCancelSnackbar();
    });
}
// ======================================================
// ======================================================
// ====== Take Full Page Screenshot
// ======================================================
// ======================================================
function STN_takeScreenshot() {
    return __awaiter(this, void 0, void 0, function* () {
        //send message to background to take a screenshot
        hidePopupIframe();
        yield (0, utils_1.sleep)(50);
        chrome.runtime.sendMessage({ type: 'asyncExecTakeScreenshot', asyncId }, function (response) {
            //screenshot has been took, we stop it
            showPopupIframeAndStopListening();
        });
    });
}
function STN_takeFullScreenshot() {
    return __awaiter(this, void 0, void 0, function* () {
        //send message to background to take a screenshot
        hidePopupIframe();
        yield (0, utils_1.sleep)(50);
        const images = yield (0, full_1.getFullScreenImage)();
        chrome.runtime.sendMessage({ type: 'asyncSendScreenshot',
            asyncId,
            images,
            success: true,
        }, function (response) {
            //screenshot has been took, we stop it
            showPopupIframeAndStopListening();
        });
    });
}
// ======================================================
// ======================================================
// ====== Capture Portion Screenshot
// ======================================================
// ======================================================
function displayScreenshotFullPageScreen() {
    let el = comp2El(components_1.InjectableTakeScreenshotScreen, {
        actionCancelButton: 'CANCEL',
    });
    //fix scrolling issue element not centered
    el.style.position = 'fixed';
    //add for children too
    document.body.appendChild(el);
}
function removeScreenshotFullPageScreen() {
    const el = document.querySelector('#savetonotion-take-screenshot');
    el === null || el === void 0 ? void 0 : el.parentNode.removeChild(el);
}
let rect = {
    state: 'notInitialized',
    a: {
        x: null,
        y: null,
    },
    b: {
        x: null,
        y: null,
    },
    comp: {
        root: null,
        barBottom: null,
        selectableZone: null,
        captionButton: null,
    },
};
function __setDimensionSelectableZone() {
    // rect.comp.selectableZone.height = "150px";
}
function makeResizableDiv(element) {
    const resizers = element.querySelectorAll('.resizer');
    const minimum_size = 20;
    let original_width = 0;
    let original_height = 0;
    let original_x = 0;
    let original_y = 0;
    let original_mouse_x = 0;
    let original_mouse_y = 0;
    for (let i = 0; i < resizers.length; i++) {
        const currentResizer = resizers[i];
        currentResizer.addEventListener('mousedown', function (e) {
            e.preventDefault();
            original_width = parseFloat(getComputedStyle(element, null)
                .getPropertyValue('width')
                .replace('px', ''));
            original_height = parseFloat(getComputedStyle(element, null)
                .getPropertyValue('height')
                .replace('px', ''));
            original_x = element.getBoundingClientRect().left;
            original_y = element.getBoundingClientRect().top;
            original_mouse_x = e.clientX;
            original_mouse_y = e.clientY;
            window.addEventListener('mousemove', resize);
            window.addEventListener('mouseup', stopResize);
        });
        function resize(e) {
            if (currentResizer.classList.contains('bottom-right')) {
                const width = original_width + (e.clientX - original_mouse_x);
                const height = original_height + (e.clientY - original_mouse_y);
                if (width > minimum_size) {
                    rect.a;
                    element.style.width = width + 'px';
                }
                if (height > minimum_size) {
                    element.style.height = height + 'px';
                }
            }
            else if (currentResizer.classList.contains('bottom-left')) {
                const height = original_height + (e.clientY - original_mouse_y);
                const width = original_width - (e.clientX - original_mouse_x);
                if (height > minimum_size) {
                    element.style.height = height + 'px';
                }
                if (width > minimum_size) {
                    element.style.width = width + 'px';
                    element.style.left =
                        original_x + (e.clientX - original_mouse_x) + 'px';
                }
            }
            else if (currentResizer.classList.contains('top-right')) {
                const width = original_width + (e.clientX - original_mouse_x);
                const height = original_height - (e.clientY - original_mouse_y);
                if (width > minimum_size) {
                    element.style.width = width + 'px';
                }
                if (height > minimum_size) {
                    element.style.height = height + 'px';
                    element.style.top =
                        original_y + (e.clientY - original_mouse_y) + 'px';
                }
            }
            else {
                const width = original_width - (e.clientX - original_mouse_x);
                const height = original_height - (e.clientY - original_mouse_y);
                if (width > minimum_size) {
                    element.style.width = width + 'px';
                    element.style.left =
                        original_x + (e.clientX - original_mouse_x) + 'px';
                }
                if (height > minimum_size) {
                    element.style.height = height + 'px';
                    element.style.top =
                        original_y + (e.clientY - original_mouse_y) + 'px';
                }
            }
            rect.a = {
                x: parseFloat(element.style.left),
                y: parseFloat(element.style.top),
            };
            rect.b = {
                x: parseFloat(element.style.left) +
                    parseFloat(element.style.width),
                y: parseFloat(element.style.top) +
                    parseFloat(element.style.height),
            };
            updateScreenshotSelectionMenuPos();
        }
        function stopResize() {
            window.removeEventListener('mousemove', resize);
        }
    }
}
function displayScreenshotSelection() {
    rect.comp.root = comp2El(components_1.InjectableTakeScreenshotSelection, {
        actionCloseButton: 'CANCEL',
        actionSaveButton: 'SAVE_CAPTURE_PORTION',
        actionCaptionButton: '',
    });
    rect.comp.barBottom = rect.comp.root.querySelector('.bar-bottom-info');
    rect.comp.root.style.background = 'transparent';
    rect.comp.barBottom.style.position = 'fixed';
    rect.comp.selectableZone = rect.comp.root.querySelector('.bar-selectable-zone');
    rect.comp.selectableZone.style.position = 'fixed';
    rect.comp.captionButton = rect.comp.root.querySelector('.r-caption-button');
    rect.comp.selectableZone.style['box-shadow'] =
        '0 0 0 99999px rgba(0, 0, 0, .5)';
    rect.comp.captionButton.style.display = 'none';
    rect.comp.barBottom.style.display = 'none';
    __setDimensionSelectableZone();
    document.body.appendChild(rect.comp.root);
}
function removeScreenshotSelection() {
    var _a, _b;
    (_b = (_a = rect.comp.root) === null || _a === void 0 ? void 0 : _a.parentNode) === null || _b === void 0 ? void 0 : _b.removeChild(rect.comp.root);
    rect.comp.root = null;
    rect.comp.barBottom = null;
    rect.comp.selectableZone = null;
}
function __listenStartDrag(ev) {
    if (rect.state == 'notInitialized') {
        rect.state = 'waitingRectBigEnough';
        println('__listenStartDrag', ev);
        rect.a.x = ev.clientX;
        rect.a.y = ev.clientY;
    }
}
function updateScreenshotSelectionPos() {
    //move screenshot selection at the right pos;
    rect.comp.selectableZone.style.position = 'fixed';
    rect.comp.selectableZone.style.top = `${Math.min(rect.a.y, rect.b.y)}px`;
    rect.comp.selectableZone.style.left = `${Math.min(rect.a.x, rect.b.x)}px`;
    rect.comp.selectableZone.style.height = `${Math.abs(rect.a.y - rect.b.y)}px`;
    rect.comp.selectableZone.style.width = `${Math.abs(rect.a.x - rect.b.x)}px`;
}
function updateScreenshotSelectionMenuPos() {
    function getNb(s) {
        return parseFloat(s.replace('px', ''));
    }
    rect.comp.barBottom.style.position = 'fixed';
    rect.comp.barBottom.style.top = `${getNb(rect.comp.selectableZone.style.top) +
        getNb(rect.comp.selectableZone.style.height) +
        15}px`;
    rect.comp.barBottom.style.right = `${Math.abs(window.innerWidth -
        (getNb(rect.comp.selectableZone.style.left) +
            getNb(rect.comp.selectableZone.style.width)))}px`;
}
function __listenDrag(ev) {
    if (rect.state == 'waitingRectBigEnough') {
        //store b
        rect.b.x = ev.clientX;
        rect.b.y = ev.clientY;
        //check big enough
        if (Math.abs(rect.a.x - rect.b.x) > 10 &&
            Math.abs(rect.a.y - rect.b.y) > 10) {
            rect.state = 'capturing';
            document.body.style.cursor = 'default';
            displayScreenshotSelection();
            removeScreenshotFullPageScreen();
            updateScreenshotSelectionPos();
            document.addEventListener('keydown', listenEnterCapturePortion);
        }
    }
    else if (rect.state == 'capturing') {
        rect.b.x = ev.clientX;
        rect.b.y = ev.clientY;
        updateScreenshotSelectionPos();
    }
}
function __listenStopDrag(ev) {
    //fchang
    if (rect.state == 'capturing') {
        //pass in captured state
        rect.state = 'captured';
        updateScreenshotSelectionMenuPos();
        rect.comp.barBottom.style.display = '';
        setTimeout(() => {
            makeResizableDiv(rect.comp.selectableZone);
            stopCaptureMouseDragScreenshot();
        }, 50);
    }
    else if (rect.state == 'waitingRectBigEnough') {
        //cancel
        rect.state = 'notInitialized';
    }
}
function startCaptureMouseDragScreenshot() {
    document.addEventListener('mousedown', __listenStartDrag);
    document.addEventListener('mousemove', __listenDrag);
    document.addEventListener('mouseup', __listenStopDrag);
}
function stopCaptureMouseDragScreenshot() {
    document.removeEventListener('mousedown', __listenStartDrag);
    document.removeEventListener('mousemove', __listenDrag);
    document.removeEventListener('mouseup', __listenStopDrag);
}
function STN_capturePortion() {
    hidePopupIframe();
    displayScreenshotFullPageScreen();
    document.body.style.cursor = 'crosshair';
    setTimeout(() => {
        var _a;
        ;
        (_a = document.activeElement) === null || _a === void 0 ? void 0 : _a.blur();
    }, 50);
    document.addEventListener('keydown', listenEscape);
    //capture
    startCaptureMouseDragScreenshot();
}
function STN_removeCapturePortion() {
    stopCaptureMouseDragScreenshot();
    removeScreenshotFullPageScreen();
    removeScreenshotSelection();
    document.body.style.cursor = 'default';
    document.removeEventListener('keydown', listenEscape);
    document.removeEventListener('keydown', listenEnterCapturePortion);
}
function STN_cancelCapturePortion() {
    println('call');
    STN_removeCapturePortion();
    showPopupIframeAndStopListening();
}
function getCapturePortionDimension() {
    // from rect.comp.root
    const { width, height } = rect.comp.selectableZone.getBoundingClientRect();
    return { width, height };
}
function STN_saveCapturePortion() {
    return __awaiter(this, void 0, void 0, function* () {
        const { width, height } = getCapturePortionDimension();
        STN_removeCapturePortion();
        yield (0, utils_1.sleep)(50);
        chrome.runtime.sendMessage({ type: 'asyncExecTakeScreenshotGetImg', asyncId }, function (response) {
            return __awaiter(this, void 0, void 0, function* () {
                let imageBase64 = null;
                // println("resp1", response.imageBase64)
                try {
                    imageBase64 = yield resizeImage(response.imageBase64);
                }
                catch (e) {
                    //fail
                }
                chrome.runtime.sendMessage({ type: 'asyncExecPassScreenshot', asyncId, imageBase64, width, height }, function () { });
                showPopupIframeAndStopListening();
            });
        });
    });
}
function resizeImage(imageBase64) {
    return __awaiter(this, void 0, void 0, function* () {
        let image = new Image();
        return new Promise((accept) => {
            image.onload = function (e) {
                return __awaiter(this, void 0, void 0, function* () {
                    rect.a;
                    var res = crop(image, {
                        x: rect.a.x * window.devicePixelRatio,
                        y: rect.a.y * window.devicePixelRatio,
                    }, {
                        x: rect.b.x * window.devicePixelRatio,
                        y: rect.b.y * window.devicePixelRatio,
                    });
                    accept(res);
                });
            };
            image.src = imageBase64;
        });
    });
}
function crop(img, a, b) {
    // check scale
    var canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    println('got', `${img.width} x ${img.height} => ${a.x} x ${a.y} ||| ${b.x} x ${b.y}`);
    let dx = Math.min(a.x, b.x), dy = Math.min(a.y, b.y), dwidth = Math.abs(a.x - b.x), dheight = Math.abs(a.y - b.y);
    let ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    let imageData = ctx.getImageData(dx, dy, dwidth, dheight);
    let canvas1 = document.createElement('canvas');
    canvas1.width = dwidth;
    canvas1.height = dheight;
    let ctx1 = canvas1.getContext('2d');
    ctx1.rect(0, 0, dwidth, dheight);
    ctx1.fillStyle = 'white';
    ctx1.fill();
    ctx1.putImageData(imageData, 0, 0);
    return canvas1.toDataURL();
}
function getProxiedUrl(url) {
    // using images.weserv.nl
    return `https://images.weserv.nl/?url=${encodeURIComponent(url)}`;
}
function getB64FromBlob(blob) {
    const reader = new FileReader();
    return new Promise((resolve) => {
        reader.onload = function (event) {
            var _a;
            const b64Image = (_a = event.target) === null || _a === void 0 ? void 0 : _a.result;
            if (!b64Image)
                throw new Error(`incorrect image`);
            const img = typeof b64Image == "string" ? b64Image : new TextDecoder("utf-8").decode(b64Image);
            resolve(img);
        };
        reader.readAsDataURL(blob);
    });
}
function STN_fetchImageAsBase64(url, hasPermission) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let res;
            let b64;
            if (hasPermission) {
                console.log('has permission', url);
                res = yield (0, bgAsk_1.bgAsk)("fetchB64", { url });
                if (res.ok) {
                    b64 = res.b64;
                }
            }
            else {
                res = yield fetch(getProxiedUrl(url));
                if (res.ok) {
                    b64 = yield getB64FromBlob(yield res.blob());
                }
            }
            if (!res.ok) {
                throw new Error('failed to fetch image');
            }
            console.log('b64', b64);
            window.postMessage({ type: 'FOUND_SELECT_IMAGE', imageUrl: null, imageBase64: b64, height: null, width: null }, '*');
            // base64
        }
        catch (e) {
            window.postMessage({ type: 'CANCEL' }, '*');
        }
    });
}
// ------------------------------------------------------
// ------------------------------------------------------
// ****** Main
// ------------------------------------------------------
// ------------------------------------------------------
let currentAction = 'selectImage';
if (extraParamsJson) {
    println(extraParamsJson);
    let v = JSON.parse(extraParamsJson);
    currentAction = v.type;
    if (v.type == 'selectImage') {
        STN_selectImage();
    }
    else if (v.type == 'takeScreenshot') {
        STN_takeScreenshot();
    }
    else if (v.type == 'takeFullScreenshot') {
        STN_takeFullScreenshot();
    }
    else if (v.type == 'capturePortion') {
        STN_capturePortion();
    }
    else if (v.type == 'pickImageCss') {
        STN_pickImageCss();
    }
    else if (v.type == "fetchImageAsBase64") {
        STN_fetchImageAsBase64(v.url, v.hasPermission);
    }
    else {
        console.log('unknown command');
    }
}
function listener(event) {
    var _a, _b;
    // We only accept messages from ourselves
    if (event.source != window)
        return;
    if (!((_a = event.data) === null || _a === void 0 ? void 0 : _a.type))
        return;
    println('received listener', event.data);
    switch ((_b = event.data) === null || _b === void 0 ? void 0 : _b.type) {
        case 'FOUND_SELECT_IMAGE':
            returnResponseToBackground({
                success: true,
                imageUrl: event.data.imageUrl,
                imageBase64: event.data.imageBase64,
                height: event.data.height,
                width: event.data.width,
            });
            STN_cancelSelectImage();
            break;
        case 'CONTINUE_LIST_ITEMS':
            returnResponseToBackground({
                success: true,
                payload: event.data.payload,
            });
            cleanupScriptAndShowPopup();
            break;
        case 'CANCEL':
            switch (currentAction) {
                case 'capturePortion':
                    returnResponseToBackground({ success: false });
                    STN_cancelCapturePortion();
                    break;
                case 'fetchImageAsBase64':
                    returnResponseToBackground({ success: false });
                    break;
                default:
                    returnResponseToBackground({ success: false });
                    STN_cancelSelectImage();
                    break;
            }
            break;
        case 'SAVE_CAPTURE_PORTION':
            STN_saveCapturePortion();
            break;
        case 'asyncExec':
            // try {
            chrome.runtime.sendMessage(event.data, function (response) {
                println('async exec response:', response);
                // done(response)
                // done = null
            });
            // } catch (e) {
            //   done({ success: false, message: "please reload the page" })
            // }
            break;
    }
}
function stopContentScriptListener() {
    window.removeEventListener('message', listener);
}
if (!created) {
    created = true;
    window.addEventListener('message', listener, false);
}


/***/ }),
/* 7 */,
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getCancelSnackbarHtml = exports.InjectableTakeScreenshotSelection = exports.InjectableTakeScreenshotScreen = void 0;
// @ts-ignore
exports.InjectableTakeScreenshotScreen = {
    css: `
  .savetonotion-button {
    border: none;
    margin: 0;
    padding: 0;
    width: auto;
    overflow: visible;
    background: transparent;
    color: inherit;
    font: inherit;
    line-height: normal;
    -webkit-font-smoothing: inherit;
    -moz-osx-font-smoothing: inherit;
    -webkit-appearance: none;
  }
  
  .savetonotion-button:focus {
    outline: none;
    box-shadow: none;
  }
  
  
  
  .outlined-button-small {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    height: 36px !important;
    padding: 0 20px !important;
    border-style: solid !important;
    border-width: 1px !important;
    border-color: rgba(255, 255, 255, 0.3) !important;
    border-radius: 8px !important;
    background-color: rgba(255, 255, 255, 0.1) !important;
    color: #FFFFFF !important;
    text-decoration: none !important;
    cursor: pointer !important;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
    font-size: 14px !important;
    font-weight: 500 !important;
    transition: all 0.2s ease-out !important;
    -webkit-font-smoothing: antialiased !important;
    -moz-osx-font-smoothing: grayscale !important;
  }
  
  .outlined-button-small:hover {
    background-color: rgba(255, 255, 255, 0.15) !important;
    border-color: rgba(255, 255, 255, 0.4) !important;
  }
  
  .outlined-button-small:active {
    background-color: rgba(255, 255, 255, 0.2) !important;
    border-color: rgba(255, 255, 255, 0.5) !important;
  }
  
  .outlined-button-small:focus {
    background-color: rgba(255, 255, 255, 0.15) !important;
    outline: none !important;
  }
  
  .outlined-button-small.stn {
    background-color: rgba(255, 255, 255, 0.1) !important;
  }
  
  .div {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    margin-right: -10px;
    margin-left: -9px;
    padding: 12px 10px;
    -webkit-box-pack: justify;
    -webkit-justify-content: space-between;
    -ms-flex-pack: justify;
    justify-content: space-between;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    background-color: #fff;
  }
  
  .sym-injectable-take-screenshot-screen {
    position: fixed !important;
    left: 0% !important;
    top: 0% !important;
    right: 0% !important;
    bottom: 0% !important;
    z-index: 2000000000 !important;
    display: -webkit-box !important;
    display: -webkit-flex !important;
    display: -ms-flexbox !important;
    display: flex !important;
    padding: 20px 10px !important;
    -webkit-box-orient: vertical !important;
    -webkit-box-direction: normal !important;
    -webkit-flex-direction: column !important;
    -ms-flex-direction: column !important;
    flex-direction: column !important;
    -webkit-box-pack: center !important;
    -webkit-justify-content: center !important;
    -ms-flex-pack: center !important;
    justify-content: center !important;
    -webkit-box-align: center !important;
    -webkit-align-items: center !important;
    -ms-flex-align: center !important;
    align-items: center !important;
    background-color: rgba(0, 0, 0, 0.6) !important;
    color: #fff !important;
  }
  
  .text-block-21 {
    color: #FFFFFF !important;
    font-size: 20px !important;
    font-weight: 400 !important;
    text-align: center !important;
    line-height: 1.6 !important;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
    opacity: 0.95 !important;
  }
  
  .div-block-132 {
    margin-top: 32px !important;
  }
  
  .image-10 {
    margin-bottom: 0px !important;
    opacity: 0.9 !important;
  }
  
  .text-btn.stn {
    font-weight: 500 !important;
    font-size: 14px !important;
    color: #FFFFFF !important;
  }
  
  .div-block-133 {
    margin-bottom: 24px !important;
  }`,
    html: ({ actionCancelButton, }) => `<div id="savetonotion-take-screenshot" class="sym-injectable-take-screenshot-screen" style="display:fixed !important;">
          <div class="div-block-133"><svg xmlns="http://www.w3.org/2000/svg"  width="82" alt="" class="image-10"   height="82" alt="" class="image-10"  fill="currentcolor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><polyline points="168 48 208 48 208 88" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></polyline><polyline points="88 208 48 208 48 168" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></polyline><polyline points="208 168 208 208 168 208" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></polyline><polyline points="48 88 48 48 88 48" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></polyline></svg></div>
          <div class="text-block-21">Drag or Click on the page to select a region.<br><span style="opacity: 0.7 !important; font-size: 18px !important;">Press ESC to cancel.</span></div>
          <div class="div-block-132">
            <button class="savetonotion-button outlined-button-small stn r-cancel-button w-inline-block" id="btn-actionCancelButton">
              <div class="text-btn stn">Cancel</div>
            </button>
          </div>
        </div>`,
};
// @ts-ignore
exports.InjectableTakeScreenshotSelection = {
    css: `
  .savetonotion-button {
    border: none;
    margin: 0;
    padding: 0;
    width: auto;
    overflow: visible;
    background: transparent;
    color: inherit;
    font: inherit;
    line-height: normal;
    -webkit-font-smoothing: inherit;
    -moz-osx-font-smoothing: inherit;
    -webkit-appearance: none;
  }
  
  .savetonotion-button:focus {
    outline: none;
    box-shadow: none;
  }
  
  
  
  .primary-button {
    display: block;
    padding: 9px 15px;
    border-radius: 6px;
    background-color: #335cff;
  }
  
  .primary-button:hover {
    background-color: #2547D0;
  }
  
  .primary-button:active {
    background-color: #2547D0;
  }
  
  .primary-button:focus {
    background-color: #2547D0;
  }
  
  .primary-button.with-icon {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    height: 40px;
    padding: 4px 16px;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    color: #fff;
    text-decoration: none;
    cursor: pointer;
  }
  
  .primary-button.with-icon.r-save-button {
    height: 40px;
  }
  
  .div {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    margin-right: -10px;
    margin-left: -9px;
    padding: 12px 10px;
    -webkit-box-pack: justify;
    -webkit-justify-content: space-between;
    -ms-flex-pack: justify;
    justify-content: space-between;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    background-color: #fff;
  }
  
  .sym-injectable-take-screenshot-selection {
    position: absolute;
    left: 0%;
    top: 0%;
    right: 0%;
    bottom: 0%;
    z-index: 2000000000;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    padding: 20px 10px;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
    color: #fff;
  }
  
  .white-button {
    display: block;
    padding: 9px 15px;
    border-radius: 6px;
    background-color: #335cff;
  }
  
  .white-button:hover {
    background-color: #2547D0;
  }
  
  .white-button:active {
    background-color: #2547D0;
  }
  
  .white-button:focus {
    background-color: #2547D0;
  }
  
  .white-button.with-icon {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    height: 40px;
    padding: 4px 11px;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    color: #fff;
    text-decoration: none;
    cursor: pointer;
  }
  
  .white-button.with-icon.r-save-button {
    height: 33px;
    padding: 3px;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    -ms-flex-pack: center;
    justify-content: center;
    background-color: #fff;
    color: #333;
  }
  
  .white-button.with-icon.r-save-button:hover {
    background-color: #d6d6d6;
  }
  
  .white-button.with-icon.r-save-button:active {
    background-color: #c5c5c5;
  }
  
  .white-button.with-icon.r-close-button {
    height: 40px;
    width: 40px;
    padding: 8px;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    -ms-flex-pack: center;
    justify-content: center;
    background-color: #fff;
    color: #333;
  }
  
  .white-button.with-icon.r-close-button svg {
    width: 24px !important;
    height: 24px !important;
  }
  
  .white-button.with-icon.r-close-button:hover {
    background-color: #d6d6d6;
  }
  
  .white-button.with-icon.r-close-button:active {
    background-color: #c5c5c5;
  }
  
  .white-button.no-icon {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    height: 40px;
    padding: 4px 11px;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    color: #fff;
    text-decoration: none;
    cursor: pointer;
  }
  
  .white-button.no-icon.r-caption-button {
    height: 40px;
    padding: 0 16px;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    -ms-flex-pack: center;
    justify-content: center;
    background-color: #fff;
    color: #333;
  }
  
  .white-button.no-icon.r-caption-button:hover {
    background-color: #d6d6d6;
  }
  
  .white-button.no-icon.r-caption-button:active {
    background-color: #c5c5c5;
  }
  
  .mr5 {
    margin-right: 5px !important;
  }
  
  .bar-bottom-info {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    margin-top: 0px !important;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
  }
  
  .bar-selectable-zone {
    position: relative;
    width: 150px;
    height: 150px;
    border-style: solid;
    border-width: 2px;
    border-color: #fff;
  }
  
  .div-block-135 {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-pack: start;
    -webkit-justify-content: flex-start;
    -ms-flex-pack: start;
    justify-content: flex-start;
    -webkit-box-align: end;
    -webkit-align-items: flex-end;
    -ms-flex-align: end;
    align-items: flex-end;
  }
  
  .resizer {
    width: 15px;
    height: 15px;
    border-radius: 20px;
    background-color: #fff;
    box-shadow: -1px -1px 3px 0 rgba(0, 0, 0, 0.3), 1px 1px 3px 0 rgba(0, 0, 0, 0.3);
  }
  
  .resizer.top-left {
    position: absolute;
    left: 0%;
    top: 0%;
    right: auto;
    bottom: auto;
    margin-top: -8px;
    margin-left: -8px;
    cursor: nwse-resize;
  }
  
  .resizer.top-right {
    position: absolute;
    left: auto;
    top: 0%;
    right: 0%;
    bottom: auto;
    margin-top: -8px;
    margin-right: -8px;
    cursor: nesw-resize;
  }
  
  .resizer.bottom-left {
    position: absolute;
    left: 0%;
    top: auto;
    right: auto;
    bottom: 0%;
    margin-bottom: -8px;
    margin-left: -8px;
    cursor: nesw-resize;
  }

  .v-text {
    font-weight: 400 !important;
    font-size: 15px !important;
    font-family: 'Inter' !important;
  }
  
  .resizer.bottom-right {
    position: absolute;
    left: auto;
    top: auto;
    right: 0%;
    bottom: 0%;
    margin-right: -8px;
    margin-bottom: -8px;
    cursor: nwse-resize;
  }`,
    html: ({ actionCloseButton, actionCaptionButton, actionSaveButton, }) => `<div id="savetonotion-take-screenshot" class="sym-injectable-take-screenshot-selection">
          <div class="div-block-135">
            <div class="bar-selectable-zone">
              <div class="resizer top-left"></div>
              <div class="resizer top-right"></div>
              <div class="resizer bottom-left"></div>
              <div class="resizer bottom-right"></div>
            </div>
            <div class="bar-bottom-info">
              <div class="mr5">
                <button id="btn-actionCloseButton" x-title="Cancel screenshot" class="savetonotion-button white-button with-icon r-close-button w-inline-block"><svg xmlns="http://www.w3.org/2000/svg"  width="28" alt=""   height="28" alt=""  fill="currentcolor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><line x1="200" y1="56" x2="56" y2="200" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></line><line x1="200" y1="200" x2="56" y2="56" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></line></svg></button>
              </div>
              <div class="mr5">
                <button id="btn-actionCaptionButton" x-title="Add a caption to your screenshot" class="savetonotion-button white-button no-icon r-caption-button w-inline-block">
                  <div class="v-text">Add Caption</div>
                </button>
              </div>
              <button id="btn-actionSaveButton" class="savetonotion-button primary-button with-icon r-save-button w-inline-block">
                <div class="v-text">Save Screenshot</div>
              </button>
            </div>
          </div>
        </div>`,
};
const getCancelSnackbarHtml = ({ msg, actionCancel }) => `
    <div id="${`cancelsnackbar-${idName}`}" class="sym-injectable-select-image cancelsnackbar-s2n" style="
    z-index: 2147483648 !important;
    position: fixed;
    left: 0%;
    top: auto;
    right: 0%;
    bottom: 0%;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    padding: 20px 10px !important;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    ">
          <div class="oklm flex" style="
          padding: 12px 16px;
          border-radius: 9999px;
          background-color: rgba(0, 0, 0, 0.8);
          color: #FFFFFF !important;
          font-size: 14px !important;
          font-weight: 400 !important;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
          text-align: center;
          display: -webkit-box;
          display: -webkit-flex;
          display: -ms-flexbox;
          display: flex;
          -webkit-box-align: center;
          -webkit-align-items: center;
          -ms-flex-align: center;
          align-items: center;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(255, 255, 255, 0.1);
          ">
            <div class="mr5 cancelsnackbar-label" style="
    margin-right: 10px;
            ">${msg || 'Click on an image on the page'}, "Escape" to cancel</div>
            <button class="mr5 cancelsnackbar-button" style="
    margin-right: 10px;
    display:none;
            ">Continue</button>
            <div class="g-cancel-button"><button id="btn-actionCancel" class="outlined-button-small-${idName}"
            >
                <div class="v-text" style="color: #FFFFFF !important; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important; font-size: 14px !important; font-weight: 500 !important;">Cancel</div>
              </button></div>
          </div>
    </div>
  `;
exports.getCancelSnackbarHtml = getCancelSnackbarHtml;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.partition = exports.isNil = exports.combine = exports.mergeDeep = exports.pick = exports.omit = exports.timeAgo = exports.getTodayDate = exports.formatNotionDateToIsoDate = exports.formatDateToNotionDate = exports.arrayMove = exports.getChipColor = exports.throttle = exports.sleep = exports.print = exports.makeid = exports.call = exports.dataURItoBlob = exports.promisifyCallback = exports.promisify = exports.a2r = exports.sortByKey = void 0;
const appConfig_1 = __webpack_require__(10);
function sortByKey(array, key) {
    return array.sort(function (a, b) {
        var x = a[key];
        var y = b[key];
        if (!x || !y)
            return 1;
        return x < y ? -1 : x > y ? 1 : 0;
    });
}
exports.sortByKey = sortByKey;
function a2r(arr, key) {
    let m = {};
    arr.forEach((e) => {
        if (typeof e == 'string') {
            m[e] = e;
        }
        else {
            m[e[key]] = e;
        }
    });
    return m;
}
exports.a2r = a2r;
function promisify(fn) {
    return new Promise((accept, cancel) => {
        fn(accept);
    });
}
exports.promisify = promisify;
function promisifyCallback(fn, options) {
    return new Promise((accept, cancel) => {
        fn(options, accept);
    });
}
exports.promisifyCallback = promisifyCallback;
function dataURItoBlob(dataURI) {
    var binary = atob(dataURI.split(',')[1]);
    var array = [];
    for (var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
}
exports.dataURItoBlob = dataURItoBlob;
function call(cb) {
    new Promise((resolve, cancel) => {
        resolve(cb());
    });
}
exports.call = call;
function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
exports.makeid = makeid;
exports.print =  true ? (...args) => { } : undefined;
const sleep = (ms) => __awaiter(void 0, void 0, void 0, function* () { return new Promise((resolve) => setTimeout(resolve, ms)); });
exports.sleep = sleep;
//dead simple implementation. more robust here: https://stackoverflow.com/questions/27078285/simple-throttle-in-js
function throttle(fn, waitMs) {
    let last;
    let prevFn;
    let prevTimer;
    return (...args) => {
        const now = new Date();
        if (prevFn) {
            prevFn(undefined);
            clearTimeout(prevTimer);
            prevFn = null;
        }
        return new Promise((resolve) => {
            const x = last
                ? Math.max(0, waitMs - (now.getTime() - last.getTime()))
                : 0;
            prevFn = resolve;
            prevTimer = setTimeout(function () {
                last = now;
                prevFn = null;
                resolve(fn.apply(null, args));
            }, x);
        });
    };
}
exports.throttle = throttle;
function getChipColor(option) {
    if ((option === null || option === void 0 ? void 0 : option.color) === 'custom' &&
        /^#[0-9a-f]{6}$/i.test((option === null || option === void 0 ? void 0 : option.color_custom) || '')) {
        return option.color_custom;
    }
    return option.color in appConfig_1.notionColors
        ? appConfig_1.notionColors[option.color]
        : appConfig_1.notionColors.default;
}
exports.getChipColor = getChipColor;
const arrayMoveMutate = (array, from, to) => {
    const startIndex = to < 0 ? array.length + to : to;
    const item = array.splice(from, 1)[0];
    array.splice(startIndex, 0, item);
};
const arrayMove = (array, from, to) => {
    array = array.slice();
    arrayMoveMutate(array, from, to);
    return array;
};
exports.arrayMove = arrayMove;
function formatDateToNotionDate(date) {
    let ndate = typeof date == 'string' ? new Date(date) : date;
    var nDay = new Date(ndate.getTime());
    var dd = String(nDay.getDate()).padStart(2, '0');
    var mm = String(nDay.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = nDay.getFullYear();
    return yyyy + '-' + mm + '-' + dd;
}
exports.formatDateToNotionDate = formatDateToNotionDate;
function formatNotionDateToIsoDate(date) {
    return new Date(date).toISOString();
}
exports.formatNotionDateToIsoDate = formatNotionDateToIsoDate;
function getTodayDate(dayPlus = 0) {
    var current = new Date(); //'Mar 11 2015' current.getTime() = 1426060964567
    var nDay = new Date(current.getTime() + 86400000 * dayPlus);
    var dd = String(nDay.getDate()).padStart(2, '0');
    var mm = String(nDay.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = nDay.getFullYear();
    return yyyy + '-' + mm + '-' + dd;
}
exports.getTodayDate = getTodayDate;
function timeAgo(previous) {
    const current = new Date();
    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;
    var elapsed = Date.parse(current.toString()) - Date.parse(previous.toString());
    const s = (d) => (d > 1 ? 's' : '');
    if (elapsed < msPerMinute) {
        return 'just now';
        //const d = Math.round(elapsed/1000)
        //return  d + ` second${s(d)} ago`;
    }
    else if (elapsed < msPerHour) {
        const d = Math.round(elapsed / msPerMinute);
        return d + ` minute${s(d)} ago`;
    }
    else if (elapsed < msPerDay) {
        const d = Math.round(elapsed / msPerHour);
        return Math.round(elapsed / msPerHour) + ` hour${s(d)} ago`;
    }
    else if (elapsed < msPerMonth) {
        const d = Math.round(elapsed / msPerDay);
        return d + ` day${s(d)} ago`;
    }
    else if (elapsed < msPerYear) {
        const d = Math.round(elapsed / msPerMonth);
        return d + ` month${s(d)} ago`;
    }
    else {
        const d = Math.round(elapsed / msPerYear);
        return d + ` year${s(d)} ago`;
    }
}
exports.timeAgo = timeAgo;
const omit = (obj, ...keys) => {
    const ret = {};
    let key;
    for (key in obj) {
        if (!keys.includes(key)) {
            ret[key] = obj[key];
        }
    }
    return ret;
};
exports.omit = omit;
function pick(obj, ...keys) {
    const ret = {};
    for (const key of keys) {
        if (key in obj) {
            ret[key] = obj[key];
        }
    }
    return ret;
}
exports.pick = pick;
/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
function isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item);
}
/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
function mergeDeep(target, ...sources) {
    if (!sources.length)
        return target;
    const source = sources.shift();
    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key])
                    Object.assign(target, { [key]: {} });
                mergeDeep(target[key], source[key]);
            }
            else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }
    return mergeDeep(target, ...sources);
}
exports.mergeDeep = mergeDeep;
function combine(arr) {
    return arr.reduce((res, cur) => mergeDeep(res, cur), {});
}
exports.combine = combine;
function isNil(value) {
    return value === undefined || value === null;
}
exports.isNil = isNil;
function partition(array, predicate) {
    return array.reduce((acc, val, i, arr) => {
        acc[predicate(val, i, arr) ? 0 : 1].push(val);
        return acc;
    }, [[], []]);
}
exports.partition = partition;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.errorCodesMap = exports.randomNotionColor = exports.notionColors = exports.NOTION_ACTIVE_USER_ID = exports.NOTION_CLIENT_DATA_KEY = exports.COOKIE_KEY = exports.WHATS_NEW_LINK = exports.APP_VERSION_FULL = exports.APP_VERSION = exports.APP_NAME_SLUG = void 0;
exports.APP_NAME_SLUG = 'save-to-notion';
exports.APP_VERSION = '1.1.4';
exports.APP_VERSION_FULL = '1.1.4';
exports.WHATS_NEW_LINK = 'https://www.notion.so/What-s-new-Save-To-Notion-b85cff00e8c24b10a893a6aa18a887fa';
exports.COOKIE_KEY = 'cookie';
exports.NOTION_CLIENT_DATA_KEY = 'notion-client-data-v2';
exports.NOTION_ACTIVE_USER_ID = 'notion-active-user-id';
exports.notionColors = {
    default: 'rgba(206, 205, 202, 0.5)',
    gray: 'rgba(155, 154, 151, 0.4)',
    brown: 'rgba(140, 46, 0, 0.2)',
    yellow: 'rgba(233, 168, 0, 0.2)',
    green: 'rgba(0, 135, 107, 0.2)',
    orange: 'rgba(245, 93, 0, 0.2)',
    blue: 'rgba(0, 120, 223, 0.2)',
    purple: 'rgba(103, 36, 222, 0.2)',
    pink: 'rgba(221, 0, 129, 0.2)',
    red: 'rgba(255, 0, 26, 0.2)',
};
function randomNotionColor() {
    return Object.keys(exports.notionColors)[Math.floor(Math.random() * Object.keys(exports.notionColors).length)];
}
exports.randomNotionColor = randomNotionColor;
exports.errorCodesMap = {
    NO_INTERNET: "Wasn't able to send this item to Notion, ensure you are connected to internet",
    BACKGROUND_ON_SUBMIT_NOT_LOGGED_IN_TO_NOTION: 'it seems you are not logged in to Notion, please log in and try again',
    BACKGROUND_FORMATING_ERROR: 'Formatting error, please contact the developer',
    BACKGROUND_FAILED_TO_FETCH_NOTION_TEMPLATE: 'failed to fetch the Notion Template, please check that it exists',
    BACKGROUND_FAILED_TO_CREATE_PAGE: 'failed to create the page',
    BACKGROUND_FAILED_CODE: 'An error occurred while saving the page. Please ensure you are logged in to notion.so in this browser with access to the correct workspace, then try again with the clipper.',
    BACKGROUND_TOKEN_EXPIRED: "Can't access the workspace - please go to notion.so on this browser and check you are logged in to the right workspace",
};


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFullScreenImage = void 0;
const screenshot_1 = __webpack_require__(6);
const STRIP_BOTTOM_OFFSET = 170;
const MAX_HEIGHT = 15000 * 2;
let screenContext = getInitialScreenContext();
function getInitialScreenContext() {
    return {
        fixedTopElements: [],
        fixedBottomElements: [],
        scrollLeft: 0,
        scrollTop: 0,
        currentX: 0,
        currentY: 0,
        hideTheScrollBars: false,
        elm: null,
        promiseAccept: null,
        cancelSnackBarEl: null,
        cancelSnackBarLabelEl: null,
        active: false,
    };
}
// export async function getFullScreenImage(): Promise<{
//     imageBase64: string,
//     width: number,
//     height: number
// }> {
//     await showUi();
//     const CAPTURE_DELAY = 150;
//     const scrollPad = 200;
//     const body = document.body;
//     const originalBodyOverflowYStyle = body ? body.style.overflowY : '';
//     const originalX = window.scrollX;
//     const originalY = window.scrollY;
//     const originalOverflowStyle = document.documentElement.style.overflow;
//     if (body) {
//         body.style.overflowY = 'visible';
//     }
//     const fullWidth = Math.max(
//         document.documentElement.clientWidth,
//         body ? body.scrollWidth : 0,
//         document.documentElement.scrollWidth,
//         body ? body.offsetWidth : 0,
//         document.documentElement.offsetWidth
//     );
//     const fullHeight = Math.max(
//         document.documentElement.clientHeight,
//         body ? body.scrollHeight : 0,
//         document.documentElement.scrollHeight,
//         body ? body.offsetHeight : 0,
//         document.documentElement.offsetHeight
//     );
//     const windowWidth = window.innerWidth;
//     const windowHeight = window.innerHeight;
//     const yDelta = windowHeight - (windowHeight > scrollPad ? scrollPad : 0);
//     const xDelta = windowWidth;
//     const arrangements = [];
//     let yPos = fullHeight - windowHeight;
//     let xPos;
//     while (yPos > -yDelta) {
//         xPos = 0;
//         while (xPos < fullWidth) {
//             arrangements.push([xPos, yPos]);
//             xPos += xDelta;
//         }
//         yPos -= yDelta;
//     }
//     document.documentElement.style.overflow = 'hidden';
//     const screenshots:Screenshot[] = [];
//     for (const [x, y] of arrangements) {
//         window.scrollTo(x, y);
//         await sleep(CAPTURE_DELAY);
//         const data = {
//             x: window.scrollX,
//             y: window.scrollY,
//             windowWidth: windowWidth,
//             totalWidth: fullWidth,
//             totalHeight: fullHeight,
//             devicePixelRatio: window.devicePixelRatio
//         };
//         console.log('Capturing:', data);
//         const captured = await bgAsk('captureVisibleTab', undefined);
//         if (captured) {
//             screenshots.push({...data, image:captured, needToStripBottom: false});
//         } else {
//             console.error('Capture failed');
//             break;
//         }
//     }
//     document.documentElement.style.overflow = originalOverflowStyle;
//     if (body) {
//         body.style.overflowY = originalBodyOverflowYStyle;
//     }
//     window.scrollTo(originalX, originalY);
//     const mergedImage = await mergeScreenshots(screenshots, fullWidth, fullHeight, window.devicePixelRatio);
//     await removeUi();
//     return {
//         imageBase64: mergedImage,
//         width: fullWidth,
//         height: fullHeight
//     };
// }
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// Improved document dimension detection for complex layouts
function getActualDocumentWidth() {
    const body = document.body;
    const documentElement = document.documentElement;
    const candidates = [
        body.scrollWidth,
        body.offsetWidth,
        body.clientWidth,
        documentElement.scrollWidth,
        documentElement.offsetWidth,
        documentElement.clientWidth
    ].filter(w => w > 0);
    // For modern layouts, also check computed styles and transforms
    let maxComputedWidth = 0;
    try {
        const computedStyle = getComputedStyle(body);
        if (computedStyle.width !== 'auto') {
            const parsed = parseFloat(computedStyle.width);
            if (!isNaN(parsed)) {
                maxComputedWidth = Math.max(maxComputedWidth, parsed);
            }
        }
        // Check for containers that might define the actual content width
        const containers = document.querySelectorAll('[class*="container"], [class*="wrapper"], [class*="content"], main, .main');
        containers.forEach(container => {
            const rect = container.getBoundingClientRect();
            if (rect.width > 0) {
                candidates.push(rect.right + window.scrollX);
            }
        });
    }
    catch (e) {
        // Fallback if any computed style operations fail
    }
    candidates.push(maxComputedWidth);
    return Math.max(...candidates);
}
function getActualDocumentHeight() {
    const body = document.body;
    const documentElement = document.documentElement;
    const candidates = [
        body.scrollHeight,
        body.offsetHeight,
        body.clientHeight,
        documentElement.scrollHeight,
        documentElement.offsetHeight,
        documentElement.clientHeight
    ].filter(h => h > 0);
    // For modern layouts, also check the actual content bounds
    let maxContentBottom = 0;
    try {
        // Check all child elements for their bottom position
        const allElements = document.querySelectorAll('*');
        allElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            if (rect.height > 0) {
                maxContentBottom = Math.max(maxContentBottom, rect.bottom + window.scrollY);
            }
        });
        // Special handling for elements with transforms that might extend beyond normal bounds
        const transformedElements = document.querySelectorAll('[style*="transform"], [class*="transform"]');
        transformedElements.forEach(element => {
            try {
                const computedStyle = getComputedStyle(element);
                const transform = computedStyle.transform;
                if (transform && transform !== 'none') {
                    const rect = element.getBoundingClientRect();
                    // Add some buffer for transformed elements
                    maxContentBottom = Math.max(maxContentBottom, rect.bottom + window.scrollY + 50);
                }
            }
            catch (e) {
                // Ignore errors in individual element processing
            }
        });
    }
    catch (e) {
        // Fallback if getBoundingClientRect fails on any element
    }
    candidates.push(maxContentBottom);
    // Final safety check: ensure we have a reasonable minimum height
    const finalHeight = Math.max(...candidates);
    return Math.max(finalHeight, window.innerHeight);
}
// Smart waiting that adapts to page loading state
function smartWait(baseDelayMs) {
    return __awaiter(this, void 0, void 0, function* () {
        // Start with base delay
        yield sleep(baseDelayMs);
        // Additional wait if page seems to be loading
        if (document.readyState !== 'complete') {
            yield sleep(Math.min(baseDelayMs, 500));
        }
        // Wait for any pending images to load
        const images = Array.from(document.querySelectorAll('img'));
        const unloadedImages = images.filter(img => !img.complete);
        if (unloadedImages.length > 0) {
            yield Promise.race([
                Promise.all(unloadedImages.map(img => new Promise(resolve => {
                    if (img.complete)
                        resolve(null);
                    img.onload = () => resolve(null);
                    img.onerror = () => resolve(null);
                    // Timeout after 2 seconds for any single image
                    setTimeout(() => resolve(null), 2000);
                }))),
                sleep(1000) // Don't wait more than 1 second total for all images
            ]);
        }
        // Wait for any pending animations or transitions
        return new Promise((resolve) => {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    resolve();
                });
            });
        });
    });
}
// Retry mechanism for capture operations
function bgAskWithRetry(ev, props, maxRetries = 3, retryDelay = 200) {
    return __awaiter(this, void 0, void 0, function* () {
        let lastError = null;
        for (let attempt = 0; attempt < maxRetries; attempt++) {
            try {
                const result = yield bgAsk(ev, props);
                if (result) {
                    return result;
                }
                throw new Error(`Empty result on attempt ${attempt + 1}`);
            }
            catch (error) {
                lastError = error;
                console.warn(`bgAsk attempt ${attempt + 1} failed:`, error);
                if (attempt < maxRetries - 1) {
                    yield sleep(retryDelay * (attempt + 1)); // Exponential backoff
                }
            }
        }
        throw new Error(`bgAsk failed after ${maxRetries} attempts. Last error: ${lastError === null || lastError === void 0 ? void 0 : lastError.message}`);
    });
}
// Ensure viewport dimensions are stable before starting capture
function ensureViewportStability() {
    return __awaiter(this, void 0, void 0, function* () {
        let lastWidth = window.innerWidth;
        let lastHeight = window.innerHeight;
        let stableCount = 0;
        const requiredStableChecks = 3;
        const checkInterval = 100;
        return new Promise((resolve) => {
            const checkStability = () => {
                const currentWidth = window.innerWidth;
                const currentHeight = window.innerHeight;
                if (currentWidth === lastWidth && currentHeight === lastHeight) {
                    stableCount++;
                    if (stableCount >= requiredStableChecks) {
                        resolve();
                        return;
                    }
                }
                else {
                    stableCount = 0;
                    lastWidth = currentWidth;
                    lastHeight = currentHeight;
                }
                setTimeout(checkStability, checkInterval);
            };
            checkStability();
        });
    });
}
function mergeScreenshotsAndGetFinalImages(screenshots, fullWidth, fullHeight, devicePixelRatio) {
    return __awaiter(this, void 0, void 0, function* () {
        const canvas = document.createElement('canvas');
        canvas.width = fullWidth * devicePixelRatio;
        canvas.height = fullHeight * devicePixelRatio;
        const ctx = canvas.getContext('2d');
        let yPos = 0;
        let xPos;
        let tmps = [];
        let i = 0;
        // console.log('mergeScreenshotsAndGetFinalImages: canvas width', canvas.width, 'canvas height', canvas.height);
        let prevImgPos = null;
        for (const screenshot of screenshots) {
            let img;
            try {
                img = yield loadActualImage(screenshot.image, screenshot.needToStripBottom, screenshot.top, prevImgPos, devicePixelRatio);
            }
            catch (e) {
                console.error(e);
                throw "fail";
            }
            // output img dimension, with prefix label
            // output canvas width, with prefix label
            // tmps.push({
            //     imageBase64: img.src,
            //     width:null,
            //     height:null,
            // })
            xPos = 0;
            prevImgPos = { yPos, height: img.height };
            ctx.drawImage(img, 0, yPos);
            // while (xPos < fullWidth) {
            //     ctx.drawImage(img, xPos, yPos);
            //     xPos += img.width ; // Use img.width instead of window.innerWidth
            // }
            yPos += img.height; // Use img.height instead of window.innerHeight
            i++;
        }
        // split the canvas in multiple images if too high or too wide...
        return yield splitCanvasIntoImages(canvas, MAX_HEIGHT);
    });
}
function splitCanvasIntoImages(canvas, maxHeight) {
    return __awaiter(this, void 0, void 0, function* () {
        if (canvas.height <= maxHeight) {
            return [{
                    imageBase64: canvas.toDataURL(),
                    width: canvas.width,
                    height: canvas.height
                }];
        }
        const images = [];
        let currentHeight = 0;
        while (currentHeight < canvas.height) {
            const sliceHeight = Math.min(maxHeight, canvas.height - currentHeight);
            const sliceCanvas = document.createElement('canvas');
            sliceCanvas.width = canvas.width;
            sliceCanvas.height = sliceHeight;
            const sliceCtx = sliceCanvas.getContext('2d');
            sliceCtx.drawImage(canvas, 0, currentHeight, canvas.width, sliceHeight, 0, 0, canvas.width, sliceHeight);
            images.push({
                imageBase64: sliceCanvas.toDataURL(),
                width: sliceCanvas.width,
                height: sliceCanvas.height
            });
            currentHeight += sliceHeight;
        }
        return images;
    });
}
function bgAsk(ev, props) {
    return new Promise((accept) => {
        chrome.runtime.sendMessage({
            event: ev,
            props,
            destination: 'background',
            v2: true,
        }, (resp) => {
            accept(resp);
        });
    });
}
function loadImage(imageUrl) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = (err) => {
            console.error(`Failed to load image: ${imageUrl}`, err);
            reject(err);
        };
        img.src = imageUrl;
    });
}
function cropImage(img, options) {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const xStart = options.xStart ? options.xStart(0) : 0;
        const yStart = options.yStart ? options.yStart(0) : 0;
        const xEnd = options.xEnd ? options.xEnd(img.width) : img.width;
        const yEnd = options.yEnd ? options.yEnd(img.height) : img.height;
        const cropWidth = xEnd - xStart;
        const cropHeight = yEnd - yStart;
        canvas.width = cropWidth;
        canvas.height = cropHeight;
        ctx.drawImage(img, xStart, yStart, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
        const croppedImg = new Image();
        croppedImg.onload = () => resolve(croppedImg);
        croppedImg.onerror = (err) => reject(err);
        croppedImg.src = canvas.toDataURL();
    });
}
function stripBottomOfImage(imageUrl, stripHeight) {
    return __awaiter(this, void 0, void 0, function* () {
        const img = yield loadImage(imageUrl);
        return cropImage(img, {
            yEnd: (currentY) => img.height - stripHeight
        });
    });
}
function loadActualImage(imageUrl, needToStripBottom, top, prevImgPos, devicePixelRatio) {
    return __awaiter(this, void 0, void 0, function* () {
        let img;
        if (needToStripBottom) {
            img = yield stripBottomOfImage(imageUrl, STRIP_BOTTOM_OFFSET * devicePixelRatio);
        }
        else {
            img = yield loadImage(imageUrl);
        }
        if (!prevImgPos) {
            return img;
        }
        else {
            const overlapEnd = prevImgPos.yPos + prevImgPos.height;
            if (top < overlapEnd && top + img.height > overlapEnd) {
                const cropHeight = overlapEnd - top;
                return yield cropImage(img, {
                    yStart: () => cropHeight
                });
            }
            else {
                return img;
            }
        }
    });
}
function createEmptyImage(width, height) {
    const emptyCanvas = document.createElement('canvas');
    emptyCanvas.width = width;
    emptyCanvas.height = height;
    return new Promise((resolve) => {
        const emptyImg = new Image();
        emptyImg.onload = () => resolve(emptyImg);
        emptyImg.src = emptyCanvas.toDataURL();
    });
}
function getFullScreenImage() {
    return __awaiter(this, void 0, void 0, function* () {
        screenContext = getInitialScreenContext();
        return new Promise((accept) => __awaiter(this, void 0, void 0, function* () {
            screenContext.promiseAccept = accept;
            screenContext.active = true;
            try {
                accept(yield _getFullScreenImage());
            }
            catch (e) {
                console.error(e);
                if (screenContext.active) {
                    // in case of error
                    accept([]);
                }
            }
        }));
    });
}
exports.getFullScreenImage = getFullScreenImage;
function handleCancel() {
    restoreScrollPos();
    enableScrollbar(true);
    showFixedElement("top");
    showFixedElement("bottom");
    removeBottomUi();
    if (screenContext.active) {
        screenContext.promiseAccept([]);
    }
    screenContext.active = false;
}
function _getFullScreenImage() {
    return __awaiter(this, void 0, void 0, function* () {
        showBottomUi("Capturing Full Page", handleCancel);
        // Ensure viewport stability before starting
        yield ensureViewportStability();
        var windowWidth = window.innerWidth;
        var windowHeight = window.innerHeight;
        // Improved document dimension detection for complex layouts
        var documentWidth = getActualDocumentWidth();
        var documentHeight = getActualDocumentHeight();
        if (getComputedStyle(document.body).overflowY == "hidden") {
            documentHeight = Math.min(documentHeight, windowHeight);
        }
        if (getComputedStyle(document.body).overflowX == "hidden") {
            documentWidth = Math.min(documentWidth, windowWidth);
        }
        saveScrollPos();
        scroll1PageDownFromTop();
        yield smartWait(300); // Smart wait instead of fixed delay
        enableScrollbar(false);
        fixedElementCheck();
        hideSomeStrangeElements();
        hideFixedElement("bottom");
        var documentLeftRightMargins = parseInt(getComputedStyle(document.body).marginLeft) + parseInt(getComputedStyle(document.body).marginRight);
        var documentTopBottomMargins = parseInt(getComputedStyle(document.body).marginTop) + parseInt(getComputedStyle(document.body).marginBottom);
        var currentX = 0;
        var currentY = 0;
        var oneLastTime = false;
        var lastX;
        var lastY;
        var screens = [];
        for (let i = 0; i < 200; i++) {
            if (!screenContext.active) {
                throw new Error("User cancelled");
            }
            const maxScrollable = Math.max(1, documentHeight - windowHeight);
            const progressPercent = Math.min(100, Math.max(0, Math.round((currentY / maxScrollable) * 100)));
            yield setLabelBottomUi(`Capturing Full Page (${progressPercent}%)...`);
            window.scrollTo(currentX, currentY);
            currentX = window.scrollX;
            currentY = window.scrollY;
            if (lastX === currentX && lastY === currentY)
                oneLastTime = true;
            lastX = currentX;
            lastY = currentY;
            if (currentY > 0) {
                yield hideFixedElement("top");
            }
            if (oneLastTime) {
                yield showFixedElement("bottom");
            }
            yield smartWait(500); // Smart wait instead of fixed delay
            if (oneLastTime) {
                yield opacityOffBottomUi();
            }
            var dataURL = yield bgAskWithRetry("captureVisibleTab", undefined, 3); // Add retry mechanism
            // Validate that we actually got a screenshot
            if (!dataURL || dataURL.length < 100) {
                console.warn(`Screenshot attempt ${i} returned invalid data, retrying...`);
                yield smartWait(500); // Extra wait before retry
                continue;
            }
            if (oneLastTime) {
                yield opacityOnBottomUi();
            }
            screens.push({
                top: currentY * window.devicePixelRatio,
                left: currentX * window.devicePixelRatio,
                image: dataURL,
                needToStripBottom: !oneLastTime,
            });
            if (oneLastTime)
                break;
            // if (currentX + windowWidth < documentWidth) {
            //   // Scroll Horizontally
            //   // console.log("scroll horizontally")
            //   currentX += windowWidth; // Change only x
            // } else {
            // Scroll vertically
            // console.log("scroll vertically")
            currentX = 0; // Stay on top left
            if (currentY + windowHeight >= documentHeight) {
                // No more scrolling
                oneLastTime = true;
                continue;
            }
            else {
                currentY += windowHeight - STRIP_BOTTOM_OFFSET;
            }
            // }
        }
        if (!screenContext.active) {
            throw new Error("User cancelled");
        }
        restoreScrollPos();
        enableScrollbar(true);
        showFixedElement("top");
        showFixedElement("bottom");
        yield setLabelBottomUi(`Almost done...`);
        const resp = yield mergeScreenshotsAndGetFinalImages(screens, documentWidth + documentLeftRightMargins, documentHeight, window.devicePixelRatio);
        if (!screenContext.active) {
            throw new Error("User cancelled");
        }
        yield removeBottomUi();
        screenContext.active = false;
        return resp;
    });
}
function scroll1PageDownFromTop() {
    window.scrollTo(0, window.innerHeight);
}
function saveScrollPos() {
    screenContext.scrollLeft = window.scrollX;
    screenContext.scrollTop = window.scrollY;
}
function enableScrollbar(enableFlag) {
    if (enableFlag) {
        try {
            //don't hide&show scrollbars when user select region
            if (screenContext.hideTheScrollBars) {
                restoreElementStyle(document.body, ["overflow-x", "overflow-y"]);
            }
        }
        catch (e) { }
    }
    else {
        try {
            exchangeElementStyle(document.body, ["overflow-x", "overflow-y"], "hidden");
            screenContext.hideTheScrollBars = true;
        }
        catch (e) { }
    }
}
function restoreElementStyle(element, styles) {
    if (!Array.isArray(styles)) {
        styles = [styles];
    }
    styles.forEach(function (style) {
        if (element.hasOwnProperty("style_" + style)) {
            element.style.removeProperty(style); // does not work with shorthand properties (background -> background-attachment)
            //element.style.setProperty(style, '', 'important');
            element.style.setProperty(style, element["style_" + style], element["style_" + style + "_priority"]);
        }
    });
}
function exchangeElementStyle(element, styles, value) {
    if (!Array.isArray(styles)) {
        styles = [styles];
    }
    styles.forEach(function (style) {
        if (!element.hasOwnProperty("style_" + style)) {
            element["style_" + style] = element.style.getPropertyValue(style) || null;
            element["style_" + style + "_priority"] =
                element.style.getPropertyPriority(style) || null;
        }
        element.style.setProperty(style, value, "important");
    });
}
function hideSomeStrangeElements() {
    // Original elements
    try {
        document.getElementById("presence").style.display = "none";
        window.setTimeout(() => {
            document.getElementById("presence").style.display = "";
        }, 10000);
    }
    catch (e) { }
    try {
        document.getElementById("navi-bar").style.display = "none";
        window.setTimeout(() => {
            document.getElementById("navi-bar").style.display = "";
        }, 10000);
    }
    catch (e) { }
    // Modern framework elements that commonly cause issues
    const problematicSelectors = [
        '[role="tooltip"]',
        '[data-testid*="tooltip"]',
        '.tooltip',
        '[class*="tooltip"]',
        '.popover',
        '[class*="popover"]',
        '[role="dialog"][aria-hidden="false"]',
        '.modal.show',
        '[class*="modal"][class*="open"]',
        '[class*="overlay"][class*="active"]',
        '[data-portal]',
        '[class*="react-popper"]',
        '[class*="floating-ui"]',
        // Common chat/help widgets
        '[id*="intercom"]',
        '[class*="intercom"]',
        '[id*="zendesk"]',
        '[class*="zendesk"]',
        '[id*="helpscout"]',
        '[class*="drift"]',
        '[class*="crisp"]'
    ];
    problematicSelectors.forEach(selector => {
        try {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                if (el && el !== screenContext.cancelSnackBarEl) {
                    exchangeElementStyle(el, ["display"], "none");
                    window.setTimeout(() => {
                        restoreElementStyle(el, ["display"]);
                    }, 10000);
                }
            });
        }
        catch (e) { }
    });
}
function fixedElementCheck() {
    // Hide fixed element
    // Add their visibility to custom tag
    if (getComputedStyle(document.body).backgroundAttachment === "fixed") {
        exchangeElementStyle(document.body, ["background-attachment"], "initial");
    }
    const nodeIterator = document.createNodeIterator(document.documentElement, NodeFilter.SHOW_ELEMENT, null);
    let currentNode;
    const windowHeight = window.innerHeight;
    while ((currentNode = nodeIterator.nextNode())) {
        const nodeComputedStyle = getComputedStyle(currentNode);
        // Skip nodes which don't have computedStyle or are invisible.
        if (!nodeComputedStyle) {
            continue;
        }
        const nodePosition = nodeComputedStyle.getPropertyValue("position");
        const zIndex = nodeComputedStyle.getPropertyValue("z-index");
        const transform = nodeComputedStyle.getPropertyValue("transform");
        // Enhanced detection for fixed/sticky elements
        const isFixedOrSticky = nodePosition === "fixed" || nodePosition === "sticky";
        const hasHighZIndex = zIndex !== "auto" && parseInt(zIndex) > 100;
        const hasTransform = transform && transform !== "none";
        // Modern sites often use high z-index with transforms for overlays
        const isProbablyFixed = isFixedOrSticky || (hasHighZIndex && hasTransform);
        if (isProbablyFixed) {
            // if node has id `cancelsnackbar-${idName}` then skip
            if (currentNode.id === `cancelsnackbar-${idName}`) {
                continue;
            }
            // Skip very small elements (likely decorative)
            const rect = currentNode.getBoundingClientRect();
            if (rect.width < 10 || rect.height < 10) {
                continue;
            }
            const nodeTop = rect.top;
            if (nodeTop < windowHeight / 2) {
                // show on Top
                if (!screenContext.fixedTopElements.includes(currentNode)) {
                    screenContext.fixedTopElements.push(currentNode);
                }
                if (document.body.scrollHeight < windowHeight * 2) {
                    exchangeElementStyle(currentNode, ["position"], "absolute");
                }
            }
            else {
                // show on bottom
                if (!screenContext.fixedBottomElements.includes(currentNode)) {
                    screenContext.fixedBottomElements.push(currentNode);
                }
            }
        }
    }
}
function hideFixedElement(inPosition) {
    var elements;
    if (inPosition == "top") {
        elements = screenContext.fixedTopElements;
    }
    else {
        elements = screenContext.fixedBottomElements;
    }
    elements.forEach(function (element) {
        exchangeElementStyle(element, ["display"], "none");
    });
}
function scrollToCurrent() {
    if (screenContext.currentX !== 0 || screenContext.currentY !== 0) {
        preparePage("before");
    }
    window.scrollTo(screenContext.currentX, screenContext.currentY);
}
function restoreScrollPos() {
    screenContext.currentX = screenContext.scrollLeft;
    screenContext.currentY = screenContext.scrollTop;
    scrollToCurrent();
}
function preparePage(inZman) {
    if (document.location.hostname === "www.facebook.com") {
        if (!screenContext.elm) {
            screenContext.elm = [
                document.querySelector("div#pagelet_sidebar"),
                document.querySelector(".uiContextualDialogPositioner"),
                document.querySelector(".fbFlyoutDialog"),
                document.querySelector("div#pagelet_bluebar"),
                document.querySelector("div#pagelet_dock"),
                document.querySelector("div#pagelet_channel"),
                document.querySelector("div#rightCol")
            ].filter(Boolean); // Filter out null elements
            if (inZman === "before") {
                screenContext.elm.forEach(el => {
                    el.dataset.prepareHide = "true";
                    el.style.display = "none";
                });
            }
        }
        if (inZman === "after") {
            screenContext.elm.forEach(el => {
                el.dataset.prepareHide = null;
                el.style.display = "";
            });
            screenContext.elm = null;
        }
    }
}
function showFixedElement(inPosition /* =top/bottom */) {
    var elements;
    if (inPosition == "top") {
        elements = screenContext.fixedTopElements;
    }
    else {
        elements = screenContext.fixedBottomElements;
    }
    elements.forEach(function (element) {
        restoreElementStyle(element, ["display"]);
    });
}
function showBottomUi(label, onCancel) {
    (0, screenshot_1.displayCancelSnackbar)("", onCancel);
    screenContext.cancelSnackBarEl = document.getElementById(`cancelsnackbar-${idName}`);
    screenContext.cancelSnackBarLabelEl = document.querySelector('.cancelsnackbar-label');
    setLabelBottomUi(label);
}
function setLabelBottomUi(label) {
    screenContext.cancelSnackBarLabelEl.textContent = label;
}
function waitForNextRepaint() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => {
            requestAnimationFrame(() => {
                resolve(true);
            });
        });
    });
}
function opacityOffBottomUi() {
    return __awaiter(this, void 0, void 0, function* () {
        if (screenContext.cancelSnackBarEl) {
            screenContext.cancelSnackBarEl.style.opacity = '0';
            yield waitForNextRepaint();
            yield sleep(10);
        }
    });
}
function opacityOnBottomUi() {
    return __awaiter(this, void 0, void 0, function* () {
        if (screenContext.cancelSnackBarEl) {
            screenContext.cancelSnackBarEl.style.opacity = '1';
            yield waitForNextRepaint();
            yield sleep(10);
        }
    });
}
function removeBottomUi() {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        (_a = screenContext.cancelSnackBarEl) === null || _a === void 0 ? void 0 : _a.remove();
        // in case the above line did not works
        (_b = document.getElementById(`cancelsnackbar-${idName}`)) === null || _b === void 0 ? void 0 : _b.remove();
    });
}
function putImageInRedBorder(img) {
    return __awaiter(this, void 0, void 0, function* () {
        const canvas = document.createElement('canvas');
        const borderWidth = 4;
        canvas.width = img.width + 2 * borderWidth;
        canvas.height = img.height + 2 * borderWidth;
        const ctx = canvas.getContext('2d');
        // Draw the red border
        ctx.fillStyle = 'red';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Draw the image inside the border
        ctx.drawImage(img, borderWidth, borderWidth);
        return new Promise((resolve) => {
            const borderedImg = new Image();
            borderedImg.onload = () => resolve(borderedImg);
            borderedImg.src = canvas.toDataURL();
        });
    });
}


/***/ })
/******/ ]);