function getLiturgyForDate(date0) {
  const date = new Date(date0);
  const weekNumber = Math.floor((dayOfYear(date) - date.getDay()) / 7);
  const {season, number} = getLiturgicalTempusForDate(weekNumber, date); 
  const ML_nr = weekNumber - 3;
  const ML = (ML_nr <= 3) ? `sept${ML_nr}` : `quad${ML_nr - 3}`;
  const maria_ant = getMariaAntiphonForDate(date, season);
  const notable_dates = {easter: getEasterDate(date.getFullYear()), advent: getAdventStart(date.getFullYear()), lent: new Date(getEasterDate(date.getFullYear()).getTime() - 46 * 24 * 60 * 60 * 1000), pentecost: new Date(getEasterDate(date.getFullYear()).getTime() + 49 * 24 * 60 * 60 * 1000)};
  
  return ({asText: `De ea. ${number}ᵉ semaine du ${season}`, Matines: getMatinesForm(date), 
      ML: ML, maria_ant: maria_ant, notable_dates: notable_dates, temporal: get_tempo(date).tempo, 
      prov_test: get_tempo(date).prov_test,
      year_letter: getYearLetter(date.getFullYear())});
}

function getLiturgicalTempusForDate(weekNumber, date) {
  const easter= getEasterDate(date.getFullYear());
  if (weekNumber >= 0 && weekNumber <= 6) {
    return {    season: 'Temps ordinaire', number: weekNumber   };
  } else if (date >= easter - 46 * 24 * 60 * 60 * 1000 && date < easter) {
    return {    season: 'Carême', number: weekNumber - 6   };
  } else if ((date >= easter) && date < new Date(easter).getTime() + 49 * 24 * 60 * 60 * 1000) {
    return {    season: 'Pâques', number: date.getDate() - easter.getDate() + 1     };
  } else if (date >= getAdventStart(date.getFullYear()) && date < new Date(date.getFullYear(), 11, 25)) {
    return {    season: 'Avent', number: 1 + Math.floor((date - getAdventStart(date.getFullYear())) / (7 * 24 * 60 * 60 * 1000))   };  
  } else {
    return {    season: 'Temps ordinaire', number: weekNumber - 6   };
  }
}

function get_tempo(date) {
    // Returns the tempo ref according to the given date.
    const prov_test = {};
    const weekday = date.getDay(); // JS: Sunday=0, Python: Monday=0, Sunday=6
    const liturgical_year = getLiturgicalYear(date);
    const first_sunday_of_advent = getAdventStart(liturgical_year - 1);
    const christmas = new Date(liturgical_year - 1, 11, 25); // month is 0-based in JS
    const christmas_next = new Date(date.getFullYear(), 11, 25);

    let holy_family, baptism_of_christ;
    if (christmas.getDay() === 0) { // Sunday in JS
        holy_family = new Date(liturgical_year - 1, 11, 30);
        baptism_of_christ = new Date(liturgical_year, 0, 7);
    } else {
        holy_family = new Date(christmas);
        holy_family.setDate(christmas.getDate() + (6 - christmas.getDay()));
        if (christmas.getDay() !== 1) { // Monday in JS
            baptism_of_christ = new Date(holy_family);
            baptism_of_christ.setDate(holy_family.getDate() + 14);
        } else {
            baptism_of_christ = new Date(liturgical_year, 0, 7);
        }
    }

    const easter = getEasterDate(liturgical_year);
    const ash = new Date(easter);
    ash.setDate(easter.getDate() - 46);
    const pentecost = new Date(easter);
    pentecost.setDate(easter.getDate() + 49);
    const first_sunday_of_next_advent = getAdventStart(liturgical_year);
    const christ_king = new Date(first_sunday_of_next_advent);
    christ_king.setDate(first_sunday_of_next_advent.getDate() - 7);

    prov_test.first_sunday_of_advent = first_sunday_of_advent;
    prov_test.christmas = christmas;
    prov_test.christmas_next = christmas_next;
    prov_test.holy_family = holy_family;
    prov_test.baptism_of_christ = baptism_of_christ;
    prov_test.ash = ash;
    prov_test.easter = easter;
    prov_test.pentecost = pentecost;
    prov_test.first_sunday_of_next_advent = first_sunday_of_next_advent;
    prov_test.christ_king = christ_king;

    let tempo = null;

    function daysBetween(d1, d2) {
        return Math.floor((d1 - d2) / (1000 * 60 * 60 * 24));
    }

    if (date >= first_sunday_of_advent && date < christmas) {
        if (date.getDate() < 17 || weekday === 0) {
            const days = daysBetween(date, first_sunday_of_advent);
            const week = Math.floor(days / 7) + 1;
            tempo = `adv_${week}_${weekday}`;
        } else if (date.getDate() < 24) {
            tempo = `adv_ult_${weekday}`;
        } else {
            tempo = 'vil_noel';
        }
    } else if (date >= christmas && date < baptism_of_christ) {
        // TODO: À affiner (ici, seulement les jours après Noël et la Ste Famille "dimanche" (cas le plus fréquent)).
        // Cas de la Ste Famille le 30 ('ste_famille_fer').
        // Féries après le 1er janvier jusqu'au Baptême ('noel_time_2' et 'noel_time_3').
        if (weekday === 0) {
            tempo = 'ste_famille_dim';
        } else {
            tempo = 'noel_time_1';
        }
    } else if (date >= baptism_of_christ && date < ash) {
        const days = daysBetween(date, baptism_of_christ);
        const week = Math.floor(days / 7) + 1;
        tempo = `pa_${week}_${weekday}`;
    } else if (date >= ash && date < easter) {
        const days = daysBetween(date, ash);
        if (days < 4) {
            tempo = `cendres_${days}`;
        } else {
            const week = Math.floor((days + 3) / 7);
            tempo = `qua_${week}_${weekday}`;
        }
    } else if (date >= easter && date <= pentecost) {
        const days = daysBetween(date, easter);
        const week = Math.floor(days / 7) + 1;
        tempo = `tp_${week}_${weekday}`;
    } else if (date >= pentecost && date < first_sunday_of_next_advent) {
        const pentecostPlus = (days) => {
            const d = new Date(pentecost);
            d.setDate(pentecost.getDate() + days);
            return d;
        };
        if (date.getTime() === pentecostPlus(7).getTime()) {
            tempo = 'trinite';
        } else if (date.getTime() === pentecostPlus(11).getTime()) {
            tempo = 'fete_dieu';
        } else if (date.getTime() === pentecostPlus(19).getTime()) {
            tempo = 'sacre_coeur';
        } else if (date.getTime() === pentecostPlus(20).getTime()) {
            tempo = 'icm';
        } else if (date.getTime() === christ_king.getTime()) {
            tempo = 'christ_roi';
        } else {
            const days = daysBetween(first_sunday_of_next_advent, date);
            const week = 35 - Math.floor(days / 7 + (weekday !== 0 ? 1 : 0));
            tempo = `pa_${week}_${weekday}`;
        }
    }
    return {tempo, prov_test};
}

function getMariaAntiphonForDate(date, season) {
  // console.log(`getMariaAntiphonForDate(): determining Marian antiphon for season ${season} and date ${date.toISOString().split('T')[0]}`);
  if (season === 'Carême') {
    return 'ave_regina';
  } else if (season === 'Pâques') {
    return 'regina_caeli';
  } else if (season === 'Avent') {
    return 'alma_redemp';
  } else {
    return 'salve_regina';
  }
}

function getYearLetter(year) {
    // Returns the letter of the Sundays for the given year (A, B or C).
    const letters = ["A", "B", "C"];
    const year_letter = letters[(year - 2011) % 3];
    return year_letter;
}

function getLiturgicalYear(date) {
    // Return the liturgical year of the given date.
    const firstSundayOfAdvent = getAdventStart(date.getFullYear());
    return (date < firstSundayOfAdvent ? date.getFullYear() : date.getFullYear() + 1);
}

function getEasterDate(year) {
  const f = Math.floor,
    G = year % 19,
    C = f(year / 100),
    H = (C - f(C / 4) - f((8 * C + 13) / 25) + 19 * G + 15) % 30,
    I = H - f(H / 28) * (1 - f(29 / (H + 1)) * f((21 - G) / 11)),
    J = (year + f(year / 4) + I + 2 - C + f(C / 4)) % 7,
    L = I - J,
    month = 3 + f((L + 40) / 44),
    day = L + 28 - 31 * f(month / 4);
  
  return new Date(year, month - 1, day);
}

function getAdventStart(year) {
  const christmas = new Date(year, 11, 25);
  const dayOfWeek = christmas.getDay();
  const adventStart = new Date(christmas.getTime() - (((dayOfWeek || 7) + 21) * 24 * 60 * 60 * 1000));
  return adventStart;
}

function getMatinesForm(date) {
  const dayOfWeek = date.getDay();
  if (dayOfWeek !== 0) {
    return 'simple';
  } else  {
    return '2noct';
  }
  // 3noct for the solemnities. TODO
}

function dayOfYear(date) { 
    return Math.floor((date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)) 
}

// eslint-disable-next-line no-undef
module.exports = { getLiturgyForDate }; 
