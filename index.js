

require('dotenv').config({path: __dirname + '/.env'});
const getHistory = require('./getHistories');;
const getUsers = require('./getUsers')
const data = require('./data');
const buildAllWordStats = require('./buildMap');
const saveToBucket = require('./saveToBucket');

(async () => {
  console.log('starting up  =>');
  const lastMessageTimeStamp = await data.getLastMessage();
  const history = await getHistory.grabAllMessages(lastMessageTimeStamp);
  await data.dumpMessagesIntoDatabase(history);
  const users = await getUsers();
  await data.dumpUsersIntoDatabase(users);
  const userMap = await buildAllWordStats();
  saveToBucket('wordStatsForSite.json');
  console.log('and we are done')
})();
