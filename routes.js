const usercontroller = require('./controllers/usercontroller');
const diabeticController = require('./controllers/diabeticController');
const middleware = require('./middleware');
const common = require('./controllers/common');
var logger = require('./logger').logger;

module.exports = function (app) {

    app.get('/',  function (req, res) {
        logger.info('api is up and running....');
        res.send('api is up and running....');
    });

    //user routes - anonymous access
    app.post("/user/generateToken",  function (req, res) {
        logger.info('in api generate token');
        usercontroller.generateToken(req, res);
    });


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
}