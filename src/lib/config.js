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
    theme: 'default',
    highlightTheme: 'solarized',
    darkMode: false,
    showdown: {
        tables: true,
        metadata: true,
        parseImgDimensions: true,
    }
}


module.exports = {
    ...defaultConfig,
    ...customConfig
}