// require('dotenv').config({path: __dirname + '/.env'});
const fs = require('fs');
const util = require('util');
const writeFile = util.promisify(fs.writeFile);
const path = require('path');

const { WebClient } = require('@slack/web-api');
const token = process.env.SLACK_TOKEN;

const web = new WebClient(token);

async function getReactionsForMessage(channelId, timestamp) {
  try {
    const result = await web.reactions.get({
      channel: channelId,
      timestamp,
    });
    return result.message.reactions;

  }
  catch(error) {
    console.log(error);
    console.log(error.data.response_metadata)
  }
}

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

async function getTotalHistory(channel, allMessages = [], cursor, oldest = 0) {
  try {
    const result = await web.conversations.history({
      token,
      channel,
      cursor,
      oldest,
      limit: 200,
    });
    const { messages, response_metadata } = result;
    const filtered = messages.filter(filteringCriteria)
      .map(msg => ({ message: msg.text, user: msg.user, ts: msg.ts }));
    allMessages.push(...filtered);
    if (response_metadata.next_cursor) {
      return getTotalHistory(channel, allMessages, response_metadata.next_cursor, oldest);
    }
    return allMessages;
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

async function grabAllMessages(lastTimeStamp) {
  console.log('grab all history-ies');
  const channels = await getChannels();
  const histories = [];
  for (const channel of channels) {
    const { name, id } = channel;
    const messages = await getTotalHistory(id, [], undefined, lastTimeStamp);
    const numberOfMessages = (messages) ? messages.length : 0;
    console.log(`channel: ${name} => ${numberOfMessages} messages`);
    histories.push(...messages);
  };
  return histories;
};

module.exports = {
  grabAllMessages,
  getChannels,
  getTotalHistory,
  getReactionsForMessage
};
