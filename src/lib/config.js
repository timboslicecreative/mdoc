const customConfig = require('../config.js');

const defaultConfig = {
    logo: 'logo.jpg',
    documentsPath: 'documents',
    titlePrefix: 'Documentation',
    titleSuffix: '',
    languages: [
        {name: 'python', label: 'Python', default: true},
        {name: 'java', label: 'Java'},
        {name: 'javascript', label: 'Javascript'}
    ],
    theme: ['default-light', 'default-dark'],
    highlightTheme: ['solarized-dark', 'solarized-light'],
    darkMode: false,
    showdown: {
        tables: true,
        metadata: true,
        parseImgDimensions: true,
    },
    buildDir: 'build'
}


module.exports = {
    ...defaultConfig,
    ...customConfig
}