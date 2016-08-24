'use-strict';

const webpack = require('webpack');
const path = require('path');
const colors = require('colors');
const Visualizer = require('webpack-visualizer-plugin');

const webpackConfig = {
    context: __dirname,
    contentBase: __dirname,
    entry: {
        'react-with-touch': './src/react-with-touch.js',
    },
    devtool: 'source-map',
    output: {
        path: __dirname + '/build',
        filename: '[name].js',
        publicPath: 'http://localhost:8081/',
        libraryTarget: 'var',
        library: 'React',
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel',
            },
        ],
    },

    plugins: [
        new Visualizer,
    ],
    progress: true,
};

module.exports = webpackConfig;
