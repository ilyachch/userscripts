// ==UserScript==
// @name         Opennet
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.opennet.ru/opennews/art.shtml?num=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=opennet.ru
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    remove_comments()
})();

function remove_comments(){
    let elements_params_to_hide = [
        '.thdr',
        '#lenta_nav',
        '.ctxt',
    ]
    elements_params_to_hide.forEach(element => {
        document.querySelectorAll(element).forEach(element => {
            element.remove()
        })
    });

}
