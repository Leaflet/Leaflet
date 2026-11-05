// Builds leafletjs.com into _site/ from docs/ and the pinned refs in build/site.json. Covers the part of Jekyll the
// site uses (front matter, Liquid, Markdown, chained layouts, posts, the plugins collection) and the API references.

import {readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync, copyFileSync, cpSync, rmSync, renameSync, statSync}
	from 'node:fs';
import {execSync} from 'node:child_process';
import {join, dirname} from 'node:path';
import {Liquid} from 'liquidjs';
import {Marked} from 'marked';
import {markedSmartypants} from 'marked-smartypants';
import {parse as parseYaml} from '@mourner/yeahml';
import {createHighlighter, bundledThemes} from 'shiki';
import {buildReference} from './reference.js';

const SITE_DIR = 'docs';
const DEST = '_site';
const CACHE_DIR = 'node_modules/.cache/leaflet-site';

const POST_FILE = /^(\d{4})-(\d\d)-(\d\d)-(.+)\.md$/;
const MARKDOWN_EXT = /\.md$/;
const FRONT_MATTER = /^---\r?\n([\s\S]*?\r?\n)?---\r?\n/;
const HTML_TAG = /<[^>]*>/g;
const NON_ID_CHAR = /[^\p{L}\p{N}\p{M}_\- ]/gu;
const ID_ATTR = /\sid=['"]([^'"]+)['"]/g;
const HASH_LINK = /\shref=['"]#([^'"]+)['"]/g;
const CODE_BLOCK = /<pre([^>]*)><code([^>]*)>([\s\S]*?)<\/code><\/pre>/g;
const CLASS_ATTR = /\sclass=['"]([^'"]*)['"]/;
const WHITESPACE = /\s+/;
const LANGUAGE_PREFIX = /^language-/;
const ENTITY = /&(#x[\da-f]+|#\d+|amp|lt|gt|quot|copy);/gi;
const ENTITIES = {amp: '&', lt: '<', gt: '>', quot: '"', copy: '©'};
const SPECIAL_CHAR = /[&<>]/g;
const SPECIAL_ENTITIES = {'&': 'amp', '<': 'lt', '>': 'gt'};

// VS Code's GitHub theme, recolored to match how github.com highlights code; its comment color also fails AA on the
// code background, unlike the one GitHub uses now
const FUNCTION_COLOR = '#6639ba';
const CLASS_COLOR = '#953800';
const AFTER_NEW = /\bnew\s+(?:[\w$]+\.)*$/;
const baseTheme = (await bundledThemes['github-light-default']()).default;
const theme = {...baseTheme, name: 'leaflet', tokenColors: [...baseTheme.tokenColors, ...Object.entries({
	'comment': '#59636e',
	'keyword.operator': '#0550ae',
	'keyword.operator.new, keyword.operator.expression': '#cf222e',
	'entity.name.function': FUNCTION_COLOR,
	'entity.other.inherited-class, variable.other.readwrite.alias': CLASS_COLOR,
	'variable.other.constant, punctuation.separator.key-value': '#1f2328',
	'meta.object-literal.key, entity.name.tag': '#0550ae'
}).map(([scope, foreground]) => ({scope: scope.split(', '), settings: {foreground}}))]};

const highlighter = await createHighlighter({themes: [theme], langs: ['javascript', 'html', 'css', 'shellscript', 'json']});
const languages = new Set(highlighter.getLoadedLanguages());

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

// the release each pinned ref is at, for the references' version links: `v2` follows `version`, `v1` its mounts
site.refVersions = {v2: config.version};
for (const {ref, version} of config.mounts) { if (ref) { site.refVersions[ref] = version; } }

// PREVIEW=1 runs the 2.x pages on the checkout's src/ instead of the release
site.preview = !!process.env.PREVIEW;

// every page renders with the checkout's layouts and includes, so pinned pages share the current shell
const engine = createEngine(SITE_DIR);

// the plugins collection: rendered, but not written
site.plugins = walk(join(SITE_DIR, '_plugins')).map((file) => {
	const {data, body} = readPage(join(SITE_DIR, '_plugins', file));
	data.category = dirname(file);
	data.content = engine.renderContent(body, true, {site, page: data});
	return data;
});

// posts, newest first
site.posts = readdirSync(join(SITE_DIR, '_posts')).sort().reverse().map((file) => {
	const [, y, m, d, slug] = file.match(POST_FILE);
	const {data, body} = readPage(join(SITE_DIR, '_posts', file));
	const url = `/${y}/${m}/${d}/${slug}.html`;
	Object.assign(data, {url, id: url.slice(0, -5), date: new Date(`${y}-${m}-${d}`)});
	data.content = engine.renderContent(body, true, {site, page: data});
	return data;
});

// Mounts map files of a tree (the checkout or a pinned ref) onto the site; later mounts override earlier ones. A mount
// can move paths to another prefix (`rename`) and replace strings in its pages' content (`replace`), e.g. links.
const outputs = new Map();
for (const mount of config.mounts) {
	const dir = join(treeDir(config.refs[mount.ref]), SITE_DIR);
	const mountSite = {...site, ...config.versions[mount.version]};
	const renames = Object.entries(mount.rename ?? {});
	const replace = Object.entries(mount.replace ?? {});

	for (const file of walk(dir)) {
		if (mount.exclude && matches(file, mount.exclude) || mount.include && !matches(file, mount.include)) { continue; }
		const [from, to] = renames.find(([from]) => matches(file, [from])) ?? [];
		const dest = from ? to + file.slice(from.length) : file;
		outputs.set(dest.replace(MARKDOWN_EXT, '.html'), {path: join(dir, file), site: mountSite, replace});
	}
}

// Built aside and swapped in, so concurrent builds don't trip over each other and the server never sees a partial site
const out = join(CACHE_DIR, `site-${process.pid}`);
// clears what builds killed midway (e.g. restarted by --watch) left behind, keeping those of builds still running
for (const name of existsSync(CACHE_DIR) ? readdirSync(CACHE_DIR) : []) {
	const pid = name.match(/^site-(\d+)/)?.[1];
	if (pid && (+pid === process.pid || !isRunning(+pid))) { rmSync(join(CACHE_DIR, name), {recursive: true, force: true}); }
}

for (const post of site.posts) {
	write(join(out, post.url), highlightCode(engine.renderLayouts(post.content, post, site)));
}
for (const [file, {path, site, replace}] of outputs) {
	const page = readPage(path);
	for (const [from, to] of page ? replace : []) { page.body = page.body.replaceAll(from, to); }
	if (page?.data.reference) { Object.assign(page.data, buildReference(treeDir(config.refs[page.data.reference]))); }
	if (page) {
		page.data.url = `/${file}`;
		const content = engine.renderContent(page.body, MARKDOWN_EXT.test(path), {site, page: page.data});
		let html = engine.renderLayouts(content, page.data, site);
		if (page.data.reference) { html = checkLinks(file, html, !config.refs[page.data.reference]); }
		write(join(out, file), highlightCode(html));
	} else {
		mkdirSync(dirname(join(out, file)), {recursive: true});
		copyFileSync(path, join(out, file));
	}
}

if (site.preview) { cpSync('src', join(out, 'preview'), {recursive: true}); }

// A concurrent build can move DEST away before us or land its own between our two renames. Overlapping builds
// see practically the same sources, so whichever lands first stays and the other is dropped.
const old = `${out}-old`;
try { renameSync(DEST, old); } catch (err) { if (err.code !== 'ENOENT') { throw err; } }
try { renameSync(out, DEST); } catch (err) { if (err.code !== 'ENOTEMPTY' && err.code !== 'EEXIST') { throw err; } }
rmSync(old, {recursive: true, force: true});
rmSync(out, {recursive: true, force: true});

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
		execSync(`git archive ${sha} ${SITE_DIR} src build | tar -x -C ${tmp}`);
		renameSync(tmp, dir);
	}
	return dir;
}

// In-page links without a target fail the build for a reference from the checkout; a pinned ref only warns, since
// fixing it takes a new commit to pin, and gets links that differ from an id only in case pointed at that id
function checkLinks(out, html, strict) {
	const ids = new Set();
	const duplicates = new Set();
	for (const [, id] of html.matchAll(ID_ATTR)) { (ids.has(id) ? duplicates : ids).add(id); }
	if (duplicates.size) {
		console.warn(`${strict ? 'Error' : 'Warning'}: ${out} has duplicate anchors: ${Array.from(duplicates, id => `#${id}`).join(', ')}`);
		if (strict) { process.exitCode = 1; }
	}
	const idsByLowerCase = new Map(Array.from(ids, id => [id.toLowerCase(), id]));
	const dead = new Set();
	html = html.replace(HASH_LINK, (link, hash) => {
		const id = decodeURIComponent(hash);
		if (ids.has(id)) { return link; }
		const target = !strict && idsByLowerCase.get(id.toLowerCase());
		if (target) { return link.replace(hash, target); }
		dead.add(id);
		return link;
	});
	if (dead.size) {
		console.warn(`${strict ? 'Error' : 'Warning'}: ${out} links to missing anchors: ${Array.from(dead, id => `#${id}`).join(', ')}`);
		if (strict) { process.exitCode = 1; }
	}
	return html;
}

// Highlights code blocks by the language in a `<pre>` or `<code>` class (`language-js`, `javascript`), or else as
// HTML if they start with a tag and as JS otherwise. Tags inside a block (links in some pinned v1 tutorials) are
// dropped, keeping their text.
function highlightCode(html) {
	return html.replace(CODE_BLOCK, (block, preAttrs, codeAttrs, code) => {
		const classes = `${preAttrs.match(CLASS_ATTR)?.[1] ?? ''} ${codeAttrs.match(CLASS_ATTR)?.[1] ?? ''}`;
		const names = classes.split(WHITESPACE).map(c => c.replace(LANGUAGE_PREFIX, ''));
		if (names.includes('no-highlight') || names.includes('text')) { return block; }
		const text = code.replace(HTML_TAG, '').replace(ENTITY, (entity, name) => ENTITIES[name.toLowerCase()] ??
			String.fromCodePoint(name[1] === 'x' || name[1] === 'X' ? parseInt(name.slice(2), 16) : +name.slice(1)));
		const lang = names.find(name => languages.has(name)) ?? (text.trimStart().startsWith('<') ? 'html' : 'javascript');
		const {tokens, fg} = highlighter.codeToTokens(text, {theme: 'leaflet', lang});
		const html = tokens.map((line) => {
			let before = '';
			return line.map(({content, color}) => {
				const escaped = content.replace(SPECIAL_CHAR, c => `&${SPECIAL_ENTITIES[c]};`);
				let hex = color.toLowerCase();
				// the grammar scopes `X` in `new X()` like any call, while GitHub colors it as a class
				if (hex === FUNCTION_COLOR && AFTER_NEW.test(before)) { hex = CLASS_COLOR; }
				before += content;
				return hex === fg.toLowerCase() ? escaped : `<span style="color:${hex}">${escaped}</span>`;
			}).join('');
		}).join('\n');
		return `<pre${preAttrs}><code${codeAttrs}>${html}</code></pre>`;
	});
}

function matches(file, paths) {
	return paths.some(p => file === p || file.startsWith(`${p}/`));
}

function isRunning(pid) {
	try {
		process.kill(pid, 0);
		return true;
	} catch (err) {
		return err.code === 'EPERM';
	}
}

function write(path, content) {
	mkdirSync(dirname(path), {recursive: true});
	writeFileSync(path, content);
}
