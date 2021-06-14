// karma.conf.ts
module.exports = function (config) {
    config.set({
        compilerOptions: {
            target: "ES2015",
            lib: ["es5", "es6", "es2015", "dom"]
        },
        tsconfig: "tsconfig.json",
        browsers: ['PhantomJS', 'PhantomJS_custom'],

        // you can define custom flags
        customLaunchers: {
            PhantomJS_custom: {
                base: 'PhantomJS',
                options: {
                    windowName: 'my-window',
                    settings: {
                        webSecurityEnabled: false,
                    },
                },
                flags: ['--load-images=true'],
                debug: true,
            },
        },

        phantomjsLauncher: {
            // Have phantomjs exit if a ResourceError is encountered (useful if karma exits without killing phantom)
            exitOnResourceError: true,
        },
    })
}
