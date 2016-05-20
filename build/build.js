var fs = require('fs'),
    UglifyJS = require('uglify-js'),
    cssnano = require('cssnano'),
    zlib = require('zlib'),
    SourceNode = require( 'source-map' ).SourceNode;

    deps = require('./deps.js').deps;

function getFiles(compsBase32) {
	var memo = {},
	    comps;

	if (compsBase32) {
		comps = parseInt(compsBase32, 32).toString(2).split('');
		console.log('Managing dependencies...');
	}

	function addFiles(srcs) {
		for (var j = 0, len = srcs.length; j < len; j++) {
			memo[srcs[j]] = true;
		}
	}

	for (var i in deps) {
		if (comps) {
			if (parseInt(comps.pop(), 2) === 1) {
				console.log(' * ' + i);
				addFiles(deps[i].src);
			} else {
				console.log('   ' + i);
			}
		} else {
			addFiles(deps[i].src);
		}
	}

	console.log('');

	var files = [];

	for (var src in memo) {
		files.push('src/' + src);
	}

	return files;
}

exports.getFiles = getFiles;

function getSizeDelta(newContent, oldContent, fixCRLF) {
	if (!oldContent) {
		return ' (new)';
	}
	if (newContent === oldContent) {
		return ' (unchanged)';
	}
	if (fixCRLF) {
		newContent = newContent.replace(/\r\n?/g, '\n');
		oldContent = oldContent.replace(/\r\n?/g, '\n');
	}
	var delta = newContent.length - oldContent.length;
	return delta === 0 ? '' : ' (' + (delta > 0 ? '+' : '') + delta + ' bytes)';
}

function loadSilently(path) {
	try {
		return fs.readFileSync(path, 'utf8');
	} catch (e) {
		return '';
	}
}

// Concatenate the files while building up a sourcemap for the concatenation,
// and replace the line defining L.version with the string prepared in the jakefile
function bundleFiles(files, copy, version) {
	var js  = new SourceNode(null, null, null, '');
	var css = new SourceNode(null, null, null, '');

	js.add(new SourceNode(null, null, null, copy + '(function (window, document, undefined) {'));

	for (var i = 0, len = files.length; i < len; i++) {
		var contents = fs.readFileSync(files[i], 'utf8');

		if (files[i] === 'src/Leaflet.js') {
			contents = contents.replace(
				new RegExp('version: \'.*\''),
				'version: ' + JSON.stringify(version)
			);
		}

		var lines = contents.split('\n');
		var lineCount = lines.length;
		var fileNode = new SourceNode(null, null, null, '');

		fileNode.setSourceContent(files[i], contents);

		for (var j=0; j<lineCount; j++) {
			fileNode.add(new SourceNode(j+1, 0, files[i], lines[j] + '\n'));
		}

		if (files[i].substr(-3) === '.js') {
			js.add(fileNode);
			js.add(new SourceNode(null, null, null, '\n\n'));
		}
		if (files[i].substr(-4) === '.css') {
			css.add(fileNode);
			css.add(new SourceNode(null, null, null, '\n\n'));
		}
	}

	js.add(new SourceNode(null, null, null, '}(window, document));'));

	var jsbundle = js.toStringWithSourceMap();
	var cssbundle = css.toStringWithSourceMap();
	return {
		src: jsbundle.code,
		srcmap: jsbundle.map.toString(),
		css: cssbundle.code,
		cssmap: cssbundle.map.toString()
	};
}

function bytesToKB(bytes) {
    return (bytes / 1024).toFixed(2) + ' KB';
};

exports.build = function (callback, version, compsBase32, buildName) {

	var files = getFiles(compsBase32);

	console.log('Bundling and compressing ' + files.length + ' files...');

	var copy = fs.readFileSync('src/copyright.js', 'utf8').replace('{VERSION}', version),

	    filenamePart = 'leaflet' + (buildName ? '-' + buildName : ''),
	    pathPart = 'dist/' + filenamePart,
	    srcPath = pathPart + '-src.js',
	    mapPath = pathPart + '-src.js.map',
	    cssPath = pathPart + '-src.css',
	    cssmapPath = pathPart + '-src.css.map',
	    srcFilename = filenamePart + '-src.js',
	    mapFilename = filenamePart + '-src.js.map',
	    cssFilename = filenamePart + '-src.css',
	    cssmapFilename = filenamePart + '-src.css.map',

	    bundle = bundleFiles(files, copy, version),
	    newSrc = bundle.src + '\n//# sourceMappingURL=' + mapFilename,
	    newCss = bundle.css + '\n/*# sourceMappingURL=' + cssmapFilename + ' */',

	    oldSrc = loadSilently(srcPath),
	    oldCss = loadSilently(cssPath),
	    srcDelta = getSizeDelta(newSrc, oldSrc, true);

	console.log('\tUncompressed JS: ' + bytesToKB(newSrc.length) + srcDelta);
	console.log('\tUncompressed CSS: ' + bytesToKB(newCss.length) + srcDelta);

	if (newSrc !== oldSrc) {
		fs.writeFileSync(srcPath, newSrc);
		fs.writeFileSync(mapPath, bundle.srcmap);
		console.log('\tSaved JS to ' + srcPath);
	}
	if (newCss !== oldCss) {
		fs.writeFileSync(cssPath, newCss);
		fs.writeFileSync(cssmapPath, bundle.cssmap);
		console.log('\tSaved CSS to ' + cssPath);
	}

	var path = pathPart + '.js',
	    cssPath = pathPart + '.css',
	    oldCompressed = loadSilently(path),
	    oldCssCompressed = loadSilently(cssPath),
	    newCompressed;

	try {
		newCompressed = copy + UglifyJS.minify(newSrc, {
			warnings: true,
			fromString: true
		}).code;
	} catch(err) {
		console.error('UglifyJS failed to minify the files');
		console.error(err);
		callback(err);
	}

	var delta = getSizeDelta(newCompressed, oldCompressed);
	var minifiedCss;

	console.log('\tMinified JS: ' + bytesToKB(newCompressed.length) + delta);

	cssnano.process(newCss, {
		autoprefixer: false,
		zindex: false,
		core: true
	})
	.catch(function(err) {
		console.error('cssnano failed to minify the files');
		console.error(err);
		callback(err);
	})
	.then(function(cssnanoed){
		minifiedCss = cssnanoed.css;
		var delta = getSizeDelta(minifiedCss, oldCssCompressed);
		console.log('\tMinified CSS: ' + bytesToKB(oldCssCompressed.length) + delta);

		zip();
	});

	var newGzipped,
	    gzippedDelta = '';

	function zip() {
		zlib.gzip(newCompressed, function (err, gzipped) {
			if (err) { return; }
			newGzipped = gzipped;
			if (oldCompressed && (oldCompressed !== newCompressed)) {
				zlib.gzip(oldCompressed, function (err, oldGzipped) {
					if (err) { return; }
					gzippedDelta = getSizeDelta(gzipped, oldGzipped);
					done();
				});
			} else {
				done();
			}
		});
	};

	function done() {
		if (newCompressed !== oldCompressed) {
			fs.writeFileSync(path, newCompressed);
			console.log('\t.min.js saved to ' + path);
		}
		if (minifiedCss !== oldCssCompressed) {
			fs.writeFileSync(cssPath, minifiedCss);
			console.log('\t.min.css saved to ' + cssPath);
		}
		console.log('\tGzipped: ' + bytesToKB(newGzipped.length) + gzippedDelta);
		callback();
	}
};

exports.test = function(complete, fail) {
	var karma = require('karma'),
	    testConfig = {configFile : __dirname + '/../spec/karma.conf.js'};

	testConfig.browsers = ['PhantomJS'];

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
};
