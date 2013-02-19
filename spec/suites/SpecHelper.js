function noSpecs() {
	xit('has no specs');
}

if (!Array.prototype.map) {
  Array.prototype.map = function(fun /*, thisp */) {
    "use strict";

    if (this === void 0 || this === null)
      throw new TypeError();

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== "function")
      throw new TypeError();

    var res = new Array(len);
    var thisp = arguments[1];
    for (var i = 0; i < len; i++) {
      if (i in t)
        res[i] = fun.call(thisp, t[i], i, t);
    }

    return res;
  };
}