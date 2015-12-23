var webpack = require('webpack');
var path = require('path');

module.exports = {
    context: __dirname,
    entry: './src/maintenance.js',
    output: {
        path: path.join(__dirname, '/build'),
        filename: 'maintenance.js',
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: [/(node_modules)/, /d2\-ui/],
                loader: 'babel',
                query: {
                    stage: 0,
                },
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader',
            },
        ],
    },
    resolve: {
        alias: {
            react: path.resolve('./node_modules/react'),
            'material-ui': path.resolve('./node_modules/material-ui'),
            'd2-flux': path.resolve('./node_modules/d2-flux'),
        },
    },
    plugins: [
        new webpack.optimize.DedupePlugin(),
        //new webpack.optimize.UglifyJsPlugin({
        //    minimize: true,
        //    compress: {
        //        warnings: false
        //    },
        //}),
        //new webpack.optimize.OccurenceOrderPlugin(),
        //new webpack.ProvidePlugin({
        //    $: "jquery",
        //    jQuery: "jquery",
        //    "window.jQuery": "jquery"
        //}),
    ],
    devtool: ['sourcemap'],
};
