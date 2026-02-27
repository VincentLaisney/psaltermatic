const { de } = require('date-fns/locale');
const { getLiturgyForDate } = require('./liturgy');

const { readFile } = require('fs').promises;

async function populate_with_texts(lang, liturgy, json) {
    const oratio = liturgy.ML;
    if ('salve_regina' in json && 'ave_regina' in json) {
        maria_ant = liturgy.maria_ant;
        // console.log(`populate_with_texts: including Marian antiphon ${maria_ant} in result for language ${lang}`);
        json["maria_ant"] = json[maria_ant];
        delete json['salve_regina'];
        delete json['ave_regina'];
        delete json['regina_caeli'];
        delete json['alma_redemp'];
        // console.log(`populate_with_texts: json after adding maria_ant key:`, json);
    }
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

    if ('benedictus' in json) {
        const path = `data/${lang}/benedictus/${liturgy.ML}.txt`;
        promises.push((async () => {
            try {
                const text = await readFile(path, 'utf8');
                result['benedictus'] = text;
            } catch (err) {
                console.warn(`populate_with_texts: failed to load benedictus for ${liturgy.ML} at path ${path}:`, err.message);
                result['benedictus'] = `[[benedictus_${liturgy.ML}]]`;
            }
        })());
    };

    if ('magnificat' in json) {
        const path = `data/${lang}/magnificat/${liturgy.ML}.txt`;
        promises.push((async () => {
            try {
                const text = await readFile(path, 'utf8');
                result['magnificat'] = text;
            } catch (err) {
                console.warn(`populate_with_texts: failed to load magnificat for ${liturgy.ML} at path ${path}:`, err.message);
                result['magnificat'] = `[[magnificat_${liturgy.ML}]]`;
            }
        })());
    };

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
