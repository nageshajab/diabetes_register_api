'use strict'

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectId;
const logger = require('../logger');
const jwt = require('jsonwebtoken');

const {
    ObjectId
} = require('mongodb');
const common = require('./common');
const uri = process.env.DB_URI;

exports.generateToken = function (req, res) {
    logger.info('100 generating token ' + JSON.stringify(req.body));

    try {
        const someasyncFunction = async function someasyncFunction() {
            await getUser(req.body.username, req.body.password, function (err, user) {
                if (err) throw err;
                if (user != null && user.length > 0) {
                    let jwtSecretKey = process.env.JWT_SECRET_KEY;
                    let data = {
                        time: Date(),
                        username: user[0].username,
                        roles: user[0].roles
                    }

                    const token = jwt.sign(data, jwtSecretKey, {
                        expiresIn: "2h"
                    });
                    logger.info('token is ' + token);
                    res.send({
                        'token': token,
                        'roles': user[0].roles,
                        'username': user[0].username
                    });
                } else {
                    return res.status(401).json({
                        'msg': 'Invalid Username or password'
                    })
                }
            });
        };
        someasyncFunction();
    } catch (err) {
        common.sendError(res, err, 401);
    }
}

async function getUser(username, password, callback) {
    await common.getRecordByQuery(process.env.USER_COLLECTION_NAME, {
        username: username,
        password: password
    }, function (err, result) {
        if (err) throw err;
        callback(null, result);
    });
}

exports.validateToken = function (req, res) {
    // Tokens are generally passed in the header of the request
    // Due to security reasons.

    let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
    let jwtSecretKey = process.env.JWT_SECRET_KEY;

    try {
        const token = req.header(tokenHeaderKey);

        const verified = jwt.verify(token, jwtSecretKey);

        if (verified) {
            return true;
        } else {
            // Access Denied
            res.status(401).send('Invalid security token');
            res.end();
        }
    } catch (error) {
        // Access Denied
        res.status(401).send(error + 'Invalid security token');
        res.end();
    }
}

exports.list = async function list(req, res, callback) {
    logger.debug('in user controller list ' + typeof callback);
    var query = {};
    if (typeof req.body.isActive != 'undefined')
        query.isActive = req.body.isActive

    if (typeof req.body.name != 'undefined')
        var query = {
            name: new RegExp(req.body.name.trim(), 'i')
        }

    var result = await common.getRecordByQuery(process.env.USER_COLLECTION_NAME, query, function (err, result) {
        if (err) callback(err, null);
        callback(null, result);
    });
}

exports.listByIds = async function listByIds(req, res, callback) {
    logger.debug('medicine controller query ' + JSON.stringify(req.body.data));
    const idArray = req.body.data;

    const objectIdArray = [];
    for (let i = 0; i < idArray.length; i++) {
        if (ObjectId.isValid(idArray[i])) {
            objectIdArray[i] = ObjectId(idArray[i]);
        }
    }
    var query = {
        '_id': {
            $in: objectIdArray
        }
    };
    common.getRecordByQuery(process.env.USER_COLLECTION_NAME, query, function (err, result) {
        if (err) callback(err, null);
        callback(null, result);
    });
}

exports.get = async function get(req, res) {
    var mongoclient = common.getClient();
    const id = req.body.id;
    logger.debug('getting id ' + id);
    await mongoclient.connect(function (err, db) {
        try {
            if (err) throw err;

            var dbo = db.db(process.env.DB_NAME);

            dbo.collection(process.env.USER_COLLECTION_NAME).findOne({
                "_id": new ObjectId(id)
            }, (function (err, result) {
                if (err) throw err;

                logger.info('102 found record with id ' + id);
                common.sendSuccess(res, result);
                db.close();
            }));
        } catch (error) {
            common.sendError(res, error.message, 500);
        }
    });
}

exports.insert = async function insert(req, res, callback) {
    console.log(JSON.stringify(req.body));
    var validRequest = true;
    if (typeof req.body.username == 'undefined' || typeof req.body.password == 'undefined' || typeof req.body.roles == 'undefined') {
        common.sendError(res, 'Bad request', 400);
    }
    var data = {
        username: req.body.username,
        description: req.body.description,
        password: req.body.password,
        roles: req.body.roles
    };
    var query = {
        username: req.body.username
    };
    common.getRecordByQuery(process.env.USER_COLLECTION_NAME, query, function (err, result) {
        if (err) common.sendError(res, err, 500);
        if (result.length > 0) {
            common.sendError(res, 'username already exists', 400);
        } else {
            common.InsertOne(process.env.USER_COLLECTION_NAME, data, (err, data) => {
                if (err) common.sendError(res, err, 500);
                callback(null, data);
            })
        }
    });
}

exports.delete = async function delete1(req, res) {
    var mongoclient = common.getClient();
    logger.info('in delete api ' + JSON.stringify(req.body.id));

    await mongoclient.connect(function (err, db) {
        try {
            if (err) return err;
            var dbo = db.db(process.env.DB_NAME);
            var o_id = ObjectId(req.body.id);
            var myquery = {
                '_id': o_id
            };
            dbo.collection(process.env.USER_COLLECTION_NAME).find(myquery).toArray(function (err, result) {
                if (err)
                    common.sendError(res, err, 500);

                logger.info('found record ' + JSON.stringify(result));
            });
            dbo.collection(process.env.USER_COLLECTION_NAME).deleteOne(myquery, function (err, result) {
                if (err)
                    common.sendError(res, err, 500);

                db.close();
                logger.info(result);
                common.sendSuccess(res, `deleted ${result.deletedCount} acknowledged ${result.acknowledged}`);
            });
        } catch (e) {
            common.sendError(res, e.message, 500);
        }
    });
}

exports.update = async function update(req, res) {
    var mongoclient = common.getClient();
    await mongoclient.connect(function (err, db) {
        try {
            if (err)
                common.sendError(res, err, 500);

            var dbo = db.db(process.env.DB_NAME);

            var myquery = {
                '_id': ObjectId(req.body._id)
            };
            var newvalues = {
                $set: {
                    name: req.body.name,
                    description: req.body.description,
                    password: req.body.password,
                    roles: req.body.roles
                }
            };

            dbo.collection(process.env.USER_COLLECTION_NAME).updateOne(myquery, newvalues, function (err, result) {
                if (err)
                    common.sendError(res, err, 500);

                logger.debug(JSON.stringify(result));
                common.sendSuccess(res, result);
                db.close();
            });
        } catch (error) {
            common.sendError(res, e.message, 500);
        }
    });
}