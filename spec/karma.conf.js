var json = require('@rollup/plugin-json');

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
		"spec/before.js",
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

	preprocessors['src/Leaflet.js'] = ['rollup'];

	config.set({
		// base path, that will be used to resolve files and exclude
		basePath: '../',

		plugins: [
			'karma-rollup-preprocessor',
			'karma-mocha',
			'karma-sinon',
			'karma-expect',
			'karma-edge-launcher',
			'karma-ie-launcher',
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
			output: {
				format: 'umd',
				name: 'L',
				outro: outro,
				freeze: false,
			},
		},

		// test results reporter to use
		// possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
		// reporters: ['dots'],

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
		// - IE (only Windows)
		browsers: ['Chrome1280x1024'],

		customLaunchers: {
			'Chrome1280x1024': {
				base: 'ChromeHeadless',
				// increased viewport is required for some tests (TODO fix tests)
				// https://github.com/Leaflet/Leaflet/issues/7113#issuecomment-619528577
				flags: ['--window-size=1280,1024']
			},
			'FirefoxTouch': {
				base: 'FirefoxHeadless',
				prefs: {
					'dom.w3c_touch_events.enabled': 1
				}
			},
			'FirefoxNoTouch': {
				base: 'FirefoxHeadless',
				prefs: {
					'dom.w3c_touch_events.enabled': 0
				}
			},
			IE10: {
				base: 'IE',
				'x-ua-compatible': 'IE=EmulateIE10'
			}
		},

		concurrency: 1,

		// If browser does not capture in given timeout [ms], kill it
		captureTimeout: 60000,

		// Timeout for the client socket connection [ms].
		browserSocketTimeout: 30000,

		// Continuous Integration mode
		// if true, it capture browsers, run tests and exit
		singleRun: true,

		client: {
			mocha: {
				// eslint-disable-next-line no-undef
				forbidOnly: process.env.CI || false
			}
		}
	});
};
