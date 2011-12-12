var build = require('./build/build.js'),
	lint = require('./build/hint.js');

var crlf = '\r\n',
	COPYRIGHT = '/*' + crlf + ' Copyright (c) 2010-2011, CloudMade, Vladimir Agafonkin' + crlf +
                ' Leaflet is a modern open-source JavaScript library for interactive maps.' + crlf +
                ' http://leaflet.cloudmade.com' + crlf + '*/' + crlf;

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
	var name = buildName || 'custom',
		path = 'dist/leaflet' + (compsBase32 ? '-' + name : '');

	var files = build.getFiles(compsBase32);

	console.log('Concatenating ' + files.length + ' files...');
	var content = build.combineFiles(files);
	console.log('\tUncompressed size: ' + content.length);
	
	build.save(path + '-src.js', COPYRIGHT + content);
	console.log('\tSaved to ' + path);
	
	console.log('Compressing...');
	var compressed = COPYRIGHT + build.uglify(content);
	console.log('\tCompressed size: ' + compressed.length);

	build.save(path + '.js', compressed);
	console.log('\tSaved to ' + path);
});

task('default', ['build']);