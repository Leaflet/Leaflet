const SESSION_KEY = 'dialog-session';
const WEEK = 7 * 24 * 60 * 60 * 1000;

function openDialog() {
	// re-show a week after it was last closed
	try {
		if (Date.now() - localStorage.getItem(SESSION_KEY) < WEEK) { return; }
	} catch {
		// storage is blocked, so show it every time
	}

	// kept in a template so that pages don't carry the appeal text unless it's shown
	document.body.append(document.getElementById('dialog-template').content);
	const dialog = document.getElementById('dialog');

	dialog.addEventListener('close', () => {
		dialog.remove();
		try { localStorage.setItem(SESSION_KEY, Date.now()); } catch { /* blocked storage */ }
	});

	// the content fills the dialog box, so only clicks on the backdrop hit the dialog itself
	dialog.addEventListener('click', (e) => {
		if (e.target === dialog) { dialog.close(); }
	});

	dialog.showModal();
	// focus the dialog rather than the close button, which would show a focus ring right away
	dialog.focus();
}

openDialog();
