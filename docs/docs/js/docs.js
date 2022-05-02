/* global hljs */
hljs.configure({tabReplace: '    '});
hljs.initHighlighting();

var tocCopy = document.createElement('div');
tocCopy.id = 'toc-copy';

var toc = document.querySelector('#toc');

if (toc) {
	var currentAnchor = '';

	// top menu
	var menus = document.querySelectorAll('#toc a');
	var i;

	for (i = 0; i < menus.length; i++) {
		menus[i].addEventListener('click', function (e) {
			clickOnAnchor(e);
		});
	}

	// sidebar menu
	tocCopy.innerHTML = toc.innerHTML;
	document.getElementsByClassName('container')[0].appendChild(tocCopy);

	menus = document.querySelectorAll('#toc-copy ul');
	i = 0;

	for (i = 0; i < menus.length; i++) {
		menus[i].addEventListener('mouseover', function () {
			this.previousElementSibling.classList.add('hover');
		});

		menus[i].addEventListener('mouseout', function () {
			this.previousElementSibling.classList.remove('hover');
		});

		menus[i].addEventListener('click', function (e) {
			clickOnAnchor(e);
		});
	}

	var labels = document.querySelectorAll('#toc-copy h4');

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

	var scrollPos = function scrollPos() {
		var scroll = window.scrollY;

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

	window.addEventListener('load', function () {
		var currentHash = window.location.hash;
		if (!currentHash) { return; }
		var elem = document.querySelector(currentHash);

		if (elem.tagName === 'H2' || elem.tagName === 'H4') {
			setTimeout(()=>{
				scrollToHeader(elem, true);
			}, 10);
		}
	}, false);
}


function clickOnAnchor(e) {
	// if the parent element of <a> is clicked we ignore it
	if (e.target.tagName !== 'A') {
		return;
	}

	var anchor = '#' + e.target.href.split('#')[1];
	var elemHeader = document.querySelector(anchor);

	scrollToHeader(elemHeader, '#' + elemHeader.id === currentAnchor);

	// prevent default browser anchor scroll
	e.preventDefault();
}

function scrollToHeader(elemHeader, sameAnchor) {
	var scrollBy = elemHeader.nextSibling.offsetTop;

	if (L.Browser.chrome && sameAnchor) {
		// chromium remove the anchor element from the scroll-position
		// we check with sameAnchor if the User has clicked on the same anchor link again
		scrollBy = scrollBy - elemHeader.offsetHeight;
	} else {
		// we scroll a little bit more down to get the element already sticky
		scrollBy += 5;
	}
	// scroll to the anchor
	window.scrollTo(0, scrollBy);
	// apply the new anchor to the location url
	currentAnchor = window.location.hash = '#' + elemHeader.id;
}
