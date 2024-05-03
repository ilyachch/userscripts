// ==UserScript==
// @name         Better Opennet script
// @namespace    ilyachch/userscripts
// @version      0.2.0
// @description  Custom Script - Better Opennet script
// @author       ilyachch (https://github.com/ilyachch/userscripts)
// @homepageURL  https://github.com/ilyachch/userscripts
// @source       https://github.com/ilyachch/userscripts/blob/main/userscripts/better_opennet/better_opennet.user.js
// @supportURL   https://github.com/ilyachch/userscripts/issues
// @updateURL    https://raw.githubusercontent.com/ilyachch/userscripts/main/userscripts/better_opennet/better_opennet.user.js
// @downloadURL  https://raw.githubusercontent.com/ilyachch/userscripts/main/userscripts/better_opennet/better_opennet.user.js
// @match        https://www.opennet.ru/opennews/art.shtml?num=*
// @grant        none
// @license      MIT
// @run-at       document-end
// @icon         https://www.google.com/s2/favicons?sz=64&domain=opennet.ru
// ==/UserScript==

(function () {
    "use strict";

    remove_discussion();
    remove_comment_form();
    remove_additional_controls();
})();



function remove_discussion() {
    let discussion_header_element = document.querySelector('a[name="comments"]').closest("table.thdr");
    let discussion_element = discussion_header_element.nextElementSibling;
    discussion_header_element.style.display = "none";
    discussion_element.style.display = "none";
}

function remove_comment_form() {
    let comment_form = document.querySelector('form[name="comment"]').closest('table.ttxt2');
    let comment_form_header = comment_form.previousElementSibling;
    comment_form_header.style.display = "none";
    comment_form.style.display = "none";
}

function remove_additional_controls() {
    let element_ids_to_hide = ["#lenta_nav", "#lenta_nav2"];
    element_ids_to_hide.forEach((element_id) => {
        let element = document.querySelector(element_id);
        if (element) {
            element.style.display = "none";
        }
    });
}
