// ==UserScript==
// @name         Better rezka script
// @namespace    ilyachch/userscripts
// @version      2.1.0
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
// @grant        GM_addStyle
// @icon         https://static.hdrezka.ac/templates/hdrezka/images/favicon.ico
// ==/UserScript==

const STYLE = `
.b-content__inline_item.watched .b-content__inline_item-cover::before,
.b-content__inline_item.in-progress .b-content__inline_item-cover::before,
.b-content__inline_item.to-watch .b-content__inline_item-cover::before,
.b-content__inline_item.dropped .b-content__inline_item-cover::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  line-height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}
.b-content__inline_item.in-progress .b-content__inline_item-cover::before {
  box-shadow: inset 0px 0px 20px 10px #f0e68c;
}
.b-content__inline_item.watched .b-content__inline_item-cover::before {
  box-shadow: inset 0px 0px 20px 10px #90ee90;
}
.b-content__inline_item.dropped .b-content__inline_item-cover::before {
  box-shadow: inset 0px 0px 20px 10px #ee9090;
}
.b-content__inline_item.to-watch .b-content__inline_item-cover::before {
  box-shadow: inset 0px 0px 20px 10px #90b1ee;
}

.b-content__inline_item .ratings {
    border: 1px solid #ccc;
    padding: 2px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
`;

function auto_next_episode() {
    if (!window.location.pathname.match(/\/\d+-.*?\.html/)) {
        return;
    }
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === "childList") {
                const nextEpisodeLoader = document.querySelector(
                    ".b-player__next_episode_loader",
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
        `${next_year}`,
    );
    const prev_year_link = make_link(
        window.location.pathname.replace(/\d{4}\/.*/, `${prev_year}/`),
        `${prev_year}`,
    );

    header.appendChild(prev_year_link);
    if (year != new Date().getFullYear()) {
        header.appendChild(next_year_link);
    }
}

function remove_duplicates_from_newest() {
    const stack_size = 8;

    let newest_slider_content = document.querySelector(
        "#newest-slider-content",
    );
    if (!newest_slider_content) {
        return;
    }
    let newest_elements = document.querySelectorAll(
        "#newest-slider-content .b-content__inline_item",
    );
    if (!newest_elements) {
        return;
    }

    let duplicates = [];

    for (let i = 0; i < newest_elements.length; i++) {
        let element = newest_elements[i];
        let id = element.getAttribute("data-id");
        let duplicates_count = 0;
        for (let j = 0; j < newest_elements.length; j++) {
            if (i == j) {
                continue;
            }
            let other_element = newest_elements[j];
            let other_id = other_element.getAttribute("data-id");
            if (id == other_id) {
                duplicates_count++;
            }
        }
        if (duplicates_count > 0) {
            duplicates.push(1);
        } else {
            duplicates.push(0);
        }
    }

    let duplicates_string = duplicates.join("");

    let duplicates_string_parts_start = duplicates_string.match(/^1*/g)[0];

    let duplicates_string_parts_end = duplicates_string.match(/1*$/g)[0];

    let duplicates_string_parts_middle = duplicates_string.match(/0+/g)[0];

    duplicates_string_parts_start =
        "1".repeat(duplicates_string_parts_start.length / 2) +
        "0".repeat(duplicates_string_parts_start.length / 2);

    duplicates_string_parts_end =
        "0".repeat(duplicates_string_parts_end.length / 2) +
        "1".repeat(duplicates_string_parts_end.length / 2);

    let duplicates_string_new =
        duplicates_string_parts_start +
        duplicates_string_parts_middle +
        duplicates_string_parts_end;

    let elements_to_remove = [];

    for (let i = 0; i < duplicates_string_new.length; i++) {
        if (duplicates_string_new[i] == 1) {
            elements_to_remove.push(newest_elements[i]);
        }
    }

    elements_to_remove.forEach((element) => {
        element.remove();
    });
}

function watch_newest_slider_content_block_changes() {
    const newest_slider_content = document.querySelector(
        "#newest-slider-content",
    );
    if (!newest_slider_content) {
        return;
    }

    let timer;

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === "childList") {
                clearTimeout(timer);
                timer = setTimeout(() => {
                    remove_duplicates_from_newest();
                    mark_as_watched_or_in_progress();
                }, 500);
            }
        });
    });

    observer.observe(newest_slider_content, {
        childList: true,
        subtree: true,
    });
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
            "application/x-www-form-urlencoded",
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
            button.getAttribute("data-text-watch"),
        );
        new_button.setAttribute(
            "data-text-unwatch",
            button.getAttribute("data-text-unwatch"),
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
            "application/x-www-form-urlencoded",
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

class VideoStatus {
    constructor() {
        this.toWatch = [];
        this.watched = [];
        this.inProgress = [];
        this.dropped = [];
    }

    toJSON() {
        return {
            toWatch: this.toWatch,
            watched: this.watched,
            inProgress: this.inProgress,
            dropped: this.dropped,
        };
    }

    static fromJSON(json) {
        const videoStatus = new VideoStatus();
        videoStatus.toWatch = json.toWatch || [];
        videoStatus.watched = json.watched || [];
        videoStatus.inProgress = json.inProgress || [];
        videoStatus.dropped = json.dropped || [];
        return videoStatus;
    }

    addToList(listName, videoName) {
        if (this.hasOwnProperty(listName) && typeof videoName === "string") {
            this[listName].push(videoName);
        } else {
            console.error("Invalid list or video name");
        }
    }

    removeFromList(listName, videoName) {
        if (this.hasOwnProperty(listName)) {
            this[listName] = this[listName].filter(
                (item) => item !== videoName,
            );
        } else {
            console.error("Invalid list name");
        }
    }

    merge(other) {
        if (!(other instanceof VideoStatus)) {
            console.error("The given object is not an instance of VideoStatus");
            return;
        }

        let result = new VideoStatus();

        for (let listName in this) {
            if (this.hasOwnProperty(listName)) {
                this[listName].forEach((videoName) => {
                    // If the video exists in the other list, it will be added later.
                    if (!other.containsVideo(videoName)) {
                        result.addToList(listName, videoName);
                    }
                });
            }
        }

        for (let listName in other) {
            if (other.hasOwnProperty(listName)) {
                other[listName].forEach((videoName) => {
                    // Add or move the video to the list from the "other" object.
                    result.removeFromAnyList(videoName);
                    result.addToList(listName, videoName);
                });
            }
        }

        return result;
    }

    containsVideo(videoName) {
        for (let listName in this) {
            if (
                this.hasOwnProperty(listName) &&
                this[listName].includes(videoName)
            ) {
                return true;
            }
        }
        return false;
    }

    removeFromAnyList(videoName) {
        for (let listName in this) {
            if (this.hasOwnProperty(listName)) {
                this.removeFromList(listName, videoName);
            }
        }
    }
}

class Database {
    constructor(dbName, storeName) {
        this.dbName = dbName;
        this.storeName = storeName;
    }

    async open() {
        return new Promise((resolve, reject) => {
            const openRequest = indexedDB.open(this.dbName, 1);

            openRequest.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName);
                }
            };

            openRequest.onsuccess = () => {
                resolve(openRequest.result);
            };

            openRequest.onerror = () => {
                reject(openRequest.error);
            };
        });
    }

    async save(key, value) {
        const db = await this.open();
        const transaction = db.transaction(this.storeName, "readwrite");
        const store = transaction.objectStore(this.storeName);

        return new Promise((resolve, reject) => {
            const request = store.put(value, key);
            request.onsuccess = () => {
                resolve(request.result);
            };
            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    async get(key) {
        const db = await this.open();
        const transaction = db.transaction(this.storeName, "readonly");
        const store = transaction.objectStore(this.storeName);

        return new Promise((resolve, reject) => {
            const request = store.get(key);
            request.onsuccess = () => {
                resolve(request.result);
            };
            request.onerror = () => {
                reject(request.error);
            };
        });
    }
}

class Parser {
    constructor() {
        this.parser = new DOMParser();
        this.db = new Database("VideoStatusDatabase", "statuses");
    }

    async parseWatched() {
        const response = await fetch("/continue/");

        if (!response.ok) {
            console.error(`${response.status}: ${response.statusText}`);
            return null;
        }

        const htmlText = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, "text/html");

        const continue_block = doc.querySelector("#videosaves-list");
        if (!continue_block) {
            return null;
        }

        let videoStatus = new VideoStatus();

        const items = continue_block.querySelectorAll(
            ".b-videosaves__list_item",
        );
        for (const item of items) {
            if (!item.getAttribute("id")) {
                continue;
            }
            let link = item.querySelector(".td.title a").getAttribute("href");
            let id = link.match(/\/(\d+?)-/)[1];
            if (item.classList.contains("watched-row")) {
                videoStatus.addToList("watched", id);
            } else {
                videoStatus.addToList("inProgress", id);
            }
        }

        return videoStatus;
    }

    async fetchFavoritesByCategory(categoryURL) {
        const videoElements = [];
        let page = 1;
        while (true) {
            const response = await fetch(`${categoryURL}page/${page}/`);
            if (!response.ok) {
                break;
                throw new Error(
                    `Failed to fetch folder ${categoryURL}: ${response.statusText}`,
                );
            }
            let htmlText = await response.text();
            let doc = this.parser.parseFromString(htmlText, "text/html");
            let elements = doc.querySelectorAll(".b-content__inline_item");
            if (elements.length === 0) {
                break;
            }
            videoElements.push(...elements);
            page++;
        }
        const videoIds = [...videoElements].map((el) =>
            el.getAttribute("data-id"),
        );

        return videoIds;
    }

    async parseFavorites() {
        const baseUrl = "/favorites/";
        const response = await fetch(baseUrl);
        if (!response.ok) {
            throw new Error(
                `Failed to fetch favourites ${baseUrl}: ${response.statusText}`,
            );
        }

        const htmlText = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, "text/html");

        const categoryLinks = doc.querySelectorAll(
            ".b-favorites_content__cats_list_link",
        );

        const videoStatus = new VideoStatus();

        for (const link of categoryLinks) {
            const category = link.querySelector(".name").textContent;
            const href = link.getAttribute("href");

            if (videoStatus.hasOwnProperty(category)) {
                const ids = await this.fetchFavoritesByCategory(href);
                ids.forEach((id) => videoStatus.addToList(category, id));
            }
        }

        return videoStatus;
    }

    async parseMarks() {
        let statuses = new VideoStatus();
        const watchedStatus = await this.parseWatched();
        const favoritesStatus = await this.parseFavorites();

        statuses = statuses.merge(watchedStatus);
        statuses = statuses.merge(favoritesStatus);

        return statuses;
    }

    async parseAndSaveMarks() {
        const videoStatus = await this.parseMarks();
        await this.db.save("currentStatus", videoStatus.toJSON());
    }
}

class Marker {
    constructor() {
        this.db = new Database("VideoStatusDatabase", "statuses");
    }

    async getVideoStatus() {
        const serializedVideoStatus = await this.db.get("currentStatus");

        if (!serializedVideoStatus) {
            return null;
        }

        return VideoStatus.fromJSON(serializedVideoStatus);
    }

    async markAs(listName, videoName) {
        const serializedVideoStatus = await this.db.get("currentStatus");

        if (!serializedVideoStatus) {
            return;
        }

        const videoStatus = VideoStatus.fromJSON(serializedVideoStatus);

        videoStatus.removeFromAnyList(videoName);
        videoStatus.addToList(listName, videoName);

        await this.db.save("currentStatus", videoStatus.toJSON());
    }

    async markVideosWithStatuses() {
        const videoStatus = await this.getVideoStatus();

        if (!videoStatus) {
            return;
        }

        let items = document.querySelectorAll(".b-content__inline_item");

        items.forEach((item) => {
            let id = item.getAttribute("data-id");

            if (!id) {
                return;
            }

            ["watched", "in_progress", "to_watch", "dropped"].forEach(
                (status) => {
                    item.classList.remove(status);
                },
            );

            if (videoStatus.watched.includes(id)) {
                item.classList.add("watched");
            } else if (videoStatus.inProgress.includes(id)) {
                item.classList.add("in-progress");
            } else if (videoStatus.toWatch.includes(id)) {
                item.classList.add("to-watch");
            } else if (videoStatus.dropped.includes(id)) {
                item.classList.add("dropped");
            }
        });
    }
}

class RatingData {
    constructor(rating_element, source) {
        this.rating_str = rating_element ? rating_element.innerText : null;
        this.source = source;
        this.ratingValue = this.rating_str ? parseFloat(this.rating_str) : null;
    }

    asString() {
        if (this.ratingValue === null) {
            return `<span title="${this.source}">-</span>`;
        }
        if (this.ratingValue < 6) {
            return `<span title="${this.source}" style="color: red;">${this.rating_str}</span>`;
        } else if (this.ratingValue >= 6 && this.ratingValue < 7) {
            return `<span title="${this.source}">${this.rating_str}</span>`;
        } else if (this.ratingValue >= 7) {
            return `<span title="${this.source}" style="color: green;">${this.rating_str}</span>`;
        }
    }
}

class RatingMarker {
    constructor() {
        this.parser = new DOMParser();
    }

    async addRatingsBlock(element) {
        if (element.querySelector(".ratings")) {
            return;
        }
        let elementDataId = element.getAttribute("data-id");
        fetch("https://rezka.ag/engine/ajax/quick_content.php", {
            method: "POST",
            headers: {
                "Content-Type":
                    "application/x-www-form-urlencoded; charset=UTF-8",
            },
            body: `id=${elementDataId}`,
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(
                        `${response.status}: ${response.statusText}`,
                    );
                }
                return response.text();
            })
            .then((resposnse_text) => {
                let doc = this.parser.parseFromString(
                    resposnse_text,
                    "text/html",
                );
                let ratings = [
                    new RatingData(
                        doc.querySelector(".b-content__bubble_rating b"),
                        "Rezka",
                    ),
                    new RatingData(
                        doc.querySelector(".b-content__bubble_rates .kp b"),
                        "КиноПоиск",
                    ),
                    new RatingData(
                        doc.querySelector(".b-content__bubble_rates .imdb b"),
                        "IMDb",
                    ),
                ];

                let ratingDiv = document.createElement("div");
                ratingDiv.classList.add("ratings");
                ratings.forEach((rating) => {
                    let ratingBlock = document.createElement("div");
                    ratingBlock.innerHTML = rating.asString();
                    ratingDiv.appendChild(ratingBlock);
                });
                element
                    .querySelector(".b-content__inline_item-cover")
                    .after(ratingDiv);
            });
    }

    markRating() {
        const elementsToMark = document.querySelectorAll(
            ".b-content__inline_item",
        );

        elementsToMark.forEach((element) => {
            let timer;
            element.addEventListener("mouseenter", () => {
                timer = setTimeout(() => {
                    this.addRatingsBlock(element);
                }, 500);
            });

            element.addEventListener("mouseleave", () => {
                clearTimeout(timer);
            });
        });
    }
}

(function () {
    "use strict";

    GM_addStyle(STYLE);

    const parser = new Parser();
    const marker = new Marker();

    auto_next_episode();
    add_year_links();
    remove_duplicates_from_newest();
    remove_confirmation_request_before_mark_as_watched();
    parser.parseAndSaveMarks();
    marker.markVideosWithStatuses();
    watch_newest_slider_content_block_changes();

    const rating_marker = new RatingMarker();
    rating_marker.markRating();
})();
