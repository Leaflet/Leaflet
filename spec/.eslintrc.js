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
	}
};
