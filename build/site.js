// Builds leafletjs.com into _site/ from docs/ and the pinned refs in build/site.json: `node build/site.js [config]`.
// Covers the part of Jekyll the site uses: front matter, Liquid, kramdown-flavored Markdown, chained layouts, posts and
// the plugins collection. Mounts map trees (the checkout or a pinned ref) onto output paths.

import {readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync, copyFileSync, rmSync, renameSync, statSync}
	from 'node:fs';
import {execSync} from 'node:child_process';
import {join, dirname} from 'node:path';
import {Liquid} from 'liquidjs';
import {parse as parseYaml} from '@mourner/yeahml';
import {renderMarkdown} from './site-markdown.js';

const SITE_DIR = 'docs';
const CACHE_DIR = 'node_modules/.cache/leaflet-site';

const POST_FILE = /^(\d{4})-(\d\d)-(\d\d)-(.+)\.(md|markdown|html)$/;
const MARKDOWN_EXT = /\.(md|markdown)$/;
const FRONT_MATTER = /^---[ \t]*\r?\n([\s\S]*?\r?\n)?---[ \t]*(?:\r?\n|$)/;
// Jekyll's closing `---\s*$\n?` also swallows blank lines after it
const LEADING_BLANK_LINES = /^(?:[ \t]*\r?\n)+/;
const BOOLEAN_OR_EMPTY = /^([\w-]+):[ \t]*(true|false)?[ \t]*$/gm;
const XML_SPECIAL = /[&<>"']/g;
const XML_ESCAPES = {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', '\'': '&apos;'};
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October',
	'November', 'December'];

const toDate = d => (d instanceof Date ? d : new Date(d));
const formatDate = (d, long) => {
	const month = MONTHS[d.getUTCMonth()];
	return `${String(d.getUTCDate()).padStart(2, '0')} ${long ? month : month.slice(0, 3)} ${d.getUTCFullYear()}`;
};

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
		const doc = readPage(join(rootDir, '_plugins', file));
		if (!doc) { continue; }
		doc.data.content = rootEngine.renderContent(doc.body, true, {site, page: doc.data});
		site.plugins.push(doc.data);
	}

	// posts, newest first; rendered before pages, so that atom.xml can embed them
	const posts = [];
	for (const file of readdirSync(join(rootDir, '_posts'))) {
		const [, y, m, d, slug, ext] = file.match(POST_FILE);
		const {data, body} = readPage(join(rootDir, '_posts', file));
		const url = `/${y}/${m}/${d}/${slug}.html`;
		Object.assign(data, {url, id: url.slice(0, -5), date: new Date(`${y}-${m}-${d}T00:00:00Z`), slug});
		posts.push({data, body, markdown: ext !== 'html'});
	}
	posts.sort((a, b) => b.data.date - a.data.date || (b.data.url < a.data.url ? -1 : 1));
	site.posts = posts.map(p => p.data);
	for (const post of posts) {
		post.data.content = rootEngine.renderContent(post.body, post.markdown, {site, page: post.data});
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
		write(join(dest, post.data.url), rootEngine.renderLayouts(post.data.content, post.data, site));
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
		extname: ''
	});
	// Jekyll's filters; the site builds in UTC
	liquid.registerFilter('date_to_xmlschema', d => `${toDate(d).toISOString().slice(0, 19)}+00:00`);
	liquid.registerFilter('date_to_string', d => formatDate(toDate(d), false));
	liquid.registerFilter('date_to_long_string', d => formatDate(toDate(d), true));
	liquid.registerFilter('xml_escape', s => (s == null ? s : String(s).replace(XML_SPECIAL, c => XML_ESCAPES[c])));

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
			return markdown ? renderMarkdown(text) : text;
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
// yeahml has no implicit typing, so top-level unquoted true/false become booleans and empty values null, as in YAML.
function readPage(path) {
	const buf = readFileSync(path);
	if (buf.toString('latin1', 0, 3) !== '---') { return null; }
	const text = buf.toString('utf8');
	const match = text.match(FRONT_MATTER);
	if (!match) { return null; }
	const yaml = (match[1] ?? '').replace(/\r\n/g, '\n');
	const data = parseYaml(yaml) ?? {};
	for (const [, key, value] of yaml.matchAll(BOOLEAN_OR_EMPTY)) {
		data[key] = value ? value === 'true' : null;
	}
	return {data, body: text.slice(match[0].length).replace(LEADING_BLANK_LINES, '')};
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
