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
    if (req.body.username !== 'nageshajab' || req.body.password !== 'password1@') {
        logger.info('hard coded username pwd, pls check');
        return res.status(401).json({})
    }

    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    let data = {
        time: Date(),
        userId: 12,
        roles: 'admin'
    }

    const token = jwt.sign(data, jwtSecretKey, {
        expiresIn: "2h"
    });
    logger.info('token is ' + token);
    res.send(token);
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

exports.list = async function list(req, res) {
    var query = {};
    if (typeof req.body.name != 'undefined')
        var query = {
            name: new RegExp(req.body.name.trim(), 'i')
        }
    logger.debug('user controller query ' + JSON.stringify(query));

    await MongoClient.connect(uri, function (err, db) {
        try {
            if (err) {
                logger.error(err);
                common.sendError(res, err.message);
            };
            var dbo = db.db(process.env.DB_NAME);
            logger.info(` ${process.env.DB_NAME} initialized`);
            dbo.collection(process.env.USER_COLLECTION_NAME).find(query).toArray(function (err, result) {
                logger.info('received record list count ' + result.length);
                if (err) {
                    logger.error('in error ' + err);
                    common.sendError(res, err.message);
                };
                common.sendSuccess(res, result);
                db.close();
            });
        } catch (error) {
            logger.error(error);
            common.sendError(res, error.message);
        }
    });
}

exports.listByIds = async function listByIds(req, res) {
    var query = {};
    logger.debug('medicine controller query ' + JSON.stringify(req.body.data));
    const idArray = req.body.data;

    const objectIdArray = [];
    for (let i = 0; i < idArray.length; i++) {
        console.log(idArray[i]);
        console.log(ObjectId.isValid(idArray[i]));
        if (ObjectId.isValid(idArray[i])) {
            objectIdArray[i] = ObjectId(idArray[i]);
        }
    }

    await MongoClient.connect(uri, function (err, db) {
        try {
            if (err) {
                logger.error(err);
                common.sendError(res, err.message);
            };
            var dbo = db.db(process.env.DB_NAME);
            logger.info(` ${process.env.DB_NAME} initialized`);
            dbo.collection(process.env.USER_COLLECTION_NAME).find({
                '_id': {
                    $in: objectIdArray
                }
            }).toArray(function (err, result) {
                logger.info('received record list count ' + result.length);
                if (err) {
                    logger.error('in error ' + err);
                    common.sendError(res, err.message);
                };
                common.sendSuccess(res, result);
                db.close();
            });;

        } catch (error) {
            logger.error(error.message);
            common.sendError(res, error.message);
        }
    });
}

exports.get = async function get(req, res) {
    const id = req.body.id;
    logger.debug('getting id ' + id);
    await MongoClient.connect(uri, function (err, db) {
        try {
            if (err) {
                logger.error(err);
                throw err
            };
            var dbo = db.db(process.env.DB_NAME);

            dbo.collection(process.env.USER_COLLECTION_NAME).findOne({
                "_id": new ObjectId(id)
            }, (function (err, result) {
                if (err) {
                    logger.error('103 error while fetching record  ' + err);
                    throw err
                };
                logger.info('102 found record with id ' + id);
                common.sendSuccess(res, result);
                db.close();
            }));
        } catch (error) {
            logger.error('104 ' + error.message);
            common.sendError(res, error.message);
        }
    });
}

exports.insert = async function insert(req, res) {
    await MongoClient.connect(uri, function (err, db) {
        try {
            if (err) {
                logger.error(err);
                throw err;
            }
            var dbo = db.db(process.env.DB_NAME);

            dbo.collection(process.env.USER_COLLECTION_NAME).insertOne(req.body, function (err, result) {
                if (err) throw err;
                common.sendSuccess(res, result);
                db.close();
            });
        } catch (error) {
            logger.error(e.message);
            common.sendError(res, e.message);
        }
    });
}

exports.delete = async function delete1(req, res) {
    logger.info('in delete api ' + JSON.stringify(req.body.id));

    await MongoClient.connect(uri, function (err, db) {
        try {
            if (err) return err;
            var dbo = db.db(process.env.DB_NAME);
            var o_id = ObjectId(req.body.id);
            var myquery = {
                '_id': o_id
            };
            dbo.collection(process.env.USER_COLLECTION_NAME).find(myquery).toArray(function (err, result) {
                if (err) {
                    logger.error(err);
                    throw err;
                }
                logger.info('found record ' + JSON.stringify(result));
            });
            dbo.collection(process.env.USER_COLLECTION_NAME).deleteOne(myquery, function (err, result) {
                if (err) {
                    logger.error(err);
                    return err;
                }
                db.close();
                logger.info(result);
                common.sendSuccess(res, `deleted ${result.deletedCount} acknowledged ${result.acknowledged}`);
            });
        } catch (e) {
            logger.error(e.message);
            common.sendError(res, e.message);
        }
    });
}

exports.update = async function update(req, res) {
    await MongoClient.connect(uri, function (err, db) {
        try {
            if (err) {
                logger.error(err);
                throw err;
            }
            var dbo = db.db(process.env.DB_NAME);

            var myquery = {
                '_id': ObjectId(req.body._id)
            };
            var newvalues = {
                $set: {
                    name: req.body.name,
                    description: req.body.description,
                    chkAdmin: req.body.chkAdmin,
                    chkBasic: req.body.chkBasic
                }
            };

            dbo.collection(process.env.USER_COLLECTION_NAME).updateOne(myquery, newvalues, function (err, result) {
                if (err) throw err;
                logger.debug(JSON.stringify(result));
                common.sendSuccess(res, result);
                db.close();
            });
        } catch (error) {
            logger.error(e.message);
            common.sendError(res, e.message);
        }
    });
}