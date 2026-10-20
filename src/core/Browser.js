// Browser detection for the few places in core that still need it

export default /* @__PURE__ */ detect();

function detect() {
	const chrome = userAgentContains('chrome');
	const safari = !chrome && userAgentContains('safari');
	const mobile = typeof orientation !== 'undefined';

	const reducedMotion = typeof navigator !== 'undefined' && navigator.preferences?.reducedMotion?.value ?
		navigator.preferences.reducedMotion.value === 'reduce' :
		typeof window === 'undefined' ? true : window?.matchMedia('(prefers-reduced-motion: reduce)').matches;

	const mac = typeof navigator === 'undefined' || typeof navigator.platform === 'undefined' ? false : navigator.platform.startsWith('Mac');

	return {
		chrome,
		safari,
		mobile,
		reducedMotion,
		mac
	};
}

function userAgentContains(str) {
	if (typeof navigator === 'undefined' || typeof navigator.userAgent === 'undefined') {
		return false;
	}
	return navigator.userAgent.toLowerCase().includes(str);
}
