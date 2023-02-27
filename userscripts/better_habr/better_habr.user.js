// ==UserScript==
// @name         Better habr script
// @namespace    ilyachch/userscripts
// @version      0.1.0
// @description  Custom Script - Better habr
// @author       ilyachch (https://github.com/ilyachch/userscripts)
// @homepageURL  https://github.com/ilyachch/userscripts
// @source       https://github.com/ilyachch/userscripts/blob/main/userscripts/better_habr/better_habr.user.js
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
    makeCommentsSortable();
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
        let rating_el =
            document.querySelector(
                ".tm-article-rating span.tm-votes-lever__score-counter"
            ) ||
            document.querySelector(
                ".tm-article-rating span.tm-votes-meter__value"
            ) ||
            document.querySelector(
                ".tm-article-comments__article-body span.tm-votes-meter__value"
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
        let sign = rating.sign ? rating.sign : "";
        title_el.innerText = `(${sign}${rating.score}) ${title_el.innerText}`;
    }
}

function makeCommentsSortable() {
    function createButton() {
        const sortButton = document.createElement("button");
        sortButton.textContent = "Sort Comments";
        sortButton.addEventListener("click", sortCommentsByRating);
        sortButton.style = `-webkit-text-size-adjust: 100%;
        --font-size: 20px;
        --size: 40px;
        --border-radius: 30px;
        --placement: 25px;
        --margin: 10px;
        --swiper-theme-color: #007aff;
        --swiper-navigation-size: 44px;
        --safe-area-inset-top: env(safe-area-inset-top);
        --main-menu-height: 56px;
        transition: opacity .2s ease-in-out,color .2s ease-in-out,text-decoration .2s ease-in-out,background-color .2s ease-in-out,-webkit-text-decoration .2s ease-in-out;
        font-family: inherit;
        font-size: 100%;
        line-height: 1.15;
        margin: 0;
        overflow: visible;
        text-transform: none;
        -webkit-appearance: button;
        background: transparent;
        border: 0;
        color: #929ca5;
        display: block;
        float: right;
        cursor: pointer;
        height: 24px;
        box-sizing: initial;
        padding: 0 10px;
        quotes: "«" "»";
        outline: none;`;
        const header = document.querySelector(
            ".tm-comments-wrapper__header-aside"
        );
        header.appendChild(sortButton);
    }

    function sortCommentsByRating() {
        let container = document.querySelector(".tm-comments__tree");
        sortComments(container);
    }

    function sortComments(container) {
        let commentThreads = Array.from(
            container.querySelectorAll(":scope > section.tm-comment-thread")
        );

        let commentByRating = [];

        commentThreads.forEach((thread) => {
            let ratingEl =
                thread.querySelector(
                    ":scope > article.tm-comment-thread__comment .tm-votes-lever__score-counter"
                ) ||
                thread.querySelector(
                    ":scope > article.tm-comment-thread__comment .tm-votes-meter__value"
                );
            let rating = parseInt(ratingEl.innerHTML);
            let comment_id = parseInt(
                thread
                    .querySelector(
                        ":scope > article.tm-comment-thread__comment > div[data-comment-body]"
                    )
                    .getAttribute("data-comment-body")
            );
            commentByRating.push({ rating, thread, comment_id });
        });

        commentByRating.sort(function (a, b) {
            if (a.rating < b.rating) return 1;
            if (a.rating > b.rating) return -1;
            if (a.comment_id < b.comment_id) return -1;
            if (a.comment_id > b.comment_id) return 1;
            return 0;
        });

        commentThreads.forEach((thread) => {
            container.removeChild(thread);
        });

        commentByRating.forEach((comment) => {
            container.appendChild(comment.thread);
            let inner_contaner = comment.thread.querySelector(
                ":scope > .tm-comment-thread__children"
            );
            if (!!inner_contaner) {
                sortComments(inner_contaner);
            }
        });
    }

    setTimeout(function () {
        createButton();
    }, 1500);
}
