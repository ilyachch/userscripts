// ==UserScript==
// @name         Better habr script
// @namespace    ilyachch/userscripts
// @version      0.0.1
// @description  Custom Script - Better habr
// @author       ilyachch (https://github.com/ilyachch/userscripts)
// @homepageURL  https://github.com/ilyachch/userscripts
// @source       https://github.com/ilyachch/userscripts/blob/main/better_habr/better_habr.user.js
// @supportURL   https://github.com/ilyachch/userscripts/issues
// @updateURL    https://raw.githubusercontent.com/ilyachch/userscripts/main/userscripts/better_habr/better_habr.user.js
// @downloadURL  https://raw.githubusercontent.com/ilyachch/userscripts/main/userscripts/better_habr/better_habr.user.js
// @license      MIT
// @run-at       document-end
// @match        https://habr.com/*/post/*/*
// @match        https://habr.com/*/blog/*/*
// @match        https://habr.com/*/news/*/*
// @match        https://habr.com/**/company/**/**/*
// ==/UserScript==

(function () {
    "use strict";
    ExposeRating();
})();

function ExposeRating() {
    function Rating(
        score,
        side,
        color = null,
        sign = null,
        should_colorize = false
    ) {
        this.score = score;
        this.side = side;
        this.color = color;
        this.sign = sign;
        this.should_colorize = should_colorize;
    }

    let rating = get_rating();
    setTimeout(function () {
        colorize_header(rating);
        set_title(rating);
    }, 500);

    function get_rating() {
        let rating_el = document.querySelector(
            'span[data-test-id="votes-score-counter"]'
        );
        if (rating_el.innerText.startsWith("+")) {
            return new Rating(
                rating_el.innerText.slice(1),
                "positive",
                "#7aa600",
                "+",
                true
            );
        } else if (rating_el.innerText.startsWith("-")) {
            return new Rating(
                rating_el.innerText.slice(1),
                "negative",
                "#d04e4e",
                "-",
                true
            );
        } else {
            return new Rating(0, "neutral");
        }
    }

    function colorize_header(rating) {
        let title_block = document.querySelector(
            "h1.tm-article-snippet__title"
        );
        let title_el = document.querySelector(
            "h1.tm-article-snippet__title span"
        );

        if (!rating.should_colorize || !title_block) {
            return;
        }
        if (!title_block.querySelector(".header_rating")) {
            title_block.style.color = rating.color;
            title_el.innerHTML += `<span style="color: ${rating.color}" class="header_rating"> (${rating.sign}${rating.score})</span>`;
        }
    }

    function set_title(rating) {
        let title_el = document.querySelector("head title");
        title_el.innerText = `(${rating.sign}${rating.score}) ${title_el.innerText}`;
    }
}
