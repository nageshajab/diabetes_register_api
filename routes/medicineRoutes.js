var logger = require('../logger');
var middleware=require('../middleware');
var common=require('../controllers/common');
var medicineController=require('../controllers/medicineController');

module.exports=function(app){
      //define routes for watchList
      app.post('/medicine/list', middleware.validateJwt, function (req, res) {
        try {
            logger.debug('in medicine list post api route');
            medicineController.list(req, res);
        } catch (error) {
            logger.error('in error block of medicine list route ' + error);
            common.sendError(res, error);
        }
    });
    app.post('/medicine/get',  middleware.validateJwt, function (req, res) {
        logger.debug('101 inside api medicine get ');
        try {
            medicineController.get(req, res);
        } catch (error) {
            logger.error('105 in error of get medicine route ' + error);
            common.sendError(res, error);
        }
    });
    app.post('/medicine/insert',  middleware.validateJwt, function (req, res) {
        logger.debug('in medicine insert route '+JSON.stringify( req.body));
        try {
            medicineController.insert(req, res);
        } catch (error) {
            logger.error('in error block of medicine insert route ' + error);
            common.sendError(res, error);
        }
    });
    app.post('/medicine/delete',  middleware.validateJwt, function (req, res) {
        try {
            medicineController.delete(req, res);
        } catch (ex) {
            logger.error('in error block of medicine delete route ' + ex);
            common.sendError(res, ex);
        }
    });
}