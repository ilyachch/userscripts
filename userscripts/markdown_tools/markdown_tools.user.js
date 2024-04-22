// ==UserScript==
// @name         Markdown tools script
// @namespace    ilyachch/userscripts
// @version      0.2.0
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
    padding: 0;
    background-color: transparent;
}
#markdown-tools-menu .markdown-tools-menu-item {
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
#markdown-tools-menu .markdown-tools-menu-item:hover {
    background-color: #333;
}
#markdown-tools-menu .markdown-tools-menu-item:active {
    background-color: #000;
}
`;

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
        const urlObject = new URL(window.location.href);
        Array.from(urlObject.searchParams.keys())
            .filter((param) => param.startsWith("utm_"))
            .forEach((param) => urlObject.searchParams.delete(param));
        const currentPageUrl = urlObject.toString();

        const markdownLink = `[${document.title}](${currentPageUrl})`;

        navigator.clipboard.writeText(markdownLink);
    }
}

class MarkdownToolsMenu {
    static elementId = "markdown-tools-menu";

    static menuOptions = [CopyLinkInMarkdownFormatMenuOption];

    static init() {
        document.addEventListener("keydown", (event) => {
            if (event.ctrlKey && event.shiftKey && event.key === "S") {
                let menuElement = document.getElementById(MarkdownToolsMenu.elementId);

                if (menuElement === null) {
                    menuElement = MarkdownToolsMenu.create();
                }

                menuElement.toggleVisibility();
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
        menuElement.style.display = "none";
        console.log(this.menuOptions);
        this.menuOptions.forEach((menuOption) => {
            const menuOptionItem = new menuOption();
            const menuOptionItemElement = menuOptionItem.createElement();
            menuElement.appendChild(menuOptionItemElement);
        });
        menuElement.toggleVisibility = this.toggleVisibility;
        return menuElement;
    }

    toggleVisibility() {
        this.style.display = this.style.display === "none" ? "block" : "none";
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
