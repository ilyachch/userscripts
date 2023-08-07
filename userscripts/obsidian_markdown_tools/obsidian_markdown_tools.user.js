// ==UserScript==
// @name         Obsidian Markdown tools script
// @namespace    ilyachch/userscripts
// @version      0.0.1
// @description  Tools to work with pages and Obsidian
// @author       ilyachch (https://github.com/ilyachch/userscripts)
// @homepageURL  https://github.com/ilyachch/userscripts
// @source       https://github.com/ilyachch/userscripts/blob/main/userscripts/obsidian_markdown_tools/obsidian_markdown_tools.user.js
// @supportURL   https://github.com/ilyachch/userscripts/issues
// @updateURL    https://raw.githubusercontent.com/ilyachch/userscripts/main/userscripts/obsidian_markdown_tools/obsidian_markdown_tools.user.js
// @downloadURL  https://raw.githubusercontent.com/ilyachch/userscripts/main/userscripts/obsidian_markdown_tools/obsidian_markdown_tools.user.js
// @license      MIT

// @run-at       document-end
// @match        *://*/*
// ==/UserScript==

const MENU_ID = "markdown-tools-menu";
const MENU_ITEM_CLASS = "markdown-tools-menu-item";

const css = `
#${MENU_ID} {
    position: fixed;
    z-index: 9999;
    bottom: 0;
    right: 0;
    padding: 0;
    background-color: transparent;
}


#${MENU_ID} .${MENU_ITEM_CLASS} {
    font-family: monospace;
    font-size: 14px;
    padding: 10px;
    margin: 10px;
    border: 1px solid #444;
    border-radius: 5px;
    background-color: #222;
    color: #fff;
    cursor: pointer;
    text-decoration: none;
    text-transform: uppercase;
    line-height: 1;
    font-weight: normal;
}

#${MENU_ID} .${MENU_ITEM_CLASS}:hover {
    background-color: #333;
}

#${MENU_ID} .${MENU_ITEM_CLASS}:active {
    background-color: #000;
}

`;

let style = document.createElement("style");
style.innerHTML = css;
document.head.appendChild(style);

function cleanURL(url) {
    if (typeof url !== "string") {
        throw new TypeError("URL must be a string");
    }

    const urlObject = new URL(url);
    const { origin, pathname } = urlObject;

    Array.from(urlObject.searchParams.keys()).forEach((param) => {
        if (param.startsWith("utm_")) {
            urlObject.searchParams.delete(param);
        }
    });

    return `${origin}${pathname}${urlObject.search}`;
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
}

function getLinkInMarkdownFormat() {
    let link = cleanURL(window.location.href);
    let title = document.title;
    return `[${title}](${link})`;
}

function createMenu() {
    let menu = document.createElement("div");
    menu.toggleVisibility = function () {
        if (menu.style.display === "none") {
            menu.style.display = "block";
        } else {
            menu.style.display = "none";
        }
    }
    menu.id = MENU_ID;
    menu.style.display = "none";
    document.body.appendChild(menu);
    return menu;
}



function createMenuItem(text, callback) {
    let menuItem = document.createElement("button");
    menuItem.classList.add(MENU_ITEM_CLASS);
    menuItem.innerText = text;
    menuItem.addEventListener("click", callback);
    return menuItem;
}

function init() {
    let menu = createMenu();
    menu.appendChild(
        createMenuItem("Copy link in Markdown format", () => {
            copyToClipboard(getLinkInMarkdownFormat());
        })
    );
    document.addEventListener("keydown", (event) => {
        if (event.ctrlKey && event.shiftKey && event.key === "S") {
            menu.toggleVisibility();
        }
    });
}

(function () {
    "use strict";
    if (window.self !== window.top) {
        return;
    }
    init();
})();
