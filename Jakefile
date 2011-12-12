var fs = require('fs'),
	uglify = require('uglify-js'),
	jshint = require('jshint'),
	deps = require('./build/deps.js').deps;

function getFiles() {
	var memo = {},
		i, srcs, j, len;

	for (i in deps) {
		srcs = deps[i].src;
		for (j = 0, len = srcs.length; j < len; j++) {
			memo[srcs[j]] = true;
		}
	}

	var files = [],
		src;

	for (src in memo) {
		files.push('src/' + src);
	}

	return files;
}

function myUglify(code){
	var pro = uglify.uglify;

	var ast = uglify.parser.parse(code);
	ast = pro.ast_mangle(ast);
	ast = pro.ast_squeeze(ast, {keep_comps: false});
	ast = pro.ast_squeeze_more(ast);

	return pro.gen_code(ast);
};

function combineFiles(files) {
	var content = '';
	for (var i = 0, len = files.length; i < len; i++) {
		content += fs.readFileSync(files[i], 'utf8') + '\n\n';
	}
	return content;
}

var COPYRIGHT = "/*\n Copyright (c) 2010-2011, CloudMade, Vladimir Agafonkin\n" +
                " Leaflet is a modern open source JavaScript library for interactive maps.\n" +
                " http://leaflet.cloudmade.com\n*/\n";

var SAVE_PATH = 'dist/leaflet.js';

var files = getFiles();

task('build', function () {
	console.log('Concatenating ' + files.length + ' files...');

	var content = combineFiles(files);
	
	console.log('Uncompressed size: ' + content.length);
	console.log('Compressing...');

	var compressed = COPYRIGHT + myUglify(content);
	fail("Helo world");

	console.log('Compressed size: ' + compressed.length);

	fs.writeFileSync(SAVE_PATH, compressed, 'utf8');

	console.log('Saved to ' + SAVE_PATH);
});

task('default', ['build']);
