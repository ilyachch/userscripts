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
    top: 50%;
    left: 0;
    z-index: 9999;
    background-color: #000000;
    color: #ffffff;
    padding: 0.5em;
    visibility: hidden;
}
.speed-control.visible {
    visibility: visible !important;
}

.speed-control select {
    display: inline-block;
    margin-left: 0.5em;
}
.speed-control label {
    display: inline-block;
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
    if (media_element.parentElement.querySelector(".speed-control") == null) {
      not_patched_media_elements.push(media_element);
    }
  }

  for (let media_element of not_patched_media_elements) {
    let speed_control = create_speed_control(media_element);
    media_element.parentElement.appendChild(speed_control);
    media_element.addEventListener("play", function () {
        let speed_control_input = media_element.parentElement.querySelector(".speed-control select");
        if (media_element.playbackRate != speed_control_input.value) {
            media_element.playbackRate = speed_control_input.value;
        }
    });
  }

}

function create_speed_control(media_element) {
  let speed_control = document.createElement("div");
  speed_control.classList.add("speed-control");
  let speed_control_label = document.createElement("label");
  speed_control_label.innerText = "Speed:";
  speed_control.appendChild(speed_control_label);

  let speed_control_input = document.createElement("select");
  let choices = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
  for (let choice of choices) {
    let option = document.createElement("option");
    option.value = choice;
    option.innerText = choice;
    speed_control_input.appendChild(option);
  }
  speed_control_input.value = media_element.playbackRate;
  speed_control_input.addEventListener("change", function () {
    media_element.playbackRate = speed_control_input.value;
  });
  speed_control.appendChild(speed_control_input);
  return speed_control;
}
