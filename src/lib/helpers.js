const showdown = require("./showdown");

function markdown(md = '') {
    return showdown.makeHtml(md);
}

const maxLevel = 3;

function toc(headings) {
    const generateList = (headings = [], level) => `
        <ul class="toc-list">
            ${headings.length ? headings.map(h => `
                <li class="toc-list-item" id="link-${h.id}">
                   <a class="toc-list-link" href="#${h.id}">${h.text}</a>
                   ${(level < maxLevel && h.sub.length) ? generateList(h.sub, level + 1) : ''}
                </li>
           `).join('\n') : ''}
       </ul>
   `;
    return generateList(headings, 1);
}

module.exports = {
    markdown,
    toc
}