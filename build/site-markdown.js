// Markdown rendered the way kramdown (Jekyll's converter, with GitHub Pages' settings) renders it, for the subset the
// site uses: GitHub-style header ids, raw HTML blocks, smart typography outside them, code left to highlight.js on
// the client, and block attribute lists ({: .class} or {:#id} on a line of its own, applying to the next block).

import {Marked} from 'marked';
import {smartypants} from 'smartypants';

// kramdown treats a tag at line start as an HTML block unless it's one of these
const SPAN_TAGS = new Set(['a', 'abbr', 'acronym', 'b', 'big', 'bdo', 'br', 'button', 'cite', 'code', 'del', 'dfn', 'em',
	'i', 'img', 'input', 'ins', 'kbd', 'label', 'mark', 'option', 'q', 'rb', 'rbc', 'rp', 'rt', 'rtc', 'ruby', 'samp',
	'select', 'small', 'span', 'strong', 'sub', 'sup', 'tt', 'u', 'var']);
const VOID_TAGS = new Set(['area', 'base', 'col', 'embed', 'hr', 'link', 'meta', 'param', 'source', 'track', 'wbr']);

const TAG_LINE_START = /^ {0,3}<([a-z][a-z0-9]*)/gim;
const OPEN_TAG = /^ {0,3}<([a-z][a-z0-9]*)\b[^>]*>/i;
const ANY_TAG_START = /^ {0,3}<\/?[a-z]/i;
const TRAILING_NEWLINES = /\n+$/;
const BARE_AMP = /&(?!#?\w+;)/g;
const IAL_LINE = /^\{:\s*([^}]*)\}[ \t]*$/gm;
const IAL_TARGET = /<!--ial ([^>]*)-->\n<(\w+)([^>]*)>/g;
const IAL_ID = /#([\w-]+)/;
const IAL_CLASS = /\.([\w-]+)/g;
const ID_ATTR = / id="[^"]*"/;
const RAW_BLOCK = /\0(\d+)\0/g;
const HTML_TAG = /<[^>]*>/g;
const NON_ID_CHAR = /[^\p{L}\p{N}\p{M}_\- ]/gu;

// per-document state of the renderer
let headerIds, rawBlocks;

const escapeCode = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const headerId = text => text.toLowerCase().replace(HTML_TAG, '').replace(NON_ID_CHAR, '').replace(/ /g, '-');

const marked = new Marked({
	extensions: [{
		// kramdown keeps an HTML block raw up to its matching closing tag, where CommonMark would end it at the first
		// blank line and parse the rest (often tab-indented, so as code)
		name: 'htmlBlock',
		level: 'block',
		start(src) {
			for (const m of src.matchAll(TAG_LINE_START)) {
				if (!SPAN_TAGS.has(m[1].toLowerCase())) { return m.index; }
			}
			return undefined;
		},
		tokenizer(src) {
			const [open, tag] = src.match(OPEN_TAG) ?? [];
			if (!tag || SPAN_TAGS.has(tag.toLowerCase())) { return undefined; }
			let end = open.length;
			if (!VOID_TAGS.has(tag.toLowerCase()) && !open.endsWith('/>')) {
				const re = new RegExp(`<(/?)${tag}\\b[^>]*>`, 'gi');
				let depth = 0;
				for (let m; (m = re.exec(src));) {
					depth += m[1] ? -1 : 1;
					if (depth === 0) { break; }
				}
				if (depth !== 0) { return undefined; }
				end = re.lastIndex;
			}
			const lineEnd = src.indexOf('\n', end);
			const raw = src.slice(0, lineEnd === -1 ? src.length : lineEnd + 1);
			return {type: 'html', block: true, raw, text: raw};
		}
	}],
	tokenizer: {
		// span tags on a line of their own (<br>, <img>) are paragraph content in kramdown
		html(src) {
			return ANY_TAG_START.test(src) ? undefined : false;
		},
		// no bare URL autolinks in kramdown
		url() {
			return undefined;
		}
	},
	renderer: {
		heading({tokens, depth, text}) {
			let id = headerId(text);
			const n = headerIds.get(id) ?? 0;
			headerIds.set(id, n + 1);
			if (n) { id += `-${n}`; }
			return `<h${depth} id="${id}">${this.parser.parseInline(tokens)}</h${depth}>\n`;
		},
		code({text, lang}) {
			const cls = lang ? ` class="language-${lang}"` : '';
			return `<pre><code${cls}>${escapeCode(text.replace(TRAILING_NEWLINES, ''))}\n</code></pre>\n`;
		},
		codespan({text}) {
			return `<code>${escapeCode(text)}</code>`;
		},
		// quotes stay as typed for smartypants, and entities as typed (kramdown's entity_output: as_input)
		text(token) {
			if (token.tokens) { return this.parser.parseInline(token.tokens); }
			return token.text.replace(BARE_AMP, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
		},
		// raw HTML blocks are kept out of the typography pass, as kramdown doesn't touch them
		html({text, block}) {
			return block ? `\0${rawBlocks.push(text) - 1}\0` : text;
		},
		image({href, title, text}) {
			return `<img src="${href}" alt="${text}"${title ? ` title="${title}"` : ''} />`;
		},
		br() {
			return '<br />';
		},
		hr() {
			return '<hr />\n';
		}
	}
});

export function renderMarkdown(src) {
	headerIds = new Map();
	rawBlocks = [];
	const html = smartypants(marked.parse(src.replace(IAL_LINE, '<!--ial $1-->')), 2)
		.replace(RAW_BLOCK, (_, i) => rawBlocks[i]);

	return html.replace(IAL_TARGET, (_, ial, tag, attrs) => {
		const id = ial.match(IAL_ID)?.[1];
		const classes = Array.from(ial.matchAll(IAL_CLASS), m => m[1]);
		if (id) { attrs = attrs.replace(ID_ATTR, ''); }
		return `<${tag}${id ? ` id="${id}"` : ''}${classes.length ? ` class="${classes.join(' ')}"` : ''}${attrs}>`;
	});
}
