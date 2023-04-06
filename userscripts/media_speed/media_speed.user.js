// ==UserScript==
// @name         Media Speed
// @namespace    ilyachch/userscripts/scripts
// @version      0.1.1
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
// ==/UserScript==

const localStorageKey = "user_media_speed";

const STYLE = `
:root{
    --font-size: 20px;
    --size: 40px;
    --border-radius: 30px;
    --placement: 25px;
    --margin: 10px;
}

.user_media_speed_control{
    font-size: var(--font-size);
    font-family: monospace;
    line-height: var(--size);

    display: flex;
    position: fixed;
    bottom: var(--placement);
    left: var(--placement);
    z-index: 9999;

    border-radius: var(--border-radius);
    background-color: #2e2f34;
    color: #ffffff;
    user-select: none;
    overflow: hidden;
    opacity: 0.1;
}
.user_media_speed_control:hover{
    opacity: 0.7;
}
.user_media_speed_control_title, .user_media_speed_control_option{
    margin: var(--margin);
    width: var(--size);
    height: var(--size);
    text-align: center;
}

.user_media_speed_control_title{
    font-weight: 600;
}
.user_media_speed_control_option{
    font-weight: 400;
    cursor: pointer;
    display: none;
}
.user_media_speed_control:hover .user_media_speed_control_option{
    display: block;
}
.user_media_speed_control_option.selected{
    font-weight: 600;
}
`;

const SPEED_OPTIONS = [1, 1.5, 2, 2.5, 3, 4, 5, 10];

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
        true
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
        },
        true
    );

    document.addEventListener("keydown", function (event) {
        if (currentPlayingElement) {
            if (event.shiftKey && event.code == "ArrowRight") {
                currentPlayingElement.currentTime += 90;
            } else if (event.shiftKey && event.code == "ArrowLeft") {
                currentPlayingElement.currentTime -= 90;
            } else if (event.ctrlKey && event.code == "ArrowRight") {
                currentPlayingElement.currentTime += 30;
            } else if (event.ctrlKey && event.code == "ArrowLeft") {
                currentPlayingElement.currentTime -= 30;
            }
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
            `.user_media_speed_control_option[data-speed="${speed}"]`
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

    for (let speed of SPEED_OPTIONS) {
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
                })
            );
        });
        speed_control.appendChild(speed_option);
    }

    document.body.appendChild(speed_control);
}
