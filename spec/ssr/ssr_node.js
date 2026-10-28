import {version} from '../../src/Leaflet.js';
import pkg from '../../package.json' with {type: 'json'};

if (version !== pkg.version) { throw new Error(`src/Leaflet.js has version ${version}, package.json ${pkg.version}`); }
console.log(version);
