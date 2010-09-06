/*
 * L.Mixin.Options adds a small shortcut for options handling
 */

L.Mixin.Options = {
	setOptions: function(/*Object*/ options) {
		this.options = this.options || {};
		L.Util.extend(this.options, options);
		
		if (this.fireEvent) {
			this.fireEvent('optionschange');
		}
	}
};