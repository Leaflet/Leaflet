/*
 * Enable drawing and editing support for polygons.
 */
L.Polygon = L.Polygon.extend({
  includes: [L.Drawing, L.Drawing.LineUtils],
});

