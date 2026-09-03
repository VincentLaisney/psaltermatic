function getLiturgyForDate(date0) {
  const date = new Date(date0);
//   const weekNumber = Math.floor((dayOfYear(date) - date.getDay()) / 7);
//   const ML_nr = weekNumber - 3;
//   const ML = (ML_nr <= 3) ? `sept${ML_nr}` : `quad${ML_nr - 3}`;
  const tempo = get_tempo(date); // or date0 ?
  const {season, number} = getLiturgicalTempusForDate(tempo.tempo); 
  const maria_ant = getMariaAntiphonForDate(date, tempo.tempo);
  const notable_dates = {easter: getEasterDate(date.getFullYear()), advent: getAdventStart(date.getFullYear()), lent: new Date(getEasterDate(date.getFullYear()).getTime() - 46 * 24 * 60 * 60 * 1000), pentecost: new Date(getEasterDate(date.getFullYear()).getTime() + 49 * 24 * 60 * 60 * 1000)};
  
  return ({
    asText: `De ea. ${number}ᵉ semaine du ${season}`, 
    date: date0,
    matines: getMatinesForm(date), 
    ML: tempo.ML, 
    maria_ant: maria_ant, 
    notable_dates: notable_dates, 
    temporal: tempo.tempo, 
    prov_test: tempo.prov_test,
    year_letter: getYearLetter(date.getFullYear()),
    hebdomada: Math.floor(dateDiffInDays(precSunday(date), new Date(2011,11,27)) / 7) % 2,
    })
}

function precSunday(date) {
  const diff = date.getDay();
  const prevSunday = new Date(date);
  prevSunday.setDate(date.getDate() - diff);
  return prevSunday;
}

function dateDiffInDays(date1, date2) {
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;
//   const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
//   const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
  return Math.floor((date1 - date2) / _MS_PER_DAY);
}

function getLiturgicalTempusForDate(tempo) {
  const tempo_parts = tempo.split('_');
  const season = tempo_parts[0];
  const weekNumber = parseInt(tempo_parts[1], 10);
  switch (season) {
    case 'adv':
      return { season: 'Avent', number: weekNumber };
    case 'vil':
      return { season: 'Temps de Noël', number: 4 };
    case 'noel':
      return { season: 'Temps de Noël', number: 1 };
    case 'ste':
      return { season: 'Temps de Noël', number: 2 };
    case 'qua':
      return { season: 'Carême', number: weekNumber - 6 };
    case 'cendres':
      return { season: 'Carême', number: weekNumber - 6 };
    case 'tp':
      return { season: 'Pâques', number: weekNumber - 6 };
    case 'pa':
      return { season: 'Temps ordinaire', number: weekNumber };
     default:
      return { season: 'Temps ordinaire', number: weekNumber - 6 };
  }
}

function get_tempo(dateRaw) {
    // Returns the temporal ref according to the given date.
    const date = new Date(dateRaw.getFullYear(), dateRaw.getMonth(), dateRaw.getDate()); // Normalize to midnight local time
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
        holy_family.addDaysToDate(6 - christmas.getDay());
        if (christmas.getDay() !== 1) { // Monday in JS
            baptism_of_christ = new Date(holy_family);
            baptism_of_christ.addDaysToDate(14);
        } else {
            baptism_of_christ = new Date(liturgical_year, 0, 7);
        }
    }

    const easter = getEasterDate(liturgical_year);
    const septuagesim = new Date(easter);
    septuagesim.substractDaysFromDate(63);
    const ash = new Date(easter);
    ash.substractDaysFromDate(46);
    const pentecost = new Date(easter);
    pentecost.addDaysToDate(49);
    const first_sunday_of_next_advent = getAdventStart(liturgical_year);
    const christ_king = new Date(first_sunday_of_next_advent);
    christ_king.substractDaysFromDate(7);

    prov_test.date = date;
    prov_test.first_sunday_of_advent = first_sunday_of_advent;
    prov_test.christmas = christmas;
    prov_test.christmas_next = christmas_next;
    prov_test.holy_family = holy_family;
    prov_test.baptism_of_christ = baptism_of_christ;
    prov_test.septuagesim = septuagesim;
    prov_test.ash = ash;
    prov_test.easter = easter;
    prov_test.pentecost = pentecost;
    prov_test.first_sunday_of_next_advent = first_sunday_of_next_advent;
    prov_test.christ_king = christ_king;

    let tempo = null;
    let ML = null;

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
        if (date >= septuagesim && date < ash) {
            const days = daysBetween(date, septuagesim);
            const week = Math.floor(days / 7) + 1;
            ML = `sept_${week}_${weekday}`;
        } else {
            ML = `epi_${week}_${weekday}`;
        }
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
            d.addDaysToDate(days);
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
            const daysSincePentecost = daysBetween(date, pentecost);
            const weekSincePentecost = Math.floor(daysSincePentecost / 7);
            ML = `pent_${weekSincePentecost}_${weekday}`;
            // TODO Dimanches après l'épiphanie à réinsérer ici.
        }
    }
    if (!ML) {
        ML = tempo;
    }
    return {tempo, ML, prov_test};
}

function getMariaAntiphonForDate(date, tempo) {
  // console.log(`getMariaAntiphonForDate(): determining Marian antiphon for season ${season} and date ${date.toISOString().split('T')[0]}`);
  const dateObj = new Date(date);
  if (dateObj >= new Date(dateObj.getFullYear(), 2 - 1, 2) && dateObj < getEasterDate(dateObj.getFullYear())) {
    return 'ave_regina';
  } else if (tempo.startsWith('tp_') || tempo === 'pa_9_0') { // Add Penstecost
    return 'regina_caeli';
  } else if (dateObj >= getAdventStart(dateObj.getFullYear()) || dateObj < new Date(dateObj.getFullYear(), 2 - 1, 2)) {
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
const DAY_IN_MS = 1000 * 60 * 60 * 24;
Date.prototype.substractDaysFromDate = function (diff) {
    this.setTime(this.getTime() - diff * DAY_IN_MS);
    return this;
}

Date.prototype.addDaysToDate = function (diff) {
    this.setTime(this.getTime() + diff * DAY_IN_MS);
    return this;
}

// eslint-disable-next-line no-undef
module.exports = { getLiturgyForDate }; 
