// See: https://karma-runner.github.io/latest/config/configuration-file.html
module.exports = function (/** @type {import('karma').Config} */ config) {
	const isCoverageEnabled = process.argv.includes('--coverage');
	const runAsTouchBrowser = process.argv.includes('--touch-browser');

	const karmaConfig = {
		basePath: '../',
		plugins: [
			'karma-mocha',
			'karma-chrome-launcher',
			'karma-safarinative-launcher',
			'karma-firefox-launcher',
			'karma-time-stats-reporter',
		],
		frameworks: ['mocha'],
		customContextFile: 'spec/context.html',
		customDebugFile: 'spec/debug.html',
		files: [
			{pattern: 'node_modules/chai/**/*', included: false, served: true},
			{
				pattern: 'node_modules/prosthetic-hand/**/*',
				included: false,
				served: true,
			},
			{pattern: 'node_modules/sinon/**/*', included: false, served: true},
			{
				pattern: 'node_modules/ui-event-simulator/**/*',
				included: false,
				served: true,
			},
			{pattern: 'dist/leaflet-src.js', included: false, served: true},
			{pattern: 'src/**/*.js', included: false, served: true},
			{pattern: 'package.json', included: false, served: true},
			{pattern: 'dist/**/*.svg', included: false, served: true},
			{pattern: 'spec/setup.js', type: 'module'},
			{pattern: 'spec/suites/**/*.js', type: 'module'},
			{pattern: 'dist/*.css', type: 'css'},
		],
		reporters: ['progress', 'time-stats'],
		coverageReporter: {
			dir: 'coverage/',
			reporters: [{type: 'html', subdir: 'html'}, {type: 'text-summary'}],
		},
		timeStatsReporter: {
			reportTimeStats: false,
			longestTestsCount: 10,
		},
		logLevel: config.LOG_WARN,
		browsers: ['Chrome'],
		customLaunchers: {
			Chrome: {
				base: 'ChromeHeadless',
				flags: [
					'--window-size=1920,1080', // Set a fixed window size
				],
			},
			Firefox: {
				base: 'FirefoxHeadless',
				prefs: {
					'dom.w3c_touch_events.enabled': 1,
				},
			},
			FirefoxRetina: {
				base: 'FirefoxHeadless',
				prefs: {
					'layout.css.devPixelsPerPx': 2,
				},
			},
			// 'SafariNative'
		},
		concurrency: 1,
		browserConsoleLogOptions: {level: 'error'},
		client: {
			mocha: {
				forbidOnly: process.env.CI || false,
			},
			runAsTouchBrowser,
		},
	};

	if (isCoverageEnabled) {
		karmaConfig.plugins.push('karma-coverage');
		karmaConfig.reporters.push('coverage');
		karmaConfig.preprocessors = {
			'dist/leaflet-src.js': 'coverage',
		};
	}

	config.set(karmaConfig);
};
