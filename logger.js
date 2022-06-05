const {
    transports,
    createLogger,
    format
} = require('winston');

let date_ob = new Date();

var day = date_ob.getDate();
var month = date_ob.getMonth();
var year = date_ob.getFullYear();
var filename = day + '-' + month + '-' + year;

const logConfiguration = {
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        verbose: 4,
        debug: 5,
        silly: 6
      },
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [
        new transports.File({
            filename: __dirname + '/logs/debug_' + filename + '.log',
            json: false,
            level:'debug'
        }),
        new transports.File({
            filename: __dirname + '/logs/info_' + filename + '.log',
            json: false,
            level : 'info'
        }),
        new transports.File({
            filename: __dirname + '/logs/warn_' + filename + '.log',
            json: false,
            level: 'warn'
        }),
    ],
    exceptionHandlers: [
        new transports.File({
            filename: __dirname + '/logs/error_' + filename + '.log',
            json: false,
            level:'error'
        })
    ],
    exitOnError: false
};

exports.logger = createLogger(logConfiguration);