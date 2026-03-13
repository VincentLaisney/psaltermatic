/* eslint-disable no-undef */
const db = require('../db');
const { populate_with_texts } = require('./populate');
const { getLiturgyForDate } = require('./liturgy');

async function ordinary(date, hour, lang = 'la') {
	// date: Date or date-string; hour: string like 'Sexte' or 'Matines'
	const dateObj = (date instanceof Date) ? date : new Date(Date.parse(date) || Date.now());

	const day_to_feria = {
		0: 'Dom',
		1: 'F2',
		2: 'F3',
		3: 'F4',
		4: 'F5',
		5: 'F6',
		6: 'Sab'
	};

	const hour_abbr = {
		'Matines-Laudes': 'mat_laud',
		'Matines': 'mat',
		'Laudes': 'laud',
		'Tierce': 'tier',
		'Sexte': 'sext',
		'None': 'non',
		'Vêpres': 'vep',
		'Complies': 'comp'
	};

	const liturgy = getLiturgyForDate(date);

	if (hour === 'Messe') {
		if (dateObj.getDay() === 0) { // Sunday
			return await populate_with_texts(lang, liturgy, {reading: `${liturgy.temporal}_${liturgy.year_letter}_1`, reading_2: `${liturgy.temporal}_${liturgy.year_letter}_2`, gospel: `${liturgy.temporal}_${liturgy.year_letter}_ev`});
		} else if (liturgy.temporal.startsWith('pa_')) { // per annum
			const even_num = dateObj.getFullYear() % 2 === 0 ? 2 : 1; // alternate between the two sets of readings each year
			return await populate_with_texts(lang, liturgy, {reading: `${liturgy.temporal}_${even_num}_1`, reading_2: `${liturgy.temporal}_${even_num}_2`, gospel: `${liturgy.temporal}_${even_num}_ev`});
		} else {
			return await populate_with_texts(lang, liturgy, {reading: `${liturgy.temporal}_1`, reading_2: '`${liturgy.temporal}_2`', gospel: `${liturgy.temporal}_ev`});
		}
	}


	let abbr_day = day_to_feria[dateObj.getDay()];
	abbr_day = (hour === 'Complies') ? 'Dom' : abbr_day; // Compline of Sunday is repeated each day.
	const name = `${abbr_day}_${hour_abbr[hour]}`;
    // console.log(`ordinary(): fetching content for ${name} (${lang}) and date ${dateObj.toISOString().split('T')[0]}`);

	let psalter = null;
	let commun = null;

	// Try DB lookup for both psalter and commun. All for latin because the index is done on the latin base.
	try {
		const rows = await db.query('SELECT content FROM hours WHERE name = ? AND lang = "la"', [name]);
		if (rows && rows.length) psalter = rows[0].content;
        // console.log(`ordinary(): DB lookup successful for ${name} (${lang}) - psalter content: ${JSON.stringify(psalter)}`);
	} catch (e) {
		// ignore DB errors
		console.warn('ordinary(): DB lookup failed for psalter', e.message);
	}

	try {
		const rows = await db.query('SELECT content FROM hours WHERE name = "Com_com" AND lang = "la"');
		if (rows && rows.length) commun = rows[0].content;
        // console.log(`ordinary(): DB lookup successful for Com_com (${lang}) - commun content: ${commun}`);
	} catch (e) {
		console.warn('ordinary(): DB lookup failed for commun', e.message);
	}


	return await populate_with_texts(lang, liturgy, {...psalter, ...commun });
}

// eslint-disable-next-line no-undef
module.exports = { ordinary };
