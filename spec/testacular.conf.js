// Testacular configuration

var libSources = require(__dirname+'/../build/build.js').getFiles();

// base path, that will be used to resolve files and exclude
basePath = '';

for (var i=0; i < libSources.length; i++) {
	libSources[i] = "../" + libSources[i];
}

// list of files / patterns to load in the browser
files = [].concat([
		JASMINE,
		JASMINE_ADAPTER,
		"before.js"
	], libSources, [
		"after.js",
		"happen.js",
		"suites/SpecHelper.js",
		"suites/LeafletSpec.js",
		"suites/control/Control.LayersSpec.js",
		"suites/control/Control.ScaleSpec.js",
		"suites/core/UtilSpec.js",
		"suites/core/ClassSpec.js",
		"suites/core/EventsSpec.js",
		"suites/geometry/PointSpec.js",
		"suites/geometry/BoundsSpec.js",
		"suites/geometry/TransformationSpec.js",
		"suites/geo/LatLngSpec.js",
		"suites/geo/LatLngBoundsSpec.js",
		"suites/geo/ProjectionSpec.js",
		"suites/dom/DomEventSpec.js",
		"suites/dom/DomUtilSpec.js",
		"suites/layer/TileLayerSpec.js",
		"suites/layer/vector/CircleSpec.js",
		"suites/layer/vector/CircleMarkerSpec.js",
		"suites/layer/vector/PolylineGeometrySpec.js",
		"suites/map/MapSpec.js"
	]);

// list of files to exclude
exclude = [  
];

// test results reporter to use
// possible values: 'dots', 'progress', 'junit'
reporters = ['dots'];

// web server port
port = 8080;

// cli runner port
runnerPort = 9100;

// enable / disable colors in the output (reporters and logs)
colors = true;

// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
logLevel = LOG_INFO;

// enable / disable watching file and executing tests whenever any file changes
autoWatch = false;

// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari (only Mac)
// - PhantomJS
// - IE (only Windows)
browsers = ['PhantomJS'];

// If browser does not capture in given timeout [ms], kill it
captureTimeout = 5000;

// Continuous Integration mode
// if true, it capture browsers, run tests and exit
singleRun = true;
