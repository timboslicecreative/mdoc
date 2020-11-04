const path = require('path');
const express = require("express");
const handlebars = require('express-handlebars');
const {getDocuments} = require('./lib/documents');
const helpers = require('./lib/helpers');
const config = require('./lib/config');

// Configuration
const app = express();
const DOCUMENTS_PATH = path.join(__dirname, config.documentsPath || 'documents');

// Setup public folder
app.use(express.static('public'));

// Setup Handlebars
// handlebars.registerHelper('markdown', markdown());
app.engine('.hbs', handlebars({
    extname: '.hbs',
    helpers
}));
app.set('view engine', '.hbs');

(async () => {
    try {
        let documents = await getDocuments(DOCUMENTS_PATH);
        app.get('/', async function (req, res) {
            //TODO: remove this, only needed for development
            if (process.env.NODE_ENV !== 'production') documents = await getDocuments(DOCUMENTS_PATH);
            res.render('index', {
                documents: documents,
                ...config
            });
        });
        const server = app.listen(process.env.PORT || 5000, function () {
            console.log(`Server running on port: ${server.address().port}`);
        });
    } catch (err) {
        console.error(err);
    }
})();


