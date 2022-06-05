'use strict'

const userController = require('./controllers/usercontroller');

exports.validateJwt = function (req, res, next) {
    if (userController.validateToken(req, res))
        next()
}