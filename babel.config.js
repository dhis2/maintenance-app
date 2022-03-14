module.exports = {
    presets: [
        require('@babel/preset-env'),
        require('@babel/preset-react'),
    ],
    plugins: [
		require('@babel/plugin-syntax-dynamic-import').default,
		require('babel-plugin-react-require'),
		require('@babel/plugin-proposal-class-properties'),
		require('@babel/plugin-proposal-optional-chaining'),
		require('@babel/plugin-proposal-nullish-coalescing-operator'),
		require('@babel/plugin-transform-runtime'),
		require('@babel/plugin-transform-modules-commonjs'),
    ],
    env: {
        production: {
            plugins: [
                [require('styled-jsx/babel'), { optimizeForSpeed: true }],
            ],
        },
        development: {
            plugins: [
                [require('styled-jsx/babel'), { optimizeForSpeed: true }],
            ],
        },
        test: {
            plugins: [require('styled-jsx/babel-test')],
        },
    },
    ignore: [
        /[\/\\]core-js/,
        /@babel[\/\\]runtime/,
    ],
};
