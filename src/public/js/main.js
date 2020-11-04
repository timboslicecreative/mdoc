const validContentTags = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'TABLE', 'UL', 'OL', 'DL', 'ASIDE', 'DIV'];
const validTagName = el => validContentTags.indexOf(el.tagName) >= 0;

const eventEnd = (target, event, fn, delay = 100) => {
    let timeout;
    target.addEventListener(event, () => {
        clearTimeout(timeout);
        timeout = setTimeout(fn, delay);
    });
    return timeout;
};

const getOffsetTop = el => {
    let offsetTop = 0;
    while (el) {
        offsetTop += el.offsetTop || 0;
        el = el.offsetParent;
    }
    return offsetTop;
};

const findValidSibling = (el, tags = [], next = true) => {
    let i = 0;
    let max = 100;
    let current = next ? el.nextSibling : el.previousSibling;
    while (i < max && current && tags.indexOf(current.tagName) < 0) {
        current = next ? current.nextSibling : current.previousSibling;
        i++;
    }
    if (!current) console.log('could not find valid sibling from', tags, 'for', el);
    return current || null;
}

const matchesSelector = (el, selector) => {
    const classNames = selector.split('.');
    const tagName = classNames[0] === '' ? null : classNames.shift();
    // console.log('matchesSelector', tagName, '=', el.tagName, classNames, '=', el.className);
    if (tagName && el.tagName !== tagName) return false;
    return classNames.length > 0 ? classNames.filter(cname => el.className.indexOf(cname) >= 0).length === classNames.length : true;
}

const siblingElement = (from, selectors = [], next = true) => {
    if (!from) return null;
    let current = next ? from.nextSibling : from.previousSibling;
    while (current && (!validTagName(current) || !selectors.find(selector => matchesSelector(current, selector)))) {
        current = next ? current.nextSibling : current.previousSibling;
    }
    return current || null;
}

let headingsMap = [];
const calculateHeadingPositions = () => {
    const headings = Array.from(document.querySelectorAll('h1, h2, h3'));
    headingsMap = [];
    for (let i = 0; i < headings.length; i++) {
        headingsMap.push({
            top: getOffsetTop(headings[i]),
            id: headings[i].id,
            title: headings[i].innerText
        });
    }
    for (let i = 0; i < headingsMap.length; i++) {
        headingsMap[i].bottom = headingsMap[i + 1] ? headingsMap[i + 1].top : window.innerHeight;
    }
}

const setList = (element, open = true) => {
    const ul = element.parentNode
    ul.className = open ? ul.className + ' open' : ul.className.replace(' open', '');
    if (ul.parentNode.tagName === 'LI') setList(ul.parentNode, open);
}

let active;
const makeActive = heading => {
    if (active) setActiveLink('link-' + active.id, false);
    setActiveLink('link-' + heading.id, true);
    setActiveHeading(heading.title);
    active = heading;
}

const setActiveHeading = (text) => {
    document.getElementById('active-heading-display').innerText = text;
}

const setActiveLink = (id, active = true) => {
    const link = document.getElementById(id);
    active ? link.classList.add('active') : link.classList.remove('active');
    setList(link, active);
};

const setHistory = () => {
    if (!active) return;
    const state = {url: `#${active.id}`, title: active.innerText};
    history.replaceState(state, state.title, state.url);
}

const getHeadingFromScrollPosition = () => {
    const scrollOffset = 1; //parseInt(document.body.style.paddingTop || 0);
    const top = document.body.scrollTop + scrollOffset;
    const heading = headingsMap.find(h => top >= h.top && top <= h.bottom);
    if (!heading) return;
    if (!active || heading.id !== active.id) {
        makeActive(heading)
    }
}

const languageInputNode = document.querySelector('#select-language').cloneNode(true);
languageInputNode.id = '';

const copyButtonNode = document.createElement('button');
copyButtonNode.className = 'copy';

const labelNode = document.createElement('span');
labelNode.className = "language-label"

const setupCodeDisplay = () => {
    const showStyle = 'display:block;';
    const hideStyle = 'display:none;'
    const getCodeElements = (lang = null) => [...document.querySelectorAll(`code${lang ? `.${lang}` : ''}`)];
    const hideAllCode = () => getCodeElements().forEach(element => element.parentNode.style = hideStyle);
    const showAllCode = () => getCodeElements().forEach(element => element.parentNode.style = showStyle);
    const showLangCode = lang => getCodeElements(lang).forEach(element => element.parentNode.style = showStyle);

    const handleLanguageChange = e => {
        const lang = e.target.value;
        updateLanguageInputs(lang);
        hideAllCode();
        showLangCode(lang);
    };

    const codeBlocks = Array.from(document.querySelectorAll('.content pre > code')).forEach(element => {
        const language = (element.className.match(/language-([^\s$]*)/) || ['', 'unknown'])[1];
        if (supportedLanguages.find(l => l === language)) {
            element.parentNode.insertBefore(languageInputNode.cloneNode(true), element);
        } else {
            const label = labelNode.cloneNode(true);
            label.innerText = language;
            element.parentNode.insertBefore(label, element);
        }
        element.parentNode.insertBefore(copyButtonNode.cloneNode(), element);
    });
    const clipboard = new ClipboardJS('.copy', {
        text: (trigger) => trigger.nextSibling.innerText
    }).on('success', (e) => {
        flash(e.trigger);
    });

    const languageInputs = Array.from(document.querySelectorAll('.input-language'));
    const updateLanguageInputs = lang => languageInputs.forEach(input => input.value = lang);

    languageInputs.forEach(input => {
        input.addEventListener('change', handleLanguageChange);
    });
}


const flashClassName = ' flash';
const flash = (element) => {
    element.className = element.className + flashClassName;
    setTimeout(() => {
        element.className = element.className.replace(flashClassName, '')
    }, 1000)
}

const codeBlockTag = 'DIV';
const codeBlockClassname = 'code-block';
const codeBlockNode = document.createElement(codeBlockTag);
codeBlockNode.className = codeBlockClassname;

const spacerTag = 'SPAN';
const spacerClassName = 'spacer';
const spacerNode = document.createElement(spacerTag);
spacerNode.className = spacerClassName;

const createCodeBlocks = () => {
    const sideBlocks = document.querySelectorAll('#content pre, #content blockquote');
    for (let el, sibling, codeBlock, i = 0; i < sideBlocks.length; i++) {
        el = sideBlocks[i];
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

const createSpacers = () => {
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
        next = siblingElement(block, siblingSelectors, true);
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

const positionBlocksAndSpacers = () => {
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

const toggleNav = () => {
    let nav = document.querySelector('#nav');
    (nav.className.indexOf('open') >= 0) ? nav.classList.remove('open') : nav.classList.add('open');
}

const setupPage = () => {
    setupCodeDisplay();
    createCodeBlocks();
    createSpacers();
}

const onResizeEnd = () => {
    positionBlocksAndSpacers();
    calculateHeadingPositions();
    getHeadingFromScrollPosition();
}

const onScrollEnd = () => {
    setHistory();
}

const setupListeners = () => {
    document.addEventListener("DOMContentLoaded", setupPage);
    window.addEventListener('load', onResizeEnd);
    window.addEventListener('scroll', getHeadingFromScrollPosition);
    let resizeTimeout = eventEnd(window, 'resize', onResizeEnd, 200)
    let scrollTimeout = eventEnd(window, 'scroll', onScrollEnd, 300);
    document.getElementById('active-heading-display').addEventListener('click', toggleNav);
}

// GO
setupListeners();