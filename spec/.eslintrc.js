/** @type {import('eslint').Linter.Config } */
module.exports = {
	rules: {
		'no-console': 'off'
	},
	env: {
		mocha: true,
	},
	globals: {
		L: true,
		expect: false,
		sinon: false,
		UIEventSimulator: false,
		Hand: false,
		touchEventType: false, /* defined in SpecHelper.js */
		createContainer: false, /* defined in SpecHelper.js */
		removeMapContainer: false /* defined in SpecHelper.js */
	}
};
