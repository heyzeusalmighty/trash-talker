const db = require('better-sqlite3')('./db/message.db');

async function dumpMessagesIntoDatabase(messages) {
  const insert = db.prepare(`
    INSERT INTO messages (ts, user, message) 
    SELECT @ts, @user, @message
    WHERE NOT EXISTS (SELECT 1 FROM messages WHERE ts = @ts)
  `);
  const insertThem = db.transaction((slackMessages) => {
    for (const msg of slackMessages) insert.run(msg)
  });

  await insertThem(messages);
  return;
}

async function dumpUsersIntoDatabase(users) {
  const insert = db.prepare(`
    INSERT INTO users (id, name, real_name, display_name)
    select @id, @name, @real_name, @display_name
    WHERE NOT EXISTS (SELECT 1 FROM users WHERE id = @id)
  `);
  const insertThem = db.transaction((slackUsers) => {
    for (const user of slackUsers) insert.run(user)
  });

  await insertThem(users);
  return;
}

async function getAllUsers() {
  const userQuery = db.prepare('SELECT * FROM users');
  const users = await userQuery.all();
  return users;
}

async function getUserMessages(userId) {
  const userQuery = db.prepare('SELECT * FROM messages where user = ?');
  const messages = await userQuery.all(userId);
  return messages;
}

async function getLastFeat() {
  const lastFeatQ = db.prepare('SELECT ts from feats order by ts desc limit 1');
  const lastOne = await lastFeatQ.get();
  return lastOne.ts;
}

async function getLastMessage() {
  const lastMessageQ = db.prepare('SELECT ts from messages order by ts desc limit 1');
  const lastOne = await lastMessageQ.get();
  return lastOne.ts;
}

async function getAllFeats() {
  const featQuery = db.prepare('Select * from feats');
  const feets = await featQuery.all();
  return feets;
}

async function dumpFeatsIntoDatabase(messages) {
  const insert = db.prepare(`
    INSERT INTO feats (ts, user, message) 
    SELECT @ts, @user, @message
    WHERE NOT EXISTS (SELECT 1 FROM feats WHERE ts = @ts)
  `);

  try {
    const insertThem = db.transaction((slackMessages) => {
      for (const msg of slackMessages) insert.run(msg);
    });
    await insertThem(messages);
  } catch (err) {
    if (!db.inTransaction) throw err;
  }
  
  return;
}

module.exports = {
  dumpMessagesIntoDatabase,
  dumpUsersIntoDatabase,
  dumpFeatsIntoDatabase,
  getAllUsers,
  getUserMessages,
  getLastFeat,
  getLastMessage,
  getAllFeats
}