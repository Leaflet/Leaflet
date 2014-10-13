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
3. [Module Loaders](#module-loaders)
	- [Wrapping with UMD](#wrapping-with-umd)
	- [Using with RequireJS](#using-with-requirejs)
	- [Using with Browserify](#using-with-browserify)
	- [Best practices for RequireJS](#best-practices-for-requirejs)
	- [Best practices for Browserify](#best-practices-for-browserify)
	- [Module Loader Resources](#module-loader-resources)

## Presentation

### Repository

The best place to put your Leaflet plugin to is a separate [GitHub](http://github.com) repository.
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

The next thing you need to have is a descriptive `README.md` in the root of the repo (or a link to a website with a similar content).
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
If you want to add new methods to existing Leaflet classes, you can do it like this: `L.Marker.include({myPlugin: …})`.

Function, method and property names should be in `camelCase`.<br>
Class names should be in `CapitalizedCamelCase`.

If you have a lot of arguments in your function, consider accepting an options object instead
(putting default values where possible so that users don't need specify all of them):

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

## Module Loaders

Module loaders such as [RequireJS](http://requirejs.org/) and [Browserify](http://browserify.org/) impliment module systems like AMD (Asyncronous Module Definition) and CommonJS to allow developers to modularize and load their code.

Leaflet supports being loaded as either an AMD module or a CommonJS module. It does this by implimenting UMD (Universal Module Definition) which checks for the existance of an AMD/CommonJS and impliments the appropriate wrappers.

### Wrapping with UMD

You can add support for AMD/CommonJS loaders to your Leaflet plugin by follwoing this pattern.

```js
(function (factory, window) {

    // define an AMD module that relies on 'leaflet'
    if (typeof define === 'function' && define.amd) {
        define(['leaflet'], function (L) {
            return (exports = factory(L));
        });
    
    // define a Common JS module that relies on 'leaflet'
    } else if (typeof exports === 'object') {
        module.exports = factory(require('leaflet'));
    
    }

    // attach your plugin to the global 'L' variable
    window.L.YourPlugin = factory(L);

}(function (L) {
    // impliment your plguin
    var MyLeafletPlugin = {};

    MyLeafeltPlugin.CustomLayer = L.Layer.extend({
        onAdd: function(map){

        },
        onRemove: function(){

        }
    });

    // return your plugin when you are done
    return MyLeafletPlugin;
}, window));
```

### Using with RequireJS

Now users using RequireJS (which impliments the AMD module system) can use your plugin like this.

```js
// define where the 'leaflet' and 'your-plugin' modules are located
require.config({
    paths: {
        'leaflet': 'the/path/to/leaflet', //path to leaflet.js without the .js
        'your-plugin': 'the/path/to/your-plugin', //path to your-plguin.js without the .js
    }
});

require([
    'leaflet',
    'your-plugin'
], function(L, YourPlugin) {
    var map = new L.map('map').setView([45.5, -122.75], 9);
    var layer = new YourPlugin.CustomLayer().addTo(map);
});
```

### Using with Browserify

Users who are using Browserify (which impliments the CommonJS module system) can use your plugins following this example.

```js
var L = require('leaflet');
var YourPlugin = require('your-plugin');

var map = new L.map('map').setView([45.5, -122.75], 9);
var layer = new YourPlugin.CustomLayer().addTo(map);
```

### Best practices for RequireJS

Most AMD based module systesm (RequireJS, Dojo, ect...) have a mechanisum to name modules so they can be easily included with short strings rather then paths. In order to avoid confusion with many short names like `Leaflet` vs `leaflet` always use a lowercase `leaflet` for your module identifier.

### Best practices for Browserify

CommonJS module systems like Browserify rely on the [NPM (Node Package Modules)](https://www.npmjs.org/) registry to manage their dependencies. The means that when you `require('leaflet')` the proper module from the registry is returned to you.

This means that you must publish your plugin to the NPM repository. NPM has an excellent [developers guide](https://www.npmjs.org/doc/misc/npm-developers.html) to help you through the process.

When you publish your plugin you should add a depenency on `leaflet` to your `package.json` file. This will automatically install Leaflet when your package is installed.

```json
{
  "name": "my-leaflet-plugin",
  "version": "1.0.0",
  "description": "A simple leaflet plugin.",
  "main": "my-plugin.js",
  "author": "You",
  "license": "IST",
  "dependencies": {
    "leaflet": "^1.0.0"
  }
}
```

### Resources

* [Get started with RequireJS](http://requirejs.org/docs/start.html#add)
* [Get started Browserify](https://github.com/substack/browserify-handbook)
* [Publishing on NPM](https://www.npmjs.org/doc/misc/npm-developers.html)