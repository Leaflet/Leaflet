var L, originalL;

if (typeof exports !== undefined + '') {
	L = exports;
} else {
	originalL = window.L;
	L = {};

	L.noConflict = function () {
		window.L = originalL;
		return this;
	};

	window.L = L;
}

L.version = '0.4.4';
function loadCSS(){
var browser =(function(){
//lovingly taken from the rhinosourus book of javascript which took it from jquery
var match=  /(msie)[ \/]([\w.]+)/.exec(navigator.userAgent.toLowerCase())||[];
return (match[1]==="msie"&& parseInt(match[2])<=8);
}());


     var head = document.getElementsByTagName("head")[0];
     head.appendChild(makeLink("http://leaflet.cloudmade.com/dist/leaflet.css"));
     if(browser.name==="msie"&&parseInt(browser.version)<=7){
         head.appendChild(makeLink("http://leaflet.cloudmade.com/dist/leaflet.ie.css"));
     }


function makeLink(url){
    var linkel = document.createElement("link");
    linkel.rel="stylesheet";
    linkel.href=url;
    return linkel;
}
}
loadCSS();