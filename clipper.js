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
/******/ 	return __webpack_require__inject_script_fix(__webpack_require__.s = 13);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */,
/* 2 */,
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
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */
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
const InjectableClipper_1 = __webpack_require__(14);
const clipperUtil_1 = __webpack_require__(4);
const twitterMonkeyPatch_1 = __webpack_require__(15);
// let idName = "stn"
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
function checkNodeHasIdParent(child, ids) {
    if (!child)
        return false;
    if (ids.includes(child.id))
        return true;
    return checkNodeHasIdParent(child.parentNode, ids);
}
function attachDrag(barSel, blockSel) {
    var bar = document.querySelector(barSel);
    var block = document.querySelector(blockSel);
    var initX, blockWidth, initY, mousePressX, mousePressY;
    bar.addEventListener('mousedown', function (event) {
        if (checkNodeHasIdParent(event.target, [
            `close-button-${idName}`,
            `history-button-${idName}`,
            `upgrade-button-${idName}`,
            `expand-button-${idName}`,
            `list-button-${idName}`,
        ]))
            return;
        //display the hidden overlay
        const overlay = document.querySelector(`#overlay-${idName}`);
        if (overlay) {
            overlay.style.height = '100%';
            overlay.style.display = 'block';
        }
        initX = block.offsetLeft;
        initY = block.offsetTop;
        mousePressX = event.clientX;
        mousePressY = event.clientY;
        blockWidth = block.offsetWidth;
        document.body.style.cursor = 'grabbing';
        window.addEventListener('mousemove', repositionElement, false);
        //console.log("got", window.innerWidth, window.innerHeight,blockWidth);
        window.addEventListener('mouseup', function () {
            if (overlay) {
                overlay.style.height = '0%';
                overlay.style.display = 'none';
            }
            document.body.style.cursor = null;
            window.removeEventListener('mousemove', repositionElement, false);
        }, false);
    }, false);
    const repositionElement = (event) => {
        const left = Math.max(0, Math.min(window.innerWidth - blockWidth, initX + event.clientX - mousePressX));
        const top = Math.max(0, initY + event.clientY - mousePressY);
        block.style.left = left + 'px';
        block.style.top = top + 'px';
    };
}
function findParentWithAttribute(element, attribute) {
    var _a;
    if (!element)
        return null;
    if ((_a = element.hasAttribute) === null || _a === void 0 ? void 0 : _a.call(element, attribute))
        return element;
    return findParentWithAttribute(element.parentNode, attribute);
}
////// tooltip creator
function setupClipperTooltip() {
    // Only create the tooltip once
    if (document.getElementById('clipper-tooltip'))
        return;
    // Create tooltip element
    const tooltip = document.createElement('div');
    tooltip.id = 'clipper-tooltip';
    tooltip.setAttribute('style', `
        position: fixed !important;
        z-index: 2147483646 !important;
        background-color: #000 !important;
        color: white !important;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
        font-size: 11px !important;
        padding: 0.2rem 0.4rem !important;
        border-radius: 0.375rem !important;
        pointer-events: none !important;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3) !important;
        transform: translateX(-50%) !important;
        opacity: 0 !important;
        transition: opacity 0.15s ease-in-out !important;
        display: none !important;
        white-space: nowrap !important;
        font-weight: 400 !important;
    `);
    document.body.appendChild(tooltip);
    // Variables to track state
    let isVisible = false;
    let currentContent = '';
    let currentTooltipElement = null;
    let showTimer = null;
    // Function to hide tooltip
    const hideTooltip = () => {
        tooltip.style.opacity = '0';
        tooltip.style.display = 'none';
        isVisible = false;
        currentContent = '';
        currentTooltipElement = null;
    };
    // Mouse move handler
    const handleMouseMove = (e) => {
        const parent = findParentWithAttribute(e.target, 'x-title');
        if (parent) {
            const target = parent;
            const content = parent.getAttribute('x-title');
            // If we're still on the same tooltip element, don't do anything
            if (currentTooltipElement === parent && isVisible) {
                return;
            }
            if (content !== currentContent || currentTooltipElement !== parent) {
                // Clear any existing timer
                if (showTimer) {
                    clearTimeout(showTimer);
                }
                const offsetTop = Number.parseInt(parent.getAttribute('x-offset-top') || '0');
                const offsetRight = Number.parseInt(parent.getAttribute('x-offset-right') || '0');
                currentContent = content;
                currentTooltipElement = parent;
                tooltip.textContent = content;
                // Force display to measure correctly, but keep invisible
                tooltip.style.display = 'block';
                tooltip.style.opacity = '0';
                // Use requestAnimationFrame to ensure DOM has updated before calculating position
                requestAnimationFrame(() => {
                    // Get target element bounds
                    const targetRect = target.getBoundingClientRect();
                    // Calculate position above the button with correct height
                    const tooltipTop = targetRect.top - tooltip.offsetHeight - 4 + offsetTop;
                    let tooltipLeft = targetRect.left + (targetRect.width / 2) + offsetRight;
                    // Check viewport boundaries
                    // const viewportWidth = window.innerWidth;
                    // const tooltipWidth = tooltip.offsetWidth;
                    // tooltipLeft = Math.max(tooltipWidth / 2 + 5, tooltipLeft);
                    // tooltipLeft = Math.min(viewportWidth - tooltipWidth / 2 - 5, tooltipLeft);
                    tooltip.style.top = `${tooltipTop}px`;
                    tooltip.style.left = `${tooltipLeft}px`;
                    // Show tooltip
                    tooltip.style.opacity = '1';
                    isVisible = true;
                });
            }
        }
        else if (isVisible && currentTooltipElement) {
            // Check if we moved out of the current tooltip element and its children
            const isStillInTooltipContext = currentTooltipElement.contains(e.target) ||
                currentTooltipElement === e.target ||
                findParentWithAttribute(e.target, 'x-title') === currentTooltipElement;
            if (!isStillInTooltipContext) {
                // We've moved completely out of the tooltip context, hide it
                hideTooltip();
            }
        }
    };
    // Click handler to hide tooltip on any click
    const handleClick = (e) => {
        if (isVisible) {
            hideTooltip();
        }
    };
    // Attach event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleClick, true);
    return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('click', handleClick, true);
        if (showTimer) {
            clearTimeout(showTimer);
        }
        if (tooltip && tooltip.parentNode) {
            tooltip.parentNode.removeChild(tooltip);
        }
    };
}
function upsertDialog() {
    // debug if domain == "twitter" insert monkey patch 2s after
    if (['x.com', 'www.x.com', 'mobile.x.com'].includes(window.location.hostname)) {
        setTimeout(() => {
            (0, twitterMonkeyPatch_1.twitterMonkeyPatch)();
        }, 200);
    }
    let exists = document.getElementById(`dialog-${idName}`);
    if (exists)
        return false;
    let a = (0, clipperUtil_1.comp2El)(InjectableClipper_1.InjectableClipper, {
        idName: idName,
        popupUrl: popupUrl,
        showHeader: true,
        prefixId: null,
        fixed: true,
        titleInfo: null,
    });
    document.body.appendChild(a);
    attachDrag(`#dialog-top-${idName}`, `#dialog-${idName}`);
    // Setup tooltip system
    setupClipperTooltip();
    document
        .querySelector(`#close-button-${idName}`)
        .addEventListener('click', function (e) {
        e.stopPropagation();
        e.preventDefault();
        closeDialog();
    });
    const expandButtonEl = document.querySelector(`#expand-button-${idName}`);
    expandButtonEl.addEventListener('click', function (e) {
        e.stopPropagation();
        e.preventDefault();
        expandPopup();
        setTimeout(() => {
            expandButtonEl.style.opacity = '0';
            setTimeout(() => {
                expandButtonEl.style.display = 'none';
            }, 100);
        }, 100);
    });
    const historyButtonEl = document.querySelector(`#history-button-${idName}`);
    historyButtonEl.addEventListener('click', function (e) {
        e.stopPropagation();
        e.preventDefault();
        toggleOpenHistoryPopover();
    });
    const upgradeButtonEl = document.querySelector(`#upgrade-button-${idName}`);
    upgradeButtonEl.addEventListener('click', function (e) {
        e.stopPropagation();
        e.preventDefault();
        toggleOpenUpgradeModal();
    });
    // const listButtonEl = document.querySelector(
    //     `#list-button-${idName}`
    // ) as HTMLDivElement
    // listButtonEl.addEventListener('click', function (e) {
    //     e.stopPropagation()
    //     e.preventDefault()
    //     startListFeature()
    //     // setTimeout(() => {
    //     //     expandButtonEl.style.opacity = '0'
    //     //     setTimeout(() => {
    //     //         expandButtonEl.style.display = 'none'
    //     //     }, 100)
    //     // }, 100)
    // })
    return true;
}
function removeDomElem(sel) {
    const el = document.querySelector(sel);
    if (!el)
        throw `el '${sel}' not found`;
    el.parentNode.removeChild(el);
}
function closeDialog() {
    removeDomElem(`#dialog-${idName}`);
}
function resizeDialog({ width, height, silosModeEnabled }) {
    console.log('here resizing...', width, height, idName);
    const prefixId = integration == 'quickNote' ? 'floating-' : '';
    const iframe = document.getElementById(`${prefixId}iframe-${idName}`);
    const dialog = document.getElementById(`${prefixId}dialog-${idName}`);
    if (!iframe || !dialog) {
        console.error('no iframe or dialog found', idName, dialog, iframe);
        return;
    }
    if (height) {
        //console.log("change height",height);
        //iframe.height = height + 'px';
        iframe.style.height =
            Math.min(Math.min(window.innerHeight - 50, 720), height) + 'px';
    }
    if (width) {
        //console.log('resized',width);
        dialog.style.width = width + 'px';
    }
    // if (silosModeEnabled) {
    //     turnOnSilosMode(dialog, iframe, height)
    // } else {
    //     turnOffSilosMode(dialog, iframe)
    // }
}
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
function rerenderRects(rects) {
    rects.forEach((rect) => {
        const x = rect.getAttribute('width');
        rect.setAttribute('width', x);
    });
}
function turnOnSilosMode(dialog, iframe, height) {
    return __awaiter(this, void 0, void 0, function* () {
        dialog.style.clipPath = 'url(#floating-silos)';
        iframe.style.backgroundColor = 'transparent';
        const svg = document.querySelector('#floating-silos-svg');
        svg.style.display = 'none';
        svg.style.display = 'block';
        const rects = [...svg.querySelectorAll('rect')];
        yield sleep(300);
        rerenderRects(rects);
        yield sleep(300);
    });
}
function turnOffSilosMode(dialog, iframe) {
    iframe.style.backgroundColor = '#efeef5';
    if (dialog.style.clipPath != null) {
        dialog.style.clipPath = null;
    }
}
function expandPopup() {
    chrome.runtime.sendMessage({ popup: { name: 'expandPopup' } });
}
function toggleOpenHistoryPopover() {
    toggleHistoryButton();
    chrome.runtime.sendMessage({ popup: { name: 'toggleOpenHistoryPopover' } });
}
function toggleOpenUpgradeModal() {
    chrome.runtime.sendMessage({ popup: { name: 'toggleOpenUpgrade' } });
}
function startListFeature() {
    chrome.runtime.sendMessage({ popup: { name: 'startListFeature' } });
}
function toggleShowExandButton() {
    const btn = document.querySelector(`#expand-button-${idName}`);
    if (!btn)
        return;
    // let hidden = btn.style.display == 'none'
    btn.style.display = 'flex'; // : 'none'
    btn.style.opacity = '1'; // : '0'
}
function showListButton() {
    const btn = document.querySelector(`#list-button-${idName}`);
    if (!btn)
        return;
    // let hidden = btn.style.display == 'none'
    btn.style.display = 'flex'; // : 'none'
    btn.style.opacity = '1'; // : '0'
}
function showHistoryButton() {
    const btn = document.querySelector(`#history-button-${idName}`);
    if (!btn)
        return;
    btn.style.display = 'flex';
    btn.style.opacity = '1';
}
function showUpgradeButton() {
    const btn = document.querySelector(`#upgrade-button-${idName}`);
    if (!btn)
        return;
    btn.style.display = 'flex';
    btn.style.opacity = '1';
}
function hideUpgradeButton() {
    const btn = document.querySelector(`#upgrade-button-${idName}`);
    if (!btn)
        return;
    btn.style.display = 'none';
    btn.style.opacity = '0';
}
function toggleHoverBackgroundStyle(btn) {
    if (btn.style.background == 'rgba(202, 204, 206, 0.4)') {
        btn.style.background = 'transparent';
    }
    else {
        btn.setAttribute('style', 'all:unset; color: #5c5c5c;border-radius: 999px;cursor: pointer;padding: 6px;margin-left:-2px; background: rgba(202, 204, 206, 0.4) !important;');
    }
}
function toggleHistoryButton() {
    const btn = document.querySelector(`#history-button-${idName}`);
    if (!btn)
        return;
    toggleHoverBackgroundStyle(btn);
}
function hideHistoryButton() {
    const btn = document.querySelector(`#history-button-${idName}`);
    if (!btn)
        return;
    btn.style.display = 'none';
    btn.style.opacity = '0';
}
function closeHistoryButton() {
    const btn = document.querySelector(`#history-button-${idName}`);
    if (!btn)
        return;
    btn.style.backgroundColor = 'transparent';
}
function cancelHoverStateHistoryButton() {
    const btn = document.querySelector(`#history-button-${idName}`);
    if (!btn)
        return;
    btn.setAttribute('style', 'all:unset; color: rgba(0, 0, 0, 0.5);border-radius: 999px;cursor: pointer;padding: 6px;margin-left:-2px; opacity:1;display:flex;');
}
function activateHoverStateHistoryButton() {
    const btn = document.querySelector(`#history-button-${idName}`);
    if (!btn)
        return;
    btn.setAttribute('style', 'all:unset; color: #5c5c5c;border-radius: 999px;cursor: pointer;padding: 6px;margin-left:-2px; background: rgba(202, 204, 206, 0.4) !important;');
}
function turnOffClipperHeaderExpandButton() {
    const btn = document.querySelector(`#expand-button-${idName}`);
    if (!btn)
        return;
    btn.style.display = 'none';
    btn.style.opacity = '0';
}
function clipper() {
    let actionName = typeof action == 'string' ? action : action.action;
    switch (actionName) {
        case 'open':
            upsertDialog();
            return;
        case 'close':
            return closeDialog();
        case 'closeAndLogin':
            closeDialog();
            window.alert('In order to use the extension, please login to Notion');
            window.location.href = 'https://www.notion.so/login';
            return;
        case 'toggleShowExandButton':
            return toggleShowExandButton();
        case 'showListButton':
            return showListButton();
        case 'showHistoryButton':
            return showHistoryButton();
        case 'showUpgradeButton':
            return showUpgradeButton();
        case 'hideUpgradeButton':
            return hideUpgradeButton();
        case 'closeHistoryButton':
            return closeHistoryButton();
        case 'hideHistoryButton':
            return hideHistoryButton();
        case 'cancelHoverStateHistoryButton':
            return cancelHoverStateHistoryButton();
        case 'activateHoverStateHistoryButton':
            return activateHoverStateHistoryButton();
        case 'turnOffClipperHeaderExpandButton':
            return turnOffClipperHeaderExpandButton();
        case 'resize':
            return resizeDialog(action);
    }
}
clipper();
// let macosEventsMap = {}
// function randomId(length:number){
//     var result = '';
//     var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     var charactersLength = characters.length;
//     for ( var i = 0; i < length; i++ ) {
//        result += characters.charAt(Math.floor(Math.random() * charactersLength));
//     }
//     return result;
// }
// export function macOsAsk(ev: keyof MacOsEvents, props: Parameters<MacOsEvents[keyof MacOsEvents]>[0]): Promise<Awaited<ReturnType<MacOsEvents[keyof MacOsEvents]>>> {
//     const eventId = randomId(20)
//     //@ts-ignore
//     safari.extension.dispatchMessage(ev, {
//         data:props,
//         eventId,
//     });
//     return new Promise((resolve, reject) => {
//         macosEventsMap[eventId] = {resolve, reject}    
//     });
// }
// function listenMacOsEvents(){
//     console.log("listen events")
//     //@ts-ignore
//     safari.self.addEventListener("message", function(event){
//         if (event.name == "response") {
//             if (macosEventsMap[event.message.eventId]){
//                 macosEventsMap[event.message.eventId].resolve(event.message.data)
//             }
//         }
//     }, false);
// }
// console.log("DEBUG -> ask macos...")
// listenMacOsEvents();
// macOsAsk("ping",{}).then(r => {
//     console.log("DEBUG -> ask macos + response", r)
// })
// })


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.InjectableClipper = void 0;
exports.InjectableClipper = {
    css: ({ idName }) => `
#close-button-${idName}, #list-button-${idName}, #expand-button-${idName}, #history-button-${idName}, #upgrade-button-${idName}, #highlight-button-${idName}, #screenshot-button-${idName},#toggle-highlight-button-${idName} {
  transition: background,opacity,fill,color 20ms ease-in 0s !important;
  border-radius: 3px;
  cursor:pointer !important;
  background:white !important;
}

#close-button-${idName}:hover, #list-button-${idName}:hover, #expand-button-${idName}:hover, #history-button-${idName}:hover, #highlight-button-${idName}:hover, #screenshot-button-${idName}:hover, #toggle-highlight-button-${idName}:hover {
background: rgba(202, 204, 206, 0.4) !important;
}

#upgrade-button-${idName} {
transition: background 0.1s ease-in 0s, color 0.1s ease-in 0s !important;
}

#upgrade-button-${idName}:hover {
background: #ffefcc !important;
color: #86661d !important;
}

.highlightHeader--unfocused {
    box-shadow: 0px 2px 4px 0px #0000004D inset, 0px -2px 5px 0px #0000000F inset !important;
    opacity: 0.75 !important;
}

.highlightHeader--focused {
    box-shadow: none !important;
    opacity: 1 !important;
}


.iframe--focused {
    box-shadow: none !important;
    opacity: 1 !important;
}

.iframe--unfocused {
    opacity: 0.75 !important;
}

`,
    html: ({ idName, popupUrl, prefixId, fixed, showHeader, titleInfo }) => `
      <div id="dialog-${idName}" role="dialog" style="all:unset; position:relative; transition: opacity 0.04s ease 0s;background: black;border: 0px; border-radius: 5px;     box-shadow: rgba(0, 0, 0, 0.25) 0px 0px 0px 5px;clip: auto;display: block;height: auto;overflow: hidden;
      ${fixed
        ? `position: fixed;
      right: 15px;top: 17px;`
        : `position:absolute;`}
      user-select: none;width: 380px;z-index: 2147483645; background-color:transparent;">
	${!showHeader
        ? ''
        : `<div 
    id="${prefixId || ''}dialog-top-${idName}" style="all:unset; align-items: center;background-color: rgb(255, 255, 255);box-shadow: rgb(234, 234, 234) 0px -1px inset;cursor: grab; display: inline-flex;height: 40px;left: 0px;padding: 0px 8px 0px 12px;position: absolute; right: 0px;top: 0px;">
		<div style="all:unset; display: flex; align-items: center; color: #5c5c5c;  font-family: -apple-system, system-ui, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, Oxygen-Sans, Ubuntu, Cantarell, &quot;Helvetica Neue&quot;, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, sans-serif;    font-size: 13px;     font-weight: 500;flex: 1 1 0%;line-height: 15px;    margin: 0px;padding: 0px 0px 0px 8px;">
		
    <span style="all:unset;color: #5c5c5c;  font-family: -apple-system, system-ui, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, Oxygen-Sans, Ubuntu, Cantarell, &quot;Helvetica Neue&quot;, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, sans-serif; font-size: 13px;line-height: 20px;letter-spacing: -0.084px;font-weight: 500;">Save.to</span>${titleInfo ? ` - ${titleInfo}` : ''}
             <!--<div tabindex="0" role="button" aria-label="Enable List Feature" id="list-button-${idName}" 
     style="all:unset; color: #5c5c5c; border-radius: 999px;cursor: pointer;padding: 6px;margin-left:4px; opacity:1;display:none;">
     <svg style="color: #5c5c5c; display: block !important;" width="15" height="15" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
      </svg>
     </div>-->


        </div>
     <div style="display:flex; gap: 4px; align-items:center;"> 
     <div tabindex="0" role="button" aria-label="Go back" id="expand-button-${idName}" 
     style="all:unset; color: #5c5c5c;border-radius: 999px;cursor: pointer;padding: 6px;opacity:1;display:none;"
     x-title="Go back">
     <svg style="all:unset; color: #5c5c5c; display: block !important;" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 12 12" id="chevron-left">
  <g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" stroke="currentColor">
    <polyline points="7.5 2.25 3.75 6 7.5 9.75"></polyline>
  </g>
</svg>
     </div>
     <div tabindex="0" role="button" aria-label="Upgrade" id="upgrade-button-${idName}" 
     style="all:unset; color: #5c5c5c;border-radius: 999px;cursor: pointer;padding: 6px;margin-left:-2px; opacity:0;display:none;"
     x-title="Upgrade">
     <svg style="all:unset; color: inherit; display: block !important;" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 18 18" id="star-upgrade">
  <g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" stroke="currentColor">
    <polygon points="9 1.774 11.009 5.844 15.5 6.497 12.25 9.665 13.017 14.138 9 12.026 4.983 14.138 5.75 9.665 2.5 6.497 6.991 5.844 9 1.774"></polygon>
    <line x1="9" y1="15.75" x2="9" y2="16.815"></line>
    <line x1="15.837" y1="10.673" x2="16.85" y2="11.002"></line>
    <line x1="13.225" y1="2.636" x2="13.851" y2="1.774"></line>
    <line x1="4.775" y1="2.636" x2="4.149" y2="1.774"></line>
    <line x1="2.163" y1="10.673" x2="1.15" y2="11.002"></line>
  </g>
</svg>
     </div>
     <div tabindex="0" role="button" aria-label="View history" id="history-button-${idName}" 
     style="all:unset; color: #5c5c5c;border-radius: 999px;cursor: pointer;padding: 6px;margin-left:-2px; opacity:1;display:flex;"
     x-title="View history">
     <svg style="all:unset; color: #5c5c5c; display: block !important;" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 18 18" id="history">
  <g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" stroke="currentColor"><path d="M1.75281 9.20209C1.85991 13.1127 5.0636 16.25 9 16.25C13.004 16.25 16.25 13.004 16.25 9C16.25 4.996 13.004 1.75 9 1.75C5.9995 1.75 3.42531 3.57271 2.32321 6.17041"></path> <path d="M1.88 3.30499L2.28799 6.25L5.23199 5.84302"></path> <path d="M9 4.75V9L12.25 11.25"></path></g>
</svg>
      
     </div>

      <div tabindex="0" role="button" aria-label="Close web clipper" id="close-button-${idName}" 
      style="all:unset; color: #5c5c5c;border-radius: 999px;cursor: pointer;padding: 6px;margin-left:-2px;"
      x-title="Close" x-offset-top="-2" x-offset-right="-2">
      <svg style="all:unset; color: #5c5c5c; display: block !important;" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 12 12" id="xmark">
  
  <g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" stroke="currentColor">
    <line x1="2.25" y1="9.75" x2="9.75" y2="2.25"></line>
    <line x1="9.75" y1="9.75" x2="2.25" y2="2.25"></line>
  </g>
</svg>
      </div>
    </div>
	</div>`}
  <iframe id="${prefixId || ''}iframe-${idName}" src="${popupUrl}" 
  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
  class="iframe--focused"
  style="all:unset; border: 0px;clip: auto;display: block;height: 250px;margin-top: ${!showHeader ? '0px' : '40px'};width: 100%; background:white;opacity:1;transition: opacity 0.4s ease 0s;background-color:#efeef4;color-scheme: none !important;"></iframe>

  <svg id="floating-silos-svg" height="100%" width="100%" style="display: flex;position: absolute;top: 0px;left: 0px;z-index:-1;">
  <defs>
    <clipPath id="floating-silos">
      <rect y="-5" x="-5" width="calc(100% + 10px)" height="calc(100% + 10px - 50px - 20px)" rx="10"></rect>
      <rect y="calc(100% - 50px - 5px)" x="-5" width="calc(100% + 10px)" height="calc(50px + 10px)" background="" rx="10"></rect>
      <rect y="0" x="0" width="100%" height="100%"></rect>
    </clipPath>
</defs>
</svg>

  <div id="overlay-${idName}" style="position: absolute; top: 0; display: none; height: 0%; left: 0px; width: 100%; z-index: 2147483646;"></div>
</div>
      `,
};


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.twitterMonkeyPatch = void 0;
const bgAsk_1 = __webpack_require__(3);
const twitterMonkeyPatch = () => {
    console.log('twitterMonkeyPatch');
    var script = document.createElement('script');
    script.src = chrome.runtime.getURL('assets/twitterMonkeyPatch.js');
    ;
    (document.head || document.documentElement).appendChild(script);
    script.remove();
    window.addEventListener('updateHeaders', (x) => {
        console.log('updateTwitterSession', x.detail);
        (0, bgAsk_1.bgAsk)('updateTwitterSession', x.detail);
    });
};
exports.twitterMonkeyPatch = twitterMonkeyPatch;


/***/ })
/******/ ]);