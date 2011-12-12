var build = require('./build/build.js');

var COPYRIGHT = "/*\n Copyright (c) 2010-2011, CloudMade, Vladimir Agafonkin\n" +
                " Leaflet is a modern open source JavaScript library for interactive maps.\n" +
                " http://leaflet.cloudmade.com\n*/\n";

task('build', function (compsBase32, buildName) {
	var name = buildName || 'custom',
		savePath = 'dist/leaflet' + (compsBase32 ? '-' + name : '') + '.js';

	var files = build.getFiles(compsBase32);

	console.log('Concatenating ' + files.length + ' files...');

	var content = build.combineFiles(files);

	console.log('Uncompressed size: ' + content.length);
	console.log('Compressing...');

	var compressed = COPYRIGHT + build.uglify(content);

	console.log('Compressed size: ' + compressed.length);

	build.save(savePath, compressed);

	console.log('Saved to ' + savePath);
});

task('default', ['build']);

// TODO task('lint')
