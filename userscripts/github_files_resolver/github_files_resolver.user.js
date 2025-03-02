// ==UserScript==
// @name         Github files resolver script
// @namespace    ilyachch/userscripts
// @version      1.2.0
// @description  Mark files as viewed by path on Github PR page with collapse/expand functionality and improved UI layout
// @author       ilyachch
// @homepageURL  https://github.com/ilyachch/userscripts
// @source       https://github.com/ilyachch/userscripts/blob/main/userscripts/github_files_resolver/github_files_resolver.user.js
// @supportURL   https://github.com/ilyachch/userscripts/issues
// @updateURL    https://raw.githubusercontent.com/ilyachch/userscripts/main/userscripts/github_files_resolver/github_files_resolver.user.js
// @downloadURL  https://raw.githubusercontent.com/ilyachch/userscripts/main/userscripts/github_files_resolver/github_files_resolver.user.js
// @license      MIT
//
// @run-at       document-end
// @match        https://github.com/*
// @icon         https://github.githubassets.com/favicons/favicon.png
// ==/UserScript==

(function () {
    "use strict";

    const MENU_ID = "github-files-resolver-menu";
    const PANEL_ID = "gfr-panel";
    const FOOTER_ID = "gfr-footer";
    const TOGGLE_ID = "gfr-toggle";
    const SELECTOR_FILE_LINK = "a.Truncate-text";
    const SELECTOR_FILE_HEADER = ".file-header";
    const SELECTOR_REVIEWED_CHECKBOX = ".js-reviewed-checkbox";
    const SELECTOR_COLLAPSE_TOGGLE = "button.js-details-target";

    const css = `
#${MENU_ID} {
    --width: 250px;
    --default-gap: 10px;
    --row-height: 36px;
    --font-size: 14px;


    position: fixed;
    bottom: 0;
    right: 0;
    margin: var(--default-gap);
    z-index: 9999;
    background: transparent;
    display: flex;
    flex-direction: column;
    gap: var(--default-gap);
    width: var(--width);
}

#${MENU_ID} #${FOOTER_ID} {
    width: 100%;
    overflow: hidden;
}

#${MENU_ID} #${TOGGLE_ID} {
    float: right;
    font-family: monospace;
    font-size: var(--font-size);
    padding: 10px;
    border: 1px solid #444;
    border-radius: 5px;
    background-color: #222;
    color: #fff;
    cursor: pointer;
    text-transform: uppercase;
    line-height: 1;
    text-align: center;
}

#${MENU_ID} #${PANEL_ID} {
    background-color: transparent;
    flex-direction: column;
    gap: var(--default-gap);
}

#${MENU_ID} #gfr-input {
    font-family: monospace;
    font-size: var(--font-size);
    height: var(--row-height);
    padding: 5px;
    border: 1px solid #444;
    border-radius: 5px;
    background-color: #222;
    color: #fff;
    width: 100%;
    box-sizing: border-box;
}

#${MENU_ID} .gfr-menu-row {
    height: var(--row-height);
}

#${MENU_ID} .gfr-menu-row.gfr-menu-buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--default-gap);
}

#${MENU_ID} .gfr-menu-item {
    font-family: monospace;
    font-size: var(--font-size);
    padding: 10px;
    border: 1px solid #444;
    border-radius: 5px;
    background-color: #222;
    color: #fff;
    cursor: pointer;
    text-decoration: none;
    text-transform: uppercase;
    line-height: 1;
    text-align: center;
}
#${MENU_ID} .gfr-menu-item:hover {
    background-color: #333;
}
#${MENU_ID} .gfr-menu-item:active {
    background-color: #000;
}
    `;
    const style = document.createElement("style");
    style.innerHTML = css;
    document.head.appendChild(style);

    function escapeRegexExceptAsterisk(str) {
        return str.replace(/([.+?^${}()|[\]\\])/g, "\\$1");
    }

    function matchesPattern(path, pattern) {
        if (!pattern) return false;
        const escaped = escapeRegexExceptAsterisk(pattern);
        const regexStr = escaped.replace(/\*/g, ".*?");
        try {
            const re = new RegExp(regexStr);
            return re.test(path);
        } catch (e) {
            console.error("Invalid regex pattern: " + regexStr, e);
            return false;
        }
    }

    function checkFile(fileHeader) {
        const checkbox = fileHeader.querySelector(SELECTOR_REVIEWED_CHECKBOX);
        if (checkbox && !checkbox.checked) {
            checkbox.click();
        }
    }

    function uncheckFile(fileHeader) {
        const checkbox = fileHeader.querySelector(SELECTOR_REVIEWED_CHECKBOX);
        if (checkbox && checkbox.checked) {
            checkbox.click();
        }
    }

    function processReviewedFiles(shouldCheck) {
        const pattern = document.getElementById("gfr-input").value;
        document.querySelectorAll(SELECTOR_FILE_LINK).forEach((item) => {
            const filePath = item.innerText;
            if (matchesPattern(filePath, pattern)) {
                const fileHeader = item.closest(SELECTOR_FILE_HEADER);
                if (fileHeader) {
                    shouldCheck
                        ? checkFile(fileHeader)
                        : uncheckFile(fileHeader);
                }
            }
        });
    }

    function collapseFile(fileHeader) {
        const toggle = fileHeader.querySelector(SELECTOR_COLLAPSE_TOGGLE);
        if (toggle && toggle.getAttribute("aria-expanded") === "true") {
            toggle.click();
        }
    }

    function expandFile(fileHeader) {
        const toggle = fileHeader.querySelector(SELECTOR_COLLAPSE_TOGGLE);
        if (toggle && toggle.getAttribute("aria-expanded") === "false") {
            toggle.click();
        }
    }

    function processCollapseFiles(shouldCollapse) {
        const pattern = document.getElementById("gfr-input").value;
        document.querySelectorAll(SELECTOR_FILE_LINK).forEach((item) => {
            const filePath = item.innerText;
            if (matchesPattern(filePath, pattern)) {
                const fileHeader = item.closest(SELECTOR_FILE_HEADER);
                if (fileHeader) {
                    shouldCollapse
                        ? collapseFile(fileHeader)
                        : expandFile(fileHeader);
                }
            }
        });
    }

    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    function savePattern() {
        const pattern = document.getElementById("gfr-input").value;
        localStorage.setItem("gfr-input-pattern", pattern);
    }

    function loadPattern() {
        return localStorage.getItem("gfr-input-pattern") || "";
    }

    function createMenu() {
        if (document.getElementById(MENU_ID)) return;

        const menu = document.createElement("div");
        menu.id = MENU_ID;

        const footer = document.createElement("div");
        footer.id = FOOTER_ID;

        const toggleButton = document.createElement("button");
        toggleButton.id = TOGGLE_ID;
        toggleButton.className = "gfr-menu-item";

        toggleButton.textContent = "👁";
        toggleButton.addEventListener("click", () => {
            const panel = document.getElementById(PANEL_ID);
            if (panel.style.display === "none") {
                panel.style.display = "flex";
                toggleButton.textContent = "👁";
                localStorage.setItem("gfr-menu-state", "expanded");
            } else {
                panel.style.display = "none";
                toggleButton.textContent = "🙈";
                localStorage.setItem("gfr-menu-state", "collapsed");
            }
        });
        footer.appendChild(toggleButton);

        const panel = document.createElement("div");
        panel.id = PANEL_ID;

        const savedState = localStorage.getItem("gfr-menu-state");
        if (savedState === "collapsed") {
            panel.style.display = "none";
            toggleButton.textContent = "🙈";
        } else {
            panel.style.display = "flex";
            toggleButton.textContent = "👁";
        }

        const filterRow = document.createElement("div");
        filterRow.classList.add("gfr-menu-row");
        filterRow.id = "gfr-filter-row";

        const input = document.createElement("input");
        input.type = "text";
        input.id = "gfr-input";
        input.placeholder = "Enter path with * (example: */tests/*)";
        input.value = loadPattern();
        input.addEventListener("input", debounce(savePattern, 300));
        filterRow.appendChild(input);
        panel.appendChild(filterRow);

        const reviewRow = document.createElement("div");
        reviewRow.classList.add("gfr-menu-row", "gfr-menu-buttons");
        reviewRow.id = "gfr-review-row";

        const checkButton = document.createElement("button");
        checkButton.className = "gfr-menu-item";
        checkButton.textContent = "CHECK";
        checkButton.addEventListener("click", () => processReviewedFiles(true));

        const uncheckButton = document.createElement("button");
        uncheckButton.className = "gfr-menu-item";
        uncheckButton.textContent = "UNCHECK";
        uncheckButton.addEventListener("click", () =>
            processReviewedFiles(false),
        );

        reviewRow.appendChild(checkButton);
        reviewRow.appendChild(uncheckButton);
        panel.appendChild(reviewRow);

        const collapseRow = document.createElement("div");
        collapseRow.classList.add("gfr-menu-row", "gfr-menu-buttons");
        collapseRow.id = "gfr-collapse-row";

        const collapseButton = document.createElement("button");
        collapseButton.className = "gfr-menu-item";
        collapseButton.textContent = "COLLAPSE";
        collapseButton.addEventListener("click", () =>
            processCollapseFiles(true),
        );

        const expandButton = document.createElement("button");
        expandButton.className = "gfr-menu-item";
        expandButton.textContent = "EXPAND";
        expandButton.addEventListener("click", () =>
            processCollapseFiles(false),
        );

        collapseRow.appendChild(collapseButton);
        collapseRow.appendChild(expandButton);
        panel.appendChild(collapseRow);

        menu.appendChild(panel);
        menu.appendChild(footer);
        document.body.appendChild(menu);
    }

    function updateReviewRowVisibility() {
        const reviewRow = document.getElementById("gfr-review-row");
        if (document.querySelector(SELECTOR_REVIEWED_CHECKBOX)) {
            reviewRow.style.display = "grid";
        } else {
            reviewRow.style.display = "none";
        }
    }

    function setupMutationObserver() {
        const observer = new MutationObserver(() => {
            const fileHeaders = document.querySelectorAll(SELECTOR_FILE_HEADER);
            if (fileHeaders.length > 0) {
                if (!document.getElementById(MENU_ID)) {
                    createMenu();
                }
                updateReviewRowVisibility();
            } else {
                const menu = document.getElementById(MENU_ID);
                if (menu) {
                    menu.remove();
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    setupMutationObserver();
})();
