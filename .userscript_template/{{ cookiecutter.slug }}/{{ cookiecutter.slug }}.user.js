// ==UserScript==
// @name         {{ cookiecutter.name }} script
// @namespace    {{ cookiecutter.repository_name }}
// @version      {{ cookiecutter.version }}
// @description  {{ cookiecutter.description }}
// @author       {{ cookiecutter.author }}
// @homepageURL  {{ cookiecutter.__repository }}
// @supportURL   {{ cookiecutter.__repository }}/issues
// @updateURL    {{ cookiecutter.__update_url }}
// @downloadURL  {{ cookiecutter.__update_url }}
// @license      {{ cookiecutter.license }}

// @run-at       {{ cookiecutter.run_at }}
// @match        {{ cookiecutter.match }}
{% if cookiecutter.icon -%}
// @icon         {{ cookiecutter.icon }}
{% endif -%}

{% if cookiecutter.noframes == "True" -%}
// @noframes
{% endif -%}
{% if cookiecutter.unwrap == "True" -%}
// @unwrap
{% endif -%}
{% if cookiecutter.antifeature_ads == "True" -%}
// @antifeature  ads Ads can be shown
{% endif -%}
{% if cookiecutter.antifeature_tracking == "True" -%}
// @antifeature  tracking Can track you
{% endif -%}
{% if cookiecutter.antifeature_miner == "True" -%}
// @antifeature  miner Can use your computer's resources to mine a crypto currency
{% endif -%}

{% if cookiecutter.separate_css == "True" %}
// @resource     styles {{ cookiecutter.__css_url}}
// @grant        GM_addStyle
// @grant        GM_getResourceText
{% endif -%}
// ==/UserScript==

{% if cookiecutter.separate_css == "True" %}
// https://github.com/greasemonkey/gm4-polyfill
if (typeof GM_addStyle === "undefined") {
    GM_addStyle = (aCss) => {
        "use strict";
        let head = document.getElementsByTagName("head")[0];
        if (head) {
            let style = document.createElement("style");
            style.setAttribute("type", "text/css");
            style.textContent = aCss;
            head.appendChild(style);
            return style;
        }
        return null;
    };
}

if (typeof GM_getResourceText === "undefined") {
    fetch("{{ cookiecutter.__css_url}}").then((response) => response.text().then((styles) => GM_addStyle(styles)));
} else {
    const styles = GM_getResourceText("styles");
    GM_addStyle(styles);
}
{% endif -%}
(function () {
    "use strict";

    // Your code here...
})();
