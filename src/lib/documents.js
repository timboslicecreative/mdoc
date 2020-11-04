const fs = require('fs');
const path = require('path');
const showdown = require('./showdown');

const extractHeadings = (md = '') => {
    const headingReg = /<h([0-3])[^>]*id="([^"]*)"[^>]*>([^<]*)</g;
    let match;
    let headings = [];
    while ((match = headingReg.exec(md)) !== null) {
        headings.push({
            level: parseInt(match[1]),
            id: match[2],
            text: match[3],
            sub: []
        })
    }
    const getSubHeadings = (level, headings) => {
        let current;
        let subHeadings = [];
        while (headings.length && headings[0].level > level) {
            current = headings.shift();
            current.sub = getSubHeadings(current.level, headings);
            subHeadings.push(current);
        }
        return subHeadings;
    }
    return getSubHeadings(0, headings);
}

const makeSections = (html) => {
    return `<section>${html.replace(/<h(1|2)/g, '</section><section><h$1')}</section>`.replace('<section></section>', '');
}

const setIds = (html, prefix) => {
    return html.replace(/id="([^"]*)"/g, `id="${prefix}-$1"`);
}

async function getDocuments(docsPath) {
    let files = fs.readdirSync(docsPath);
    files = files.filter(file => !fs.lstatSync(path.join(docsPath, '/', file)).isDirectory() && file.substr(0, 1) !== '.');
    return files.map(file => {
            const md = fs.readFileSync(path.join(docsPath, '/', file)).toString();

            let html = showdown.makeHtml(md);
            let name = file.replace(/.[^.]*$/, '');
            html = setIds(html, name);
            html = makeSections(html);

            return {
                name,
                md,
                html,
                headings: extractHeadings(html)
            }
        }
    );
}

module.exports = {
    getDocuments
}