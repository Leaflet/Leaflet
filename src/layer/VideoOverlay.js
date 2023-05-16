import {ImageOverlay} from './ImageOverlay.js';
import * as DomUtil from '../dom/DomUtil.js';
import * as Util from '../core/Util.js';

/*
 * @class VideoOverlay
 * @aka L.VideoOverlay
 * @inherits ImageOverlay
 *
 * Used to load and display a video player over specific bounds of the map. Extends `ImageOverlay`.
 *
 * A video overlay uses the [`<video>`](https://developer.mozilla.org/docs/Web/HTML/Element/video)
 * HTML element.
 *
 * @example
 *
 * ```js
 * var videoUrl = 'https://www.mapbox.com/bites/00188/patricia_nasa.webm',
 * 	videoBounds = [[ 32, -130], [ 13, -100]];
 * L.videoOverlay(videoUrl, videoBounds ).addTo(map);
 * ```
 */

export const VideoOverlay = ImageOverlay.extend({

	// @section
	// @aka VideoOverlay options
	options: {
		// @option autoplay: Boolean = true
		// Whether the video starts playing automatically when loaded.
		// On some browsers autoplay will only work with `muted: true`
		autoplay: true,

		// @option loop: Boolean = true
		// Whether the video will loop back to the beginning when played.
		loop: true,

		// @option keepAspectRatio: Boolean = true
		// Whether the video will save aspect ratio after the projection.
		// Relevant for supported browsers. See [browser compatibility](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit)
		keepAspectRatio: true,

		// @option muted: Boolean = false
		// Whether the video starts on mute when loaded.
		muted: false,

		// @option playsInline: Boolean = true
		// Mobile browsers will play the video right where it is instead of open it up in fullscreen mode.
		playsInline: true
	},

	_initImage() {
		const wasElementSupplied = this._url.tagName === 'VIDEO';
		const vid = this._image = wasElementSupplied ? this._url : DomUtil.create('video');

		vid.classList.add('leaflet-image-layer');
		if (this._zoomAnimated) { vid.classList.add('leaflet-zoom-animated'); }
		if (this.options.className) { vid.classList.add(...Util.splitWords(this.options.className)); }

		vid.onselectstart = Util.falseFn;
		vid.onmousemove = Util.falseFn;

		// @event load: Event
		// Fired when the video has finished loading the first frame
		vid.onloadeddata = this.fire.bind(this, 'load');

		if (wasElementSupplied) {
			const sourceElements = vid.getElementsByTagName('source');
			const sources = [];
			for (let j = 0; j < sourceElements.length; j++) {
				sources.push(sourceElements[j].src);
			}

			this._url = (sourceElements.length > 0) ? sources : [vid.src];
			return;
		}

		if (!Array.isArray(this._url)) { this._url = [this._url]; }

		if (!this.options.keepAspectRatio && Object.hasOwn(vid.style, 'objectFit')) {
			vid.style['objectFit'] = 'fill';
		}
		vid.autoplay = !!this.options.autoplay;
		vid.loop = !!this.options.loop;
		vid.muted = !!this.options.muted;
		vid.playsInline = !!this.options.playsInline;
		for (let i = 0; i < this._url.length; i++) {
			const source = DomUtil.create('source');
			source.src = this._url[i];
			vid.appendChild(source);
		}
	}

	// @method getElement(): HTMLVideoElement
	// Returns the instance of [`HTMLVideoElement`](https://developer.mozilla.org/docs/Web/API/HTMLVideoElement)
	// used by this overlay.
});


// @factory L.videoOverlay(video: String|Array|HTMLVideoElement, bounds: LatLngBounds, options?: VideoOverlay options)
// Instantiates an image overlay object given the URL of the video (or array of URLs, or even a video element) and the
// geographical bounds it is tied to.

export function videoOverlay(video, bounds, options) {
	return new VideoOverlay(video, bounds, options);
}
