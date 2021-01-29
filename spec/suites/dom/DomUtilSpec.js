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

	// describe('#setPosition', noSpecs);

	// describe('#getStyle', noSpecs);
	describe("#getStyle", function () {
		it('should return corresponding style if defined into HTML element', function () {
			expect(L.DomUtil.getStyle(el, "position")).to.eql("absolute");
		});
		it("should return empty string is style isn't defined into HTML element", function () {
			var e = document.createElement('div');
			expect(L.DomUtil.getStyle(e, "position")).to.be('');
		});
		it("should return undefined is style don't exist into HTML element or default css", function () {
			expect(L.DomUtil.getStyle(el, "random_name_for_style")).to.be(undefined);
		});
	});

	describe("#create", function () {
		it("should create an HTML element div without any class name", function () {
			var e = L.DomUtil.create("div");
			expect(e.className).to.eql('');
			expect(e.tagName).to.eql("DIV");
		});
		it("should create an HTML element div with specified class name", function () {
			var e = L.DomUtil.create("div", "test");
			expect(e.className).to.eql('test');
			expect(e.tagName).to.eql("DIV");
		});
		it("should create an HTML element <p> with a div for parent", function () {
			var parent = L.DomUtil.create("div");
			var child = L.DomUtil.create("p", "test", parent);
			expect(child.parentNode === parent).to.be(true);
		});
	});

	describe("#remove", function () {
		it("should remove specified element", function () {
			var e = L.DomUtil.create("div", "test", el);
			L.DomUtil.remove(e);
			expect(el.contains(e)).to.be(false);
		});
		it("should do nothing if the element hasn't parent (in other way, it doesn't exist)", function () {
			var e = L.DomUtil.create("div", "test");
			L.DomUtil.remove(e);
			expect(document.body.contains(e)).to.be(false);
		});
	});

	describe("#empty", function () {
		it("should remove all children of element", function () {
			L.DomUtil.create("div", "test", el);
			L.DomUtil.create("div", "test1", el);
			L.DomUtil.create("div", "test2", el);
			L.DomUtil.empty(el);
			expect(el.childNodes.length).to.be(0);
		});
		it("should do nothing if element doesn't have children", function () {
			expect(el.childNodes.length).to.be(0);
			L.DomUtil.empty(el);
			expect(el.childNodes.length).to.be(0);
		});
	});

	describe("#toFront", function () {
		it("should place the first child of element to the last position", function () {
			var e1 = L.DomUtil.create("div", "test", el);
			L.DomUtil.create("div", "test1", el);
			L.DomUtil.create("div", "test2", el);
			expect(el.lastChild).to.not.eql(e1);
			L.DomUtil.toFront(e1);
			expect(el.lastChild).to.eql(e1);
		});
		it("shouldn't move an element if he's already in the last position", function () {
			L.DomUtil.create("div", "test", el);
			L.DomUtil.create("div", "test1", el);
			var e1 = L.DomUtil.create("div", "test2", el);
			expect(el.lastChild).to.eql(e1);
			L.DomUtil.toFront(e1);
			expect(el.lastChild).to.eql(e1);
		});
		it("shouldn't crash if element doesn't have a parent", function () {
			var e = L.DomUtil.create("div");
			L.DomUtil.toFront(e);
		});
	});

	// describe("#toback", function () {
	// 	it("should place the lastChild of an HTML element to the last position", function () {
	// 		L.DomUtil.create("div", "test", el);
	// 		L.DomUtil.create("div", "test1", el);
	// 		var e1 = L.DomUtil.create("div", "test2", el);
	// 		expect(el.firstChild).to.not.eql(e1);
	// 		L.DomUtil.toBack(el);
	// 		expect(el.firstChild).to.eql(e1);
	// 	});

	// });
});
