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
        format.timestamp({format:'HH:mm:ss'}),
        format.json()
    ),
    transports: [
        new transports.File({
            filename: __dirname + '/logs/debug_' + filename + '.log',
            json: false,
            level:'debug',
            maxsize:'20m',
            maxFiles:'2d'
        }),
        new transports.File({
            filename: __dirname + '/logs/info_' + filename + '.log',
            json: false,
            level : 'info',
            maxsize:'20m',
            maxFiles:'2d'
        }),
        new transports.File({
            filename: __dirname + '/logs/warn_' + filename + '.log',
            json: false,
            level: 'warn',
            maxsize:'20m',
            maxFiles:'2d'
        }),
    ],
    exceptionHandlers: [
        new transports.File({
            filename: __dirname + '/logs/error_' + filename + '.log',
            json: false,
            level:'error',
            maxsize:'20m',
            maxFiles:'2d'
        })
    ],
    exitOnError: false
};

exports.logger = createLogger(logConfiguration);