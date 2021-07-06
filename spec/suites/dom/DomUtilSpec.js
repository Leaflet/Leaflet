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

	describe("#toback", function () {
		it("should place the lastChild of an HTML element to first Child", function () {
			L.DomUtil.create("div", "test", el);
			L.DomUtil.create("div", "test1", el);
			var e1 = L.DomUtil.create("div", "test2", el);
			expect(el.firstChild).to.not.eql(e1);
			L.DomUtil.toBack(el);
			expect(el.firstChild).to.not.be(e1);
		});
		it("should'n move an element if it is already in the first child postion", function () {
			var e1 = L.DomUtil.create("div", "test", el);
			L.DomUtil.create("div", "test1", el);
			L.DomUtil.create("div", "test2", el);
			expect(el.firstChild).to.be(e1);
			L.DomUtil.toBack(el);
			expect(el.firstChild).to.be(e1);
		});
		it("shouldn't crash if an element dosn't have child", function () {
			var e = L.DomUtil.create("div");
			L.DomUtil.toBack(e);
		});
	});

	describe("#setClass", function () {
		it("Should replace the class of HTML element by the specified argument", function () {
			L.DomUtil.setClass(el, "testclasse");
			expect(el.className).to.be("testclasse");
		});
		it("Should replace the class of SGV element by the specified argument", function () {
			var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
			L.DomUtil.setClass(svg, "testclasse");
			expect(svg.className.baseVal).to.be("testclasse");
		});
	});
	describe("#getClass", function () {
		it("Should get the classe's name of HTML element", function () {
			el.className = "testclasse";
			expect(L.DomUtil.getClass(el)).to.be("testclasse");
		});
		it("Should get he classe's name of SVG element", function () {
			var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
			svg.className.baseVal = "testclasse";
			expect(L.DomUtil.getClass(svg)).to.be("testclasse");
		});
	});
	describe("#setOpacity", function () {
		it("Should set the Opacity of an HTML element", function () {
			L.DomUtil.setOpacity(el, 1);
			expect(el.style.opacity).to.be("1");
			L.DomUtil.setOpacity(el, 0);
			expect(el.style.opacity).to.be("0");
		});
		// Test for IE support TODO
	});
	describe("#testProp", function () {
		it("Should returns string if prop exists", function () {
			expect(L.DomUtil.testProp(["borderImage"])).to.not.be(false);
		});
		it("Should returns false if props doesn't exist", function () {
			expect(L.DomUtil.testProp(["testprop"])).to.be(false);
		});
	});

	describe('#setTransform', function () {
		it("reset the 3d CSS transform when offset and scale aren't specified", function () {
			L.DomUtil.setTransform(el);
			expect(el.style[L.DomUtil.TRANSFORM]).to.be('translate3d(' + 0 + 'px, ' + 0 + 'px, 0)');
		});
		it("set the 3d CSS transform with just the specified point if scale isn't specified", function () {
			L.DomUtil.setTransform(el, new L.Point(1, 1));
			expect(el.style[L.DomUtil.TRANSFORM]).to.be('translate3d(' + 1 + 'px, ' + 1 + 'px, 0)');
		});
		it("set 3d CSS transform to translate3d(0px, 0px, 0) and add to it scale(${scalevalue}) if only scale is specified", function () {
			L.DomUtil.setTransform(el, undefined, 5);
			expect(el.style[L.DomUtil.TRANSFORM]).to.be('translate3d(' + 0 + 'px, ' + 0 + 'px, 0px) scale(' + 5 + ')');
		});
		it("set the 3d CSS transform with the specified point ant the corresponding scale", function () {
			L.DomUtil.setTransform(el, new L.Point(1, 1), 5);
			expect(el.style[L.DomUtil.TRANSFORM]).to.be('translate3d(' + 1 + 'px, ' + 1 + 'px, 0px) scale(' + 5 + ')');
		});
		// TODO: test with Browser.ie3d to true
	});
	describe("#setPosition", function () {
		it("should set position of el to specified coordinated", function () {
			const point =  new L.Point(1, 2);
			L.DomUtil.setPosition(el, point);
			expect(el._leaflet_pos).to.be(point);
			expect(el.style.left).to.be(1 + "px");
			expect(el.style.top).to.be(2 + "px");
		});
		// TODO: test with Browser.any3d to true
	});
	describe("#setPosition", function () {
		it("should return the coordinates of an element previously positioned with setPosition", function () {
			const point =  new L.Point(1, 2);
			L.DomUtil.setPosition(el, point);
			expect(el._leaflet_pos).to.be(point);
		});
		it("should return a (0, 0) coordinate if the HTML element wasn't positioned before", function () {
			expect(L.DomUtil.getPosition(el)).to.eql(new L.Point(0, 0));
		});
	});
	// TODO: test for disableTextSelection

	// TODO: test for enableTextSelection

	// TODO: test for disableImageDrag

	// TODO: test for enableImageDrag

	describe("#preventOutline", function () {
		// TODO This test failed, why ?
		it("should set outline style to invisible", function () {
			var text = document.createElement('p');
			text.innerHTML = "message test";
			text.style.outline = "currentcolor solid 1rem";
			el.appendChild(text);
			L.DomUtil.preventOutline(text);
			expect(text.style.outline).to.be("none");
		});
	});

	// TODO: restoreOutline

	describe("#getSizedParentNode", function () {
		it("should get the document.body if HTML element", function () {
			expect(L.DomUtil.getSizedParentNode(el)).to.be(document.body);
		});
		it("should return null if the element isn't added to the document yet", function () {
			expect(L.DomUtil.getSizedParentNode(document.createElement('div'))).to.be(null);
		});
		it("should get the first sized parent of an random HTML element", function () {
			var emptyDiv = document.createElement('div');
			var emptyText = document.createElement('p');
			var text = document.createElement('p');
			text.innerHTML = "message test";
			emptyDiv.appendChild(emptyText);
			el.appendChild(emptyDiv);
			el.appendChild(text);
			expect(L.DomUtil.getSizedParentNode(emptyDiv)).to.be(el);
		});
	});
	describe("#getScale", function () {
		it("should return x and y to 1 with all boundingClientRect's values to null  for empty element not added yet to the body", function () {
			var newElement = document.createElement("div");
			expect(L.DomUtil.getScale(newElement)).to.eql({x: 1,
				y: 1,
				boundingClientRect:
				 {left: 0,
				   right: 0,
				   top: 0,
				   height: 0,
				   bottom: 0,
				   width: 0}});
		});
		it("should return corresponding value for default element ${el}", function () {
			expect(L.DomUtil.getScale(el)).to.eql({x: 1,
				y: 1,
				boundingClientRect:
				 {left: -10000,
				   right: -10000,
				   top: -10000,
				   height: 0,
				   bottom: -10000,
				   width: 0}});
		});
	});
});
