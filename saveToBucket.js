const fs = require('fs');
const AWS = require('aws-sdk');
const AWS_ID = process.env.AWS_ID;
const AWS_SECRET = process.env.AWS_SECRET;
const BUCKET_NAME = process.env.BUCKET_NAME;

const s3 = new AWS.S3({
  accessKeyId: AWS_ID,
  secretAccessKey: AWS_SECRET
});

const uploadFile = (file) => {
  const fileContent = fs.readFileSync(`./${file}`);
  s3.upload({
    Bucket: BUCKET_NAME,
    Key: file,
    Body: fileContent
  }, (err, data) => {
    if (err) {
        throw err;
    }
    console.log(`File uploaded successfully. ${data.Location}`);
  });
};

module.exports = uploadFile;