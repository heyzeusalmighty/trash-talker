require('dotenv').config({path: __dirname + '/.env'});
const getHistory = require('./getHistories');;
const getUsers = require('./getUsers')
const data = require('./data');
const buildAllWordStats = require('./buildMap');
const saveToBucket = require('./saveToBucket');
const deleteFiles = require('./slackFiles');

const timeout = ms => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  console.log('starting up  =>');
  const timestamp = deleteFiles.getTimestampFromLastMonth();
  const channels = await getHistory.getChannels();
  // const fileIds = await deleteFiles.getFilesForChannel(channels[0]);

  // console.log(fileIds);

  // const fileIds = [];
  // const fileIds = channels.map(ch => await deleteFiles.getFilesForChannel(ch, timestamp));
  
  const getAndDeleteFiles = async channel => {
    console.log('getAndDeleteFile', channel)
    const files = await deleteFiles.getFilesForChannel(channel, timestamp);
    for (const file of files) {
      await Promise.all([
        await deleteFiles.deleteFile(file),
        timeout,
      ])
    }
  };

  for (const channel of channels) {
    await getAndDeleteFiles(channel.id);
  }




})();
