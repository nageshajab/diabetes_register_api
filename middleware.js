'use strict'

const userController = require('./controllers/usersController');

exports.validateJwt = function (req, res, next) {
    if (userController.validateToken(req, res))
        next()
}