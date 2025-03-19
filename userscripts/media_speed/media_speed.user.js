// ==UserScript==
// @name         Media Speed
// @namespace    ilyachch/userscripts/scripts
// @version      0.4.0
// @description  Change media speed
// @author       ilyachch (https://github.com/ilyachch/userscripts)
// @homepageURL  https://github.com/ilyachch/userscripts
// @source       https://github.com/ilyachch/userscripts/blob/main/userscripts/media_speed/media_speed.user.js
// @supportURL   https://github.com/ilyachch/userscripts/issues
// @updateURL    https://raw.githubusercontent.com/ilyachch/userscripts/main/userscripts/media_speed/media_speed.user.js
// @downloadURL  https://raw.githubusercontent.com/ilyachch/userscripts/main/userscripts/media_speed/media_speed.user.js
// @license      MIT
// @run-at       document-start
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue

// @icon         https://cdn-icons-png.flaticon.com/512/4340/4340125.png
// ==/UserScript==

const localStorageKey = "user_media_speed";
const globalStorageKey = "global_media_speed_options";
const siteStorageKeyPrefix = "site_media_speed_options_";

const STYLE = `
.user_media_speed_control {
    --width: 250px;
    --default-gap: 10px;
    --row-height: 36px;
    --font-size: 14px;
    --border-radius: 5px;
    --background-color: #222;
    --color: #fff;
    --opacity: 0.1;
    --active-opacity: 0.7;

    font-family: monospace;
    font-size: var(--font-size);
    display: flex;
    flex-direction: row;
    gap: var(--default-gap);
    position: fixed;
    bottom: var(--default-gap);
    left: var(--default-gap);
    z-index: 9999;
    color: var(--color);
    border-radius: var(--border-radius);
    opacity: var(--opacity);
    user-select: none;
    overflow: hidden;
    transition: opacity 0.3s;
}

.user_media_speed_control:hover {
    opacity: var(--active-opacity);
}

.user_media_speed_control_title, .user_media_speed_control_option {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
    border: 1px solid #444;
    border-radius: var(--border-radius);
    background-color: var(--background-color);
    color: var(--color);
    cursor: pointer;
    text-transform: uppercase;
    line-height: 1;
    text-align: center;
    width: 50px; /* Ensure all buttons are the same width */
    height: 36px; /* Ensure all buttons are the same height */
}

.user_media_speed_control_title {
    font-weight: 600;
    cursor: default;
}

.user_media_speed_control_option {
    font-weight: 400;
    display: none;
}

.user_media_speed_control:hover .user_media_speed_control_option {
    display: flex;
    flex-direction: row;
}

.user_media_speed_control_option.selected {
    font-weight: 600;
    box-shadow: inset 0 0 10px rgba(255, 255, 255, 0.5); /* Add box-shadow to selected element */
}

.user_media_speed_change_notification {
    border-radius: var(--border-radius);
    opacity: var(--active-opacity);
    background-color: var(--background-color);
    color: var(--color);
    position: fixed !important;
    top: 25%;
    left: 50%;
    display: flex !important;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: var(--default-gap);
    font-size: var(--font-size);
    font-family: monospace;
    line-height: var(--row-height);
    width: 40px;
    height: 40px;
    transition: opacity 0.1s;
    z-index: 9999 !important;
}
`;

const SPEED_OPTIONS = [1, 1.5, 1.7, 2, 3, 4, 5, 10];

function get_site_key() {
    return siteStorageKeyPrefix + window.location.hostname;
}

function get_speed_options() {
    let siteOptions = GM_getValue(get_site_key());
    let globalOptions = GM_getValue(globalStorageKey);
    return siteOptions || globalOptions || SPEED_OPTIONS;
}

function save_speed_options(options, isGlobal = false) {
    if (isGlobal) {
        GM_setValue(globalStorageKey, options);
    } else {
        GM_setValue(get_site_key(), options);
    }
}

function reset_speed_options(isGlobal = false) {
    if (isGlobal) {
        GM_deleteValue(globalStorageKey);
    } else {
        GM_deleteValue(get_site_key());
    }
}

function reset_speed_options_if_overwritten(isGlobal = false) {
    if (isGlobal) {
        if (GM_getValue(globalStorageKey)) {
            GM_deleteValue(globalStorageKey);
        }
    } else {
        if (GM_getValue(get_site_key())) {
            GM_deleteValue(get_site_key());
        }
    }
}

GM_registerMenuCommand("Set Global Speed Options", function () {
    let options = prompt(
        "Enter speed options (comma separated)",
        get_speed_options().join(","),
    );
    if (options) {
        save_speed_options(
            options
                .split(",")
                .map(Number)
                .sort((a, b) => a - b),
            true,
        );
    }
});

GM_registerMenuCommand("Set Site Speed Options", function () {
    let options = prompt(
        "Enter speed options (comma separated)",
        get_speed_options().join(","),
    );
    if (options) {
        save_speed_options(
            options
                .split(",")
                .map(Number)
                .sort((a, b) => a - b),
        );
    }
});

if (GM_getValue(globalStorageKey)) {
    GM_registerMenuCommand("Reset Global Speed Options", function () {
        reset_speed_options(true);
    });
}

if (GM_getValue(get_site_key())) {
    GM_registerMenuCommand("Reset Site Speed Options", function () {
        reset_speed_options();
    });
}

const currentSpeed = get_playback_speed();
const speedOptions = get_speed_options();
if (!speedOptions.includes(Number(currentSpeed))) {
    speedOptions.push(Number(currentSpeed));
    speedOptions.sort((a, b) => a - b);
}

const DEFAULT_VIDEO_STEP = 5;
const MEDIUM_VIDEO_STEP = 30;
const LARGE_VIDEO_STEP = 90;

(function () {
    "use strict";
    let currentPlayingElement = null;

    document.addEventListener(
        "play",
        function (event) {
            currentPlayingElement = event.target;
            let speed = get_playback_speed();
            set_playback_speed(speed, currentPlayingElement);
            create_speed_control_element();
            set_selected_speed_option_active(speed);
        },
        true,
    );

    document.addEventListener("DOMContentLoaded", function (event) {
        GM_addStyle(STYLE);
        if (document.querySelectorAll("video, audio").length > 0) {
            create_speed_control_element();
        }
    });

    document.addEventListener(
        "MediaPlaybackSpeedChanged",
        function (event) {
            let speed = event.detail.speed;
            set_playback_speed(speed);
            set_selected_speed_option_active(speed);
            show_notification(speed);
        },
        true,
    );

    document.addEventListener("keydown", function (event) {
        const focusedElement = document.querySelector(":focus");

        if (
            currentPlayingElement &&
            (!focusedElement ||
                (focusedElement.tagName !== "INPUT" &&
                    focusedElement.tagName !== "TEXTAREA"))
        ) {
            if (event.shiftKey && event.code === "ArrowRight") {
                currentPlayingElement.currentTime +=
                    LARGE_VIDEO_STEP - DEFAULT_VIDEO_STEP;
            } else if (event.shiftKey && event.code === "ArrowLeft") {
                currentPlayingElement.currentTime -=
                    LARGE_VIDEO_STEP - DEFAULT_VIDEO_STEP;
            } else if (event.ctrlKey && event.code === "ArrowRight") {
                currentPlayingElement.currentTime +=
                    MEDIUM_VIDEO_STEP - DEFAULT_VIDEO_STEP;
            } else if (event.ctrlKey && event.code === "ArrowLeft") {
                currentPlayingElement.currentTime -=
                    MEDIUM_VIDEO_STEP - DEFAULT_VIDEO_STEP;
            }
        }
    });

    document.addEventListener("keydown", function (event) {
        if (
            event.ctrlKey &&
            event.altKey &&
            event.code === "Period" &&
            currentPlayingElement
        ) {
            increase_speed();
        } else if (
            event.ctrlKey &&
            event.altKey &&
            event.code === "Comma" &&
            currentPlayingElement
        ) {
            decrease_speed();
        }
    });
})();

function set_selected_speed_option_active(speed) {
    document
        .querySelectorAll(".user_media_speed_control_option")
        .forEach(function (element) {
            element.classList.remove("selected");
        });
    document
        .querySelector(
            `.user_media_speed_control_option[data-speed="${speed}"]`,
        )
        .classList.add("selected");
    document.querySelector(".user_media_speed_control_title").innerText = speed;
}

function get_playback_speed() {
    return localStorage.getItem(localStorageKey) || 1;
}

function set_playback_speed(speed, element) {
    if (!element) {
        document.querySelectorAll("video, audio").forEach(function (element) {
            element.playbackRate = speed;
        });
    } else {
        element.playbackRate = speed;
    }
    save_playback_speed(speed);
}

function save_playback_speed(speed) {
    localStorage.setItem(localStorageKey, speed);
}

function create_speed_control_element() {
    if (document.querySelectorAll(".user_media_speed_control").length > 0) {
        return;
    }
    let currentSpeed = get_playback_speed();
    let speed_control = document.createElement("div");
    speed_control.classList.add("user_media_speed_control");

    let speed_control_title = document.createElement("div");
    speed_control_title.classList.add("user_media_speed_control_title");
    speed_control_title.innerText = currentSpeed;

    speed_control.appendChild(speed_control_title);

    let speedOptions = get_speed_options();
    for (let speed of speedOptions) {
        let speed_option = document.createElement("div");
        speed_option.classList.add("user_media_speed_control_option");
        speed_option.setAttribute("data-speed", speed);
        if (speed == currentSpeed) {
            speed_option.classList.add("selected");
        }
        speed_option.innerText = speed;
        speed_option.addEventListener("click", function () {
            speed_option.dispatchEvent(
                new CustomEvent("MediaPlaybackSpeedChanged", {
                    detail: {
                        speed: speed,
                        source: speed_option,
                    },
                }),
            );
        });
        speed_control.appendChild(speed_option);
    }

    document.body.appendChild(speed_control);

    let hideTimeout, collapseTimeout;

    speed_control.addEventListener("mouseleave", function () {
        collapseTimeout = setTimeout(() => {
            speed_control.style.flexDirection = "row";
            speed_control
                .querySelectorAll(".user_media_speed_control_option")
                .forEach((option) => {
                    option.style.display = "none";
                });
            hideTimeout = setTimeout(() => {
                speed_control.style.opacity = "0.1";
            }, 15000);
        }, 15000);
    });

    speed_control.addEventListener("mouseenter", function () {
        clearTimeout(hideTimeout);
        clearTimeout(collapseTimeout);
        speed_control.style.opacity = "0.7";
        speed_control
            .querySelectorAll(".user_media_speed_control_option")
            .forEach((option) => {
                option.style.display = "flex";
            });
    });

    document.addEventListener("click", function (event) {
        if (!speed_control.contains(event.target)) {
            clearTimeout(hideTimeout);
            clearTimeout(collapseTimeout);
            speed_control.style.flexDirection = "row";
            speed_control
                .querySelectorAll(".user_media_speed_control_option")
                .forEach((option) => {
                    option.style.display = "none";
                });
            speed_control.style.opacity = "0.1";
        }
    });
}

function increase_speed() {
    let current_speed = get_playback_speed();
    let new_speed = SPEED_OPTIONS.find((speed) => speed > current_speed);
    document.dispatchEvent(
        new CustomEvent("MediaPlaybackSpeedChanged", {
            detail: {
                speed: new_speed,
            },
        }),
    );
}

function decrease_speed() {
    let current_speed = get_playback_speed();
    let new_speed = SPEED_OPTIONS.slice()
        .reverse()
        .find((speed) => speed < current_speed);
    document.dispatchEvent(
        new CustomEvent("MediaPlaybackSpeedChanged", {
            detail: {
                speed: new_speed,
            },
        }),
    );
}

function show_notification(new_speed) {
    if (document.querySelector(".user_media_speed_change_notification")) {
        document
            .querySelector(".user_media_speed_change_notification")
            .remove();
    }
    let notification = document.createElement("div");
    notification.classList.add("user_media_speed_change_notification");
    notification.classList.add("hidden");
    let notification_text = document.createElement("p");
    notification_text.innerText = `x${new_speed}`;
    notification.appendChild(notification_text);
    document.body.appendChild(notification);
    notification.classList.remove("hidden");
    setTimeout(() => {
        notification.classList.add("hidden");
        setTimeout(() => {
            notification.remove();
        }, 100);
    }, 2000);
}
