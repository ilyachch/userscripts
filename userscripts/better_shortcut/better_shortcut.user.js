// ==UserScript==
// @name         Better Shortcut script
// @namespace    ilyachch/userscripts
// @version      0.1.0
// @description  Custom Script - Better Shortcut
// @author       ilyachch (https://github.com/ilyachch/userscripts)
// @homepageURL  https://github.com/ilyachch/userscripts
// @source       https://github.com/ilyachch/userscripts/blob/main/userscripts/better_shortcut/better_shortcut.user.js
// @supportURL   https://github.com/ilyachch/userscripts/issues
// @updateURL    https://raw.githubusercontent.com/ilyachch/userscripts/main/userscripts/better_shortcut/better_shortcut.user.js
// @downloadURL  https://raw.githubusercontent.com/ilyachch/userscripts/main/userscripts/better_shortcut/better_shortcut.user.js
// @license      MIT

// @run-at       document-end
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @match        https://app.shortcut.com/*
// @icon         https://app.shortcut.com/static/images/favicon-2ac64967a4.svg
// ==/UserScript==

GM_registerMenuCommand("Set Target Branch", () => {
    const branch = prompt("Enter the target branch:", GM_getValue("targetBranch", "main"));
    if (branch) {
        GM_setValue("targetBranch", branch);
        alert(`Target branch set to ${branch}`);
    }
});

(function () {
    "use strict";

    const targetBranch = GM_getValue("targetBranch", "main");

    document.addEventListener('mouseover', function(event) {
        const openPRButton = event.target.closest('a.action.micro.flat-white[target="_blank"][rel="noopener noreferrer"]');
        if (openPRButton && openPRButton.textContent.includes('Open PR')) {
            const existingNewButton = document.querySelector('a.action.micro.flat-white[target="_blank"][rel="noopener noreferrer"]:not([href="' + openPRButton.href + '"])');
            if (!existingNewButton) {
                const newButton = openPRButton.cloneNode(true);
                const url = new URL(openPRButton.href);
                const branchName = url.pathname.split('/compare/')[1].split('?')[0];
                newButton.href = url.toString().replace(`/compare/${branchName}`, `/compare/${targetBranch}...${branchName}`);
                newButton.textContent = `Open PR to ${targetBranch}`;
                openPRButton.insertAdjacentElement('afterend', newButton);
            }
        }
    });
})();
