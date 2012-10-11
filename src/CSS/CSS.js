(function(){
    function addCSS (cssText,cssTextIE) {
        if (document.createStyleSheet) { //this is true for IE 8 and older
            var styleSheet = document.createStyleSheet();
            styleSheet.cssText = cssText+cssTextIE;
        }
        else {
            var head = document.getElementByTagName("head")[0];
            var styleElt = document.createElement("style");
            head.appendChild(styleElt);
            styleElt.innerHTML = cssText;
        }
    }
    var css = L._css;
    addCSS(css.main, css.ie);
    delete L._css;
}());