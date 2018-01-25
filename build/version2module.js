/**
 * This script imports the library package.json file, extracts the version string,
 * appends the branch and git revision (if not doing a release build) and creates
 * a "version.js" ES module in "src/" folder.
 * No need to commit that "version.js" file since it is automatically built,
 * but need to publish it on npm so that build engine can consume it (hence its
 * location in "src/" folder).
 */
var path = require('path');
var os = require('os');
var fs = require('fs');
var gitRev = require('git-rev-sync');


var packagePath = path.resolve(__dirname, '..', 'package.json');
let version = require(packagePath).version;
let release;

// Skip the git branch+rev in the banner when doing a release build
if (process.env.NODE_ENV === 'release') {
	release = true;
} else {
	release = false;
	const branch = gitRev.branch();
	const rev = gitRev.short();
	version += '+' + branch + '.' + rev;
}

console.log('version2module: ' + version);

// Adapted from json2module
var exports = [
		'export default "' + version + '";',
		''
];
var content = exports.join(os.EOL);
var filePath = path.resolve(__dirname, '..', 'src', 'version.js');

// https://nodejs.org/api/fs.html#fs_fs_writefilesync_file_data_options
fs.writeFileSync(filePath, content, 'utf8');
