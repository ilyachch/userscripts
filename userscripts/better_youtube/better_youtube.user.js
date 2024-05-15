// ==UserScript==
// @name         Better Youtube script
// @namespace    ilyachch/userscripts
// @version      0.0.2
// @description  Custom Script - Better Youtube
// @author       ilyachch (https://github.com/ilyachch/userscripts)
// @homepageURL  https://github.com/ilyachch/userscripts
// @source       https://github.com/ilyachch/userscripts/blob/main/userscripts/better_youtube/better_youtube.user.js
// @supportURL   https://github.com/ilyachch/userscripts/issues
// @updateURL    https://raw.githubusercontent.com/ilyachch/userscripts/main/userscripts/better_youtube/better_youtube.user.js
// @downloadURL  https://raw.githubusercontent.com/ilyachch/userscripts/main/userscripts/better_youtube/better_youtube.user.js
// @license      MIT

// @run-at       document-end
// @match        *://*.youtube.com/*
// @grant        GM_addStyle
// @icon         https://www.youtube.com/s/desktop/0646520c/img/favicon_144x144.png
// ==/UserScript==

// https://greasyfork.org/en/scripts/372780-stop-youtube-autoplay/code

const STYLE = `
#contents ytd-item-section-renderer:has(video)  {
}
`;

function stopVideoOnChannelPage() {
    function stopVideoOnChannelPage() {
        const pageIsChannelHome = document.querySelector(
            "ytd-item-section-renderer"
        );
        const video = document.querySelector(
            "#contents ytd-item-section-renderer video"
        );

        const videoWrapper = document.querySelector(".html5-video-player");

        if (pageIsChannelHome && video) {
            const q = videoWrapper.pauseVideo();
        }
    }

    function monitorVideoIsStopped() {
        const interval = setInterval(() => {
            stopVideoOnChannelPage();
        });
        document.addEventListener(
            "mousedown",
            () => {
                if (interval) {
                    clearInterval(interval);
                }
            },
            { once: true }
        );
        document.addEventListener(
            "keydown",
            (e) => {
                if (interval) {
                    clearInterval(interval);
                }
            },
            { once: true }
        );
    }

    window.addEventListener("yt-navigate-finish", () => {
        monitorVideoIsStopped();
    });
}

(function () {
    "use strict";

    stopVideoOnChannelPage();
    GM_addStyle(STYLE);
})();
