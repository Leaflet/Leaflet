// The TS backend of the reference: builds raw namespaces (see `resolveModel`) from a ref's typed JSDoc through the
// TypeScript API, with `build/reference.json` deciding what gets a page. All AST and checker access lives here, since
// the API changes between TS minors (the version is pinned in package.json).

import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import {API} from 'typescript/sync';
import {SyntaxKind as SK, getTextOfJSDocComment} from 'typescript/ast';
import {LABELS, normalizeName, resolveModel} from './reference.js';

const COMPILER_OPTIONS = {
	target: 'es2022', lib: ['es2022', 'dom'], module: 'nodenext', allowJs: true, checkJs: true, strict: true, types: []
};

const INTERFACE_SUFFIX = /(Options|EventMap)$/;
const OPTIONS_SUFFIX = /Options$/;
const EVENT_MAP_SUFFIX = /EventMap$/;
const CAPTION = /^<caption>(.*?)<\/caption>\s*/;
const PROPERTY_DEFAULT = /^@property\s*\{.*?\}\s*\[[\w$]+\s*=\s*((?:\[[^\]]*\]|[^\]])*)\]/s;
const PARAM_MARKS = /^…|\?$/g;
const BLOCK_COMMENT = /\/\*.*?\*\/\s*/g;
const FENCE = /```.*?```/gs;

let checker, config, pages, ownerOfInterface, lookup;

export function tsModel(dir) {
	config = JSON.parse(readFileSync(join(dir, 'build/reference.json'), 'utf8'));
	const api = new API({cwd: dir});
	try {
		const parsed = api.parseJsonConfigFileContent({compilerOptions: COMPILER_OPTIONS, include: ['src']},
			{configDirectory: dir});
		const snapshot = api.createSnapshot({createPrograms: [{rootFiles: parsed.fileNames, compilerOptions: parsed.options}]});
		const program = snapshot.operation.createdPrograms[0];
		checker = program.getProject().checker;
		return build([join(dir, 'src/Leaflet.js'), join(dir, 'src/types.ts')].map(f => program.getSourceFile(f)));
	} finally {
		api.close();
	}
}

function build(entries) {
	// exported names of the entry modules → their declarations (a source file for `export * as`)
	const exports = new Map();
	for (const sf of entries) {
		for (const sym of checker.getExportsOfModule(checker.getSymbolAtLocation(sf))) {
			if (!exports.has(sym.name)) { exports.set(sym.name, declOf(resolveAlias(sym))); }
		}
	}
	lookup = name => exports.get(name);

	const top = config.groups.flatMap(g => g.entries.map(entryName));
	const minis = Object.entries(config.miniclasses).flatMap(([parent, names]) => names.map(name => ({name, parent})));
	pages = new Set([...top, ...minis.map(m => m.name)]);

	// options and event map interfaces → the page that documents their own members: `XOptions` belongs to `X`,
	// one used by classes without their own to the first such class
	ownerOfInterface = new Map();
	for (const [name, ifaces] of Object.entries(config.pseudo)) {
		for (const i of ifaces) { ownerOfInterface.set(i, name); }
	}
	const classes = [...pages].filter(name => lookup(name)?.kind === SK.ClassDeclaration);
	for (const name of classes) {
		for (const i of classInterfaces(lookup(name))) {
			if (i?.replace(INTERFACE_SUFFIX, '') === name) { ownerOfInterface.set(i, name); }
		}
	}
	for (const name of classes) {
		for (const i of classInterfaces(lookup(name))) { if (i && !ownerOfInterface.has(i)) { ownerOfInterface.set(i, name); } }
	}

	const raws = [];
	const add = (name, parent) => {
		const decl = lookup(name);
		if (config.pseudo[name]) {
			raws.push(interfacePage(name, config.pseudo[name].map(lookup), parent));
		} else if (config.headers[name]) {
			raws.push(createNamespace(name, descriptionOf(docOf(lookup(config.headers[name]))), parent));
		} else if (!decl) {
			console.warn(`Reference entry ${name} not found`);
			return;
		} else if (decl.kind === SK.ClassDeclaration) {
			raws.push(classPage(name, decl, parent));
		} else if (decl.kind === SK.InterfaceDeclaration) {
			raws.push(interfacePage(name, [decl], parent));
		} else if (decl.kind === SK.SourceFile) {
			raws.push(modulePage(name, decl));
		} else if (decl.kind === SK.JSTypeAliasDeclaration) {
			raws.push(typedefPage(name, decl));
		} else {
			raws.push(valuePage(name, decl));
		}
		const ns = raws.at(-1);
		for (const [kind, names] of Object.entries(config.tables[name] ?? {})) {
			const section = sectionOf(ns, kind, null);
			for (const n of names) {
				addItem(section, {key: n, name: n, comments: descriptionOf(docOf(lookup(n)))});
			}
		}
		for (const m of minis) { if (m.parent === name) { add(m.name, ns.name); } }
	};
	for (const name of top) { add(name); }

	// by declaration, since a class can be exported under another name (`LeafletMap as Map`)
	const tableRows = Object.values(config.tables).flatMap(Object.values).flat();
	const listed = new Set([...pages, ...tableRows, ...config.unlisted].map(lookup));
	for (const [name, decl] of exports) {
		if (!listed.has(decl) && isDocumentedPage(decl)) {
			console.warn(`Documented ${name} is neither in the reference groups nor unlisted`);
		}
	}

	const akas = akasOf(raws);
	return {...resolveModel(raws, akas), toc: tocOf(akas)};
}

// a group entry is a page name or `{name, label}`
function entryName(entry) {
	return entry.name ?? entry;
}

// Groups with their own `toc` (Map's) make the pinned first column, the rest list their pages
function tocOf(akas) {
	const link = e => ({id: akas[entryName(e)], label: e.label ?? config.display[entryName(e)] ?? entryName(e)});
	return {
		pinned: config.groups.flatMap(g => g.toc ?? []),
		groups: config.groups.filter(g => !g.toc).map(g => ({label: g.label, links: g.entries.map(link)}))
	};
}

// a described class or module namespace, which would get a page if listed
function isDocumentedPage(decl) {
	if (decl?.kind === SK.ClassDeclaration) { return !!descriptionOf(lastDoc(decl)); }
	if (decl?.kind === SK.SourceFile) {
		return !!descriptionOf(moduleDoc(decl));
	}
	return false;
}

// --- raw namespaces -----------------------------------------------------------------------------------------------

function createNamespace(name, comments, parent) {
	const display = config.display[name] ?? name;
	return {name: display, tsName: name, id: normalizeName(display), comments: comments || null, inherits: [], parent,
		supersections: Object.create(null)};
}

// The section of a kind for a category, the default one (named like the supersection) first
function sectionOf(ns, kind, category, comments) {
	const name = !category || category === LABELS[kind] ? null : category;
	ns.supersections[kind] ??= {id: normalizeName(ns.name, kind), sections: []};
	const {sections} = ns.supersections[kind];
	let section = sections.find(s => s.name === name);
	if (!section) {
		section = {id: normalizeName(ns.name, name ?? kind), name, comments: null, uninheritable: false, items: []};
		if (name) { sections.push(section); } else { sections.unshift(section); }
	}
	section.comments ??= comments || null;
	return section;
}

function addItem(section, item) {
	if (section.items.some(d => d.key === item.key)) { return; }
	section.items.push({id: null, params: [], type: null, default: null, comments: null, ...item});
}

function inherit(ns, name) {
	if (name && name !== ns.name && !ns.inherits.includes(name)) { ns.inherits.push(name); }
}

// What a link name points to: page names, their TS names, `members` interfaces (to their supersection), `X options`
// and the `x-options`-style supersection names
function akasOf(raws) {
	const akas = {};
	for (const ns of raws) {
		akas[ns.name] = akas[ns.tsName] = ns.id;
		for (const [kind, ss] of Object.entries(ns.supersections)) {
			akas[`${ss.id}s`] = ss.id;
			if (kind === 'option') { akas[`${ns.name} options`] = ss.id; }
			for (const s of ss.sections) {
				for (const d of s.items) { d.id ??= kind === 'example' ? null : normalizeName(ns.name, d.name); }
			}
		}
	}
	for (const [page, kinds] of Object.entries(config.members)) {
		for (const [kind, iface] of Object.entries(kinds)) { akas[iface] = normalizeName(config.display[page] ?? page, kind); }
	}
	return akas;
}

// --- pages ----------------------------------------------------------------------------------------------------------

function classPage(name, cls, parent) {
	// a base class without a description is documented as part of its subclass (or the one `fold` names)
	const folded = [cls];
	let base = baseOf(cls);
	while (base && !descriptionOf(lastDoc(base)) && (config.fold[base.name.text] ?? name) === name) {
		folded.push(base);
		base = baseOf(base);
	}

	const doc = lastDoc(cls);
	const ns = createNamespace(name, descriptionOf(doc), parent);
	const ctx = {templates: classTemplates(cls), cats: categoryDescriptions(doc)};

	examples(ns, doc);
	constructors(ns, cls, ctx);

	const [options, events] = classInterfaces(cls);
	interfaceMembers(ns, 'option', options, ctx);
	interfaceMembers(ns, 'event', events, ctx);
	for (const [kind, iface] of Object.entries(config.members[name] ?? {})) { interfaceMembers(ns, kind, iface, ctx); }

	for (const c of folded) {
		classMembers(ns, c, ctx);
		for (const aug of augmentationsOf(c)) { signatureMembers(ns, aug.members, ctx); }
	}

	if (base) { inherit(ns, pageOfClass(base)); }
	return ns;
}

// Pseudo-classes, event objects and method options: the members of interfaces that aren't another page's
function interfacePage(name, decls, parent) {
	const ns = createNamespace(name, descriptionOf(lastDoc(decls[0])), parent);
	const ctx = {templates: {}, cats: {}};
	for (const decl of decls) {
		const kind = EVENT_MAP_SUFFIX.test(decl.name.text) ? 'event' : OPTIONS_SUFFIX.test(decl.name.text) ? 'option' : 'property';
		interfaceMembers(ns, kind, decl.name.text, ctx);
	}
	return ns;
}

// A module namespace (`export * as Util`): its documented exports
function modulePage(name, sf) {
	const header = moduleDoc(sf);
	const ns = createNamespace(name, descriptionOf(header), undefined);
	const ctx = {templates: {}, cats: categoryDescriptions(header)};
	for (const s of sf.statements) {
		if (!isExported(s)) { continue; }
		if (s.kind === SK.FunctionDeclaration) {
			signatureRows(ns, 'function', s.name.text, s, ctx);
		} else if (s.kind === SK.VariableStatement) {
			const doc = lastDoc(s);
			const text = descriptionOf(doc);
			if (!text) { continue; }
			for (const d of s.declarationList.declarations) {
				const section = sectionOf(ns, 'property', categoryOf(doc), ctx.cats[categoryOf(doc)]);
				addItem(section, {key: d.name.text, name: d.name.text, comments: text, type: typeOfDeclaration(d, doc, ctx)});
			}
		}
	}
	return ns;
}

// A documented object type (`Projection`): function-typed properties are methods
function typedefPage(name, alias) {
	const ns = createNamespace(name, descriptionOf(lastDoc(alias)), undefined);
	const ctx = {templates: {}, cats: {}};
	for (const p of alias.type.members ?? []) {
		const comments = descriptionOf(lastDoc(p));
		if (!comments) { continue; }
		if (p.type?.kind === SK.FunctionType) {
			addItem(sectionOf(ns, 'method', null), {key: p.name.text, name: p.name.text, comments,
				params: paramsOfNodes(p.type.parameters, ctx), type: renderType(p.type.type, ctx) || null});
		} else {
			addItem(sectionOf(ns, 'property', null), {key: p.name.text, name: p.name.text, comments,
				type: renderType(p.type, ctx) || null});
		}
	}
	return ns;
}

// A documented constant (`version`)
function valuePage(name, decl) {
	const doc = docOf(decl);
	const ns = createNamespace(name, descriptionOf(doc), undefined);
	examples(ns, doc);
	return ns;
}

// --- members --------------------------------------------------------------------------------------------------------

function examples(ns, doc) {
	for (const t of tagsOf(doc).filter(t => tagName(t) === 'example')) {
		const raw = text(t.comment, t);
		const caption = CAPTION.exec(raw);
		const body = caption ? raw.slice(caption[0].length) : raw;
		addItem(sectionOf(ns, 'example', caption?.[1]), {key: '__default', name: '__default',
			comments: body.includes('```') ? body : `\`\`\`js\n${body}\n\`\`\``});
	}
}

// Constructor rows from the class or, when it doesn't document its own, the nearest base that does
function constructors(ns, cls, ctx) {
	for (let c = cls; c; c = baseOf(c)) {
		// with `@overload` blocks, only the implementation carries the JSDoc
		const ctor = c.members.find(m => m.kind === SK.Constructor && m.jsDoc);
		if (ctor?.jsDoc.some(d => descriptionOf(d))) {
			signatureRows(ns, 'constructor', ns.name, ctor, ctx);
			return;
		}
	}
}

// One row per `@overload` block, each with its own description, or one for a plain block; `sigNode` is the
// function the signatures come from, when it isn't the node itself (which then only gives the description)
function signatureRows(ns, kind, name, node, ctx, sigNode = node) {
	const {main, rows} = signatureBlocks(node);
	if (!rows.some(b => descriptionOf(b))) { return; }
	const sigs = sigNode === node ? rows : signatureBlocks(sigNode).rows;

	const category = categoryOf(main) ?? categoryOf(rows[0]);
	const section = sectionOf(ns, kind, category, ctx.cats[category ?? LABELS[kind]]);
	if (hasTag(main, 'uninheritable')) { section.uninheritable = true; }

	sigs.forEach((b, i) => {
		const sig = signatureOf(b, sigNode, ctx);
		addItem(section, {key: i ? `${name}-alternative-${i}` : name, name,
			comments: descriptionOf(rows[i]) ?? descriptionOf(rows[0]), ...sig, type: kind === 'constructor' ? null : sig.type});
	});
}

function signatureBlocks(node) {
	const blocks = node.jsDoc ?? [];
	const overloads = blocks.filter(b => hasTag(b, 'overload'));
	return {main: blocks.at(-1), rows: overloads.length ? overloads : [blocks.at(-1)]};
}

function classMembers(ns, cls, ctx) {
	for (const m of cls.members) {
		const name = m.name?.text;
		if (!name || m.kind === SK.Constructor || !isPublic(name, m)) { continue; }
		const isStatic = (m.modifiers ?? []).some(x => x.kind === SK.StaticKeyword);
		const doc = lastDoc(m);
		const fn = m.kind === SK.PropertyDeclaration && isStatic && functionOf(m.initializer);
		if (m.kind === SK.MethodDeclaration) {
			signatureRows(ns, isStatic ? 'function' : 'method', name, m, ctx);
		} else if (fn) {
			// `static getFeature = getFeature`: the function's signature with the property's description
			signatureRows(ns, 'function', name, m, ctx, fn);
		} else if (m.kind === SK.PropertyDeclaration && functionTypeOf(doc) && descriptionOf(doc)) {
			const type = functionTypeOf(doc);
			const category = categoryOf(doc);
			const kind = isStatic ? 'function' : 'method';
			addItem(sectionOf(ns, kind, category, ctx.cats[category ?? LABELS[kind]]), {key: name, name,
				comments: descriptionOf(doc), params: paramsOfNodes(type.parameters, ctx), type: renderType(type.type, ctx) || null});
		} else if ((m.kind === SK.PropertyDeclaration || m.kind === SK.GetAccessor) && descriptionOf(doc)) {
			const category = categoryOf(doc);
			const section = sectionOf(ns, 'property', category, ctx.cats[category ?? 'Properties']);
			if (hasTag(doc, 'uninheritable')) { section.uninheritable = true; }
			addItem(section, {key: name, name, comments: descriptionOf(doc), type: typeOfDeclaration(m, doc, ctx)});
		}
	}
	// documented properties assigned in methods (`this.dragging = …`)
	const visit = (node) => {
		if (node.kind === SK.ExpressionStatement && node.jsDoc && node.expression.kind === SK.BinaryExpression &&
			node.expression.left.kind === SK.PropertyAccessExpression &&
			node.expression.left.expression.kind === SK.ThisKeyword) {
			const doc = lastDoc(node);
			const name = node.expression.left.name.text;
			if (descriptionOf(doc) && isPublic(name, node)) {
				const category = categoryOf(doc);
				addItem(sectionOf(ns, 'property', category, ctx.cats[category ?? 'Properties']), {key: name, name,
					comments: descriptionOf(doc), type: typeOfDeclaration(node.expression.left, doc, ctx)});
			}
		}
		node.forEachChild(visit);
	};
	for (const m of cls.members) {
		if (m.body) { m.body.forEachChild(visit); }
	}
}

// Members of a `declare module` augmentation or an interface body
function signatureMembers(ns, members, ctx) {
	for (const m of members) {
		const doc = lastDoc(m);
		if (!descriptionOf(doc) || !isPublic(m.name.text, m)) { continue; }
		const name = m.name.text;
		if (m.kind === SK.MethodSignature) {
			signatureRows(ns, 'method', name, m, ctx);
		} else {
			const category = categoryOf(doc);
			const section = sectionOf(ns, 'property', category, ctx.cats[category ?? 'Properties']);
			if (hasTag(doc, 'uninheritable')) { section.uninheritable = true; }
			addItem(section, {key: name, name, comments: descriptionOf(doc), type: renderType(m.type, ctx)});
		}
	}
}

// Rows of an options or event map interface: the members it doesn't get from another page's interface, which
// becomes an ancestor instead
function interfaceMembers(ns, kind, ifaceName, ctx) {
	if (!ifaceName) { return; }
	const owner = ownerOfInterface.get(ifaceName);
	if (owner && owner !== ns.tsName) {
		inherit(ns, config.display[owner] ?? owner);
		return;
	}
	const iface = lookup(ifaceName);
	if (iface?.kind !== SK.InterfaceDeclaration) { return; }

	for (const h of iface.heritageClauses?.flatMap(c => c.types) ?? []) {
		const hName = (h.expression ?? h.typeName).text;
		const hOwner = ownerOfInterface.get(hName) ?? (pages.has(hName) ? hName : null);
		if (hOwner) {
			inherit(ns, config.display[hOwner] ?? hOwner);
			continue;
		}
		// `Omit<XDefaults, keyof P>` leaves out the defaults that override P's, which are still own rows here
		const target = hName === 'Omit' ? h.typeArguments[0] : h;
		for (const prop of checker.getPropertiesOfType(checker.getTypeAtLocation(target))) {
			memberRow(ns, kind, prop, ctx);
		}
	}
	for (const m of iface.members) {
		const sym = m.name && checker.getSymbolAtLocation(m.name);
		if (sym) { memberRow(ns, kind, sym, ctx, m); }
	}
}

// An option, event or property row from a member symbol: a `defaultOptions` property, a typedef's `@property`
// (which TS reparses into a type alias with property signatures) or an interface member
function memberRow(ns, kind, sym, ctx, decl = declOf(sym)) {
	if (!decl) { return; }
	const doc = lastDoc(decl);
	const comments = descriptionOf(doc);
	if (!comments) { return; }

	let type;
	const typeTag = tagsOf(doc).find(t => t.kind === SK.JSDocTypeTag);
	if (typeTag) {
		type = renderType(typeTag.typeExpression.type, ctx);
	} else if (decl.kind === SK.MethodSignature || decl.kind === SK.MethodDeclaration) {
		type = 'Function';
	} else if (decl.type) {
		type = renderType(decl.type, ctx);
	} else {
		type = renderCheckerType(checker.getTypeOfSymbol(sym), ctx);
	}

	let def = null;
	if (decl.kind === SK.PropertyAssignment) {
		def = defaultText(decl.initializer);
	} else if (isTypedefMember(decl)) {
		def = PROPERTY_DEFAULT.exec(sourceText(decl))?.[1] ?? null;
	}
	def = tagsOf(doc).filter(t => tagName(t) === 'default').map(t => text(t.comment))[0] ?? def;

	// members of an interface or typedef take its category
	const container = isTypedefMember(decl) ? decl.parent.parent : decl.parent?.kind === SK.InterfaceDeclaration ? decl.parent : null;
	const category = categoryOf(doc) ?? categoryOf(lastDoc(container));
	addItem(sectionOf(ns, kind, category, ctx.cats[category ?? LABELS[kind]]), {key: sym.name, name: sym.name, comments,
		type: type || null, default: kind === 'option' || kind === 'pane' ? def : null});
}

function isTypedefMember(decl) {
	return decl.parent?.kind === SK.TypeLiteral && decl.parent.parent?.kind === SK.JSTypeAliasDeclaration;
}

// --- signatures and types -------------------------------------------------------------------------------------------

function signatureOf(block, node, ctx) {
	// an `@overload` block's params and return are inside the tag's signature
	const tags = tagsOf(block).flatMap(t => (t.kind === SK.JSDocOverloadTag ? [t, ...t.typeExpression.typeParameters ?? [],
		...t.typeExpression.parameters, ...t.typeExpression.type ? [t.typeExpression.type] : []] : [t]));
	const templates = {...ctx.templates};
	const thisName = tags.find(t => t.kind === SK.JSDocThisTag)?.typeExpression.type.typeName?.text;
	for (const t of tags.filter(t => t.kind === SK.JSDocTemplateTag)) {
		for (const tp of t.typeParameters) {
			templates[tp.name.text] = tp.name.text === thisName ? {this: true} : {constraint: t.constraint};
		}
	}
	const c = {...ctx, templates};

	const params = [];
	let type = null;
	for (const t of tags) {
		if (t.kind === SK.JSDocParameterTag && t.name.kind === SK.Identifier &&
			!params.some(p => p.name.replace(PARAM_MARKS, '') === t.name.text)) {
			const opt = t.isBracketed || t.typeExpression?.type.kind === SK.JSDocOptionalType;
			const rest = t.typeExpression?.type.kind === SK.JSDocVariadicType;
			params.push({name: `${rest ? '…' : ''}${t.name.text}${opt ? '?' : ''}`, type: renderType(t.typeExpression?.type, c)});
		}
		if (t.kind === SK.JSDocReturnTag) { type = renderType(t.typeExpression?.type, c); }
	}
	if (!tags.some(t => t.kind === SK.JSDocReturnTag) && !tags.some(t => tagName(t) === 'overload') &&
		node.kind !== SK.Constructor) {
		// a signature without `@returns`: the checker's inferred type, or the declared one of an interface method
		if (node.type) {
			type = renderType(node.type, c);
		} else {
			const sig = checker.getSignatureFromDeclaration(node);
			type = sig && renderCheckerType(checker.getReturnTypeOfSignature(sig), c);
		}
	}
	if (!params.length && node.parameters?.length && !tags.some(t => tagName(t) === 'overload')) {
		params.push(...paramsOfNodes(node.parameters, c));
	}
	return {params, type: type || null};
}

function paramsOfNodes(parameters, ctx) {
	return parameters.map(p => ({
		name: `${p.dotDotDotToken ? '…' : ''}${p.name.text}${p.questionToken || p.initializer ? '?' : ''}`,
		type: renderType(p.type, ctx)
	}));
}

function typeOfDeclaration(node, doc, ctx) {
	const typeTag = tagsOf(doc).find(t => t.kind === SK.JSDocTypeTag);
	if (typeTag) { return renderType(typeTag.typeExpression.type, ctx); }
	if (node.type) { return renderType(node.type, ctx); }
	return renderCheckerType(checker.getTypeAtLocation(node), ctx);
}

function renderCheckerType(type, ctx) {
	if (!type) { return null; }
	// nodes made by the checker can't be resolved back to symbols
	return renderType(checker.typeToTypeNode(type, undefined, undefined), {...ctx, synthetic: true});
}

// A type as the page shows it, without TS syntax: primitives capitalized, functions and object types by kind, type
// parameters as their constraint, aliases that aren't pages expanded
function renderType(node, ctx, seen = new Set()) {
	const parts = [...new Set(typeParts(node, ctx, seen))];
	// literals collapse into their primitive, except a lone `false`/`true` next to other types
	if (parts.includes('true') && parts.includes('false')) {
		parts.splice(parts.indexOf('true'), 1, 'Boolean');
		parts.splice(parts.indexOf('false'), 1);
	}
	return [...new Set(parts)].join('|');
}

function typeParts(node, ctx, seen) {
	if (!node) { return []; }
	switch (node.kind) {
	case SK.StringKeyword: return ['String'];
	case SK.NumberKeyword: return ['Number'];
	case SK.BooleanKeyword: return ['Boolean'];
	case SK.ObjectKeyword: return ['Object'];
	case SK.AnyKeyword: case SK.UnknownKeyword: case SK.JSDocAllType: case SK.JSDocUnknownType: return ['*'];
	case SK.VoidKeyword: case SK.UndefinedKeyword: case SK.NeverKeyword: return [];
	case SK.ThisType: return ['this'];
	case SK.FunctionType: case SK.JSDocFunctionType: case SK.ConstructorType: return ['Function'];
	case SK.TypeLiteral: case SK.MappedType: case SK.JSDocTypeLiteral: case SK.IndexedAccessType: return ['Object'];
	case SK.TypeQuery: return typeQueryParts(node, ctx);
	case SK.TypePredicate: return ['Boolean'];
	case SK.TypeOperator: return node.operator === SK.KeyOfKeyword ? ['String'] : typeParts(node.type, ctx, seen);
	case SK.JSDocTypeExpression: case SK.ParenthesizedType: case SK.JSDocNullableType: case SK.JSDocNonNullableType:
	case SK.JSDocOptionalType: case SK.JSDocVariadicType: case SK.RestType: case SK.OptionalType:
		return typeParts(node.type, ctx, seen);
	case SK.ArrayType: return [`${arrayElement(node.elementType, ctx, seen)}[]`];
	case SK.TupleType: {
		const elements = [...new Set(node.elements.map(e => renderType(e, ctx, seen)))];
		return [elements.length === 1 ? `${elements[0]}[]` : 'Array'];
	}
	case SK.LiteralType:
		switch (node.literal.kind) {
		case SK.NullKeyword: return [];
		case SK.StringLiteral: case SK.NoSubstitutionTemplateLiteral: return ['String'];
		case SK.NumericLiteral: case SK.PrefixUnaryExpression: return ['Number'];
		case SK.TrueKeyword: return ['true'];
		case SK.FalseKeyword: return ['false'];
		default: return ['*'];
		}
	case SK.TemplateLiteralType: return ['String'];
	case SK.UnionType: {
		const parts = node.types.flatMap(t => typeParts(t, ctx, seen));
		return parts.length ? parts : ['null'];
	}
	case SK.IntersectionType: return typeParts(node.types[0], ctx, seen);
	case SK.ConditionalType: return [...typeParts(node.trueType, ctx, seen), ...typeParts(node.falseType, ctx, seen)];
	case SK.TypeReference: case SK.ExpressionWithTypeArguments: return referenceParts(node, ctx, seen);
	default: return [`?${SK[node.kind]}`];
	}
}

function arrayElement(node, ctx, seen) {
	const element = renderType(node, ctx, seen);
	return element.includes('|') ? `(${element})` : element;
}

// `typeof X` of a class: the class itself, or its nearest documented ancestor
function typeQueryParts(node, ctx) {
	const decl = ctx.synthetic ? lookup(node.exprName.text) : declOf(resolveAlias(checker.getSymbolAtLocation(node.exprName)));
	if (decl?.kind === SK.ClassDeclaration) { return [pageOfClass(decl) ?? 'Object']; }
	return ['Object'];
}

function referenceParts(node, ctx, seen) {
	const nameNode = node.typeName ?? node.expression;
	const name = nameNode.kind === SK.Identifier ? nameNode.text : nameNode.right?.text ?? nameNode.name?.text;
	const args = node.typeArguments ?? [];

	const template = ctx.templates?.[name];
	if (template) {
		if (template.this) { return ['this']; }
		if (template.options) { return [template.options]; }
		if (template.arg) { return typeParts(template.arg, template.ctx, seen); }
		return template.constraint ? typeParts(template.constraint, ctx, seen) : ['*'];
	}

	if (['Partial', 'Readonly', 'NonNullable', 'Required', 'NoInfer'].includes(name)) { return typeParts(args[0], ctx, seen); }
	if (name === 'Array' || name === 'ReadonlyArray') { return [`${arrayElement(args[0], ctx, seen)}[]`]; }
	if (name === 'Record' || name === 'Omit' || name === 'Pick') { return ['Object']; }
	if (name === 'Function') { return ['Function']; }
	if (config.display[name]) { return [config.display[name]]; }

	// `XOptions` of a page: its options section
	const owner = ownerOfInterface.get(name);
	if (owner && OPTIONS_SUFFIX.test(name) && !pages.has(name)) { return [`${config.display[owner] ?? owner} options`]; }
	if (pages.has(name)) { return [name]; }

	const decl = ctx.synthetic ? lookup(name) : declOf(resolveAlias(checker.getSymbolAtLocation(nameNode)));
	if (decl?.kind === SK.ClassDeclaration) { return [pageOfClass(decl) ?? name]; }
	// an alias declared in our sources that isn't a page: its expansion
	if (decl && !seen.has(name) && !decl.getSourceFile().fileName.includes('node_modules')) {
		const typeNode = decl.type;
		if (typeNode && decl.kind !== SK.InterfaceDeclaration) {
			const templates = {...ctx.templates};
			(decl.typeParameters ?? []).forEach((tp, i) => {
				templates[tp.name.text] = args[i] ? {arg: args[i], ctx} : {constraint: tp.constraint};
			});
			return typeParts(typeNode, {...ctx, templates}, new Set([...seen, name]));
		}
	}
	return [name];
}

// The page a class is documented on: its own, or the nearest documented ancestor's
function pageOfClass(cls) {
	for (let c = cls; c; c = baseOf(c)) {
		const name = config.fold[c.name.text] ?? c.name.text;
		if (pages.has(name)) { return config.display[name] ?? name; }
	}
	return null;
}

// --- class structure --------------------------------------------------------------------------------------------

function baseOf(cls) {
	const ext = cls.heritageClauses?.find(c => c.token === SK.ExtendsKeyword)?.types[0]?.expression;
	return ext ? declOf(resolveAlias(checker.getSymbolAtLocation(ext))) : null;
}

// Class type parameters (`@template {MarkerOptions} [O=MarkerOptions]`): the options one renders as `X options`
function classTemplates(cls) {
	const templates = {};
	for (const t of (cls.jsDoc ?? []).flatMap(d => tagsOf(d)).filter(t => t.kind === SK.JSDocTemplateTag)) {
		for (const tp of t.typeParameters) {
			const def = tp.defaultType;
			const defName = def?.typeName?.text;
			const owner = defName && ownerOfInterface?.get(defName);
			templates[tp.name.text] = owner && OPTIONS_SUFFIX.test(defName) ? {options: `${config.display[owner] ?? owner} options`} :
				{constraint: def ?? t.constraint};
		}
	}
	return templates;
}

// The options and event map interface names of a class, from `@extends {Base<O, E>}` and the template defaults
function classInterfaces(cls) {
	const tags = (cls.jsDoc ?? []).flatMap(d => tagsOf(d));
	const augments = tags.find(t => t.kind === SK.JSDocAugmentsTag);
	const defaults = {};
	for (const t of tags.filter(t => t.kind === SK.JSDocTemplateTag)) {
		for (const tp of t.typeParameters) { defaults[tp.name.text] = tp.defaultType?.typeName?.text; }
	}
	const args = augments?.className.typeArguments ?? [];
	return [0, 1].map((i) => {
		const n = args[i]?.typeName?.text;
		return n && (n in defaults ? defaults[n] : n);
	}).map(n => (n && INTERFACE_SUFFIX.test(n) ? n : undefined));
}

// Interfaces merged into a class by `declare module` augmentations
function augmentationsOf(cls) {
	const sym = checker.getSymbolAtLocation(cls.name);
	return (sym?.declarations ?? []).map(d => d.resolve?.() ?? d).filter(d => d?.kind === SK.InterfaceDeclaration);
}

// --- JSDoc and AST helpers -----------------------------------------------------------------------------------------

function resolveAlias(sym) {
	return sym && (sym.flags & 2097152 /* Alias */) ? checker.getAliasedSymbol(sym) : sym;
}

function declOf(sym) {
	const d = sym?.declarations?.[0];
	return d && (d.resolve?.() ?? d);
}

// `_` names are internal unless documented under a category, like the subclass interface of `BlanketOverlay`
function isPublic(name, node) {
	return !name.startsWith('_') || !!categoryOf(lastDoc(node));
}

function functionTypeOf(doc) {
	const type = tagsOf(doc).find(t => t.kind === SK.JSDocTypeTag)?.typeExpression.type;
	return type?.kind === SK.FunctionType ? type : null;
}

// with `@overload` blocks, a function's first declarations are stubs and the implementation carries the JSDoc
function functionOf(expr) {
	const sym = expr?.kind === SK.Identifier && resolveAlias(checker.getSymbolAtLocation(expr));
	const decls = (sym?.declarations ?? []).map(d => d.resolve?.() ?? d).filter(d => d.kind === SK.FunctionDeclaration);
	return decls.find(d => d.jsDoc) ?? decls[0] ?? null;
}

function isExported(s) {
	return (s.modifiers ?? []).some(m => m.kind === SK.ExportKeyword);
}

// TS drops the leading whitespace of comment lines depending on how many backticks precede them, so code fences are
// restored from the comment's source
function text(comment, node) {
	const str = (typeof comment === 'string' ? comment : getTextOfJSDocComment(comment) ?? '').trim();
	if (!node || !str.includes('```')) { return str; }
	const fences = sourceText(node).replace(/^[ \t]*\* ?/gm, '').match(FENCE) ?? [];
	let i = 0;
	return str.replace(FENCE, fence => fences[i++] ?? fence);
}

function tagName(tag) {
	return tag.tagName?.text;
}

function tagsOf(doc) {
	return doc?.tags ?? [];
}

function hasTag(doc, name) {
	return tagsOf(doc).some(t => tagName(t) === name);
}

function lastDoc(node) {
	return node?.jsDoc?.at(-1);
}

// a variable's JSDoc is on its statement
function docOf(decl) {
	return lastDoc(decl?.kind === SK.VariableDeclaration ? decl.parent.parent : decl);
}

function moduleDoc(sf) {
	return sf.statements.flatMap(s => s.jsDoc ?? []).find(d => hasTag(d, 'module'));
}

function descriptionOf(doc) {
	return doc ? text(doc.comment, doc) || null : null;
}

function categoryOf(doc) {
	return tagsOf(doc).filter(t => tagName(t) === 'category').map(t => text(t.comment))[0] ?? null;
}

function sourceText(node) {
	return node.getSourceFile().text.slice(node.pos, node.end);
}

function categoryDescriptions(doc) {
	const out = {};
	for (const t of tagsOf(doc).filter(t => tagName(t) === 'categoryDescription')) {
		const [name, ...rest] = text(t.comment, t).split('\n');
		out[name.trim()] = rest.join('\n').trim() || null;
	}
	return out;
}

function defaultText(init) {
	return sourceText(init).replace(BLOCK_COMMENT, '').trim();
}
