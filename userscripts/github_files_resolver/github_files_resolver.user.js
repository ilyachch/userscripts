// ==UserScript==
// @name         Github files resolver script
// @namespace    ilyachch/userscripts
// @version      0.0.1
// @description  Mark files as viewed by path on Github PR page
// @author       ilyachch (https://github.com/ilyachch/userscripts)
// @homepageURL  https://github.com/ilyachch/userscripts
// @source       https://github.com/ilyachch/userscripts/blob/main/userscripts/github_files_resolver/github_files_resolver.user.js
// @supportURL   https://github.com/ilyachch/userscripts/issues
// @updateURL    https://raw.githubusercontent.com/ilyachch/userscripts/main/userscripts/github_files_resolver/github_files_resolver.user.js
// @downloadURL  https://raw.githubusercontent.com/ilyachch/userscripts/main/userscripts/github_files_resolver/github_files_resolver.user.js
// @license      MIT

// @run-at       document-end
// @match        https://github.com/*/pull/*/files
// @icon         https://github.githubassets.com/favicons/favicon.png
// ==/UserScript==

const css = `
#custom-viewed-check-toggler {
  position: fixed;
  bottom: 32px;
  right: 32px;
  box-shadow: 2px 2px 4px 0px rgba(0,0,0,0.25);
  border-radius: 8px;
  padding: 16px;
  background-color: white;
  display: grid;
  grid-auto-flow: row;
  gap: 8px;
}

#custom-viewed-check-toggler button {
  border-width: 1px;
  border-color: rgba(0,0,0,0.25);
}

#custom-viewed-check-toggler button:first-of-type {
  background-color: rgba(0, 0, 255, 0.75);
  color: white;
}

#custom-viewed-check-toggler button:last-of-type {
  background-color: white;
  color: black;
}
  `;

let style = document.createElement("style");
style.innerHTML = css;
document.head.appendChild(style);

(function () {
    "use strict";

    const CUSTOM_ID = "custom-viewed-check-toggler";

    function createCustomElement() {
        const customElement = document.createElement("div");
        customElement.id = CUSTOM_ID;

        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = "Введите текст";
        input.value = "common/translations/";

        const toggleCheckboxes = (shouldCheck) => {
            const text = input.value;
            document.querySelectorAll("a.Truncate-text").forEach((item) => {
                if (item.innerText.includes(text)) {
                    const checkbox = item
                        .closest(".file-header")
                        .querySelector(".js-reviewed-checkbox");
                    if (shouldCheck ? !checkbox.checked : checkbox.checked)
                        checkbox.click();
                }
            });
        };

        const checkAllButton = document.createElement("button");
        checkAllButton.innerText = "Check All";
        checkAllButton.addEventListener("click", () => toggleCheckboxes(true));

        const uncheckAllButton = document.createElement("button");
        uncheckAllButton.innerText = "Uncheck All";
        uncheckAllButton.addEventListener("click", () =>
            toggleCheckboxes(false),
        );

        customElement.appendChild(input);
        customElement.appendChild(checkAllButton);
        customElement.appendChild(uncheckAllButton);

        document.body.appendChild(customElement);
    }

    function removeCustomElement() {
        document.getElementById(CUSTOM_ID).remove();
    }

    const filesContainer = document.getElementById("files");
    console.log(filesContainer);
    if (filesContainer && filesContainer.classList.contains("diff-view")) {
        if (!document.getElementById(CUSTOM_ID)) {
            createCustomElement();
        }
    } else {
        if (document.getElementById(CUSTOM_ID)) {
            removeCustomElement();
        }
    }
})();
