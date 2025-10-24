import {expect} from 'chai';
import {DomUtil} from 'leaflet';
import {createContainer, removeMapContainer} from '../SpecHelper.js';

describe('DomUtil', () => {
	let container;
	let documentElement;

	beforeEach(() => {
		container = createContainer();
		documentElement = document.documentElement;
	});

	afterEach(() => {
		removeMapContainer(null, container);
		// Cleanup any text-selection styles
		if (documentElement.style.userSelect !== '') {
			documentElement.style.userSelect = '';
		}
		if (container.style.userSelect !== '') {
			container.style.userSelect = '';
		}
	});

	describe('disableTextSelection', () => {
		// Test 1: Should disable text selection only on specified container
		it('should disable text selection only on specified container', () => {
			const initialDocStyle = documentElement.style.userSelect;

			DomUtil.disableTextSelection(container);

			expect(container.style.userSelect).to.equal('none');
			expect(documentElement.style.userSelect).to.equal(initialDocStyle);

			DomUtil.enableTextSelection(container);
		});

		// Test 2: Should NOT disable globally when container provided
		it('should not affect document when container is provided', () => {

			DomUtil.disableTextSelection(container);

			const afterDocStyle = window.getComputedStyle(documentElement).userSelect;

			// Document style should not change to 'none' when we provide a container
			expect(afterDocStyle).not.to.equal('none');
			expect(container.style.userSelect).to.equal('none');

			DomUtil.enableTextSelection(container);
		});

		// Test 3: Backward compatibility - no args still works globally
		it('should disable globally when called without container (backward compat)', () => {
			DomUtil.disableTextSelection();

			// When no container provided, should work globally
			const style = window.getComputedStyle(documentElement);
			expect(style.userSelect === 'none' || documentElement.style.userSelect === 'none').to.be.true;

			DomUtil.enableTextSelection();
		});
	});

	describe('enableTextSelection', () => {
		it('should restore text selection on container', () => {
			// First disable on container
			DomUtil.disableTextSelection(container);
			expect(container.style.userSelect).to.equal('none');

			// Then enable
			DomUtil.enableTextSelection(container);

			// Should be restored (not 'none' anymore)
			expect(container.style.userSelect).not.to.equal('none');
		});

		it('should handle multiple toggle cycles', () => {
			const container2 = createContainer();

			try {
				// First element: disable and enable
				DomUtil.disableTextSelection(container);
				expect(container.style.userSelect).to.equal('none');

				DomUtil.enableTextSelection(container);
				expect(container.style.userSelect).not.to.equal('none');

				// Second element: disable and enable
				DomUtil.disableTextSelection(container2);
				expect(container2.style.userSelect).to.equal('none');

				DomUtil.enableTextSelection(container2);
				expect(container2.style.userSelect).not.to.equal('none');
			} finally {
				removeMapContainer(null, container2);
			}
		});
	});

	describe('Real-world scenario: contenteditable with map', () => {
		it('should allow text selection in contenteditable div when map container is separate', () => {
			const editableDiv = createContainer();
			editableDiv.contentEditable = true;
			editableDiv.textContent = 'Editable content here';
			document.body.appendChild(editableDiv);

			try {
				// Disable text selection on map container only
				DomUtil.disableTextSelection(container);

				// Text selection should still work on editable div
				const selection = window.getSelection();
				const range = document.createRange();
				range.selectNodeContents(editableDiv);
				selection.removeAllRanges();
				selection.addRange(range);

				expect(selection.toString().length).to.be.greaterThan(0);

				DomUtil.enableTextSelection(container);
			} finally {
				document.body.removeChild(editableDiv);
			}
		});
	});
});
