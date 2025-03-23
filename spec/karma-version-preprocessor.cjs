// Replace version import from package.json with static version for Firefox which currently not supports Import Attributes.
// TODO: After Firefox supports Import Attributes, remove this preprocessor and update the karma.conf.cjs file.
function replaceVersionPreprocessor(config) {
	return function (content, file, done) {
		if (config.browsers.includes('Firefox')) {
			content = content.replace(
				/import pkg from '\.\.\/package\.json' with \{ type: 'json' \};/,
				'const pkg = {version: "0.0.0"};'
			);
			// we use error to make it visible in the console
			console.error('Version import replaced with static variable', file.originalPath, config.browsers.join(', '));
		}
		done(content);
	};
}

module.exports = replaceVersionPreprocessor;
