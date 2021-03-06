const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const _ = require('lodash');
const fs = require('fs-extra');
const sortJson = require('sort-json');
const { transform } = require('./helpers');
const { LOCALES } = require('./const');

const LOCALES_DIR = '../../tolstoy/app/locales';

const LOCALES_PATH = {
    en: path.join(__dirname, LOCALES_DIR, 'en.json'),
    ru: path.join(__dirname, LOCALES_DIR, 'ru-RU.json'),
    ua: path.join(__dirname, LOCALES_DIR, 'ua.json'),
};

const app = express();

app.use(bodyParser.json({
    limit: '5mb',
}));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.post('/api/getLocales', async (req, res) => {
    const locales = {};

    await Promise.all(LOCALES.map(async locale => {
        const json = await fs.readFile(LOCALES_PATH[locale], 'utf-8');

        locales[locale] = JSON.parse(json);
    }));

    res.json({
        locales: transform(locales),
    });
});

app.post('/api/saveLocales', async (req, res) => {
    const data = req.body;

    const locales = {};

    for (let locale of LOCALES) {
        locales[locale] = {};
    }

    step(data, locales, []);

    for (let locale of LOCALES) {
        const json = JSON.stringify(sortJson(locales[locale]), null, 2);
        await fs.writeFile(LOCALES_PATH[locale], json + '\n');
    }

    res.json({
        status: 'ok',
    });
});

if (process.env.NODE_ENV !== 'development') {
    app.use(express.static(path.join(__dirname, '../build')));
}

function step(data, locales, path) {
    for (let key in data) {
        const value = data[key];

        const curPath = [...path, key];

        if (value.__type === 'leaf') {
            for (let locale in value) {
                if (locale === '__type') {
                    continue;
                }
                _.set(locales, [locale, ...curPath], value[locale]);
            }
        } else {
            step(value, locales, curPath);
        }
    }
}

// app.use((req, res) => {
//     res.status(500);
//     res.end('Invalid route');
// });

app.listen(8877, err => {
    if (err) {
        console.error(err);
        process.exit(1);
        return;
    }

    if (process.env.NODE_ENV === 'production') {
        console.log('Translate server listening at http://localhost:8877/');
    } else {
        console.log('Translate server is running.');
    }
});
