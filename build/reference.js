// Builds an API reference page: a backend parses a ref's sources into the reference model (namespaces → supersections
// → sections → items, inherited groups resolved), and the templates in build/reference render it to HTML.

import {existsSync} from 'node:fs';
import {join} from 'node:path';
import {Liquid} from 'liquidjs';
import {Marked} from 'marked';
import LeafDoc from 'leafdoc';
import {tsModel} from './reference-ts.js';

// supersection kinds in page order, with their headings
export const LABELS = {
	example: 'Usage example',
	constructor: 'Constructor',
	destructor: 'Destructor',
	factory: 'Creation',
	option: 'Options',
	event: 'Events',
	method: 'Methods',
	function: 'Functions',
	property: 'Properties',
	pane: 'Map panes',
	projection: 'Defined projections',
	crs: 'Defined CRSs'
};
const KINDS = Object.keys(LABELS);
const INHERITABLE = new Set(['method', 'function', 'event', 'option', 'property']);

// table columns per kind; `params` renders the signature, `block` keeps paragraphs in descriptions
const COLUMNS = {
	constructor: {name: 'Constructor', params: true},
	destructor: {name: 'Destructor', params: true},
	factory: {name: 'Factory', params: true},
	option: {name: 'Option', type: 'Type', default: 'Default'},
	event: {name: 'Event', type: 'Data'},
	method: {name: 'Method', params: true, returns: true, block: true},
	function: {name: 'Function', params: true, returns: true},
	property: {name: 'Property', type: 'Type'},
	pane: {name: 'Pane', type: 'Type', default: 'Z-index'},
	projection: {name: 'Projection'},
	crs: {name: 'CRS'}
};

const md = new Marked();
let akas; // link name → anchor, for the reference being rendered

const liquid = new Liquid({root: 'build/reference', extname: '.liquid'});

// links a type name that has an anchor on the page
const link = str => (str in akas ? `<a href='#${akas[str]}'>${str}</a>` : str);

// unions may only wrap after a `|`, so a long one doesn't force a wide signature column; `pre`/`post` (a param's
// name, a trailing comma) stay attached to the first and last member
function type(str, pre = '', post = '') {
	if (!str) { return ''; }
	if (!pre && (str in akas || !str.includes('|'))) { return link(str); }
	const members = str in akas ? [str] : str.split('|');
	return members.map((m, i) => `<nobr>${i ? '' : pre}${link(m)}${i < members.length - 1 ? '|' : post}</nobr>`).join('<wbr>');
}
liquid.registerFilter('type', type);

// wraps only after the opening paren and between params; the closing paren and return type stay with the last param
liquid.registerFilter('signature', (item, returns) => {
	// most methods chain, so `this` is muted for the meaningful return types to stand out
	const ret = !returns || !item.type ? '' :
		item.type === 'this' ? '<nobr class="this">: this</nobr>' : type(item.type, ': ');
	const params = item.params.map((p, i) => {
		const post = i < item.params.length - 1 ? ',' : ')';
		const name = `<i>${p.name}</i>`;
		return p.type ? type(p.type, `${name}: `, post) : `<nobr>${name}${post}</nobr>`;
	});
	return `(${params.length ? `<wbr>${params.join(' ')}` : ')'}${ret}`;
});

const STRING = /^(['"`]).*\1$/s;
const LITERAL = /^(-?([\d.]+|Infinity)|true|false|null|\[(-?[\d.]+(, )?)*\])$/;
const HTML_CHARS = /[&<>"']/g;

// colored like code blocks by the kind of literal; `undefined` shows as an empty cell
liquid.registerFilter('literal', (str) => {
	if (!str || str === 'undefined') { return ''; }
	const kind = STRING.test(str) ? 'string' : LITERAL.test(str) ? 'literal' : '';
	const html = str.replace(HTML_CHARS, c => `&#${c.charCodeAt(0)};`);
	return `<code${kind ? ` class='${kind}'` : ''}>${html}</code>`;
});

// `block` keeps the paragraphs; otherwise the first paragraph's tags are dropped so a one-liner sits in a table cell
liquid.registerFilter('markdown', (str, block) => {
	if (!str) { return ''; }
	const html = md.parse(linkAKAs(str));
	return block ? html : html.trim().replace('<p>', '').replace('</p>', '');
});

// A ref with `build/reference.json` is documented in typed JSDoc, an older one in Leafdoc comments. Returns the page
// body and its TOC, which only the TS backend generates (the Leafdoc pages keep a hand-kept one)
export function buildReference(dir) {
	const model = existsSync(join(dir, 'build/reference.json')) ? tsModel(dir) : leafdocModel(dir);
	akas = model.akas;
	return {
		api: liquid.renderFileSync('reference', {namespaces: model.namespaces, columns: COLUMNS}),
		toc: model.toc ? liquid.renderFileSync('toc', {toc: model.toc}) : null
	};
}

// Turns `[text](#aka)` and `` `aka` `` in descriptions into links to the anchor
function linkAKAs(str) {
	return str.trim()
		.replace(/\[([^[\]]*)\]\(#([^()]*)\)/g, (match, text, aka) => (aka in akas ? `[${text}](#${akas[aka]})` : match))
		.replace(/`([^`]*)`/g, (match, aka) => (aka in akas ? `[\`${aka}\`](#${akas[aka]})` : match))
		// a code link inside a link: [pre[`code`](url)post](url2) → [pre`code`post](url2)
		.replace(/\[([^`[\]()]*)\[`([^`[\]()]*)`\]\([^`[\]()]*\)([^`[\]()]*)\]\(([^`[\]()]*)\)/g,
			(match, pre, code, post, url) => `[${pre}\`${code}\`${post}](${url})`);
}

// Builds the model from a backend's raw namespaces, each `{name, id, comments, inherits, parent, supersections}`
// where `parent` nests a miniclass under its namespace and `supersections` maps a kind to `{id, sections}`, each
// section `{id, name, comments, uninheritable, items}`; an item's `key` decides which inherited item it overrides.
export function resolveModel(raws, akas) {
	const all = Object.fromEntries(raws.map(ns => [ns.name, ns]));

	const flatAncestorsOf = (name, list = []) => {
		if (!all[name]) {
			console.warn(`Ancestor class/namespace ${name} not found`);
			return list;
		}
		for (const parent of all[name].inherits) {
			if (!list.includes(parent)) {
				list.push(parent);
				flatAncestorsOf(parent, list);
			}
		}
		return list;
	};
	// depth-first, then each ancestor moved before the first of its own ancestors, so that a pseudo-class like
	// "Interactive layer" comes before `Layer` whichever order `inherits` lists them in
	const ancestorsOf = (name) => {
		const list = flatAncestorsOf(name);
		for (const a of [...list]) {
			const own = flatAncestorsOf(a);
			const first = list.findIndex(x => own.includes(x));
			if (first !== -1 && first < list.indexOf(a)) {
				list.splice(list.indexOf(a), 1);
				list.splice(first, 0, a);
			}
		}
		return list;
	};

	const sectionsOf = (ns, kind) => (Object.hasOwn(ns.supersections, kind) ? ns.supersections[kind].sections : []);
	const inheritableSectionsOf = (name, kind) => sectionsOf(all[name], kind).filter(s => !s.uninheritable);

	const item = (d, id = d.id) => ({id, name: d.name, params: d.params, type: d.type, default: d.default,
		comments: d.comments});

	const namespace = (ns) => {
		const ancestors = ancestorsOf(ns.name);
		const supersections = [];

		for (const kind of KINDS) {
			const ss = Object.hasOwn(ns.supersections, kind) ? ns.supersections[kind] : undefined;
			const inherits = INHERITABLE.has(kind) && ancestors.some(a => inheritableSectionsOf(a, kind).length);
			if (!ss && !inherits) { continue; }

			const sections = (ss?.sections ?? []).map(s => ({
				id: s.id,
				name: s.name,
				comments: s.comments,
				secondary: s.name !== null && kind !== 'example',
				items: s.items.map(d => item(d))
			}));

			// ancestors' items not overridden here, grouped by the section they come from
			const inherited = [];
			const seen = new Set((ss?.sections ?? []).flatMap(s => s.items.map(d => d.key)));
			for (const parent of INHERITABLE.has(kind) ? ancestors : []) {
				for (const s of inheritableSectionsOf(parent, kind)) {
					const items = [];
					for (const d of s.items) {
						if (seen.has(d.key)) { continue; }
						seen.add(d.key);
						items.push(item(d, normalizeName(ns.name, d.name)));
					}
					if (items.length) {
						inherited.push({name: s.name ?? LABELS[kind], ancestor: parent, items});
					}
				}
			}

			supersections.push({
				id: ss?.id ?? `${ns.id}-${kind}`,
				kind,
				label: ns.parent ? ns.name : LABELS[kind],
				sections,
				inherited
			});
		}

		return {
			id: ns.id,
			name: ns.name,
			comments: ns.comments,
			supersections,
			miniclasses: raws.filter(m => m.parent === ns.name).map(namespace)
		};
	};

	return {namespaces: raws.filter(ns => !ns.parent).map(namespace), akas};
}

// Leafdoc's anchor scheme: `namespace-name`, lowercased, with spaces and dots as dashes
export function normalizeName(namespace, name) {
	return `${namespace}${name ? `-${name}` : ''}`.trim().replace(/[\s.]/g, '-').toLowerCase();
}

// The Leafdoc backend: parses a ref's Leafdoc comments into raw namespaces
export function leafdocModel(dir) {
	const doc = new LeafDoc({showInheritancesWhenEmpty: true, leadingCharacter: '@'});
	doc.registerDocumentable('pane');
	doc.registerDocumentable('projection');
	doc.registerDocumentable('crs');
	doc.addFile(join(dir, 'build/docs-index.leafdoc'), false);
	doc.addDir(join(dir, 'src'));
	doc.addFile(join(dir, 'build/docs-misc.leafdoc'), false);
	doc._resolveAKAs();

	const minis = doc._miniclasses; // miniclass → the class it's documented in

	// comment lines → Markdown, null when empty (an empty string is truthy in Liquid)
	const text = lines => lines.join('\n').trim() || null;
	// the default section goes first
	const isDefault = s => s.name === '__default';

	const raws = Object.values(doc._namespaces).map(ns => ({
		name: ns.name,
		id: ns.id,
		comments: text(ns.comments),
		inherits: ns.inherits,
		parent: minis[ns.name],
		supersections: Object.fromEntries(Object.entries(ns.supersections).map(([kind, ss]) => [kind, {
			id: ss.id,
			sections: Object.values(ss.sections).sort((a, b) => isDefault(b) - isDefault(a)).map(s => ({
				id: s.id,
				name: isDefault(s) ? null : s.name,
				comments: text(s.comments),
				uninheritable: s.uninheritable,
				items: Object.entries(s.documentables).map(([key, d]) => ({
					key,
					id: d.id,
					name: d.name,
					params: Object.values(d.params ?? {}),
					type: d.type,
					default: d.defaultValue,
					comments: text(d.comments)
				}))
			}))
		}]))
	}));

	return resolveModel(raws, doc._AKAs);
}
