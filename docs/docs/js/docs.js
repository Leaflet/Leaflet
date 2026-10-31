/* global hljs */
hljs.configure({tabReplace: '    '});
hljs.initHighlighting();

const tocCopy = document.createElement('div');
tocCopy.id = 'toc-copy';

const toc = document.querySelector('#toc');

if (toc) {
	// sidebar menu
	tocCopy.innerHTML = toc.innerHTML;
	document.getElementsByClassName('container')[0].appendChild(tocCopy);

	// a hovered group opens its flyout at once, unless the pointer is heading for the open flyout's links: then the
	// switch waits until it stops doing so, so it can cross the headings below on its way
	const floating = window.matchMedia('(min-width: 1350px) and (min-height: 600px)');
	const trail = [];
	let open, pending, timer;

	const openGroup = function openGroup(label) {
		clearTimeout(timer);
		pending = null;
		trail.length = 0;
		open?.classList.remove('hover');
		open = label;
		open?.classList.add('hover');
	};

	// whether the pointer's last few moves (since the flyout opened) point between the flyout's top and bottom left
	// corners
	const aiming = function aiming(to = trail.at(-1)) {
		const from = trail[0];
		if (!open || !from || to.x <= from.x) { return false; }
		const {left, top, bottom} = open.nextElementSibling.getBoundingClientRect();
		if (left <= from.x) { return false; }
		const slope = (to.y - from.y) / (to.x - from.x);
		return slope >= (top - from.y) / (left - from.x) && slope <= (bottom - from.y) / (left - from.x);
	};

	tocCopy.addEventListener('pointermove', (e) => {
		trail.push({x: e.clientX, y: e.clientY});
		if (trail.length > 4) { trail.shift(); }
		if (pending && !aiming()) { openGroup(pending); }
	});

	const keepGroup = function keepGroup() {
		clearTimeout(timer);
		pending = null;
	};
	const enterGroup = function enterGroup(e) {
		if (this === open) {
			keepGroup();
		} else if (aiming({x: e.clientX, y: e.clientY})) {
			clearTimeout(timer);
			pending = this;
			timer = setTimeout(openGroup, 300, this);
		} else {
			openGroup(this);
		}
	};

	// floating, a heading jumps to its first entry; behind the menu button, it expands its group
	const clickGroup = function clickGroup() {
		if (floating.matches) {
			this.nextElementSibling.querySelector('a').click();
		} else {
			this.classList.toggle('active');
		}
	};

	for (const menu of tocCopy.querySelectorAll('ul')) {
		menu.addEventListener('pointerenter', keepGroup);
	}
	for (const label of tocCopy.querySelectorAll('h4')) {
		label.addEventListener('pointerenter', enterGroup);
		label.addEventListener('click', clickGroup);
	}
	tocCopy.addEventListener('pointerleave', () => {
		timer = setTimeout(openGroup, 200, null);
	});

	tocCopy.addEventListener('click', function (e) {
		if (e.target.nodeName !== 'H4') {
			this.classList.toggle('active');
		}
	});

	const scrollPos = function scrollPos() {
		const scroll = window.scrollY;

		if (scroll >= (toc.offsetHeight + toc.offsetTop)) {
			document.body.classList.add('scrolled');
		} else {
			document.body.classList.remove('scrolled');
		}
	};

	scrollPos();

	window.addEventListener('scroll', () => {
		scrollPos();
	});

	// highlights the TOC entries of the last target scrolled past the sticky heading, and their groups
	const targets = new Map();
	for (const a of tocCopy.querySelectorAll('a[href^="#"]')) {
		const el = document.getElementById(decodeURIComponent(a.hash.slice(1)));
		if (el) { targets.set(el, [...(targets.get(el) ?? []), a]); }
	}
	const sorted = [...targets.keys()].sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
	let current, frame;

	const highlight = function highlight() {
		frame = null;
		let found;
		for (const el of sorted) {
			if (el.getBoundingClientRect().top > 100) { break; }
			found = el;
		}
		if (found === current) { return; }
		for (const el of tocCopy.querySelectorAll('.current')) { el.classList.remove('current'); }
		current = found;
		for (const a of targets.get(current) ?? []) {
			a.classList.add('current');
			a.closest('ul').previousElementSibling.classList.add('current');
		}
	};

	highlight();

	window.addEventListener('scroll', () => {
		frame ??= requestAnimationFrame(highlight);
	});
}

const backToTop = document.querySelector('#back-to-top');
backToTop.addEventListener('click', () => {
	document.documentElement.scrollIntoView({behavior: 'smooth'});
});

let lastScrollY = window.scrollY;
const scrollEventHandler = function scrollEventHandler() {
	const {scrollY} = window;

	if (scrollY !== 0 && scrollY < lastScrollY) {
		backToTop.classList.add('is-visible');
	} else {
		backToTop.classList.remove('is-visible');
	}

	lastScrollY = scrollY;
};

window.addEventListener('scroll', () => {
	scrollEventHandler();
});
