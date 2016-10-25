describe('ListenerCollection', function () {

	describe('#initialize', function () {
		it('initializes the collection type to array', function () {
			var obj = new L.ListenerCollection();
			expect(obj._arrayMembers).to.be(true);
		});

		it('initializes the internal collection as an array', function () {
			var obj = new L.ListenerCollection();
			expect(Array.isArray(obj._members)).to.be(true);
		});
	});

	describe('#_switchToArray', function () {
		it('does nothing if _members is an array', function () {
			var obj = new L.ListenerCollection(),
			    l1 = {fn: sinon.spy()};
			obj.add(l1);

			expect(Array.isArray(obj._members)).to.be(true);
			expect(obj._switchToArray()).to.be(false);
		});

		it('returns true when called', function () {
			var obj = new L.ListenerCollection(),
			    l1 = {fn: sinon.spy()};
			obj.add(l1);
			obj._switchToObject();

			expect(obj._switchToArray()).to.be(true);
		});

		it('switches _members to an array', function () {
			var obj = new L.ListenerCollection(),
			    l1 = {fn: sinon.spy()};
			obj.add(l1);
			obj._switchToObject();

			expect(Array.isArray(obj._members)).to.be(false);
			obj._switchToArray();
			expect(Array.isArray(obj._members)).to.be(true);
		});

		it('deletes _count', function () {
			var obj = new L.ListenerCollection(),
			    l1 = {fn: sinon.spy()};
			obj.add(l1);
			obj._switchToObject();

			expect(obj._count).to.be(1);
			obj._switchToArray();
			expect(obj._count).to.be(undefined);
		});

		it('changes _arrayMembers to true', function () {
			var obj = new L.ListenerCollection(),
			    l1 = {fn: sinon.spy()};
			obj.add(l1);
			obj._switchToObject();

			expect(obj._arrayMembers).to.be(false);
			obj._switchToArray();
			expect(obj._arrayMembers).to.be(true);
		});

		it('keeps the right count()', function () {
			var obj = new L.ListenerCollection(),
			    l1 = {fn: sinon.spy()},
			    l2 = {fn: sinon.spy()},
			    l3 = {fn: sinon.spy()};
			obj.add(l1);
			obj.add(l2);
			obj.add(l3);
			obj._switchToObject();

			expect(obj.count()).to.be(3);
			obj._switchToArray();
			expect(obj.count()).to.be(3);
		});

		it('finds all the listeners before and after switching', function () {
			var obj = new L.ListenerCollection(),
			    l1 = {fn: sinon.spy()},
			    l2 = {fn: sinon.spy()},
			    l3 = {fn: sinon.spy()};
			obj.add(l1);
			obj.add(l2);
			obj.add(l3);
			obj._switchToObject();

			expect(obj.find(l1)).to.be(l1);
			expect(obj.find(l2)).to.be(l2);
			expect(obj.find(l3)).to.be(l3);
			obj._switchToArray();
			expect(obj.find(l1)).to.be(l1);
			expect(obj.find(l2)).to.be(l2);
			expect(obj.find(l3)).to.be(l3);
		});
	});

	describe('#_switchToObject', function () {
		it('does nothing if _members is an object', function () {
			var obj = new L.ListenerCollection(),
			    l1 = {fn: sinon.spy()};
			obj.add(l1);
			obj._switchToObject();
			expect(Array.isArray(obj._members)).to.be(false);
			expect(obj._switchToObject()).to.be(false);
		});

		it('returns true when called', function () {
			var obj = new L.ListenerCollection(),
			    l1 = {fn: sinon.spy()};
			obj.add(l1);

			expect(obj._switchToObject()).to.be(true);
		});

		it('switches _members to an object', function () {
			var obj = new L.ListenerCollection(),
			    l1 = {fn: sinon.spy()};
			obj.add(l1);

			expect(Array.isArray(obj._members)).to.be(true);
			obj._switchToObject();
			expect(Array.isArray(obj._members)).to.be(false);
		});

		it('creates the field _count', function () {
			var obj = new L.ListenerCollection(),
			    l1 = {fn: sinon.spy()};
			obj.add(l1);

			expect(obj._count).to.be(undefined);
			obj._switchToObject();
			expect(obj._count).to.be(1);
		});

		it('changes _arrayMembers to false', function () {
			var obj = new L.ListenerCollection(),
			    l1 = {fn: sinon.spy()};
			obj.add(l1);

			expect(obj._arrayMembers).to.be(true);
			obj._switchToObject();
			expect(obj._arrayMembers).to.be(false);
		});

		it('keeps the right count()', function () {
			var obj = new L.ListenerCollection(),
			    l1 = {fn: sinon.spy()},
			    l2 = {fn: sinon.spy()},
			    l3 = {fn: sinon.spy()};
			obj.add(l1);
			obj.add(l2);
			obj.add(l3);

			expect(obj.count()).to.be(3);
			obj._switchToObject();
			expect(obj.count()).to.be(3);
		});

		it('finds all the listeners before and after switching', function () {
			var obj = new L.ListenerCollection(),
			    l1 = {fn: sinon.spy()},
			    l2 = {fn: sinon.spy()},
			    l3 = {fn: sinon.spy()};
			obj.add(l1);
			obj.add(l2);
			obj.add(l3);

			expect(obj.find(l1)).to.be(l1);
			expect(obj.find(l2)).to.be(l2);
			expect(obj.find(l3)).to.be(l3);
			obj._switchToObject();
			expect(obj.find(l1)).to.be(l1);
			expect(obj.find(l2)).to.be(l2);
			expect(obj.find(l3)).to.be(l3);
		});
	});

	describe('#_sameListener', function () {
		it('is false if first fn different from second fn', function () {
			var obj = new L.ListenerCollection(),
			    spy1 = sinon.spy(),
			    spy2 = sinon.spy(),
			    l1 = {fn: spy1},
			    l2 = {fn: spy2};
			expect(obj._sameListener(l1, l2)).to.be(false);
		});

		it('is true if first fn equals second fn', function () {
			var obj = new L.ListenerCollection(),
			    spy1 = sinon.spy(),
			    l1 = {fn: spy1},
			    l2 = {fn: spy1};
			expect(obj._sameListener(l1, l2)).to.be(true);
		});

		it('is false if same fn but different contexts', function () {
			var obj = new L.ListenerCollection(),
			    spy1 = sinon.spy(),
			    l1 = {fn: spy1, ctx:{}},
			    l2 = {fn: spy1, ctx:{}};
			expect(obj._sameListener(l1, l2)).to.be(false);
		});

		it('is true if same fn and same context', function () {
			var obj = new L.ListenerCollection(),
			    spy1 = sinon.spy(),
			    ctx = {},
			    l1 = {fn: spy1, ctx:ctx},
			    l2 = {fn: spy1, ctx:ctx};
			expect(obj._sameListener(l1, l2)).to.be(true);
		});
	});

	describe('#find', function () {

		it('returns null if collection is empty', function () {
			var obj = new L.ListenerCollection(),
			    l1 = {fn: sinon.spy()};
			expect(obj.find(l1)).to.be(null);
		});

		it('returns null if no listener found', function () {
			var obj = new L.ListenerCollection(),
			    l1 = {fn: sinon.spy()},
			    l2 = {fn: sinon.spy()};
			obj.add(l1);
			expect(obj.find(l2)).to.be(null);
		});

		it('returns the listener object if found (with members as array)', function () {
			var obj = new L.ListenerCollection(),
			    l1 = {fn: sinon.spy()},
			    l2 = {fn: sinon.spy()},
			    l3 = {fn: sinon.spy()};
			obj.add(l1);
			obj.add(l2);
			obj.add(l3);
			expect(obj.find(l2)).to.be(l2);
		});

		it('returns the listener object if found (with _members as object)', function () {
			var obj = new L.ListenerCollection();
			for (var i = 0; i < L.ListenerCollection.MAX_ARRAY + 1; i++) { // add elements until we are sure _members has switched to an object
				obj.add({fn: sinon.spy()});
			}
			var l1 = {fn: sinon.spy()},
			    l2 = {fn: sinon.spy()},
			    l3 = {fn: sinon.spy()};
			obj.add(l1);
			obj.add(l2);
			obj.add(l3);
			expect(obj.find(l2)).to.be(l2);
		});
	});

	describe('#add', function () {
		describe('with _members as array', function () {
			it('adds a new listener', function () {
				var obj = new L.ListenerCollection();
				var c = obj.count();
				expect(obj.add({fn: sinon.spy()})).to.be(true);
				expect(obj.count()).to.be(c + 1);
			});

			it('adds a listener with the same fn of another but different ctx', function () {
				var obj = new L.ListenerCollection(),
				    fn = sinon.spy(),
				    ctx1 = {},
				    ctx2 = {};
				obj.add({fn: fn, ctx: ctx1});
				var c = obj.count();
				expect(obj.add({fn: fn, ctx: ctx2})).to.be(true);
				expect(obj.count()).to.be(c + 1);
			});

			it('does not add a listener with the same fn of another one', function () {
				var obj = new L.ListenerCollection(),
				    fn = sinon.spy(),
				    ctx1 = {},
				    ctx2 = {};
				obj.add({fn: fn});
				var c = obj.count();
				expect(obj.add({fn: fn})).to.be(false);
				expect(obj.count()).to.be(c);
			});

			it('does not add a listener with the same fn and ctx of another one', function () {
				var obj = new L.ListenerCollection(),
				    fn = sinon.spy(),
				    ctx = {};
				obj.add({fn: fn, ctx: ctx});
				var c = obj.count();
				expect(obj.add({fn: fn, ctx: ctx})).to.be(false);
				expect(obj.count()).to.be(c);
			});

			it('switches _members to object if needed', function () {
				var obj = new L.ListenerCollection();
				obj._switchToObject = sinon.spy();
				for (var i = 0; i < L.ListenerCollection.MAX_ARRAY; i++) {
					obj.add({fn: sinon.spy()});
				}
				expect(obj._switchToObject.called).to.be(false);
				obj.add({fn: sinon.spy()});
				expect(obj._switchToObject.calledOnce).to.be(true);
			});
		});

		describe('with _members as object', function () {
			it('adds a new listener', function () {
				var obj = new L.ListenerCollection();
				for (var i = 0; i < L.ListenerCollection.MAX_ARRAY + 1; i++) { // add elements until _members becomes an object
					obj.add({fn: sinon.spy()});
				}
				var c = obj.count();
				expect(obj.add({fn: sinon.spy()})).to.be(true);
				expect(obj.count()).to.be(c + 1);
			});

			it('adds a listener with the same fn of another but different ctx', function () {
				var obj = new L.ListenerCollection(),
				    fn = sinon.spy(),
				    ctx1 = {},
				    ctx2 = {};
				for (var i = 0; i < L.ListenerCollection.MAX_ARRAY + 1; i++) { // add elements until _members becomes an object
					obj.add({fn: sinon.spy()});
				}
				obj.add({fn: fn, ctx: ctx1});
				var c = obj.count();
				expect(obj.add({fn: fn, ctx: ctx2})).to.be(true);
				expect(obj.count()).to.be(c + 1);
			});

			it('does not add a listener with the same fn of another one', function () {
				var obj = new L.ListenerCollection(),
				    fn = sinon.spy(),
				    ctx1 = {},
				    ctx2 = {};
				for (var i = 0; i < L.ListenerCollection.MAX_ARRAY + 1; i++) { // add elements until _members becomes an object
					obj.add({fn: sinon.spy()});
				}
				obj.add({fn: fn});
				var c = obj.count();
				expect(obj.add({fn: fn})).to.be(false);
				expect(obj.count()).to.be(c);
			});

			it('does not add a listener with the same fn and ctx of another one', function () {
				var obj = new L.ListenerCollection(),
				    fn = sinon.spy(),
				    ctx = {};
				for (var i = 0; i < L.ListenerCollection.MAX_ARRAY + 1; i++) { // add elements until _members becomes an object
					obj.add({fn: sinon.spy()});
				}
				obj.add({fn: fn, ctx: ctx});
				var c = obj.count();
				expect(obj.add({fn: fn, ctx: ctx})).to.be(false);
				expect(obj.count()).to.be(c);
			});
		});
	});

	describe('#count', function () {
		it('returns 0 if empty', function () {
			var obj = new L.ListenerCollection();
			expect(obj.count()).to.be(0);
		});

		it('returns the number of listeners', function () {
			var obj = new L.ListenerCollection();
			obj.add({fn: sinon.spy()});
			obj.add({fn: sinon.spy()});
			obj.add({fn: sinon.spy()});
			expect(obj.count()).to.be(3);
		});

		it('returns the number of listeners when _members is an array', function () {
			var obj = new L.ListenerCollection();
			for (var i = 0; i < L.ListenerCollection.MIN_OBJECT - 1; i++) { // add elements while we are sure _members remains an array
				obj.add({fn: sinon.spy()});
			}
			expect(obj.count()).to.be(L.ListenerCollection.MIN_OBJECT - 1);
		});

		it('returns the number of listeners when using an object internally', function () {
			var obj = new L.ListenerCollection();
			for (var i = 0; i < L.ListenerCollection.MAX_ARRAY + 1; i++) { // add elements until we are sure _members has switched to an object
				obj.add({fn: sinon.spy()});
			}
			expect(obj.count()).to.be(L.ListenerCollection.MAX_ARRAY + 1);
		});
	});

	describe('#remove', function () {
		it('does not remove a listener if collection is empty', function () {
			var obj = new L.ListenerCollection();
			expect(obj.remove({fn: sinon.spy()})).to.be(false);
			expect(obj.count()).to.be(0);
		});

		it('does not remove a listener if not found, with _members as array', function () {
			var obj = new L.ListenerCollection();
			obj.add({fn: sinon.spy()});
			obj.add({fn: sinon.spy()});
			obj.add({fn: sinon.spy()});
			expect(obj.remove({fn: sinon.spy()})).to.be(false);
			expect(obj.count()).to.be(3);
		});

		it('does not remove a listener if not found, with _members as object', function () {
			var obj = new L.ListenerCollection();
			for (var i = 0; i < L.ListenerCollection.MAX_ARRAY + 1; i++) { // add elements until we are sure _members has switched to an object
				obj.add({fn: sinon.spy()});
			}
			expect(obj.remove({fn: sinon.spy()})).to.be(false);
			expect(obj.count()).to.be(L.ListenerCollection.MAX_ARRAY + 1);
		});

		it('removes a listener if found, with _members as array', function () {
			var obj = new L.ListenerCollection(),
			    lis1 = {fn: sinon.spy()},
			    lis2 = {fn: sinon.spy()},
			    lis3 = {fn: sinon.spy()};
			obj.add(lis1);
			obj.add(lis2);
			obj.add(lis3);
			var c = obj.count();
			expect(obj.find(lis1)).to.be(lis1);
			expect(obj.find(lis2)).to.be(lis2);
			expect(obj.find(lis3)).to.be(lis3);
			expect(obj.remove(lis2)).to.be(true);
			expect(obj.count()).to.be(c - 1);
			expect(obj.find(lis1)).to.be(lis1);
			expect(obj.find(lis2)).to.be(null);
			expect(obj.find(lis3)).to.be(lis3);
		});

		it('removes a listener if found, with _members as object', function () {
			var obj = new L.ListenerCollection(),
			    lis1 = {fn: sinon.spy()},
			    lis2 = {fn: sinon.spy()},
			    lis3 = {fn: sinon.spy()};
			for (var i = 0; i < L.ListenerCollection.MAX_ARRAY + 1; i++) { // add elements until we are sure _members has switched to an object
				obj.add({fn: sinon.spy()});
			}
			obj.add(lis1);
			obj.add(lis2);
			obj.add(lis3);
			var c = obj.count();
			expect(obj.find(lis1)).to.be(lis1);
			expect(obj.find(lis2)).to.be(lis2);
			expect(obj.find(lis3)).to.be(lis3);
			expect(obj.remove(lis2)).to.be(true);
			expect(obj.count()).to.be(c - 1);
			expect(obj.find(lis1)).to.be(lis1);
			expect(obj.find(lis2)).to.be(null);
			expect(obj.find(lis3)).to.be(lis3);
		});

		it('switches back _members to an array if needed', function () {
			var obj = new L.ListenerCollection(),
			    lisArray = [],
			    i = 0;
			obj._switchToArray = sinon.spy();
			for (i = 0; i < L.ListenerCollection.MAX_ARRAY + 1; i++) {
				var lis = {fn: sinon.spy()};
				lisArray.push(lis);
				obj.add(lis);
			}
			for (i = 0; i < lisArray.length - L.ListenerCollection.MIN_OBJECT; i++) {
				obj.remove(lisArray[i]);
			}
			expect(obj._switchToArray.called).to.be(false);
			expect(obj.count()).to.be(L.ListenerCollection.MIN_OBJECT);
			obj.remove(lisArray[i + 1]);
			expect(obj._switchToArray.calledOnce).to.be(true);
		});
	});

	describe('#_listenerId', function () {
		it("returns a string id", function () {
			var obj = new L.ListenerCollection(),
			    lis = {fn: sinon.spy(), ctx: {}};
			expect(typeof obj._listenerId(lis)).to.be("string");
		});

		it("returns different ids for listeners with different fn", function () {
			var obj = new L.ListenerCollection(),
			    l1 = {fn: sinon.spy()},
			    l2 = {fn: sinon.spy()};
			expect(obj._listenerId(l1)).to.not.be(obj._listenerId(l2));
		});

		it("returns different ids for listeners with same fn and different ctx", function () {
			var obj = new L.ListenerCollection(),
			    fn = sinon.spy(),
			    l1 = {fn: fn, ctx: {}},
			    l2 = {fn: fn, ctx: {}};
			expect(obj._listenerId(l1)).to.not.be(obj._listenerId(l2));
		});

		it("returns the same id for listeners with same fn", function () {
			var obj = new L.ListenerCollection(),
			    fn = sinon.spy(),
			    l1 = {fn: fn},
			    l2 = {fn: fn};
			expect(obj._listenerId(l1)).to.be(obj._listenerId(l2));
		});

		it("returns the same id for listeners with same fn and same ctx", function () {
			var obj = new L.ListenerCollection(),
			    fn = sinon.spy(),
			    ctx = {},
			    l1 = {fn: fn, ctx: ctx},
			    l2 = {fn: fn, ctx: ctx};
			expect(obj._listenerId(l1)).to.be(obj._listenerId(l2));
		});
	});

});
