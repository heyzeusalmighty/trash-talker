// require('dotenv').config({path: __dirname + '/.env'});
const fs = require('fs');
const util = require('util');
const writeFile = util.promisify(fs.writeFile);
const path = require('path');

const { WebClient } = require('@slack/web-api');
const token = process.env.SLACK_TOKEN;

const web = new WebClient(token);

async function getChannels(name) {
  try {
    const result = await web.conversations.list({
      token,
    });

    const allChannels = result.channels.map(ch => ({ id: ch.id, name: ch.name }));
    return allChannels
  }
  catch (error) {
    console.error(error);
  }
}

async function findHistory(id) {
  try {
    const result = await web.conversations.history({
      token,
      channel: id
    });
    return result;
  }
  catch(error) {
    console.error(error);
    console.log(error.data.response_metadata)
  }
}

const filteringCriteria = msg =>
  msg.type === 'message' &&
  !msg.subtype &&
  msg.text.indexOf('http') === -1

async function grabAllMessages() {
  console.log('grab all historyies')
  const channels = await getChannels();
  const histories = [];
  for (const channel of channels) {
    const { name, id } = channel;
    const history = await findHistory(id);
    const { messages } = history;
    const filtered = messages.filter(filteringCriteria)
      .map(msg => ({ message: msg.text, user: msg.user, ts: msg.ts }));
    histories.push(...filtered);
  };
  return histories;
};

module.exports = grabAllMessages;
