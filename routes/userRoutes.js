var logger = require('../logger');
var usercontroller=require('../controllers/usercontroller');

module.exports = function (app) {
    //user routes - anonymous access
    app.post("/user/generateToken", function (req, res) {
        logger.info('in api generate token');
        usercontroller.generateToken(req, res);
    });
}