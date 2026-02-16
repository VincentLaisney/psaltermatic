function getLiturgyForDate(date0) {
  const date = new Date(date0);
  const weekNumber = Math.floor((dayOfYear(date) - date.getDay()) / 7);
  const {season, number} = getLiturgicalTempusForDate(weekNumber, date); 
  const ML_nr = weekNumber - 3;
  const ML = (ML_nr <= 3) ? `sept${ML_nr}` : `quad${ML_nr - 3}`;
  const maria_ant = getMariaAntiphonForDate(date, season);
  const notable_dates = {easter: getEasterDate(date.getFullYear()), advent: getAdvent(date.getFullYear()), lent: new Date(getEasterDate(date.getFullYear()).getTime() - 46 * 24 * 60 * 60 * 1000), pentecost: new Date(getEasterDate(date.getFullYear()).getTime() + 49 * 24 * 60 * 60 * 1000)};
  
  return ({asText: `De ea. ${number}ᵉ semaine du ${season}`, Matines: getMatinesForm(date), ML: ML, maria_ant: maria_ant, notable_dates: notable_dates});
}

function getLiturgicalTempusForDate(weekNumber, date) {
  const easter= getEasterDate(date.getFullYear());
  if (weekNumber >= 0 && weekNumber <= 6) {
    return {    season: 'Temps ordinaire', number: weekNumber   };
  } else if (date >= easter - 46 * 24 * 60 * 60 * 1000 && date < easter) {
    return {    season: 'Carême', number: weekNumber - 6   };
  } else if ((date >= easter) && date < new Date(easter).getTime() + 49 * 24 * 60 * 60 * 1000) {
    return {    season: 'Pâques', number: date.getDate() - easter.getDate() + 1     };
  } else if (date >= getAdvent(date.getFullYear()) && date < new Date(date.getFullYear(), 11, 25)) {
    return {    season: 'Avent', number: 1 + Math.floor((date - getAdvent(date.getFullYear())) / (7 * 24 * 60 * 60 * 1000))   };  
  } else {
    return {    season: 'Temps ordinaire', number: weekNumber - 6   };
  }
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
  
  return new Date(year, month - 1, day + 1);
}

function getAdvent(year) {
  const christmas = new Date(year, 11, 25);
  const dayOfWeek = christmas.getDay();
  const adventStart = new Date(christmas.getTime() - (((dayOfWeek || 7) + 20) * 24 * 60 * 60 * 1000));
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

module.exports = { getLiturgyForDate }; 
