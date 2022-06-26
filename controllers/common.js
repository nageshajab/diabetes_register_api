const MongoClient = require('mongodb').MongoClient;

// Database Name
const uri = process.env.DB_URI;

exports.getClient = function getClient() {

    // create a client, passing in additional options
    const client = new MongoClient(uri, {
        keepAlive: true,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 10000,
    });

    return client;
}

exports.sendError = function sendError(res, err) {
  res.status(500);
  res.send(err);
  res.end();
}

exports.sendSuccess = function sendSuccess(res, msg) {
  res.status(200);
  res.send(msg);
  res.end();
}