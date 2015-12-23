var webpack = require('webpack');
var webpackBaseConfig = require('./webpack-base-config');

webpackBaseConfig.devServer = {
    contentBase: './src/',
    progress: true,
    colors: true,
    port: 8081,
    inline: true,
};

module.exports = webpackBaseConfig;
