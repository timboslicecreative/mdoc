var path = require('path');

module.exports = {
    mode: 'production',
    entry: './public/js/index.js',
    output: {
        path: path.resolve(__dirname, 'build/js'),
        filename: 'index.bundle.js'
    }
};