// Builds an API reference page: a backend parses a ref's sources into the reference model (namespaces → supersections
// → sections → items, inherited groups resolved), and the templates in build/reference render it to HTML.

import {join} from 'node:path';
import {Liquid} from 'liquidjs';
import {Marked} from 'marked';
import LeafDoc from 'leafdoc';

// supersection kinds in page order, with their headings
const LABELS = {
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
	method: {name: 'Method', params: true, type: 'Returns', block: true},
	function: {name: 'Function', params: true, type: 'Returns'},
	property: {name: 'Property', type: 'Type'},
	pane: {name: 'Pane', type: 'Type', default: 'Z-index'},
	projection: {name: 'Projection'},
	crs: {name: 'CRS'}
};

const md = new Marked();
let akas; // link name → anchor, for the reference being rendered

const liquid = new Liquid({root: 'build/reference', extname: '.liquid'});

// links a type name that has an anchor on the page
liquid.registerFilter('type', str => (str && str in akas ? `<a href='#${akas[str]}'>${str}</a>` : str ?? ''));

// `block` keeps the paragraphs; otherwise the first paragraph's tags are dropped so a one-liner sits in a table cell
liquid.registerFilter('markdown', (str, block) => {
	if (!str) { return ''; }
	const html = md.parse(linkAKAs(str));
	return block ? html : html.trim().replace('<p>', '').replace('</p>', '');
});

export function buildReference(dir) {
	return renderReference(leafdocModel(dir));
}

export function renderReference(model) {
	akas = model.akas;
	return liquid.renderFileSync('reference', {namespaces: model.namespaces, columns: COLUMNS});
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

// The Leafdoc backend: parses a ref's Leafdoc comments and builds the model from its namespaces, porting the
// inheritance resolution Leafdoc only does while stringifying
export function leafdocModel(dir) {
	const doc = new LeafDoc({showInheritancesWhenEmpty: true, leadingCharacter: '@'});
	doc.registerDocumentable('pane');
	doc.registerDocumentable('projection');
	doc.registerDocumentable('crs');
	doc.addFile(join(dir, 'build/docs-index.leafdoc'), false);
	doc.addDir(join(dir, 'src'));
	doc.addFile(join(dir, 'build/docs-misc.leafdoc'), false);
	doc._resolveAKAs();

	const all = doc._namespaces;
	const minis = doc._miniclasses; // miniclass → the class it's documented in

	const ancestorsOf = (name, list = []) => {
		if (!all[name]) {
			console.warn(`Ancestor class/namespace ${name} not found`);
			return list;
		}
		for (const parent of all[name].inherits) {
			if (!list.includes(parent)) {
				list.push(parent);
				ancestorsOf(parent, list);
			}
		}
		return list;
	};

	// the default section goes first
	const isDefault = s => s.name === '__default';
	const sectionsOf = ss => (ss ? Object.values(ss.sections).sort((a, b) => isDefault(b) - isDefault(a)) : []);
	// supersections are plain objects, where `constructor` would hit Object.prototype
	const supersectionOf = (ns, kind) => (Object.hasOwn(ns.supersections, kind) ? ns.supersections[kind] : undefined);
	const inheritableSectionsOf = (name, kind) => sectionsOf(supersectionOf(all[name], kind)).filter(s => !s.uninheritable);

	// comment lines → Markdown, null when empty (an empty string is truthy in Liquid)
	const text = lines => lines.join('\n').trim() || null;

	const item = (d, id = d.id) => ({
		id,
		name: d.name,
		params: Object.values(d.params ?? {}),
		type: d.type,
		default: d.defaultValue,
		comments: text(d.comments)
	});

	const namespace = (ns, mini) => {
		const ancestors = ancestorsOf(ns.name);
		const supersections = [];

		for (const kind of KINDS) {
			const ss = supersectionOf(ns, kind);
			const inherits = INHERITABLE.has(kind) && ancestors.some(a => inheritableSectionsOf(a, kind).length);
			if (!ss && !inherits) { continue; }

			const sections = sectionsOf(ss).map(s => ({
				id: s.id,
				name: isDefault(s) ? null : s.name,
				comments: text(s.comments),
				secondary: !isDefault(s) && kind !== 'example',
				items: Object.values(s.documentables).map(d => item(d))
			}));

			// ancestors' items not overridden here, grouped by the section they come from
			const inherited = [];
			const seen = new Set(Object.values(ss?.sections ?? {}).flatMap(s => Object.keys(s.documentables)));
			for (const parent of INHERITABLE.has(kind) ? ancestors : []) {
				for (const s of inheritableSectionsOf(parent, kind)) {
					const items = [];
					for (const [key, d] of Object.entries(s.documentables)) {
						if (seen.has(key)) { continue; }
						seen.add(key);
						items.push(item(d, doc._normalizeName(ns.name, d.name)));
					}
					if (items.length) {
						inherited.push({name: isDefault(s) ? LABELS[kind] : s.name, ancestor: parent, items});
					}
				}
			}

			supersections.push({
				id: ss?.id ?? `${ns.id}-${kind}`,
				kind,
				label: mini ? ns.name : LABELS[kind],
				sections,
				inherited
			});
		}

		return {
			id: ns.id,
			name: ns.name,
			comments: text(ns.comments),
			supersections,
			miniclasses: mini ? [] : Object.keys(minis).filter(m => minis[m] === ns.name).map(m => namespace(all[m], true))
		};
	};

	return {
		namespaces: Object.values(all).filter(ns => !(ns.name in minis)).map(ns => namespace(ns, false)),
		akas: doc._AKAs
	};
}
