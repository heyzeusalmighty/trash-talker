


// const lastTs = await data.getLastFeat();
// const feats = await data.getAllFeats();
// await data.dumpFeatsIntoDatabase(done);

const { Pool } = require('pg');
const pool = new Pool()


const createCommand = 'CREATE TABLE feats (ts nvarchar(50) primary key, user nvarchar(50), message nvarchar(1500))';

const getLastFeat = async () => {
  try {
    console.log('getting it');
    const create = await pool.query(createCommand);
    console.log('create', create);
  } catch (e) {
    console.error(e);
  } finally {
    console.log('done!!');
  }

  // const lastOne = await pool.query('SELECT ts FROM feats ORDER BY ts DESC LIMIT 1');
  // console.log('last thing', lastOne[0]);
};


module.exports = {
  getLastFeat,
}