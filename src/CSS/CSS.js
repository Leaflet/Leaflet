(function () {
    function addCSS(cssText, cssTextIE) {
        if (document.createStyleSheet) { //this is true for IE 8 and older
            var styleSheet = document.createStyleSheet();
            styleSheet.cssText = cssText + cssTextIE;
        }
        else {
            var head = document.getElementsByTagName("head")[0];
            var styleElt = document.createElement("style");
            head.appendChild(styleElt);
            styleElt.innerHTML = cssText;
        }
    }
    function parseLoc(css) {
        var scripts = document.getElementsByTagName('script');
        var scriptURL = scripts[scripts.length - 1].src;
        var dirNum = scriptURL.lastIndexOf("/");
        if (dirNum === -1) {
            return css;
        } else if (dirNum >= 0) {
            var base = scriptURL.slice(0, dirNum) + "/";
            return css.replace(/url\(images\/(\S+)\)/g, function (all, part) {
                return "url(" + base + "images/" + part + ")";
            });
        }
    }
    var css = L._css;
    addCSS(parseLoc(css.main), css.ie);
    delete L._css;
}());