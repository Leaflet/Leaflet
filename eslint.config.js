import {includeIgnoreFile} from '@eslint/compat';
import {fileURLToPath} from 'node:url';
import config from 'eslint-config-mourner';
import css from '@eslint/css';
import html from 'eslint-plugin-html';
import {flatConfigs as importX} from 'eslint-plugin-import-x';
import baselineJs from 'eslint-plugin-baseline-js';
import e18e from '@e18e/eslint-plugin';

export default [
	...config.map(c => ({...c, files: ['**/*.js']})),
	{...e18e.configs.recommended, files: ['**/*.js']},
	{...importX.recommended, files: ['**/*.js']},
	includeIgnoreFile(fileURLToPath(new URL('.gitignore', import.meta.url))),
	{
		ignores: [
			'docs/docs/highlight',
			'docs/examples/choropleth/us-states.js',
			'docs/examples/geojson/sample-geojson.js',
			'docs/examples/map-panes/eu-countries.js',
		]
	},
	{
		files: ['**/*.js'],
		rules: {
			'dot-notation': 'off',
			'consistent-return': 'off',

			'curly': 'error',
			'no-unused-expressions': ['error', {allowShortCircuit: true}],
			'no-unused-vars': ['error', {caughtErrors: 'none'}],

			'import-x/extensions': ['error', 'ignorePackages'],
			'import-x/no-unresolved': ['error', {ignore: ['\\.css$']}],

			'@stylistic/indent': ['error', 'tab', {VariableDeclarator: 0, flatTernaryExpressions: true, SwitchCase: 0}],
			'@stylistic/no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
			'@stylistic/spaced-comment': 'error',

			'prefer-exponentiation-operator': 'error',
			'prefer-object-has-own': 'error',

			// TODO: Re-enable the rules below and fix the linting issues.
			'no-invalid-this': 'off',

			// TODO disable for now but reenable gradually
			'e18e/prefer-array-at': 'off',
			'e18e/prefer-static-regex': 'off',
			'e18e/prefer-includes': 'off',
			'e18e/prefer-date-now': 'off'
		}
	},
	{
		files: ['**/*.css'],
		language: 'css/css',
		...css.configs.recommended,
		rules: {
			...css.configs.recommended.rules,
			'css/no-important': 'warn',
			'css/use-baseline': ['error', {
				allowProperties: ['clip', 'outline', 'print-color-adjust', 'user-select', 'word-break'],
				allowSelectors: ['has', 'nesting']
			}]
		}
	},
	{
		files: ['src/**/*.js'],
		plugins: {'baseline-js': baselineJs},
		rules: {
			'baseline-js/use-baseline': ['error', {
				available: 'widely',
				// According to https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio, the feature is only partially supported in Safari:
				// In Safari on iOS, the devicePixelRatio does not change when the page is zoomed. See bug https://webkit.org/b/124862.
				includeWebApis: {preset: 'auto', ignore: ['devicepixelratio']},
				includeJsBuiltins: {preset: 'auto'},
			}],
		},
	},
	{
		files: ['spec/**'],
		languageOptions: {
			globals: {
				describe: 'readonly',
				it: 'readonly',
				beforeEach: 'readonly',
				afterEach: 'readonly',
				expect: 'readonly',
			}
		},
		rules: {
			'no-unused-expressions': 'off',
			'no-new': 'off',
		}
	},
	{
		files: ['docs/**/*.md'],
		plugins: {html},
		settings: {'html/html-extensions': ['.md']},
		rules: {
			'no-unused-vars': 'off'
		}
	}
];
