const Showdown = require('showdown');
const showdownHighlight = require("showdown-highlight");
const {showdown: config} = require('./config');

const converter = new Showdown.Converter({
    ...config,
    ghCompatibleHeaderId: true,
    extensions: [showdownHighlight]
});

module.exports = converter;