var logger = require('../logger');
var middleware=require('../middleware');
var common=require('../controllers/common');
var diabeticController=require('../controllers/diabeticController');

module.exports=function(app){
      //define routes for watchList
      app.post('/diabetic/list', middleware.validateJwt, function (req, res) {
        try {
            diabeticController.list(req, res);
        } catch (error) {
            logger.error('in error block of watchlist list route ' + error);
            common.sendError(res, error);
        }
    });

    app.post('/diabetic/get',  middleware.validateJwt, function (req, res) {
        logger.debug('101 inside api get ');
        try {
            diabeticController.get(req, res);
        } catch (error) {
            logger.error('105 in error of get route ' + error);
            common.sendError(res, error);
        }
    });

    app.post('/diabetic/insert',  middleware.validateJwt, function (req, res) {
        logger.debug('in diabetic insert route '+JSON.stringify( req.body));
        try {
            diabeticController.insert(req, res);
        } catch (error) {
            logger.error('in error block of watchlist insert route ' + error);
            common.sendError(res, error);
        }
    });

    app.post('/diabetic/delete',  middleware.validateJwt, function (req, res) {
        try {
            diabeticController.delete(req, res);
        } catch (ex) {
            logger.error('in error block of watchlist delete route ' + ex);
            common.sendError(res, ex);
        }
    });

    app.post('/diabetic/update',  middleware.validateJwt, function (req, res) {
        logger.debug('in diabetic update route '+JSON.stringify( req.body));
        try {
            diabeticController.update(req, res);
        } catch (error) {
            logger.error('in error block of diabetic update route ' + error);
            common.sendError(res, error);
        }
    });
}