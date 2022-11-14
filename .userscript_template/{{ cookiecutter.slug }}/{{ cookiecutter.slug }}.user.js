// ==UserScript==
// @name         {{ cookiecutter.name }} script
// @namespace    {{ cookiecutter.repository_name }}
// @version      {{ cookiecutter.version }}
// @description  {{ cookiecutter.description }}
// @author       {{ cookiecutter.author }}
// @homepageURL  {{ cookiecutter.__repository }}
// @supportURL   {{ cookiecutter.__repository }}/issues
// @updateURL    {{ cookiecutter.update_url }}
// @downloadURL  {{ cookiecutter.update_url }}
// @license      {{ cookiecutter.license }}

{%- if cookiecutter.noframes -%}
// @noframes -
{% endif %}

{%- if cookiecutter.unwrap -%}
// @unwrap
{% endif %}
// @run-at       document-start, document-end, document-idle
// @grant        GM_addStyle
// @connect      *
// @require      *
// @resource     *
// @icon         *
{{ cookiecutter.antifeatures|jsonify|indent(0) }}
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();
