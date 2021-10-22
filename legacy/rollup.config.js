import { babel } from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'
import sass from 'rollup-plugin-sass'
import css from 'rollup-plugin-import-css'
import commonjs from '@rollup/plugin-commonjs'
import alias from '@rollup/plugin-alias'
import path from 'path'
import replace from '@rollup/plugin-replace'

const d2src = path.resolve(__dirname, 'src', 'd2', 'src')

const config = {
    input: 'src/index.js',
    output: {
        dir: 'output',
        format: 'esm'
    },
    plugins: [
        alias({
            entries: [
                {
                    find: 'd2/lib',
                    replacement: path.resolve(d2src)
                },
            ]
        }),
        babel({
            babelrc: false,
            presets: [
                require('@babel/preset-env'),
                require('@babel/preset-react'),
            ],
            plugins: [
                require('@babel/plugin-proposal-export-default-from'),
                require('@babel/plugin-syntax-dynamic-import').default,
                require('@babel/plugin-proposal-class-properties'),
                require('@babel/plugin-proposal-optional-chaining'),
                require('@babel/plugin-proposal-nullish-coalescing-operator'),
            ],
            exclude: 'node_modules/**',
            babelHelpers: 'bundled',
        }),
        sass(),
        json(),
        css(),
        replace({
            'process.env.NODE_ENV': JSON.stringify('development')
        }),
        resolve(),
        commonjs({
            ignoreDynamicRequires: false,
            transformMixedEsModules: true,
            include: /node_modules/,
        }),
    ]
};

export default config;
