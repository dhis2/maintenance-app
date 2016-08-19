const webpack = require('webpack');
const path = require('path');
const colors = require('colors');

const isDevBuild = process.argv[1].indexOf('webpack-dev-server') !== -1;
const dhisConfigPath = process.env.DHIS2_HOME && `${process.env.DHIS2_HOME}/config`;

const Visualizer = require('webpack-visualizer-plugin');

let dhisConfig;

try {
    dhisConfig = require(dhisConfigPath);
    console.log('\nLoaded DHIS config:');
} catch (e) {
    // Failed to load config file - use default config
    console.warn(`\nWARNING! Failed to load DHIS config:`, e.message);
    console.info('Using default config');
    dhisConfig = {
        baseUrl: 'http://localhost:8080/dhis',
        authorization: 'Basic YWRtaW46ZGlzdHJpY3Q=', // admin:district
    };
}
console.log(JSON.stringify(dhisConfig, null, 2), '\n');

function bypass(req, res, opt) {
    req.headers.Authorization = dhisConfig.authorization;
    console.log('[PROXY]'.cyan.bold, req.method.green.bold, req.url.magenta, '=>'.dim, opt.target.dim);
}

const webpackConfig = {
    context: __dirname,
    contentBase: __dirname,
    entry: './src/maintenance.js',
    devtool: 'source-map',
    output: {
        path: __dirname + '/build',
        filename: 'maintenance.js',
        publicPath: 'http://localhost:8081/',
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
    resolve: {
        alias: {
            react: path.resolve('./node_modules/react'),
            'material-ui': path.resolve('./node_modules/material-ui'),
        },
    },
    devServer: {
        // host: '0.0.0.0',
        progress: true,
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
        },
    },
};

if (!isDevBuild) {
    webpackConfig.plugins = [
        // Replace any occurance of process.env.NODE_ENV with the string 'production'
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"',
            DHIS_CONFIG: JSON.stringify({}),
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            comments: false,
            beautify: false,
            sourceMap: true,
        }),
        new Visualizer(),
    ];
} else {
    webpackConfig.plugins = [
        new webpack.DefinePlugin({
            DHIS_CONFIG: JSON.stringify(dhisConfig)
        }),
    ];
}

module.exports = webpackConfig;
