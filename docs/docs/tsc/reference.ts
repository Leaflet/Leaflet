/* eslint-disable @typescript-eslint/no-unsafe-member-access */
//import * as $ from '@types/jquery';

// function reference():'@types/jquery'{

// const reference(): any{

	if (document.body.className.indexOf('api-page') !== -1) {

		const elems = document.querySelectorAll('h2, h3, h4, tr');

		for (const i in elems.length) {
			const el = elems[i];

			if (el.id) {
				const anchor = document.createElement('a');
				anchor.setAttribute('anchor', el.id);
				if (!el.children.length) {
					// For headers, insert the anchor before.
					el.parentNode.insertBefore(anchor, el);
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
		for (const i in elems.length) {
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

	}


// }// end function reference
