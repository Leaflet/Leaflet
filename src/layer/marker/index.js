import {Icon} from './Icon.js';
export {icon} from './Icon.js';
import {IconDefault} from './Icon.Default.js';
Icon.Default = IconDefault;

const colors = ['Pink', 'DarkBlue', 'Lila', 'Magenta', 'Red', 'Orange', 'Brown', 'Green', 'Mint'];
for (const color of colors) {
	Icon.Default[color] = IconDefault.extend({
		options:{
			className: `default-icon-color-${color.toLowerCase()}`
		}
	});
}

export {Icon};

export {DivIcon, divIcon} from './DivIcon.js';
export {Marker, marker} from './Marker.js';
