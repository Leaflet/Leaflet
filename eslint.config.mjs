import config from 'eslint-config-mourner';
import scriptTags from '@mapbox/eslint-plugin-script-tags';
import importPlugin from 'eslint-plugin-import-x';
import globals from 'globals';

export default [
	...config,
	{
		files: ['*.js', '*.mjs', '*.cjs'],
	},
	{
		ignores: [
			'dist',
			'docs/docs/highlight',
			'docs/examples/choropleth/us-states.js',
			'docs/examples/geojson/sample-geojson.js',
			'docs/examples/map-panes/eu-countries.js',
			'docs/examples/extending/extending-2-layers.md',
			'docs/_posts/201*',
			'docs/_site',
			'coverage'
		]
	},
	{
		plugins: {
			import: importPlugin
		},
		rules: {
			'dot-notation': 'off',
			'consistent-return': 'off',
			'curly': 'error',
			'no-unused-expressions': ['error', {allowShortCircuit: true}],
			'no-unused-vars': ['error', {caughtErrors: 'none'}],

			'import/extensions': ['error', 'ignorePackages'],

			'@stylistic/js/indent': ['error', 'tab', {VariableDeclarator: 0, flatTernaryExpressions: true}],
			'@stylistic/js/no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
			'@stylistic/js/key-spacing': 'off',
			'@stylistic/js/linebreak-style': ['off', 'unix'],
			'@stylistic/js/spaced-comment': 'error',

			// TODO: Re-enable the rules below and fix the linting issues.
			'no-invalid-this': 'off',
			'prefer-object-has-own': 'error',
			'prefer-spread': 'off',
			'no-new': 'off'
		}
	},
	{
		files: ['spec/**'],
		languageOptions: {
			globals: {...globals.mocha}
		},
		rules: {
			'no-unused-expressions': 'off'
		}
	},
	{
		files: ['build/**'],
		languageOptions: {
			parserOptions: {
				ecmaVersion: 2022
			}
		}
	},
	{
		files: ['docs/**/*.md'],
		plugins: {
			scriptTags: {
				processors: {md: scriptTags.processors['.md']}
			}
		},
		processor: 'scriptTags/md',
		rules: {
			'no-unused-vars': 'off',
			'@stylistic/js/eol-last': 'off'
		},
		languageOptions: {
			globals: {L: false}
		}
	}
];
