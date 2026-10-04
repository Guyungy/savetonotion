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
/******/ 	return __webpack_require__inject_script_fix(__webpack_require__.s = 22);
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
/* 3 */,
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.comp2El = exports.addCss2 = exports.htmlString2El = void 0;
function htmlString2El(s) {
    var wrapper = document.createElement('div');
    wrapper.innerHTML = s;
    return wrapper.children[0];
}
exports.htmlString2El = htmlString2El;
function addCss2(rule) {
    let css = document.createElement('style');
    css.type = 'text/css';
    css.appendChild(document.createTextNode(rule)); // Support for the rest
    document.getElementsByTagName('head')[0].appendChild(css);
}
exports.addCss2 = addCss2;
function comp2El(comp, vars) {
    const el = htmlString2El(comp.html(vars));
    addCss2(typeof comp.css == 'function' ? comp.css(vars) : comp.css);
    return el;
}
exports.comp2El = comp2El;


/***/ }),
/* 5 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 6 */,
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {
/* eslint-disable no-param-reassign */
Object.defineProperty(exports, "__esModule", { value: true });
exports.destroy = exports.rescale = exports.draw = exports.clear = exports.init = void 0;
function getDocumentWidthAndHeight() {
    return {
        width: global.document.documentElement.clientWidth,
        height: global.document.documentElement.clientHeight,
    };
}
function createCanvas() {
    const canvas = global.document.createElement('canvas');
    canvas.id = 'stn-clip-content-canvas';
    const context = canvas.getContext('2d');
    // Set canvas width & height
    const { width, height } = getDocumentWidthAndHeight();
    setCanvasWidthAndHeight(canvas, context, { width, height });
    // Position canvas
    canvas.style.position = 'fixed';
    canvas.style.left = '0';
    canvas.style.top = '0';
    canvas.style.zIndex = '2147483644';
    // Disable any user interactions
    canvas.style.pointerEvents = 'none';
    global.document.body.appendChild(canvas);
    return { canvas, context, width, height };
}
function setCanvasWidthAndHeight(canvas, context, { width, height }) {
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    // Scale
    const scale = global.window.devicePixelRatio;
    canvas.width = Math.floor(width * scale);
    canvas.height = Math.floor(height * scale);
    // Normalize coordinate system to use css pixels.
    context.scale(scale, scale);
}
let state = {};
function init() {
    if (!state.canvas) {
        state = createCanvas();
    }
}
exports.init = init;
function clear() {
    if (state.context) {
        state.context.clearRect(0, 0, state.width, state.height);
    }
}
exports.clear = clear;
function draw(callback) {
    clear();
    callback(state.context);
}
exports.draw = draw;
function rescale() {
    // First reset so that the canvas size doesn't impact the container size
    setCanvasWidthAndHeight(state.canvas, state.context, {
        width: 0,
        height: 0,
    });
    const { width, height } = getDocumentWidthAndHeight();
    setCanvasWidthAndHeight(state.canvas, state.context, { width, height });
    // update state
    state.width = width;
    state.height = height;
}
exports.rescale = rescale;
function destroy() {
    if (state.canvas) {
        clear();
        state.canvas.parentNode.removeChild(state.canvas);
        state = {};
    }
}
exports.destroy = destroy;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(5)))

/***/ }),
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */
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
// import { htmlString2El, addCss2, comp2El } from '../clipper/clipperUtil'
const cancelSnackBar_1 = __webpack_require__(23);
const canvas_1 = __webpack_require__(7);
const visualizer_1 = __webpack_require__(24);
const utils_1 = __webpack_require__(25);
const confirmSelectionDialog_1 = __webpack_require__(26);
const getNodeCss_1 = __webpack_require__(1);
const getMatchingElements_1 = __webpack_require__(27);
const listFeature_1 = __webpack_require__(28);
function htmlString2El(s) {
    var wrapper = document.createElement('div');
    wrapper.innerHTML = s;
    return wrapper.children[0];
}
function addCss2(rule) {
    let css = document.createElement('style');
    css.type = 'text/css';
    css.appendChild(document.createTextNode(rule)); // Support for the rest
    document.getElementsByTagName('head')[0].appendChild(css);
}
function comp2El(comp, vars) {
    const el = htmlString2El(comp.html(vars));
    addCss2(typeof comp.css == 'function' ? comp.css(vars) : comp.css);
    return el;
}
// declare var action: keyof Actions
// declare var props: Actions[keyof Actions]
// const topleftBoxContainer = {
//     css: ``,
//     html: ({}) => `<div id="clipcontent" style="
//     all:unset;
//     cursor: pointer;
//     justify-items: center;
//     display: flex;
//     flex-direction: row;
//     position:absolute;
//     align-items: center;
//     width: fit-content;
//     background-color:transparent;
//     left:10px;
//     top:10px;
//     gap:8px;
//     ">
//     </div>
// `,
// }
let currentNode;
const pointer = { x: 0, y: 0 };
const FORBIDDEN_PARENT_IDS = [`cancelsnackbar-${idName}`];
function hasForbiddenParents(a, forbiddenParentIds) {
    let node = a;
    let forbiddenParentIdsMap = Object.fromEntries(forbiddenParentIds.map((x) => [x, true]));
    while (node) {
        if (node.id in forbiddenParentIdsMap) {
            return true;
        }
        node = node.parentElement;
    }
    return false;
}
function selectAndDrawElement(element) {
    currentNode = element;
    (0, visualizer_1.drawSelectedElement)(currentNode);
}
function findAndDrawElement(x, y, forbiddenParentIds) {
    currentNode = (0, utils_1.deepElementFromPoint)(x, y);
    if (hasForbiddenParents(currentNode, forbiddenParentIds)) {
        selectAndDrawElement(null);
        return;
    }
    selectAndDrawElement(currentNode);
}
// function debounce(func: (...args: any[]) => any, wait, immediate=false, context?) {
//     var result
//     var timeout = null
//     return function (...args) {
//         var later = function () {
//             timeout = null
//             if (!immediate) result = func(...args)
//         }
//         var callNow = immediate && !timeout
//         // Tant que la fonction est appelée, on reset le timeout.
//         clearTimeout(timeout)
//         timeout = setTimeout(later, wait)
//         if (callNow) result = func(...args)
//         return result
//     }
// }
// const findAndDrawElementDebounced = debounce(findAndDrawElement, 100)
let stack = [];
function drawParent() {
    if (currentNode) {
        stack.push(currentNode);
        selectAndDrawElement(findFirstParentWithDifferentDimension(currentNode));
    }
}
function findFirstParentWithDifferentDimension(node) {
    let parent = node.parentElement;
    const bound = node.getBoundingClientRect();
    while (parent) {
        const parentBound = parent.getBoundingClientRect();
        if (parentBound.width != bound.width ||
            parentBound.height != bound.height ||
            parentBound.x != bound.x ||
            parentBound.y != bound.y) {
            return parent;
        }
        parent = parent.parentElement;
    }
    return null;
}
function drawNextInStack() {
    if (stack.length) {
        const x = stack.pop();
        selectAndDrawElement(x);
    }
    else {
        selectAndDrawElement(currentNode.firstElementChild);
    }
}
const onMouseOver = (event) => {
    window.requestAnimationFrame(() => {
        event.stopPropagation();
        findAndDrawElement(event.clientX, event.clientY, FORBIDDEN_PARENT_IDS);
    });
};
const onMouseMove = (event) => {
    window.requestAnimationFrame(() => {
        event.stopPropagation();
        pointer.x = event.clientX;
        pointer.y = event.clientY;
    });
};
function onMouseClick(event) {
    if (hasForbiddenParents(event.target, FORBIDDEN_PARENT_IDS)) {
        return;
    }
    event.stopPropagation();
    event.preventDefault();
    manager.startConfirmSelection({ x: event.clientX, y: event.clientY });
    return true;
}
const confirmState = {
    _confirmCallback: null,
    onMouseClick(event) {
        var _a;
        // check if its outside the confirm selection box
        // if yes, cancel
        if (((_a = event.target.closest(`#confirm-selection-${idName}`)) === null || _a === void 0 ? void 0 : _a.id) != `confirm-selection-${idName}`) {
            confirmState.cancel();
        }
    },
    onKeyDown(event) {
        if (event.key === 'Enter' || event.key === 'Return') {
            event.preventDefault();
            event.stopPropagation();
            if (confirmState._confirmCallback) {
                confirmState._confirmCallback();
            }
        }
    },
    clipContent() {
        confirmState._cancelConfirmSelectionDialog();
        manager.clipContent();
    },
    _startListenEvents() {
        document.addEventListener('click', confirmState.onMouseClick);
        document.addEventListener('keydown', confirmState.onKeyDown, true);
    },
    _stopListenEvents() {
        document.removeEventListener('click', confirmState.onMouseClick);
        document.removeEventListener('keydown', confirmState.onKeyDown, true);
    },
    _resetStack() {
        stack = [];
    },
    _disableButton(name) {
        document
            .getElementById(`confirm-selection-${idName}`)
            .querySelector(`#stn-${name}-button`)
            .setAttribute('disabled', 'true');
    },
    _enableButton(name) {
        document
            .getElementById(`confirm-selection-${idName}`)
            .querySelector(`#stn-${name}-button`)
            .removeAttribute('disabled');
    },
    _updatePlusMinusButton() {
        console.log('update', currentNode.firstElementChild);
        if (!currentNode.firstElementChild) {
            console.log("can't go plus");
            confirmState._disableButton('plus');
        }
        else {
            confirmState._enableButton('plus');
        }
        if (currentNode == document.body) {
            confirmState._disableButton('minus');
        }
        else {
            confirmState._enableButton('minus');
        }
    },
    _onClickMinusButton(cb) {
        drawParent();
        confirmState._updatePlusMinusButton();
        cb === null || cb === void 0 ? void 0 : cb();
    },
    _onClickPlusButton(cb) {
        drawNextInStack();
        confirmState._updatePlusMinusButton();
        cb === null || cb === void 0 ? void 0 : cb();
    },
    _onClickConfirmButton() {
        // extract current content
    },
    _addConfirmSelectionDialog(p) {
        var _a;
        const confirmSelectionDialogEl = comp2El(confirmSelectionDialog_1.confirmSelectionDialog, {
            idName,
        });
        confirmSelectionDialogEl.style.top = `${p.y - 55}px`;
        confirmSelectionDialogEl.style.left = `${p.x - Math.floor(186 / 2)}px`;
        const minusButtonEl = confirmSelectionDialogEl.querySelector('#stn-minus-button');
        minusButtonEl.addEventListener('click', () => confirmState._onClickMinusButton(p.refreshCallbackOnPlusMinus));
        const plusButtonEl = confirmSelectionDialogEl.querySelector('#stn-plus-button');
        plusButtonEl.addEventListener('click', () => confirmState._onClickPlusButton(p.refreshCallbackOnPlusMinus));
        if ((_a = p.actions) === null || _a === void 0 ? void 0 : _a.length) {
            const confirmButtonEl = confirmSelectionDialogEl.querySelector('#stn-confirm-button');
            const textEl = confirmButtonEl.querySelector('#stn-confirmselection');
            textEl.innerHTML = p.actions[0].name;
            confirmButtonEl.addEventListener('click', p.actions[0].callback);
            // Store the callback for Enter key
            confirmState._confirmCallback = p.actions[0].callback;
            // now duplicate the confirmButtonEl and append it below
            const confirmButtonEl2 = confirmButtonEl.cloneNode(true);
            // append it next to confirmButtonEl
            confirmButtonEl.parentNode.insertBefore(confirmButtonEl2, confirmButtonEl.nextSibling);
            const textEl2 = confirmButtonEl2.querySelector('#stn-confirmselection');
            textEl2.innerHTML = p.actions[1].name;
            confirmButtonEl2.addEventListener('click', p.actions[1].callback);
        }
        else {
            const confirmButtonEl = confirmSelectionDialogEl.querySelector('#stn-confirm-button');
            confirmButtonEl.addEventListener('click', confirmState._onClickConfirmButton);
            confirmButtonEl.addEventListener('click', confirmState.clipContent);
            // Store the callback for Enter key
            confirmState._confirmCallback = confirmState.clipContent;
        }
        document.body.appendChild(confirmSelectionDialogEl);
        confirmState._updatePlusMinusButton();
        return confirmSelectionDialogEl;
    },
    _removeConfirmSelectionDialog() {
        const confirmSelectionDialog = document.querySelector(`#confirm-selection-${idName}`);
        confirmSelectionDialog === null || confirmSelectionDialog === void 0 ? void 0 : confirmSelectionDialog.remove();
    },
    setup(p) {
        console.log('open confirm selection dialog');
        confirmState._resetStack();
        confirmState._startListenEvents();
        return confirmState._addConfirmSelectionDialog(p);
    },
    _cancelConfirmSelectionDialog() {
        confirmState._stopListenEvents();
        confirmState._removeConfirmSelectionDialog();
        confirmState._resetStack();
        confirmState._confirmCallback = null;
    },
    cancel() {
        confirmState._cancelConfirmSelectionDialog();
        manager.stopClipZone(false);
        manager.startSelectZone();
        (0, listFeature_1.cleanupPoppers)();
    },
};
const selectZoneState = {
    setup() { },
};
function hidePopupIframe() {
    let d = document.querySelector(`#dialog-${idName}`);
    if (d) {
        d.style.removeProperty('display');
        d.style.display = 'none';
    }
}
function showPopupIframe() {
    let d = document.querySelector(`#dialog-${idName}`);
    if (d) {
        d.style.removeProperty('display');
        d.style.display = 'block';
        chrome.runtime.sendMessage({
            popup: {
                name: 'showPopupIframe',
                args: {},
            },
        });
    }
}
function onUserPressEscape(event) {
    if (event.key == 'Escape') {
        event.stopPropagation();
        event.preventDefault();
        manager.stopClipZone();
    }
}
let done = null;
function returnResponseToBackground(data) {
    const message = Object.assign({ asyncId, type: 'asyncExec' }, data);
    return new Promise((resolve) => {
        chrome.runtime.sendMessage(message, function (response) {
            console.log('[clipContent] returnResponseToBackground response:', response);
            done === null || done === void 0 ? void 0 : done(response);
            done = null;
            resolve(response);
        });
        // done = resolve
    });
}
const manager = {
    status: 'stopped',
    confirmState,
    selectZoneState,
    startSelectZone() {
        (0, canvas_1.init)();
        manager._startListenSelectZoneEvents();
        manager._hideDialogAndShowCancelButton();
        manager.status = 'select-zone';
    },
    success(payload) {
        // just send response back
        returnResponseToBackground({ success: true, payload });
    },
    cancel() {
        returnResponseToBackground({ success: false });
    },
    _showCancelButton(msg) {
        const cancelSnackBarEl = comp2El(cancelSnackBar_1.cancelSnackBar, {
            idName,
            msg: (msg !== null && msg !== void 0 ? msg : action == 'pickData')
                ? 'Click on the data you would like to extract'
                :
                    action == 'pickList' ?
                        'Select a item of the list'
                        :
                            'Click on the area you would like to clip',
        });
        cancelSnackBarEl
            .querySelector(`#btn-actionCancel`)
            .addEventListener('click', () => manager.stopClipZone(true));
        setTimeout(() => document.querySelector(`#cancelsnackbar-${idName}`).focus(), 50);
        document.body.appendChild(cancelSnackBarEl);
    },
    _hideDialogAndShowCancelButton() {
        hidePopupIframe();
        this._showCancelButton();
        document.addEventListener('keydown', onUserPressEscape);
    },
    _removeCancelButton() {
        let el = document.querySelector(`#cancelsnackbar-${idName}`);
        el === null || el === void 0 ? void 0 : el.parentNode.removeChild(el);
        document.removeEventListener('keydown', onUserPressEscape);
    },
    _showCancelButtonWithContinueButton() {
        this._showCancelButton("Select at least 1 item");
    },
    // this wall is to prevent hover effect
    _addWall() {
        // const el = htmlString2El(`<div style="position:fixed !important; height:100vh !important; width:100vw !important; background:rgba(0,0,0,0.0) !important; top:0 !important; left:0 !important; z-index:199999999997 !important;" id="stn-clip-content-wall"></div>`)
        // document.body.appendChild(el)
    },
    _removeWall() {
        // const el = document.querySelector('#stn-clip-content-wall')
        // el?.parentNode.removeChild(el)
    },
    _startListenSelectZoneEvents() {
        this._addWall();
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseover', onMouseOver);
        document.addEventListener('click', onMouseClick, true);
    },
    _stopListenSelectZoneEvents() {
        this._removeWall();
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseover', onMouseOver);
        document.removeEventListener('click', onMouseClick, true);
    },
    startConfirmSelection({ x, y }) {
        manager._stopListenSelectZoneEvents();
        if (action == 'pickList') {
            const similarItems = (0, getMatchingElements_1.getMatchingElements)(currentNode);
            (0, listFeature_1.displayListAugmentation)(similarItems.slice(0, 30));
            const confirmSelectionDialogEl = manager.confirmState.setup({
                x, y,
                actions: [
                    {
                        name: `Select All (${similarItems.length})`,
                        callback: () => {
                            // move the code from clipper
                            confirmState._cancelConfirmSelectionDialog();
                            manager.stopClipZone(true, (0, listFeature_1.continueWithListAugmentation)(similarItems));
                            // select all items and open the extension
                        },
                    },
                    {
                        name: `Select Manually`,
                        callback: () => {
                            confirmState._cancelConfirmSelectionDialog();
                            this._stopClipArea();
                            (0, listFeature_1.startListFeature)(similarItems, (items) => {
                                manager.stopClipZone(true, (0, listFeature_1.continueWithListAugmentation)(items));
                            });
                            manager.stopClipZone(false);
                            manager._showCancelButtonWithContinueButton();
                        },
                    }
                ],
                refreshCallbackOnPlusMinus: () => {
                    const similarItems = (0, getMatchingElements_1.getMatchingElements)(currentNode);
                    console.log('refresh page', similarItems.length);
                    (0, listFeature_1.displayListAugmentation)(similarItems.slice(0, 30));
                    const confirmButtonEl = confirmSelectionDialogEl.querySelector('#stn-confirm-button');
                    const textEl = confirmButtonEl.querySelector('#stn-confirmselection');
                    textEl.innerHTML = `Select All (${similarItems.length})`;
                },
            });
        }
        else {
            manager.confirmState.setup({ x, y, });
        }
        manager.status = 'confirm-selection';
    },
    _stopClipArea() {
        manager._stopListenSelectZoneEvents();
        (0, canvas_1.destroy)();
        manager.status = 'stopped';
    },
    stopClipZone(showIframe = true, payload = null) {
        this._stopClipArea();
        manager._removeCancelButton();
        if (showIframe) {
            showPopupIframe();
            if (payload) {
                manager.success(payload);
            }
            else {
                manager.cancel();
            }
        }
    },
    clipContent() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!currentNode) {
                console.error('[clipContent] currentNode is null/undefined');
                manager.stopClipZone(true, null);
                return;
            }
            if (action == 'pickData') {
                const css = (0, getNodeCss_1.getNodeCss)(currentNode);
                const payload = {
                    css,
                    domain: window.location.hostname || 'unknown',
                    faviconImageBase64: null,
                };
                // Legacy: send via chrome.runtime.sendMessage for old code paths
                chrome.runtime.sendMessage({
                    popup: {
                        name: 'pickDataAdded',
                        args: payload,
                    },
                });
                // New: return payload via bgAsk response
                manager.stopClipZone(true, payload);
            }
            else {
                const html = currentNode === null || currentNode === void 0 ? void 0 : currentNode.outerHTML;
                const payload = {
                    html,
                    previewString: ((_a = currentNode === null || currentNode === void 0 ? void 0 : currentNode.innerText) === null || _a === void 0 ? void 0 : _a.substring(0, 1024)) || '',
                    pageUrl: window.location.href,
                };
                console.log('[clipContent] startClipContent payload:', payload);
                // Legacy: send via chrome.runtime.sendMessage for old code paths
                chrome.runtime.sendMessage({
                    popup: {
                        name: 'clipContentAdded',
                        args: payload,
                    },
                });
                // New: return payload via bgAsk response
                manager.stopClipZone(true, payload);
            }
        });
    },
};
// function injectStartStop() {
//     const x = comp2El(topleftBoxContainer, {})
//     const startButtonEl = comp2El(startButton, {})
//     const stopButtonEl = comp2El(stopButton, {})
//     startButtonEl.addEventListener('click', () => {
//         manager.startSelectZone()
//     })
//     stopButtonEl.addEventListener('click', () => {
//         manager.stopClipZone()
//     })
//     x.appendChild(startButtonEl)
//     x.appendChild(stopButtonEl)
//     document.body.appendChild(x)
// }
// in small dimension: 10x10, fetch as chrome extension
// async function getCurrentPageFaviconAsBase64(): Promise<{
//     success: boolean
//     imageBase64?: string
// }> {
// return new Promise((resolve, reject) => {
//     chrome.runtime.sendMessage({ action: 'getFavicon' }, function (
//         response
//     ) {
//         console.log(response)
//         resolve({ success: true, imageBase64: response })
//     })
//     chrome.tabs.query({ active: true, currentWindow: true }, function (
//         tabs
//     ) {
//     })
// if (faviconEl) {
//     const faviconUrl = faviconEl.getAttribute('href')
//     if (faviconUrl) {
//         try {
//             const favicon = new Image()
//             favicon.crossOrigin = 'anonymous'
//             favicon.src = faviconUrl
//             favicon.onload = () => {
//                 const canvas = document.createElement('canvas')
//                 canvas.width = favicon.width
//                 canvas.height = favicon.height
//                 const ctx = canvas.getContext('2d')
//                 // reduce size to 10x10
//                 ctx.drawImage(favicon, 0, 0, 10, 10)
//                 const dataURL = canvas.toDataURL('image/png')
//                 resolve({ success: true, imageBase64: dataURL })
//             }
//             favicon.onerror = () => {
//                 resolve({ success: false })
//             }
//         } catch (e) {
//             console.error(e)
//             resolve({ success: false })
//         }
//     }
// } else {
//     console.log("can't find favicon")
//     resolve({ success: false })
// }
// })
// }
function clipContent(action, props) {
    switch (action) {
        case 'startClipContent':
            return manager.startSelectZone();
        case 'pickList':
            return manager.startSelectZone();
        case 'pickData':
            return manager.startSelectZone();
    }
}
clipContent(action, props);


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelSnackBar = void 0;
exports.cancelSnackBar = {
    css: (p) => `
  .outlined-button-small-${p.idName} {
      all:unset;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      height: 32px !important;
      padding: 0 16px !important;
      border-style: solid !important;
      border-width: 1px !important;
      border-color: rgba(255, 255, 255, 0.2) !important;
      border-radius: 8px !important;
      background-color: rgba(255, 255, 255, 0.1) !important;
      color: #FFFFFF !important;
      text-decoration: none !important;
      cursor: pointer !important;
      margin: 0 !important;
      width: auto !important;
      overflow: visible !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
      font-size: 14px !important;
      font-weight: 500 !important;
      line-height: normal !important;
      transition: all 0.2s ease-out !important;
      -webkit-font-smoothing: antialiased !important;
      -moz-osx-font-smoothing: grayscale !important;
      -webkit-appearance: none !important;
    }
    
    .outlined-button-small-${p.idName}:hover {
      background-color: rgba(255, 255, 255, 0.15) !important;
      border-color: rgba(255, 255, 255, 0.3) !important;
    }
    
    .outlined-button-small-${p.idName}:active {
      background-color: rgba(255, 255, 255, 0.2) !important;
      border-color: rgba(255, 255, 255, 0.4) !important;
    }
    
    .outlined-button-small-${p.idName}:focus {
      background-color: rgba(255, 255, 255, 0.15) !important;
      outline: none !important;
    }

    .outlined-button-small-${p.idName} .v-text {
      color: #FFFFFF !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
      font-size: 14px !important;
      font-weight: 500 !important;
      line-height: normal !important;
    }

    #cancelsnackbar-${p.idName} .cancelsnackbar-label,
    #cancelsnackbar-${p.idName} .cancelsnackbar-label * {
      color: #FFFFFF !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
      font-size: 14px !important;
      font-weight: 400 !important;
      line-height: 1.5 !important;
      -webkit-font-smoothing: antialiased !important;
      -moz-osx-font-smoothing: grayscale !important;
      
    }

  `,
    html: (p) => `
  <div id="${`cancelsnackbar-${p.idName}`}" class="sym-injectable-select-image" style="
  all:unset;
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
  padding: 20px 10px;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  user-select: none !important;
  -webkit-user-select: none !important;
  ">
        <div class="oklm flex" style="
        all:unset;
        padding: 14px 20px;
        border-radius: 12px;
        background-color: rgba(30, 30, 30, 0.95);
        color: #FFFFFF !important;
        font-size: 14px !important;
        font-weight: 400 !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
        text-align: center;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        gap: 16px;
        -webkit-box-align: center;
        -webkit-align-items: center;
        -ms-flex-align: center;
        align-items: center;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1);
        ">
        <div class="mr5 cancelsnackbar-label" style="
    margin: 0;
    line-height: 1.5;
    opacity: 0.95;
    color: #FFFFFF !important;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
    font-size: 14px !important;
    font-weight: 400 !important;
            ">${p.msg || 'Click on an image on the page'}, <span style="opacity: 0.7; color: #FFFFFF !important; font-family: inherit !important; font-size: inherit !important; font-weight: inherit !important;">press "Escape" to cancel</span></div>
            <button class="mr5 cancelsnackbar-button" style="
    margin: 0;
    display:none;
            ">Continue</button>
          <div class="g-cancel-button"><button id="btn-actionCancel" class="outlined-button-small-${p.idName}"
          >
              <div class="v-text" style="color: #FFFFFF !important; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important; font-size: 14px !important; font-weight: 500 !important;">Cancel</div>
            </button></div>
        </div>
  </div>

  `,
};


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawSelectedElement = void 0;
/* eslint-disable operator-assignment */
/**
 * Based on https://gist.github.com/awestbro/e668c12662ad354f02a413205b65fce7
 */
const canvas_1 = __webpack_require__(7);
const colors = {
    // margin: '#f6b26ba8',
    // border: '#ffe599a8',
    // padding: '#93c47d8c',
    margin: 'rgba(59, 130, 246, 0.12)',
    border: 'rgba(59, 130, 246, 0.12)',
    padding: 'rgba(59, 130, 246, 0.12)',
    content: 'rgba(59, 130, 246, 0.12)',
};
const SMALL_NODE_SIZE = 30;
function pxToNumber(px) {
    return parseInt(px.replace('px', ''), 10);
}
function round(value) {
    return Number.isInteger(value) ? value : value.toFixed(2);
}
// function filterZeroValues(labels: LabelStack): LabelStack {
//     return labels.filter((l) => l.text !== 0 && l.text !== '0')
// }
// function floatingAlignment(extremities: Extremities): FloatingAlignment {
//     const windowExtremities = {
//         top: global.window.scrollY,
//         bottom: global.window.scrollY + global.window.innerHeight,
//         left: global.window.scrollX,
//         right: global.window.scrollX + global.window.innerWidth,
//     }
//     const distances = {
//         top: Math.abs(windowExtremities.top - extremities.top),
//         bottom: Math.abs(windowExtremities.bottom - extremities.bottom),
//         left: Math.abs(windowExtremities.left - extremities.left),
//         right: Math.abs(windowExtremities.right - extremities.right),
//     }
//     return {
//         x: distances.left > distances.right ? 'left' : 'right',
//         y: distances.top > distances.bottom ? 'top' : 'bottom',
//     }
// }
function measureElement(element) {
    const style = global.getComputedStyle(element);
    // eslint-disable-next-line prefer-const
    let { top, left, right, bottom, width, height, } = element.getBoundingClientRect();
    const { marginTop, marginBottom, marginLeft, marginRight, paddingTop, paddingBottom, paddingLeft, paddingRight, borderBottomWidth, borderTopWidth, borderLeftWidth, borderRightWidth, } = style;
    // top = top + global.window.scrollY
    // left = left + global.window.scrollX
    // bottom = bottom + global.window.scrollY
    // right = right + global.window.scrollX
    const margin = {
        top: pxToNumber(marginTop),
        bottom: pxToNumber(marginBottom),
        left: pxToNumber(marginLeft),
        right: pxToNumber(marginRight),
    };
    const padding = {
        top: pxToNumber(paddingTop),
        bottom: pxToNumber(paddingBottom),
        left: pxToNumber(paddingLeft),
        right: pxToNumber(paddingRight),
    };
    const border = {
        top: pxToNumber(borderTopWidth),
        bottom: pxToNumber(borderBottomWidth),
        left: pxToNumber(borderLeftWidth),
        right: pxToNumber(borderRightWidth),
    };
    const extremities = {
        top: top - margin.top,
        bottom: bottom + margin.bottom,
        left: left - margin.left,
        right: right + margin.right,
    };
    return {
        margin,
        padding,
        border,
        top,
        left,
        bottom,
        right,
        width,
        height,
        extremities,
        // floatingAlignment: floatingAlignment(extremities),
    };
}
function drawMargin(context, { margin, width, height, top, left, bottom, right }) {
    // Draw Margin
    const marginHeight = height + margin.bottom + margin.top;
    context.fillStyle = colors.margin;
    // Top margin rect
    context.fillRect(left, top - margin.top, width, margin.top);
    // Right margin rect
    context.fillRect(right, top - margin.top, margin.right, marginHeight);
    // Bottom margin rect
    context.fillRect(left, bottom, width, margin.bottom);
    // Left margin rect
    context.fillRect(left - margin.left, top - margin.top, margin.left, marginHeight);
    // const marginLabels: LabelStack = [
    //     {
    //         type: 'margin',
    //         text: round(margin.top),
    //         position: 'top',
    //     },
    //     {
    //         type: 'margin',
    //         text: round(margin.right),
    //         position: 'right',
    //     },
    //     {
    //         type: 'margin',
    //         text: round(margin.bottom),
    //         position: 'bottom',
    //     },
    //     {
    //         type: 'margin',
    //         text: round(margin.left),
    //         position: 'left',
    //     },
    // ]
    // return filterZeroValues(marginLabels)
}
function drawPadding(context, { padding, border, width, height, top, left, bottom, right }) {
    const paddingWidth = width - border.left - border.right;
    const paddingHeight = height - padding.top - padding.bottom - border.top - border.bottom;
    context.fillStyle = colors.padding;
    // Top padding rect
    context.fillRect(left + border.left, top + border.top, paddingWidth, padding.top);
    // Right padding rect
    context.fillRect(right - padding.right - border.right, top + padding.top + border.top, padding.right, paddingHeight);
    // Bottom padding rect
    context.fillRect(left + border.left, bottom - padding.bottom - border.bottom, paddingWidth, padding.bottom);
    // Left padding rect
    context.fillRect(left + border.left, top + padding.top + border.top, padding.left, paddingHeight);
    // const paddingLabels: LabelStack = [
    //     {
    //         type: 'padding',
    //         text: padding.top,
    //         position: 'top',
    //     },
    //     {
    //         type: 'padding',
    //         text: padding.right,
    //         position: 'right',
    //     },
    //     {
    //         type: 'padding',
    //         text: padding.bottom,
    //         position: 'bottom',
    //     },
    //     {
    //         type: 'padding',
    //         text: padding.left,
    //         position: 'left',
    //     },
    // ]
    // return filterZeroValues(paddingLabels)
}
function drawBorder(context, { border, width, height, top, left, bottom, right }) {
    const borderHeight = height - border.top - border.bottom;
    context.fillStyle = colors.border;
    // Top border rect
    context.fillRect(left, top, width, border.top);
    // Bottom border rect
    context.fillRect(left, bottom - border.bottom, width, border.bottom);
    // Left border rect
    context.fillRect(left, top + border.top, border.left, borderHeight);
    // Right border rect
    context.fillRect(right - border.right, top + border.top, border.right, borderHeight);
    // const borderLabels: LabelStack = [
    //     {
    //         type: 'border',
    //         text: border.top,
    //         position: 'top',
    //     },
    //     {
    //         type: 'border',
    //         text: border.right,
    //         position: 'right',
    //     },
    //     {
    //         type: 'border',
    //         text: border.bottom,
    //         position: 'bottom',
    //     },
    //     {
    //         type: 'border',
    //         text: border.left,
    //         position: 'left',
    //     },
    // ]
    // return filterZeroValues(borderLabels)
}
function drawContent(context, { padding, border, width, height, top, left }) {
    const contentWidth = width - border.left - border.right - padding.left - padding.right;
    const contentHeight = height - padding.top - padding.bottom - border.top - border.bottom;
    context.fillStyle = colors.content;
    // content rect
    context.fillRect(left + border.left + padding.left, top + border.top + padding.top, contentWidth, contentHeight);
    // Dimension label
    // return [
    //     {
    //         type: 'content',
    //         position: 'center',
    //         text: `${round(contentWidth)} x ${round(contentHeight)}`,
    //     },
    // ]
}
function drawBoxModel(element) {
    return (context) => {
        if (element && context) {
            const measurements = measureElement(element);
            // drawMargin(context, measurements)
            drawPadding(context, measurements);
            drawBorder(context, measurements);
            drawContent(context, measurements);
            // Draw modern blue border with rounded corners effect
            const { top, left, width, height } = measurements;
            context.strokeStyle = 'rgba(59, 130, 246, 0.9)';
            context.lineWidth = 2;
            context.strokeRect(left, top, width, height);
            // const externalLabels =
            //     measurements.width <= SMALL_NODE_SIZE * 3 ||
            //     measurements.height <= SMALL_NODE_SIZE
            // labelStacks(
            //     context,
            //     measurements,
            //     [
            //         ...contentLabels,
            //         ...paddingLabels,
            //         ...borderLabels,
            //         ...marginLabels,
            //     ],
            //     externalLabels
            // )
        }
    };
}
function drawSelectedElement(element) {
    console.log('drawSelectedElement', element);
    (0, canvas_1.draw)(drawBoxModel(element));
}
exports.drawSelectedElement = drawSelectedElement;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(5)))

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.deepElementFromPoint = void 0;
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
function deepElementFromPoint(x, y) {
    // turn off quickly
    // const clipContentWall:HTMLElement = document.querySelector('#stn-clip-content-wall');
    // clipContentWall.style.display = "none";
    const element = global.document.elementFromPoint(x, y);
    // clipContentWall.style.display = "block";
    const crawlShadows = (node) => {
        if (node && node.shadowRoot) {
            // elementFromPoint() doesn't exist in ShadowRoot type
            const nestedElement = node.shadowRoot.elementFromPoint(x, y);
            // Nested node is same as the root one
            if (node.isEqualNode(nestedElement)) {
                return node;
            }
            // The nested node has shadow DOM too so continue crawling
            if (nestedElement.shadowRoot) {
                return crawlShadows(nestedElement);
            }
            // No more shadow DOM
            return nestedElement;
        }
        return node;
    };
    const shadowElement = crawlShadows(element);
    return shadowElement || element;
}
exports.deepElementFromPoint = deepElementFromPoint;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(5)))

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmSelectionDialog = void 0;
exports.confirmSelectionDialog = {
    css: ({ idName }) => `

.stn-touchable-secondary:hover #stn-content,
.stn-touchable-secondary:hover #stn-content2 {
  background-color: #F5F5F4 !important;
  border-color: #A8A29E !important;
}

.stn-touchable-secondary:active #stn-content,
.stn-touchable-secondary:active #stn-content2 {
  background-color: #E7E5E4 !important;
}

.stn-touchable-secondary:disabled > div {
  opacity:0.5 !important;
  background-color: #fff !important;
}

.stn-touchable-primary:hover #stn-content3 {
  background-color: #1C7ED6 !important;
}

.stn-touchable-primary:active #stn-content3 {
  background-color: #1971C2 !important;
}

.stn-touchable-primary:disabled #stn-content3 {
  opacity: 0.5 !important;
}

#stn-leftpanel
{
  all:unset;
height:32px !important;
width:66px !important;
align-self:center !important;
padding:0px !important;
display:flex;
flex-direction:row;
justify-content:flex-start;
align-items:center;
gap:2px !important;
}

#stn-minus-button
{
  all:unset;
height:32px !important;
width:32px !important;
padding:0px !important;
display:flex;
flex-direction:row;
justify-content:center;
align-items:center;
position:relative;
cursor: pointer;
}
#stn-content
{
  all:unset;
height:32px !important;
width:32px !important;
border-radius:8px;
display:flex;
flex-direction:row;
flex-wrap:nowrap;
justify-content:center;
align-items:center;
position:relative;
border: 1px solid #D6D3D1;
background-color: #FFFFFF;
transition: all 0.2s ease-out;
}
#stn-minusicon
{
  all:unset;
height:14px !important;
width:14px !important;
align-self:center;
padding:0px;
}
#stn-plus-button
{
  all:unset;
height:32px !important;
width:32px !important;
align-self:center;
padding:0px !important;
display:flex;
flex-direction:row;
justify-content:center;
align-items:center;
cursor: pointer;
}
#stn-content2
{
  all:unset;
height:32px !important;
width:32px !important;
border-radius:8px;
padding:0px !important;
display:flex;
flex-direction:row;
flex-wrap:nowrap;
justify-content:center;
align-items:center;
position:relative;
border: 1px solid #D6D3D1;
background-color: #FFFFFF;
transition: all 0.2s ease-out;
}
#stn-plusicon
{
height:14px;
width:14px;
align-self:center;
padding:0px;
}
#stn-confirm-button
{
  all:unset;
height:32px !important;
width:fit-content !important;
align-self:center !important;
padding:0px !important;
display:flex !important;
flex-direction:row !important;
justify-content:center !important;
align-items:center !important;
cursor: pointer;
}
#stn-content3
{
  all:unset;
height:32px;
width:fit-content;
min-width:107px;
border-radius:8px;
padding-left:16px;
padding-right:16px;
display:flex;
flex-direction:row;
flex-wrap:nowrap;
justify-content:center;
align-items:center;
position:relative;
background-color: #228BE6;
border-radius: 8px;
transition: all 0.2s ease-out;
}
#stn-confirmselection
{
  all:unset;
color: #FFFFFF;
text-align:center;
vertical-align:text-middle;
font-size:13px;
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
font-weight: 500;
align-self:center;
line-height:150%;
}
    `,
    html: ({ idName }) => `
    <div id="confirm-selection-${idName}" style="
    all:unset;
    cursor: pointer; 
    position:fixed;
    align-items: center;
    left:10px;
    top:-35px;
    gap:6px;
    z-index: 2147483645;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 8px;
    gap: 8px;
    border-radius: 12px;
    isolation: isolate;
    height: fit-content;
    border-radius: 12px;
    background: #FFFFFF;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0, 0, 0, 0.05);
    flex: none;
    order: 0;
    flex-grow: 0;
    width: fit-content !important;
    ">

    <div  id='stn-leftpanel'>
			<button class='stn-touchable-secondary' id='stn-minus-button' x-title='Select parent element'>
			<div  id='stn-content'>
        <svg width="11" height="2" viewBox="0 0 11 2" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.75 0.125H0.25V1.875H10.75V0.125Z" fill="#78716C"/>
        </svg>
			</div></button><button class='stn-touchable-secondary' id='stn-plus-button' x-title='Select child element'>
			<div  id='stn-content2'>
        <svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.47987 13.0926C6.836 13.0926 7.1335 12.8091 7.1335 12.46V7.62999H11.8252C12.1744 7.62999 12.4727 7.33249 12.4727 6.97637C12.4709 6.80537 12.4021 6.64192 12.281 6.52116C12.1599 6.4004 11.9963 6.33198 11.8252 6.33062H7.1335V1.49274C7.1335 1.14449 6.836 0.860992 6.47987 0.860992C6.31045 0.859356 6.14728 0.924917 6.02609 1.04332C5.9049 1.16173 5.83556 1.32333 5.83325 1.49274V6.33062H1.1345C0.963496 6.33198 0.799858 6.4004 0.678773 6.52116C0.557688 6.64192 0.488828 6.80537 0.487 6.97637C0.487 7.33249 0.785375 7.62999 1.1345 7.62999H5.83325V12.46C5.83325 12.8091 6.12375 13.0926 6.47987 13.0926Z" fill="#78716C"/>
        </svg>
			</div></button>
		</div>
    <button class='stn-touchable-primary' id='stn-confirm-button'>
		<div id='stn-content3'>
			<div  id='stn-confirmselection'>
				Confirm Selection
			</div>
		</div>
    </button>
    <div style="
    all:unset;
    position: absolute;
width: 6.93px;
height: 5.25px;
left: 90.5px;
bottom: -5px;

/* Inside auto layout */
flex: none;
order: 2;
flex-grow: 0;
z-index: 2;
    ">
    <svg style="all:unset; position:absolute; top:0px; left:0px;" width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5 8L8.36626e-08 -1.49012e-07H10L5 8Z" fill="white"/>
</svg>

    </div>
    </div>
    `,
};


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getMatchingElements = void 0;
function getMatchingElements(currentNode) {
    let tmp = currentNode;
    const t = {
        elementMatches: [],
        selectorChosenFinal: null,
        selectorsScopeListContainer: null,
    };
    // Traverse up the DOM tree until a parent with a class is found
    while ((tmp = tmp.parentElement) && !tmp.classList.length)
        ;
    // Determine the selector based on whether a suitable parent was found
    const selector = tmp ? generateSelector(tmp) : currentNode.parentNode.tagName.toLowerCase();
    // Generate selector for the current node
    const currentSelector = generateSelector(currentNode);
    // Query the DOM using the combined selector of the parent and current node
    t.elementMatches = Array.from(document.querySelectorAll(`${selector} ${currentSelector}`));
    return t.elementMatches;
}
exports.getMatchingElements = getMatchingElements;
function generateSelector(node) {
    let selectorParts = [node.tagName.toLowerCase()];
    try {
        for (const attribute of node.attributes) {
            if (attribute.name.startsWith("data-")) {
                const attrSelector = `[${escapeSelector(attribute.name)}="${escapeSelector(attribute.value)}"]`;
                selectorParts.push(attrSelector);
            }
        }
    }
    catch (error) {
        console.error("Error processing attributes:", error);
        throw error; // Re-throw the error after logging
    }
    const validClasses = Array.from(node.classList).filter(isValidClassName);
    if (validClasses.length > 0) {
        const classSelector = `.${validClasses.map(escapeSelector).join('.')}`;
        selectorParts.push(classSelector);
    }
    return selectorParts.join("");
}
const escapeSelector = e => {
    return e.replace(/([:[])/g, "\\$1").replace(/\.(?=\d)/g, "\\.").replace(/\//g, "\\/");
};
const isValidClassName = e => {
    const invalidChars = ["[", "]", "(", ")", ".", "}"];
    return !invalidChars.some(char => e.includes(char)) && !/\d/.test(e[0]);
};


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.displayListAugmentation = exports.startListFeature = exports.continueWithListAugmentation = exports.cancelListsAugmentation = exports.cleanupPoppers = exports.detectAndAugmentLists = exports.updateStatusBar = void 0;
const clipperUtil_1 = __webpack_require__(4);
const convertSvgElementToImageSource_1 = __webpack_require__(2);
// @ts-ignore
if (!window.Popper) {
    window.Popper = {};
    // (window as any).Popper = Popper
}
// @ts-ignore
if (!window.Items) {
    window.Items = {
        selectedItems: [],
        lists: [],
        initialized: false,
    };
}
let Items = window.Items;
function addItemToList(itemEl, popover, listObj) {
    // add item to list of selected items
    Items.selectedItems.push(itemEl);
    // update popover
    popover.classList.add("selected");
    popover.querySelector(".stn-list-item-popover-content").innerHTML = "Remove from list";
    if (Items.selectedItems.length == 1) {
        // remove all lists poppers
        cleanupPoppersListExceptOne(listObj);
    }
    updateStatusBar(Items.selectedItems.length);
}
function updateStatusBar(itemsCount) {
    let el = document.querySelector(`#cancelsnackbar-${idName}`);
    const buttonEl = el.querySelector(".cancelsnackbar-button");
    const labelEl = el.querySelector(".cancelsnackbar-label");
    if (itemsCount == 0) {
        // hide cancelsnackbar-button, show cancelsnackbar-label
        buttonEl.style.display = "none";
        labelEl.style.display = "block";
    }
    else {
        // show cancelsnackbar-button, hide cancelsnackbar-label
        buttonEl.style.display = "block";
        buttonEl.style.textDecoration = "underline";
        labelEl.style.display = "none";
        // add on click
        buttonEl.onclick = function () {
            callbackOnDone === null || callbackOnDone === void 0 ? void 0 : callbackOnDone(Items.selectedItems);
        };
        buttonEl.innerHTML = `Continue with ${itemsCount} item${itemsCount > 1 ? "s" : ""}`;
    }
}
exports.updateStatusBar = updateStatusBar;
function removeItemFromList(itemEl, popover) {
    // remove item from list of selected items
    Items.selectedItems = Items.selectedItems.filter((el) => el != itemEl);
    // update popover
    popover.classList.remove("selected");
    popover.querySelector(".stn-list-item-popover-content").innerHTML = "Add to List";
    updateStatusBar(Items.selectedItems.length);
    if (Items.selectedItems.length == 0) {
        // re-augment all lists
        detectAndAugmentLists();
    }
}
function augmentList(listEl) {
    // const tooltip = htmlString2El(`<div id="tooltip" style="background-color: #333;color: white;padding: 5px 10px;border-radius: 4px;font-size: 13px;" role="tooltip">I'm a tooltip</div>`);
    // document.body.appendChild(tooltip);
    // Popper.createPopper(listEl, tooltip, {
    //     placement: 'top',
    // });
}
function augmentItem(itemEl, listObj) {
    // get size of item
    const rect = itemEl.getBoundingClientRect();
    // create a new div with a centered text "Add to list" using flexbox
    const popover = (0, clipperUtil_1.htmlString2El)(`<div class="stn-list-item-popover" style="
    width:${rect.width}px;
    height:${rect.height}px;
    "
    ><div class="stn-list-item-popover-content">Add to List</div></div>`);
    document.body.appendChild(popover);
    listObj.popovers.push(popover);
    // add event on click
    popover.addEventListener('click', function (e) {
        if (popover.classList.contains("selected")) {
            removeItemFromList(itemEl, popover);
        }
        else {
            addItemToList(itemEl, popover, listObj);
        }
    });
    listObj.poppers.push(window.Popper.createPopper(itemEl, popover, {
        // start top
        placement: 'top-start',
        // add offset so it fit itemEl
        modifiers: [
            {
                name: 'offset',
                options: {
                    offset: [0, -rect.height],
                },
            },
        ],
    }));
}
function getListElementsOnPage() {
    return [...document.querySelectorAll(`ul, ol, .grid`)];
}
function getItemsFromList(el) {
    if (["ul", "ol"].includes(el.tagName.toLowerCase())) {
        return [...el.querySelectorAll("li")];
    }
    // just all direct children
    return [...el.children];
}
function scanLists() {
    getListElementsOnPage().forEach((ul) => {
        console.log('list', ul);
        if (Items.lists.find((listObj) => listObj.ul == ul)) {
            return;
        }
        const listObj = {
            ul,
            poppers: [],
            popovers: [],
        };
        Items.lists.push(listObj);
        augmentList(ul);
        // attach ui to item
        getItemsFromList(ul).forEach((itemEl) => augmentItem(itemEl, listObj));
    });
}
function init() {
    if (!Items.initialized) {
        console.log('initialize popper...', Items);
        Items.initialized = true;
        (0, clipperUtil_1.addCss2)(`
        .stn-list-item-popover {
            box-shadow: rgba(0, 0, 0, 0.25) 0px 0px 0px 5px;
            border-radius: 5px;
            font-size: 13px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            cursor: pointer;
        }
        .stn-list-item-popover-content {
            opacity: 0;
            border-radius: 5px;
            transition: opacity 0.2s ease-in-out;
            display: none;
            background: rgba(0, 0, 0, 0.3) !important;
            width: 100%;
            height: 100%;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-size: 13px;
            font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif;
            font-weight: 700;
            color: white;
        }
        .stn-list-item-popover:hover .stn-list-item-popover-content
        {
            opacity: 1 !important;
            display: flex !important;
        }

        .stn-list-item-popover.selected {
            box-shadow: rgba(0, 0, 255, 0.25) 0px 0px 0px 5px !important;
        }
        `);
    }
}
function detectAndAugmentLists() {
    Items.selectedItems = [];
    init();
    console.log('start scanning...');
    scanLists();
    // think of an algorithm to detect all list on the pages
    // for now super simple one that just detects ul / li
}
exports.detectAndAugmentLists = detectAndAugmentLists;
function cleanupPoppers(exceptOne) {
    var _a;
    let arr = [];
    // remove all poppers
    (_a = Items.lists) === null || _a === void 0 ? void 0 : _a.forEach((listObj) => {
        if (listObj != exceptOne) {
            listObj.poppers.forEach((p) => p.destroy());
            listObj.popovers.forEach((el) => {
                el.remove();
            });
        }
        else {
            arr.push(listObj);
        }
    });
    Items.lists = arr;
}
exports.cleanupPoppers = cleanupPoppers;
function cleanupPoppersListExceptOne(listObj) {
    cleanupPoppers(listObj);
}
function cancelListsAugmentation() {
    cleanupPoppers();
    // remove all selected items
    Items.selectedItems = [];
}
exports.cancelListsAugmentation = cancelListsAugmentation;
function continueWithListAugmentation(items) {
    const outItems = items !== null && items !== void 0 ? items : Items.selectedItems;
    cleanupPoppers();
    const payload = {
        itemsCount: outItems.length,
        data: getData(outItems[0]),
        items: outItems.map((el, index) => ({
            html: el.outerHTML,
            extracted: Object.fromEntries(getData(el).map(e => ([e.id, e.valueForFirst])))
        })),
    };
    return payload;
}
exports.continueWithListAugmentation = continueWithListAugmentation;
let callbackOnDone = null;
function startListFeature(matchingElements, cb) {
    displayListAugmentation(matchingElements);
    updateStatusBar(Items.selectedItems.length);
    callbackOnDone = cb !== null && cb !== void 0 ? cb : null;
}
exports.startListFeature = startListFeature;
function displayListAugmentation(matchingElements) {
    init();
    // display the list augmentation
    // remove all poppers
    cleanupPoppers();
    // remove all selected items
    Items.selectedItems = [];
    Items.lists = [{
            ul: null,
            poppers: [],
            popovers: [],
        }];
    const listObj = Items.lists[0];
    matchingElements.forEach((el) => {
        augmentItem(el, listObj);
    });
}
exports.displayListAugmentation = displayListAugmentation;
function getData(selectedItem) {
    // simple dummy algorithm that will do multiple things
    const data = [];
    console.log('get data', selectedItem);
    data.push(...extractTextBlocks(selectedItem));
    data.push(...extractImageBlocks(selectedItem));
    data.push(...extractUrlBlocks(selectedItem));
    return data;
}
function extractTextBlocks(element) {
    let textBlocks = [];
    function traverse(node) {
        var _a;
        // Check if the node is a text node and not just whitespace
        if (node.nodeType === Node.TEXT_NODE && ((_a = node.textContent) === null || _a === void 0 ? void 0 : _a.trim())) {
            textBlocks.push({
                id: `text-${textBlocks.length + 1}`,
                name: `Text #${textBlocks.length + 1}`,
                type: 'text',
                valueForFirst: node.textContent.trim(),
            });
        }
        // If the node is an element, traverse its children
        if (node.nodeType === Node.ELEMENT_NODE) {
            Array.from(node.childNodes).forEach(traverse);
        }
    }
    traverse(element);
    return textBlocks;
}
function extractImageBlocks(element) {
    let imageBlocks = [];
    function traverse(node) {
        // If the node is an element, traverse its children
        if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.nodeName.toLowerCase() == "img") {
                imageBlocks.push({
                    id: `image-${imageBlocks.length + 1}`,
                    name: `Image #${imageBlocks.length + 1}`,
                    type: 'image',
                    valueForFirst: node.src,
                });
            }
            // also suppport svg
            if (node.nodeName.toLowerCase() == "svg") {
                imageBlocks.push({
                    id: `svg-${imageBlocks.length + 1}`,
                    name: `Image #${imageBlocks.length + 1}`,
                    type: 'image',
                    valueForFirst: (0, convertSvgElementToImageSource_1.convertSvgElementToImageSource)(node),
                });
            }
            Array.from(node.childNodes).forEach(traverse);
        }
    }
    traverse(element);
    return imageBlocks;
}
function extractUrlBlocks(element) {
    let urlBlocks = [];
    function traverse(node) {
        // If the node is an element, traverse its children
        if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.nodeName.toLowerCase() == "a") {
                urlBlocks.push({
                    id: `url-${urlBlocks.length + 1}`,
                    name: `Url #${urlBlocks.length + 1}`,
                    type: 'url',
                    valueForFirst: node.href,
                });
            }
            Array.from(node.childNodes).forEach(traverse);
        }
    }
    traverse(element);
    return urlBlocks;
}


/***/ })
/******/ ]);