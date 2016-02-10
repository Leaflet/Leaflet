var fs = require('fs'),
    UglifyJS = require('uglify-js'),
    zlib = require('zlib'),
    MagicString = require('magic-string'),

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
		return null;
	}
}

function bundleFiles(files, copy) {
	var bundle = new MagicString.Bundle();

	for (var i = 0, len = files.length; i < len; i++) {
		bundle.addSource({
			filename: files[i],
			content: new MagicString( fs.readFileSync(files[i], 'utf8') + '\n\n' )
		});
	}

	bundle.prepend(
		copy + '(function (window, document, undefined) {'
	).append('}(window, document));');

	return bundle;
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
	    mapPath = pathPart + '-src.map',
	    srcFilename = filenamePart + '-src.js',
	    mapFilename = filenamePart + '-src.map',

	    bundle = bundleFiles(files, copy),
	    newSrc = bundle.toString() + '\n//# sourceMappingURL=' + mapFilename,

	    oldSrc = loadSilently(srcPath),
	    srcDelta = getSizeDelta(newSrc, oldSrc, true);

	console.log('\tUncompressed: ' + bytesToKB(newSrc.length) + srcDelta);

	if (newSrc !== oldSrc) {
		fs.writeFileSync(srcPath, newSrc);
		fs.writeFileSync(mapPath, bundle.generateMap({
			file: srcFilename,
			includeContent: true,
			hires: false
		}));
		console.log('\tSaved to ' + srcPath);
	}

	var path = pathPart + '.js',
	    oldCompressed = loadSilently(path),
	    newCompressed = copy + UglifyJS.minify(newSrc, {
	        warnings: true,
	        fromString: true
	    }).code,
	    delta = getSizeDelta(newCompressed, oldCompressed);

	console.log('\tCompressed: ' + bytesToKB(newCompressed.length) + delta);

	var newGzipped,
	    gzippedDelta = '';

	function done() {
		if (newCompressed !== oldCompressed) {
			fs.writeFileSync(path, newCompressed);
			console.log('\tSaved to ' + path);
		}
		console.log('\tGzipped: ' + bytesToKB(newGzipped.length) + gzippedDelta);
		callback();
	}

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

exports.test = function(complete, fail) {
	var karma = require('karma'),
	    testConfig = {configFile : __dirname + '/../spec/karma.conf.js'},
	    autoSlimer = false;

	testConfig.browsers = ['PhantomJS'];

	try {
		var child = require('child_process').execFileSync(
			require('slimerjs').path
		);
		console.log('Running tests with both PhantomJS and SlimerJS');
		testConfig.browsers.push('SlimerJS');
		autoSlimer = true;
	} catch(e) {
		console.log('Cannot start SlimerJS, will run tests only in PhantomJS');
	}

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

		// Work around https://github.com/karma-runner/karma-slimerjs-launcher/issues/1
		if (autoSlimer && require('os').platform() !== 'win32' ) {	// Kill process only in linux/osx, as win32 seems to work fine
			var slimerjsPids = require('child_process').execSync('ps -Af | grep slimerjs | grep xulrunner | awk \'{print $2}\'').toString();
			slimerjsPids = slimerjsPids.trim().split('\n');
			for (var i=0; i<slimerjsPids.length; i++) {
				try {
					var pid = Number(slimerjsPids[i]);
					require('child_process').execSync('ps -A | grep ' + pid + ' && kill ' + pid);
				} catch(e) {}
			}
		}

		if (!exitCode) {
			console.log('\tTests ran successfully.\n');
			complete();
		} else {
			process.exit(exitCode);
		}
	});
	server.start();
};
