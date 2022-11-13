// ==UserScript==
// @name         Habr title color
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  color article title based on article rating
// @author       Ilya Chichak
// @match        https://habr.com/*/post/*/*
// @match        https://habr.com/*/blog/*/*
// @match        https://habr.com/*/news/*/*
// @match        https://habr.com/**/company/**/**/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
    "use strict";
    setTimeout(colorize_header, 500);
})();

function colorize_header() {
    let title_block = document.querySelector("h1.tm-article-snippet__title");
    let title_el = document.querySelector("h1.tm-article-snippet__title span");
    let rating_el = document.querySelector(
        'span[data-test-id="votes-score-counter"]'
    );

    let good_color = "#7aa600";
    let bad_color = "#d04e4e";

    if (title_block && rating_el) {
        let accent_color = null;
        if (rating_el.innerText.startsWith("+")) {
            accent_color = good_color;
        } else if (rating_el.innerText.startsWith("-")) {
            accent_color = bad_color;
        }
        if (!!accent_color) {
            title_block.style.color = accent_color;
            if (!title_block.querySelector(".header_rating")) {
                title_el.innerHTML += `<span style="color: ${accent_color}" class="header_rating"> (${rating_el.innerText})</span>`;
            }
        }
    }
}
