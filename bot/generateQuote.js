const DIAL_IT_IN = 125;
const MAX_LENGTH = 175;

const buildStartWords = wordStats => {
  const startWords = [];
  for(var prop in wordStats) {
      startWords.push(prop);
  }
  return startWords;
}

const choice = a => {
  const i = Math.floor(a.length * Math.random());
  return a[i];
}

const buildQuote = (stats) => {
  if (!stats) return 'None found';

  let terminals = {};
  const startWords = buildStartWords(stats);
  let word = choice(startWords) || '';
  let title = word;
  while (stats.hasOwnProperty(word)) {
    let nextWords = stats[word];
    word = choice(nextWords);
    title += " " + word;
    if (title.length > DIAL_IT_IN && terminals.hasOwnProperty(word)) break;
  }

  if (title.length > MAX_LENGTH) return buildQuote(stats);
  return title.replace(/[/#"”“!$%^&*;:{}=\-_`~()]/g,"").trim();
}

module.exports = buildQuote;