/*
Leaflet building, testing and linting scripts.

To use, install Node, then run the following commands in the project root:

    npm install -g jake
    npm install

To check the code for errors and build Leaflet from source, run "jake".
To run the tests, run "jake test". To build the documentation, run "jake docs".

For a custom build, open build/build.html in the browser and follow the instructions.
*/

var build = require('./build/build.js'),
    buildDocs = require('./build/docs'),
    git = require('git-rev');

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
function calculateVersion(officialRelease, callback) {

	var version = require('./package.json').version;

	if (officialRelease) {
		callback(version);
	} else {
		git.short(function(str) {
			callback (version + '+' + str);
		});
	}
}

desc('Check Leaflet source for errors with ESLint');
task('lint', {async: true}, hint('Checking for JS errors...', 'src'));

desc('Check Leaflet specs source for errors with ESLint');
task('lintspec', {async: true}, hint('Checking for specs JS errors...', 'spec/suites'));

desc('Combine and compress Leaflet source files');
task('build', {async: true}, function (compsBase32, buildName, officialRelease) {
	calculateVersion(officialRelease, function(v){
		build.build(complete, v, compsBase32, buildName);
	});
});

desc('Run PhantomJS tests');
task('test', ['lint', 'lintspec'], {async: true}, function () {
	build.test(complete);
});

desc('Build documentation');
task('docs', {}, function() {
	buildDocs();
});

task('default', ['test', 'build']);

jake.addListener('complete', function () {
  process.exit();
});
