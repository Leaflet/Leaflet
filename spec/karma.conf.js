// See: https://karma-runner.github.io/latest/config/configuration-file.html
module.exports = function (/** @type {import('karma').Config} */ config) {
	config.set({
		basePath: '../',
		plugins: [
			'karma-mocha',
			'karma-sinon',
			'karma-expect',
			'karma-chrome-launcher',
			'karma-safarinative-launcher',
			'karma-firefox-launcher',
			'karma-time-stats-reporter'
		],
		frameworks: ['mocha', 'sinon', 'expect'],
		files: [
			'spec/before.js',
			{pattern: 'dist/leaflet-src.js'},
			'spec/after.js',
			'node_modules/ui-event-simulator/ui-event-simulator.js',
			'node_modules/prosthetic-hand/dist/prosthetic-hand.js',
			'spec/suites/SpecHelper.js',
			'spec/suites/**/*.js',
			'dist/*.css',
			{pattern: 'dist/images/*.png', included: false, served: true}
		],
		proxies: {
			'/base/dist/images/': 'dist/images/'
		},
		reporters: ['progress', 'time-stats'],
		timeStatsReporter: {
			reportTimeStats: false,
			longestTestsCount: 10
		},
		logLevel: config.LOG_WARN,
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
			'FirefoxRetina': {
				base: 'FirefoxHeadless',
				prefs: {
					'layout.css.devPixelsPerPx': 2
				}
			}
		},
		concurrency: 1,
		browserConsoleLogOptions: {level: 'error'},
		client: {
			mocha: {
				// eslint-disable-next-line no-undef
				forbidOnly: process.env.CI || false
			}
		}
	});
};
