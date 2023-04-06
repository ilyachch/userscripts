// ==UserScript==
// @name         Better rezka script
// @namespace    ilyachch/userscripts
// @version      0.0.1
// @description  Custom Script - better_rezka
// @author       ilyachch (https://github.com/ilyachch/userscripts)
// @homepageURL  https://github.com/ilyachch/userscripts
// @source       https://github.com/ilyachch/userscripts/blob/main/userscripts/better_rezka/better_rezka.user.js
// @supportURL   https://github.com/ilyachch/userscripts/issues
// @updateURL    https://raw.githubusercontent.com/ilyachch/userscripts/main/userscripts/better_rezka/better_rezka.user.js
// @downloadURL  https://raw.githubusercontent.com/ilyachch/userscripts/main/userscripts/better_rezka/better_rezka.user.js
// @license      MIT

// @run-at       document-end
// @match        *://rezka.ag/*/*
// @icon         https://static.hdrezka.ac/templates/hdrezka/images/favicon.ico
// ==/UserScript==

(function () {
    "use strict";

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === "childList") {
                const nextEpisodeLoader = document.querySelector(".b-player__next_episode_loader");
                if (nextEpisodeLoader) {
                    setTimeout(() => {
                        nextEpisodeLoader.click();
                    }, 500);
                }
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
})();
