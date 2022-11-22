// ==UserScript==
// @name         Habr title color
// @namespace    http://tampermonkey.net/
// @version      0.3
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
    let rating = get_rating();
    setTimeout(function () {
        colorize_header(rating);
        set_title(rating);
    }, 500);
})();

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
    let title_block = document.querySelector("h1.tm-article-snippet__title");
    let title_el = document.querySelector("h1.tm-article-snippet__title span");

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
