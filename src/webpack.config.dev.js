const path = require('path');

module.exports = {
    mode: 'development',
    watch: true,
    entry: './public/js/index.js',
    output: {
        path: path.resolve(__dirname, 'public/js'),
        filename: 'index.bundle.js'
    }
};