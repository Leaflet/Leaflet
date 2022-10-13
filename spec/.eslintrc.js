/** @type {import('eslint').Linter.Config } */
module.exports = {
	rules: {
		'no-console': 'off',
		'quotes': 'off'
	},
	env: {
		mocha: true,
	},
	globals: {
		L: true,
		expect: false,
		sinon: false,
		happen: false,
		Hand: false,
		touchEventType: false, /* defined in SpecHelper.js */
		createContainer: false, /* defined in SpecHelper.js */
		removeMapContainer: false /* defined in SpecHelper.js */
	}
};
