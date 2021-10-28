const { WebClient } = require('@slack/web-api');
const token = process.env.SLACK_TOKEN;
const web = new WebClient(token);

const getTimestampFromLastMonth = () => {
  let d = new Date();
  let month = d.getMonth();
  d.setMonth(d.getMonth() - 1);
  if (d.getMonth() == month) d.setDate(0);
  d.setHours(0, 0, 0, 0);
  return d;
}

const getFilesForChannel = async (channel, timestamp) => {
  const result = await web.files.list({
    token,
    channel,
    limit: 200,
    ts_to: timestamp
  });
  const { files } = result;
  console.log(`${channel} channel has ${files.length}  files`);
  return files.map(file => file.id);
};

const deleteFile = async file => {
  return await web.files.delete({
    token,
    file
  });
}


module.exports = {
  getFilesForChannel,
  getTimestampFromLastMonth,
  deleteFile,
}