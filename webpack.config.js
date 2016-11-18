'use-strict';

const webpack = require('webpack');
const path = require('path');
const colors = require('colors');

const nodeEnv = process.env.NODE_ENV || 'development';
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

const scriptPrefix = (isDevBuild ? dhisConfig.baseUrl + '/' : '..');

const webpackConfig = {
    context: __dirname,
    entry: {
        maintenance: './src/maintenance.js',
        commons: ['material-ui'],
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
                loader: 'babel-loader',
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader',
            },
            {
                test: /\.scss$/,
                loader: 'style-loader!css-loader!sass-loader',
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
            'react-addons-shallow-compare': 'var React.addons.ShallowCompare',
            'lodash': 'var _',
            'lodash/fp': 'var fp',
        },
        /^react-addons/,
        /^react-dom$/,
        /^rx$/,
    ],

    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: "commons",
            filename: "commons-[hash].js",
        }),
        new webpack.DefinePlugin({
            DHIS_CONFIG: isDevBuild ? JSON.stringify(dhisConfig) : {},
            'process.env': { NODE_ENV: JSON.stringify(nodeEnv) }
        }),
        isDevBuild ? undefined : new webpack.LoaderOptionsPlugin({
            minimize: false,
            debug: true,
        }),
        new HTMLWebpackPlugin({
            template: './index.ejs',
            vendorScripts: [
                "polyfill.min.js",
                `${scriptPrefix}/dhis-web-core-resource/react-15/react-15${isDevBuild ? '' : '.min'}.js`,
                `${scriptPrefix}/dhis-web-core-resource/rxjs/4.1.0/rx.lite${isDevBuild ? '' : '.min'}.js`,
                `${scriptPrefix}/dhis-web-core-resource/lodash/4.15.0/lodash${isDevBuild ? '' : '.min'}.js`,
                `${scriptPrefix}/dhis-web-core-resource/lodash-functional/lodash-functional.js`,
                ['ckeditor/ckeditor.js', 'defer async']
            ]
                .map(script => {
                    if (Array.isArray(script)) {
                        return (`<script ${script[1]} src="${script[0]}"></script>`);
                    }
                    return (`<script src="${script}"></script>`);
                })
                .join("\n"),
        }),
        isDevBuild ? undefined : new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
            output: {
                comments: false,
            },
            sourceMap: true,
        }),
        isDevBuild ? undefined : new Visualizer,
    ].filter(v => v),

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
            '/polyfill.min.js': {
                target: 'http://localhost:8081/node_modules/babel-polyfill/dist',
            },
            '/ckeditor/*': {
                target: 'http://localhost:8081/node_modules',
            },
        },
    },
};

module.exports = webpackConfig;
