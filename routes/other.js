var logger = require('../logger');

module.exports = function (app) {

    app.get('/', function (req, res) {
        logger.info('api is up and running....');
        res.send('api is up and running....');
    });

}