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

	describe('#setAnchoredTransform', function () {
		it('does not rotate or scale if angle is 0 and scale is 1', function () {
			L.DomUtil.setAnchoredTransform(el, L.point(5, 6), L.point(1, 2), 0, 1);
			if (L.Browser.any3d) {
				expect(el.style[L.DomUtil.TRANSFORM])
					.to.match(/translate(3d)?\(5px, 6px(, 0)?\)/);
			} else if (L.Browser.ie) {
				expect(el.filters['DXImageTransform.Microsoft.Matrix']).to.be('');
			} else {
				expect(el.style.left).to.be('5px');
				expect(el.style.top).to.be('6px');
			}
		});

		it('translates, rotates, and scales', function () {
			L.DomUtil.setAnchoredTransform(el, L.point(5, 6), L.point(1, 2), -120, 2);
			if (L.Browser.any3d) {
				expect(el.style[L.DomUtil.TRANSFORM])
					.to.match(/translate(3d)?\(3.535[0-9]+px, 11.732[0-9]+px(, 0px)?\) scale\(2\) rotate\(-120deg\)/);
			} else if (L.Browser.ie) {
				expect(el.filters['DXImageTransform.Microsoft.Matrix']).to.be('');
			} else {
				expect(el.style.left).to.be('5px');
				expect(el.style.top).to.be('6px');
			}
		});
		
	});
});
