var logger = require('../logger');
var userController=require('../controllers/usersController');
var middleware=require('../middleware');

module.exports = function (app) {
    //users routes - anonymous access
    app.post("/users/generateToken", function (req, res) {
        logger.info('in api generate token');
        userController.generateToken(req, res);
    });

    app.post('/users/list', middleware.validateJwt, function (req, res) {
        try {
            logger.debug('in user list post api route');
            userController.list(req, res);
        } catch (error) {
            logger.error('in error block of user list route ' + error);
            common.sendError(res, error);
        }
    });

    app.post('/users/listByids', middleware.validateJwt, function (req, res) {
        try {
            logger.debug('in user list post api route');
            userController.listByIds(req, res);
        } catch (error) {
            logger.error('in error block of user list route ' + error);
            common.sendError(res, error);
        }
    });

    app.post('/users/get', middleware.validateJwt, function (req, res) {
        logger.debug('101 inside api user get ');
        try {
            userController.get(req, res);
        } catch (error) {
            logger.error('105 in error of get user route ' + error);
            common.sendError(res, error);
        }
    });

    app.post('/users/insert', middleware.validateJwt, function (req, res) {
        logger.debug('in user insert route ' + JSON.stringify(req.body));
        try {
            userController.insert(req, res);
        } catch (error) {
            logger.error('in error block of user insert route ' + error);
            common.sendError(res, error);
        }
    });

    app.post('/users/delete', middleware.validateJwt, function (req, res) {
        try {
            userController.delete(req, res);
        } catch (ex) {
            logger.error('in error block of user delete route ' + ex);
            common.sendError(res, ex);
        }
    });
    
    app.post('/users/update', middleware.validateJwt, function (req, res) {
        logger.debug('in user update route ' + JSON.stringify(req.body));
        try {
            userController.update(req, res);
        } catch (error) {
            logger.error('in error block of user insert route ' + error);
            common.sendError(res, error);
        }
    });
}