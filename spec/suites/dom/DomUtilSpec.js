describe('DomUtil', function () {
	var el;

	beforeEach(function () {
		var el = document.createElement('div');
		var input = document.createElement('input');
		input.value = 'xxx';
		el.style.position = 'absolute';
		el.style.top = el.style.left = '-10000px';
		document.body.appendChild(el);
		document.body.appendChild(input);
	});

	afterEach(function () {
		document.body.removeChild(el);
	});

	describe('#get', function () {
		it('gets element by id if the given argument is string', function () {
			el.id = 'testId';
			expect(L.DomUtil.get(el.id)).to.eql(el);
		});

		it('returns the element if it is given as an argument', function () {
			expect(L.DomUtil.get(el)).to.eql(el);
		});
	});

	describe('#addClass, #removeClass, #hasClass', function () {
		it('has defined class for test element', function () {
			el.className = 'bar foo baz ';
			expect(L.DomUtil.hasClass(el, 'foo')).to.be.ok();
			expect(L.DomUtil.hasClass(el, 'bar')).to.be.ok();
			expect(L.DomUtil.hasClass(el, 'baz')).to.be.ok();
			expect(L.DomUtil.hasClass(el, 'boo')).to.not.be.ok();
		});

		it('adds or removes the class', function () {
			el.className = '';
			L.DomUtil.addClass(el, 'foo');

			expect(el.className).to.eql('foo');
			expect(L.DomUtil.hasClass(el, 'foo')).to.be.ok();

			L.DomUtil.addClass(el, 'bar');
			expect(el.className).to.eql('foo bar');
			expect(L.DomUtil.hasClass(el, 'foo')).to.be.ok();

			L.DomUtil.removeClass(el, 'foo');
			expect(el.className).to.eql('bar');
			expect(L.DomUtil.hasClass(el, 'foo')).to.not.be.ok();

			el.className = 'foo bar barz';
			L.DomUtil.removeClass(el, 'bar');
			expect(el.className).to.eql('foo barz');
		});
	});
	describe('#getStyle', function () {
		it('gets the value for a certain style attribute on an element,', function () {
			el.id = 'testId';
			el.style.color = 'black';
			expect(L.DomUtil.getStyle(el, 'color')).to.eql('black');
			el.style.color = 'green';
			expect(L.DomUtil.getStyle(el, 'color')).to.eql('green');
		});
	});

	describe('#create, #remove, #empty', function () {
		it('create a HTML element, sets a class, appends it to container element.', function () {
			el.id = 'testId';
			expect(el.children.length).to.equal(0);
			L.DomUtil.create('h1', 'title', el);
			expect(el.children.length).to.equal(1);
		});
		it('removes element from parent', function () {
			el.id = 'testId';
			expect(el.children.length).to.equal(0);
			L.DomUtil.create('h1', 'title', el);
			expect(el.children.length).to.equal(1);
			L.DomUtil.remove(L.DomUtil.get(el.children[0]));
			expect(el.children.length).to.equal(0);
		});
		it('removes all of the elements children elements', function () {
			el.id = 'testId';
			expect(el.children.length).to.equal(0);

			[0, 1, 2, 3].forEach(function (num) {
				L.DomUtil.create('div', 'childContainer' + num, el);
			});
			expect(el.children.length).to.equal(4);

			L.DomUtil.remove(L.DomUtil.get(el.children[0]));
			expect(el.children.length).to.equal(3);

			L.DomUtil.empty(el);
			expect(el.children.length).to.equal(0);
		});
	});

	describe('#toFront, #toBack', function () {
		beforeEach(function () {
			L.DomUtil.create('div', 'childContainer', el);
			L.DomUtil.create('h1', 'childh1', el);
			L.DomUtil.create('p', 'childp', el);
		});
		it('Moves el to last child position parent element', function () {
			el.id = 'testId';
			expect(el.children.length).to.equal(3);
			expect(Array.from(el.children).indexOf(document.querySelector('.childContainer') === 0));
			L.DomUtil.toFront(el.children[0]);
			expect(Array.from(el.children).indexOf(document.querySelector('.childContainer') === 2));
		});
		it('Moves el to first child position parent element', function () {
			el.id = 'testId';
			expect(el.children.length).to.equal(3);
			expect(Array.from(el.children).indexOf(document.querySelector('.childp') === 2));
			L.DomUtil.toFront(el.children[0]);
			expect(Array.from(el.children).indexOf(document.querySelector('.childp') === 0));
		});
	});

	describe('#setClass, #getClass', function () {
		it('Sets the elements class', function () {
			el.id = 'testId';
			expect(el.classList.contains('newClass')).to.not.be.ok();
			L.DomUtil.setClass(el, 'newClass');
			expect(el.classList.contains('newClass')).to.be.ok();
		});
		it('Gets the elements class', function () {
			el.id = 'testId';
			expect(L.DomUtil.getClass(el)).to.not.equal('newClass');
			L.DomUtil.setClass(el, 'newClass');
			expect(L.DomUtil.getClass(el)).to.equal('newClass');
		});
	});

	describe('#setOpacity', function () {
		it('Sets opacity of element', function () {
			el.id = 'testId';
			L.DomUtil.setOpacity(el, 1);
			expect(el.style.opacity).to.equal('1');
			L.DomUtil.setOpacity(el, 0.5);
			expect(el.style.opacity).to.equal('0.5');
			L.DomUtil.setOpacity(el, '0');
			expect(el.style.opacity).to.equal('0');
		});
	});

	describe('#testProp', function () {
		it('Check array of style names return first valid style name for element', function () {
			expect(L.DomUtil.testProp(['transform'])).to.not.be.ok();
			document.documentElement.style.transform = 'rotate(0deg)';
			expect(L.DomUtil.testProp(['transform'])).to.be.ok();
		});
	});

	describe('#setTransform', function () {
		it("Resets the transform style of an el.", function () {
			expect(L.DomUtil.getStyle(el, '-webkit-transform')).to.be.equal('none');

			var offset = L.point(200, 200);
			var scale = 10;
			L.DomUtil.setTransform(el, offset, scale);
			var transform = L.DomUtil.getStyle(el, '-webkit-transform');
			expect(L.DomUtil.getStyle(el, '-webkit-transform')).to.be.equal(transform);

			var newScale = 20;
			var newOffset = L.point(400, 400);
			L.DomUtil.setTransform(el, newOffset, newScale);
			expect(L.DomUtil.getStyle(el, '-webkit-transform')).to.not.be.equal(transform);
		});
	});

	describe('#setPosition, #getPosition', function () {
		it("Sets position of el to coordinates specified by position.", function () {
			expect(L.DomUtil.getStyle(el, 'left')).to.be.equal('-10000px');
			expect(L.DomUtil.getStyle(el, 'top')).to.be.equal('-10000px');

			var x = 100;
			var y = 100;
			var position = L.point(x, y);
			L.DomUtil.setPosition(el, position);
			expect(L.DomUtil.getStyle(el, 'left')).to.be.equal(x + 'px');
			expect(L.DomUtil.getStyle(el, 'top')).to.be.equal(y + 'px');

			var newX = 333;
			var newY = 666;
			var newPosition = L.point(newX, newY);
			L.DomUtil.setPosition(el, newPosition);
			expect(L.DomUtil.getStyle(el, 'left')).to.be.equal(newX + 'px');
			expect(L.DomUtil.getStyle(el, 'top')).to.be.equal(newY + 'px');
		});

		it("Returns position of an element positioned with setPosition.", function () {
			var coordinates = {x: 333, y: 666};
			var position = L.point(coordinates);
			expect(L.DomUtil.getPosition(el)).to.not.eql(coordinates);
			L.DomUtil.setPosition(el, position);
			expect(L.DomUtil.getPosition(el)).to.be.an('object');
			expect(L.DomUtil.getPosition(el)).to.eql(coordinates);
		});
	});

	describe('#disableTextSelection', function () {
		it('Disable the selectstart DOM events for the user ', function () {
			// var listener = sinon.spy();
			// console.log('selectstart' in window)
			// L.DomUtil.disableTextSelection()
			// console.log('onselectstart' in window)
			// // L.DomEvent.on(window, 'selectstart', listener)
			// // happen.once(window, {
			// //   type: "selectstart"
			// // })
			// // expect(listener.called).to.be.ok()
			// L.DomUtil.disableTextSelection()
		});
	});

	// describe('#setPosition', noSpecs);

	// describe('#getStyle', noSpecs);
});
