const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const config = require('./lib/config');

const {buildDir, theme, highlightTheme} = config;

module.exports = {
    mode: 'production',
    entry: './public/js/index.js',
    output: {
        path: path.resolve(__dirname, buildDir,),
        filename: 'js/index.bundle.js'
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: 'public/icons', to: `icons` },
                { from: 'public/img', to: `img` },
                { from: 'public/css/layout.css', to: `css` },
                { from: 'public/css/print.css', to: `css` },
                ...theme.map(t => ({from: `public/css/theme/${t}.css`, to: `css/theme/`})),
                ...highlightTheme.map(t => ({from: `public/css/highlight/${t}.css`, to: `css/highlight/`}))
            ],
        }),
    ],
};