// Trick Leaflet into believing we have a touchscreen (for desktop)
if (window.TouchEvent) { window.ontouchstart = function(){} };

// allow tests for `detectRetina`
window.devicePixelRatio = 2;
