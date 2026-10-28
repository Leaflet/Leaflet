const SESSION_KEY = 'dialog-session';
const ONE_DAY_MILLI_SEC = 7 * 24 * 60 * 60 * 1000;

function openDialog() {

	// keep the last session timestamp in local storage to re-show after 7 days since last time
	if (localStorage) {
		const sessionTimestamp = localStorage.getItem(SESSION_KEY);
		if (sessionTimestamp && Date.now() - sessionTimestamp < ONE_DAY_MILLI_SEC) {
			return;
		}
	}

	const html = '<div class=\'container iframe-container\'><iframe src=\'/dialog/\'></iframe><button type="submit" class=\'close-dialog\' aria-label=\'close\'>&times;</button></div>';

	const dialog = document.createElement('div');
	dialog.id = 'dialog';
	dialog.setAttribute('role', 'dialog');
	dialog.innerHTML = html;

	document.body.insertBefore(dialog, document.body.firstChild);

	// size the frame to its content; the container's max-height makes it scroll when the content doesn't fit
	const iframe = dialog.querySelector('iframe');
	iframe.addEventListener('load', () => {
		const root = iframe.contentDocument.documentElement;
		new ResizeObserver(() => { iframe.style.height = `${root.offsetHeight}px`; }).observe(root);
	});

	document.body.classList.add('overflowHidden');

	setTimeout(() => {
		dialog.focus();
	}, 100);

	function closeDialog() {
		document.body.removeChild(dialog);
		document.body.classList.remove('overflowHidden');
		if (localStorage) {
			localStorage.setItem(SESSION_KEY, Date.now());
		}
	}

	dialog.querySelector('.close-dialog').addEventListener('click', closeDialog);

	// close on clicks on the backdrop around the popup
	dialog.addEventListener('click', (e) => {
		if (e.target === dialog) { closeDialog(); }
	});

	// keep focus in dialog
	// https://css-tricks.com/a-css-approach-to-trap-focus-inside-of-an-element/
	dialog.addEventListener('transitionend', () => {
		dialog.querySelector('iframe').focus();
	});
}

openDialog();
