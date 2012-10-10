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

(function(){
var isIE =(function(){
//lovingly adapted from the rhinosourus book of javascript which took it from jquery
var match=  /(msie)[ \/]([\w.]+)/.exec(navigator.userAgent.toLowerCase())||[];
return (match[1]==="msie"&& parseInt(match[2])<=8);
}());
//isIE is true if the browswer is IE lte 8

     var head = document.getElementsByTagName("head")[0];
     var scripts=document.getElementsByTagName("script");
     var base =getBase(scripts);//in which we figure out the directory leaflet is loaded from
     head.appendChild(makeLink(base+"leaflet.css"));//load the main css
     if(isIE){
         head.appendChild(makeLink(base+"leaflet.ie.css"));
     }//going forward, probobly want to do feature testing to add these in one by oen
    

function makeLink(url){
    var linkel = document.createElement("link");
    linkel.rel="stylesheet";
    linkel.href=url;
    return linkel;
}
function getBase(s){
    var len = s.length;
    var url;
        if(len===1){
             url=s[0].src
        }//if it's the only script
        else{
            for(var i = 0;i<len;i++){
                var tu=s[i].src;
                var ta=tu.split("/")
                if(ta[ta.length-1]==="leaflet.js"){
                    url=tu;
                    break;
                }
            }
        }//finds the only script that ends in /leaflet.js
    var urla=url.split("/");
    urla.pop();
    var base = urla.join("/");
    return base+"/";
    }
}());