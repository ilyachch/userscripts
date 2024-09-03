// ==UserScript==
// @name         Markdown tools script
// @namespace    ilyachch/userscripts
// @version      0.4.1
// @description  Tools to work with pages and Obsidian
// @author       ilyachch (https://github.com/ilyachch/userscripts)
// @homepageURL  https://github.com/ilyachch/userscripts
// @source       https://github.com/ilyachch/userscripts/blob/main/userscripts/markdown_tools/markdown_tools.user.js
// @supportURL   https://github.com/ilyachch/userscripts/issues
// @updateURL    https://raw.githubusercontent.com/ilyachch/userscripts/main/userscripts/markdown_tools/markdown_tools.user.js
// @downloadURL  https://raw.githubusercontent.com/ilyachch/userscripts/main/userscripts/markdown_tools/markdown_tools.user.js
// @license      MIT

// @grant        GM_addStyle
// @run-at       document-end
// @match        *://*/*
// @icon         https://upload.wikimedia.org/wikipedia/commons/4/48/Markdown-mark.svg
// ==/UserScript==

const STYLE = `
#markdown-tools-menu {
    position: fixed;
    z-index: 9999;
    bottom: 0;
    right: 0;
    margin: 10px;
    background-color: transparent;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 10px;
}

#markdown-tools-menu.hidden {
    display: none;
}

#markdown-tools-menu .markdown-tools-menu-item {
    font-family: monospace;
    font-size: 14px;
    padding: 10px;
    margin: 0;
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

#markdown-tools-menu .markdown-tools-menu-item:hover {
    background-color: #333;
}

#markdown-tools-menu .markdown-tools-menu-item:active {
    background-color: #000;
}
`;

function removeGetParams(url, params) {
    // if url is not string - raise error
    if (typeof url !== "string") {
        throw new Error("url should be a string");
    }

    let urlObject = new URL(url);

    let getKeys = Array.from(urlObject.searchParams.keys());

    let paramsToRemove = [];

    for (let param of params) {
        // if param is *, remove all params
        // if param ends with *, remove all params that start with it
        // if param starts with *, remove all params that end with it
        // if param starts and ends with *, remove all params that contain it
        // else if param is in getKeys, remove it
        if (param === "*") {
            paramsToRemove.push(...getKeys);
        } else if (param.endsWith("*")) {
            paramsToRemove.push(
                ...getKeys.filter((key) => key.startsWith(param.slice(0, -1)))
            );
        } else if (param.startsWith("*")) {
            paramsToRemove.push(
                ...getKeys.filter((key) => key.endsWith(param.slice(1)))
            );
        } else if (param.startsWith("*") && param.endsWith("*")) {
            paramsToRemove.push(
                ...getKeys.filter((key) => key.includes(param.slice(1, -1)))
            );
        } else if (getKeys.includes(param)) {
            paramsToRemove.push(param);
        }
    }

    paramsToRemove.forEach((param) => urlObject.searchParams.delete(param));

    return urlObject.toString();
}

class MenuOption {
    static className = "markdown-tools-menu-item";

    className;
    label;

    constructor() {}

    createElement() {
        const menuItem = document.createElement("button");
        menuItem.classList.add(this.className);
        menuItem.innerText = this.label;
        menuItem.addEventListener("click", this.doAction);
        return menuItem;
    }

    static show() {
        return true;
    }

    doAction() {
        return;
    }
}

class CopyLinkInMarkdownFormatMenuOption extends MenuOption {
    static label = "Copy link in Markdown format";

    constructor() {
        super();
        this.className = MenuOption.className;
        this.label = CopyLinkInMarkdownFormatMenuOption.label;
    }

    doAction() {
        const clearPageUrl = removeGetParams(window.location.href, ["utm_*"]);

        const markdownLink = `[${document.title}](${clearPageUrl})`;

        navigator.clipboard.writeText(markdownLink);
    }
}

class CopyYoutubeLinkInMarkdownFormatMenuOption extends MenuOption {
    static label = "Copy Youtube link in Markdown format";

    constructor() {
        super();
        this.className = MenuOption.className;
        this.label = CopyYoutubeLinkInMarkdownFormatMenuOption.label;
    }

    static show() {
        const urlObject = new URL(window.location.href);
        return urlObject.hostname === "www.youtube.com";
    }

    doAction() {
        const urlObject = new URL(window.location.href);

        let paramsToRemove = ["utm_*"];

        if (urlObject.pathname === "/watch") {
            paramsToRemove.push(...["list", "index", "t"]);
        } else if (urlObject.pathname === "/playlist") {
            paramsToRemove.push(...["t", "index"]);
        }

        console.log(paramsToRemove);

        const cleanPageUrl = removeGetParams(
            window.location.href,
            paramsToRemove
        );

        let documentTitle = document.title;
        if (documentTitle.includes(" - YouTube")) {
            documentTitle = documentTitle.replace(" - YouTube", "");
        }
        documentTitle = documentTitle.replace(/^\(\d+\)\s/, "");

        const markdownLink = `[${documentTitle}](${cleanPageUrl})`;

        navigator.clipboard.writeText(markdownLink);
    }
}

class HideMenuOption extends MenuOption {
    static label = "❌";

    constructor() {
        super();
        this.className = MenuOption.className;
        this.label = HideMenuOption.label;
    }

    doAction() {
        let menu_element = document.getElementById(MarkdownToolsMenu.elementId);
        menu_element.toggleVisibility();
    }
}

class MarkdownToolsMenu {
    static elementId = "markdown-tools-menu";

    static menuOptions = [
        CopyYoutubeLinkInMarkdownFormatMenuOption,
        CopyLinkInMarkdownFormatMenuOption,
        HideMenuOption,
    ];

    static init() {
        function showOnKeyPress() {
            let menuElement = document.getElementById(
                MarkdownToolsMenu.elementId
            );

            if (menuElement === null) {
                menuElement = MarkdownToolsMenu.create();
            }

            menuElement.toggleVisibility();
        }

        document.addEventListener("keydown", (event) => {
            if (
                navigator.userAgent.indexOf("Mac OS") != -1 &&
                event.metaKey &&
                event.shiftKey &&
                event.key === "S"
            ) {
                showOnKeyPress();
            } else if (event.ctrlKey && event.shiftKey && event.key === "S") {
                showOnKeyPress();
            }
        });
    }

    static create() {
        const menu = new MarkdownToolsMenu();
        const menuElement = menu.createElement();
        document.body.appendChild(menuElement);
        return menuElement;
    }

    constructor() {
        this.elementId = MarkdownToolsMenu.elementId;
        this.menuOptions = MarkdownToolsMenu.menuOptions;
    }

    createElement() {
        const menuElement = document.createElement("div");
        menuElement.id = this.elementId;
        menuElement.classList.add("hidden");
        this.menuOptions.forEach((menuOption) => {
            if (!menuOption.show()) {
                return;
            }
            const menuOptionItem = new menuOption();
            const menuOptionItemElement = menuOptionItem.createElement();
            menuElement.appendChild(menuOptionItemElement);
        });
        menuElement.toggleVisibility = this.toggleVisibility;
        return menuElement;
    }

    toggleVisibility() {
        this.classList.toggle("hidden");
    }
}

(function () {
    "use strict";

    if (window.self !== window.top) {
        return;
    }

    GM_addStyle(STYLE);

    MarkdownToolsMenu.init();
})();
