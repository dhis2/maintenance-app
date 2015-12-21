module.exports = function karmaConfig( config ) {
    config.set({
        basePath: '../../',

        // Frameworks to use with karma
        frameworks: ['mocha', 'chai', 'sinon-chai', 'sinon', 'systemjs'],

        // How will the results of the tests be reported (coverage reporter generates the coverage)
        reporters: ['mocha', 'coverage'],

        preprocessors: {
            // source files, that you wanna generate coverage for
            // do not include tests or libraries
            // (these files will be instrumented by Istanbul)
            'src/**/*.js': ['babel', 'coverage'],
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

        // Files that should be included by karma (that are not served by karma-systemjs)
        files: [
            './node_modules/phantomjs-polyfill/bind-polyfill.js',
            './node_modules/babel-core/browser-polyfill.js',

            './test/config/testSetup.js',

            './test/fixtures/fixtures.js',
        ],

        // Config for karma-systemjs
        systemjs: {
            config: {
                'baseURL': '',
                'defaultJSExtensions': true,
                'transpiler': 'babel',
                'babelOptions': {
                    stage: 0,
                },
                'paths': {
                    'd2-basicfields/*': '../src/*',
                    'npm:*': 'node_modules/*',
                    'es6-module-loader': './node_modules/es6-module-loader/dist/es6-module-loader.js',
                    'systemjs': './node_modules/systemjs/dist/system.js',
                    'system-polyfills': './node_modules/systemjs/dist/system-polyfills.js',
                    'phantomjs-polyfill': './node_modules/phantomjs-polyfill/bind-polyfill.js',
                    'babel': './node_modules/babel-core/browser.js',
                    'material-ui/*': './node_modules/material-ui/*',
                },
                'map': {
                    // Use react with addons when requesting normal react so we have the same react instance in src and test
                    'react': 'npm:react/dist/react-with-addons',
                    'react/addons': 'npm:react/dist/react-with-addons',
                    'react-select': 'npm:react-select/lib/Select',
                    'react-input-autosize': 'npm:react-input-autosize/lib/AutosizeInput',
                    'classnames': 'npm:classnames/index',
                    'd2-utils': 'npm:d2-utils/utils',
                    'd2-testutils': 'npm:d2-testutils/d2-testutils',
                    'loglevel': 'npm:loglevel/lib/loglevel',
                    'd2-ui-icon': 'npm:d2-ui-icon/Icon.component',
                    'material-ui': 'npm:material-ui',
                    'react-stub-context': 'npm:react-stub-context/dist/index',
                    'd2-ui': 'npm:d2-ui',
                },
            },

            files: [
                './node_modules/react/**',
                './node_modules/react-select/**',
                './node_modules/react-input-autosize/**',
                './node_modules/classnames/**',
                './node_modules/d2-utils/**',
                './node_modules/d2-testutils/**',
                './node_modules/loglevel/lib/**',
                './node_modules/d2-ui-icon/**',
                './node_modules/material-ui/**',
                './node_modules/react-stub-context/**',
                './node_modules/rx/**',
                './node_modules/d2-ui/**',

                // App source files
                'src/**/*.js',

                // Test files
                'test/**/*.test.js',
                'test/config/inject-theme.js',
            ],
        },

        logLevel: config.LOG_INFO,

        browsers: ['PhantomJS'],
        singleRun: false,
    });
};
