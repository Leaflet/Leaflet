(function (Mocha) {
	var bdd = Mocha.interfaces.bdd;

	Mocha.interfaces['leaflet-bdd'] = function (suite) {
		bdd(suite);

		suite.on('pre-require', function (context) {

			// We'll want to skip a couple of things when in PhantomJS, due to lack of CSS animations
			it.skipInPhantom = L.Browser.any3d ? it : it.skip;

			// Viceversa: some tests we want only to run in browsers without CSS animations.
			it.skipInNonPhantom = L.Browser.any3d ? it.skip : it;

			const touch = (typeof window !== 'undefined') && window.TouchEvent;

			// A couple of tests need the browser to be touch-capable
			it.skipIfNotTouch = touch ? it : it.skip;

			// A couple of tests need the browser to be pointer-capable
			it.skipIfNotEdge = L.Browser.pointer ? it : it.skip;

			// Skip if not in a browser
			it.skipInNode = L.Browser.node ? it.skip : it;
		});
	};

// eslint-disable-next-line no-undef
})(typeof Mocha === 'undefined' ? require('mocha') : Mocha);
