// Browser detection for the few places in core that still need it

export default /* @__PURE__ */ detect();

function detect() {
	const chrome = userAgentContains('chrome');
	const safari = !chrome && userAgentContains('safari');
	const mobile = typeof orientation !== 'undefined';

	const reducedMotion = typeof navigator !== 'undefined' && navigator.preferences?.reducedMotion?.value ?
		navigator.preferences.reducedMotion.value === 'reduce' :
		typeof window === 'undefined' ? true : window?.matchMedia('(prefers-reduced-motion: reduce)').matches;

	// also `true` on a regular screen when the page zoom is above 100%
	const retina = typeof window === 'undefined' || typeof window.devicePixelRatio === 'undefined' ? false : window.devicePixelRatio > 1;

	const mac = typeof navigator === 'undefined' || typeof navigator.platform === 'undefined' ? false : navigator.platform.startsWith('Mac');
	const linux = typeof navigator === 'undefined' || typeof navigator.platform === 'undefined' ? false : navigator.platform.startsWith('Linux');

	return {
		chrome,
		safari,
		mobile,
		reducedMotion,
		retina,
		mac,
		linux
	};
}

function userAgentContains(str) {
	if (typeof navigator === 'undefined' || typeof navigator.userAgent === 'undefined') {
		return false;
	}
	return navigator.userAgent.toLowerCase().includes(str);
}
