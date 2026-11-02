Contributing to Leaflet
=======================

 1. [Getting Involved](#getting-involved)
 2. [Reporting Bugs](#reporting-bugs)
 3. [Contributing Code](#contributing-code)
 4. [Running the Tests](#running-the-tests)
 5. [Improving Documentation](#improving-documentation)
 6. [Releasing](#releasing)
 7. [Code of Conduct](#code-of-conduct)
 8. [Thank You](#thank-you)

## Getting Involved

Third-party patches are absolutely essential in our quest to create the best mapping library that will ever exist.
However, they're not the only way to get involved with Leaflet development.
You can help the project tremendously by discovering and [reporting bugs](#reporting-bugs);
[improving documentation](#improving-documentation);
helping others in [GitHub Discussions](https://github.com/Leaflet/Leaflet/discussions),
[GIS Stack Exchange](https://gis.stackexchange.com/questions/tagged/leaflet)
and [GitHub issues](https://github.com/Leaflet/Leaflet/issues);
following Leaflet on [Mastodon](https://mapstodon.space/@leaflet) or [X](https://x.com/LeafletJS);
and spreading the word about Leaflet among your colleagues and friends.

## Reporting Bugs

Before reporting a bug on the project's [issues page](https://github.com/Leaflet/Leaflet/issues),
first make sure that your issue is caused by Leaflet, not your application code
(e.g. passing incorrect arguments to methods, etc.).
Second, search the already reported issues for similar cases,
and if it's already reported, just add any additional details in the comments.

After you've made sure that you've found a new Leaflet bug,
here are some tips for creating a helpful report that will make fixing it much easier and quicker:

 * Write a **descriptive, specific title**. Bad: *Problem with polylines*. Good: *Doing X in Safari 18 causes Z*.
 * Include **browser, OS and Leaflet version** info in the description.
 * Create a **simple test case** that demonstrates the bug (e.g. using the [Leaflet playground](https://leafletjs.com/edit.html)).
 * Check whether the bug can be reproduced in **other browsers**.
 * Check if the bug occurs in the stable version, main, or both.
 * *Bonus tip:* if the bug only appears in the main version but the stable version is fine,
   use `git bisect` to find the exact commit that introduced the bug.

If you just want some help with your project,
try asking in [GitHub Discussions](https://github.com/Leaflet/Leaflet/discussions)
or on [GIS Stack Exchange](https://gis.stackexchange.com/questions/tagged/leaflet) instead.

## Contributing Code

### Considerations for Accepting Patches

While we happily accept patches, we're also committed to keeping Leaflet simple, lightweight and blazingly fast.
So bugfixes, performance optimizations and small improvements that don't add a lot of code
are much more likely to get accepted quickly.

Before sending a pull request with a new feature, check if it's been discussed before already
on [GitHub issues](https://github.com/Leaflet/Leaflet/issues)
and ask yourself two questions:

 1. Are you sure that this new feature is important enough to justify its presence in the Leaflet core?
    Or will it look better as a plugin in a separate repository?
 2. Is it written in a simple, concise way that doesn't add bulk to the codebase?

If your feature or API improvement did get merged into main,
please consider submitting another pull request with the corresponding [documentation update](#improving-documentation).

### Setting up the Build System

The Leaflet build system uses [NodeJS](https://nodejs.org/).
To set up the Leaflet build system, install [NodeJS](https://nodejs.org/).
Then run the following command in the project root to install dependencies:

```
npm install
```

### Making Changes to Leaflet Source

If you're not yet familiar with the way GitHub works (forking, pull requests, etc.),
be sure to check out the awesome [article about forking](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo)
on the GitHub Help website &mdash; it will get you started quickly.

You should always write each batch of changes (feature, bugfix, etc.) in **its own topic branch**.
Please do not commit to the `main` branch of your fork — otherwise your unrelated changes will go into the same pull request.

You should also follow the code style and whitespace conventions of the original codebase.
In particular, use tabs for indentation and spaces for alignment.

Before committing your changes, run `npm run lint` to catch any JS errors in the code and fix them,
and `npm run typecheck` to check the types.
ESLint also runs on the staged files while committing.
You can skip it with the git flag `--no-verify`: `git commit -m "WIP" --no-verify`.

Also, please make sure that you have [line endings configured properly](https://docs.github.com/en/get-started/git-basics/configuring-git-to-handle-line-endings) in Git! Otherwise the diff will show that all lines of a file were changed even if you touched only one.

Happy coding!

### Building Leaflet

The source JavaScript code for Leaflet is a few dozen files, in the `src/` directory.
But normally, Leaflet is loaded in a web browser as just one JavaScript file.

In order to create this file, run `npm run build`.

You'll find `dist/leaflet.js`, a minified ES module, and `dist/leaflet-global.js`,
a minified script that defines the global `L`, each with a source map that includes
the original sources. The npm package points bundlers at `src/` directly, so they
can drop the parts of Leaflet an app doesn't use.

When developing (or bugfixing) core Leaflet functionalities, it's common to use
the webpages in the `debug/` directory, and run the tests
in a graphical browser. The debug pages load `src/` directly, so changes
show up on reload without a build.

## Running the Tests

Tests run in real browsers via [Vitest](https://vitest.dev/) browser mode (Playwright provider), against the sources in `src/`, so no build is needed.

```
npm test
```

Runs the suite once in headless Chromium. To run it in another browser, set `TEST_BROWSER`, and pass spec paths to run only those:

```
TEST_BROWSER=firefox npm test
TEST_BROWSER=webkit npm test
npm test -- spec/suites/layer/PopupSpec.js
```

For watch mode, run `npx vitest`.

To test the minified bundle instead of the sources, as one of the CI jobs does, run `npm run build` and then `TEST_DIST=1 npm test`.

To open the Vitest UI for interactive debugging:

```
npm run test:ui
```

This opens a dashboard at `http://localhost:51204/__vitest__/` and spawns a visible browser window. Open DevTools in that window to set breakpoints in source (sourcemaps work), inspect the test DOM, and step through specs. Use `it.only(...)` to isolate a single test, or `debugger;` statements to pause inline.

Playwright will install its own browser binaries the first time it runs (`npx playwright install chromium firefox webkit`).

## Improving Documentation

The code of the live Leaflet website that contains all documentation and examples is located in the `docs/` directory of the `main` branch
and is generated from a set of HTML and Markdown files by a small Node script, [`build/site.js`](./build/site.js).

The easiest way to make little improvements such as fixing typos without even leaving the browser
is by editing one of the files with the online GitHub editor:
browse the [`docs/ directory`](https://github.com/Leaflet/Leaflet/tree/main/docs),
choose a certain file for editing, click the Edit button, make changes and follow instructions from there.
Once it gets merged, the changes will immediately appear on the website.

To preview the website locally, run `npm run serve` and open [http://localhost:8080](http://localhost:8080).
It builds the site into `_site/` (in about a second) and serves it; run `npm run site` to rebuild after changes.

Until Leaflet 2.0 is released, the 1.x tutorials, the front page and the download page
are taken from a pinned commit of the `v1` branch (see `refs` in [`build/site.json`](./build/site.json)).
To preview the 2.0 versions of these pages, run `npm run preview` instead, which serves them with Leaflet from `src/`.

### API documentation

The API reference is generated from the JSDoc comments next to every class, method, option and event in `src/`,
by a TypeScript-based script ([`build/reference-ts.js`](./build/reference-ts.js)). The same comments give the
published types, so to change the API documentation, edit these comments. The grouping and the table of contents
are set in [`build/reference.json`](./build/reference.json), and the templates are in `build/reference/`.

The website builds the references from released code (see `refs` in [`build/site.json`](./build/site.json)):
`reference.html` documents 1.9.4 from the `v1` branch, and `reference-2.0.0.html` the latest 2.0 release.
`reference-preview.html` is built from `main`, so changes to the comments show up there on merge,
and in the release references with the next release.

## Releasing

For maintainers:

1. Make sure CI passes on `main` and no [blocker](https://github.com/Leaflet/Leaflet/labels/blocker) issues are open.
2. Describe the release in [`CHANGELOG.md`](CHANGELOG.md) under a `## <version> (<date>)` heading and commit it.
   This section becomes the GitHub release notes.
3. Run `npm version <patch | minor | major>`, or `npm version 2.0.0-beta.2` for a prerelease, then `git push --follow-tags`.
4. Once the tests pass on the tag, CI stages the package on npm and creates the GitHub release with `leaflet.zip`.
   A version with a suffix (`-beta.2`) goes to the `beta` dist-tag and a prerelease, others to `latest`.
5. Run `npm stage list leaflet` and `npm stage approve <id>` (asks for 2FA) to publish the package.
6. Check the [npm page](https://www.npmjs.com/package/leaflet) and the files on [jsDelivr](https://cdn.jsdelivr.net/npm/leaflet/).

Then update the website in a pull request: write a post in `docs/_posts/`, run `npm run pin-release` to update the version,
integrity hashes and reference commit in `build/site.json`, and update the release links in `docs/download.md` and `docs/index.html`.

## Code of Conduct

Everyone is invited to participate in the Leaflet community and related projects:
we want to create a welcoming and friendly environment.
Harassment of participants or other unethical and unprofessional behavior will not be tolerated in our spaces.
The [Contributor Covenant](.github/CODE_OF_CONDUCT.md)
applies to all projects under the Leaflet organization.
Report any issues to agafonkin@gmail.com or ivan@sanchezortega.es.

## Thank You

Not only does your contribution to Leaflet and its community earn our gratitude, but it also makes you AWESOME.
Join [this approved list of awesome people](https://github.com/Leaflet/Leaflet/graphs/contributors)
and help us push the limits of what's possible with online maps!
