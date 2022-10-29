const SESSION_KEY = 'dialog-session';
const ONE_DAY_MILLI_SEC = 24 * 60 * 60 * 1000;

function openDialog() {

	// keep the last session timestamp in local storage to
	//  re-show after 24 hours since last ack
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
	document.body.classList.add('overflowHidden');

	setTimeout(() => {
		dialog.focus();
	}, 100);

	const closeBtn = document.querySelector('.close-dialog');
	closeBtn.addEventListener('click', () => {
		const dialog = document.getElementById('dialog');
		document.body.removeChild(dialog);
		document.body.classList.remove('overflowHidden');
		if (localStorage) {
			localStorage.setItem(SESSION_KEY, Date.now());
		}
	});

	// keep focus in dialog
	// https://css-tricks.com/a-css-approach-to-trap-focus-inside-of-an-element/
	dialog.addEventListener('transitionend', () => {
		dialog.querySelector('iframe').focus();
	});
}

openDialog();
