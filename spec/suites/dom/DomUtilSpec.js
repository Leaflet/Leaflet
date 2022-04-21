describe('DomUtil', function () {
	var el;

	beforeEach(function () {
		el = document.createElement('div');
		el.style.position = 'absolute';
		el.style.top = el.style.left = '0px';
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
			el.style.color = 'black';
			expect(L.DomUtil.getStyle(el, 'color')).to.eql('black');
			el.style.color = 'green';
			expect(L.DomUtil.getStyle(el, 'color')).to.eql('green');
		});

		(L.Browser.ie ? it.skip : it)("returns empty string if style isn't defined", function () {
			var e = document.createElement('div');
			expect(L.DomUtil.getStyle(e, "position")).to.be('');
		});

		it("returns undefined if style don't exist on HTML element or default css", function () {
			expect(L.DomUtil.getStyle(el, "random_name_for_style")).to.be(undefined);
		});
	});

	describe("#create", function () {
		it("creates an HTML element div without any class name", function () {
			var e = L.DomUtil.create("div");
			expect(e.className).to.eql('');
			expect(e.tagName).to.eql("DIV");
		});

		it("creates an HTML element div with specified class name", function () {
			var e = L.DomUtil.create("div", "test");
			expect(e.className).to.eql('test');
			expect(e.tagName).to.eql("DIV");
		});

		it("creates an p element with a div as parent", function () {
			var parent = L.DomUtil.create("div");
			expect(parent.children.length).to.equal(0);
			var child = L.DomUtil.create("p", "test", parent);
			expect(child.parentNode === parent).to.be(true);
			expect(parent.children.length).to.equal(1);
		});
	});


	describe("#remove", function () {
		it("removes element", function () {
			var e = L.DomUtil.create("div", "test", el);
			L.DomUtil.remove(e);
			expect(el.contains(e)).to.be(false);
		});

		it("does nothing if element hasn't a parent", function () {
			var e = L.DomUtil.create("div", "test");
			L.DomUtil.remove(e);
			expect(document.body.contains(e)).to.be(false);
		});
	});

	describe("#empty", function () {
		it("removes all children of element", function () {
			L.DomUtil.create("div", "test", el);
			L.DomUtil.create("div", "test1", el);
			L.DomUtil.create("div", "test2", el);
			L.DomUtil.empty(el);
			expect(el.childNodes.length).to.be(0);
		});

		it("does nothing if element doesn't have children", function () {
			expect(el.childNodes.length).to.be(0);
			L.DomUtil.empty(el);
			expect(el.childNodes.length).to.be(0);
		});
	});

	describe('#toFront', function () {
		it('moves el to last child position parent element', function () {
			var elm = L.DomUtil.create('div', 'childContainer', el);
			L.DomUtil.create("div", "test", el);
			L.DomUtil.create("div", "test1", el);
			expect(el.children.length).to.equal(3);
			expect(Array.from(el.children).indexOf(elm)).to.be(0);
			L.DomUtil.toFront(elm);
			expect(Array.from(el.children).indexOf(elm)).to.be(2);
		});

		it("doesn't move an element if he's already in the front", function () {
			L.DomUtil.create("div", "test", el);
			L.DomUtil.create("div", "test1", el);
			var e1 = L.DomUtil.create("div", "test2", el);
			expect(el.lastChild).to.eql(e1);
			L.DomUtil.toFront(e1);
			expect(el.lastChild).to.eql(e1);
		});

		it("doesn't crash if element doesn't have a parent", function () {
			var e = L.DomUtil.create("div");
			L.DomUtil.toFront(e);
		});
	});

	describe('#toBack', function () {
		it('moves el to first child position parent element', function () {
			L.DomUtil.create("div", "test", el);
			L.DomUtil.create("div", "test1", el);
			var elm = L.DomUtil.create('div', 'childContainer', el);
			expect(el.children.length).to.equal(3);
			expect(Array.from(el.children).indexOf(elm)).to.be(2);
			L.DomUtil.toBack(elm);
			expect(Array.from(el.children).indexOf(elm)).to.be(0);
		});

		it("doesn't move an element if it is already in the back", function () {
			var e1 = L.DomUtil.create("div", "test", el);
			L.DomUtil.create("div", "test1", el);
			L.DomUtil.create("div", "test2", el);
			expect(el.firstChild).to.be(e1);
			L.DomUtil.toBack(el);
			expect(el.firstChild).to.be(e1);
		});

		it("doesn't crash if an element doesn't have a parent", function () {
			var e = L.DomUtil.create("div");
			L.DomUtil.toBack(e);
		});
	});

	describe('#setClass, #getClass', function () {
		it('sets the elements class', function () {
			expect(el.classList.contains('newClass')).to.not.be.ok();
			L.DomUtil.setClass(el, 'newClass');
			expect(el.classList.contains('newClass')).to.be.ok();
		});

		it('gets the elements class', function () {
			expect(L.DomUtil.getClass(el)).to.not.equal('newClass');
			L.DomUtil.setClass(el, 'newClass');
			expect(L.DomUtil.getClass(el)).to.equal('newClass');
		});
	});

	describe('#setOpacity', function () {
		it('sets opacity of element', function () {
			L.DomUtil.setOpacity(el, 1);
			expect(el.style.opacity).to.equal('1');
			L.DomUtil.setOpacity(el, 0.5);
			expect(el.style.opacity).to.equal('0.5');
			L.DomUtil.setOpacity(el, '0');
			expect(el.style.opacity).to.equal('0');
		});

		it("replaces the class of SGV element by the specified argument", function () {
			var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
			L.DomUtil.setClass(svg, "testclass");
			expect(svg.className.baseVal).to.be("testclass");
		});

		it("gets the class name of SVG element", function () {
			var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
			svg.className.baseVal = "testclass";
			expect(L.DomUtil.getClass(svg)).to.be("testclass");
		});

		it('returns empty string if it has no classes', function () {
			expect(L.DomUtil.getClass(el)).to.be('');
		});
	});

	describe('#testProp', function () {
		(L.Browser.ie ? it.skip : it)('check array of style names return first valid style name for element', function () {
			var hasProp;
			hasProp = L.DomUtil.testProp(['-webkit-transform', '-webkit-transform', '-ms-tranform', '-o-transform']);
			expect(hasProp).to.match(/(?:-webkit-transform|-webkit-transform|-ms-tranform|-o-transform)/);
		});

		it("returns false if property doesn't exist", function () {
			expect(L.DomUtil.testProp(["testprop"])).to.be(false);
		});
	});

	describe('#setTransform', function () {
		it("resets the transform style of an el.", function () {
			expect(L.DomUtil.getStyle(el, 'transform')).to.be.equal('none');

			var offset = L.point(200, 200);
			var scale = 10;
			L.DomUtil.setTransform(el, offset, scale);
			var transform = L.DomUtil.getStyle(el, 'transform');
			expect(L.DomUtil.getStyle(el, 'transform')).to.be.equal(transform);

			var newScale = 20;
			var newOffset = L.point(400, 400);
			L.DomUtil.setTransform(el, newOffset, newScale);
			expect(L.DomUtil.getStyle(el, 'transform')).to.not.be.equal(transform);
		});

		(L.Browser.ie ? it.skip : it)("reset the 3d CSS transform when offset and scale aren't specified", function () {
			L.DomUtil.setTransform(el);
			expect(el.style[L.DomUtil.TRANSFORM]).to.be('translate3d(' + 0 + 'px, ' + 0 + 'px, 0px)');
		});

		(L.Browser.ie ? it.skip : it)("set the 3d CSS transform with just the specified point if scale isn't specified", function () {
			L.DomUtil.setTransform(el, new L.Point(1, 1));
			expect(el.style[L.DomUtil.TRANSFORM]).to.be('translate3d(' + 1 + 'px, ' + 1 + 'px, 0px)');
		});

		(L.Browser.ie ? it.skip : it)("set 3d CSS transform to translate3d(0px, 0px, 0) and add to it scale(${scalevalue}) if only scale is specified", function () {
			L.DomUtil.setTransform(el, undefined, 5);
			expect(el.style[L.DomUtil.TRANSFORM]).to.be('translate3d(' + 0 + 'px, ' + 0 + 'px, 0px) scale(' + 5 + ')');
		});

		(L.Browser.ie ? it.skip : it)("set the 3d CSS transform with the specified point ant the corresponding scale", function () {
			L.DomUtil.setTransform(el, new L.Point(1, 1), 5);
			expect(el.style[L.DomUtil.TRANSFORM]).to.be('translate3d(' + 1 + 'px, ' + 1 + 'px, 0px) scale(' + 5 + ')');
		});
		// TODO: test with Browser.ie3d to true
	});

	describe('#setPosition, #getPosition', function () {
		it("sets position of el to coordinates specified by position.", function () {
			expect(L.DomUtil.getStyle(el, 'left')).to.be.equal('0px');
			expect(L.DomUtil.getStyle(el, 'top')).to.be.equal('0px');

			var x = 50;
			var y = 55;
			var position = L.point(x, y);
			L.DomUtil.setPosition(el, position);
			expect(L.DomUtil.getPosition(el)).to.be.eql({x: x, y: y});

			var newX = 333;
			var newY = 666;
			var newPosition = L.point(newX, newY);
			L.DomUtil.setPosition(el, newPosition);
			expect(L.DomUtil.getPosition(el)).to.be.eql({x: newX, y: newY});
		});

		it("returns position of an element positioned with setPosition.", function () {
			var coordinates = {x: 333, y: 666};
			var position = L.point(coordinates);
			expect(L.DomUtil.getPosition(el)).to.not.eql(coordinates);
			L.DomUtil.setPosition(el, position);
			expect(L.DomUtil.getPosition(el)).to.be.an('object');
			expect(L.DomUtil.getPosition(el)).to.eql(coordinates);
		});

		it("returns [0, 0] point if the HTML element wasn't positioned before", function () {
			expect(L.DomUtil.getPosition(el)).to.eql(new L.Point(0, 0));
		});
	});

	describe('#getSizedParentNode', function () {
		it('find nearest parent element where height / width are not null', function () {
			var child = document.createElement('div');
			var grandChild = document.createElement('div');
			el.appendChild(child);
			child.appendChild(grandChild);
			child.style.width = child.style.height = '500px';
			expect(L.DomUtil.getSizedParentNode(grandChild)).to.eql(child);
		});

		it("throws an error if the element hasn't a parent", function () {
			expect(function () {
				L.DomUtil.getSizedParentNode(document.createElement('div'));
			}).to.throwException();
		});
	});

	describe('#getScale', function () {
		it('returns scale of element as x & y scales respectively', function () {
			var childEl = document.createElement('div');
			childEl.style.width = '250px';
			childEl.style.height = '250px';
			childEl.style.padding = '15px';
			childEl.style.margin = '25px';
			el.appendChild(childEl);
			var scale = {
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

		(L.Browser.ie ? it.skip : it)("returns x and y to 1 with all boundingClientRect's values to 0 for empty element not added yet to the body", function () {
			var newElement = document.createElement("div");
			var scale = L.DomUtil.getScale(newElement);
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


	describe('#disableTextSelection, #enableTextSelection', function () {
		it('disable / enable the selectstart DOM events for the user ', function () {
			var selectionPrevented;
			function checkPrevented(e) {
				if (e.defaultPrevented) {
					selectionPrevented = true;
				} else {
					selectionPrevented = false;
				}
			}
			var child = document.createElement('div');
			el.appendChild(child);

			L.DomUtil.disableTextSelection();
			window.addEventListener('selectstart', checkPrevented);
			happen.once(child, {type: 'selectstart'});
			expect(selectionPrevented).to.be.ok();

			L.DomUtil.enableTextSelection();
			happen.once(child, {type: 'selectstart'});
			expect(selectionPrevented).to.not.be.ok();
		});
	});

	describe('#disableImageDrag, #enablerImageDrag', function () {
		it('disable / enable dragstart DOM events for the user', function () {
			var selectionPrevented;
			function checkPrevented(e) {
				if (e.defaultPrevented) {
					selectionPrevented = true;
				} else {
					selectionPrevented = false;
				}
			}
			var child = document.createElement('div');
			el.appendChild(child);

			L.DomUtil.disableImageDrag();
			window.addEventListener('dragstart', checkPrevented);
			happen.once(child, {type: 'dragstart'});
			expect(selectionPrevented).to.be.ok();

			L.DomUtil.enableImageDrag();
			happen.once(child, {type: 'dragstart'});
			expect(selectionPrevented).to.not.be.ok();
		});
	});

	describe('#preventOutline, #restoreOutline', function () {
		(L.Browser.ie ? it.skip : it)('prevent / restore outline for the element', function () {
			var child = document.createElement('div');
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
			happen.once(child, {type: 'keydown'});
			expect(child.style.outline).to.be.equal(child.style.outline);
		});
	});
});
