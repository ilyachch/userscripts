// ==UserScript==
// @name         Better rezka script
// @namespace    ilyachch/userscripts
// @version      1.0.0
// @description  Custom Script - better_rezka
// @author       ilyachch (https://github.com/ilyachch/userscripts)
// @homepageURL  https://github.com/ilyachch/userscripts
// @source       https://github.com/ilyachch/userscripts/blob/main/userscripts/better_rezka/better_rezka.user.js
// @supportURL   https://github.com/ilyachch/userscripts/issues
// @updateURL    https://raw.githubusercontent.com/ilyachch/userscripts/main/userscripts/better_rezka/better_rezka.user.js
// @downloadURL  https://raw.githubusercontent.com/ilyachch/userscripts/main/userscripts/better_rezka/better_rezka.user.js
// @license      MIT

// @run-at       document-end
// @match        *://rezka.ag/*
// @icon         https://static.hdrezka.ac/templates/hdrezka/images/favicon.ico
// ==/UserScript==

(function () {
    "use strict";
    auto_next_episode();
    add_year_links();
    remove_duplicates_from_newest();
    remove_confirmation_request_before_mark_as_watched();
    parse_watched();
    mark_as_watched_or_in_progress();
})();

function auto_next_episode() {
    if (!window.location.pathname.match(/\/\d+-.*?\.html/)) {
        return;
    }
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

function add_year_links() {
    if (!window.location.pathname.match(/\/best.*?\/(\d{4})\//)) {
        return;
    }
    const year = parseInt(window.location.pathname.match(/\d{4}/)[0]);
    const next_year = year + 1;
    const prev_year = year - 1;

    const header = document.querySelectorAll(".b-content__htitle h1")[0];

    function make_link(url, text) {
        const link = document.createElement("a");
        link.style.marginLeft = "10px";
        link.href = url;
        link.innerText = text;
        return link;
    }

    const next_year_link = make_link(
        window.location.pathname.replace(/\d{4}\/.*/, `${next_year}/`),
        `${next_year}`
    );
    const prev_year_link = make_link(
        window.location.pathname.replace(/\d{4}\/.*/, `${prev_year}/`),
        `${prev_year}`
    );

    header.appendChild(prev_year_link);
    if (year != new Date().getFullYear()) {
        header.appendChild(next_year_link);
    }
}

function remove_duplicates_from_newest() {
    const stack_size = 8;

    // remove first 8 elements and last 8 elements
    let newest_slider_content = document.querySelector(
        "#newest-slider-content"
    );
    if (!newest_slider_content) {
        return;
    }
    let newest_elements = document.querySelectorAll(
        "#newest-slider-content .b-content__inline_item"
    );
    if (newest_elements.length < stack_size * 2) {
        return;
    }

    for (let i = 0; i < stack_size; i++) {
        newest_elements[i].remove();
    }
    for (
        let i = newest_elements.length - 1;
        i >= newest_elements.length - stack_size;
        i--
    ) {
        newest_elements[i].remove();
    }
}

function remove_confirmation_request_before_mark_as_watched() {
    let continue_block = document.querySelector("#videosaves-list");
    if (!continue_block) {
        return;
    }

    let buttons_watched = continue_block.querySelectorAll("a.i-sprt.view");
    let buttons_delete = continue_block.querySelectorAll("a.i-sprt.delete");

    function mark_as_watched(element) {
        let id = element.getAttribute("data-id");
        let url = "/engine/ajax/cdn_saves_view.php";
        let data = `id=${id}`;
        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader(
            "Content-Type",
            "application/x-www-form-urlencoded"
        );
        xhr.send(data);

        xhr.onreadystatechange = function () {
            if (xhr.readyState != 4) return;
            if (xhr.status != 200) {
                console.log(xhr.status + ": " + xhr.statusText);
            } else {
                element
                    .closest(".b-videosaves__list_item")
                    .classList.toggle("watched-row");
                element.classList.toggle("watched");
            }
        };
    }

    buttons_watched.forEach((button) => {
        let new_button = document.createElement("button");
        new_button.classList.add("i-sprt", "view");
        new_button.setAttribute("data-id", button.getAttribute("data-id"));
        new_button.setAttribute(
            "data-text-watch",
            button.getAttribute("data-text-watch")
        );
        new_button.setAttribute(
            "data-text-unwatch",
            button.getAttribute("data-text-unwatch")
        );
        new_button.style.border = "none";
        new_button.style.backgroundColor = "transparent";

        new_button.addEventListener("click", (event) => {
            event.preventDefault();
            mark_as_watched(event.target);
        });

        button.parentNode.replaceChild(new_button, button);
    });

    function mark_as_deleted(element) {
        let id = element.getAttribute("data-id");
        let url = "/engine/ajax/cdn_saves_remove.php";
        let data = `id=${id}`;
        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader(
            "Content-Type",
            "application/x-www-form-urlencoded"
        );
        xhr.send(data);

        xhr.onreadystatechange = function () {
            if (xhr.readyState != 4) return;
            if (xhr.status != 200) {
                console.log(xhr.status + ": " + xhr.statusText);
            } else {
                element.closest(".b-videosaves__list_item").remove();
            }
        };
    }

    buttons_delete.forEach((button) => {
        let new_button = document.createElement("button");
        new_button.classList.add("i-sprt", "delete");
        new_button.setAttribute("data-id", button.getAttribute("data-id"));
        new_button.style.border = "none";
        new_button.style.backgroundColor = "transparent";

        new_button.addEventListener("click", (event) => {
            event.preventDefault();
            mark_as_deleted(event.target);
        });

        button.parentNode.replaceChild(new_button, button);
    });
}

function parse_watched() {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "/continue/", true);
    xhr.send();

    let watched = [];
    let in_progress = [];

    xhr.onreadystatechange = function () {
        if (xhr.readyState != 4) return;
        if (xhr.status != 200) {
            console.log(xhr.status + ": " + xhr.statusText);
        } else {
            let parser = new DOMParser();
            let doc = parser.parseFromString(xhr.responseText, "text/html");
            let continue_block = doc.querySelector("#videosaves-list");
            if (!continue_block) {
                return;
            }
            let items = continue_block.querySelectorAll(
                ".b-videosaves__list_item"
            );
            items.forEach((item) => {
                if (!item.getAttribute("id")) {
                    return;
                }
                let link = item
                    .querySelector(".td.title a")
                    .getAttribute("href");
                let id = link.match(/\/(\d+?)-/)[1];
                if (item.classList.contains("watched-row")) {
                    watched.push(id);
                } else {
                    in_progress.push(id);
                }
            });
        }
        localStorage.setItem("watched", JSON.stringify(watched));
        localStorage.setItem("in_progress", JSON.stringify(in_progress));
    };
}

function mark_as_watched_or_in_progress() {
    let watched_raw = localStorage.getItem("watched");
    let in_progress_raw = localStorage.getItem("in_progress");

    if (!watched_raw || !in_progress_raw) {
        return;
    }

    let watched = JSON.parse(watched_raw);
    let in_progress = JSON.parse(in_progress_raw);

    let items = document.querySelectorAll(".b-content__inline_item");
    items.forEach((item) => {
        let id = item.getAttribute("data-id");
        if (!id) {
            return;
        }
        if (watched.includes(id)) {
            item.classList.add("watched");
        } else if (in_progress.includes(id)) {
            item.classList.add("in-progress");
        }
    });
}
