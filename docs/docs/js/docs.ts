/* global hljs */
import hljs from 'highlight.js';

hljs.configure({ tabReplace: '    ' });
hljs.initHighlighting();

const tocCopy = document.createElement('div');
tocCopy.id = 'toc-copy';

const toc = document.querySelector('#toc');

if (toc) {
	tocCopy.innerHTML = toc.innerHTML;
	document.getElementsByClassName('container')[0].appendChild(tocCopy);

	var menus = document.querySelectorAll('#toc-copy ul');
	var i;

	for (i = 0; i < menus.length; i++) {
		menus[i].addEventListener('mouseover', function () {
			this.previousElementSibling.classList.add('hover');
		});

		menus[i].addEventListener('mouseout', function () {
			this.previousElementSibling.classList.remove('hover');
		});
	}

	const labels = document.querySelectorAll('#toc-copy h4');

	for (i = 0; i < labels.length; i++) {
		labels[i].addEventListener('click', function () {
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

	window.addEventListener('scroll', function () {
		scrollPos();
	});
}
