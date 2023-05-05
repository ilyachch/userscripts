// ==UserScript==
// @name         Better rezka script
// @namespace    ilyachch/userscripts
// @version      0.1.0
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
    auto_next_episode();
    add_year_links();
})();

function auto_next_episode() {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === "childList") {
                const nextEpisodeLoader = document.querySelector(
                    ".b-player__next_episode_loader"
                );
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
}

function add_year_links(){
    if (!window.location.pathname.match(/\/\d{4}\//)) {
        return
    }
    const year = parseInt(window.location.pathname.match(/\d{4}/)[0]);
    const next_year = year + 1;
    const prev_year = year - 1;

    const header = document.querySelectorAll('.b-content__htitle h1')[0];

    function make_link(url, text){
        const link = document.createElement('a');
        link.style.marginLeft = '10px';
        link.href = url;
        link.innerText = text;
        return link;
    }

    const next_year_link = make_link(window.location.pathname.replace(/\d{4}\/.*/, `${next_year}/`), `${next_year}`);
    const prev_year_link = make_link(window.location.pathname.replace(/\d{4}\/.*/, `${prev_year}/`), `${prev_year}`);

    header.appendChild(prev_year_link);
    if (year != new Date().getFullYear()) {
        header.appendChild(next_year_link);
    }
}
