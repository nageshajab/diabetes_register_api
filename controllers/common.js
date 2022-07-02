const MongoClient = require('mongodb').MongoClient;
const logger = require('../logger');

// Database Name
const uri = process.env.DB_URI;

const getClient = () => {

  // create a client, passing in additional options
  const client = new MongoClient(uri, {
    keepAlive: true,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 10000,
  });

  return client;
}
exports.getClient = getClient;

exports.sendError = function sendError(res, err, statuscode) {
  logger.error(JSON.stringify(err));
  res.status(statuscode);
  res.send(err);
  res.end();
}

exports.sendSuccess = function sendSuccess(res, msg) {
  res.status(200);
  res.send(msg);
  res.end();
}

exports.getRecordByQuery = async function getRecordByQuery(collectionName, query, callback) {
  console.log('in common ' + typeof callback);
  var mongoclient = getClient();
  await mongoclient.connect(function (err, db) {
    try {
      if (err) {
        throw err;
      };
      var dbo = db.db(process.env.DB_NAME);
      logger.info(` ${process.env.DB_NAME} initialized`);

      dbo.collection(collectionName).find(query).toArray(function (err, result) {
        logger.info('found ' + JSON.stringify(result));
        if (err) {
          throw err;
        };
        callback(null, result);
        db.close();
      });

    } catch (error) {
      callback(error, null);
      throw error;
    }
  });
}

exports.InsertOrUpdate = async function InsertOrUpdate(collectionName, query, data, callback) {
  var mongoclient = getClient();
  await mongoclient.connect(function (err, db) {
    try {
      if (err)
        throw err;

      var dbo = db.db(process.env.DB_NAME);

      dbo.collection(collectionName).updateOne(query, {
        '$set': data
      }, {
        upsert: true
      }, function (err, result) {
        if (err) throw err;
        callback(null, result);
        db.close();
      });
    } catch (error) {
      callback(error, null);
    }
  });
}