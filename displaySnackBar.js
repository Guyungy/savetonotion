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
/******/ 	return __webpack_require__inject_script_fix(__webpack_require__.s = 19);
/******/ })
/************************************************************************/
/******/ ({

/***/ 19:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const snackbarStyle = `
/* The snackbar - position it at the bottom and in the middle of the screen */
#save_to_notion_snackbar {
  all: initial;
  font-family: Roboto, Helvetica, Arial, sans-serif;
  font-size: 14px;
  visibility: hidden; /* Hidden by default. Visible on click */
  min-width: 200px; /* Set a default minimum width */
  margin-left: -125px; /* Divide value of min-width by 2 */
  background-color: #333; /* Black background color */
  color: #fff; /* White text color */
  text-align: center; /* Centered text */
  border-radius: 2px; /* Rounded borders */
  padding: 14px; /* Padding */
  position: fixed; /* Sit on top of the screen */
  z-index: 1000; /* Add a z-index if needed */
  left: 50%; /* Center the snackbar */
  bottom: 30px; /* 30px from the bottom */
  -webkit-transition: background-color 100ms linear;
  -ms-transition: background-color 100ms linear;
  transition: background-color 100ms linear;
}

/* Show the snackbar when clicking on a button (class added with JavaScript) */
#save_to_notion_snackbar.show {
  visibility: visible; /* Show the snackbar */
  /* Add animation: Take 0.5 seconds to fade in and out the snackbar.
  However, delay the fade out process for 2.5 seconds */
  /*-webkit-animation: save_to_notion_fadein 0.5s, save_to_notion_fadeout 0.5s 2.5s;
  animation: fadein 0.5s, save_to_notion_fadeout 0.5s 2.5s;*/
}

/* Animations to fade the snackbar in and out */
@-webkit-keyframes save_to_notion_fadein {
  from {bottom: 0; opacity: 0;}
  to {bottom: 30px; opacity: 1;}
}

@keyframes save_to_notion_fadein {
  from {bottom: 0; opacity: 0;}
  to {bottom: 30px; opacity: 1;}
}

@-webkit-keyframes save_to_notion_fadeout {
  from {bottom: 30px; opacity: 1;}
  to {bottom: 0; opacity: 0;}
}

@keyframes save_to_notion_fadeout {
  from {bottom: 30px; opacity: 1;}
  to {bottom: 0; opacity: 0;}
}
`;
class Snackbar {
    constructor() {
        this.snackbarEl = document.getElementById("save_to_notion_snackbar");
        if (!this.snackbarEl) {
            {
                this.snackbarEl = document.createElement("div");
                this.snackbarEl.id = "save_to_notion_snackbar";
                this.snackbarEl.innerHTML = ``;
                document.documentElement.appendChild(this.snackbarEl);
            }
            {
                var css = document.createElement("style");
                css.type = "text/css";
                css.appendChild(document.createTextNode(snackbarStyle));
                document.getElementsByTagName("head")[0].appendChild(css);
            }
        }
        this.snackbarEl.className.replace("show", "");
        /*{
          this.snackbarEl.className = "show"
          if (lastTimeout) clearTimeout(lastTimeout)
          // After 3 seconds, remove the show class from DIV
          lastTimeout = setTimeout(function () {
            this.snackbarEl.className = this.snackbarEl.className.replace(
              "show",
              ""
            )
            lastTimeout = null
          }, 3000)
        }*/
    }
    __show(timeout) {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        this.snackbarEl.classList.add("show");
        this.timeout = setTimeout(() => {
            this.snackbarEl.classList.remove("show");
            this.snackbarEl.style.backgroundColor = "#333"; //black
        }, timeout);
    }
    setLoadingStatus(msg, timeout) {
        this.snackbarEl.innerText = "Saving Highlight to Notion...";
        this.snackbarEl.style.backgroundColor = "#333"; //black
        this.__show(timeout);
    }
    setFailStatus(msg, timeout, tutorial) {
        this.snackbarEl.innerHTML = `Error: ${msg} ${tutorial
            ? `save page with the popup first, <a href='https://www.notion.so/a838b2ae22a7488b95a6b324819a1aa4'  style='font-weight: bold; color:white !important; text-decoration: underline !important;' target="_blank">see tutorial</a>`
            : ""}`;
        this.snackbarEl.style.backgroundColor = "#f44336"; //red
        this.__show(timeout);
    }
    setSuccessStatus(msg, timeout) {
        this.snackbarEl.innerText = `${msg}`;
        this.snackbarEl.style.backgroundColor = "#4caf50"; //green
        this.__show(timeout);
    }
}
const snackbar = new Snackbar();
switch (action) {
    case "loading":
        snackbar.setLoadingStatus(msg, timeout);
        break;
    case "fail":
        snackbar.setFailStatus(msg, timeout, tutorial);
        break;
    case "success":
        snackbar.setSuccessStatus(msg, timeout);
        break;
}


/***/ })

/******/ });