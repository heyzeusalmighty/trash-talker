require('dotenv').config({path: __dirname + '/.env'});
const fs = require('fs');
const util = require('util');
const writeFile = util.promisify(fs.writeFile);
const getHistory = require('./getHistories');
const getUsers = require('./getUsers');
const data = require('./data');
const saveToBucket = require('./saveToBucket');

const acceptableReactions = [
  'man-running',
  'man-mountain-biking',
  'man-swimming',
  'swimmer',
  'runner',
  'soccer',
  'ab',
  'man-biking',
  'man-lifting-weights'
];

(async () => {
  // build user lookup
  const users = await getUsers();
  const userMap = users.reduce((acc, curr) => {
    acc[curr.id] = curr.display_name || curr.real_name || curr.name || 'Unknown';
    return acc;
  }, {});

  const lastTs = await data.getLastFeat();
  const admin = process.env.ADMIN;
  const channelId = process.env.FEATS_CHANNEL_ID;
  const messages = await getHistory.getTotalHistory(channelId, [], undefined, lastTs);

  const reactified = [];

  const processMessage = async (msg) => {
    const reactions = await getHistory.getReactionsForMessage(channelId, msg.ts);
    if (reactions && reactions.length) {
      console.log(reactions);
      const athleteName = userMap[msg.user] || 'Unknown Athlete';
      const emotes = reactions.map(reaction => {
        return {
          name: reaction.name,
          congrats: reaction.users.map(usr => userMap[usr] || 'who')
        }
      });
      const record = {
        name: athleteName,
        message: msg.message,
        reactions: emotes,
        ts: msg.ts,
      }
      reactified.push(record);
    }
  }

  const timeout = ms => new Promise(resolve => setTimeout(resolve, ms));

  for (const msg of messages) {
    await Promise.all([
      await processMessage(msg),
      timeout(1000)
    ])
  }

  const filtered = reactified.filter(x => {
    const { reactions } = x;
    const valid = reactions.filter(reaction => {
      const validReaction = acceptableReactions.includes(reaction.name);
      const hasAdmin = reaction.congrats.includes(admin);
      return validReaction && hasAdmin;
    });
    return (valid.length);
  });

  const done = filtered.map(x => ({ user: x.name, message: x.message, ts: x.ts }));
  await writeFile('./clean-feats.json', JSON.stringify(done));
  await data.dumpFeatsIntoDatabase(done);
  saveToBucket('clean-feats.json');
})();
