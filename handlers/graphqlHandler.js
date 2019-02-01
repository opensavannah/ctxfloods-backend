// process.env.DEBUG="graphile-build:warn";
const awsServerlessExpress = require('aws-serverless-express');
const { postgraphile } = require('postgraphile');

const { logError } = require('../helpers/logger');
const floodsPool = require('../db/helpers/getClient')({
  clientType: 'floodsAPI',
  pool: true
});

const postgraphileAPI = postgraphile(
  floodsPool,
  'floods',
  {
    jwtSecret: process.env.JWT_SECRET,
    jwtPgTypeIdentifier: 'floods.jwt_token',
    pgDefaultRole: 'floods_anonymous',
    disableDefaultMutations: true,
    cors: true,
    graphqlRoute: '/graphql',
    disableQueryLog: (process.env.DISABLE_QUERY_LOG && JSON.parse(process.env.DISABLE_QUERY_LOG)),
    readCache: `${__dirname}/../pgCatalog/postgraphile.cache`
  }
)

if (process.env.NODE_ENV === "local") {
  module.exports.handle = postgraphileAPI
} else {
  const server = awsServerlessExpress.createServer(postgraphileAPI);
  module.exports.handle = (event, context) => {
    console.log("~~~ What is", process.env.PG_ENDPOINT)
    console.log("~~~ And whats", process.env.PG_PORT)
    console.log("~~~ And is?", floodsPool)
    return awsServerlessExpress.proxy(server, event, context);
  }
}
