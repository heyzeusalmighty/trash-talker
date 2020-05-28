require('dotenv').config({path: __dirname + '/.env'});
const fs = require('fs');
const util = require('util');
const writeFile = util.promisify(fs.writeFile);
const path = require('path');

const { WebClient } = require('@slack/web-api');
const token = process.env.SLACK_TOKEN;

const web = new WebClient(token);


const filteringCriteria = member => !member.is_bot && !member.deleted;

async function grabAllUsers() {
  console.log('grab all users')
  try {
    const result = await web.users.list({
      token,
    });
    const users = result.members.filter(filteringCriteria);
    const cleanedUsers = users.map(x => {
      const { real_name, display_name } = x.profile;
      return {
        id: x.id,
        name: x.name,
        real_name,
        display_name,
      };
    })
    return cleanedUsers;
  }
  catch (error) {
    console.error(error);
  }
};

module.exports = grabAllUsers;
