var deps = require('./build/deps.js').deps,
	fs = require('fs'),
	uglify = require('uglify-js'),
	jshint = require('jshint');

var copyright = "/*\n Copyright (c) 2010-2011, CloudMade, Vladimir Agafonkin\n" + 
                " Leaflet is a modern open source JavaScript library for interactive maps.\n" +
                " http://leaflet.cloudmade.com\n*/\n";
	
var savePath = 'dist/leaflet.js';

function getFiles() {
	var memo = {},
		files = [];
		
	var i, j, src, srcs, len;
	
	for (i in deps) {
		srcs = deps[i].src;
		for (j = 0, len = srcs.length; j < len; j++) {
			memo[srcs[j]] = true;
		}
	}
	
	for (src in memo) {
		files.push('src/' + src);
	}
	
	return files;
}

var files = getFiles();

function myUglify(code){
	var jsp = uglify.parser,
		pro = uglify.uglify;

	var ast = jsp.parse(code);
	ast = pro.ast_mangle(ast);
	ast = pro.ast_squeeze(ast, {keep_comps: false});
	ast = pro.ast_squeeze_more(ast);
	
	return pro.gen_code(ast);
};

function compress(content) {
	console.log('Uncompressed size: ' + content.length);
	console.log('Compressing...');
	
	var compressed = copyright + myUglify(content);
	
	console.log('Compressed size: ' + compressed.length);
	
	return compressed;
}

function combineFiles(files, callback) {
	var remaining = files.length,
		fileContents = new Array(remaining);
		
	console.log('Concatenating ' + remaining + ' files...');
	
	var i, len;
	
	for (i = 0, len = files.length; i < len; i++) {
		(function (i) {
			fs.readFile(files[i], 'utf8', function (err, contents) {
				if (err) { throw err; }
				fileContents[i] = contents;
				remaining--;
				if (remaining === 0) {
					callback(fileContents.join('\n\n'));
				}
			});
		}(i));
	}
}

task('default', function () {
	combineFiles(files, function (content) {
		var compressed = compress(content);
		
		fs.writeFile(savePath, compressed, 'utf8', function (err) {
			if (err) { throw err; }
			console.log('Saved to ' + savePath);
		});
	});
});

task('build', ['default']);