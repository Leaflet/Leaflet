
This file documents the common options passed to several map methods.


@miniclass Locate options (Map)
@aka locate options
@section

Some of the geolocation methods for `Map` take in an `options` parameter. This
is a plain javascript object with the following optional components:

@option watch: Boolean = false
If `true`, starts continuous watching of location changes (instead of detecting it
once) using W3C `watchPosition` method. You can later stop watching using
`map.stopLocate()` method.


@option setView: Boolean = false
If `true`, automatically sets the map view to the user location with respect to
detection accuracy, or to world view if geolocation failed.

@option maxZoom: Number = Infinity
The maximum zoom for automatic view setting when using `setView` option.

@option timeout: Number = 10000
Number of milliseconds to wait for a response from geolocation before firing a
`locationerror` event.

@option maximumAge: Number = 0
Maximum age of detected location. If less than this amount of milliseconds
passed since last geolocation response, `locate` will return a cached location.

@option enableHighAccuracy: Boolean = false
Enables high accuracy, see [description in the W3C spec](http://dev.w3.org/geo/api/spec-source.html#high-accuracy).



@miniclass Zoom options (Map)
@aka zoom options
@section

Some of the `Map` methods which modify the zoom level take in an `options`
parameter. This is a plain javascript object with the following optional
components:


@option animate: Boolean
If not specified, zoom animation will happen if the zoom origin is inside the
current view. If `true`, the map will attempt animating zoom disregarding where
zoom origin is. Setting `false` will make it always reset the view completely
without animation.




@miniclass Pan options (Map)
@aka pan options
@section

Some of the `Map` methods which modify the center of the map take in an `options`
parameter. This is a plain javascript object with the following optional
components:

@option animate: Boolean
If `true`, panning will always be animated if possible. If `false`, it will
not animate panning, either resetting the map view if panning more than a
screen away, or just setting a new offset for the map pane (except for `panBy`
which always does the latter).

@option duration: Number = 0.25
Duration of animated panning, in seconds.

@option easeLinearity: Number = 0.25
The curvature factor of panning animation easing (third parameter of the
[Cubic Bezier curve](http://cubic-bezier.com/)). 1.0 means linear animation,
and the smaller this number, the more bowed the curve.

@option noMoveStart: Boolean = false
If `true`, panning won't fire `movestart` event on start (used internally for
panning inertia).


@miniclass Zoom/pan options (Map)
@aka zoom/pan options
@inherits Zoom options
@inherits Pan options


@miniclass FitBounds options (Map)
@aka fitBounds options
@inherits Zoom/pan options

@option paddingTopLeft: Point = [0, 0]
Sets the amount of padding in the top left corner of a map container that
shouldn't be accounted for when setting the view to fit bounds. Useful if you
have some control overlays on the map like a sidebar and you don't want them
to obscure objects you're zooming to.

@option paddingBottomRight: Point = [0, 0]
The same for the bottom right corner of the map.

@option padding: Point = [0, 0]
Equivalent of setting both top left and bottom right padding to the same value.

@option maxZoom: Number = null
The maximum possible zoom to use.


