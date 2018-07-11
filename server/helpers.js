function transform(locales) {
    const store = {};

    for (let locale of ['en', 'ru']) {
        step(locales[locale], '', store, locale);
    }

    return store;
}

function step(data, rootPath, store, locale) {
    for (let key in data) {
        const value = data[key];

        if (typeof value === 'string') {
            set(store, rootPath, key, locale, value);
        } else {
            step(value, rootPath + '.' + key, store, locale);
        }
    }
}

function set(store, path, key, locale, value) {
    const realPath = path.split('.').filter(d => d);

    let data = store;

    for (let part of realPath) {
        let nextData = data[part];

        if (!nextData) {
            nextData = {
                //__type: 'node',
            };
            data[part] = nextData;
        }

        data = nextData;
    }

    let keyData = data[key];

    if (!keyData) {
        keyData = {
            __type: 'leaf',
        };
        data[key] = keyData;
    }

    keyData[locale] = value;
}

module.exports = {
    transform,
};
