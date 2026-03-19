/* eslint-disable no-undef */
const { readFile } = require('fs').promises;

async function populate_with_texts(lang, liturgy, json) {
    const oratio = liturgy.ML;
    const dateObj = new Date(liturgy.date);
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

	if ('hymn-hiem' in json && 'hymn-aest' in json) {
		if (dateObj.getMonth() >= 9 || dateObj < liturgy.notable_dates.easter) { // From October to Easter
			json.hymn = json['hymn-hiem'];
		} else {
			json.hymn = json['hymn-aest'];
		}
        delete json['hymn-hiem'];
        delete json['hymn-aest'];
		// console.log(`ordinary(): selected hymn for Dom_laud based on date ${dateObj.toISOString().split('T')[0]}: ${json.hymn}`);
	}

    if ('cant-fer' in json && 'cant-fest' in json) {
        if (liturgy.temporal.startsWith('cendres_') || liturgy.temporal.startsWith('qua_') || liturgy.temporal.startsWith('adv_')) { 
            json.cant = json['cant-fer'];
            json.ant3 = json['ant3-fer'];
        } else {
            json.cant = json['cant-fest'];
            json.ant3 = json['ant3-fest'];
        }
        delete json['cant-fer'];
        delete json['cant-fest'];
        delete json['ant3-fer'];
        delete json['ant3-fest'];
        // console.log(`ordinary(): selected canticle for Laudes based on temporal ${liturgy.temporal}: ${json.cant}`);
    }

    if ('ps1' in json && json.ps1 === 'ps_50' && 'ant1' in json) { // Sabbato ad laudes
        json['ant1'] = getSaturdayFirstAntiphon(liturgy.temporal);
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

function getSaturdayFirstAntiphon(temporal) {
    // voir le tableau, Psautier p. 458
    let antNum = 1; // default for sat. after ash-wedn.
    const temp = temporal.split('_');
    if (temp[0] === 'adv') { 
        antNum = parseInt(temp[1]);
    } else if (temp[0] === 'noel') {
        antNum = parseInt(temp[2]) - 3;  // 2 or 3 to 5 or 6 
    } else if (temp[0] === 'qua') {
        antNum = parseInt(temp[1]) + 1;
    } else if (temp[0] === 'pa') {
        antNum = ( (parseInt(temp[1]) - 1) % 6 ) + 1
    } else {
        antNum = 1;
    }
    // console.log(`getSaturdayFirstAntiphon(): temporal: ${temporal}; temp: ${temp} antNum: ${antNum}.`)
    switch (antNum) {
        case 1:
            return "ant_antiphon_38"; // Miserere
        case 2:
            return "ant_antiphon_45-2"; // Dele Domine
        case 3:
            return "ant_antiphon_52-1"; // Amplius
        case 4:
            return "ant_antiphon_58-2"; // Tibi soli
        case 5:
            return "ant_antiphon_66-1"; // Spiritu pricipali
        case 6:
        default:
            return "ant_antiphon_73-2"; // Benigne fac
    }
}


module.exports = { populate_with_texts };
