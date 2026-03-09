/* eslint-disable no-undef */
const { readFile } = require('fs').promises;

async function populate_with_texts(lang, liturgy, json) {
    const oratio = liturgy.ML;
    if ('salve_regina' in json && 'ave_regina' in json) {
        const maria_ant = liturgy.maria_ant;
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
        if (['schema'].includes(key)) {
            // console.log(`populate_with_texts: skipping text loading for key ${key} with value ${textKey} as it's a special key.`);
            result[key] = textKey;
            return;
        }

        if (['reading', 'reading_2', 'gospel'].includes(key) ) {
            if (lang !== 'fr') {
                result[key] = "";
                return;
            }
            let path = "../../abbaye/abbaye/apps/livrets/static/livrets/data/lectures/";
            path += `${textKey}.txt`;
            try {
                const text = await readFile(path, 'utf8');
                result[key] = { text: text.replaceAll("~", " ") }; // replace non-breaking spaces
                path = path.replace(/\.txt$/, '.ref');
                const refText = await readFile(path, 'utf8');
                result[key].ref = refText.trim();
            } catch (err) {
                if (err.code === 'ENOENT' && key === 'reading_2') {
                    // If the second reading is not found, it's not a critical error, we can just ignore it.
                    result[key] = "";
                    return;
                }
                console.warn(`populate_with_texts: failed to load lecture text for key ${key} with value ${textKey} at path ${path}:`, err.message);
                result[key] = { text: `[[${textKey}]]`, ref: "" };
            }
            return;
        }

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

    if ('benedictus' in json && json['benedictus'] === 'ant_antiphon_129') { // Antiphona propria
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

    if ('magnificat' in json && json['magnificat'] === 'ant_antiphon_129') { // Antiphona propria
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
