import {Icon} from './Icon.js';
export {icon} from './Icon.js';
import {IconDefault} from './Icon.Default.js';
Icon.Default = IconDefault;

for (const color of ['Pink', 'DarkBlue', 'Lila', 'Magenta', 'Red', 'Orange', 'Brown', 'Green', 'Mint']) {
	Icon.Default[color] = IconDefault.extend({
		options:{
			className: `default-icon-color-${color.toLowerCase()}`
		}
	});
}
Icon.Default.Blue = IconDefault;

/**
 * @miniclass Colored default icons (Icon)
 * @section
 *
 * `L.Icon.Default` has several static properties providing different coloured versions of the default icon.
 *
 * Usage is as: `L.marker(latlng, { icon: new L.Icon.Default.Green() })`
 *
 * Note that `L.Icon.Default.Blue` behaves the same as `L.Icon.Default`.
 *
 * @property Pink: L.Icon
 * The default icon, but tinted pink
 * @property Blue: L.Icon
 * The default icon, but tinted blue (same as default)
 * @property DarkBlue: L.Icon
 * The default icon, but tinted dark blue
 * @property Lila: L.Icon
 * The default icon, but tinted lila
 * @property Magenta: L.Icon
 * The default icon, but tinted magenta
 * @property Red: L.Icon
 * The default icon, but tinted red
 * @property Orange: L.Icon
 * The default icon, but tinted orange
 * @property Brown: L.Icon
 * The default icon, but tinted brown
 * @property Green: L.Icon
 * The default icon, but tinted green
 * @property Mint: L.Icon
 * The default icon, but tinted bluish green
 */

export {Icon};

export {DivIcon, divIcon} from './DivIcon.js';
export {Marker, marker} from './Marker.js';
