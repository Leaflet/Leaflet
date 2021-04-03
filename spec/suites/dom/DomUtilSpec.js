describe('DomUtil', function () {
	var el;

	beforeEach(function () {
		el = document.createElement('div');
		el.style.position = 'absolute';
		el.style.top = el.style.left = '-10000px';
		document.body.appendChild(el);
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
  
	// describe('#setPosition', noSpecs);

	// describe('#getStyle', noSpecs);
});
