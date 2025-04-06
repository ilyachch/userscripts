// ==UserScript==
// @name         Better rezka script
// @namespace    ilyachch/userscripts
// @version      3.1.0
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
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @icon         https://static.hdrezka.ac/templates/hdrezka/images/favicon.ico
// ==/UserScript==

GM_addStyle(`
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
.parse-button {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    border: none;
    border-radius: 50%;
    font-size: 24px;
    text-align: center;
    line-height: 50px;
    cursor: pointer;
    background-color: #007bff;
    color: white;
    z-index: 1000;
}
.parse-button.parsing {
    background-color: #ffc107;
}
.parse-button.parsing:hover {
    background-color: #dc3545;
}
`);

function log(message, level = "info") {
    const levels = {
        info: "color: white;",
        warn: "color: orange;",
        error: "color: red;",
    };
    console.log(`%c[Better Rezka] ${message}`, levels[level] || "");
}

function auto_next_episode() {
    log("Initializing auto_next_episode...");
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
    log("Adding year links...");
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
    log("Removing duplicates from newest slider...");
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
    log("Watching for changes in newest slider content...");
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
                    let marker = new Marker();
                    marker.markVideosWithStatuses();
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
    log("Removing confirmation requests for marking as watched...");
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
        log("Parser initialized.");
    }

    async fetchWithRetry(url, options = {}, maxRetries = 5) {
        log(`Fetching URL: ${url} with retry mechanism...`);
        let delay = 1000; // Initial delay in ms
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const response = await fetch(url, options);
                if (!response.ok) {
                    throw new Error(`${response.status}: ${response.statusText}`);
                }
                return response;
            } catch (error) {
                if (attempt === maxRetries) {
                    throw error; // Rethrow if max retries reached
                }
                console.warn(`Request failed (attempt ${attempt}). Retrying in ${delay}ms...`);
                await new Promise((resolve) => setTimeout(resolve, delay));
                delay *= 2; // Exponential backoff
            }
        }
    }

    async parseWatched() {
        log("Parsing watched videos...");
        const response = await this.fetchWithRetry("/continue/");
        const htmlText = await response.text();
        const doc = this.parser.parseFromString(htmlText, "text/html");

        const continue_block = doc.querySelector("#videosaves-list");
        if (!continue_block) {
            return null;
        }

        let videoStatus = new VideoStatus();

        const items = continue_block.querySelectorAll(".b-videosaves__list_item");
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
        log(`Fetching favorites by category: ${categoryURL}`);
        const videoElements = [];
        let page = 1;
        while (true) {
            const response = await this.fetchWithRetry(`${categoryURL}page/${page}/`);
            let htmlText = await response.text();
            let doc = this.parser.parseFromString(htmlText, "text/html");
            let elements = doc.querySelectorAll(".b-content__inline_item");
            if (elements.length === 0) {
                break;
            }
            videoElements.push(...elements);
            page++;
        }
        const videoIds = [...videoElements].map((el) => el.getAttribute("data-id"));
        return videoIds;
    }

    async parseFavorites() {
        log("Parsing favorite videos...");
        const baseUrl = "/favorites/";
        const response = await this.fetchWithRetry(baseUrl);
        const htmlText = await response.text();
        const doc = this.parser.parseFromString(htmlText, "text/html");

        const categoryLinks = doc.querySelectorAll(".b-favorites_content__cats_list_link");
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
        log("Parsing all marks...");
        let statuses = new VideoStatus();
        const watchedStatus = await this.parseWatched();
        const favoritesStatus = await this.parseFavorites();

        statuses = statuses.merge(watchedStatus);
        statuses = statuses.merge(favoritesStatus);

        return statuses;
    }

    async parseAndSaveMarks() {
        log("Parsing and saving marks...");
        try {
            const videoStatus = await this.parseMarks();
            await this.db.save("currentStatus", videoStatus.toJSON());
            log("Marks parsed and saved successfully.");
        } catch (error) {
            log(`Error while parsing and saving marks: ${error.message}`, "error");
        }
    }
}

class Marker {
    constructor() {
        this.db = new Database("VideoStatusDatabase", "statuses");
        log("Marker initialized.");
    }

    async getVideoStatus() {
        log("Getting video status from database...");
        const serializedVideoStatus = await this.db.get("currentStatus");

        if (!serializedVideoStatus) {
            return null;
        }

        return VideoStatus.fromJSON(serializedVideoStatus);
    }

    async markAs(listName, videoName) {
        log(`Marking video '${videoName}' as '${listName}'...`);
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
        log("Marking videos with statuses...");
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
        log("RatingMarker initialized.");
    }

    async addRatingsBlock(element) {
        log("Adding ratings block...");
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
        log("Marking ratings...");
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

class ParseManager {
  constructor() {
    this.isParsing = false;
    this.abortController = null;
    this.button = null;
    this.stopCommandId = null;
  }

  setupMenu() {
    GM_registerMenuCommand("Start Parsing", this.startParsing.bind(this));
  }

  setupButton() {
    this.button = document.createElement("button");
    this.button.classList.add("parse-button");
    this.button.textContent = "🗘";
    document.body.appendChild(this.button);

    this.button.addEventListener("mouseenter", () => {
      if (this.isParsing) {
        this.button.textContent = "🗙";
      }
    });

    this.button.addEventListener("mouseleave", () => {
      this.updateButtonState();
    });

    this.button.addEventListener("click", () => {
      if (this.isParsing) {
        this.stopParsing();
      } else {
        this.startParsing();
      }
    });
  }

  updateButtonState() {
    if (this.isParsing) {
      this.button.textContent = "⏲";
      this.button.classList.add("parsing");
    } else {
      this.button.textContent = "🗘";
      this.button.classList.remove("parsing");
    }
  }

  async startParsing() {
    if (this.isParsing) {
      log("Parsing is already in progress.", "warn");
      return;
    }

    this.isParsing = true;
    this.abortController = new AbortController();

    this.stopCommandId = GM_registerMenuCommand("Stop Parsing", this.stopParsing.bind(this));

    retryWithExponentialBackoff(async () => {
      const parser = new Parser();
      await parser.parseAndSaveMarks();
    }, this.abortController.signal)
      .catch((error) => {
        console.error("Parsing failed:", error);
      })
      .finally(() => {
        this.isParsing = false;
        if (this.stopCommandId) {
          GM_unregisterMenuCommand(this.stopCommandId);
          this.stopCommandId = null;
        }
        this.updateButtonState();
      });

    this.updateButtonState();
  }

  stopParsing() {
    if (!this.isParsing) {
      log("No parsing process to stop.", "warn");
      return;
    }

    this.abortController.abort();
    this.isParsing = false;
    log("Parsing aborted.", "info");

    if (this.stopCommandId) {
      GM_unregisterMenuCommand(this.stopCommandId);
      this.stopCommandId = null;
    }

    this.updateButtonState();
  }
}

async function retryWithExponentialBackoff(task, signal, maxRetries = 5, initialDelay = 1000) {
  let delay = initialDelay;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await task();
    } catch (error) {
      if (attempt === maxRetries || (signal && signal.aborted)) {
        throw error;
      }
      console.warn(`Attempt ${attempt} failed. Retrying in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= 2; // Exponential backoff
    }
  }
}

(function () {
  "use strict";

  log("Initializing Better Rezka script...");
  const marker = new Marker();

  auto_next_episode();
  add_year_links();
  remove_duplicates_from_newest();
  remove_confirmation_request_before_mark_as_watched();
  marker.markVideosWithStatuses();
  watch_newest_slider_content_block_changes();

  const rating_marker = new RatingMarker();
  rating_marker.markRating();

  const parseManager = new ParseManager();
  parseManager.setupMenu();
  parseManager.setupButton();

  log("Better Rezka script initialized successfully.");
})();
