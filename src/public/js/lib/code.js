import {flashClass} from "./utils";
import ClipboardJS from 'clipboard';


const copyButtonNode = document.createElement('button');
copyButtonNode.className = 'copy';

const labelNode = document.createElement('span');
labelNode.className = "language-label"

const makeLanguageSelect = (languages) => {
    const label = document.createElement('label');
    label.classList.add('select-language');

    const select = document.createElement('select');
    for (let option, i =0; i < languages.length; i++){
        option = document.createElement('option');
        option.value = languages[i].name;
        option.innerText = languages[i].label;
        select.appendChild(option);
    }

    select.classList.add('input-language');
    label.appendChild(select);

    return label;
}

export default class Code {
    constructor(containerSelector, {languages, defaultLanguage}) {
        this.cotainer = null;
        this.languages = languages;
        this.defaultLanguage = defaultLanguage;
        this.containerSelector = containerSelector;
        this.elements = [];
        this.supportedElements = [];
        this.languageInputs = [];
        this.languageSelectNode = makeLanguageSelect(languages, defaultLanguage);
    }

    init() {
        this.container = document.querySelector(this.containerSelector);
        if (!this.container) return console.error(`Code could not find container ${this.containerSelector}`);
        this.elements = Array.from(this.container.querySelectorAll('pre > code'));
        this.addControls();
        this.addClipboard();
        this.changeLanguage(this.defaultLanguage.name);
    }

    addControls() {
        const {languageInputs, changeLanguageHandler} = this;
        this.elements.forEach(el => {
            const language = (el.className.match(/language-([^\s$]*)/) || ['', 'unknown'])[1];
            const languageInput = this.languageSelectNode.cloneNode(true);

            el.dataset.language = language;
            languageInput.addEventListener('change', changeLanguageHandler.bind(this));

            if (supportedLanguages.find(l => l.name === language)) {
                el.parentNode.insertBefore(languageInput, el);

                languageInputs.push(languageInput.querySelector('select'));
                this.supportedElements.push(el);

            } else {
                const label = labelNode.cloneNode(true);
                label.innerText = language;
                el.parentNode.insertBefore(label, el);
            }
            el.parentNode.insertBefore(copyButtonNode.cloneNode(), el);
        });
    }

    addClipboard() {
        this.clipboard = new ClipboardJS('.copy', {
            text: (trigger) => trigger.nextSibling.innerText
        }).on('success', (e) => flashClass(e.trigger.nextSibling));
    }

    changeLanguage(lang) {
        if (!this.languages.find(l => l.name === lang)) return;
        this.languageInputs.forEach(input => input.value = lang);
        this.supportedElements.forEach(el => {
            el.parentNode.style.display = el.dataset.language === lang ? 'block' : 'none';
        })
    }

    changeLanguageHandler(e) {
        this.changeLanguage(e.target.value);
    }

}
