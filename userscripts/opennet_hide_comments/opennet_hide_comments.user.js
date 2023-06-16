// ==UserScript==
// @name         Better Opennet script
// @namespace    ilyachch/userscripts
// @version      0.1.1
// @description  Custom Script - Better Opennet script
// @author       ilyachch (https://github.com/ilyachch/userscripts)
// @homepageURL  https://github.com/ilyachch/userscripts
// @source       https://github.com/ilyachch/userscripts/blob/main/userscripts/opennet_hide_comments/opennet_hide_comments.user.js
// @supportURL   https://github.com/ilyachch/userscripts/issues
// @updateURL    https://raw.githubusercontent.com/ilyachch/userscripts/main/userscripts/opennet_hide_comments/opennet_hide_comments.user.js
// @downloadURL  https://raw.githubusercontent.com/ilyachch/userscripts/main/userscripts/opennet_hide_comments/opennet_hide_comments.user.js
// @match        https://www.opennet.ru/opennews/art.shtml?num=*
// @grant        none
// @license      MIT

// @icon         https://www.google.com/s2/favicons?sz=64&domain=opennet.ru
// ==/UserScript==

(function() {
    'use strict';

    remove_comments()
})();

function remove_comments(){
    let elements_params_to_hide = [
        '#lenta_nav',
        '.ctxt',
    ]
    elements_params_to_hide.forEach(element => {
        document.querySelectorAll(element).forEach(element => {
            element.remove()
        })
    });

}
