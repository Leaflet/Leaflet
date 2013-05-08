describe('Events', function() {
	var Klass;

	beforeEach(function() {
		Klass = L.Class.extend({
			includes: L.Mixin.Events
		});
	});

	describe('#fireEvent', function() {

		it('fires all listeners added through #addEventListener', function() {
			var obj = new Klass(),
				spy1 = sinon.spy(),
				spy2 = sinon.spy(),
				spy3 = sinon.spy(),
				spy4 = sinon.spy(),
				spy5 = sinon.spy();
				spy6 = sinon.spy();

			obj.addEventListener('test', spy1);
			obj.addEventListener('test', spy2);
			obj.addEventListener('other', spy3);
			obj.addEventListener({ test: spy4, other: spy5 });
			obj.addEventListener({'test other': spy6 });

			expect(spy1.called).to.be(false);
			expect(spy2.called).to.be(false);
			expect(spy3.called).to.be(false);
			expect(spy4.called).to.be(false);
			expect(spy5.called).to.be(false);
			expect(spy6.called).to.be(false);

			obj.fireEvent('test');

			expect(spy1.called).to.be(true);
			expect(spy2.called).to.be(true);
			expect(spy3.called).to.be(false);
			expect(spy4.called).to.be(true);
			expect(spy5.called).to.be(false);
			expect(spy6.called).to.be(true);
			expect(spy6.callCount).to.be(1);
		});

		it('provides event object to listeners and executes them in the right context', function() {
			var obj = new Klass(),
				obj2 = new Klass(),
				obj3 = new Klass(),
				obj4 = new Klass(),
				foo = {};

			function listener1(e) {
				expect(e.type).to.eql('test');
				expect(e.target).to.eql(obj);
				expect(this).to.eql(obj);
				expect(e.baz).to.eql(1);
			}

			function listener2(e) {
				expect(e.type).to.eql('test');
				expect(e.target).to.eql(obj2);
				expect(this).to.eql(foo);
				expect(e.baz).to.eql(2);
			}

			function listener3(e) {
				expect(e.type).to.eql('test');
				expect(e.target).to.eql(obj3);
				expect(this).to.eql(obj3);
				expect(e.baz).to.eql(3);
			}

			function listener4(e) {
				expect(e.type).to.eql('test');
				expect(e.target).to.eql(obj4);
				expect(this).to.eql(foo);
				expect(e.baz).to.eql(4);
			}

			obj.addEventListener('test', listener1);
			obj2.addEventListener('test', listener2, foo);
			obj3.addEventListener({ test: listener3 });
			obj4.addEventListener({ test: listener4 }, foo);

			obj.fireEvent('test', {baz: 1});
			obj2.fireEvent('test', {baz: 2});
			obj3.fireEvent('test', {baz: 3});
			obj4.fireEvent('test', {baz: 4});
		});

		it('calls no listeners removed through #removeEventListener', function() {
			var obj = new Klass(),
				spy = sinon.spy(),
				spy2 = sinon.spy(),
				spy3 = sinon.spy(),
				spy4 = sinon.spy(),
				spy5 = sinon.spy();

			obj.addEventListener('test', spy);
			obj.removeEventListener('test', spy);

			obj.fireEvent('test');

			expect(spy.called).to.be(false);

			obj.addEventListener('test2', spy2);
			obj.addEventListener('test2', spy3);
			obj.removeEventListener('test2');

			obj.fireEvent('test2');

			expect(spy2.called).to.be(false);
			expect(spy3.called).to.be(false);

			obj.addEventListener('test3', spy4);
			obj.addEventListener('test4', spy5);
			obj.removeEventListener({
				test3: spy4,
				test4: spy5
			});

			obj.fireEvent('test3');
			obj.fireEvent('test4');

			expect(spy4.called).to.be(false);
			expect(spy5.called).to.be(false);
		});

		it('can handle calls to #removeEventListener on objects with no registered event listeners', function () {
			var obj = new Klass();
			var removeNonExistentListener = function () {
				obj.removeEventListener('test');
			};
			expect(removeNonExistentListener).to.not.throwException();
		});

		// added due to context-sensitive removeListener optimization
		it('fires multiple listeners with the same context with id', function () {
			var obj = new Klass(),
				spy1 = sinon.spy(),
				spy2 = sinon.spy(),
				foo = {};

			L.Util.stamp(foo);

			obj.addEventListener('test', spy1, foo);
			obj.addEventListener('test', spy2, foo);

			obj.fireEvent('test');

			expect(spy1.called).to.be(true);
			expect(spy2.called).to.be(true);
		});

		it('removes listeners with stamped contexts', function () {
			var obj = new Klass(),
				spy1 = sinon.spy(),
				spy2 = sinon.spy(),
				foo = {};

			L.Util.stamp(foo);

			obj.addEventListener('test', spy1, foo);
			obj.addEventListener('test', spy2, foo);

			obj.removeEventListener('test', spy1, foo);

			obj.fireEvent('test');

			expect(spy1.called).to.be(false);
			expect(spy2.called).to.be(true);
		});

		it('removes listeners with a stamp originally added without one', function() {
			var obj = new Klass(),
				spy1 = sinon.spy(),
				spy2 = sinon.spy(),
				foo = {};

			obj.addEventListener('test', spy1, foo);
			L.Util.stamp(foo);
			obj.addEventListener('test', spy2, foo);

			obj.removeEventListener('test', spy1, foo);
			obj.removeEventListener('test', spy2, foo);

			obj.fireEvent('test');

			expect(spy1.called).to.be(false);
			expect(spy2.called).to.be(false);
		});

		it('doesnt lose track of listeners when removing non existent ones', function () {
			var obj = new Klass(),
			    spy = sinon.spy(),
			    spy2 = sinon.spy(),
			    foo = {},
			    foo2 = {};

			L.Util.stamp(foo);
			L.Util.stamp(foo2);

			obj.addEventListener('test', spy, foo2);

			obj.removeEventListener('test', spy, foo); // Decrements test_idx to 0, even though event listener isn't registered with foo's _leaflet_id
			obj.removeEventListener('test', spy, foo2);  // Doesn't get removed

			obj.addEventListener('test', spy2, foo);

			obj.fireEvent('test');

			expect(spy.called).to.be(false);
		});

		it('makes sure an event is not triggered if a listener is removed during dispatch',function() {
			var obj = new Klass(),
			    spy = sinon.spy();
			    obj.addEventListener('test', function() { obj.removeEventListener('test',spy); });
			    obj.addEventListener('test', spy);
			    obj.fireEvent('test');

			expect(spy.called).to.be(false);
		});
	});

	describe('#on, #off & #fire', function() {

		it('works like #addEventListener && #removeEventListener', function() {
			var obj = new Klass(),
				spy = sinon.spy();

			obj.on('test', spy);
			obj.fire('test');

			expect(spy.called).to.be(true);

			obj.off('test', spy);
			obj.fireEvent('test');

			expect(spy.callCount).to.be.lessThan(2);
		});

		it('does not override existing methods with the same name', function() {
			var spy1 = sinon.spy(),
				spy2 = sinon.spy(),
				spy3 = sinon.spy();

			var Klass2 = L.Class.extend({
				includes: L.Mixin.Events,
				on: spy1,
				off: spy2,
				fire: spy3
			});

			var obj = new Klass2();

			obj.on();
			expect(spy1.called).to.be(true);

			obj.off();
			expect(spy2.called).to.be(true);

			obj.fire();
			expect(spy3.called).to.be(true);
		});
	});

	describe("#clearEventListeners", function() {
		it("clears all registered listeners on an object", function() {
			var spy = sinon.spy(),
				obj = new Klass()
				otherObj = new Klass();

			obj.on('test', spy, obj);
			obj.on('testTwo', spy);
			obj.on('test', spy, otherObj);
			obj.off();

			obj.fire('test');

			expect(spy.called).to.be(false);
		});
	});

	describe('#once', function() {
		it('removes event listeners after first trigger', function() {
			var obj = new Klass(),
				spy = sinon.spy();

			obj.once('test', spy, obj);
			obj.fire('test');

			expect(spy.called).to.be(true);

			obj.fire('test');

			expect(spy.callCount).to.be.lessThan(2);
		});

		it('works with an object hash', function() {
			var obj = new Klass(),
				spy = sinon.spy(),
				otherSpy = sinon.spy();

			obj.once({
				'test': spy,
				otherTest: otherSpy
			}, obj);

			obj.fire('test');
			obj.fire('otherTest');

			expect(spy.called).to.be(true);
			expect(otherSpy.called).to.be(true);

			obj.fire('test');
			obj.fire('otherTest');

			expect(spy.callCount).to.be.lessThan(2);
			expect(otherSpy.callCount).to.be.lessThan(2);
		});

		it("doesn't call listeners to events that have been removed", function () {
		    var obj = new Klass(),
                spy = sinon.spy();

		    obj.once('test', spy, obj);
		    obj.off('test', spy, obj);

		    obj.fire('test');

		    expect(spy.called).to.be(false);
		});

		it('works if called from a context that doesnt implement #Events', function() {
			var obj = new Klass(),
				spy = sinon.spy(),
				foo = {};

			obj.once('test', spy, foo);

			obj.fire('test');

			expect(spy.called).to.be(true);
		});
	});
});
