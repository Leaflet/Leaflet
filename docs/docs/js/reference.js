if (document.body.className.indexOf('api-page') !== -1) {

	let elems = document.querySelectorAll('h2, h3, h4, tr');

	for (let i = 0, len = elems.length; i < len; i++) {
		const el = elems[i];

		if (el.id) {
			const anchor = document.createElement('a');
			anchor.setAttribute('data-anchor', el.id);
			if (!el.children.length) {
				// For headers, insert the anchor before.
				el.parentNode.insertBefore(anchor, el);

				// Clicking on the row (meaning "the link icon on the ::before)
				// jumps to the item
				el.onclick = function () {
					return function (ev) {
						if (ev.offsetX < 0) {
							window.location.hash = `#${ev.target.id}`;
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
							window.location.hash = `#${ev.target.parentNode.id}`;
						}
					};
				}(el.id);
			}
		}
	}

	elems = document.querySelectorAll('div.accordion');
	for (let i = 0, len = elems.length; i < len; i++) {
		const el = elems[i];

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
	const urlAnchor = location.hash;
	if (urlAnchor) {
		const fnc = function () {
			// timeout because the page is not finished loading with collapsed accordions
			setTimeout(() => {
				// .closest('.accordion') would be a alternative but is not working in IE
				const getParentAccordion = function (el) {
					while (el.parentNode && (` ${el.parentNode.className} `).indexOf(' accordion ') === -1) {
						el = el.parentNode;
					}
					return el.parentNode && (` ${el.parentNode.className} `).indexOf(' accordion ') > -1 ? el.parentNode : null;
				};

				const elm = document.getElementById(urlAnchor.substring(1));
				if (elm) {
					const parent = getParentAccordion(elm);
					if (parent) {
						parent.className = 'accordion expanded';
					}
					// For Firefox: Accordion have to be expanded before scrolling
					setTimeout(() => {
						elm.scrollIntoView();
					}, 10);
				}
			}, 100);
		};
		window.addEventListener('load', fnc);
	}
}
