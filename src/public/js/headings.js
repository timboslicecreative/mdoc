import {eventEnd, getOffsetTop} from "./utils";

export default class Headings {
    constructor(containerSelector, tocSelector) {
        this.containerSelector = containerSelector;
        this.container = null;
        this.tocSelector = tocSelector;
        this.toc = null;
        this.headings = []
        this.headingsMap = [];
    }

    init() {
        this.container = document.querySelector(this.containerSelector);
        this.toc = document.querySelector(this.tocSelector);
        this.headings = Array.from(document.querySelectorAll('h1, h2, h3'));
        this.calculatePositions();
        window.addEventListener('scroll', this.headingFromScroll.bind(this));
        eventEnd(window, 'scroll', this.setHistory, 300);
    }

    position() {
        this.calculatePositions();
    }

    reposition(){
        this.calculatePositions();
        this.headingFromScroll();
    }

    calculatePositions() {
        for (let heading, i = 0; i < this.headings.length; i++) {
            heading = this.headings[i];
            this.headingsMap.push({
                top: getOffsetTop(heading),
                id: heading.id,
                title: heading.innerText
            });
        }
        for (let i = 0; i < this.headingsMap.length; i++) {
            this.headingsMap[i].bottom = this.headingsMap[i + 1] ? this.headingsMap[i + 1].top : window.innerHeight;
        }
    }

    headingFromScroll() {
        const scrollOffset = 1;
        const top = document.body.scrollTop + scrollOffset;
        const heading = this.headingsMap.find(h => top >= h.top && top <= h.bottom);
        if (!heading) return;
        if (!this.activeHeading || heading.id !== this.activeHeading.id) {
            this.makeActive(heading)
        }
    }

    makeActive (heading) {
        if (this.activeHeading) this.setActiveLink('link-' + this.activeHeading.id, false);
        this.setActiveLink('link-' + heading.id, true);
        this.setActiveHeading(heading.title);
        this.activeHeading = heading;
    }

    setHistory() {
        if (!this.activeHeading) return;
        const state = {url: `#${this.activeHeading.id}`, title: this.activeHeading.innerText};
        history.replaceState(state, state.title, state.url);
    }

    setActiveHeading(text) {
        document.getElementById('active-heading-display').innerText = text;
    }

    setActiveLink(id, active = true) {
        const link = document.getElementById(id);
        active ? link.classList.add('active') : link.classList.remove('active');
        this.openTocList(link, active);
    };

    openTocList (element, open = true) {
        const ul = element.parentNode;
        ul.className = open ? ul.className + ' open' : ul.className.replace(' open', '');
        if (ul.parentNode.tagName === 'LI') this.openTocList(ul.parentNode, open);
    }

}