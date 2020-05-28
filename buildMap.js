const fs = require('fs');
const util = require('util');
const writeFile = util.promisify(fs.writeFile);
const data = require('./data.js');

const buildWordStats = async messages => {
  const startWords = [];
  const terminals = {};
  const wordStats = {};

  for (const msg of messages) {
    const words = msg.message.split(' ');
    terminals[words[words.length-1]] = true;
    startWords.push(words[0]);
    for (var j = 0; j < words.length - 1; j++) {
      if (wordStats.hasOwnProperty(words[j])) {
          wordStats[words[j]].push(words[j+1]);
      } else {
          wordStats[words[j]] = [words[j+1]];
      }
  }
  }
  return wordStats;
};

const buildAllWordStats = async () => {
  const users = await data.getAllUsers();
  // console.log(users);
  const userMap = {};
  for (const user of users) {
    const messages = await data.getUserMessages(user.id);
    // console.log(messages);
    const wordStats = await buildWordStats(messages);
    userMap[user.real_name] = {
      stats: wordStats,
      count: messages.length,
    };
  }
  await writeFile('./wordStatsForSite.json', JSON.stringify(userMap));
  return userMap;
}


module.exports = buildAllWordStats;