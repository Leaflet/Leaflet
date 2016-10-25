/*
 * @class ListenerCollection
 * @aka L.ListenerCollection
 * @inherits Class
 *
 * A collection of listener, each one defined as an object with a function 'fn' and an optional context 'ctx'
 *
 * All collection members are considered equal by reference equality between their 'fn' and 'ctx' fields
 */


L.ListenerCollection = L.Class.extend({

	statics: {
		MAX_ARRAY: 30, // Maximum number of listeners before switching _members to object
		MIN_OBJECT: 20 // Minimum number of listeners before switching back _members to array
	},

	// @constructor L.ListenerCollection()
	initialize: function () {
		this._arrayMembers = true;
		this._members = [];
	},

	// @method count(): Number
	// Returns the number of members inside the collection
	count: function () {
		if (this._arrayMembers) { return this._members.length; }
		return this._count;
	},

	// @method add(listener: Object): Boolean
	// Add a listener object to the collection if it doesn't exist.
	// Returns true if the listener was added; returns false otherwise.
	add: function (listener) {
		var mbr = this._members;
		if (this.find(listener) === null) {
			if (this._arrayMembers) {
				mbr.push(listener);
			} else {
				mbr[this._listenerId(listener)] = listener;
				this._count++;
			}
			if (this.count() > L.ListenerCollection.MAX_ARRAY) {
				this._switchToObject();
			}
			return true;
		}
		return false;
	},

	// @method remove(listener: Object): Boolean
	// Remove a listener object to the collection if it exists.
	// Returns true if the listener was removed; returns false otherwise.
	remove: function (listener) {
		var mbr = this._members;
		if (this._arrayMembers) {
			for (var i = 0; i < mbr.length; i++) {
				if (this._sameListener(mbr[i], listener)) {
					mbr[i].fn = L.Util.falseFn; // Set fn to noop so that's not called if remove happens in fire
					mbr.splice(i, 1);
					return true;
				}
			}
		} else {
			var lid = this._listenerId(listener);
			if (mbr[lid]) {
				mbr[lid].fn = L.Util.falseFn; // Set fn to noop so that's not called if remove happens in fire
				delete mbr[lid];
				this._count--;
				if (this.count() < L.ListenerCollection.MIN_OBJECT) {
					this._switchToArray();
				}
				return true;
			}
		}
		return false;
	},

	// @method removeAll(): Boolean
	// Remove all the listener objects from the collection.
	// Returns true if the listeners were removed, false if the collection was empty
	removeAll: function () {
		if (this.count() === 0) { return false; }
		this.each(function (listener) {
			listener.fn = L.Util.falseFn;
		});
		delete this._count;
		this.initialize();
		return true;
	},

	// @method cloneMembers()
	// Copy the _members data structure, keeping the same members
	copyMembers: function () {
		if (this._arrayMembers) {
			this._members = this._members.slice();
		} else {
			var tmp = this._members;
			this._members = {};
			for (var key in tmp) {
				if (tmp.hasOwnProperty(key)) {
					this._members[key] = tmp[key];
				}
			}
		}
	},

	// @method find(listener: Object): Object
	// Find and return a listener object from the collection if it exists, otherwise return null.
	find: function (listener) {
		var mbr = this._members;
		if (this._arrayMembers) {
			for (var i = 0; i < mbr.length; i++) {
				if (this._sameListener(mbr[i], listener)) {
					return mbr[i];
				}
			}
		} else {
			return mbr[this._listenerId(listener)] || null;
		}
		return null;
	},

	// @method each(fn: Function)
	// Iterates over all the listeners, invoking fn at each step, with the current listener passed as a parameter
	each: function (fn) {
		var mbr = this._members;
		if (this._arrayMembers) {
			for (var i = 0; i < mbr.length; i++) {
				fn(mbr[i]);
			}
		} else {
			for (var id in mbr) {
				if (mbr.hasOwnProperty(id)) {
					fn(mbr[id]);
				}
			}
		}
	},

	// Switches the internal data structure used to store the members to an object
	_switchToObject: function () {
		if (!this._arrayMembers) { return false; }
		var tmp = this._members;
		this._members = {};
		this._count = tmp.length;
		for (var i = 0; i < tmp.length; i++) {
			this._members[this._listenerId(tmp[i])] = tmp[i];
		}
		this._arrayMembers = false;
		return true;
	},

	// Switches the internal data structure used to store the members to an array
	_switchToArray: function () {
		if (this._arrayMembers) { return false; }
		var tmp = this._members;
		this._members = [];
		delete this._count;
		for (var k in tmp) {
			if (tmp.hasOwnProperty(k)) {
				this._members.push(tmp[k]);
			}
		}
		this._arrayMembers = true;
		return true;
	},

	// Returns an id for a listener
	_listenerId: function (listener) {
		return 'id_' + L.stamp(listener.fn) + (listener.ctx && ('_' + L.stamp(listener.ctx)) || '');
	},

	// Returns `true` if two listeners have the same fn and ctx.
	_sameListener: function (l1, l2) {
		return l1.fn === l2.fn && l1.ctx === l2.ctx;
	},
});
