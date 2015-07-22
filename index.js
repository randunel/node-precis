'use strict';

var token = require('./lib/token.js');
var Api = require('./lib/api.js');
//var Window = require('./lib/window.js');

var api = new Api(token);
api.on('ready', function() {
    // var window = new Window({
    //     self: api.self
    // });
});

