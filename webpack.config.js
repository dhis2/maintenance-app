'use-strict';

const webpack = require('webpack');
const path = require('path');
const colors = require('colors');

const isDevBuild = process.argv[1].indexOf('webpack-dev-server') !== -1;
const dhisConfigPath = process.env.DHIS2_HOME && `${process.env.DHIS2_HOME}/config`;

const HTMLWebpackPlugin = require('html-webpack-plugin');
const Visualizer = require('webpack-visualizer-plugin');

var dhisConfig;

try {
    dhisConfig = require(dhisConfigPath);
//    console.log('\nLoaded DHIS config:');
} catch (e) {
    // Failed to load config file - use default config
    console.warn(`\nWARNING! Failed to load DHIS config:`, e.message);
    console.info('Using default config');
    dhisConfig = {
        baseUrl: 'http://localhost:8080/dhis',
        authorization: 'Basic YWRtaW46ZGlzdHJpY3Q=', // admin:district
    };
}
// console.log(JSON.stringify(dhisConfig, null, 2), '\n');

function bypass(req, res, opt) {
    req.headers.Authorization = dhisConfig.authorization;
    console.log('[PROXY]'.cyan.bold, req.method.green.bold, req.url.magenta, '=>'.dim, opt.target.dim);
}

const webpackConfig = {
    context: __dirname,
    contentBase: __dirname,
    entry: {
        maintenance: './src/maintenance.js',
        vendor: ['material-ui', 'loglevel'],
    },
    devtool: 'source-map',
    output: {
        path: __dirname + '/build',
        filename: '[name]-[hash].js',
        publicPath: isDevBuild ? 'http://localhost:8081/' : './',
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel',
            },
            {
                test: /\.css$/,
                loader: 'style!css',
            },
            {
                test: /\.scss$/,
                loader: 'style!css!sass',
            },
        ],
    },

    externals: [
        {
            'react': 'var React',
            'react-dom': 'var ReactDOM',
            'rx': 'var Rx',
            'react-addons-transition-group': 'var React.addons.TransitionGroup',
            'react-addons-create-fragment': 'var React.addons.createFragment',
            'react-addons-update': 'var React.addons.update',
            'react-addons-pure-render-mixin': 'var React.addons.PureRenderMixin',
            'lodash': 'var _',
            'lodash/fp': 'var fp',
        },
        /^react-addons/,
        /^react-dom$/,
        /^rx$/,
    ],

    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'vendor-[hash].js',
        }),
        new webpack.DefinePlugin({
            DHIS_CONFIG: JSON.stringify(dhisConfig)
        }),
        isDevBuild ? undefined : new webpack.LoaderOptionsPlugin({
            minimize: false,
            debug: true,
        }),
        new HTMLWebpackPlugin({
            template: './index.ejs',
            vendorScripts: [
                "polyfill.min.js",
                "jquery.min.js",
                "core-resource-app/react-15/react-15.js",
                "core-resource-app/rxjs/4.1.0/rx.lite.js",
                "ckeditor/ckeditor.js",
                "core-resource-app/lodash/4.15.0/lodash.min.js",
                "core-resource-app/lodash-functional/lodash-functional.js",
            ]
                .map(script => (`<script src="${script}"></script>`))
                .join("\n"),
        }),
        isDevBuild ? undefined : new webpack.optimize.UglifyJsPlugin({
            comments: false,
            beautify: false,
            sourceMap: true,
        }),
        isDevBuild ? undefined : new Visualizer,
    ].filter(v => v),
    progress: true,

    devServer: {
        colors: true,
        port: 8081,
        inline: true,
        compress: true,
        proxy: {
            '/dhis-web-commons/**': {
                target: dhisConfig.baseUrl,
                changeOrigin: true,
                bypass
            },
            '/icons': {
                target: dhisConfig.baseUrl,
                changeOrigin: true,
                bypass
            },
            '/icons/*': {
                target: dhisConfig.baseUrl,
                changeOrigin: true,
                bypass
            },
            '/css/*': {
                target: 'http://localhost:8081/src',
            },
            '/i18n/*': {
                target: 'http://localhost:8081/src',
            },
            '/jquery.min.js': {
                target: 'http://localhost:8081/node_modules/jquery/dist',
            },
            '/polyfill.min.js': {
                target: 'http://localhost:8081/node_modules/babel-polyfill/dist',
            },
            '/ckeditor/*': {
                target: 'http://localhost:8081/node_modules',
            },
            '/core-resource-app/react-15/react-15.js': {
                target: 'http://localhost:8080/dhis/api/apps/core-resource-app/react-15/react-15.js',
                ignorePath: true,
            },
            '/core-resource-app/rxjs/4.1.0/rx.lite.js': {
                target: 'http://localhost:8080/dhis/api/apps/core-resource-app/rxjs/4.1.0/rx.lite.js',
                ignorePath: true,
            },
            '/core-resource-app/lodash-functional/lodash-functional.js': {
                target: 'http://localhost:8080/dhis/api/apps/core-resource-app/lodash-functional/lodash-functional.js',
                ignorePath: true,
            },
            '/core-resource-app/lodash/4.15.0/lodash.min.js': {
                target: 'http://localhost:8080/dhis/api/apps/core-resource-app/lodash/4.15.0/lodash.min.js',
                ignorePath: true,
            }
        },
    },
};

// if (!isDevBuild) {
//     webpackConfig.plugins = [
//         // Replace any occurance of process.env.NODE_ENV with the string 'production'
//         new webpack.DefinePlugin({
//             'process.env.NODE_ENV': '"production"',
//             DHIS_CONFIG: JSON.stringify({}),
//         }),
//         new webpack.optimize.DedupePlugin(),
//         // new webpack.optimize.OccurrenceOrderPlugin(),
//         // new webpack.optimize.UglifyJsPlugin({
//         //     comments: false,
//         //     beautify: false,
//         //     sourceMap: true,
//         // }),
//         // new Visualizer(),
//     ];
// } else {
//     webpackConfig.plugins = [
//         new webpack.DefinePlugin({
//             DHIS_CONFIG: JSON.stringify(dhisConfig)
//         }),
//         new webpack.LoaderOptionsPlugin({
//             minimize: false,
//             debug: true,
//         }),
//         new webpack.optimize.DedupePlugin(),
//
//     ];
// }

module.exports = webpackConfig;
