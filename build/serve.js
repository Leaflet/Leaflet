// A static server for local development: `node build/serve.js [dir]`, on port $PORT or the first free one from 8080.
// Never caches, lists directories without an index.html, and serves the root's 404.html for missing files. `--site`
// serves _site/ while rebuilding it on changes (`--preview` passes PREVIEW=1 to the build), in-process rather than
// with shell `&`, since cmd.exe would only start the server after the never-ending watcher exits.

import {createServer} from 'node:http';
import {createReadStream, readdirSync, statSync} from 'node:fs';
import {join, extname, resolve, sep} from 'node:path';
import {spawn} from 'node:child_process';

const args = process.argv.slice(2);
const site = args.includes('--site');
const root = resolve(site ? '_site' : args.find(a => !a.startsWith('--')) ?? '.');

if (site) {
	const env = args.includes('--preview') ? {...process.env, PREVIEW: '1'} : process.env;
	const watchArgs = ['--watch-path=docs', '--watch-path=src', '--watch-path=build', '--watch-preserve-output', 'build/site.js'];
	const watcher = spawn(process.execPath, watchArgs, {stdio: 'inherit', env});
	process.on('exit', () => watcher.kill());
	for (const signal of ['SIGINT', 'SIGTERM']) { process.on(signal, () => process.exit()); }
}

const TYPES = {
	'.html': 'text/html; charset=utf-8',
	'.js': 'text/javascript; charset=utf-8',
	'.mjs': 'text/javascript; charset=utf-8',
	'.css': 'text/css; charset=utf-8',
	'.json': 'application/json; charset=utf-8',
	'.map': 'application/json; charset=utf-8',
	'.xml': 'application/xml; charset=utf-8',
	'.txt': 'text/plain; charset=utf-8',
	'.md': 'text/plain; charset=utf-8',
	'.ts': 'text/plain; charset=utf-8',
	'.svg': 'image/svg+xml',
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.gif': 'image/gif',
	'.mp4': 'video/mp4',
	'.webp': 'image/webp',
	'.ico': 'image/x-icon',
	'.woff2': 'font/woff2',
	'.zip': 'application/zip'
};

const server = createServer((req, res) => {
	const {pathname} = new URL(req.url, 'http://localhost');
	const path = join(root, decodeURIComponent(pathname));
	if (path !== root && !path.startsWith(root + sep)) { return send(res, 403, 'Forbidden'); }

	const stat = statOrNull(path);
	if (stat?.isDirectory()) {
		if (!pathname.endsWith('/')) {
			res.writeHead(301, {Location: `${pathname}/`});
			return res.end();
		}
		const index = join(path, 'index.html');
		return statOrNull(index)?.isFile() ? serveFile(res, 200, index) : send(res, 200, listing(path, pathname), '.html');
	}
	if (stat?.isFile()) { return serveFile(res, 200, path); }

	const notFound = join(root, '404.html');
	return statOrNull(notFound)?.isFile() ? serveFile(res, 404, notFound) : send(res, 404, 'Not found');
});

function serveFile(res, status, path) {
	res.writeHead(status, {'Content-Type': TYPES[extname(path).toLowerCase()] ?? 'application/octet-stream', 'Cache-Control': 'no-store'});
	createReadStream(path).pipe(res);
}

function send(res, status, body, ext = '.txt') {
	res.writeHead(status, {'Content-Type': TYPES[ext], 'Cache-Control': 'no-store'});
	res.end(body);
}

function listing(dir, pathname) {
	const entries = readdirSync(dir, {withFileTypes: true})
		.sort((a, b) => b.isDirectory() - a.isDirectory() || a.name.localeCompare(b.name))
		.map(e => `<li><a href="${encodeURIComponent(e.name)}${e.isDirectory() ? '/' : ''}">${e.name}${e.isDirectory() ? '/' : ''}</a></li>`);
	if (pathname !== '/') { entries.unshift('<li><a href="../">../</a></li>'); }
	return `<!doctype html><meta charset="utf-8"><title>${pathname}</title><h1>${pathname}</h1><ul>${entries.join('')}</ul>`;
}

function statOrNull(path) {
	try { return statSync(path); } catch { return null; }
}

let port = Number(process.env.PORT) || 8080;
server.on('error', (err) => {
	if (err.code !== 'EADDRINUSE' || process.env.PORT) { throw err; }
	server.listen(++port);
});
server.on('listening', () => console.log(`Serving ${root} at http://localhost:${port}`));
server.listen(port);
