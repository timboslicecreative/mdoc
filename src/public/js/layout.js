import {findValidSibling, getOffsetTop, siblingElement} from "./utils";

const validContentTags = [
    'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P',
    'TABLE', 'UL', 'OL', 'DL', 'ASIDE', 'DIV'
];

const codeBlockTag = 'DIV';
const codeBlockClassname = 'code-block';
const codeBlockNode = document.createElement(codeBlockTag);
codeBlockNode.className = codeBlockClassname;

const spacerTag = 'SPAN';
const spacerClassName = 'spacer';
const spacerNode = document.createElement(spacerTag);
spacerNode.className = spacerClassName;

export default class Layout {

    constructor(containerSelector) {
        this.containerSelector = containerSelector;
        this.defaultlanguage = '';
        this.container = null;
        this.spacers = [];
        this.blocks = [];
    }

    init() {
        this.container = document.querySelector(this.containerSelector);
        if (!this.container) return console.error(`Layout could not find container ${this.containerSelector}`);
        this.createBlocks();
        this.createSpacers();
        this.position();
    }

    createBlocks() {
        const elements = this.container.querySelectorAll('pre, blockquote');

        for (let el, sibling, codeBlock, i = 0; i < elements.length; i++) {
            el = elements[i];

            sibling = findValidSibling(el, validContentTags, false);

            if (!sibling) {
                console.error('No valid previous sibling found for', el);
                continue;
            }

            if (sibling.className !== codeBlockClassname) {
                codeBlock = codeBlockNode.cloneNode();
                el.parentNode.insertBefore(codeBlock, el);
            } else codeBlock = sibling;

            codeBlock.appendChild(el);
        }
    }

    createSpacers() {
        const siblingSelectors = [
            `${spacerTag}.${spacerClassName}`,
            'H1', 'H2', 'H3', 'H4', 'H5', 'H6',
            `${codeBlockTag}.${codeBlockClassname}`
        ];

        let blocks = Array.from(document.querySelectorAll(`#content .${codeBlockClassname}`));

        for (let block, next, before, spacer, i = 0; i < blocks.length; i++) {
            block = blocks[i];
            spacer = null;
            before = null;

            // find the next stop element, in order of H's CodeBlock and an actual spacer
            next = siblingElement(block, siblingSelectors, true, validContentTags);

            if (next && next.tagName.indexOf('H') >= 0) before = next;
            if (next && next.tagName === 'DIV') before = findValidSibling(next, validContentTags, false);
            if (next && next.tagName === 'SPAN') spacer = next;

            // if there is already a spacer in place move on
            if (spacer) continue;
            // if there is a stop element, add the spacer
            // otherwise there is no stop element after the code block, append a spacer to the parent
            if (before) {
                before.parentNode.insertBefore(spacerNode.cloneNode(), before);
            } else {
                block.parentNode.append(spacerNode.cloneNode());
            }
        }
    };

    position() {

        let sections = Array.from(document.querySelectorAll(`#content section`));
        for (let section, blocks, spacers, i = 0; i < sections.length; i++) {
            section = sections[i];
            blocks = Array.from(section.querySelectorAll(`.${codeBlockClassname}`));
            if (!blocks.length) continue;
            spacers = Array.from(section.querySelectorAll(`.${spacerClassName}`));
            for (let block, spacer, prev, blockTop, j = 0; j < blocks.length; j++) {
                block = blocks[j];
                spacer = spacers[j];
                prev = findValidSibling(block, validContentTags, false);
                blockTop = prev ? prev.offsetTop : 0;
                block.style.top = blockTop + 'px';
                if (!spacer) continue; // something really went wrong
                const blockBottom = getOffsetTop(block) + block.offsetHeight;
                const spacerPosition = getOffsetTop(spacer); // we dont care about spacer height, it will be reset
                if (spacerPosition > blockBottom) continue; // as it should be
                spacer.style.height = blockBottom - spacerPosition;
            }
        }

    }
}