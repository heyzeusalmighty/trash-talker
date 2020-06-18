

require('dotenv').config({path: __dirname + '/.env'});
const getHistory = require('./getHistories');;
const getUsers = require('./getUsers')
const data = require('./data');
const buildAllWordStats = require('./buildMap');
const saveToBucket = require('./saveToBucket');

(async () => {
  console.log('starting up  =>')
  const history = await getHistory();
  await data.dumpMessagesIntoDatabase(history);
  const users = await getUsers();
  await data.dumpUsersIntoDatabase(users);
  const userMap = await buildAllWordStats();
  saveToBucket();
  console.log('and we are done')
})();