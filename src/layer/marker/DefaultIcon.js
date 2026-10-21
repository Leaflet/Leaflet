import {Icon} from './Icon.js';

/*
 * @miniclass DefaultIcon (Icon)
 * @section
 *
 * A trivial subclass of `Icon`, represents the icon to use in `Marker`s when
 * no icon is specified. The blue marker and its shadow are inlined as SVG data URIs,
 * so they work with any bundler and need no image files.
 *
 * In order to customize the default icon, just change the properties of `DefaultIcon.defaultOptions`
 * (which is a set of `Icon options`).
 *
 * If you want to _completely_ replace the default icon, override the
 * `Marker.defaultOptions.icon` with your own icon instead.
 */

export class DefaultIcon extends Icon {

	static defaultOptions = {
		iconUrl: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="403.7 501.87 25.59 41.96"><linearGradient id="a" x2="0" y1="541" y2="503.4" gradientUnits="userSpaceOnUse"><stop stop-color="%23126FC6"/><stop offset="1" stop-color="%234C9CD1"/></linearGradient><linearGradient id="b" x2="0" y1="522.5" y2="503.4" gradientUnits="userSpaceOnUse"><stop stop-color="%232E6C97"/><stop offset="1" stop-color="%233883B7"/></linearGradient><circle cx="416.5" cy="515.5" r="4.7" fill="%23fff"/><path fill="url(%23a)" stroke="url(%23b)" stroke-width="1.1" fill-rule="evenodd" d="M416.54 503.61c-6.57 0-12.04 5.69-12.04 11.87 0 2.78 1.56 6.31 2.69 8.75l9.31 17.87 9.26-17.87c1.13-2.44 2.74-5.79 2.74-8.75 0-6.18-5.38-11.87-11.96-11.87Zm0 7.16a4.71 4.71 0 0 1 4.68 4.71c0 2.59-2.1 4.66-4.68 4.68-2.58-.02-4.68-2.09-4.68-4.68a4.71 4.71 0 0 1 4.68-4.71Z"/></svg>',
		shadowUrl: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 817 820"><radialGradient id="a" cx="527" cy="487" r="479" fx="276" fy="894" gradientUnits="userSpaceOnUse"><stop stop-color="%235c5c5c" stop-opacity=".95"/><stop offset=".11" stop-color="%23474747" stop-opacity=".78"/><stop offset=".34" stop-color="%23202020" stop-opacity=".44"/><stop offset=".52" stop-color="%23090909" stop-opacity=".17"/><stop offset=".64" stop-opacity="0"/></radialGradient><path fill="url(%23a)" fill-opacity=".7" style="filter:blur(15px)" d="M779 483c-34 53-102 94-150 125L256 820 169 522l171-300 10-17C421 95 585 56 703 133s147 240 76 350"/></svg>',
		iconSize: [25, 41],
		iconAnchor: [12, 41],
		popupAnchor: [1, -34],
		tooltipAnchor: [16, -28],
		shadowSize: [41, 41]
	};
}
