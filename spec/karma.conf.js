var json = require('rollup-plugin-json');

const outro = `var oldL = window.L;
exports.noConflict = function() {
	window.L = oldL;
	return this;
}

// Always export us to window global (see #2364)
window.L = exports;`;

// Karma configuration
module.exports = function (config) {

// 	var libSources = require(__dirname + '/../build/build.js').getFiles();

	var files = [
		"src/Leaflet.js",
		"spec/after.js",
		"node_modules/happen/happen.js",
		"node_modules/prosthetic-hand/dist/prosthetic-hand.js",
		"spec/suites/SpecHelper.js",
		"spec/suites/**/*.js",
		"dist/*.css",
		{pattern: "dist/images/*.png", included: false, serve: true}
	];

	var preprocessors = {};

	if (config.cov) {
		preprocessors['src/**/*.js'] = ['coverage'];
	}

	preprocessors['src/Leaflet.js'] = ['rollup'];

	config.set({
		// base path, that will be used to resolve files and exclude
		basePath: '../',

		plugins: [
			'karma-rollup-preprocessor',
			'karma-mocha',
			'karma-sinon',
			'karma-expect',
			'karma-coverage',
			'karma-phantomjs-launcher',
			'karma-chrome-launcher',
			'karma-safari-launcher',
			'karma-firefox-launcher'],

		// frameworks to use
		frameworks: ['mocha', 'sinon', 'expect'],

		// list of files / patterns to load in the browser
		files: files,
		proxies: {
			'/base/dist/images/': 'dist/images/'
		},
		exclude: [],

		// Rollup the ES6 Leaflet sources into just one file, before tests
		preprocessors: preprocessors,
		rollupPreprocessor: {
			plugins: [
				json()
			],
			format: 'umd',
			name: 'L',
			outro: outro
		},

		// test results reporter to use
		// possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
		reporters: config.cov ? ['dots', 'coverage'] : ['dots'],

		coverageReporter: config.cov ? {type : 'html', dir : 'coverage/'} : null,

		// web server port
		port: 9876,

		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_WARN,

		// enable / disable colors in the output (reporters and logs)
		colors: true,

		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: false,

		// Start these browsers, currently available:
		// - Chrome
		// - ChromeCanary
		// - Firefox
		// - Opera
		// - Safari (only Mac)
		// - PhantomJS
		// - IE (only Windows)
		browsers: getBrowsers(),

		customLaunchers: {
			'PhantomJSCustom': {
				base: 'PhantomJS',
				flags: ['--load-images=true'],
				options: {
					onCallback: function (data) {
						if (data.render) {
							page.render(data.render);
						}
					}
				}
			}
		},

		// If browser does not capture in given timeout [ms], kill it
		captureTimeout: 5000,

		// Workaround for PhantomJS random DISCONNECTED error
		browserDisconnectTimeout: 10000, // default 2000
		browserDisconnectTolerance: 1, // default 0

		// Continuous Integration mode
		// if true, it capture browsers, run tests and exit
		singleRun: true
	});
};


// Use browser(s) as specified in command arguments.
function getBrowsers() {
	var browsers = [];

	// Test in each specified browser, if multiple.
	// Note: use twice the special argument `--` after `npm test` so that arguments are passed to the downstream `test-nolint` script.
	// e.g. `npm test -- -- --ff`
	// or directly: `npm run test-nolint -- --ff`
	// Currently available:
	// - Chrome
	// - ChromeCanary
	// - Firefox
	// - Opera
	// - Safari (only Mac)
	// - PhantomJS
	// - IE (only Windows)
	if (isArgv('--chrome')) {
		browsers.push('Chrome');
	}
	if (isArgv('--safari')) {
		browsers.push('Safari');
	}
	if (isArgv('--ff')) {
		browsers.push('Firefox');
	}
	if (isArgv('--ie')) {
		browsers.push('IE');
	}

	// If none is specified, use PhantomJS by default.
	// But do not add it if at least another browser is specified, so that we can launch browsers individually.
	if (!browsers.length) {
		browsers.push('PhantomJSCustom');
	}

	return browsers;
}

function isArgv(optName) {
	return process.argv.indexOf(optName) !== -1;
}
