// Opens the inherited group a link points into, for browsers that don't expand <details> on navigation
function openTarget() {
	const el = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
	const details = el?.closest('details:not([open])');
	if (details) {
		details.open = true;
		el.scrollIntoView();
	}
}
openTarget();
window.addEventListener('hashchange', openTarget);
