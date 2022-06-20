var logger = require('../logger');
var roleController=require('../controllers/rolesController');
var middleware=require('../middleware');

module.exports = function (app) {
 
    app.post('/role/list', middleware.validateJwt, function (req, res) {
        try {
            logger.debug('in role list post api route');
            roleController.list(req, res);
        } catch (error) {
            logger.error('in error block of role list route ' + error);
            common.sendError(res, error);
        }
    });

    app.post('/role/listByids', middleware.validateJwt, function (req, res) {
        try {
            logger.debug('in role list post api route');
            roleController.listByIds(req, res);
        } catch (error) {
            logger.error('in error block of role list route ' + error);
            common.sendError(res, error);
        }
    });

    app.post('/role/get', middleware.validateJwt, function (req, res) {
        logger.debug('101 inside api role get ');
        try {
            roleController.get(req, res);
        } catch (error) {
            logger.error('105 in error of get role route ' + error);
            common.sendError(res, error);
        }
    });

    app.post('/role/insert', middleware.validateJwt, function (req, res) {
        logger.debug('in role insert route ' + JSON.stringify(req.body));
        try {
            roleController.insert(req, res);
        } catch (error) {
            logger.error('in error block of role insert route ' + error);
            common.sendError(res, error);
        }
    });

    app.post('/role/delete', middleware.validateJwt, function (req, res) {
        try {
            roleController.delete(req, res);
        } catch (ex) {
            logger.error('in error block of role delete route ' + ex);
            common.sendError(res, ex);
        }
    });
    
    app.post('/role/update', middleware.validateJwt, function (req, res) {
        logger.debug('in role update route ' + JSON.stringify(req.body));
        try {
            roleController.update(req, res);
        } catch (error) {
            logger.error('in error block of role insert route ' + error);
            common.sendError(res, error);
        }
    });
}