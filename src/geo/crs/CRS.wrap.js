export var Wrap = {
	// An array of two numbers defining whether the longitude (horizontal) coordinate
	// axis wraps around a given range and how. Defaults to `[-180, 180]` in most
	// geographical CRSs. If `undefined`, the longitude axis does not wrap around.
	lng: undefined,

	// Like `wrapLng`, but for the latitude (vertical) axis.
	// wrapLng: [min, max],
	// wrapLat: [min, max],
	lat: undefined,
};

