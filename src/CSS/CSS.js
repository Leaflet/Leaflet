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
    L.CSS.imagePath = (function () {
            var scripts = document.getElementsByTagName('script'),
                leafletRe = /\/?leaflet[\-\._]?([\w\-\._]*)\.js\??/;

            var i, len, src, matches;

            for (i = 0, len = scripts.length; i < len; i++) {
                src = scripts[i].src;
                matches = src.match(leafletRe);
                
                if (matches) {
                    return src.split(leafletRe)[0] + '/images';
                }
            }
        }());
    function parseLoc(css) {
        
        return css.replace(/url\(images\/(\S+)\)/g, function (all, part) {
                return "url(" + L.CSS.imagePath + "/" + part + ")";
            });
       
    }
    var css = L.CSS;
    addCSS(parseLoc(css.main), css.ie);
}());