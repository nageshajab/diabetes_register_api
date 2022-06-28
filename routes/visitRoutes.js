var logger = require('../logger');
var middleware = require('../middleware');
var common = require('../controllers/common');
var visitController = require('../controllers/visitController');

module.exports = function (app) {
    //define routes for watchList
    app.post('/visit/list', middleware.validateJwt, function (req, res) {
        logger.info('inside visit list get');
        try {
            logger.debug('in visit list route');
             visitController.list(req, res);
        } catch (error) {
            logger.error('in error block of watchlist list route ' + error);
            common.sendError(res, error);
        }
    });

    app.post('/visit/get', middleware.validateJwt, function (req, res) {
        logger.debug('101 inside api get ');
        try {
            visitController.get(req, res);
        } catch (error) {
            logger.error('105 in error of get route ' + error);
            common.sendError(res, error);
        }
    });

    app.post('/visit/insert', middleware.validateJwt, function (req, res) {
        logger.debug('in visit insert route ' + JSON.stringify(req.body));
        try {
            visitController.insert(req, res);
        } catch (error) {
            logger.error('in error block of watchlist insert route ' + error);
            common.sendError(res, error);
        }
    });

    app.post('/visit/delete', middleware.validateJwt, function (req, res) {
        try {
            visitController.delete(req, res);
        } catch (ex) {
            logger.error('in error block of watchlist delete route ' + ex);
            common.sendError(res, ex);
        }
    });

    app.post('/visit/update', middleware.validateJwt, function (req, res) {
        logger.debug('in visit update route ' + JSON.stringify(req.body));
        try {
            visitController.update(req, res);
        } catch (error) {
            logger.error('in error block of visit update route ' + error);
            common.sendError(res, error);
        }
    });
}