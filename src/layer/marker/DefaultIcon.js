import {Icon} from './Icon.js';

/*
 * @miniclass DefaultIcon (Icon)
 * @section
 *
 * A subclass of `Icon`, represents the icon to use in `Marker`s when no icon is specified. The marker, with
 * a soft shadow under its tip, is one inlined SVG data URI, so it needs no image files.
 *
 * @example
 *
 * ```js
 * new Marker(latlng, {icon: new DefaultIcon({color: 'crimson'})}).addTo(map);
 * ```
 *
 * @option color: String = undefined
 * Paints the pin in the given CSS color instead of the default blue, overriding `iconUrl`.
 *
 * In order to customize the default icon, just change the properties of `DefaultIcon.defaultOptions`
 * (which is a set of `Icon options`).
 *
 * If you want to _completely_ replace the default icon, override the
 * `Marker.defaultOptions.icon` with your own icon instead.
 */

// the fill fades to the white underlay at the top, so a single color gets a highlight like the default one; the outline
// (a translucent gray stroke over it) keeps light colors visible, but would double the antialiased edges of the default
const pin = (fill, fillTop, stroke, strokeTop, outline = '') => `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="403.7 501.87 25.59 47.09"><radialGradient id="c"><stop stop-opacity=".3"/><stop offset=".5" stop-opacity=".15"/><stop offset="1" stop-opacity="0"/></radialGradient><ellipse cx="416.5" cy="543.4" rx="10.5" ry="5" fill="url(%23c)"/><linearGradient id="a" x2="0" y1="541" y2="503.4" gradientUnits="userSpaceOnUse"><stop stop-color="${fill}"/><stop offset="1" stop-color="${fillTop}" stop-opacity=".75"/></linearGradient><linearGradient id="b" x2="0" y1="522.5" y2="503.4" gradientUnits="userSpaceOnUse"><stop stop-color="${stroke}"/><stop offset="1" stop-color="${strokeTop}"/></linearGradient><defs><path id="p" d="M416.54 503.61c-6.57 0-12.04 5.69-12.04 11.87 0 2.78 1.56 6.31 2.69 8.75l9.31 17.87 9.26-17.87c1.13-2.44 2.74-5.79 2.74-8.75 0-6.18-5.38-11.87-11.96-11.87Zm0 7.16a4.71 4.71 0 0 1 4.68 4.71c0 2.59-2.1 4.66-4.68 4.68-2.58-.02-4.68-2.09-4.68-4.68a4.71 4.71 0 0 1 4.68-4.71Z"/></defs><circle cx="416.5" cy="515.5" r="4.7" fill="%23fff"/><use href="%23p" fill="%23fff"/><use href="%23p" fill="url(%23a)" stroke="url(%23b)" stroke-width="1.1" fill-rule="evenodd"/>${outline}</svg>`;

const defaultOptions = {
	iconUrl: pin('%23126FC6', '%23107BC2', '%232E6C97', '%233883B7'),
	iconSize: [25, 46],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	tooltipAnchor: [16, -28]
};

export class DefaultIcon extends Icon {

	static defaultOptions = defaultOptions;

	_getIconUrl(name) {
		const {color} = this.options;
		if (!color || name !== 'icon') { return super._getIconUrl(name); }
		const c = color.replace('#', '%23');
		return pin(c, c, c, c, '<use href="%23p" fill="none" stroke="%23666" stroke-opacity=".4" stroke-width="1.1"/>');
	}
}
