const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectId;

const {
    ObjectId
} = require('mongodb');
const common = require('./common');
var logger = require('../logger');

const uri = process.env.DB_URI;

exports.list = async function list(req, res) {
    var mongoclient = common.getClient();
    var query = {};
    if (typeof req.body.name != 'undefined')
        var query = {
            name: new RegExp(req.body.name.trim(), 'i')
        }
    logger.debug('role controller query ' + JSON.stringify(query));

    await mongoclient.connect(function (err, db) {
        try {
            if (err) 
                common.sendError(res, err.message,500);
            
            var dbo = db.db(process.env.DB_NAME);
            logger.info(` ${process.env.DB_NAME} initialized`);
            dbo.collection(process.env.ROLE_COLLECTION_NAME).find(query).toArray(function (err, result) {
                logger.info('received record list count ' + result.length);
                if (err) 
                    common.sendError(res, err.message,500);
                
                common.sendSuccess(res, result);
                db.close();
            });
        } catch (error) {
            common.sendError(res, error.message,500);
        }
    });
}

exports.listByIds = async function listByIds(req, res) {
    var mongoclient = common.getClient();
    var query = {};
    logger.debug('role controller query ' + JSON.stringify(req.body.data));
    const idArray = req.body.data;

    const objectIdArray = [];
    for (let i = 0; i < idArray.length; i++) {
        if (ObjectId.isValid(idArray[i])) {
            objectIdArray[i] = ObjectId(idArray[i]);
        }
    }

    await mongoclient.connect(function (err, db) {
        try {
            if (err) 
                common.sendError(res, err.message,500);
            
            var dbo = db.db(process.env.DB_NAME);
            logger.info(` ${process.env.DB_NAME} initialized`);
            dbo.collection(process.env.ROLE_COLLECTION_NAME).find({
                '_id': {
                    $in: objectIdArray
                }
            }).toArray(function (err, result) {
                logger.info('received record list count ' + result.length);
                if (err) 
                    common.sendError(res, err.message,500);
                
                common.sendSuccess(res, result);
                db.close();
            });;

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

            dbo.collection(process.env.ROLE_COLLECTION_NAME).findOne({
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
            common.sendError(res, error.message,500);
        }
    });
}

exports.insert = async function insert(req, res) {
    var mongoclient=common.getClient();
    await mongoclient.connect(function (err, db) {
        try {
            if (err) 
                common.sendError(res, err,500);
            
            var dbo = db.db(process.env.DB_NAME);

            dbo.collection(process.env.ROLE_COLLECTION_NAME).insertOne(req.body, function (err, result) {
                if (err) throw err;
                common.sendSuccess(res, result);
                db.close();
            });
        } catch (error) {
            common.sendError(res, e.message,500);
        }
    });
}

exports.delete = async function delete1(req, res) {
    var mongoclient=common.getClient();
    logger.info('in delete api ' + JSON.stringify(req.body.id));

    await mongoclient.connect( function (err, db) {
        try {
            if (err) return err;
            var dbo = db.db(process.env.DB_NAME);
            var o_id = ObjectId(req.body.id);
            var myquery = {
                '_id': o_id
            };
            dbo.collection(process.env.ROLE_COLLECTION_NAME).find(myquery).toArray(function (err, result) {
                if (err) 
                    common.sendError(res, err,500);
                
                logger.info('found record ' + JSON.stringify(result));
            });
            dbo.collection(process.env.ROLE_COLLECTION_NAME).deleteOne(myquery, function (err, result) {
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
    var mongoclient=common.getClient();
    await mongoclient.connect( function (err, db) {
        try {
            if (err) 
                common.sendError(res, err,500);
            
            var dbo = db.db(process.env.DB_NAME);

            var myquery = {
                '_id': ObjectId(req.body._id)
            };
            var newvalues = {
                $set: {
                    name: req.body.name,
                    description: req.body.description,
                    chkMedicineCreate: req.body.chkmedicineUpdate,
                    chkMedicineRead: req.body.chkMedicineRead,
                    chkmedicineUpdate: req.body.chkmedicineUpdate,
                    chkMedicineDelete: req.body.chkMedicineDelete,
                    chkVisitCreate: req.body.chkVisitCreate,
                    chkVisitRead: req.body.chkVisitRead,
                    chkVisitUpdate: req.body.chkVisitUpdate,
                    chkVisitDelete: req.body.chkVisitDelete,
                }
            };

            dbo.collection(process.env.ROLE_COLLECTION_NAME).updateOne(myquery, newvalues, function (err, result) {
                if (err) throw err;
                logger.debug(JSON.stringify(result));
                common.sendSuccess(res, result);
                db.close();
            });
        } catch (error) {
            common.sendError(res, e.message,500);
        }
    });
}