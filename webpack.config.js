'use-strict';

const webpack = require('webpack');
const path = require('path');
const colors = require('colors');

const nodeEnv = process.env.NODE_ENV || 'development';
const isDevBuild = process.argv[1].indexOf('webpack-dev-server') !== -1;
const isProfileBuild = process.argv[1].indexOf('--profile') !== -1;
const dhisConfigPath = process.env.DHIS2_HOME && `${process.env.DHIS2_HOME}/config`;

const HTMLWebpackPlugin = require('html-webpack-plugin');
const Visualizer = require('webpack-visualizer-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

var dhisConfig;

try {
    dhisConfig = require(dhisConfigPath);
    console.log(dhisConfig);
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
    //req.headers.Authorization = dhisConfig.authorization;
   // console.log(opt.auth)
    console.log('[PROXY]'.cyan.bold, req.method.green.bold, req.url.magenta, '=>'.dim, opt.target.dim);
}

const scriptPrefix = ('..');

const webpackConfig = {
    context: __dirname,
    performance: { hints: false },
    entry: {
        maintenance: './src/maintenance.js',
        commons: ['material-ui', 'd2-utilizr'],
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
                include: path.resolve(__dirname, 'src/'),
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true,
                },
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader',
            },
            {
                test: /\.scss$/,
                loader: 'style-loader!css-loader!sass-loader',
            },
            {
                test: /\.json$/,
                loader: 'json-loader',
            }
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
        /^lodash$/,
        /^lodash\/fp$/,
    ],

    resolve: {
      alias: {
          d2: __dirname+'/node_modules/d2',
        },
    },

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
                `${scriptPrefix}/dhis-web-core-resource/babel-polyfill/6.20.0/dist/polyfill${isDevBuild ? '' : '.min'}.js`,
                `${scriptPrefix}/dhis-web-core-resource/react/15.4.2/react-with-touch-tap-plugin${isDevBuild ? '' : '.min'}.js`,
                `${scriptPrefix}/dhis-web-core-resource/rxjs/4.1.0/rx.lite${isDevBuild ? '' : '.min'}.js`,
                `${scriptPrefix}/dhis-web-core-resource/lodash/4.15.0/lodash${isDevBuild ? '' : '.min'}.js`,
                `${scriptPrefix}/dhis-web-core-resource/lodash-functional/1.0.1/lodash-functional.js`,
                [`${scriptPrefix}/dhis-web-core-resource/ckeditor/4.6.1/ckeditor.js`, 'defer async'],
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
        isProfileBuild ? new BundleAnalyzerPlugin() : undefined,
        isProfileBuild ? new Visualizer : undefined,
    ].filter(v => v),

    devServer: {
        port: 8081,
        inline: true,
        compress: true,
        proxy: [
            {
                context: [
                    '/api/**',
                    '/dhis-web-commons/**',
                    '/dhis-web-core-resource/**',
                    '/icons/**',
                    '/css/**',
                    '/images/**',
                ],
                target: dhisConfig.baseUrl,
                auth: dhisConfig.authorization,
                changeOrigin: true,
                bypass,
            },
            {
                path: '/i18n/**',
                target: 'http://localhost:8081/src',
                bypass,
            },
            {
                path: '/polyfill.min.js',
                target: 'http://localhost:8081/node_modules/babel-polyfill/dist',
                bypass,
            },
        ],
        watchOptions: {
            aggregateTimeout: 2000,
        },
    },
};

module.exports = webpackConfig;
