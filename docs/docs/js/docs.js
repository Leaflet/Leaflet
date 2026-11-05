const tocCopy = document.createElement('div');
tocCopy.id = 'toc-copy';

const toc = document.querySelector('#toc');

if (toc) {
	// sidebar menu
	tocCopy.innerHTML = toc.innerHTML;
	document.getElementsByClassName('container')[0].appendChild(tocCopy);

	// one group is expanded at a time: the one being read, until a heading click picks another (or collapses it)
	let open;
	const openGroup = function openGroup(label) {
		open?.classList.remove('open');
		open = label;
		open?.classList.add('open');
	};

	const clickGroup = function clickGroup() {
		openGroup(this === open ? null : this);
	};
	for (const label of tocCopy.querySelectorAll('h4')) {
		label.addEventListener('click', clickGroup);
	}

	// behind the menu button: the button toggles the drawer, and following a link or clicking the page outside closes it
	const narrow = window.matchMedia('(max-width: 1350px)');
	tocCopy.addEventListener('click', function (e) {
		if (narrow.matches && (e.target === this || e.target.closest('a'))) {
			this.classList.toggle('active');
		}
	});
	document.addEventListener('click', (e) => {
		if (tocCopy.classList.contains('active') && !tocCopy.contains(e.target)) {
			e.preventDefault();
			e.stopPropagation();
			tocCopy.classList.remove('active');
		}
	}, true);

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

	// highlights the TOC entries of the last target scrolled past the sticky heading, and opens their group; a group's
	// own section (a plugin group's intro, before its first category) counts as part of the group
	const targets = new Map();
	const add = function add(el, group, link) {
		const target = targets.get(el) ?? {group, links: []};
		if (link) { target.links.push(link); }
		targets.set(el, target);
	};
	for (const a of tocCopy.querySelectorAll('a[href^="#"]')) {
		const el = document.getElementById(decodeURIComponent(a.hash.slice(1)));
		if (el) { add(el, a.closest('ul')?.previousElementSibling, a); }
	}
	for (const label of tocCopy.querySelectorAll('h4')) {
		const first = label.nextElementSibling.querySelector('a');
		let el = document.getElementById(decodeURIComponent(first.hash.slice(1)));
		if (el?.nodeName !== 'H3') { continue; }
		do { el = el.previousElementSibling; } while (el && el.nodeName !== 'H2' && el.nodeName !== 'H3');
		if (el?.nodeName === 'H2') { add(el, label); }
	}
	const sorted = [...targets.keys()].sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));

	// a target counts as reached 100px from the top, or lower if following a link to it lands it lower
	const padding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
	const reached = new Map(sorted.map(el => [el, Math.max(100, padding + parseFloat(getComputedStyle(el).scrollMarginTop) + 2)]));
	let current, frame;

	const highlight = function highlight() {
		frame = null;
		let found;
		for (const el of sorted) {
			if (el.getBoundingClientRect().top > reached.get(el)) { break; }
			found = el;
		}
		if (found === current) { return; }
		for (const el of tocCopy.querySelectorAll('.current')) { el.classList.remove('current'); }
		const group = targets.get(found)?.group;
		if (group !== targets.get(current)?.group) { openGroup(group); }
		current = found;
		group?.classList.add('current');
		for (const a of targets.get(current)?.links ?? []) { a.classList.add('current'); }
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
