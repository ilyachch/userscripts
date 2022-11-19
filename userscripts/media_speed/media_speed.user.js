// ==UserScript==
// @name         Media Speed
// @namespace    ilyachch/userscripts/scripts
// @version      0.0.2
// @description  Change media speed
// @author       ilyachch (https://github.com/ilyachch/userscripts)
// @homepageURL  https://github.com/ilyachch/userscripts
// @supportURL   https://github.com/ilyachch/userscripts/issues
// @updateURL    https://raw.githubusercontent.com/ilyachch/userscripts/main/userscripts/media_speed/media_speed.user.js
// @downloadURL  https://raw.githubusercontent.com/ilyachch/userscripts/main/userscripts/media_speed/media_speed.user.js
// @license      MIT
// @run-at       document-end
// @match        *://*/*
// @grant        GM_addStyle
// ==/UserScript==

const localStorageKey = "user_media_speed";

const STYLE = `
.user_media_speed_control{
    position: fixed;
    font-size: 1.5rem;
    bottom: 5rem;
    left: 2.5rem;
    border-radius: 2rem;
    z-index: 9999;
    background-color: #2e2f34;
    color: #ffffff;
    user-select: none;
    width: 4rem;
    height: 4rem;
    overflow: hidden;
    display: flex;
    opacity: 0.1;
    transition: 1s;
}

.user_media_speed_control:fullscreen{
    opacity: 0;
}

.user_media_speed_control:hover{
    width: 36rem;
    opacity: 1;
}

.user_media_speed_control_title{
    font-weight: 600;
    margin: 1rem;
    width: 2rem;
    height: 2rem;
    text-align: center;
    cursor: pointer;
    min-width: 2rem;
}

.user_media_speed_control_option{
    font-weight: 400;
    margin: 1rem;
    display: inline-block;
    height: 2rem;
    text-align: center;
    cursor: pointer;
    min-width: 2rem;
}

.user_media_speed_control_option.selected{
    font-weight: 600;
}
`;

const SPEED_OPTIONS = [1, 1.5, 2, 2.5, 3, 4, 5, 10];

(function () {
    "use strict";
    console.log("Media Speed script started");

    let cutternPlayingElement = null;

    document.addEventListener(
        "play",
        function (event) {
            cutternPlayingElement = event.target;
            set_playback_speed(event.target, get_playback_speed());
        },
        true
    );

    document.addEventListener("DOMContentLoaded", function (event) {
        GM_addStyle(STYLE);
        create_speed_control_element();
    });

    document.addEventListener(
        "MediaPlaybackSpeedChanged",
        function (event) {
            let speed = event.detail.speed;
            set_playback_speed(cutternPlayingElement, speed);
            document
                .querySelectorAll(".user_media_speed_control_option")
                .forEach(function (element) {
                    element.classList.remove("selected");
                });
            event.detail.source.classList.add("selected");
            document.querySelector(
                ".user_media_speed_control_title"
            ).innerText = speed;
        },
        true
    );
})();

function get_playback_speed() {
    return localStorage.getItem(localStorageKey) || 1;
}

function set_playback_speed(element, speed) {
    element.playbackRate = speed;
    save_playback_speed(speed);
}

function save_playback_speed(speed) {
    localStorage.setItem(localStorageKey, speed);
}

function create_speed_control_element() {
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
