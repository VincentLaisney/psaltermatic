const { readFile } = require('fs').promises;

async function populate_with_texts(lang, oratio, json) {
    // Replace keys in json with corresponding texts from data
    const result = {};
    const promises = Object.keys(json).map(async (key) => {
        const textKey = json[key];
        let path = `data/${lang}`;
        textKey.split('_').forEach(k => path += `/${k}`);
        path += '.txt';
        try {
            const text = await readFile(path, 'utf8');
            result[key] = text;
        } catch (err) {
            console.warn(`populate_with_texts: failed to load text for key ${textKey} at path ${path}:`, err.message);
            result[key] = `[[${textKey}]]`;
        }
    });
    promises.push((async () => {
        const path = `data/${lang}/oratio/${oratio}.txt`;
        try {
            const text = await readFile(path, 'utf8');
            result.oratio = (lang === 'la' ? "Orémus. " : "Prions. ") + text;
        } catch (err) {
            console.warn(`populate_with_texts: failed to load oratio for ${oratio} at path ${path}:`, err.message);
            result.oratio = `[[oratio_${oratio}]]`;
        }
    })());

    await Promise.all(promises);
    // console.log('populate_with_texts: loaded texts, returning result object:', result);
    return result;
}

module.exports = { populate_with_texts };
