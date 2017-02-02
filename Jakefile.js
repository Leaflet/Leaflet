/*
Leaflet building, testing and linting scripts.

To use, install Node, then run the following commands in the project root:

    npm install -g jake
    npm install

To check the code for errors and build Leaflet from source, run "jake".
To run the tests, run "jake test". To build the documentation, run "jake docs".

For a custom build, open build/build.html in the browser and follow the instructions.
*/

var buildDocs = require('./build/docs'),
    git = require('git-rev-sync'),
    path = require('path');

function hint(msg, args) {
	return function () {
		console.log(msg);
		jake.exec('node node_modules/eslint/bin/eslint.js ' + args,
				{printStdout: true}, function () {
			console.log('\tCheck passed.\n');
			complete();
		});
	};
}

// Returns the version string in package.json, plus a semver build metadata if
// this is not an official release
function calculateVersion(officialRelease) {

	var version = require('./package.json').version;

	if (officialRelease) {
		return version;
	} else {
		return version + '+' + git.short();
	}
}

desc('Check Leaflet source for errors with ESLint');
task('lint', {async: true}, hint('Checking for JS errors...', 'src'));

desc('Check Leaflet specs source for errors with ESLint');
task('lintspec', {async: true}, hint('Checking for specs JS errors...', 'spec/suites'));

desc('Run PhantomJS tests');
task('test', ['lint', 'lintspec'], {async: true}, function () {

	var karma = require('karma'),
	 testConfig = {configFile : path.join(__dirname, './spec/karma.conf.js')};

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
			 complete();
		 } else {
			 process.exit(exitCode);
		 }
	 });
	 server.start();
});

desc('Build documentation');
task('docs', {}, function() {
	buildDocs();
});

task('default', ['test', 'build']);

jake.addListener('complete', function () {
  process.exit();
});
