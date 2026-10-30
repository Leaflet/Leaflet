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

	const menus = document.querySelectorAll('#toc-copy ul');

	for (const menu of menus) {
		menu.addEventListener('pointerover', function () {
			this.previousElementSibling.classList.add('hover');
		});

		menu.addEventListener('pointerout', function () {
			this.previousElementSibling.classList.remove('hover');
		});
	}

	const labels = document.querySelectorAll('#toc-copy h4');

	for (const label of labels) {
		label.addEventListener('click', function () {
			this.classList.toggle('active');
		});
	}

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
