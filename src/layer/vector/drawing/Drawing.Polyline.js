/*
 * Enable drawing and editing support for polylines.
 */
L.Polyline = L.Polyline.extend({
  includes: [L.Drawing, L.Drawing.LineUtils],
});

