// General Utilities to help with dom manipulation

export const validTag = (tags, el) => tags.indexOf(el.tagName) >= 0;

export const flashClass = (element, className = 'flash', delay = 1000) => {
    element.classList.add(className);
    setTimeout(() => {
        element.classList.remove(className);
    }, 1000);
}

export const eventEnd = (target, event, fn, delay = 100) => {
    let timeout;
    target.addEventListener(event, () => {
        clearTimeout(timeout);
        timeout = setTimeout(fn, delay);
    });
    return timeout;
};

export const getOffsetTop = el => {
    let offsetTop = 0;
    while (el) {
        offsetTop += el.offsetTop || 0;
        el = el.offsetParent;
    }
    return offsetTop;
};

export const findValidSibling = (el, tags = [], next = true) => {
    let i = 0;
    let max = 100;
    let current = next ? el.nextSibling : el.previousSibling;
    while (i < max && current && tags.indexOf(current.tagName) < 0) {
        current = next ? current.nextSibling : current.previousSibling;
        i++;
    }
    return current || null;
}

export const matchesSelector = (el, selector) => {
    const classNames = selector.split('.');
    const tagName = classNames[0] === '' ? null : classNames.shift();
    if (tagName && el.tagName !== tagName) return false;
    return classNames.length > 0 ? classNames.filter(cname => el.className.indexOf(cname) >= 0).length === classNames.length : true;
}

export const siblingElement = (from, selectors = [], next = true, tags) => {
    if (!from) return null;
    let current = next ? from.nextSibling : from.previousSibling;
    while (current && (!validTag(tags, current) || !selectors.find(selector => matchesSelector(current, selector)))) {
        current = next ? current.nextSibling : current.previousSibling;
    }
    return current || null;
}
