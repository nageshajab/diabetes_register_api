var logger = require('../logger');
var userController = require('../controllers/usersController');
var middleware = require('../middleware');
var common = require('../controllers/common');

module.exports = function (app) {
    //users routes - anonymous access
    app.post("/users/generateToken", function (req, res) {
        logger.info('in api generate token');
        userController.generateToken(req, res);
    });

    app.post('/users/list', middleware.validateJwt, function (req, res) {
        try {
            logger.debug('in user list post api route');
            userController.list(req, res, function (err, result) {
                if (err) throw err;
                common.sendSuccess(res, result);
            });
        } catch (error) {
            common.sendError(res, error, 500);
        }
    });

    app.post('/users/listByids', middleware.validateJwt, function (req, res) {
        try {
            logger.debug('in user list post api route');
            userController.listByIds(req, res, function (result) {
                common.sendSuccess(res, result);
            });
        } catch (error) {
            common.sendError(res, error, 500);
        }
    });

    app.post('/users/get', middleware.validateJwt, function (req, res) {
        logger.debug('101 inside api user get ');
        try {
            userController.get(req, res);
        } catch (error) {
            common.sendError(res, error, 500);
        }
    });

    app.post('/users/insert', middleware.validateJwt, function (req, res) {
        logger.debug('in user insert route ' + JSON.stringify(req.body));
        try {
            userController.insert(req, res, function (err, data) {
                if (err) throw err;
                common.sendSuccess(res, data);
            });
        } catch (error) {
            common.sendError(res, error, 500);
        }
    });

    app.post('/users/delete', middleware.validateJwt, function (req, res) {
        try {
            userController.delete(req, res);
        } catch (ex) {
            common.sendError(res, ex, 500);
        }
    });

    app.post('/users/update', middleware.validateJwt, function (req, res) {
        logger.debug('in user update route ' + JSON.stringify(req.body));
        try {
            userController.update(req, res);
        } catch (error) {
            common.sendError(res, error, 500);
        }
    });
}