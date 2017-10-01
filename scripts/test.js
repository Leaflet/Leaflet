#!/usr/bin/env js

var path = require('path'),
		CLIEngine = require('eslint').CLIEngine,
		eslintCli = new CLIEngine(),
		karma = require('karma'),
		testConfig = {configFile : path.join(__dirname, '../spec/karma.conf.js')};

function lint(message, target) {
	console.log(message);
	var report = eslintCli.executeOnFiles(target);

	if (report.errorCount === 0) {
		console.log('\tCheck passed.\n');
	} else {
		var formatter = eslintCli.getFormatter();
		console.log(formatter(report.results));
		process.exit(1);
	}
}

function test() {
	testConfig.browsers = ['PhantomJSCustom'];

	function isArgv(optName) {
		return process.argv.indexOf(optName) !== -1;
	}

	if (isArgv('--chrome')) {
		testConfig.browsers.push('Chrome');
	}
	if (isArgv('--safari')) {
		testConfig.browsers.push('Safari');
	}
	if (isArgv('--ff')) {
		testConfig.browsers.push('Firefox');
	}
	if (isArgv('--ie')) {
		testConfig.browsers.push('IE');
	}

	if (isArgv('--cov')) {
		testConfig.preprocessors = {
			'src/**/*.js': 'coverage'
		};
		testConfig.coverageReporter = {
			type : 'html',
			dir : 'coverage/'
		};
		testConfig.reporters = ['coverage'];
	}

	console.log('Running tests...');

	var server = new karma.Server(testConfig, function(exitCode) {
		if (!exitCode) {
			console.log('\tTests ran successfully.\n');
			process.exit();
		} else {
			process.exit(exitCode);
		}
	});
	server.start();
}

lint('Checking for JS errors...', ['src']);
lint('Checking for specs JS errors...', ['spec/suites']);
test();
