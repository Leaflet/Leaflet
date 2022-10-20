/** @type {import('eslint').Linter.Config } */
module.exports = {
	ignorePatterns: [
		'dist',
		'debug',
		'docs/docs/highlight',
		'docs/examples/choropleth/us-states.js',
		'docs/examples/geojson/sample-geojson.js',
		'docs/examples/map-panes/eu-countries.js',
		'docs/examples/extending/extending-2-layers.md',
		'docs/_posts/201*',
		'docs/_site',
	],
	root: true,
	globals: {
		globalThis: true
	},
	env: {
		commonjs: true,
		node: false
	},
	extends: 'mourner',
	plugins: [
		'@mapbox/eslint-plugin-script-tags'
	],
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module'
	},
	rules: {
		'consistent-return': 'off',
		'curly': 'error',
		'indent': ['error', 'tab', {VariableDeclarator: 0, flatTernaryExpressions: true}],
		'key-spacing': 'off',
		'linebreak-style': ['off', 'unix'],
		'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
		'no-unused-expressions': ['error', {allowShortCircuit: true}],
		'spaced-comment': 'error',
		'strict': 'off',
		'wrap-iife': 'off',
		// TODO: Re-enable the rules below and fix the linting issues.
		'no-invalid-this': 'off',
		'prefer-spread': 'off'
	},
	overrides: [
		{
			files: [
				'build/**/*'
			],
			env: {
				node: true
			},
			rules: {
				'global-require': 'off'
			}
		},
		{
			files: [
				'*.md'
			],
			rules: {
				'eol-last': 'off',
				'no-unused-vars': 'off'
			}
		}
	]
};
