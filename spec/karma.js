// PhantomJS has `'ontouchstart' in document.documentElement`, but
// doesn't actually support touch. So force touch not to be used.
//
// http://code.google.com/p/phantomjs/issues/detail?id=375
// https://github.com/ariya/phantomjs/pull/408
// https://github.com/Leaflet/Leaflet/pull/1434#issuecomment-13843151
window.L_NO_TOUCH = true;
