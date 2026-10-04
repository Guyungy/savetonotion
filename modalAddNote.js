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
/******/ 	return __webpack_require__inject_script_fix(__webpack_require__.s = 30);
/******/ })
/************************************************************************/
/******/ ({

/***/ 30:
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
const __saveToNotionIds = {
    submitButton: `__SaveToNotion_submitButton`,
    textArea: `__SaveToNotion_textArea`,
    modal: `__SaveToNotion_modal`,
    statusDiv: `__SaveToNotion_statusDiv`,
};
//var port = chrome.runtime.connect()
function closeModal() {
    const modal = document.getElementById(__saveToNotionIds.modal);
    modal.style.display = "none";
    //done()
}
function addCss(rule) {
    let css = document.createElement("style");
    css.type = "text/css";
    css.appendChild(document.createTextNode(rule)); // Support for the rest
    document.getElementsByTagName("head")[0].appendChild(css);
}
function upsertModal() {
    let modal = document.getElementById(__saveToNotionIds.modal);
    const modalAlreadyExist = modal != null;
    const needAppend = modal == null;
    if (!modal)
        modal = document.createElement("div");
    modal.id = __saveToNotionIds.modal;
    modal.style.cssText = `
  display: none; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 9000 !important; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0,0,0); /* Fallback color */
  background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
  `;
    const modalContentStyle = `
  all: initial;
  background-color: #fefefe;
  margin: 15% auto; /* 15% from the top and centered */
  padding: 20px;
  border: 1px solid #888;
  border-radius:3px;
  width: 80%;
  display:flex;
  flex-direction:column;
  font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif;
  font: 400 13.3333px;
  max-width:600px;
  `;
    const textAreaStyle = `
    all: initial;
    border:1px solid grey
    font:inherit !important;
    -webkit-font-smoothing: antialiased;
    width:100% !important;
font-size:15px !important;
color: rgba(0, 0, 0, 0.87);
cursor: text;
display: inline-flex;
font-size: 1rem !importantt;
box-sizing: border-box;
align-items: center;
font-family: Roboto, Helvetica, Arial, sans-serif;
font-weight: 400;
line-height: 1.1876em;
letter-spacing: 0.00938em;
position: relative;
border-radius: 4px !important;
padding: 18.5px 14px;
  resize:none;
    border-radius:4px;
    padding: 18.5px 14px;
    display:inline-flex;
  border: 1px solid #909090 !important;
    font-family: inherit !important;
    overflow:hidden;
  `;
    const wrapperTextAreaStyle = `
  `;
    const modalInnerContentStyle = `
  display:flex;
  flex-direction:column;
  max-width:600px;
  `;
    const buttonStyle = `
  background-color:#4F9BC7;
  height: 40px;
  color:#fff !important;
  font-size:15px !important;
  font-family:inherit !important;
    -webkit-font-smoothing: antialiased;
border: 0;
cursor: pointer;
margin: 0;
display: inline-flex;
outline: 0;
position: relative;
align-items: center;
user-select: none;
vertical-align: middle;
justify-content: center;
-webkit-tap-highlight-color: transparent;
padding: 6px 16px;
font-size: 0.875rem;
min-width: 64px;
box-sizing: border-box;
transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
font-weight: 500;
line-height: 1.75;
border-radius: 4px;
letter-spacing: 0.02857em;
text-transform: capitalize !important;
text-decoration: none;
box-shadow: 0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12);
  `;
    const customCssStyle = `
  
    #${__saveToNotionIds.textArea}:hover {
      border-color:#303030 !important;
    }
    #${__saveToNotionIds.textArea}:focus {
      border-color:#303030 !important;
    }

    #${__saveToNotionIds.submitButton}:hover{
      background-color:#3f7c9f !important;
    }
    
    #${__saveToNotionIds.submitButton}:focus {
      background-color:#3f7c9f !important;
    }
    
    #${__saveToNotionIds.submitButton}:disabled {
      background-color:#737373 !important;
    }

  `;
    //if (!modalAlreadyExist) {
    addCss(customCssStyle);
    //}
    if (!modalAlreadyExist) {
        console.log("add event register");
        function listener(event) {
            // We only accept messages from ourselves
            if (event.source != window)
                return;
            if (!event.data.type)
                return;
            switch (event.data.type) {
                case "SAVE_TO_NOTION_FROM_PAGE":
                    console.log("Content script received: " + event.data.text);
                    //port.postMessage(event.data.text)
                    saveToNotion();
                    break;
                case "asyncExec":
                    try {
                        chrome.runtime.sendMessage(event.data, function (response) {
                            console.log("async exec response:", response);
                            done(response);
                            done = null;
                        });
                    }
                    catch (e) {
                        done({ success: false, message: "please reload the page" });
                    }
                    break;
            }
        }
        window.addEventListener("message", listener, false);
    }
    modal.innerHTML = `<div style="${modalContentStyle}">
    <div style="${modalInnerContentStyle}">
    <x-div style='font-size:18px; font-family:inherit !important; font-weight:bold; margin-bottom:12px'>Save.to - New Note</x-div>
    <x-div style="margin-bottom:8px; ${wrapperTextAreaStyle}"><textarea onkeyup="document.getElementById('${__saveToNotionIds.submitButton}').disabled = this.value.length == 0" style="${textAreaStyle}" id="${__saveToNotionIds.textArea}" placeholder="Enter Something..."></textarea></x-div>
    <button style="${buttonStyle}" id="${__saveToNotionIds.submitButton}" disabled onclick='window.postMessage({ type: "SAVE_TO_NOTION_FROM_PAGE", text: "Hello from the webpage!" }, "*")'>add note</button>
    <x-div style="margin-top:8px;" id="${__saveToNotionIds.statusDiv}"></x-div>
    </div>
  </x-div>`;
    const textarea = modal.querySelector("textarea");
    function autoResize() {
        this.style.height = "auto";
        this.style.height = this.scrollHeight + "px";
    }
    window.setTimeout(function () {
        document.getElementById(__saveToNotionIds.textArea).focus();
    }, 0);
    textarea.addEventListener("input", autoResize, false);
    if (needAppend)
        document.documentElement.appendChild(modal);
    //hide on change
    modal.onclick = (event) => {
        if (event.target == modal) {
            closeModal();
        }
    };
    return modal;
}
// @ts-ignore
let done = null;
function saveToNotion() {
    return __awaiter(this, void 0, void 0, function* () {
        const button = document.getElementById(__saveToNotionIds.submitButton);
        const textArea = document.getElementById(__saveToNotionIds.textArea);
        const statusDiv = document.getElementById(__saveToNotionIds.statusDiv);
        const text = textArea.value;
        statusDiv.textContent = "";
        button.textContent = "saving to notion...";
        button.style.opacity = "0.7";
        button.disabled = true;
        console.log("send message...");
        const resp = yield sendMessage({
            action: "addText",
            text,
        });
        console.log("resp", resp);
        button.textContent = "add to notion";
        button.style.opacity = "1";
        button.disabled = false;
        if (resp.success == true) {
            closeModal();
            return;
        }
        statusDiv.style.color = "red";
        statusDiv.textContent = `Error! ${resp.message || ""}`;
    });
}
// @ts-ignore
function sendMessage(data) {
    var data = Object.assign({ asyncId, type: "asyncExec" }, data);
    return new Promise((resolve) => {
        window.postMessage(data, "*");
        done = resolve;
    });
}
function modalAddNote() {
    return __awaiter(this, void 0, void 0, function* () {
        //Promise<{ canceled?: boolean; text?: string }> {
        //inject modal if not already here
        const modal = upsertModal();
        modal.style.display = "block";
        /*return new Promise((_resolve) => {
          done = (d) => _resolve({ ...(d || {}) })
        })*/
    });
}
/*
async function sendAsyncRespToBackground(promise) {
  sendMessage({ ...(await promise), end: true })
}
*/
modalAddNote();
//sendAsyncRespToBackground(modalAddNote())


/***/ })

/******/ });