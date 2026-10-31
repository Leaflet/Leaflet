import {ImageOverlay} from './ImageOverlay.js';
import * as DomUtil from '../dom/DomUtil.js';
import * as DomEvent from '../dom/DomEvent.js';
import * as Util from '../core/Util.js';

/** @import {Defaults, LeafletEvent, VideoOverlayEventMap, VideoOverlayOptions} from '../types.js' */

const defaultOptions = {
	/**
	 * Whether the video starts playing automatically when loaded. On some browsers autoplay will only work with
	 * `muted: true`.
	 */
	autoplay: true,

	/**
	 * Whether the browser will offer controls to allow the user to control video
	 * playback, including volume, seeking, and pause/resume playback.
	 */
	controls: false,

	/** Whether the video will loop back to the beginning when played. */
	loop: true,

	/** Whether the video will save aspect ratio after the projection. */
	keepAspectRatio: true,

	/** Whether the video starts on mute when loaded. */
	muted: false,

	/** Mobile browsers will play the video right where it is instead of open it up in fullscreen mode. */
	playsInline: true
};

/** @typedef {typeof defaultOptions} VideoOverlayDefaults */

/**
 * @typedef {Object} VideoOverlayEvents
 * @property {LeafletEvent} load Fired when the video has finished loading the first frame.
 */

/**
 * Used to load and display a video player over specific bounds of the map. Extends `ImageOverlay`.
 *
 * A video overlay uses the [`<video>`](https://developer.mozilla.org/docs/Web/HTML/Element/video) HTML element.
 * @constructorDescription Instantiates a video overlay given the URL of the video (or an array of URLs, or a video
 * element) and the geographical bounds it is tied to.
 * @example
 * ```js
 * const videoUrl = 'https://www.mapbox.com/bites/00188/patricia_nasa.webm',
 * 	videoBounds = [[ 32, -130], [ 13, -100]];
 * new VideoOverlay(videoUrl, videoBounds ).addTo(map);
 * ```
 * @template {VideoOverlayOptions} [O=VideoOverlayOptions]
 * @template {VideoOverlayEventMap} [E=VideoOverlayEventMap]
 * @extends {ImageOverlay<O, E, HTMLVideoElement, string | string[] | HTMLVideoElement>}
 */
export class VideoOverlay extends ImageOverlay {

	/** @type {Defaults<VideoOverlayOptions>} */
	static defaultOptions = defaultOptions;

	_initImage() {
		const video = this._url,
		wasElementSupplied = video instanceof HTMLVideoElement,
		vid = this._image = wasElementSupplied ? video : DomUtil.create('video');

		vid.classList.add('leaflet-image-layer', 'leaflet-zoom-animated');
		if (this.options.className) { vid.classList.add(...Util.splitWords(this.options.className)); }

		DomEvent.on(vid, 'pointerdown', (e) => {
			if (vid.controls) {
				// Prevent the map from moving when the video or the seekbar is moved
				DomEvent.stopPropagation(e);
			}
		});

		vid.onloadeddata = this.fire.bind(this, 'load');

		if (wasElementSupplied) {
			const sourceElements = vid.getElementsByTagName('source');
			const sources = Array.from(sourceElements, e => e.src);
			this._url = (sourceElements.length > 0) ? sources : [vid.src];
			return;
		}

		const urls = this._url = Array.isArray(video) ? video : [video];

		if (!this.options.keepAspectRatio) {
			vid.style['objectFit'] = 'fill';
		}
		vid.autoplay = !!this.options.autoplay;
		vid.controls = !!this.options.controls;
		vid.loop = !!this.options.loop;
		vid.muted = !!this.options.muted;
		vid.playsInline = !!this.options.playsInline;
		for (const url of urls) {
			const source = DomUtil.create('source');
			source.src = url;
			vid.appendChild(source);
		}
	}
}
