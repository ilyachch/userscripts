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

class Styles {
    constructor(id, itemClass) {
        this.id = id;
        this.itemClass = itemClass;
        this.create();
    }

    create() {
        const css = `
            #${this.id} {
                position: fixed;
                z-index: 9999;
                bottom: 0;
                right: 0;
                padding: 0;
                background-color: transparent;
            }
            #${this.id} .${this.itemClass} {
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
            #${this.id} .${this.itemClass}:hover {
                background-color: #333;
            }
            #${this.id} .${this.itemClass}:active {
                background-color: #000;
            }
        `;

        const style = document.createElement("style");
        style.innerHTML = css;
        document.head.appendChild(style);
    }
}

class MenuItem {
    constructor(itemClass, text, callback) {
        this.itemClass = itemClass;
        this.text = text;
        this.callback = callback;
        return this.create();
    }

    create() {
        const menuItem = document.createElement("button");
        menuItem.classList.add(this.itemClass);
        menuItem.innerText = this.text;
        menuItem.addEventListener("click", this.callback);
        return menuItem;
    }
}

class Menu {
    constructor(id) {
        this.id = id;
        return this.create();
    }

    create() {
        const menu = document.createElement("div");
        menu.id = this.id;
        menu.style.display = "none";
        menu.toggleVisibility = () =>
            (menu.style.display =
                menu.style.display === "none" ? "block" : "none");
        document.body.appendChild(menu);
        return menu;
    }
}

(function () {
    "use strict";

    if (window.self !== window.top) {
        return;
    }

    const MENU_ID = "markdown-tools-menu";
    const MENU_ITEM_CLASS = "markdown-tools-menu-item";

    new Styles(MENU_ID, MENU_ITEM_CLASS);

    const cleanURL = (url) => {
        const urlObject = new URL(url);
        Array.from(urlObject.searchParams.keys())
            .filter((param) => param.startsWith("utm_"))
            .forEach((param) => urlObject.searchParams.delete(param));
        return urlObject.toString();
    };

    const copyToClipboard = (text) => navigator.clipboard.writeText(text);

    const getLinkInMarkdownFormat = () =>
        `[${document.title}](${cleanURL(window.location.href)})`;

    const menu = new Menu(MENU_ID);

    menu.appendChild(
        new MenuItem(MENU_ITEM_CLASS, "Copy link in Markdown format", () =>
            copyToClipboard(getLinkInMarkdownFormat()),
        ),
    );

    document.addEventListener("keydown", (event) => {
        if (event.ctrlKey && event.shiftKey && event.key === "S") {
            menu.toggleVisibility();
        }
    });
})();
