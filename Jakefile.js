/*
Leaflet building, testing and linting scripts.

To use, install Node, then run the following commands in the project root:

    npm install -g jake
    npm install

To check the code for errors and build Leaflet from source, run "jake".
To run the tests, run "jake test".

For a custom build, open build/build.html in the browser and follow the instructions.
*/

var build = require('./build/build.js'),
    version = require('./src/Leaflet.js').version;

function hint(msg, paths) {
	return function () {
		console.log(msg);
		jake.exec('node node_modules/jshint/bin/jshint -c ' + paths,
				{printStdout: true}, function () {
			console.log('\tCheck passed.\n');
			complete();
		});
	};
}

desc('Check Leaflet source for errors with JSHint');
task('lint', {async: true}, hint('Checking for JS errors...', 'build/hintrc.js src'));

desc('Check Leaflet specs source for errors with JSHint');
task('lintspec', {async: true}, hint('Checking for specs JS errors...', 'spec/spec.hintrc.js spec/suites'));

desc('Combine and compress Leaflet source files');
task('build', {async: true}, function (compsBase32, buildName) {
	var v;

	jake.exec('git log -1 --pretty=format:"%h"', {breakOnError: false}, function () {
		build.build(complete, v, compsBase32, buildName);

	}).on('stdout', function (data) {
		v = version + ' (' + data.toString() + ')';
	}).on('error', function () {
		v = version;
	});
});

desc('Run PhantomJS tests');
task('test', ['lint', 'lintspec'], {async: true}, function () {
	build.test(complete);
});

task('default', ['test', 'build']);

jake.addListener('complete', function () {
  process.exit();
});
