'use strict';

const request = require('simple-server-request');

const {LOG_STORAGE_REST_API_URL, DEBUG_MODE} = process.env;

function storeInDb (logData) {
    if (LOG_STORAGE_REST_API_URL) {
        request.post(LOG_STORAGE_REST_API_URL, logData, function (err) {
            err && console.error('Got error while trying to store log - ' + err);
        });
    }
}

function error (logText) {
    console.error(logText);
    storeInDb(logText);
}

function warning (logText) {
    if (DEBUG_MODE && DEBUG_MODE.toUpperCase() !== 'OFF') {
        console.warn(logText);
    }
}

function log (logText) {
    if (DEBUG_MODE && DEBUG_MODE.toUpperCase() !== 'OFF') {
        console.log(logText);
    }
}

function logErrorCb (err) {
    if (err) {
        error(err);
    }
}

function logErrorCbFactory (cb) {
    return function (err, data) {
        if (err) {
            error(err);
        }

        cb(err, data);
    }
}

module.exports.error = error;
module.exports.warning = warning;
module.exports.log = log;
module.exports.logErrorCb = logErrorCb;
module.exports.logErrorCbFactory = logErrorCbFactory;
