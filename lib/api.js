'use strict';

module.exports = Api;

var util = require('util');
var EventEmitter = require('events').EventEmitter;
util.inherits(Api, EventEmitter);

var request = require('request');
var Ws = require('ws');

Api.URI_START = 'https://slack.com/api/rtm.start';

function Api(token) {
    var api = this;

    if (!token) {
        throw new Error('Api requires a token');
    }
    api.token = token;

    makeRequest(Api.URI_START, {
        token: token
    }, function(err, res) {
        if (err) {
            console.log(err);
            err = new Error('Could not initialize api');
            throw err;
        }
        if (res && res.ok) {
            api.emit('started', res);
        }
    });

    api.on('started', function(data) {
        api.self = data.self;
        getWebsocket(api.wsUri = data.url, function(err, ws) {
            if (err) {
                err = new Error('Could not initialize websockets');
                throw err;
            }
            api.setupWebsocket(ws);
        });
    });

    api.on('connection acknowledged', function() {
        // TODO: all connections are open, last chance to sanitize before starting
        setImmediate(function() {
            api.emit('ready');
        });
    });
}

Api.prototype.setupWebsocket = function setupWebsocket(ws) {
    var api = this;
    api.ws = ws;

    ws.on('message', handleMessage);
    ws.on('error', handleError);

    function handleMessage(msg) {
        try {
            msg = JSON.parse(msg);
        } catch(e) {
            return;
        }
        if (eventHandlers[msg.type]) {
            eventHandlers[msg.type].call(api, msg);
        }
    }

    function handleError(err) {
        console.log('ws error', err);
    }
};

function getWebsocket(uri, cb) {
    if (!uri) {
        throw new Error('Websockets require an URI');
    }

    var ws = new Ws(uri);
    var timeoutOpen = setTimeout(handleTimeout, 10000);
    ws.on('open', handleOpen);

    function handleOpen() {
        clearTimeout(timeoutOpen);
        cb(null, ws);
    };

    function handleTimeout() {
        ws.removeListener('open', handleOpen);
        err = new Error('Websocket connection timed out');
        cb(err);
    }
}

function makeRequest(uri, body, cb) {
    request({
        method: 'POST',
        uri: uri,
        form: body,
        json: true
    }, function(err, res, body) {
        if (err) {
            return cb(err);
        }
        cb(null, body);
    });
}

var eventHandlers = {
    hello: function hello(msg) {
        this.emit('connection acknowledged');
    },
    presence_change: function presence_change(msg) {
    }
};

