# userscripts

# Scripts
<!-- start_scripts_links -->
* [Better Opennet script](https://raw.githubusercontent.com/ilyachch/userscripts/main/userscripts/better_opennet/better_opennet.user.js) - 0.2.0
* [Better Shortcut script](https://raw.githubusercontent.com/ilyachch/userscripts/main/userscripts/better_shortcut/better_shortcut.user.js) - 0.1.0
* [Better Youtube script](https://raw.githubusercontent.com/ilyachch/userscripts/main/userscripts/better_youtube/better_youtube.user.js) - 0.0.2
* [Better habr script](https://raw.githubusercontent.com/ilyachch/userscripts/main/userscripts/better_habr/better_habr.user.js) - 0.4.2
* [Better rezka script](https://raw.githubusercontent.com/ilyachch/userscripts/main/userscripts/better_rezka/better_rezka.user.js) - 3.1.0
* [Github files resolver script](https://raw.githubusercontent.com/ilyachch/userscripts/main/userscripts/github_files_resolver/github_files_resolver.user.js) - 1.2.0
* [Markdown tools script](https://raw.githubusercontent.com/ilyachch/userscripts/main/userscripts/markdown_tools/markdown_tools.user.js) - 0.4.2
* [Media Speed](https://raw.githubusercontent.com/ilyachch/userscripts/main/userscripts/media_speed/media_speed.user.js) - 0.4.0
* [Pikabu tabs](https://raw.githubusercontent.com/ilyachch/userscripts/main/userscripts/pikabu_tabs/pikabu_tabs.user.js) - 0.0.1
<!-- end_scripts_links -->

## Usefull links
* https://wiki.greasespot.net/Metadata_Block
* https://www.tampermonkey.net/documentation.php#_match
* https://openuserjs.org/
* https://greasyfork.org/
* https://simply-how.com/enhance-and-fine-tune-any-web-page-the-complete-user-scripts-guide#section-3

# Styles
<!-- start_styles_links -->
* [4pda style](https://raw.githubusercontent.com/ilyachch/userscripts/main/usercss/4pda/4pda.user.css) - 0.1.0
* [acomics style](https://raw.githubusercontent.com/ilyachch/userscripts/main/usercss/acomics/acomics.user.css) - 0.0.1
* [adme style](https://raw.githubusercontent.com/ilyachch/userscripts/main/usercss/adme/adme.user.css) - 0.0.2
* [dcealopez style](https://raw.githubusercontent.com/ilyachch/userscripts/main/usercss/dcealopez/dcealopez.user.css) - 0.0.1
* [feedly style](https://raw.githubusercontent.com/ilyachch/userscripts/main/usercss/feedly/feedly.user.css) - 0.0.4
* [free-freecell-solitair style](https://raw.githubusercontent.com/ilyachch/userscripts/main/usercss/free_freecell_solitair/free_freecell_solitair.user.css) - 0.0.1
* [free-play-sudoku style](https://raw.githubusercontent.com/ilyachch/userscripts/main/usercss/free_play_sudoku/free_play_sudoku.user.css) - 0.0.1
* [github style](https://raw.githubusercontent.com/ilyachch/userscripts/main/usercss/github/github.user.css) - 0.0.3
* [kinopoisk style](https://raw.githubusercontent.com/ilyachch/userscripts/main/usercss/kinopoisk/kinopoisk.user.css) - 0.0.1
* [rezka style](https://raw.githubusercontent.com/ilyachch/userscripts/main/usercss/rezka/rezka.user.css) - 0.3.0
* [rollbar style](https://raw.githubusercontent.com/ilyachch/userscripts/main/usercss/rollbar/rollbar.user.css) - 0.0.1
* [seasonvar style](https://raw.githubusercontent.com/ilyachch/userscripts/main/usercss/seasonvar/seasonvar.user.css) - 1.1.0
* [tprogger style](https://raw.githubusercontent.com/ilyachch/userscripts/main/usercss/tprogger/tprogger.user.css) - 1.0.0
* [whatsapp style](https://raw.githubusercontent.com/ilyachch/userscripts/main/usercss/whatsapp/whatsapp.user.css) - 0.0.1
* [youtube style](https://raw.githubusercontent.com/ilyachch/userscripts/main/usercss/youtube/youtube.user.css) - 0.3.1
<!-- end_styles_links -->

## Usefull links
* https://github.com/openstyles/stylus/wiki/Usercss
* https://github.com/openstyles/stylus/wiki/Writing-UserCSS


# How to add new scripts and styles:

For making template Cookiecutter is used. Install cookiecutter and make new template:

```
pip install cookiecutter
```
or
```
pipx install cookiecutter
```


References:
* https://cookiecutter.readthedocs.io/en/stable/overview.html
* https://github.com/audreyfeldroy/cookiecutter-pypackage

## Create new script

### Workflow with styles

```
$ make user_script
name [Custom Script]: some site
slug [some_site]:
namespace [ilyachch/userscripts/user_scripts]:
version [0.0.1]:
description [Custom Script - some site]:
license [MIT]:
repository_name [ilyachch/userscripts]:
author [ilyachch (https://github.com/ilyachch/userscripts)]:
Select run_at:
1 - document-end
2 - document-start
3 - document-body
4 - document-idle
5 - context-menu
Choose from 1, 2, 3, 4, 5 [1]:
match [*://*/*]:
icon []:
noframes [False]:
unwrap [False]:
antifeature_ads [False]:
antifeature_tracking [False]:
antifeature_miner [False]:
separate_css [False]: True
```

This will create a folder with the name `some_site` and a files `some_site.user.js`, `some_site.user.css` in it:
```
userscripts/some_site/
├── some_site.user.css
└── some_site.user.js
```

```js
// ==UserScript==
// @name         some site script
// @namespace    ilyachch/userscripts
// @version      0.0.1
// @description  Custom Script - some site
// @author       ilyachch (https://github.com/ilyachch/userscripts)
// @homepageURL  https://github.com/ilyachch/userscripts
// @source       https://github.com/ilyachch/userscripts/blob/main/userscripts/some_site/some_site.user.js
// @supportURL   https://github.com/ilyachch/userscripts/issues
// @updateURL    https://raw.githubusercontent.com/ilyachch/userscripts/main/userscripts/some_site/some_site.user.js
// @downloadURL  https://raw.githubusercontent.com/ilyachch/userscripts/main/userscripts/some_site/some_site.user.js
// @license      MIT

// @run-at       document-end
// @match        *://*/*

// @resource     styles https://raw.githubusercontent.com/ilyachch/userscripts/main/userscripts/some_site/some_site.user.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// ==/UserScript==

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
    fetch(
        "https://raw.githubusercontent.com/ilyachch/userscripts/main/userscripts/some_site/some_site.user.css"
    ).then((response) => response.text().then((styles) => GM_addStyle(styles)));
} else {
    const styles = GM_getResourceText("styles");
    GM_addStyle(styles);
}
(function () {
    "use strict";

    // Your code here...
})();
```

### Workflow without styles

```
$ make user_script
name [Custom Script]: some site
slug [some_site]:
namespace [ilyachch/userscripts/user_scripts]:
version [0.0.1]:
description [Custom Script - some site]:
license [MIT]:
repository_name [ilyachch/userscripts]:
author [ilyachch (https://github.com/ilyachch/userscripts)]:
Select run_at:
1 - document-end
2 - document-start
3 - document-body
4 - document-idle
5 - context-menu
Choose from 1, 2, 3, 4, 5 [1]:
match [*://*/*]:
icon []:
noframes [False]:
unwrap [False]:
antifeature_ads [False]:
antifeature_tracking [False]:
antifeature_miner [False]:
separate_css [False]:
```

This will create a folder with the name `some_site` and a file `some_site.user.js` in it:
```
userscripts/some_site/
└── some_site.user.js
```

```js
// ==UserScript==
// @name         some site script
// @namespace    ilyachch/userscripts
// @version      0.0.1
// @description  Custom Script - some site
// @author       ilyachch (https://github.com/ilyachch/userscripts)
// @homepageURL  https://github.com/ilyachch/userscripts
// @source       https://github.com/ilyachch/userscripts/blob/main/userscripts/some_site/some_site.user.js
// @supportURL   https://github.com/ilyachch/userscripts/issues
// @updateURL    https://raw.githubusercontent.com/ilyachch/userscripts/main/userscripts/some_site/some_site.user.js
// @downloadURL  https://raw.githubusercontent.com/ilyachch/userscripts/main/userscripts/some_site/some_site.user.js
// @license      MIT

// @run-at       document-end
// @match        *://*/*
// ==/UserScript==

const css = ``

let style = document.createElement('style');
style.innerHTML = css;
document.head.appendChild(style);

(function () {
    "use strict";

    // Your code here...
})();

```


## Create new style

### Common workflow
```
$ make user_style
name [Custom CSS]: some site
slug [some_site]:
namespace [ilyachch/userscripts]:
version [0.0.1]:
description [Custom CSS - some site]:
license [MIT]:
Select preprocessor:
1 - default
2 - uso
3 - less
4 - stylus
Choose from 1, 2, 3, 4 [1]:
repository_name [ilyachch/userscripts]:
update_url [https://raw.githubusercontent.com/ilyachch/userscripts/main/usercss/some_site/some_site.user.css]:
author [ilyachch (https://github.com/ilyachch/userscripts)]:
Select filter_by:
1 - domain
2 - url
3 - url-prefix
4 - regexp
Choose from 1, 2, 3, 4 [1]:
```

This will create a folder with the name `some_site` and a file `some_site.user.css` in it:
```
usercss/some_site/
└── some_site.user.css
```

```css
/* ==UserStyle==
@name         some site style
@namespace    ilyachch/userscripts/styles
@version      0.0.1
@description  Custom CSS - some site
@author       ilyachch (https://github.com/ilyachch/userscripts)
@homepageURL  https://github.com/ilyachch/userscripts
@supportURL   https://github.com/ilyachch/userscripts/issues
@updateURL    https://raw.githubusercontent.com/ilyachch/userscripts/main/usercss/some_site/some_site.user.css
@license      MIT
@preprocessor default
==/UserStyle== */

@-moz-document domain("some_site") {
    /* Your CSS goes here */
}
```

You should change `author` while creating a new style. Also you should change `domain("some_site")`.

### Quick workflow

Command:
```
$ name=some_site make simple_user_style
```

This will create a folder with the name `some_site` and a file `some_site.user.css` in it:
```
usercss/some_site/
└── some_site.user.css
```

```css
/* ==UserStyle==
@name         some_site style
@namespace    ilyachch/userscripts/styles
@version      0.0.1
@description  Custom CSS - some_site
@author       ilyachch (https://github.com/ilyachch/userscripts)
@homepageURL  https://github.com/ilyachch/userscripts
@supportURL   https://github.com/ilyachch/userscripts/issues
@updateURL    https://raw.githubusercontent.com/ilyachch/userscripts/main/usercss/some_site/some_site.user.css
@license      MIT
@preprocessor default
==/UserStyle== */

@-moz-document domain("some_site") {
    /* Your CSS goes here */
}
```

You should change `@author` and `domain("some_site")`.

## Renew README

```
make readme
```

this will update `README.md` with new scripts and styles links.
