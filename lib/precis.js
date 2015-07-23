'use strict';

module.exports = Precis;

function Precis(token) {
    var precis = this;

    var Window = require('./window');
    this.window = new Window();
    this.window.drawDefault();

    this.window.notify('Initializing api connection');
    var Api = require('./api');
    this.api = new Api(token);
    this.api.on('started', function(data) {
        precis.window.notify('HTTP connection successful');
        precis.setupChannels(data.channels);
    });
    this.api.on('connection acknowledged', function() {
        precis.window.notify('Websocket connection successful');
    });
    this.api.on('ready', function() {
        precis.window.notify('API ready');
    });
}

Precis.prototype.setupChannels = function setupChannels(channels) {
    this.channels = {
        all: channels
    };
    this.channels.starred = channels.filter(function(c) {
        return c.is_starred;
    }).sort(channelSorterByName);
    this.channels.joined = channels.filter(function(c) {
        return c.is_member && !c.is_starred;
    }).sort(channelSorterByName);
    this.channels.other = channels.filter(function(c) {
        return !(c.is_member || c.is_starred);
    }).sort(channelSorterByName);
    this.channels.starred.concat(this.channels.joined).concat(this.channels.other).forEach(function(c) {
        this.window.addChannel(c.name);
    }, this);
};

function channelSorterByName(a, b) {
    if (a.name > b.name) {
        return 1;
    } else if (a.name < b.name) {
        return -1;
    }
    return 0;
}

