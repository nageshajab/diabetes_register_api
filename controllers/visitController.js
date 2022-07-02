const MongoClient = require('mongodb').MongoClient;
const {
    ObjectId
} = require('mongodb');
const common = require('./common');
var logger = require('../logger');

const uri = process.env.DB_URI;

exports.list = async function list(req, res) {
    logger.debug('in visit controller list method');
    var mongoclient = common.getClient();

    await mongoclient.connect(function (err, db) {
        logger.debug('db connected');
        try {
            if (err)
                common.sendError(res, err, 500);

            var dbo = db.db(process.env.DB_NAME);
            logger.info(` ${process.env.DB_NAME} initialized`);
            //put ".sort({date: -1})" after find to sort
            dbo.collection(process.env.VISIT_COLLECTION_NAME).find({}).toArray(function (err, result) {

                if (err)
                    common.sendError(res, err, 500);
                logger.info('received record list count ' + result.length);
                db.close();
                common.sendSuccess(res, result);
            });
        } catch (error) {
            common.sendError(res, error.message,500);
        }
    });
}

exports.get = async function get(req, res) {
    var mongoclient = common.getClient();
    const id = req.body.id;
    logger.debug('getting id ' + id);
    await mongoclient.connect(function (err, db) {
        try {
            if (err) 
                common.sendError(res, err,500);
            
            var dbo = db.db(process.env.DB_NAME);

            dbo.collection(process.env.VISIT_COLLECTION_NAME).findOne({
                "_id": new ObjectId(id)
            }, (function (err, result) {
                if (err) 
                    common.sendError(res, err,500);
                
                logger.info('102 found record with id ' + id);
                common.sendSuccess(res, result);
                db.close();
            }));
        } catch (error) {
            common.sendError(res, error.message,500);
        }
    });
}

exports.insert = async function insert(req, res) {
    var mongoclient = common.getClient();
    await mongoclient.connect(function (err, db) {
        try {
            if (err) 
                common.sendError(res, err,500);
            
            var dbo = db.db(process.env.DB_NAME);

            dbo.collection(process.env.VISIT_COLLECTION_NAME).insertOne(req.body, function (err, result) {
                if (err) 
                    common.sendError(res, err,500);
                
                common.sendSuccess(res, result);
                db.close();
            });
        } catch (error) {
            common.sendError(res, error.message,500);
        }
    });
}

exports.delete = async function delete1(req, res) {
    var mongoclient = common.getClient();
    logger.info('in delete api ' + JSON.stringify(req.body.id));

    await mongoclient.connect(function (err, db) {
        try {
            if (err) 
                common.sendError(res, err,500);
            
            var dbo = db.db(process.env.DB_NAME);
            var o_id = ObjectId(req.body.id);
            var myquery = {
                '_id': o_id
            };
            dbo.collection(process.env.VISIT_COLLECTION_NAME).find(myquery).toArray(function (err, result) {
                if (err) 
                    common.sendError(res, err,500);
                
                logger.info('found record ' + JSON.stringify(result));
            });
            dbo.collection(process.env.VISIT_COLLECTION_NAME).deleteOne(myquery, function (err, result) {
                if (err) 
                    common.sendError(res, err,500);
                
                db.close();
                logger.info(result);
                common.sendSuccess(res, `deleted ${result.deletedCount} acknowledged ${result.acknowledged}`);
            });
        } catch (e) {
            common.sendError(res, e.message,500);
        }
    });
}

exports.update = async function update(req, res) {
    var mongoclient = common.getClient();
    await mongoclient.connect(function (err, db) {
        try {
            if (err) 
                common.sendError(res, err,500);
            
            var dbo = db.db(process.env.DB_NAME);

            var myquery = {
                '_id': ObjectId(req.body._id)
            };
            var newvalues = {
                $set: {
                    date: req.body.date,
                    bloodpressurepre: req.body.bloodpressurepre,
                    bloodpressurepost: req.body.bloodpressurepost,
                    weight: req.body.weight,
                    bslf: req.body.bslf,
                    bslpp: req.body.bslpp,
                    diagnosis: req.body.diagnosis,
                    medicines: req.body.medicines
                }
            };
            dbo.collection(process.env.VISIT_COLLECTION_NAME).updateOne(myquery, newvalues, function (err, result) {
                if (err) 
                    common.sendError(res, err,500);
                
                logger.debug(JSON.stringify(result));
                common.sendSuccess(res, result);
                db.close();
            });
        } catch (error) {
            common.sendError(res, error.message,500);
        }
    });
}