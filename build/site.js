// Builds leafletjs.com into _site/ from docs/ and the pinned refs in build/site.json. Covers the part of Jekyll the
// site uses: front matter, Liquid, Markdown, chained layouts, posts and the plugins collection.

import {readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync, copyFileSync, rmSync, renameSync, statSync}
	from 'node:fs';
import {execSync} from 'node:child_process';
import {join, dirname} from 'node:path';
import {Liquid} from 'liquidjs';
import {Marked} from 'marked';
import {markedSmartypants} from 'marked-smartypants';
import {parse as parseYaml} from '@mourner/yeahml';

const SITE_DIR = 'docs';
const DEST = '_site';
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

const start = performance.now();
const config = JSON.parse(readFileSync('build/site.json', 'utf8'));
const site = {...config.site, ...config.versions[config.version], time: new Date()};

// each tree renders with its own layouts and includes
const engines = new Map();
const getEngine = (dir) => {
	if (!engines.has(dir)) { engines.set(dir, createEngine(dir)); }
	return engines.get(dir);
};
const rootEngine = getEngine(SITE_DIR);

// the plugins collection: rendered, but not written
site.plugins = walk(join(SITE_DIR, '_plugins')).map((file) => {
	const {data, body} = readPage(join(SITE_DIR, '_plugins', file));
	data.content = rootEngine.renderContent(body, true, {site, page: data});
	return data;
});

// posts, newest first
site.posts = readdirSync(join(SITE_DIR, '_posts')).sort().reverse().map((file) => {
	const [, y, m, d, slug] = file.match(POST_FILE);
	const {data, body} = readPage(join(SITE_DIR, '_posts', file));
	const url = `/${y}/${m}/${d}/${slug}.html`;
	Object.assign(data, {url, id: url.slice(0, -5), date: new Date(`${y}-${m}-${d}`)});
	data.content = rootEngine.renderContent(body, true, {site, page: data});
	return data;
});

// mounts map files of a tree (the checkout or a pinned ref) onto the site; later mounts override earlier ones
const outputs = new Map();
for (const mount of config.mounts) {
	const dir = join(treeDir(config.refs[mount.ref]), SITE_DIR);
	const mountSite = {...site, ...config.versions[mount.version]};

	for (const file of walk(dir)) {
		if (mount.exclude && matches(file, mount.exclude) || mount.include && !matches(file, mount.include)) { continue; }
		outputs.set(file.replace(MARKDOWN_EXT, '.html'), {path: join(dir, file), engine: getEngine(dir), site: mountSite});
	}
}

rmSync(DEST, {recursive: true, force: true});

for (const post of site.posts) {
	write(join(DEST, post.url), rootEngine.renderLayouts(post.content, post, site));
}
for (const [out, {path, engine, site}] of outputs) {
	const page = readPage(path);
	if (page) {
		const content = engine.renderContent(page.body, MARKDOWN_EXT.test(path), {site, page: page.data});
		write(join(DEST, out), engine.renderLayouts(content, page.data, site));
	} else {
		mkdirSync(dirname(join(DEST, out)), {recursive: true});
		copyFileSync(path, join(DEST, out));
	}
}

console.log(`Built ${outputs.size + site.posts.length} files in ${Math.round(performance.now() - start)} ms`);

function createEngine(dir) {
	const liquid = new Liquid({
		root: join(dir, '_includes'),
		jekyllInclude: true,
		dynamicPartials: false,
		extname: '',
		timezoneOffset: 0
	});

	const layouts = new Map();
	const getLayout = (name) => {
		if (!layouts.has(name)) {
			const file = join(dir, '_layouts', `${name}.html`);
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

// Lists files under dir recursively, skipping _ and . prefixed entries, as Jekyll does
function walk(dir, prefix = '') {
	return readdirSync(join(dir, prefix)).sort().flatMap((name) => {
		const rel = prefix ? `${prefix}/${name}` : name;
		if (name[0] === '_' || name[0] === '.') { return []; }
		return statSync(join(dir, rel)).isDirectory() ? walk(dir, rel) : [rel];
	});
}

// A pinned commit is extracted from git once into the cache; no commit means the checkout itself
function treeDir(sha) {
	if (!sha) { return '.'; }
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

function matches(file, paths) {
	return paths.some(p => file === p || file.startsWith(`${p}/`));
}

function write(path, content) {
	mkdirSync(dirname(path), {recursive: true});
	writeFileSync(path, content);
}
