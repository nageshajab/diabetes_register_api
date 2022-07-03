'use strict'

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectId;
const logger = require('../logger');
const jwt = require('jsonwebtoken');

const {
    ObjectId
} = require('mongodb');
const common = require('./common');
const {
    query
} = require('express');
const uri = process.env.DB_URI;

async function get(id, callback) {
    await common.getRecordByQuery(process.env.REMINDER_COLLECTION_NAME, {
        _id: id
    }, function (err, result) {
        if (err) throw err;
        callback(null, result);
    });
}

exports.list = async function list(req, res, callback) {
    logger.debug('in reminder controller list ' + typeof callback);
    var query = {};

    console.log(req.body.fromdate);
    console.log(req.body.todate);
    if (typeof req.body.fromdate != 'undefined' && typeof req.body.todate != 'undefined') {
        var query = {
            date: {
                "$gte": new Date( req.body.fromdate),
                "$lte":new Date( req.body.todate)
            }
        };
    } else {
        common.sendError(res,'Bad Request',400);
    }

    await common.getRecordByQuery(process.env.REMINDER_COLLECTION_NAME, query, function (err, result) {
        if (err) callback(err, null);
        callback(null, result);
    });
}

exports.insert = async function insert(req, res, callback) {
    if (typeof req.body.name == 'undefined') {
        common.sendError(res, 'Bad request', 400);
    }
    var data = {
        name: req.body.name,
        date: req.body.date
    };
    var query = {
        _id: req.body.id
    };

    common.InsertOrUpdate(process.env.REMINDER_COLLECTION_NAME, data, query, (err, data) => {
        if (err) common.sendError(res, err, 500);
        callback(null, data);
    })
}

exports.delete = async function delete1(req, res) {
    common.delete(process.env.REMINDER_COLLECTION_NAME, req.body.id, function (err, result) {
        if (err) common.sendError(res, err, 500);
        common.sendSuccess(res, result);
    })
}

exports.update = async function update(req, res) {
    try {
        var query = {
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
        common.InsertOrUpdate(process.env.REMINDER_COLLECTION_NAME, query, newvalues, function (err, result) {
            if (err)
                common.sendError(res, err, 500);

            logger.debug(JSON.stringify(result));
            common.sendSuccess(res, result);
            db.close();
        });
    } catch (error) {
        common.sendError(res, e.message, 500);
    }
}