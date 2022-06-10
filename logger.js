var fs = require('fs');
const path = require('node:path');
const rimraf = require('rimraf');


let date_ob = new Date();

var day = date_ob.getDate();
var month = date_ob.getMonth() + 1;
var year = date_ob.getFullYear();
var hour = date_ob.getHours();
var minutes = date_ob.getMinutes();
var filename = day + '-' + month + '-' + year;

var debugfname = __dirname + '/logs/debug_' + filename + '.log';
var infofname = __dirname + '/logs/info_' + filename + '.log';
var warnfname = __dirname + '/logs/warn_' + filename + '.log';
var errorfname = __dirname + '/logs/error_' + filename + '.log';

exports.debug = function debug(msg) {
    writetoFile(debugfname, `${hour}:${minutes} ${msg} \n`);
}
exports.error = function error(msg) {
    writetoFile(errorfname, `${hour}:${minutes} ${msg} \n`);
}
exports.info = function info(msg) {
    writetoFile(infofname, `${hour}:${minutes} ${msg} \n`);
}

function writetoFile(fname, content) {
    fs.appendFile(fname, content, err => {
        if (err) {
            console.error(err);
        }
        // done!
    });
}


exports.clearLogFiles = function () {
    var uploadsDir = __dirname + '/logs';

    fs.readdir(uploadsDir, function (err, files) {
        files.forEach(function (file, index) {
            fs.stat(path.join(uploadsDir, file), function (err, stat) {
                var endTime, now;
                if (err) {
                    return console.error(err);
                }
                now = new Date().getTime();
                endTime = new Date(stat.ctime).getTime() + 3600000;
                if (now > endTime) {
                    return rimraf(path.join(uploadsDir, file), function (err) {
                        if (err) {
                            return console.error(err);
                        }
                        console.log('successfully deleted');
                    });
                }
            });
        });
    });
}