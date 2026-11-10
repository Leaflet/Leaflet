// Lists the public API that the reference leaves undocumented: exported classes, functions, values and type members
// without a JSDoc description, and reference pages without an intro. Also checks that the names in
// `build/reference.json` exist, that every documented class and namespace is listed in it, and that categories are
// in sentence case. Exits with 1 on any problem, so that CI catches them.

import {readFileSync} from 'node:fs';
import {join, relative, resolve, sep} from 'node:path';
import {API} from 'typescript/sync';
import {SyntaxKind as SK, getTextOfJSDocComment} from 'typescript/ast';

const COMPILER_OPTIONS = {
	target: 'es2022', lib: ['es2022', 'dom'], module: 'nodenext', allowJs: true, checkJs: true, strict: true, types: []
};

// statics every class redeclares for the options and constructor hook machinery documented on `Class`
const MACHINERY = new Set(['defaultOptions', 'initHooks']);
// `XDefaults` interfaces repeat the options of `XOptions` as required, for use inside the class
const DEFAULTS = /Defaults$/;
const NON_SPACE = /\S/;
const CATEGORY_TAG = /@category(?:Description)?[ \t]+([^\n*]+)/g;
const CAPITALIZED = /^[A-Z]/;
const ALL_CAPS = /^[A-Z]+$/;
// declarations documented elsewhere: the `Layer` default of an option documented as an "Interactive layer" one
const DOCUMENTED_ELSEWHERE = new Set(['src/layer/LayerBase.js bubblingPointerEvents']);

const dir = resolve(process.argv[2] ?? '.');
// a path relative to the checkout, with forward slashes as in `DOCUMENTED_ELSEWHERE` also on Windows
const relPath = file => relative(dir, file).replaceAll(sep, '/');
const config = JSON.parse(readFileSync(join(dir, 'build/reference.json'), 'utf8'));
const api = new API({cwd: dir});
let checker;
const problems = new Map();

try {
	const parsed = api.parseJsonConfigFileContent({compilerOptions: COMPILER_OPTIONS, include: ['src']},
		{configDirectory: dir});
	const snapshot = api.createSnapshot({createPrograms: [{rootFiles: parsed.fileNames, compilerOptions: parsed.options}]});
	const program = snapshot.operation.createdPrograms[0];
	checker = program.getProject().checker;
	const exports = audit([join(dir, 'src/Leaflet.js'), join(dir, 'src/types.ts')].map(f => program.getSourceFile(f)));
	checkConfig(exports, new Map(parsed.fileNames.map(f => [relPath(f), readFileSync(f, 'utf8')])));
} finally {
	api.close();
}

if (problems.size) {
	console.log([...problems.values()].sort().join('\n'));
	console.log(`\n${problems.size} documentation problems`);
	process.exitCode = 1;
}

function audit([main, types]) {
	const exports = new Map();
	for (const sf of [main, types]) {
		for (const sym of checker.getExportsOfModule(checker.getSymbolAtLocation(sf))) {
			if (exports.has(sym.name)) { continue; }
			const target = resolveAlias(sym);
			exports.set(sym.name, {sym: target, decl: declOf(target), fromTypes: sf === types});
		}
	}

	for (const [name, {sym, decl, fromTypes}] of exports) {
		if (!decl || isDeprecated(decl)) { continue; }
		if (decl.kind === SK.ClassDeclaration) {
			if (!hasDescription(decl)) { report(decl, `${name} class`); }
			// a base class constructor without parameters only runs from `super()`
			const ctors = decl.members.filter(m => m.kind === SK.Constructor);
			if (ctors.some(c => c.parameters.length) && !ctors.some(hasDescription) &&
				!hasTag(decl, 'constructorDescription')) {
				report(ctors[0], `${name} constructor`);
			}
			members(`${name}#`, checker.getDeclaredTypeOfSymbol(sym), p => inBase(decl, p, true));
			members(`${name}.`, checker.getTypeOfSymbol(sym), p => MACHINERY.has(p) || inBase(decl, p, false));
		} else if (decl.kind === SK.SourceFile) {
			for (const e of checker.getExportsOfModule(sym)) { member(`${name}.`, resolveAlias(e)); }
		} else if (decl.kind === SK.InterfaceDeclaration || decl.kind === SK.JSTypeAliasDeclaration ||
			decl.kind === SK.TypeAliasDeclaration) {
			// types only get documented members when exported for users, i.e. from `types.ts`
			if (fromTypes && !DEFAULTS.test(name)) { members(`${name}.`, checker.getDeclaredTypeOfSymbol(sym)); }
		} else if (!hasDescription(decl)) {
			report(decl, name);
		}
	}

	const pages = [
		...config.groups.flatMap(g => g.entries.map(e => (typeof e === 'string' ? e : e.name))),
		...Object.values(config.miniclasses).flat(),
		...Object.values(config.tables).flatMap(Object.values).flat()
	];
	for (const name of pages) {
		const decl = config.pseudo[name] ? exports.get(config.pseudo[name][0])?.decl :
			exports.get(config.headers[name] ?? name)?.decl;
		const doc = decl?.kind === SK.SourceFile ? moduleDoc(decl) : docOf(decl);
		if (decl && !description(doc)) { report(decl, `${name} page intro`); }
	}
	return exports;
}

function checkConfig(exports, sources) {
	const source = [...sources.values()].join('\n');
	const configProblem = (msg) => { problems.set(`config: ${msg}`, `${msg}  build/reference.json`); };
	const exported = name => exports.has(name);
	const entries = config.groups.flatMap(g => g.entries.map(e => (typeof e === 'string' ? e : e.name)));
	const pages = new Set([...entries, ...Object.values(config.miniclasses).flat()]);
	const rows = Object.values(config.tables).flatMap(Object.values).flat();

	for (const name of pages) {
		if (!config.pseudo[name] && !config.headers[name] && !exported(name)) { configProblem(`Page ${name} not exported`); }
	}
	for (const name of [...rows, ...config.unlisted, ...Object.values(config.pseudo).flat(),
		...Object.values(config.headers), ...Object.values(config.members).flatMap(Object.values)]) {
		if (!exported(name)) { configProblem(`${name} not exported`); }
	}
	const keyed = ['miniclasses', 'tables', 'categoryOrder', 'members', 'headers', 'pseudo'];
	for (const key of keyed) {
		for (const name of Object.keys(config[key] ?? {})) {
			if (!pages.has(name)) { configProblem(`${key} key ${name} is not a page`); }
		}
	}
	for (const name of Object.keys(config.display)) {
		if (!pages.has(name) && !exported(name)) { configProblem(`display key ${name} not exported`); }
	}
	for (const [name, page] of Object.entries(config.fold)) {
		if (!new RegExp(`\\bclass ${name}\\b`).test(source)) { configProblem(`fold key ${name} is not a class`); }
		if (!pages.has(page)) { configProblem(`fold value ${page} is not a page`); }
	}

	// by declaration, since a class can be exported under another name (`LeafletMap as Map`)
	const listed = new Set([...pages, ...rows, ...config.unlisted].map(n => exports.get(n)?.decl));
	for (const [name, {decl}] of exports) {
		const doc = decl?.kind === SK.SourceFile ? moduleDoc(decl) : decl?.kind === SK.ClassDeclaration && docOf(decl);
		if (!listed.has(decl) && description(doc)) { configProblem(`Documented ${name} is neither a page nor unlisted`); }
	}

	const categories = new Set();
	for (const [file, text] of sources) {
		for (const m of text.matchAll(CATEGORY_TAG)) {
			const category = m[1].trim();
			categories.add(category);
			// words after the first are lowercase, unless they're names like `DivOverlay` or abbreviations like `URL`
			const [first, ...rest] = category.split(' ');
			if (!CAPITALIZED.test(first) || rest.some(w => CAPITALIZED.test(w) && !exported(w) && !ALL_CAPS.test(w))) {
				const line = text.slice(0, m.index).split('\n').length;
				problems.set(`${file}:${line}`, `Category "${category}" is not in sentence case  ${file}:${line}`);
			}
		}
	}
	for (const [page, order] of Object.entries(config.categoryOrder ?? {})) {
		for (const category of order) {
			if (!categories.has(category)) { configProblem(`categoryOrder of ${page} has unknown category "${category}"`); }
		}
	}
}

function members(prefix, type, skip = () => false) {
	for (const p of checker.getPropertiesOfType(type)) {
		if (p.name.startsWith('_') || p.name === 'prototype' || skip(p.name)) { continue; }
		member(prefix, p);
	}
}

function member(prefix, sym) {
	if (sym.name.startsWith('_')) { return; }
	const decls = declsOf(sym).filter(d => relPath(d.getSourceFile().fileName).startsWith('src/') &&
		!DOCUMENTED_ELSEWHERE.has(`${relPath(d.getSourceFile().fileName)} ${sym.name}`));
	if (decls.length && !decls.some(d => hasDescription(d) || isDeprecated(d))) {
		// named after the class that declares it rather than the first subclass that comes up
		let cls = decls[0];
		while (cls && cls.kind !== SK.ClassDeclaration) { cls = cls.parent; }
		report(decls[0], cls ? cls.name.text + prefix.at(-1) + sym.name : prefix + sym.name);
	}
}

// overrides of a member described on an ancestor class, or on the interfaces merged into one (`Layer#onAdd`)
function inBase(cls, name, instance) {
	for (let c = baseOf(cls); c; c = baseOf(c)) {
		const sym = checker.getSymbolAtLocation(c.name);
		const type = instance ? checker.getDeclaredTypeOfSymbol(sym) : checker.getTypeOfSymbol(sym);
		const p = checker.getPropertyOfType(type, name);
		if (p && declsOf(p).some(hasDescription)) { return true; }
	}
	return false;
}

// one entry per declaration, since inherited members come up under every subclass
function report(decl, label) {
	const sf = decl.getSourceFile();
	const start = decl.pos + sf.text.slice(decl.pos, decl.end).search(NON_SPACE);
	const line = sf.text.slice(0, start).split('\n').length;
	const key = `${sf.fileName}:${start}`;
	if (!problems.has(key)) { problems.set(key, `${label}  ${relPath(sf.fileName)}:${line}`); }
}

function baseOf(cls) {
	const ext = cls.heritageClauses?.find(c => c.token === SK.ExtendsKeyword)?.types[0]?.expression;
	const decl = ext && declOf(resolveAlias(checker.getSymbolAtLocation(ext)));
	return decl?.kind === SK.ClassDeclaration ? decl : null;
}

function resolveAlias(sym) {
	return sym && (sym.flags & 2097152 /* Alias */) ? checker.getAliasedSymbol(sym) : sym;
}

function declsOf(sym) {
	return (sym?.declarations ?? []).map(d => d.resolve?.() ?? d);
}

function declOf(sym) {
	return declsOf(sym)[0];
}

// a variable's JSDoc is on its statement, and that of a `this.x = …` property on its expression statement
function docsOf(decl) {
	let node = decl;
	if (node?.kind === SK.VariableDeclaration) { node = node.parent.parent; }
	if (node?.kind === SK.PropertyAccessExpression || node?.kind === SK.BinaryExpression) {
		while (node && node.kind !== SK.ExpressionStatement) { node = node.parent; }
	}
	return node?.jsDoc ?? [];
}

function docOf(decl) {
	return docsOf(decl).at(-1);
}

function moduleDoc(sf) {
	return sf.statements.flatMap(s => s.jsDoc ?? []).find(d => (d.tags ?? []).some(t => t.tagName?.text === 'module'));
}

function description(doc) {
	const c = doc?.comment;
	return (typeof c === 'string' ? c : getTextOfJSDocComment(c) ?? '').trim();
}

function hasDescription(decl) {
	return docsOf(decl).some(description);
}

function hasTag(decl, name) {
	return docsOf(decl).some(d => (d.tags ?? []).some(t => t.tagName?.text === name));
}

function isDeprecated(decl) {
	return hasTag(decl, 'deprecated');
}
