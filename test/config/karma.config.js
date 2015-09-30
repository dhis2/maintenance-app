module.exports = function karmaConfig( config ) {
    config.set({
        basePath: '../../',

        // Frameworks to use with karma
        frameworks: ['mocha', 'chai', 'sinon-chai', 'sinon'],

        // How will the results of the tests be reported (coverage reporter generates the coverage)
        reporters: ['mocha', 'coverage'],

        preprocessors: {
            // source files, that you wanna generate coverage for
            // do not include tests or libraries
            // (these files will be instrumented by Istanbul)
            'src/**/*.js': ['babel'],
            'test/*': ['webpack'],
        },

        // optionally, configure the reporter
        coverageReporter: {
            type: 'lcov',
            dir: './coverage/',
            subdir: function flattenBrowserName(browser) {
                // normalization process to keep a consistent browser name accross different OS
                return browser.toLowerCase().split(/[ /-]/)[0];
            },
        },

        babelPreprocessor: {
            options: {
                sourceMap: 'inline',
            },
        },

        webpack: {
            context: __dirname,
            module: {
                loaders: [
                    {
                        test: /.+?/,
                        exclude: /(node_modules)/,
                        loader: 'babel',
                        query: {
                            stage: 2,
                        },
                    },
                ],
            },
        },

        // Files that should be included by karma
        files: [
            './node_modules/phantomjs-polyfill/bind-polyfill.js',
            './node_modules/babel-core/browser-polyfill.js',
            'test/index.js',
            'src/**/*.js',
        ],

        logLevel: config.LOG_INFO,

        browsers: ['PhantomJS'],
        singleRun: false,
    });
};
