// ==UserScript==
// @name         Better habr script
// @namespace    ilyachch/userscripts
// @version      0.4.2
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
// @match        https://habr.com/*/articles/*/*
// @match        https://habr.com/**/company/**/**/*

// @grant        GM_addStyle
// @icon         https://assets.habr.com/habr-web/img/favicons/apple-touch-icon-76.png
// ==/UserScript==

const STYLE = `
.tm-comment-thread{
    border-left: solid 5px grey;
    margin: 0 0 0 5px;
    padding-top: 10px;
}
.tm-comment-thread__children{
    padding: 0;
}
button.tm-comment-thread__breadcrumbs{
    width: 40px;
    background-image: none !important;
}
.tm-comment-thread__circle{
    right: 16px;
}
div[data-comment-body]{
    margin: 0 0 0 24px;
}
`;

GM_addStyle(STYLE);

(function () {
    "use strict";
    ExposeRating();
    makeCommentsSortable();
    // improveCommentsVisibility();
})();

function ExposeRating() {
    function Rating(
        score,
        side,
        color = null,
        sign = null,
        should_colorize = false,
    ) {
        this.score = score;
        this.side = side;
        this.color = color;
        this.sign = sign;
        this.should_colorize = should_colorize;
    }

    let rating = get_rating();
    setInterval(() => {
        colorize_header(rating);
        set_title(rating);
    }, 1000);

    function get_rating() {
        let rating_el =
            document.querySelector(
                ".tm-article-rating span.tm-votes-lever__score-counter",
            ) ||
            document.querySelector(
                ".tm-article-rating span.tm-votes-meter__value",
            ) ||
            document.querySelector(
                ".tm-article-comments__article-body span.tm-votes-meter__value",
            );
        if (rating_el.innerText.startsWith("+")) {
            return new Rating(
                rating_el.innerText.slice(1),
                "positive",
                "#7aa600",
                "+",
                true,
            );
        } else if (rating_el.innerText.startsWith("-")) {
            return new Rating(
                rating_el.innerText.slice(1),
                "negative",
                "#d04e4e",
                "-",
                true,
            );
        } else {
            return new Rating(0, "neutral");
        }
    }

    function colorize_header(rating) {
        let title_block = document.querySelector("h1.tm-title");
        let title_el = document.querySelector("h1.tm-title span");

        if (!rating.should_colorize || !title_block) {
            return;
        }
        if (title_block.getAttribute("patched") == "true") {
            return;
        }
        if (!title_block.querySelector(".header_rating")) {
            title_block.style.color = rating.color;
            title_el.innerHTML += `<span style="color: ${rating.color}" class="header_rating"> (${rating.sign}${rating.score})</span>`;
        }

        title_block.setAttribute("patched", "true");
    }

    function set_title(rating) {
        let title_el = document.querySelector("head title");
        if (title_el.getAttribute("patched") == "true") {
            return;
        }
        let sign = rating.sign ? rating.sign : "";
        title_el.innerText = `(${sign}${rating.score}) ${title_el.innerText}`;
        title_el.setAttribute("patched", "true");
    }
}

function makeCommentsSortable() {
    function showNotification(text) {
        let notification = document.createElement("div");
        notification.style.position = "fixed";
        notification.style.top = "33%";
        notification.style.left = "50%";
        notification.style.transform = "translate(-50%, -50%)";
        notification.style.padding = "20px";
        notification.style.backgroundColor = "forestgreen";
        notification.style.opacity = "0.8";
        notification.classList.add("notification");
        notification.innerHTML = text;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.remove();
        }, 2000);
    }

    function sortCommentsByRating() {
        let container = document.querySelector(".tm-comments__tree");
        sortComments(container);
        showNotification("Comments sorted by rating");
    }

    function sortComments(container) {
        let commentThreads = Array.from(
            container.querySelectorAll(":scope > section.tm-comment-thread"),
        );

        let commentByRating = [];

        commentThreads.forEach((thread) => {
            let ratingEl =
                thread.querySelector(
                    ":scope > article.tm-comment-thread__comment .tm-votes-lever__score-counter",
                ) ||
                thread.querySelector(
                    ":scope > article.tm-comment-thread__comment .tm-votes-meter__value",
                );
            let rating = !!ratingEl ? parseInt(ratingEl.innerHTML) : -1;

            let comment_id = parseInt(
                thread
                    .querySelector(
                        ":scope > article.tm-comment-thread__comment > div[data-comment-body]",
                    )
                    .getAttribute("data-comment-body"),
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
                ":scope > .tm-comment-thread__children",
            );
            if (!!inner_contaner) {
                sortComments(inner_contaner);
            }
        });
    }

    function patchCommentsHeader() {
        let commentsHeader = document.querySelector(
            "div.tm-comments-wrapper__wrapper > header > h2",
        );
        if (!commentsHeader) {
            return;
        }
        if (commentsHeader.getAttribute("patched") === "true") {
            return;
        }

        commentsHeader.style = `
            cursor: pointer;
            color: rgb(102, 154, 179);
        `;
        commentsHeader.innerHTML +=
            ' <span style="font-size: 0.8em; vertical-align: middle;">⇅</span>';

        commentsHeader.addEventListener("click", sortCommentsByRating);
        commentsHeader.setAttribute("patched", true);
    }

    patchCommentsHeader();

    setInterval(() => {
        patchCommentsHeader();
    }, 1000);
}
