// See: https://karma-runner.github.io/latest/config/configuration-file.html
module.exports = function (/** @type {import('karma').Config} */ config) {
	config.set({
		basePath: '../',
		plugins: [
			'karma-mocha',
			'karma-sinon',
			'karma-chai',
			'karma-chrome-launcher',
			'karma-safarinative-launcher',
			'karma-firefox-launcher',
			'karma-time-stats-reporter'
		],
		frameworks: ['mocha', 'sinon', 'chai'],
		customContextFile: 'spec/context.html',
		customDebugFile: 'spec/debug.html',
		files: [
			{pattern: 'node_modules/ui-event-simulator/*', included: false, served: true},
			'node_modules/prosthetic-hand/dist/prosthetic-hand.js',
			{pattern: 'dist/**/*.js', included: false, served: true},
			{pattern: 'dist/**/*.png', included: false, served: true},
			{pattern: 'spec/setup.js', type: 'module'},
			{pattern: 'spec/suites/**/*.js', type: 'module'},
			{pattern: 'dist/*.css', type: 'css'},
		],
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
