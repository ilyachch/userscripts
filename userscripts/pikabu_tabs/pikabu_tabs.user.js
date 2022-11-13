// ==UserScript==
// @name         Pikabu tabs
// @namespace    ilyachch/userscripts/scripts
// @version      0.0.1
// @description  Remake tabs on pikabu
// @author       ilyachch (https://github.com/ilyachch/userscripts)
// @homepageURL  https://github.com/ilyachch/userscripts
// @supportURL   https://github.com/ilyachch/userscripts/issues
// @updateURL    https://raw.githubusercontent.com/ilyachch/userscripts/main/userscripts/pikabu_tabs/pikabu_tabs.user.js
// @downloadURL  https://raw.githubusercontent.com/ilyachch/userscripts/main/userscripts/pikabu_tabs/pikabu_tabs.user.js
// @license      MIT
// @run-at       document-end
// @match        https://pikabu.ru/*
// ==/UserScript==

(function () {
    "use strict";
    let header_menu = document.querySelector(".header-menu");
    header_menu.querySelector("#menu-courses").remove();
    header_menu.appendChild(create_new_link("disputed", "Обсуждаемое"));
    header_menu.appendChild(create_new_link("most-saved", "Сохраняемое"));

    document.addEventListener("DOMSubtreeModified", function () {
        let ad_blocks = document.querySelectorAll(
            "article[data-ad-type='feed']"
        );
        for (let ad_block of ad_blocks) {
            ad_block.remove();
        }
    });
})();

function create_new_link(link, text) {
    let new_link = document.createElement("div");
    new_link.classList.add("header-menu__item");
    new_link.setAttribute("data-feed-key", link);
    let new_a = document.createElement("a");
    new_a.setAttribute("href", "/" + link);
    new_a.innerText = text;
    new_link.appendChild(new_a);
    return new_link;
}
