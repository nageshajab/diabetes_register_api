'use strict'

const logger=require('../logger');
const jwt = require('jsonwebtoken');

exports.generateToken = function (req, res) {
    logger.info('100 generating token '+JSON.stringify(req.body));
    if (req.body.username !== 'nageshajab' || req.body.password !== 'password1@') {
        logger.info('hard coded username pwd, pls check');
        return res.status(401).json({})
    }

    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    let data = {
        time: Date(),
        userId: 12,
    }

    const token = jwt.sign(data, jwtSecretKey);
    logger.info('token is ' + token);
    res.send(token);
}

exports.validateToken = function (req, res) {
    // Tokens are generally passed in the header of the request
    // Due to security reasons.

    let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
    let jwtSecretKey = process.env.JWT_SECRET_KEY;

    try {
        const token = req.header(tokenHeaderKey);

        const verified = jwt.verify(token, jwtSecretKey);
        if (verified) {
            return true;
        } else {
            // Access Denied
            return res.status(401).send('Invalid security token');
        }
    } catch (error) {
        // Access Denied
        return res.status(401).send(error + 'Invalid security token');
    }
}