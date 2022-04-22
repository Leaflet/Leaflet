var SESSION_KEY = 'ukraini-dialog-session';
var ONE_DAY_MILLI_SEC = 24 * 60 * 60 * 1000;

function openSlavaUkrainiDialog() {

	if (sessionStorage) {
		var session = sessionStorage.getItem(SESSION_KEY);
		// open the dialog only every 24 hours
		if (session && Date.now() - session < ONE_DAY_MILLI_SEC) {
			return;
		}
	}

	var html = '<div class=\'container iframe-container\'><span class=\'close-dialog\' aria-label=\'close\'>&times;</span><iframe src=\'/SlavaUkraini/\' /></div>';

	var div = document.createElement('div');
	div.id = 'ukraini-dialog';
	div.innerHTML = html;

	document.body.appendChild(div);
	document.body.classList.add('overflowHidden');

	var closeBtn = document.querySelector('.close-dialog');
	closeBtn.addEventListener('click', function () {
		var dialog = document.getElementById('ukraini-dialog');
		document.body.removeChild(dialog);
		document.body.classList.remove('overflowHidden');
		if (sessionStorage) {
			sessionStorage.setItem(SESSION_KEY, Date.now());
		}
	});
}

openSlavaUkrainiDialog();
