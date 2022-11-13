// ==UserScript==
// @name         Media Speed
// @namespace    ilyachch/userscripts/scripts
// @version      0.0.1
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

const STYLE = `
.speed-control {
    position: absolute;
    top: 5rem;
    left: 2.5rem;
    border-radius: 0.5rem;
    z-index: 9999;
    background-color: #2e2f34;
    color: #ffffff;
    padding: 0.75rem;
    opacity: 0;
    transition: opacity 1s;
    user-select: none;
    font: 600 12px / 14px "Segoe UI", BlinkMacSystemFont, Arial, sans-serif
}
.speed-control.visible {
    opacity: 1;
}
.speed-control-option{
    cursor: pointer;
    font-weight: 400;
    margin-left: 1rem;
}
.speed-control-option__selected{
    font-weight: 600;
}
`;

(function () {
    "use strict";
    console.log("Media Speed script started");
    GM_addStyle(STYLE);
    patch();
    document.addEventListener("DOMSubtreeModified", patch);
      let hide_timeout = setTimeout(function () {
        for (let speed_control of document.querySelectorAll(".speed-control.visible")) {
          speed_control.classList.remove("visible");
        }
      }, 2000);

      document.addEventListener("mousemove", function (e) {
        let speed_controls = document.querySelectorAll(".speed-control:not(.visible)");
        for (let speed_control of speed_controls) {
          if (!speed_control.classList.contains("visible")) {
            speed_control.classList.add("visible");
          }
        }
        clearTimeout(hide_timeout);
        hide_timeout = setTimeout(function () {
            for (let speed_control of document.querySelectorAll(".speed-control.visible")) {
              speed_control.classList.remove("visible");
            }
          }, 2000);
      });
})();

function patch() {
    let media_elements = document.querySelectorAll("video, audio");
    let not_patched_media_elements = [];
    for (let media_element of media_elements) {
        if (
            media_element.parentElement.querySelector(".speed-control") == null
        ) {
            not_patched_media_elements.push(media_element);
        }
    }

    for (let media_element of not_patched_media_elements) {
        let speed_control = create_speed_control(media_element);
        media_element.parentElement.appendChild(speed_control);
        media_element.addEventListener("play", function () {
            let speed_control_input = media_element.parentElement.querySelector(
                ".speed-control speed-control-option__selected"
            );
            if (media_element.playbackRate != speed_control_input.innerText) {
                media_element.playbackRate = speed_control_input.innerText;
            }
        });
    }
}

function create_speed_control(media_element) {
    let speed_control = document.createElement("div");
    speed_control.classList.add("speed-control");
    let speed_control_label = document.createElement("span");
    speed_control_label.innerText = "Speed:";
    speed_control.appendChild(speed_control_label);

    let container = document.createElement("span");
    let choices = [1, 1.5, 2, 2.5, 3, 4, 5];
    for (let choice of choices) {
        let option = document.createElement("span");
        option.classList.add("speed-control-option");
        if (media_element.playbackRate == choice) {
            option.classList.add("speed-control-option__selected");
        }
        option.innerText = choice;
        container.appendChild(option);
        option.addEventListener("click", function (e) {
            console.log(e);
            e.preventDefault();
            e.stopPropagation();
            media_element.playbackRate = choice;
            for (let option of container.querySelectorAll(
                ".speed-control-option"
            )) {
                option.classList.remove("speed-control-option__selected");
            }
            option.classList.add("speed-control-option__selected");
        });
    }
    speed_control.appendChild(container);
    return speed_control;
}
