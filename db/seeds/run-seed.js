const devData = require('../data/development-data/index.js');    // this is the test data Json
const seed = require('./seed.js');    // this is the where all the table creation happens
const db = require('../connection.js'); // this is the connection to the postgresql server

const runSeed = () => {
  return seed(devData).then(() => db.end());   // seed is invoked with the devdata then the connection is ended to close the connection.
};

runSeed(); 
