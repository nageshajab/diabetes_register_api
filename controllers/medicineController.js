const MongoClient = require('mongodb').MongoClient;
const {
    ObjectId
} = require('mongodb');
const common = require('./common');
var logger = require('../logger');

const uri = process.env.DB_URI;

exports.list = async function list(req, res) {
    await MongoClient.connect(uri, function (err, db) {
        try {
            if (err) {
                logger.error(err);
                throw err
            };
            var dbo = db.db(process.env.DB_NAME);
            logger.info(` ${process.env.DB_NAME} initialized`);
            dbo.collection(process.env.MEDICINE_COLLECTION_NAME).find({}).toArray(function (err, result) {
                logger.info('received record list count ' + result.length);
                if (err) {
                    logger.error('in error ' + err);
                    throw err
                };
                common.sendSuccess(res, result);
                db.close();
            });
        } catch (error) {
            logger.error(e.message);
            common.sendError(res, e.message);
        }
    });
}

exports.get = async function get(req, res) {
    const id = req.body.id;
    console.log('getting id ' + id);
    await MongoClient.connect(uri, function (err, db) {
        try {
            if (err) {
                logger.error(err);
                throw err
            };
            var dbo = db.db(process.env.DB_NAME);

            dbo.collection(process.env.MEDICINE_COLLECTION_NAME).findOne({
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
            logger.error('104 ' + e.message);
            common.sendError(res, e.message);
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

            dbo.collection(process.env.MEDICINE_COLLECTION_NAME).insertOne(req.body, function (err, result) {
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
            dbo.collection(process.env.MEDICINE_COLLECTION_NAME).find(myquery).toArray(function (err, result) {
                if (err) {
                    logger.error(err);
                    throw err;
                }
                logger.info('found record ' + JSON.stringify(result));
            });
            dbo.collection(process.env.MEDICINE_COLLECTION_NAME).deleteOne(myquery, function (err, result) {
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