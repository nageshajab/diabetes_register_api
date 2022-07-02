var logger = require('../logger');
var roleController=require('../controllers/rolesController');
var middleware=require('../middleware');

module.exports = function (app) {
 
    app.post('/roles/list', middleware.validateJwt, function (req, res) {
        try {
            logger.debug('in role list post api route');
            roleController.list(req, res);
        } catch (error) {
            common.sendError(res, error,500);
        }
    });

    app.post('/roles/listByids', middleware.validateJwt, function (req, res) {
        try {
            logger.debug('in role list post api route');
            roleController.listByIds(req, res);
        } catch (error) {
            common.sendError(res, error,500);
        }
    });

    app.post('/roles/get', middleware.validateJwt, function (req, res) {
        logger.debug('101 inside api role get ');
        try {
            roleController.get(req, res);
        } catch (error) {
            common.sendError(res, error,500);
        }
    });

    app.post('/roles/insert', middleware.validateJwt, function (req, res) {
        logger.debug('in role insert route ' + JSON.stringify(req.body));
        try {
            roleController.insert(req, res);
        } catch (error) {
            common.sendError(res, error,500);
        }
    });

    app.post('/roles/delete', middleware.validateJwt, function (req, res) {
        try {
            roleController.delete(req, res);
        } catch (ex) {
            common.sendError(res, ex,500);
        }
    });
    
    app.post('/roles/update', middleware.validateJwt, function (req, res) {
        logger.debug('in role update route ' + JSON.stringify(req.body));
        try {
            roleController.update(req, res);
        } catch (error) {
            common.sendError(res, error,500);
        }
    });
}