const MongoClient = require('mongodb').MongoClient;
const {
    ObjectId
} = require('mongodb');
const common = require('./common');
var logger = require('../logger');

const uri = process.env.DB_URI;

exports.weightlist = async function list(req, res) {

    logger.info('inside report list ');
    await MongoClient.connect(uri, function (err, db) {
        try {
            if (err) {
                logger.error(err);
                throw err
            };
            var dbo = db.db(process.env.DB_NAME);
            logger.info(` ${process.env.DB_NAME} initialized`);
            dbo.collection(process.env.VISIT_COLLECTION_NAME).find({}).project({
                weight: 1,
                date: 1,
                _id: 0
            }).toArray(function (err, result) {
                logger.info('received record list count ' + result.length);
                if (err) {
                    logger.error('in error ' + err);
                    throw err
                };
                common.sendSuccess(res, result);
                db.close();
            });
        } catch (error) {
            logger.error(error.message);
            common.sendError(res, error.message);
        }
    });
}

exports.bplist = async function list(req, res) {

    logger.info('inside report list ');
    await MongoClient.connect(uri, function (err, db) {
        try {
            if (err) {
                logger.error(err);
                throw err
            };
            var dbo = db.db(process.env.DB_NAME);
            logger.info(` ${process.env.DB_NAME} initialized`);
            dbo.collection(process.env.VISIT_COLLECTION_NAME).find({}).project({
                bloodpressurepre: 1,
                bloodpressurepost: 1,
                date: 1,
                _id: 0
            }).toArray(function (err, result) {
                logger.info('received record list count ' + result.length);
                if (err) {
                    logger.error('in error ' + err);
                    throw err
                };
                common.sendSuccess(res, result);
                db.close();
            });
        } catch (error) {
            logger.error(error.message);
            common.sendError(res, error.message);
        }
    });
}

exports.bslist = async function list(req, res) {

    logger.info('inside report list ' );
    await MongoClient.connect(uri, function (err, db) {
        try {
            if (err) {
                logger.error(err);
                throw err
            };
            var dbo = db.db(process.env.DB_NAME);
            logger.info(` ${process.env.DB_NAME} initialized`);
            dbo.collection(process.env.VISIT_COLLECTION_NAME).find({}).project({
                bslf: 1,
                bslpp: 1,
                date: 1,
                _id: 0
            }).toArray(function (err, result) {
                logger.info('received record list count ' + result.length);
                if (err) {
                    logger.error('in error ' + err);
                    throw err
                };
                common.sendSuccess(res, result);
                db.close();
            });
        } catch (error) {
            logger.error(error.message);
            common.sendError(res, error.message);
        }
    });
}