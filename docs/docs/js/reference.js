if (document.body.className.indexOf('api-page') !== -1) {

	var elems = document.querySelectorAll('h2, h3, h4, tr');

	for (var i = 0, len = elems.length; i < len; i++) {
		var el = elems[i];

		if (el.id) {
			var anchor = document.createElement('a');
			anchor.setAttribute('data-anchor', el.id);
			if (!el.children.length) {
				// For headers, insert the anchor before.
				el.parentNode.insertBefore(anchor, el);

				// Clicking on the row (meaning "the link icon on the ::before)
				// jumps to the item
				el.onclick = function () {
					return function (ev) {
						if (ev.offsetX < 0) {
							window.location.hash = '#' + ev.target.id;
						}
					};
				}(el.id);
			} else {
				// For table rows, insert the anchor inside the first <td>
				el.querySelector('td').appendChild(anchor);

				// Clicking on the row (meaning "the link icon on the ::before)
				// jumps to the item
				el.parentNode.onclick = function () {
					return function (ev) {
						if (ev.offsetX < 0) {
							window.location.hash = '#' + ev.target.parentNode.id;
						}
					};
				}(el.id);
			}
		}
	}

	elems = document.querySelectorAll('div.accordion');
	for (i = 0, len = elems.length; i < len; i++) {
		el = elems[i];

		el.querySelector('label').addEventListener('click', function (c) {
			return function () {
				if (c.className === 'accordion expanded') {
					c.className = 'accordion collapsed';
				} else {
					c.className = 'accordion expanded';
				}
			};
		}(el));

		// 		el.className = 'accordion collapsed';
		// 		el.querySelector('.accordion-content').style.display = 'none';
	}


	// open accordion of anchor if collapsed
	var urlAnchor = location.hash;
	if (urlAnchor) {
		var fnc = function () {
			// timeout because the page is not finished loading with collapsed accordions
			setTimeout(function () {
				// .closest('.accordion') would be a alternative but is not working in IE
				var getParentAccordion = function (el) {
					while (el.parentNode && (' ' + el.parentNode.className + ' ').indexOf(' accordion ') === -1) {
						el = el.parentNode;
					}
					return el.parentNode && (' ' + el.parentNode.className + ' ').indexOf(' accordion ') > -1 ? el.parentNode : null;
				};

				var elm = document.getElementById(urlAnchor.substr(1));
				if (elm) {
					var parent = getParentAccordion(elm);
					if (parent) {
						parent.className = 'accordion expanded';
					}
					// For Firefox: Accordion have to be expanded before scrolling
					setTimeout(function () {
						elm.scrollIntoView();
					}, 10);
				}
			}, 100);
		};
		window.addEventListener('load', fnc);
	}
}
