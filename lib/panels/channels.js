'use strict';

var blessed = require('blessed');

module.exports = Channels;

function Channels(width, height) {
    this.element = blessed.list({
        width: width,
        height: height,
        shrink: true,
        bg: '#885522',
    });
}

Channels.prototype.getElement = function getElement() {
    return this.element;
};

Channels.prototype.add = function add(name) {
    this.element.addItem(name);
};

