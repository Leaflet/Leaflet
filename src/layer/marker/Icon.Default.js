import {Icon} from './Icon';
import * as DomUtil from '../../dom/DomUtil';

// The contents of src/image/marker-clean.svg, minus spaces, replacing '#' with '%23'.
var svgIcon = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="25" height="41"><defs><linearGradient id="c" gradientUnits="userSpaceOnUse" x1="0" y1="38.71" x2="0" y2="1.144"><stop offset="0" stop-color="%23126fc6"/><stop offset="1" stop-color="%234c9cd1"/></linearGradient><linearGradient id="d" gradientUnits="userSpaceOnUse" x1="0" y1="20.197" x2="0" y2="1.144"><stop offset="0" stop-color="%232e6c97"/><stop offset="1" stop-color="%233883b7"/></linearGradient></defs><path fill="%23fff" d="M6.329 5.286h12.625v14.5H6.329z"/><path d="M12.594 1.323c-6.573 0-12.044 5.691-12.044 11.866 0 2.778 1.564 6.308 2.694 8.746l9.306 17.872 9.262-17.872c1.13-2.438 2.738-5.791 2.738-8.746 0-6.175-5.383-11.866-11.956-11.866zm0 7.155c2.584.017 4.679 2.122 4.679 4.71s-2.095 4.663-4.679 4.679c-2.584-.017-4.679-2.09-4.679-4.679 0-2.588 2.095-4.693 4.679-4.71z" fill="url(%23c)" stroke="url(%23d)" stroke-width="1.1" stroke-linecap="round"/><path d="M12.581 2.43c-5.944 0-10.938 5.219-10.938 10.75 0 2.359 1.443 5.832 2.563 8.25l.031.031 8.313 15.969 8.25-15.969.031-.031c1.135-2.448 2.625-5.706 2.625-8.25 0-5.538-4.931-10.75-10.875-10.75zm0 4.969c3.168.021 5.781 2.601 5.781 5.781 0 3.18-2.613 5.761-5.781 5.781-3.168-.02-5.75-2.61-5.75-5.781 0-3.172 2.582-5.761 5.75-5.781z" fill="none" stroke="%23fff" stroke-width="1.1" stroke-linecap="round" stroke-opacity=".122"/></svg>';

// The contents of src/image/shadow-clean.svg, minus spaces, replacing '#' with '%23'.
var svgShadow = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="41" height="41"><defs><linearGradient id="d" x1="15.94" y1="40.63" x2="29.02" y2="10.85" gradientUnits="userSpaceOnUse"><stop offset="0.2" stop-color="gray" stop-opacity=".7"/><stop offset="0.8" stop-color="gray" stop-opacity="0"/></linearGradient><linearGradient id="f" x1="15.94" y1="40.63" x2="26.68" y2="10.94" gradientUnits="userSpaceOnUse"><stop offset="0.5" stop-color="gray" stop-opacity="0"/><stop offset="1" stop-color="gray" stop-opacity=".6"/></linearGradient><filter id="e" x="-.13" width="1.26" y="-.12" height="1.25" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="1"/></filter><filter id="g" x="-.49" width="1.97" y="-.46" height="1.93" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="5"/></filter></defs><path d="M27 14.1c-6.57 0-14.06 3.92-16.25 8.17-.99 1.92-.67 4.35-.41 6.03l2.96 12.33 15.6-12.33c2-1.68 4.8-3.99 5.85-6.03 2.2-4.25-1.17-8.18-7.75-8.18z" fill="url(%23d)" filter="url(%23e)"/><path d="M27 14.1c-6.57 0-14.06 3.92-16.25 8.17-.99 1.92-.67 4.35-.41 6.03l2.96 12.33 15.6-12.33c2-1.68 4.8-3.99 5.85-6.03 2.2-4.25-1.17-8.18-7.75-8.18z" fill="url(%23f)" filter="url(%23g)"/></svg>'


/*
 * @miniclass Icon.Default (Icon)
 * @aka L.Icon.Default
 * @section
 *
 * A trivial subclass of `Icon`, represents the icon to use in `Marker`s when
 * no icon is specified. Points to the blue marker image distributed with Leaflet
 * releases.
 *
 * In order to customize the default icon, just change the properties of `L.Icon.Default.prototype.options`
 * (which is a set of `Icon options`).
 *
 * If you want to _completely_ replace the default icon, override the
 * `L.Marker.prototype.options.icon` with your own icon instead.
 */

export var IconDefault = Icon.extend({
	options: {
		iconUrl:       'data:image/svg+xml,' + svgIcon,
		shadowUrl:     'data:image/svg+xml,' + svgShadow,
		iconSize:    [25, 41],
		iconAnchor:  [12, 41],
		popupAnchor: [1, -34],
		tooltipAnchor: [16, -28],
		shadowSize:  [41, 41]
	}
});
