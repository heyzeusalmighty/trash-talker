require('dotenv').config({path: __dirname + '/.env'});
const data = require('./aws-data');



const getData = async () => {
  await data.getLastFeat();
  console.log('done');
}

getData();