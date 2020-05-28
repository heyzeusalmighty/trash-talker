const AWS = require('aws-sdk');
// Enter copied or downloaded access ID and secret key here
// const ID = '';
// const SECRET = '';
// const BUCKET_NAME = 'test-bucket';
const AWS_ID = process.env.AWS_ID;
const AWS_SECRET = process.env.AWS_SECRET;
const BUCKET_NAME = process.env.BUCKET_NAME;

const s3 = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET
});

const uploadFile = (fileName) => {
  const fileContent = fs.readFileSync(fileName);

  // Setting up S3 upload parameters
  const params = {
    Bucket: BUCKET_NAME,
    Key: 'cat.jpg', // File name you want to save as in S3
    Body: fileContent
  };

  // Uploading files to the bucket
  s3.upload(params, function(err, data) {
      if (err) {
          throw err;
      }
      console.log(`File uploaded successfully. ${data.Location}`);
  });
};