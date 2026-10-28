// Builds leafletjs.com into _site/ from docs/ and the pinned refs in build/site.json: `node build/site.js [config]`.
// Covers the part of Jekyll the site uses: front matter, Liquid, Markdown, chained layouts, posts and the plugins
// collection. Mounts map trees (the checkout or a pinned ref) onto output paths.

import {readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync, copyFileSync, rmSync, renameSync, statSync}
	from 'node:fs';
import {execSync} from 'node:child_process';
import {join, dirname} from 'node:path';
import {Liquid} from 'liquidjs';
import {Marked} from 'marked';
import {markedSmartypants} from 'marked-smartypants';
import {parse as parseYaml} from '@mourner/yeahml';

const SITE_DIR = 'docs';
const CACHE_DIR = 'node_modules/.cache/leaflet-site';

const POST_FILE = /^(\d{4})-(\d\d)-(\d\d)-(.+)\.md$/;
const MARKDOWN_EXT = /\.md$/;
const FRONT_MATTER = /^---\r?\n([\s\S]*?\r?\n)?---\r?\n/;
const HTML_TAG = /<[^>]*>/g;
const NON_ID_CHAR = /[^\p{L}\p{N}\p{M}_\- ]/gu;

// GitHub-style header ids, which the site's anchors link to
let headerIds;
const marked = new Marked({
	renderer: {
		heading({tokens, depth, text}) {
			let id = text.toLowerCase().replace(HTML_TAG, '').replace(NON_ID_CHAR, '').replace(/ /g, '-');
			const n = headerIds.get(id) ?? 0;
			headerIds.set(id, n + 1);
			if (n) { id += `-${n}`; }
			return `<h${depth} id="${id}">${this.parser.parseInline(tokens)}</h${depth}>\n`;
		}
	}
}, markedSmartypants());

export function buildSite(config) {
	const dest = config.dest ?? '_site';
	const rootDir = join(treeDir(config.root?.ref, config.refs), SITE_DIR);
	const site = {...config.site, ...config.versions?.[config.version], time: new Date()};

	// pages of a pinned tree look up layouts and includes in that tree first, then in the root one
	const engines = new Map();
	const getEngine = (dir) => {
		if (!engines.has(dir)) { engines.set(dir, createEngine(dir === rootDir ? [rootDir] : [dir, rootDir])); }
		return engines.get(dir);
	};
	const rootEngine = getEngine(rootDir);

	// the plugins collection: rendered, but not written
	site.plugins = [];
	for (const file of walk(join(rootDir, '_plugins'))) {
		const {data, body} = readPage(join(rootDir, '_plugins', file));
		data.content = rootEngine.renderContent(body, true, {site, page: data});
		site.plugins.push(data);
	}

	// posts, newest first; rendered before pages, so that atom.xml can embed them
	const posts = readdirSync(join(rootDir, '_posts')).sort().reverse().map((file) => {
		const [, y, m, d, slug] = file.match(POST_FILE);
		const {data, body} = readPage(join(rootDir, '_posts', file));
		const url = `/${y}/${m}/${d}/${slug}.html`;
		return Object.assign(data, {url, id: url.slice(0, -5), date: new Date(`${y}-${m}-${d}`), body});
	});
	site.posts = posts;
	for (const post of posts) {
		post.content = rootEngine.renderContent(post.body, true, {site, page: post});
	}

	// later mounts override earlier ones
	const outputs = new Map();
	for (const mount of config.mounts) {
		const tree = treeDir(mount.ref, config.refs);
		const src = join(tree, mount.src);
		const engine = getEngine(join(tree, SITE_DIR));
		const mountSite = {...site, ...config.versions?.[mount.version]};
		const exclude = [...(mount.src === SITE_DIR ? config.exclude ?? [] : []), ...(mount.exclude ?? [])];

		for (const file of mount.files ?? walk(src, exclude)) {
			const out = join(mount.dest, file.replace(MARKDOWN_EXT, '.html'));
			outputs.set(out, {path: join(src, file), engine, site: mountSite});
		}
	}

	rmSync(dest, {recursive: true, force: true});

	for (const post of posts) {
		write(join(dest, post.url), rootEngine.renderLayouts(post.content, post, site));
	}
	for (const [out, {path, engine, site}] of outputs) {
		const page = readPage(path);
		if (page) {
			const content = engine.renderContent(page.body, MARKDOWN_EXT.test(path), {site, page: page.data});
			write(join(dest, out), engine.renderLayouts(content, page.data, site));
		} else {
			mkdirSync(dirname(join(dest, out)), {recursive: true});
			copyFileSync(path, join(dest, out));
		}
	}

	return outputs.size + posts.length;
}

function createEngine(dirs) {
	const liquid = new Liquid({
		root: dirs.map(dir => join(dir, '_includes')),
		jekyllInclude: true,
		dynamicPartials: false,
		extname: '',
		timezoneOffset: 0
	});

	const layouts = new Map();
	const getLayout = (name) => {
		if (!layouts.has(name)) {
			const file = dirs.map(dir => join(dir, '_layouts', `${name}.html`)).find(existsSync);
			if (!file) { throw new Error(`Layout ${name} not found in ${dirs.join(', ')}`); }
			const {data, body} = readPage(file) ?? {data: {}, body: readFileSync(file, 'utf8')};
			layouts.set(name, {data, template: liquid.parse(body, file)});
		}
		return layouts.get(name);
	};

	return {
		// Jekyll's order: Liquid first, then Markdown
		renderContent(body, markdown, scope) {
			const text = liquid.parseAndRenderSync(body, scope);
			if (!markdown) { return text; }
			headerIds = new Map();
			return marked.parse(text);
		},
		renderLayouts(content, page, site) {
			const layoutData = {};
			for (let name = page.layout; name;) {
				const layout = getLayout(name);
				// the innermost layout's values win, as in Jekyll
				for (const key in layout.data) {
					if (!(key in layoutData)) { layoutData[key] = layout.data[key]; }
				}
				content = liquid.renderSync(layout.template, {site, page, layout: layoutData, content});
				name = layout.data.layout;
			}
			return content;
		}
	};
}

// Splits front matter off a file; returns null for files without it (static files).
// Values are all strings, so templates compare flags with "true".
function readPage(path) {
	const buf = readFileSync(path);
	if (buf.toString('latin1', 0, 3) !== '---') { return null; }
	const text = buf.toString('utf8');
	const match = text.match(FRONT_MATTER);
	if (!match) { return null; }
	return {data: parseYaml(match[1] ?? '') ?? {}, body: text.slice(match[0].length)};
}

// Lists files under dir recursively, skipping _ and . prefixed entries and excluded paths, as Jekyll does
function walk(dir, exclude = [], prefix = '') {
	const files = [];
	for (const name of readdirSync(join(dir, prefix)).sort()) {
		const rel = prefix ? `${prefix}/${name}` : name;
		if (name[0] === '_' || name[0] === '.' || exclude.some(e => rel === e || rel.startsWith(`${e}/`))) { continue; }
		if (statSync(join(dir, rel)).isDirectory()) {
			files.push(...walk(dir, exclude, rel));
		} else {
			files.push(rel);
		}
	}
	return files;
}

// A pinned ref is extracted from git once into the cache; no ref means the checkout itself
function treeDir(ref, refs) {
	if (!ref) { return '.'; }
	const sha = execSync(`git rev-parse ${refs[ref]}^{commit}`, {encoding: 'utf8'}).trim();
	const dir = join(CACHE_DIR, sha);
	if (!existsSync(dir)) {
		const tmp = `${dir}.tmp`;
		rmSync(tmp, {recursive: true, force: true});
		mkdirSync(tmp, {recursive: true});
		execSync(`git archive ${sha} ${SITE_DIR} | tar -x -C ${tmp}`);
		renameSync(tmp, dir);
	}
	return dir;
}

function write(path, content) {
	mkdirSync(dirname(path), {recursive: true});
	writeFileSync(path, content);
}

if (import.meta.url === `file://${process.argv[1]}`) {
	const start = performance.now();
	const n = buildSite(JSON.parse(readFileSync(process.argv[2] ?? 'build/site.json', 'utf8')));
	console.log(`Built ${n} files in ${Math.round(performance.now() - start)} ms`);
}
