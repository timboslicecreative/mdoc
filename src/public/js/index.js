import {eventEnd} from './utils';
import Layout from './layout';
import Code from './code';
import Headings from './headings';

const toggleNav = () => {
    let nav = document.querySelector('#nav');
    (nav.className.indexOf('open') >= 0) ? nav.classList.remove('open') : nav.classList.add('open');
}

let layout = new Layout('#content');
let headings = new Headings('#content', '#nav .toc');
let code = new Code('#content', {
    languages: window.supportedLanguages,
    defaultLanguage: window.supportedLanguages[0]
});

const setupPage = () => {
    code.init();
    layout.init();
    headings.init();
}

const onResizeEnd = () => {
    layout.position();
    headings.reposition();
}

const setupListeners = () => {
    document.addEventListener("DOMContentLoaded", setupPage);
    window.addEventListener('load', onResizeEnd);
    eventEnd(window, 'resize', onResizeEnd, 200);
    document.getElementById('active-heading-display').addEventListener('click', toggleNav);
}

// GO
setupListeners();