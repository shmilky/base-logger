# messages-consumer
A base logger that logs according to some env vars and also can post error logs into a rest api

DEBUG_MODE - when available and not OFF it'll log warnings and normal logs
LOG_STORAGE_REST_API_URL - the url that will be used to post logs into
SERVICE_NAME - the name of the current service that do the logging

When posting new log messages the data in the body will be:
```
messageType: '${logType}-log',
source: SERVICE_NAME || 'missing',
messageContent: {
    logType: '${logType}',
    logMessage: '${message text}',
    logData: if exists
}
```
