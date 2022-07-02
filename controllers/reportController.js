const MongoClient = require('mongodb').MongoClient;
const {
    ObjectId
} = require('mongodb');
const common = require('./common');
var logger = require('../logger');

const uri = process.env.DB_URI;

exports.weightlist = async function list(req, res) {
    var mongoclient = common.getClient();
    logger.info('inside report list ');
    await mongoclient.connect(function (err, db) {
        try {
            if (err) 
                common.sendError(res, err,500);
            
            var dbo = db.db(process.env.DB_NAME);
            logger.info(`${process.env.DB_NAME} initialized`);

            const getSortedRecords = async function getSortedRecords() {
                let cursor = dbo.collection(process.env.VISIT_COLLECTION_NAME).find({}).project({
                    weight: 1,
                    date: 1,
                    _id: 0
                });
                let sortCriteria = {};
                sortCriteria = ["date", 1];
                cursor = cursor.sort(sortCriteria);
                const displayCursor = cursor.limit(10).skip(0 * 10);
                const records = await displayCursor.toArray();

                logger.info('received record list count ' + records.length);
                common.sendSuccess(res, records);
                db.close();
            }
            getSortedRecords();

        } catch (error) {
            common.sendError(res, error.message,500);
        }
    });
}

exports.bplist = async function list(req, res) {
    var mongoclient = common.getClient();
    logger.info('inside report list ');
    await mongoclient.connect(function (err, db) {
        try {
            if (err) 
                common.sendError(res, err,500);
            
            var dbo = db.db(process.env.DB_NAME);
            logger.info(` ${process.env.DB_NAME} initialized`);
           
            const getSortedRecords = async function getSortedRecords() {
                let cursor = dbo.collection(process.env.VISIT_COLLECTION_NAME).find({}).project({
                    bloodpressurepre: 1,
                    bloodpressurepost: 1,
                    date: 1,
                    _id: 0
                });
                let sortCriteria = {};
                sortCriteria = ["date", 1];
                cursor = cursor.sort(sortCriteria);
                const displayCursor = cursor.limit(10).skip(0 * 10);
                const records = await displayCursor.toArray();

                logger.info('received record list count ' + records.length);
                common.sendSuccess(res, records);
                db.close();
            }
            getSortedRecords();
        } catch (error) {
            common.sendError(res, error.message,500);
        }
    });
}

exports.bslist = async function list(req, res) {
    var mongoclient = common.getClient();
    logger.info('inside report list ');
    await mongoclient.connect(function (err, db) {
        try {
            if (err) 
                common.sendError(res, err,500);
            
            var dbo = db.db(process.env.DB_NAME);
            logger.info(` ${process.env.DB_NAME} initialized`);

            const getSortedRecords = async function getSortedRecords() {
                let cursor = dbo.collection(process.env.VISIT_COLLECTION_NAME).find({}).project({
                    bslf: 1,
                    bslpp: 1,
                    date: 1,
                    _id: 0
                });
                let sortCriteria = {};
                sortCriteria = ["date", 1];
                cursor = cursor.sort(sortCriteria);
                const displayCursor = cursor.limit(10).skip(0 * 10);
                const records = await displayCursor.toArray();

                logger.info('received record list count ' + records.length);
                common.sendSuccess(res, records);
                db.close();
            }
            getSortedRecords();
        } catch (error) {
            common.sendError(res, error.message,500);
        }
    });
}