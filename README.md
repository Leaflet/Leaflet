<img src="http://leaflet.cloudmade.com/docs/images/logo.png" alt="Leaflet" />

Leaflet is a modern, lightweight BSD-licensed JavaScript library for making tile-based interactive maps for both desktop and mobile web browsers, developed by [CloudMade](http://cloudmade.com) to form the core of its next generation JavaScript API.

It is built from the ground up to work efficiently and smoothly on both platforms, utilizing cutting-edge technologies included in HTML5. Its top priorities are usability, performance and small size, [A-grade](http://developer.yahoo.com/yui/articles/gbs/) browser support, flexibility and easy to use API. The OOP-based code of the library is designed to be modular, extensible and very easy to understand.

Check out the website for more information: [leaflet.cloudmade.com](http://leaflet.cloudmade.com)

## Contributing to Leaflet
Let's make the best open-source library for maps that can possibly exist! 

Contributing is simple: make the changes in your fork, make sure that Leaflet builds successfully (see below) and then create a pull request to [Vladimir Agafonkin](http://github.com/mourner) (Leaflet maintainer). Updates to Leaflet [documentation](http://leaflet.cloudmade.com/reference.html) and [examples](http://leaflet.cloudmade.com/examples.html) (located in the `gh-pages` branch) are really appreciated too.

Here's [a list of the awesome people](http://github.com/CloudMade/Leaflet/contributors) that joined us already. Looking forward to _your_ contributions!

## Building Leaflet
Leaflet build system is powered by the Node.js platform and Jake, JSHint and UglifyJS libraries, which install easily and work well across all major platforms. Here are the steps to install it:

 1. [Download and install Node](http://nodejs.org)
 2. Run the following commands in the command line:
 
 ```
 npm install -g jake
 npm install -g jshint
 npm install -g uglify-js
 ```

Now that you have everything installed, run `jake` inside the Leaflet directory. This will check Leaflet source files for JavaScript errors and inconsistencies, and then combine and compress it to the `dist` folder.

To make a custom build of the library with only the things you need, use the build helper (`build/build.html`) to choose the components (it figures out dependencies for you) and then run the command generated with it.

If you add any new files to the Leaflet source, make sure to also add them to `build/deps.js` so that the build system knows about them. Happy coding!