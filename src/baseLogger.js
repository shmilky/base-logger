'use strict';

const request = require('simple-server-request');

const {LOG_STORAGE_REST_API_URL, DEBUG_MODE, SERVICE_NAME} = process.env;

function storeInDb (logMessage, logData, logType='error') {
    if (LOG_STORAGE_REST_API_URL) {
        const messageContent = {logMessage, logType};

        if (logData) {
            messageContent.logData = logData;
        }

        const newLogMessage = {
            messageType: logType + '-log',
            source: SERVICE_NAME || 'missing',
            messageContent: messageContent
        };

        request.post(LOG_STORAGE_REST_API_URL, newLogMessage, function (err) {
            err && console.error('Got error while trying to store log - ' + err);
        });
    }
}

function getDataString (data) {
    if (data) {
        if (typeof data === 'object') {
            return ' - ' + JSON.stringify(data);
        }
        else {
            return ' - ' + data.toString();
        }
    }
    else {
        return '';
    }
}

function error (logText, data) {
    console.error(logText + getDataString(data));
    storeInDb(logText, data, 'error');
}

function warning (logText, data) {
    if (DEBUG_MODE && DEBUG_MODE.toUpperCase() !== 'OFF') {
        console.warn(logText + getDataString(data));
    }
}

function log (logText, data) {
    if (DEBUG_MODE && DEBUG_MODE.toUpperCase() !== 'OFF') {
        console.log(logText + getDataString(data));
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

// Factory for query cb that will log all the error locally and return only the error code
function sqlQueryCbFactory (cb) {
    return function (sqlQueryErr, result) {
        if (sqlQueryErr) {
            console.error('Handling query resulted with error:\n' + sqlQueryErr);
            console.trace();
            if (sqlQueryErr.code) {
                sqlQueryErr = sqlQueryErr.code;
            }
        }

        cb(sqlQueryErr, result);
    }
}

module.exports.error = error;
module.exports.warning = warning;
module.exports.log = log;
module.exports.logErrorCb = logErrorCb;
module.exports.logErrorCbFactory = logErrorCbFactory;
module.exports.sqlQueryCbFactory = sqlQueryCbFactory;
