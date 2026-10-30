// Permalink icons are ::before boxes left of headings and rows (main.css), so a click left of the element is on one
document.addEventListener('click', (e) => {
	const el = e.target.closest('h2[id], tr[id]');
	if (el && e.offsetX < 0) { location.hash = el.id; }
});

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
