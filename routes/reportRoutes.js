var logger = require('../logger');
var middleware=require('../middleware');
var common=require('../controllers/common');
var reportController=require('../controllers/reportController');

module.exports=function(app){
      //define routes for watchList
      app.post('/reports/weightlist', middleware.validateJwt, function (req, res) {
        try {
            reportController.weightlist(req, res);
        } catch (error) {
            common.sendError(res, error,500);
        }
    });

    app.post('/reports/bplist', middleware.validateJwt, function (req, res) {
        try {
            reportController.bplist(req, res);
        } catch (error) {
            common.sendError(res, error,500);
        }
    });

    app.post('/reports/bslist', middleware.validateJwt, function (req, res) {
        try {
            reportController.bslist(req, res);
        } catch (error) {
            common.sendError(res, error,500);
        }
    });
}