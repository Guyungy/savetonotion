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
/******/ 	return __webpack_require__inject_script_fix(__webpack_require__.s = 21);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
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

/***/ 21:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const finder_1 = __webpack_require__(0);
function rgbToHex(r, g, b) {
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
function realColor(elem) {
    const col = window.getComputedStyle(elem, null).getPropertyValue('color');
    if (col.startsWith('rgb')) {
        try {
            const [r, g, b] = col
                .match(/\((.*)\)/)[1]
                .split(',')
                .map((e) => parseInt(e));
            return rgbToHex(r, g, b);
        }
        catch (e) { }
    }
    return '#000';
}
const colorsMap = {
    light: {
        default: '#ffefcc',
        yellow: '#ffefcc',
        red: '#ffd5d8',
        pink: '#ffd5ea',
        blue: '#d5e2ff',
        purple: '#dcd5ff',
        teal: '#d0fbf5',
        green: '#e3f9e5',
        orange: '#ffe6d5',
        brown: '#ffe6d5',
        gray: '#f5f5f5', // gray-100
    },
    dark: {
        default: '#624c18',
        yellow: '#624c18',
        red: '#681219',
        pink: '#68123d',
        blue: '#122368',
        purple: '#351a75',
        teal: '#0b463e',
        green: '#0b4627',
        orange: '#71330a',
        brown: '#86661d',
        gray: '#171717', // gray-950
    },
};
function getColorHex(color) {
    if (!color)
        return 'default';
    return color.replace('_background', '');
}
function haveDarkText(elem) {
    let c = realColor(elem);
    c = c.substring(1); // strip #
    var rgb = parseInt(c, 16); // convert rrggbb to decimal
    var r = (rgb >> 16) & 0xff; // extract red
    var g = (rgb >> 8) & 0xff; // extract green
    var b = (rgb >> 0) & 0xff; // extract blue
    var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
    return luma < 160;
}
function bgAsk(ev, props, opts) {
    const x = new Promise((accept) => {
        const r = [
            ...((opts === null || opts === void 0 ? void 0 : opts.extensionId) ? [opts === null || opts === void 0 ? void 0 : opts.extensionId] : []),
            {
                event: ev,
                props,
                destination: 'background',
                v2: true,
            },
            (resp) => {
                accept(resp);
            }
        ];
        // console.log("bgAsk", ev, props, r);
        chrome.runtime.sendMessage(...r);
    });
    if (opts === null || opts === void 0 ? void 0 : opts.debug) {
        x.then((resp) => {
            // console.log('bgAsk', ev, props, resp)
        });
    }
    return x;
}
function contentAsk(ev, props) {
    return bgAsk("contentAsk", {
        event: ev, props
    });
}
function highlightRange(range, highlightId, showNoteButton = false) {
    var _a;
    console.log('Creating highlight with ID:', highlightId);
    var newNode = document.createElement('highlight');
    const highlight = __highlights && __highlights.find
        ? __highlights.find((h) => h.id === highlightId)
        : null;
    const highlightColor = getColorHex((_a = highlight === null || highlight === void 0 ? void 0 : highlight.highlightColor) !== null && _a !== void 0 ? _a : "default");
    const hasNote = (highlight === null || highlight === void 0 ? void 0 : highlight.hasNote) || (highlight === null || highlight === void 0 ? void 0 : highlight.note) ? true : false;
    console.log('Highlight properties:', {
        id: highlightId,
        color: highlightColor,
        hasNote: hasNote,
        noteContent: (highlight === null || highlight === void 0 ? void 0 : highlight.note) || null
    });
    newNode.setAttribute('x-id', highlightId.replace(/-/g, ''));
    newNode.setAttribute('x-color', highlightColor);
    newNode.setAttribute('x-has-note', hasNote ? 'true' : 'false');
    const isDarkText = haveDarkText(range.startContainer.parentNode);
    newNode.setAttribute('style', `background-color: ${isDarkText ? colorsMap.light[highlightColor] : colorsMap.dark[highlightColor]}; display: inline; border-radius: 3px; position: relative;`);
    // Add mouseover event only if we don't have a note button
    if (!showNoteButton || !hasNote) {
        newNode.addEventListener('mouseover', (event) => {
            contentAsk('showHighlightTooltip', {
                id: highlightId,
                mouseX: event.clientX,
                mouseY: event.clientY
            })
                .catch(error => console.error('Error showing highlight tooltip:', error));
        });
    }
    range.surroundContents(newNode);
    if (showNoteButton && hasNote) {
        const noteButton = document.createElement('div');
        noteButton.classList.add('stn-note-button');
        noteButton.setAttribute('title', 'Add note');
        noteButton.setAttribute('style', `
            position: absolute;
            top: -6px;
            left: -6px;
            width: 12px;
            height: 12px;
            background-color: #0284c7;
            border-radius: 50%;
            cursor: pointer;
            z-index: 10;
        `);
        noteButton.addEventListener('click', (event) => {
            event.stopPropagation();
            bgAsk('openHighlightNote', {
                id: highlightId
            })
                .catch(error => console.error('Error showing highlight tooltip:', error));
        });
        // Add mouseover event to the highlight element when not hovering the button
        newNode.addEventListener('mouseover', (event) => {
            if (!event.target.classList.contains('stn-note-button')) {
                contentAsk('showHighlightTooltip', {
                    id: highlightId,
                    mouseX: event.clientX,
                    mouseY: event.clientY
                })
                    .catch(error => console.error('Error showing highlight tooltip:', error));
            }
        });
        newNode.appendChild(noteButton);
    }
}
function removeSelection(highlightId) {
    const highlightNodes = document.querySelectorAll(`highlight[x-id="${highlightId.replace(/-/g, '')}"]`);
    console.log('Removing highlight with ID:', highlightId, 'found nodes:', highlightNodes.length);
    highlightNodes.forEach((highlightNode) => {
        const parent = highlightNode.parentNode;
        // Iterate through all child nodes
        for (let i = 0; i < highlightNode.childNodes.length; i++) {
            const child = highlightNode.childNodes[i];
            // Only keep text nodes
            if (child.nodeType === Node.TEXT_NODE) {
                // Clone the text node to avoid reference issues
                const textClone = child.cloneNode(true);
                parent.insertBefore(textClone, highlightNode);
            }
            // Skip non-text nodes - they will be discarded
        }
        // Remove the highlight node after processing all children
        parent.removeChild(highlightNode);
        // Normalize the parent to merge adjacent text nodes
        parent.normalize();
    });
}
function getContainerOrText(css, isText) {
    const x = document.querySelector(css);
    if (x && isText) {
        return x.childNodes[0];
    }
    return x;
}
function getRangeFromSelectionRangePresentation(range) {
    const rangeObject = new Range();
    rangeObject.setStart(getContainerOrText(range.startContainerCss, range.startContainerIsText), range.startOffset);
    rangeObject.setEnd(getContainerOrText(range.endContainerCss, range.endContainerIsText), range.endOffset);
    return rangeObject;
}
/**
 * Gets an array of clean ranges that contain only text nodes from the original range
 * @param {Range} range - The original selection range
 * @returns {Range[]} Array of ranges that only affect text nodes
 */
function getTextNodeRanges(range) {
    // Store the resulting ranges
    const textRanges = [];
    // If the range is collapsed (cursor only), return empty array
    if (range.collapsed) {
        return textRanges;
    }
    // Special case: If the range is already within a single text node, just use it directly
    if (range.startContainer === range.endContainer &&
        range.startContainer.nodeType === Node.TEXT_NODE) {
        const textRange = document.createRange();
        textRange.setStart(range.startContainer, range.startOffset);
        textRange.setEnd(range.endContainer, range.endOffset);
        textRanges.push(textRange);
        return textRanges;
    }
    // Create TreeWalker to iterate through all text nodes in the common ancestor
    const walker = document.createTreeWalker(range.commonAncestorContainer, NodeFilter.SHOW_TEXT, {
        acceptNode: function (node) {
            // Skip empty text nodes
            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') {
                return NodeFilter.FILTER_ACCEPT;
            }
            return NodeFilter.FILTER_SKIP;
        }
    });
    let node;
    // Iterate through all text nodes
    while (node = walker.nextNode()) {
        // Check if the node intersects with the range at all
        // A node is before the range if its end is before the range start
        const nodeIsBeforeRange = range.comparePoint(node, node.length) < 0;
        // A node is after the range if its start is after the range end
        const nodeIsAfterRange = range.comparePoint(node, 0) > 0 &&
            node !== range.startContainer &&
            node !== range.endContainer;
        // Skip nodes that don't intersect with the range
        if (nodeIsBeforeRange || nodeIsAfterRange) {
            continue;
        }
        // Create a new range for this text node
        const textRange = document.createRange();
        // Handle start node special case
        if (node === range.startContainer) {
            textRange.setStart(node, range.startOffset);
            // If it's also the end node
            if (node === range.endContainer) {
                textRange.setEnd(node, range.endOffset);
            }
            else {
                textRange.setEnd(node, node.length);
            }
        }
        // Handle end node special case
        else if (node === range.endContainer) {
            textRange.setStart(node, 0);
            textRange.setEnd(node, range.endOffset);
        }
        // Regular node within range - select entire text node
        else {
            textRange.selectNodeContents(node);
        }
        textRanges.push(textRange);
    }
    return textRanges;
}
function findAllHighlights() {
    const highlights = __highlights;
    console.log(`Finding all highlights: ${highlights.length} highlights to process`);
    console.log('highlights', highlights);
    highlights.forEach((highlight, i) => {
        console.log(`Processing highlight ${i + 1}/${highlights.length}: ${highlight.id}`);
        if (!highlight.selectionRange) {
            console.log(`Highlight ${i + 1}/${highlights.length} has no selection range, skipping`);
            return;
        }
        try {
            console.log(`Processing highlight: ${i + 1}/${highlights.length}`, {
                color: highlight.highlightColor,
                hasNote: highlight.hasNote || !!highlight.note,
                noteContent: highlight.note || null
            });
            const range = getRangeFromSelectionRangePresentation(highlight.selectionRange);
            addHighlightColorToSelectionRange(range, highlight.id);
        }
        catch (e) {
            console.error(`Error processing highlight ${i + 1}/${highlights.length}:`, e);
            // ignore for now
        }
    });
}
function getNodeCss(node) {
    if (node.nodeType == Node.TEXT_NODE) {
        return getNodeCss(node.parentNode);
    }
    return (0, finder_1.finder)(node);
}
function getSelectionRangeRepresentation() {
    const selRange = window.getSelection().getRangeAt(0);
    const commonAncestorContainerCss = getNodeCss(selRange.commonAncestorContainer);
    console.log('here', commonAncestorContainerCss);
    const startContainerCss = selRange.startContainer == selRange.commonAncestorContainer
        ? commonAncestorContainerCss
        : getNodeCss(selRange.startContainer);
    const endContainerCss = selRange.endContainer == selRange.commonAncestorContainer
        ? commonAncestorContainerCss
        : selRange.endContainer == selRange.startContainer
            ? startContainerCss
            : getNodeCss(selRange.endContainer);
    if (!commonAncestorContainerCss || !startContainerCss || !endContainerCss)
        return null;
    return {
        type: 'range',
        collapsed: selRange.collapsed,
        commonAncestorContainerCss,
        commonAncestorContainerIsText: selRange.commonAncestorContainer.nodeType == Node.TEXT_NODE,
        endContainerCss,
        endContainerIsText: selRange.endContainer.nodeType == Node.TEXT_NODE,
        startContainerCss,
        startContainerIsText: selRange.startContainer.nodeType == Node.TEXT_NODE,
        startOffset: selRange.startOffset,
        endOffset: selRange.endOffset,
    };
}
function addHighlightColorToSelectionRange(range, highlightId) {
    console.log('addHighlightColorToSelectionRange', range, highlightId);
    var textRanges = getTextNodeRanges(range);
    console.log('textRanges', textRanges);
    for (var i = 0; i < textRanges.length; i++) {
        highlightRange(textRanges[i], highlightId, i === 0);
    }
}
function highlightSelection() {
    if (window.location.href.endsWith('.pdf')) {
        return;
    }
    if (__action == 'getSelectionRangeRepresentation') {
        return getSelectionRangeRepresentation();
    }
    if (__action == 'removeSelection') {
        return removeSelection(__highlightId);
    }
    if (__highlights) {
        return findAllHighlights();
    }
    // Si nous n'avons pas de highlights et pas d'ID spécifique, rien à faire
    if (!__highlightId) {
        console.log('No highlights and no highlightId provided');
        return;
    }
    // highlight selection
    var userSelection = window.getSelection();
    // Vérifiez que nous avons une sélection valide
    if (!userSelection || userSelection.rangeCount === 0) {
        console.log('No valid selection found');
        return;
    }
    addHighlightColorToSelectionRange(userSelection.getRangeAt(0), __highlightId);
    window.getSelection().removeAllRanges();
}
// @ts-ignore
const response = highlightSelection();
return response;


/***/ })

/******/ });