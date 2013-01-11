Contributing to Leaflet
=======================

 1. [Getting Involved](#getting-involved)
 2. [Reporting Bugs](#reporting-bugs)
 3. [Contributing Code](#contributing-code)
 4. [Improving Documentation](#improving-documentation)

## Getting Involved

Third-party patches are absolutely essential on our quest to create the best mapping library that will ever exist.
However, they're not the only way to get involved with the development of Leaflet.
You can help the project tremendously by discovering and [reporting bugs](#reporting-bugs),
[improving documentation](#improving-documentation),
helping others on the [Leaflet forum](https://groups.google.com/forum/#!forum/leaflet-js)
and [GitHub issues](https://github.com/Leaflet/Leaflet/issues),
showing your support for your favorite feature suggestions on [Leaflet UserVoice page](http://leaflet.uservoice.com),
tweeting to [@LeafletJS](http://twitter.com/LeafletJS)
and spreading the word about Leaflet among your colleagues and friends.

## Reporting Bugs

Before reporting a bug on the project's [issues page](https://github.com/Leaflet/Leaflet/issues),
first make sure that your issue is caused by Leaflet, not your application code
(e.g. passing incorrect arguments to methods, etc.).
Second, search the already reported issues for similar cases,
and if it's already reported, just add any additional details in the comments.

After you made sure that you've found a new Leaflet bug,
here are some tips for creating a helpful report that will make fixing it much easier and quicker:

 * Write a **descriptive, specific title**. Bad: *Problem with polylines*. Good: *Doing X in IE9 causes Z*.
 * Include **browser, OS and Leaflet version** info in the description.
 * Create a **simple test case** that demonstrates the bug (e.g. using [JSFiddle](http://jsfiddle.net/)).
 * Check whether the bug can be reproduced in **other browsers**.
 * Check if the bug occurs in the stable version, master, or both.
 * *Bonus tip:* if the bug only appears in the master version but the stable version is fine,
   use `git bisect` to find the exact commit that introduced the bug.

## Contributing Code

### Considerations for Accepting Patches

While we happily accept patches, we're also commited to keeping Leaflet simple, lightweight and blazingly fast.
So bugfixes, performance optimizations and small improvements that don't add a lot of code
are much more likely to get accepted quickly.

Before sending a pull request with a new feature, first check if it's been discussed before already
(either on [GitHub issues](https://github.com/Leaflet/Leaflet/issues)
or [Leaflet UserVoice](http://leaflet.uservoice.com/)),
and then ask yourself two questions:

 1. Are you sure that this new feature is important enough to justify its presense in the Leaflet core?
    Or will it look better as a plugin in a separate repository?
 2. Is it written in a simple, concise way that doesn't add bulk to the codebase?

If your feature or API improvement did get merged into master,
please consider submitting another pull request with the corresponding [documentation update](#improving-documentation).

### Setting up the Build System

To set up the Leaflet build system, install [Node](http://nodejs.org/),
then run the following commands in the project root (with superuser permissions):

```
npm install -g jake
npm install jshint
npm install uglify-js
```

You can build minified Leaflet by running `jake` (it will be built from source in the `dist` folder).

### Making Changes to Leaflet Source

If you're not yet familiar with the way GitHub works (forking, pull requests, etc.),
be sure to check out the awesome [article about forking](https://help.github.com/articles/fork-a-repo)
on the GitHub Help website &mdash; it will get you started quickly.

You should always write each batch of changes (feature, bugfix, etc.) in **its own topic branch**.
Please do not commit to the `master` branch, or your unrelated changes will go into the same pull request.

You should also follow the code style and whitespace conventions of the original codebase.

Before commiting your changes, run `jake lint` to catch any JS errors in the code and fix them.
If you add any new files to the Leaflet source, make sure to also add them to `build/deps.js`
so that the build system knows about them.

But please **do not commit the built files** (`leaflet.js` and `leaflet-src.js`) along with your changes,
otherwise there may be problems merging the pull request.
These files are only commited in the `master` branch of the main Leaflet repository.

Happy coding!

## Improving Documentation

The code of the live Leaflet website that contains all documentation and examples is located in the `gh-pages` branch
and is automatically generated from a set of HTML and Markdown files by [Jekyll](https://github.com/mojombo/jekyll).

The easiest way to make little improvements such as fixing typos without even leaving the browser
is by editing one of the files with the online GitHub editor:
browse the [gh-pages branch](https://github.com/Leaflet/Leaflet/tree/gh-pages),
choose a certain file for editing (e.g. `reference.html` for API reference),
click the Edit button, make changes and follow instructions from there.
Once it gets merged, the changes will immediately appear on the website.

If you need to make edits in a local repository to see how it looks in the process, do the following:

 1. [Install Ruby](http://www.ruby-lang.org/en/) if don't have it yet.
 2. Run `gem install jekyll`.
 3. Run `jekyll --auto` inside the `Leaflet` folder.
 4. Open the website from the `_site` folder.

Now any file changes will be reflected on the generated pages automatically.
After commiting the changes, just send a pull request.

If you need to update documentation according to a new feature that only appeared in the master version (not stable one),
you need to make changes to `gh-pages-master` branch instead of `gh-pages`.
It will get merged into the latter when released as stable.

## Thank You

Not only are we grateful for any contributions, &mdash; helping Leaflet and its community actually makes you AWESOME.
Join [this approved list of awesome people](https://github.com/Leaflet/Leaflet/graphs/contributors)
and help us push the limits of what's possible with online maps!
