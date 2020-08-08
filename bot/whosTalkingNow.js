const whosTalkingNow = (talker, wordStats) => {
  const makeTheBestPick = require('./bestPick');
  const generateQuote = require('./generateQuote');
  const talkers = Object.keys(wordStats);

  const bestPick = makeTheBestPick(talker, talkers);
  if (!bestPick) {
    return '¯\\_(ツ)_/¯';
  }

  const talkingWords = wordStats[bestPick];
  if (!talkingWords) {
    return `¯\\_(ツ)_/¯   no words for ${bestPick}`;
  }

  return generateQuote(talkingWords.stats);
};

module.exports = whosTalkingNow;