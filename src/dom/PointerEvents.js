const activePointers = new Map();
function addListeners() {
	document.addEventListener('pointerdown', onSet, {capture: true});
	document.addEventListener('pointermove', onSet, {capture: true});
	document.addEventListener('pointerover', onSet, {capture: true});
	document.addEventListener('pointerup', onDelete, {capture: true});
	document.addEventListener('pointercancel', onDelete, {capture: true});
	document.addEventListener('pointerout', onDelete, {capture: true});
}

function removeListeners() {
	document.removeEventListener('pointerdown', onSet, {capture: true});
	document.removeEventListener('pointermove', onSet, {capture: true});
	document.removeEventListener('pointerover', onSet, {capture: true});
	document.removeEventListener('pointerup', onDelete, {capture: true});
	document.removeEventListener('pointercancel', onDelete, {capture: true});
	document.removeEventListener('pointerout', onDelete, {capture: true});
}

function onSet(e) {
	activePointers.set(e.pointerId, e);
}

function onDelete(e) {
	activePointers.delete(e.pointerId);
}

function getPointers() {
	return [...activePointers.values()];
}

function cleanupPointers() {
	activePointers.clear();
}

export {
	addListeners,
	removeListeners,
	getPointers,
	cleanupPointers
};

