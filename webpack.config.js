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
    plugins: [
        new webpack.optimize.DedupePlugin(),
        // new webpack.optimize.UglifyJsPlugin({minimize: true}),
    ],
    devServer: {
        contentBase: './src/',
        progress: true,
        colors: true,
        port: 8081,
        inline: true,
    },
    devtool: ['sourcemap'],
};
