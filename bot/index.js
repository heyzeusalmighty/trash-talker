const querystring = require('querystring');
const AWS = require('aws-sdk');
const LookWhosTalking = require('./whosTalkingNow');
const BUCKET_NAME = process.env.BUCKET_NAME;
const AWS_ID = process.env.AWS_ID;
const AWS_SECRET = process.env.AWS_SECRET;
const SLACK_VERIFICATION_TOKEN = process.env.SLACK_VERIFICATION_TOKEN;
const WORD_STATS_URL = process.env.WORD_STATUS_URL;
const wordStats = require('./wordStats.json');

exports.handler = async (event) => {
  const payload = querystring.parse(event.body);
  
  const { token, text = '' } = payload;
  if (token !== SLACK_VERIFICATION_TOKEN) {
      return 'Invalid verification token';
  }

  try {
    const message = LookWhosTalking(text, wordStats);

    const responseBody = {
      "response_type": "in_channel",
      "text": `${text} says "${message}"`,
      "payload": payload
    };

    return {
      statusCode: 200,
      body: JSON.stringify(responseBody),
    };
  } catch(err) {
    return {
      statusCode: 500,
      body: JSON.stringify(err)
    };
  }
};