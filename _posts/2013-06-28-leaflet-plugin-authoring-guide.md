---
layout: post
title: Leaflet Plugin Authoring Guide
description: A number of best practices and tips for publishing your own perfect Leaflet plugin
author: Vladimir Agafonkin
authorsite: http://agafonkin.com/en
---

One of the greatest things about Leaflet is its powerful plugin ecosystem.
The [Leaflet plugins page](http://leafletjs.com/plugins.html) lists dozens of awesome plugins, and more are being added every week.

This guide lists a number of best practices for publishing a Leaflet plugin that meets the quality standards of Leaflet itself. Also available [in the repo](https://github.com/Leaflet/Leaflet/blob/master/PLUGIN-GUIDE.md).

### Presentation

#### Repository

The best place to put your Leaflet plugin to is a separate [GitHub](http://github.com) repository.
If you create a collection of plugins for different uses,
don't put them in one repo &mdash;
it's usually easier to work with small, self-contained plugins in individual repositories.

#### Demo

The most essential thing to do when publishing a plugin is to include a demo that showcases what the plugin does &mdash;
it's usually the first thing people will look for.

The easiest way to put up a demo is using [GitHub Pages](http://pages.github.com/).
A good [starting point](https://help.github.com/articles/creating-project-pages-manually) is creating a `gh-pages` branch in your repo and adding an `index.html` page to it  &mdash;
after pushing, it'll be published as `http://<user>.github.io/<repo>`.

#### Readme

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

#### License

Every open source repository should include a license.
If you don't know what open source license to choose for your code,
[MIT License](http://opensource.org/licenses/MIT) and [BSD 2-Clause License](http://opensource.org/licenses/BSD-2-Clause) are both good choices.
You can either put it in the repo as a `LICENSE` file or just link to the license from the Readme.

### Code

#### File Structure

Keep the file structure clean and simple,
don't pile up lots of files in one place  &mdash;
make it easy for a new person to find their way in your repo.

A barebones repo for a simple plugin would look like this:

	my-plugin.js
	README.md

An example of a file structure for a more sophisticated plugin:

	/src        JS source files
	/dist       minified plugin JS, CSS, images
	/spec       test files
	/examples   HTML examples of plugin usage
	README.md
	LICENSE
	package.json

#### Code Conventions

Everyone's tastes are different, but it's important to be consistent with whatever conventions you choose for your plugin.

For a good starting point, check out [Airbnb JavaScript Guide](https://github.com/airbnb/javascript).
Leaflet follows pretty much the same conventions
except for using smart tabs (hard tabs for indentation, spaces for alignment)
and putting a space after the `function` keyword.

#### Plugin API

Never expose global variables in your plugin.<br>
If you have a new class, put it directly in the `L` namespace (`L.MyPlugin`).<br>
If you inherit one of the existing classes, make it a sub-property (`L.TileLayer.Banana`).<br>
If you want to add new methods to existing Leaflet classes, you can do it like this: `L.Marker.include({myPlugin: …})`.

Function, method and property names should be in `camelCase`.<br>
Class names should be in `CapitalizedCamelCase`.

If you have a lot of arguments in your function, consider accepting an options object instead (putting default values where possible so that users don't need specify all of them):

	// bad
	marker.myPlugin('bla', 'foo', null, {}, 5, 0);

	// good
	marker.myPlugin('bla', {
		optionOne: 'foo',
		optionThree: 5
	});

And most importantly, keep it simple. Leaflet is all about *simplicity*.

Cheers,<br>
Vladimir.
