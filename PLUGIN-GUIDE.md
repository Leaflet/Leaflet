# Leaflet Plugin Authoring Guide

One of the greatest things about Leaflet is its powerful plugin ecosystem.
The [Leaflet plugins page](http://leafletjs.com/plugins.html) lists dozens of awesome plugins, and more are being added every week.

This guide lists a number of best practices for publishing a Leaflet plugin that meets the quality standards of Leaflet itself.

1. [Presentation](#presentation)
	- [Repository](#repository)
	- [Name](#name)
	- [Demo](#demo)
	- [Readme](#readme)
	- [License](#license)
2. [Code](#code)
	- [File Structure](#file-structure)
	- [Code Conventions](#code-conventions)
	- [Plugin API](#plugin-api)
3. [Publishing on NPM](#publishing-on-npm)
4. [Module Loaders](#module-loaders)
5. [Adding to the plugins list](#adding-to-the-plugins-list)

## Presentation

### Repository

The best place to put your Leaflet plugin is a separate [GitHub](http://github.com) repository.
If you create a collection of plugins for different uses,
don't put them in one repo &mdash;
it's usually easier to work with small, self-contained plugins in individual repositories.

### Name

Most existing plugins follow the convention of naming plugins (and repos) like this: `Leaflet.MyPluginName`.
You can use other forms (e.g. "leaflet-my-plugin-name"),
just make sure to include the word "Leaflet" in the name so that it's obvious that it's a Leaflet plugin.

### Demo

The most essential thing to do when publishing a plugin is to include a demo that showcases what the plugin does &mdash;
it's usually the first thing people will look for.

The easiest way to put up a demo is using [GitHub Pages](http://pages.github.com/).
A good [starting point](https://help.github.com/articles/creating-project-pages-manually) is creating a `gh-pages` branch in your repo and adding an `index.html` page to it  &mdash;
after pushing, it'll be published as `http://<user>.github.io/<repo>`.

### Readme

The next thing you need to have is a [good `README.md`](https://github.com/noffle/art-of-readme) in the root of the repo (or a link to a website with a similar content).
At a minimum it should contain the following items:

- name of the plugin
- a simple, concise description of what it does
- requirements
	- Leaflet version
	- other external dependencies (if any)
	- browser / device compatibility
- links to demos
- instructions for including the plugin
- simple usage code example
- API reference (methods, options, events)

### License

Every open source repository should include a license.
If you don't know what open source license to choose for your code,
[MIT License](http://opensource.org/licenses/MIT) and [BSD 2-Clause License](http://opensource.org/licenses/BSD-2-Clause) are both good choices.
You can either put it in the repo as a `LICENSE` file or just link to the license from the Readme.

## Code

### File Structure

Keep the file structure clean and simple,
don't pile up lots of files in one place  &mdash;
make it easy for a new person to find their way in your repo.

A barebones repo for a simple plugin would look like this:

```
my-plugin.js
README.md
```

An example of a more sophisticated plugin file structure:

```
/src        - JS source files
/dist       - minified plugin JS, CSS, images
/spec       - test files
/lib        - any external libraries/plugins if necessary
/examples   - HTML examples of plugin usage
README.md
LICENSE
package.json
```

### Code Conventions

Everyone's tastes are different, but it's important to be consistent with whatever conventions you choose for your plugin.

For a good starting point, check out [Airbnb JavaScript Guide](https://github.com/airbnb/javascript).
Leaflet follows pretty much the same conventions
except for using smart tabs (hard tabs for indentation, spaces for alignment)
and putting a space after the `function` keyword.

### Plugin API

Never expose global variables in your plugin.<br>
If you have a new class, put it directly in the `L` namespace (`L.MyPlugin`).<br>
If you inherit one of the existing classes, make it a sub-property (`L.TileLayer.Banana`).<br>
Every class should have a factory function in camelCase, e.g. (`L.tileLayer.banana`).<br>
If you want to add new methods to existing Leaflet classes, you can do it like this: `L.Marker.include({myPlugin: …})`.

Function, method, property and factory names should be in `camelCase`.<br>
Class names should be in `CapitalizedCamelCase`.

If you have a lot of arguments in your function, consider accepting an options object instead
(putting default values where possible so that users don't need to specify all of them):

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

## Publishing on NPM

NPM (Node Packaged Modules) is a package manager and code repository for JavaScript. Publishing your module on NPM allows other developers to quickly find and install your plugin as well as any other plugins it depends on.

NPM has an excellent [developers guide](https://www.npmjs.org/doc/misc/npm-developers.html) to help you through the process.

When you publish your plugin you should add a dependency on `leaflet` to your `package.json` file. This will automatically install Leaflet when your package is installed.

Here is an example of a `package.json` file for a Leaflet plugin.

```json
{
  "name": "my-leaflet-plugin",
  "version": "1.0.0",
  "description": "A simple leaflet plugin.",
  "main": "my-plugin.js",
  "author": "You",
  "license": "IST",
  "peerDependencies": {
    "leaflet": "^1.0.0"
  }
}
```

If possible, do not commit your minified files (e.g. `dist`) to a repo; this can
lead to confussion when trying to debug the wrong file. Instead, use `npm` to
trigger a build/minification just before publishing your package with a
[`prepublish` script](https://docs.npmjs.com/misc/scripts#common-uses), for example:

```json
{
  "name": "my-leaflet-plugin",
  ...
  "scripts": {
    "prepublish": "grunt build"
  }
}
```

You can then use the [`.gitignore`](https://help.github.com/articles/ignoring-files/)
file to make sure the minified files are not versioned, and an
[empty `.npmignore`](https://docs.npmjs.com/misc/developers#keeping-files-out-of-your-package)
to ensure that they are published to NPM.

## Module Loaders

Module loaders such as [RequireJS](http://requirejs.org/) and [Browserify](http://browserify.org/) implement module systems like AMD (Asynchronous Module Definition) and CommonJS to allow developers to modularize and load their code.

You can add support for AMD/CommonJS loaders to your Leaflet plugin by following this pattern based on the [Universal Module  Definition](https://github.com/umdjs/umd/blob/master/templates/returnExportsGlobal.js)

```js
(function (factory, window) {

    // define an AMD module that relies on 'leaflet'
    if (typeof define === 'function' && define.amd) {
        define(['leaflet'], factory);

    // define a Common JS module that relies on 'leaflet'
    } else if (typeof exports === 'object') {
        module.exports = factory(require('leaflet'));
    }

    // attach your plugin to the global 'L' variable
    if (typeof window !== 'undefined' && window.L) {
        window.L.YourPlugin = factory(L);
    }
}(function (L) {
    var MyLeafletPlugin = {};
    // implement your plugin

    // return your plugin when you are done
    return MyLeafletPlugin;
}, window));
```

Now your plugin is available as an AMD and CommonJS module and can be used in module loaders like Browserify and RequireJS.


## Adding to the plugins list

Once your plugin is published, it is a good idea to add it to the [Leaflet plugins list](http://leafletjs.com/plugins.html). To do so:

* [Fork](https://help.github.com/articles/fork-a-repo/) the Leaflet repo.
* In the `docs/plugins.md` file, find the section your plugin should go in, and add a table row with information and links about your plugin.
* Commit the code to your fork.
* [Open a pull request](https://help.github.com/articles/creating-a-pull-request/) from your fork to Leaflet's original repo.

Once the pull request is done, a Leaflet maintainer will have a quick look at your
plugin and, if everything looks right, your plugin will appear in the list shortly thereafter.
