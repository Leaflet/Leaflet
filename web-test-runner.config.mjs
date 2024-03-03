import {importMapsPlugin} from '@web/dev-server-import-maps';
import {webdriverLauncher} from '@web/test-runner-webdriver';
import os from 'node:os';

/** @type {import('@web/test-runner').BrowserLauncher[] | undefined} */
const browsers = [
	webdriverLauncher({
		capabilities: {
			browserName: 'chrome',
			'goog:chromeOptions': {
				args: ['--no-sandbox', '--headless'],
			},
		},
	}),
	webdriverLauncher({
		capabilities: {
			browserName: 'firefox',
			'moz:firefoxOptions': {
				args: ['-headless'],
			},
		},
	})
];

const isMacOs = os.platform() === 'darwin';

if (isMacOs) {
	browsers.push(
		webdriverLauncher({
			capabilities: {
				browserName: 'safari',
			},
		})
	);
}

/** @type {import('@web/test-runner').TestRunnerConfig} */
export default {
	browsers,
	browserStartTimeout: 120000,
	testRunnerHtml: testFramework => `
		<!doctype html>
		<html lang="en">
			<head>
				<title>Leaflet Tests</title>
				<meta charset="utf-8">
				<link rel="stylesheet" href="/dist/leaflet.css">
			</head>
			<body>
				<script type="module" src="/spec/setup.js"></script>
				<script type="module" src="${testFramework}"></script>
			</body>
		</html>
	`,
	plugins: [
		importMapsPlugin({
			inject: {
				importMap: {
					imports: {
						'chai': '/node_modules/chai/chai.js',
						'leaflet': '/src/Leaflet.js',
						'prosthetic-hand': '/node_modules/prosthetic-hand/lib/Hand.js',
						'sinon': '/node_modules/sinon/pkg/sinon-esm.js',
						'ui-event-simulator': '/node_modules/ui-event-simulator/ui-event-simulator.js'
					},
				},
			},
		}),
	],
};
