var logger = require('../logger');
var middleware = require('../middleware');
var common = require('../controllers/common');
var medicineController = require('../controllers/medicineController');

module.exports = function (app) {
    //define routes for watchList
    app.post('/medicine/list', middleware.validateJwt, function (req, res) {
        try {
            logger.debug('in medicine list post api route');
            medicineController.list(req, res);
        } catch (error) {
            common.sendError(res, error,500);
        }
    });

    app.post('/medicine/listByids', middleware.validateJwt, function (req, res) {
        try {
            logger.debug('in medicine list post api route');
            medicineController.listByIds(req, res);
        } catch (error) {
            common.sendError(res, error,500);
        }
    });

    app.post('/medicine/get', middleware.validateJwt, function (req, res) {
        logger.debug('101 inside api medicine get ');
        try {
            medicineController.get(req, res);
        } catch (error) {
            common.sendError(res, error,500);
        }
    });

    app.post('/medicine/insert', middleware.validateJwt, function (req, res) {
        logger.debug('in medicine insert route ' + JSON.stringify(req.body));
        try {
            medicineController.insert(req, res);
        } catch (error) {
            common.sendError(res, error,500);
        }
    });

    app.post('/medicine/delete', middleware.validateJwt, function (req, res) {
        try {
            medicineController.delete(req, res);
        } catch (ex) {
            common.sendError(res, ex,500);
        }
    });
    
    app.post('/medicine/update', middleware.validateJwt, function (req, res) {
        logger.debug('in medicine update route ' + JSON.stringify(req.body));
        try {
            medicineController.update(req, res);
        } catch (error) {
            common.sendError(res, error,500);
        }
    });
}