/*
 * L.Transition native implementation that powers Leaflet animation 
 * in browsers that support CSS3 Transitions
 */

L.Transition = L.Transition.extend({
	statics: (function() {
		var style = document.documentElement.style,
			names = ['transition', 'webkitTransition', 'OTransition', 'MozTransition'],
			transition = '',
			transitionEnd = 'transitionend';
			
		for (var i = 0; i < names.length; i++) {
			if (names[i] in style) {
				transition = names[i];
				break;
			}
		}
		
		if (transition == 'webkitTransition' || transition == 'OTransition') {
			transitionEnd = transition + 'End';
		}
		
		return {
			NATIVE: !!transition,
			
			TRANSITION: transition,
			PROPERTY: transition + 'Property',
			DURATION: transition + 'Duration',
			EASING: transition + 'TimingFunction',
			END: transitionEnd,
			
			// transition-property value to use with each particular custom property
			CUSTOM_PROPS_PROPERTIES: {
				position: L.Browser.webkit ? '-webkit-transform' : 'top, left'
				//TODO enable native position animation for other transition-capable browsers?
			}
		};
	})(),
	
	options: {
		fakeStepInterval: 100
	},
	
	initialize: function(/*HTMLElement*/ el, /*Object*/ options) {
		this._el = el;
		L.Util.extend(this.options, options);

		L.DomEvent.addListener(el, L.Transition.END, this._onTransitionEnd, this);
		this._onFakeStep = L.Util.bind(this._onFakeStep, this);
	},
	
	run: function(/*Object*/ props) {
		var prop,
			propsList = [],
			customProp = L.Transition.CUSTOM_PROPS_PROPERTIES;
		
		for (prop in props) {
			if (props.hasOwnProperty(prop)) {
				prop = customProp[prop] ? customProp[prop] : prop;
				propsList.push(prop);
			}
		}
		
		this._el.style[L.Transition.DURATION] = this.options.duration + 's';
		this._el.style[L.Transition.EASING] = this.options.easing;
		this._el.style[L.Transition.PROPERTY] = propsList.join(', ');
		
		for (prop in props) {
			if (props.hasOwnProperty(prop)) {
				this._setProperty(prop, props[prop]);
			}
		}
		
		this._inProgress = true;
		
		this.fire('start');
		this._timer = setInterval(this._onFakeStep, this.options.fakeStepInterval);
	},
	
	_onFakeStep: function() {
		this.fire('step');
	},
	
	_onTransitionEnd: function() {
		if (this._inProgress) {
			this._inProgress = false;
			clearInterval(this._timer);
			
			this._el.style[L.Transition.PROPERTY] = 'none';
		
			this.fire('step');
			this.fire('end');
		}
	}
});