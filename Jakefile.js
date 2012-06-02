var build = require('./build/build.js'),
	lint = require('./build/hint.js');

var COPYRIGHT = '/*\n Copyright (c) 2010-2012, CloudMade, Vladimir Agafonkin\n' +
                ' Leaflet is a modern open-source JavaScript library for interactive maps.\n' + 
                ' http://leaflet.cloudmade.com\n*/\n';

desc('Check Leaflet source for errors with JSHint');
task('lint', function () {
	var files = build.getFiles();

	console.log('Checking for JS errors...');

	var errorsFound = lint.jshint(files);

	if (errorsFound > 0) {
		console.log(errorsFound + ' error(s) found.\n');
		fail();
	} else {
		console.log('\tCheck passed');
	}
});

desc('Combine and compress Leaflet source files');
task('build', ['lint'], function (compsBase32, buildName) {
	var pathPart = 'dist/leaflet' + (buildName ? '-' + buildName : ''),
		srcPath = pathPart + '-src.js',
		path = pathPart + '.js';

	var files = build.getFiles(compsBase32);

	console.log('Concatenating ' + files.length + ' files...');
	
	var content = build.combineFiles(files);

	var oldSrc = build.load(srcPath),
		newSrc = COPYRIGHT + content,
		srcDelta = build.getSizeDelta(newSrc, oldSrc);

	console.log('\tUncompressed size: ' + newSrc.length + ' bytes (' + srcDelta + ')');

	if (newSrc === oldSrc) {
		console.log('\tNo changes');
	} else {
		build.save(srcPath, newSrc);
		console.log('\tSaved to ' + srcPath);
	}

	console.log('Compressing...');

	var oldCompressed = build.load(path),
		newCompressed = COPYRIGHT + build.uglify(content),
		delta = build.getSizeDelta(newCompressed, oldCompressed);

	console.log('\tCompressed size: ' + newCompressed.length + ' bytes (' + delta + ')');

	if (newCompressed === oldCompressed) {
		console.log('\tNo changes');
	} else {
		build.save(path, newCompressed);
		console.log('\tSaved to ' + path);
	}
});

task('default', ['build']);
