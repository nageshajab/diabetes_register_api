var logger = require('../logger');
var reminderController = require('../controllers/reminderController');
var middleware = require('../middleware');
var common = require('../controllers/common');

module.exports = function (app) {

    app.post('/reminder/list', middleware.validateJwt, function (req, res) {
        try {
            logger.debug('in reminder list post api route');
            reminderController.list(req, res, function (err, result) {
                if (err) throw err;
                common.sendSuccess(res, result);
            });
        } catch (error) {
            common.sendError(res, error, 500);
        }
    });

    app.post('/reminder/get', middleware.validateJwt, function (req, res) {
        logger.debug('101 inside api user get ');
        try {
            reminderController.get(req, res);
        } catch (error) {
            common.sendError(res, error, 500);
        }
    });

    app.post('/reminder/insert', middleware.validateJwt, function (req, res) {
        logger.debug('in reminder insert route ' + JSON.stringify(req.body));
        try {
            reminderController.insert(req, res, function (err, data) {
                if (err) throw err;
                common.sendSuccess(res, data);
            });
        } catch (error) {
            common.sendError(res, error, 500);
        }
    });

    app.post('/reminder/delete', middleware.validateJwt, function (req, res) {
        try {
            reminderController.delete(req, res);
        } catch (ex) {
            common.sendError(res, ex, 500);
        }
    });

    app.post('/reminder/update', middleware.validateJwt, function (req, res) {
        logger.debug('in reminder update route ' + JSON.stringify(req.body));
        try {
            reminderController.update(req, res);
        } catch (error) {
            common.sendError(res, error, 500);
        }
    });
}