# Leaflet plugin authoring guide

One of the greatest things about Leaflet is its plugin ecosystem. The
[Leaflet plugins page](https://leafletjs.com/plugins.html) lists hundreds of plugins, and more are added every week.

This guide lists best practices for publishing a Leaflet plugin that meets the quality standards of Leaflet itself.

1. [Presentation](#presentation)
	- [Repository](#repository)
	- [Name](#name)
	- [Demo](#demo)
	- [Readme](#readme)
	- [License](#license)
2. [Code](#code)
	- [File structure](#file-structure)
	- [Code conventions](#code-conventions)
	- [Plugin API](#plugin-api)
	- [Adding to Leaflet classes](#adding-to-leaflet-classes)
	- [Script tags and the global build](#script-tags-and-the-global-build)
	- [Supporting Leaflet 1.x](#supporting-leaflet-1x)
3. [Accessibility](#accessibility)
4. [Publishing on npm](#publishing-on-npm)
5. [Adding to the plugins list](#adding-to-the-plugins-list)

## Presentation

### Repository

The best place for a Leaflet plugin is its own [GitHub](https://github.com) repository. If you write several plugins
for different uses, don't put them in one repo: small, self-contained plugins in separate repositories are easier to
work with.

### Name

Most plugins and their repos are named like `leaflet-my-plugin-name`. Whatever name you pick, include the word
"Leaflet" so that it's obvious it's a Leaflet plugin.

### Demo

The most important thing to publish with a plugin is a demo that shows what it does. It's usually the first thing
people look for.

The easiest way to host a demo is [GitHub Pages](https://pages.github.com/). Add an `index.html` page to your repo
and [publish it from a branch or folder](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site),
and it'll be available at `https://<user>.github.io/<repo>`.

### Readme

Next, write a [good `README.md`](https://github.com/noffle/art-of-readme) in the root of the repo, or link to a
website with similar content. At a minimum, it should have:

- the name of the plugin
- a short description of what it does
- requirements:
	- the Leaflet versions it supports
	- other dependencies, if any
	- browser and device support
- links to demos
- how to install and load the plugin
- a simple usage example
- an API reference (methods, options, events)

### License

Every open source repository should have a license. If you don't know which one to choose,
the [MIT License](https://opensource.org/licenses/MIT) and the
[BSD 2-Clause License](https://opensource.org/licenses/BSD-2-Clause) are both good choices. Put it in the repo as a
`LICENSE` file, or link to it from the readme.

## Code

### File structure

Keep the file structure simple, so that someone new can find their way around your repo. A minimal plugin needs only
this:

```
leaflet-my-plugin.js
README.md
```

A larger plugin might look like this:

```
/src        - JS source files
/dist       - built JS and CSS
/test       - tests
/demo       - HTML examples of plugin usage
README.md
LICENSE
package.json
```

### Code conventions

Everyone's tastes differ, but be consistent with whatever conventions you choose.

Write your plugin as an ES module using modern JavaScript (classes, `const`/`let`, arrow functions). Leaflet itself
uses tabs for indentation and [ESLint](https://eslint.org/) to keep its code consistent.

### Plugin API

- Import what you need from Leaflet with named imports (`import {Marker, Util} from 'leaflet'`), and use named exports
  in your plugin too, so that it can be imported as `import {MyLayer} from 'leaflet-my-plugin'`.
- Export your classes, whether they extend a Leaflet class or not, so that users can create and subclass them.
- Don't set global variables from your module. A separate script build can add your classes to `L` (see
  [below](#script-tags-and-the-global-build)).
- Name functions, methods and properties in `camelCase`, and classes in `PascalCase`. Users create objects with
  `new`, so don't add lowercase factory functions.
- Leaflet ships its own types. Ship types for your plugin too, and declare anything you add to Leaflet classes as
  described in [the migration guide](MIGRATION.md#14-types-for-plugins).

If a function takes many arguments, accept an options object instead, with defaults for everything that can have
one:

```js
// bad
marker.myPlugin('bla', 'foo', null, {}, 5, 0);

// good
marker.myPlugin('bla', {
	optionOne: 'foo',
	optionThree: 5
});
```

And most importantly, keep it simple. Leaflet is all about *simplicity*.

### Adding to Leaflet classes

Add methods to a Leaflet class with `include()`: `Marker.include({myMethod() {…}})`.

Plugins often also need something per instance, like an editor on every polyline or a new marker option. An
`addInitHook` works, but it runs for every instance whether or not your plugin is used on it, and it misses instances
created before your plugin loaded. Two patterns are often simpler.

**A lazy getter** for a per-instance helper. It's created on first access, costs nothing for layers that never use
it, and works on layers created before your plugin was imported:

```js
import {Polyline} from 'leaflet';

const editors = new WeakMap();

Object.defineProperty(Polyline.prototype, 'editor', {
	configurable: true,
	get() {
		let editor = editors.get(this);
		if (!editor) {
			editor = new PolylineEditor(this);
			editors.set(this, editor);
		}
		return editor;
	}
});
```

**A default for a new option**, either read with a fallback where you use it, or added once to the class defaults,
instead of filled into `this.options` by a hook:

```js
const angle = marker.options.rotationAngle ?? 0;

// or
Marker.mergeOptions({rotationAngle: 0});
```

A module that changes Leaflet classes when imported, with `include()`, `mergeOptions()`, `addInitHook()` or a
prototype getter, has side effects. List it in [`sideEffects`](#publishing-on-npm), or a bundler may drop the import.

### Script tags and the global build

Your plugin's module imports from `'leaflet'`. That works with a bundler, and in a page that loads Leaflet as a
module through an import map:

```html
<script type="importmap">
	{
		"imports": {
			"leaflet": "https://cdn.jsdelivr.net/npm/leaflet@2.0.0-beta.2/dist/leaflet.js",
			"leaflet-my-plugin": "https://cdn.jsdelivr.net/npm/leaflet-my-plugin@1.0.0/dist/leaflet-my-plugin.js"
		}
	}
</script>
<script type="module">
	import {LeafletMap} from 'leaflet';
	import {MyLayer} from 'leaflet-my-plugin';
</script>
```

Pages that use the global `L` from Leaflet's `leaflet-global.js` (or 1.x's `leaflet.js`) can't import modules. For
them, publish a script build next to the module: an entry file that adds your classes to `L`, bundled as an IIFE with
`leaflet` mapped to the global `L`.

```js
// build/global.js
import {MyLayer} from '../src/MyLayer.js';

window.L.MyLayer = MyLayer;
```

```js
// rolldown.config.js (Rollup takes the same options)
export default [
	{input: './src/MyLayer.js', external: ['leaflet'], output: {file: './dist/leaflet-my-plugin.js'}},
	{
		input: './build/global.js',
		external: ['leaflet'],
		output: {file: './dist/leaflet-my-plugin-global.js', format: 'iife', globals: {leaflet: 'L'}}
	}
];
```

The script build works after either version's global script. Don't mix the two kinds in one page: a plugin module
that imports `leaflet` next to `leaflet-global.js` loads a second copy of Leaflet, and checks like `instanceof LatLng`
fail between the two. [Leaflet.heat's build](https://github.com/Leaflet/Leaflet.heat/tree/main/build) is a complete
setup, including a 1.x-style `L.heatLayer` factory added only when the page runs 1.x.

### Supporting Leaflet 1.x

A plugin can support Leaflet 1.9 and 2.0 from one release. [The migration guide](MIGRATION.md) shows what changed
and how to [support both versions](MIGRATION.md#11-support-1x-and-20-from-one-release). To test against both,
install 1.x under an alias next to 2.0: `"leaflet-v1": "npm:leaflet@^1.9.4"` in `devDependencies`.

[Leaflet.heat](https://github.com/Leaflet/Leaflet.heat) (a single layer class) and
[Leaflet.markercluster](https://github.com/Leaflet/Leaflet.markercluster) (a large plugin that adds methods to
`Marker` and lets apps subclass its group) both work this way, with module and script builds, types, and tests on
both versions. Use them as examples.

## Accessibility

Make sure your plugin is accessible to everyone. Some people navigate only with a keyboard, and some rely on a screen
reader to convey visual information. Make your controls work with the keyboard, and give non-text content (such as
icon fonts and images) a text alternative, or hide it from screen readers if it's purely decorative.

### Automated testing

These tools find common accessibility issues:

- [Lighthouse](https://developer.chrome.com/docs/lighthouse/)
- [axe](https://www.deque.com/axe/)
- [WAVE](https://wave.webaim.org/)
- [Accessibility Insights](https://accessibilityinsights.io/)
- [webhint](https://webhint.io/)

### Manual testing

Test your plugin with only the keyboard, and with a screen reader such as Narrator, NVDA, VoiceOver or JAWS.

### Learn about web accessibility

Beginner-friendly documentation:

- [What is accessibility?](https://web.dev/what-is-accessibility/)
- [Make your site keyboard accessible](https://web.dev/accessible/#make-your-site-keyboard-accessible)
- [Understand semantics and basic screen reader support](https://web.dev/accessible/#understand-semantics-and-basic-screen-reader-support)
- More guides at [MDN web docs: Accessibility](https://developer.mozilla.org/en-US/docs/Learn/Accessibility)

Authoritative documentation:

- [WAI (Web Accessibility Initiative): Accessibility Fundamentals Overview](https://www.w3.org/WAI/fundamentals/)
- [ARIA in HTML (Accessible Rich Internet Applications)](https://www.w3.org/TR/html-aria/)
- [WAI-ARIA Authoring Practices](https://www.w3.org/TR/wai-aria-practices/)
- [Using ARIA](https://www.w3.org/TR/using-aria/)
- [WCAG (Web Content Accessibility Guidelines)](https://www.w3.org/TR/WCAG/)

## Publishing on npm

Publish your plugin on [npm](https://www.npmjs.com/), so that people can install it along with its dependencies.
npm's [guide for package authors](https://docs.npmjs.com/using-npm/developers.html) walks you through it.

List `leaflet` in `peerDependencies`, not `dependencies`, so that your plugin uses the same copy of Leaflet as the
app. With a separate copy, checks like `instanceof LatLng` fail between the two.

While 2.0 is in beta, use `^2.0.0-beta.1` as the range: a plain `^2.0.0` doesn't match prereleases, so npm refuses to
install the plugin next to a beta. A plugin that supports both versions declares `^1.9.0 || ^2.0.0-beta.1`.

Set `"sideEffects": false` if importing your module changes nothing, so that bundlers can drop it when it's unused. If
some files do change things (they call `include()` or `mergeOptions()` on Leaflet classes, or are stylesheets), list
those instead: `"sideEffects": ["./src/MarkerPatches.js", "*.css"]`.

Here is an example `package.json` for a Leaflet plugin:

```json
{
  "name": "leaflet-my-plugin",
  "version": "1.0.0",
  "description": "A simple Leaflet plugin.",
  "type": "module",
  "exports": "./src/MyLayer.js",
  "files": ["src", "dist"],
  "sideEffects": false,
  "author": "You",
  "license": "MIT",
  "scripts": {
    "build": "rolldown --config",
    "prepublishOnly": "npm run build"
  },
  "peerDependencies": {
    "leaflet": "^2.0.0-beta.1"
  }
}
```

Don't commit built files (such as `dist`) to the repo: it's easy to end up debugging the wrong file. Build them just
before publishing with a [`prepublishOnly` script](https://docs.npmjs.com/cli/using-npm/scripts#life-cycle-scripts) as
above, keep them out of the repo with [`.gitignore`](https://docs.github.com/en/get-started/git-basics/ignoring-files),
and list what gets published in the [`files` field](https://docs.npmjs.com/cli/configuring-npm/package-json#files).

## Adding to the plugins list

Once your plugin is published, add it to the [Leaflet plugins list](https://leafletjs.com/plugins.html):

1. [Fork](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo)
   the Leaflet repo.
2. Copy `docs/_plugins/template.md` into the category folder under `docs/_plugins/` that fits your plugin (the folder
   decides where it's listed), and fill in the information and links. If the plugin works with Leaflet 2, set
   `compatible-v2: true`.
3. Commit the file to your fork and
   [open a pull request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request)
   to Leaflet's repo.

A maintainer will have a quick look at your plugin, and if everything looks right, it'll appear in the list shortly
after. The list shows the stars and last commit date of each plugin's GitHub or GitLab repository, and sorts plugins
by stars.
