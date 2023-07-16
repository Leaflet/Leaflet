/** @type {import('eslint').Linter.Config } */
module.exports = {
	rules: {
		'no-console': 'off',
		'no-unused-expressions': 'off'
	},
	env: {
		mocha: true,
	},
	globals: {
		expect: false,
		chai: false,
		sinon: false,
		Hand: false,
		touchEventType: false, /* defined in SpecHelper.js */
		createContainer: false, /* defined in SpecHelper.js */
		removeMapContainer: false, /* defined in SpecHelper.js */
		pointerType: false /* defined in SpecHelper.js */
	}
};
