require('promise.prototype.finally').shim();
const Client = require('pg').Client;
const { logError } = require('./logger');

module.exports.handle = (event, context, cb) => {
  const pgClient = new Client(require('./constants').PGCON);
  pgClient.connect();

  pgClient.query('select floods.legacy_xml()')
  .then(pgres => {
    const response = {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/xml',
      },
      body: pgres.rows[0].legacy_xml,
    };
    cb(null, response);
  })
  .catch(err => {
    logError(err);
    let response = {};
    response.statusCode = 500;
    response.headers = { 'Access-Control-Allow-Origin': '*' };
    response.errors = err;
    return cb(null, response);
  })
  .finally(() => pgClient.end());
};
