const webpack = require('webpack');
const WrapperPlugin = require('wrapper-webpack-plugin');

/**
 * Check if the current file is in the src folder
 */
const isFileInSrcFolder = (path) => {
    return (new RegExp(`${__dirname}\/src`)).test(path);
};

module.exports = {
    entry: './src/d2.js',
    output: {
        path: __dirname + '/lib',
        filename: 'd2-browser.js',
        library: 'd2',
        libraryTarget: 'var',
    },
    plugins: [
        // Export the default part of the d2 module.
        new WrapperPlugin({
            header: `var d2 = (function () {`,
            footer: `
                    return d2.default;
                })();
            `,
        }),
    ],
    module: {
        loaders: [
            {
                test: /\.js?$/,
                // We only want to babelify files in the source folder
                include: isFileInSrcFolder,
                loader: 'babel-loader',
            },
        ],
    },
    devtool: 'source-map',
};
