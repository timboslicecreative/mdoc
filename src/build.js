const fs = require('fs');
const path = require('path');
const handlebars = require('express-handlebars');
const {getDocuments} = require('./lib/documents');
const helpers = require('./lib/helpers');
const config = require('./lib/config');

const hbs = handlebars.create({
    layoutsDir: 'views/layouts',
    partialsDir: 'views/partials',
    defaultLayout: 'main',
    helpers: helpers,
    extname: '.hbs'
});

const DOCUMENTS_PATH = path.join(__dirname, config.documentsPath || 'documents');

// GO!
const pathOptions = {
    templatePath: './views',
    outputPath:  './build/',
};

const views = ['index'];

const outputTemplates = async function(views, options = {}){
    console.log('Output Templates: ', views, options)

    if (!options.templatePath) return console.log('no templatePath provided');
    if (!options.outputPath) return console.log('no outputPath provided');

    let documents = await getDocuments(DOCUMENTS_PATH);

    function buildTemplate(view){
        console.log('Building Template:', view);

        let templateFile = path.join(__dirname, options.templatePath, view + '.hbs');
        let outputFile = path.join(__dirname, options.outputPath, view + '.html');

        const data = {
            documents: documents,
            ...config
        }

        hbs.renderView(templateFile, data, function(error, hbsTemplate){
            if (error) return console.log('Error rendering ' + templateFile, error);
            fs.writeFile(outputFile, hbsTemplate, function(err) {
                if(err) {
                    return console.log('error writing file' + outputFile, err);
                }
                else {
                    console.log('Output:' + outputFile);
                }
            });
        });
    }

    views.forEach(v => buildTemplate(v));
};


// Start
(async () => {
    try {
        console.log('MDoc Build...');
        await outputTemplates(views, pathOptions);
    } catch (err) {
        console.log(err);
    }
})();

