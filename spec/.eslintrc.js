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
	}
};
