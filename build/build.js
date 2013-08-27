var fs = require('fs'),
    jshint = require('jshint'),
    UglifyJS = require('uglify-js'),

    deps = require('./deps.js').deps,
    hintrc = require('./hintrc.js').config;

function lintFiles(files) {

	var errorsFound = 0,
	    i, j, len, len2, src, errors, e;

	for (i = 0, len = files.length; i < len; i++) {

		jshint.JSHINT(fs.readFileSync(files[i], 'utf8'), hintrc, i ? {L: true} : null);
		errors = jshint.JSHINT.errors;

		for (j = 0, len2 = errors.length; j < len2; j++) {
			e = errors[j];
			console.log(files[i] + '\tline ' + e.line + '\tcol ' + e.character + '\t ' + e.reason);
		}

		errorsFound += len2;
	}

	return errorsFound;
}

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
				console.log('\t* ' + i);
				addFiles(deps[i].src);
			} else {
				console.log('\t  ' + i);
			}
		} else {
			addFiles(deps[i].src);
		}
	}

	var files = [];

	for (var src in memo) {
		files.push('src/' + src);
	}

	return files;
}

exports.getFiles = getFiles;

exports.lint = function () {

	var files = getFiles();

	console.log('Checking for JS errors...');

	var errorsFound = lintFiles(files);

	if (errorsFound > 0) {
		console.log(errorsFound + ' error(s) found.\n');
		fail();
	} else {
		console.log('\tCheck passed');
	}
};


function getSizeDelta(newContent, oldContent) {
	if (!oldContent) {
		return 'new';
	}
	var newLen = newContent.replace(/\r\n?/g, '\n').length,
		oldLen = oldContent.replace(/\r\n?/g, '\n').length,
		delta = newLen - oldLen;

	return (delta >= 0 ? '+' : '') + delta;
}

function loadSilently(path) {
	try {
		return fs.readFileSync(path, 'utf8');
	} catch (e) {
		return null;
	}
}

function combineFiles(files) {
	var content = '';
	for (var i = 0, len = files.length; i < len; i++) {
		content += fs.readFileSync(files[i], 'utf8') + '\n\n';
	}
	return content;
}

exports.build = function (compsBase32, buildName) {

	var files = getFiles(compsBase32);

	console.log('Concatenating ' + files.length + ' files...');

	var copy = fs.readFileSync('src/copyright.js', 'utf8'),
	    intro = '(function (window, document, undefined) {',
	    outro = '}(window, document));',
	    newSrc = copy + intro + combineFiles(files) + outro,

	    pathPart = 'dist/leaflet' + (buildName ? '-' + buildName : ''),
	    srcPath = pathPart + '-src.js',

	    oldSrc = loadSilently(srcPath),
	    srcDelta = getSizeDelta(newSrc, oldSrc);

	console.log('\tUncompressed size: ' + newSrc.length + ' bytes (' + srcDelta + ')');

	if (newSrc === oldSrc) {
		console.log('\tNo changes');
	} else {
		fs.writeFileSync(srcPath, newSrc);
		console.log('\tSaved to ' + srcPath);
	}

	console.log('Compressing...');

	var path = pathPart + '.js',
	    oldCompressed = loadSilently(path),
	    newCompressed = copy + UglifyJS.minify(newSrc, {
	        warnings: true,
	        fromString: true
	    }).code,
	    delta = getSizeDelta(newCompressed, oldCompressed);

	console.log('\tCompressed size: ' + newCompressed.length + ' bytes (' + delta + ')');

	if (newCompressed === oldCompressed) {
		console.log('\tNo changes');
	} else {
		fs.writeFileSync(path, newCompressed);
		console.log('\tSaved to ' + path);
	}
};

exports.test = function() {
	var karma = require('karma'),
	    testConfig = {configFile : __dirname + '/../spec/karma.conf.js'};

	testConfig.browsers = ['PhantomJS'];

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
			'../src/**/*.js': 'coverage'
		};
		testConfig.coverageReporter = {
			type : 'html',
			dir : 'coverage/'
		};
		testConfig.reporters = ['coverage'];
	}

	karma.server.start(testConfig);

	function isArgv(optName) {
		return process.argv.indexOf(optName) !== -1;
	}
};
