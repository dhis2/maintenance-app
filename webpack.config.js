var webpack = require('webpack');
var webpackBaseConfig = require('./webpack-base-config');

function bypass(req, res, opt) {
    req.headers.Authorization = dhisConfig.authorization;
    console.log('[PROXY]'.cyan.bold, req.method.green.bold, req.url.magenta, '=>'.dim, opt.target.dim);
}

const dhisConfigPath = process.env.DHIS2_HOME && `${process.env.DHIS2_HOME}/config`;
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

webpackBaseConfig.devServer = {
    // contentBase: './src/',
    progress: true,
    colors: true,
    port: 8081,
    inline: true,
    proxy: [
        { path: '/api/*', target: dhisConfig.baseUrl, bypass },
        { path: '/dhis-web-commons/*', target: dhisConfig.baseUrl, bypass },
        { path: '/icons/*', target: dhisConfig.baseUrl, bypass },
        { path: '/css/*', target: 'http://localhost:8081/src', bypass },
        { path: '/i18n/*', target: 'http://localhost:8081/src', bypass },
        { path: '/jquery.min.js', target: 'http://localhost:8081/node_modules/jquery/dist', bypass },
        { path: '/polyfill.min.js', target: 'http://localhost:8081/node_modules/babel-polyfill/dist', bypass },
    ]
};

module.exports = webpackBaseConfig;
