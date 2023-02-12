describe('DomUtil', () => {
	let el;

	beforeEach(() => {
		el = document.createElement('div');
		el.style.position = 'absolute';
		el.style.top = el.style.left = '0px';
		document.body.appendChild(el);
	});

	afterEach(() => {
		document.body.removeChild(el);
	});

	describe('#get', () => {
		it('gets element by id if the given argument is string', () => {
			el.id = 'testId';
			expect(L.DomUtil.get(el.id)).to.eql(el);
		});

		it('returns the element if it is given as an argument', () => {
			expect(L.DomUtil.get(el)).to.eql(el);
		});
	});

	describe('#create', () => {
		it('creates an HTML element div without any class name', () => {
			const e = L.DomUtil.create('div');
			expect(e.className).to.eql('');
			expect(e.tagName).to.eql('DIV');
		});

		it('creates an HTML element div with specified class name', () => {
			const e = L.DomUtil.create('div', 'test');
			expect(e.className).to.eql('test');
			expect(e.tagName).to.eql('DIV');
		});

		it('creates an p element with a div as parent', () => {
			const parent = L.DomUtil.create('div');
			expect(parent.children.length).to.equal(0);
			const child = L.DomUtil.create('p', 'test', parent);
			expect(child.parentNode === parent).to.be(true);
			expect(parent.children.length).to.equal(1);
		});
	});

	describe('#toFront', () => {
		it('moves el to last child position parent element', () => {
			const elm = L.DomUtil.create('div', 'childContainer', el);
			L.DomUtil.create('div', 'test', el);
			L.DomUtil.create('div', 'test1', el);
			expect(el.children.length).to.equal(3);
			expect(Array.from(el.children).indexOf(elm)).to.be(0);
			L.DomUtil.toFront(elm);
			expect(Array.from(el.children).indexOf(elm)).to.be(2);
		});

		it('doesn\'t move an element if he\'s already in the front', () => {
			L.DomUtil.create('div', 'test', el);
			L.DomUtil.create('div', 'test1', el);
			const e1 = L.DomUtil.create('div', 'test2', el);
			expect(el.lastChild).to.eql(e1);
			L.DomUtil.toFront(e1);
			expect(el.lastChild).to.eql(e1);
		});

		it('doesn\'t crash if element doesn\'t have a parent', () => {
			const e = L.DomUtil.create('div');
			L.DomUtil.toFront(e);
		});
	});

	describe('#toBack', () => {
		it('moves el to first child position parent element', () => {
			L.DomUtil.create('div', 'test', el);
			L.DomUtil.create('div', 'test1', el);
			const elm = L.DomUtil.create('div', 'childContainer', el);
			expect(el.children.length).to.equal(3);
			expect(Array.from(el.children).indexOf(elm)).to.be(2);
			L.DomUtil.toBack(elm);
			expect(Array.from(el.children).indexOf(elm)).to.be(0);
		});

		it('doesn\'t move an element if it is already in the back', () => {
			const e1 = L.DomUtil.create('div', 'test', el);
			L.DomUtil.create('div', 'test1', el);
			L.DomUtil.create('div', 'test2', el);
			expect(el.firstChild).to.be(e1);
			L.DomUtil.toBack(el);
			expect(el.firstChild).to.be(e1);
		});

		it('doesn\'t crash if an element doesn\'t have a parent', () => {
			const e = L.DomUtil.create('div');
			L.DomUtil.toBack(e);
		});
	});

	describe('#setTransform', () => {
		it('resets the transform style of an el.', () => {
			expect(el.style.transform).to.be.equal('');

			const offset = L.point(200, 200);
			const scale = 10;
			L.DomUtil.setTransform(el, offset, scale);
			const transform = el.style.transform;
			expect(el.style.transform).to.be.equal(transform);

			const newScale = 20;
			const newOffset = L.point(400, 400);
			L.DomUtil.setTransform(el, newOffset, newScale);
			expect(el.style.transform).to.not.be.equal(transform);
		});

		it('reset the 3d CSS transform when offset and scale aren\'t specified', () => {
			L.DomUtil.setTransform(el);
			expect(el.style.transform).to.be('translate3d(0px, 0px, 0px)');
		});

		it('set the 3d CSS transform with just the specified point if scale isn\'t specified', () => {
			L.DomUtil.setTransform(el, new L.Point(1, 1));
			expect(el.style.transform).to.be('translate3d(1px, 1px, 0px)');
		});

		it('set 3d CSS transform to translate3d(0px, 0px, 0) and add to it scale(${scalevalue}) if only scale is specified', () => {
			L.DomUtil.setTransform(el, undefined, 5);
			expect(el.style.transform).to.be('translate3d(0px, 0px, 0px) scale(5)');
		});

		it('set the 3d CSS transform with the specified point ant the corresponding scale', () => {
			L.DomUtil.setTransform(el, new L.Point(1, 1), 5);
			expect(el.style.transform).to.be('translate3d(1px, 1px, 0px) scale(5)');
		});
	});

	describe('#setPosition, #getPosition', () => {
		it('sets position of el to coordinates specified by position.', () => {
			expect(el.style.left).to.be.equal('0px');
			expect(el.style.top).to.be.equal('0px');

			const x = 50;
			const y = 55;
			const position = L.point(x, y);
			L.DomUtil.setPosition(el, position);
			expect(L.DomUtil.getPosition(el)).to.be.eql({x, y});

			const newX = 333;
			const newY = 666;
			const newPosition = L.point(newX, newY);
			L.DomUtil.setPosition(el, newPosition);
			expect(L.DomUtil.getPosition(el)).to.be.eql({x: newX, y: newY});
		});

		it('returns position of an element positioned with setPosition.', () => {
			const coordinates = {x: 333, y: 666};
			const position = L.point(coordinates);
			expect(L.DomUtil.getPosition(el)).to.not.eql(coordinates);
			L.DomUtil.setPosition(el, position);
			expect(L.DomUtil.getPosition(el)).to.be.an('object');
			expect(L.DomUtil.getPosition(el)).to.eql(coordinates);
		});

		it('returns [0, 0] point if the HTML element wasn\'t positioned before', () => {
			expect(L.DomUtil.getPosition(el)).to.eql(new L.Point(0, 0));
		});
	});

	describe('#getSizedParentNode', () => {
		it('find nearest parent element where height / width are not null', () => {
			const child = document.createElement('div');
			const grandChild = document.createElement('div');
			el.appendChild(child);
			child.appendChild(grandChild);
			child.style.width = child.style.height = '500px';
			expect(L.DomUtil.getSizedParentNode(grandChild)).to.eql(child);
		});

		it('throws an error if the element hasn\'t a parent', () => {
			expect(() => {
				L.DomUtil.getSizedParentNode(document.createElement('div'));
			}).to.throwException();
		});
	});

	describe('#getScale', () => {
		it('returns scale of element as x & y scales respectively', () => {
			const childEl = document.createElement('div');
			childEl.style.width = '250px';
			childEl.style.height = '250px';
			childEl.style.padding = '15px';
			childEl.style.margin = '25px';
			el.appendChild(childEl);
			const scale = {
				x: 1,
				y: 1,
				boundingClientRect: {
					x: 25,
					y: 25,
					width: 280,
					height: 280,
					top: 25,
					right: 305,
					bottom: 305,
					left: 25,
				}
			};
			// Not all browsers contain x y inside boundclientRect, always contains top, right, bottom and left properties
			expect(L.DomUtil.getScale(childEl).boundingClientRect.top).to.be.equal(scale.boundingClientRect.top);
			expect(L.DomUtil.getScale(childEl).boundingClientRect.right).to.be.equal(scale.boundingClientRect.right);
			expect(L.DomUtil.getScale(childEl).boundingClientRect.bottom).to.be.equal(scale.boundingClientRect.bottom);
			expect(L.DomUtil.getScale(childEl).boundingClientRect.left).to.be.equal(scale.boundingClientRect.left);

			childEl.style.padding = '400px';
			expect(L.DomUtil.getScale(childEl).boundingClientRect.bottom).to.not.be.equal(scale.boundingClientRect.bottom);
		});

		it('returns x and y to 1 with all boundingClientRect\'s values to 0 for empty element not added yet to the body', () => {
			const newElement = document.createElement('div');
			const scale = L.DomUtil.getScale(newElement);
			expect(scale.x).to.eql(1);
			expect(scale.y).to.eql(1);
			expect(scale.boundingClientRect.x).to.eql(0);
			expect(scale.boundingClientRect.y).to.eql(0);
			expect(scale.boundingClientRect.left).to.eql(0);
			expect(scale.boundingClientRect.right).to.eql(0);
			expect(scale.boundingClientRect.top).to.eql(0);
			expect(scale.boundingClientRect.height).to.eql(0);
			expect(scale.boundingClientRect.bottom).to.eql(0);
			expect(scale.boundingClientRect.width).to.eql(0);
		});
	});

	describe('#disableTextSelection, #enableTextSelection', () => {
		const documentStyle = document.documentElement.style;
		// Safari still needs a vendor prefix, we need to detect with property name is supported.
		const userSelectProp = ['userSelect', 'WebkitUserSelect'].find(prop => prop in documentStyle);

		beforeEach(() => expect(documentStyle[userSelectProp]).to.be(''));
		afterEach(() => { documentStyle[userSelectProp] = ''; });

		it('disables and enables text selection', () => {
			L.DomUtil.disableTextSelection();
			expect(documentStyle[userSelectProp]).to.be('none');
			L.DomUtil.enableTextSelection();
			expect(documentStyle[userSelectProp]).to.be('');
		});

		it('restores the text selection previously set', () => {
			documentStyle[userSelectProp] = 'text';
			L.DomUtil.disableTextSelection();
			L.DomUtil.enableTextSelection();
			expect(documentStyle[userSelectProp]).to.be('text');
		});

		it('restores the text selection previously set when disabling multiple times', () => {
			L.DomUtil.disableTextSelection();
			L.DomUtil.disableTextSelection();
			L.DomUtil.enableTextSelection();
			expect(documentStyle[userSelectProp]).to.be('');
		});
	});

	describe('#disableImageDrag, #enablerImageDrag', () => {
		it('disable / enable dragstart DOM events for the user', () => {
			let selectionPrevented;
			function checkPrevented(e) {
				if (e.defaultPrevented) {
					selectionPrevented = true;
				} else {
					selectionPrevented = false;
				}
			}
			const child = document.createElement('div');
			el.appendChild(child);

			L.DomUtil.disableImageDrag();
			window.addEventListener('dragstart', checkPrevented);
			UIEventSimulator.fire('dragstart', child);
			expect(selectionPrevented).to.be.ok();

			L.DomUtil.enableImageDrag();
			UIEventSimulator.fire('dragstart', child);
			expect(selectionPrevented).to.not.be.ok();
		});
	});

	describe('#preventOutline, #restoreOutline', () => {
		it('prevent / restore outline for the element', () => {
			const child = document.createElement('div');
			el.appendChild(child);
			child.tabIndex = 0;
			expect(child.style.outline).to.be.equal(child.style.outline);
			L.DomUtil.preventOutline(child);
			expect(child.style.outline).to.match(/(?:none)/);

			//	Explicit #restoreOutline through direct call
			expect(child.style.outline).to.match(/(?:none)/);
			L.DomUtil.restoreOutline(child);
			expect(child.style.outline).to.be.equal(child.style.outline);

			//	Implicit #restoreOutline test through simulation
			L.DomUtil.preventOutline(child);
			expect(child.style.outline).to.match(/(?:none)/);
			UIEventSimulator.fire('keydown', child);
			expect(child.style.outline).to.be.equal(child.style.outline);
		});
	});
});
