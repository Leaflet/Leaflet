function docs():void{
	/* global hljs */
// import hljs from 'highlight.tsc';

// hljs.configure({ tabReplace: '    ' }); // TS2345
// hljs.initHighlighting();

	const tocCopy = document.createElement('div');
	tocCopy.id = 'toc-copy';

	const toc = document.querySelector('#toc');

	if (toc) {
		tocCopy.innerHTML = toc.innerHTML;
		document.getElementsByClassName('container')[0].appendChild(tocCopy);

		const menus = document.querySelectorAll('#toc-copy ul');
		// const outeri;

		for (let i in menus.length) {
			menus[i].addEventListener('mouseover', function () {
				this.previousElementSibling.classList.add('hover');
			})

			menus[i].addEventListener('mouseout', function () {
				this.previousElementSibling.classList.remove('hover');
			})
		}

		const labels = document.querySelectorAll('#toc-copy h4');

		for (let i in labels.length) {
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

			// const Error = require('typescript');

			const scroll = window.scrollY;

			try{
				if (scroll >= (toc.offsetHeight + toc.offsetTop)) {

					document.body.classList.add('scrolled');

				} else {

					document.body.classList.remove('scrolled');

				}
			}catch(e){

				throw new Error("Error");

				// if(e instanceof Error){
					// const $ = require('jquery');
					// $('map').alert('Error');
				// }

			}finally{

			}

		};

		scrollPos();

		window.addEventListener('scroll', function () {
			scrollPos();
		});
	}
}// end function docs
